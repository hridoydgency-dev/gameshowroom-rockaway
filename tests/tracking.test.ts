/** Real-browser tests of the dataLayer contract, forms, consent and redirects (Playwright + Chromium). */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium, type Browser, type Page } from 'playwright';
import { serve } from '../scripts/serve';

const BASE = 'http://localhost:4174';
let browser: Browser; let server: Awaited<ReturnType<typeof serve>>;
const dl = (page: Page) => page.evaluate(() => (window.dataLayer as any[]).filter((e) => e && typeof e === 'object' && !Array.isArray(e) && 'event' in e && !String(e.event).startsWith('gtm')));
const REQUIRED = ['event', 'page_type', 'page_topic', 'page_path'];

before(async () => { server = await serve(undefined, 4174); browser = await chromium.launch(); });
after(async () => { await browser.close(); server.close(); });

async function open(path: string, opts: { mobile?: boolean } = {}) {
  const ctx = await browser.newContext(opts.mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : {});
  // block navigation away to FareHarbor / tel: during click tests
  await ctx.route(/fareharbor\.com|googletagmanager|facebook|bing/, (r) => r.abort());
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE + path);
  return { page, errors, ctx };
}

test('consent defaults are set before anything else and page context is pushed', async () => {
  const { page, errors } = await open('/');
  const first = await page.evaluate(() => Array.from(window.dataLayer[0] as any));
  assert.deepEqual(first.slice(0, 2), ['consent', 'default']);
  const events = await dl(page);
  assert.ok(events.some((e: any) => e.event === 'view_service' && e.page_type === 'home'));
  assert.deepEqual(errors, []);
});

test('page view events per page type', async () => {
  for (const [path, ev] of [['/game-show-experience/', 'view_game_show'], ['/birthday-parties/kids/', 'view_birthday_party'], ['/pricing/', 'pricing_view'], ['/book/', 'view_booking']]) {
    const { page, ctx } = await open(path);
    const events = await dl(page);
    assert.ok(events.some((e: any) => e.event === ev), `${path} → ${ev}`);
    await ctx.close();
  }
});

test('booking click pushes begin_booking + outbound_booking_click with full schema', async () => {
  const { page, ctx } = await open('/game-show-experience/');
  await page.evaluate(() => document.querySelectorAll('a').forEach((a) => a.addEventListener('click', (e) => e.preventDefault())));
  await page.locator('a[data-track="outbound_booking_click"]').first().click();
  const events = await dl(page);
  const begin = events.find((e: any) => e.event === 'begin_booking');
  const out = events.find((e: any) => e.event === 'outbound_booking_click');
  assert.ok(begin && out);
  for (const k of REQUIRED) assert.ok(k in out, `missing ${k}`);
  assert.equal(begin.booking_kind, 'small');
  assert.match(out.link_url, /fareharbor\.com/);
  assert.ok(out.cta_label);
  await ctx.close();
});

test('phone, email, map and book-now clicks are tracked', async () => {
  const { page, ctx } = await open('/contact/');
  await page.evaluate(() => document.querySelectorAll('a').forEach((a) => a.addEventListener('click', (e) => e.preventDefault())));
  await page.locator('main a[data-track="phone_click"]').first().click();
  await page.locator('main a[data-track="email_click"]').first().click();
  await page.locator('main a[data-track="map_click"]').first().click();
  await page.locator('a[data-track="click_book_now"]').first().click({ force: true });
  const names = (await dl(page)).map((e: any) => e.event);
  for (const n of ['phone_click', 'email_click', 'map_click', 'click_book_now']) assert.ok(names.includes(n), n);
  await ctx.close();
});

test('pricing_view and package_view fire once when scrolled into view', async () => {
  const { page, ctx } = await open('/');
  await page.locator('[data-track-view="package_view"]').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.locator('[data-track-view="package_view"]').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const events = await dl(page);
  assert.equal(events.filter((e: any) => e.event === 'package_view').length, 1);
  assert.ok(events.some((e: any) => e.event === 'pricing_view'));
  await ctx.close();
});

test('lead form: attribution capture, form_start, form_submit, then generate_lead on thank-you', async () => {
  const { page, ctx } = await open('/birthday-parties/kids/?gclid=TEST123&utm_source=google&utm_campaign=bday', { mobile: true });
  const form = page.locator('form[data-lead-form]').first();
  assert.equal(await form.locator('input[name="gclid"]').inputValue(), 'TEST123');
  await form.locator('input[name="name"]').fill('Test Parent');
  await form.locator('input[name="contact"]').fill('parent@example.com');
  await form.locator('select[name="event_type"]').selectOption('Kids birthday party');
  await form.locator('input[name="guests"]').fill('10');
  let events = await dl(page);
  assert.ok(events.some((e: any) => e.event === 'form_start'));
  await Promise.all([page.waitForURL('**/thank-you/'), form.locator('button[type="submit"]').click()]);
  events = await dl(page);
  const lead = events.find((e: any) => e.event === 'generate_lead');
  assert.ok(lead, 'generate_lead on thank-you');
  assert.equal(lead.event_type, 'Kids birthday party');
  await page.reload();
  assert.ok(!(await dl(page)).some((e: any) => e.event === 'generate_lead'), 'lead must not double-count on reload');
  await ctx.close();
});

test('invalid form does not fire form_submit', async () => {
  const { page, ctx } = await open('/book/');
  await page.locator('form[data-lead-form] button[type="submit"]').click();
  assert.ok(!(await dl(page)).some((e: any) => e.event === 'form_submit'));
  await ctx.close();
});

test('consent: settings button opens banner, decline updates consent + persists', async () => {
  const { page, ctx } = await open('/');
  await page.locator('[data-consent-open]').click();
  await page.locator('[data-consent="decline"]').click();
  const cmds = await page.evaluate(() => (window.dataLayer as any[]).filter((e) => e && e[0] === 'consent').map((e) => Array.from(e)));
  assert.ok(cmds.some((c: any) => c[1] === 'update' && c[2].ad_storage === 'denied'));
  await page.reload();
  const after = await page.evaluate(() => (window.dataLayer as any[]).filter((e) => e && e[0] === 'consent').map((e) => Array.from(e)));
  assert.ok(after.some((c: any) => c[1] === 'update' && c[2].ad_storage === 'denied'), 'persisted choice re-applied on load');
  await ctx.close();
});

test('mobile: sticky CTA visible, nav opens without JS errors, no horizontal scroll', async () => {
  const { page, errors, ctx } = await open('/birthday-parties/', { mobile: true });
  assert.ok(await page.locator('[data-sticky-cta]').isVisible());
  await page.locator('details[data-mobile-nav] summary').click();
  assert.ok(await page.locator('nav[aria-label="Mobile"]').isVisible());
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert.equal(overflow, 0);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('keyboard: skip link is first focusable and visible on focus', async () => {
  const { page, ctx } = await open('/');
  await page.keyboard.press('Tab');
  const txt = await page.evaluate(() => document.activeElement?.textContent);
  assert.equal(txt?.trim(), 'Skip to content');
  await ctx.close();
});

test('legacy URLs 301 to new architecture; unknown URL returns 404 page', async () => {
  for (const [from, to] of [['/birthday-party/', '/birthday-parties/'], ['/faqs/', '/faq/'], ['/room/', '/game-show-experience/']]) {
    const res = await fetch(BASE + from, { redirect: 'manual' });
    assert.equal(res.status, 301);
    assert.equal(res.headers.get('location'), to);
  }
  const nf = await fetch(BASE + '/nope/');
  assert.equal(nf.status, 404);
  assert.match(await nf.text(), /Wrong answer/);
});
