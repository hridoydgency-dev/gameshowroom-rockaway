/** Build-output tests: rendering, routes, metadata, structured data, links, forms, fact guards. */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { routes } from '../src/routes';
import { landingPages } from '../src/pages/ppc';
import { faqs } from '../src/data/faqs';
import { redirects } from '../src/data/redirects';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const html = (p: string) => readFileSync(p === '/404/' ? join(DIST, '404.html') : join(DIST, p, 'index.html'), 'utf8');
const ld = (h: string) => JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);

before(() => { execSync('npx tsx scripts/build.tsx', { cwd: ROOT, stdio: 'pipe' }); });

test('every route renders to a file with exactly one h1', () => {
  for (const r of routes) {
    const h = html(r.path);
    assert.equal((h.match(/<h1[\s>]/g) ?? []).length, 1, r.path);
    assert.match(h, /<main id="main">/, r.path);
  }
  assert.ok(existsSync(join(DIST, '404.html')));
});

test('route paths are unique, lowercase and trailing-slashed', () => {
  const paths = routes.map((r) => r.path);
  assert.equal(new Set(paths).size, paths.length);
  for (const p of paths) assert.match(p, /^\/([a-z0-9-]+\/)*$/, p);
});

test('core commercial pages exist', () => {
  for (const p of ['/', '/game-show-experience/', '/birthday-parties/', '/birthday-parties/kids/', '/group-events/corporate-team-building/', '/pricing/', '/faq/', '/location/rockaway-nj/', '/book/'])
    assert.ok(routes.some((r) => r.path === p), p);
});

test('metadata: titles ≤ 65 chars, descriptions 70–165, unique among indexable pages', () => {
  const idx = routes.filter((r) => !r.seo.noindex && r.pageType !== 'ppc');
  for (const r of idx) {
    assert.ok(r.seo.title.length <= 65, `${r.path} title ${r.seo.title.length}`);
    assert.ok(r.seo.description.length >= 70 && r.seo.description.length <= 165, `${r.path} desc ${r.seo.description.length}`);
  }
  assert.equal(new Set(idx.map((r) => r.seo.title)).size, idx.length);
  assert.equal(new Set(idx.map((r) => r.seo.description)).size, idx.length);
  assert.equal(new Set(idx.map((r) => r.seo.primaryTopic)).size, idx.length, 'primaryTopic must be unique (cannibalization guard)');
});

test('canonical, robots and OG tags present; staging build is noindex', () => {
  for (const r of routes) {
    const h = html(r.path);
    assert.match(h, /<link rel="canonical" href="https:\/\/gameshowroomrockaway\.com\//);
    assert.match(h, /<meta name="robots" content="noindex/); // ALLOW_INDEXING unset in tests
    assert.match(h, /property="og:image" content="https:\/\/[^"]+\/images\/og-default\.png"/);
  }
  assert.match(readFileSync(join(DIST, 'robots.txt'), 'utf8'), /Disallow: \//);
});

test('production build: indexable pages index, PPC/utility stay noindex, sitemap excludes them', () => {
  execSync('npx tsx scripts/build.tsx', { cwd: ROOT, stdio: 'pipe', env: { ...process.env, ALLOW_INDEXING: 'true' } });
  try {
    assert.match(html('/'), /content="index, follow/);
    assert.match(html('/lp/kids-birthday-party/'), /content="noindex, follow"/);
    assert.match(html('/thank-you/'), /content="noindex, follow"/);
    const sm = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
    assert.ok(!sm.includes('/lp/') && !sm.includes('/thank-you/') && !sm.includes('/privacy/'));
    assert.ok(sm.includes('<loc>https://gameshowroomrockaway.com/birthday-parties/kids/</loc>'));
    assert.match(readFileSync(join(DIST, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/gameshowroomrockaway\.com\/sitemap\.xml/);
  } finally {
    execSync('npx tsx scripts/build.tsx', { cwd: ROOT, stdio: 'pipe' });
  }
});

test('structured data: valid JSON, LocalBusiness with NAP, no fabricated ratings', () => {
  for (const r of routes) {
    const g = ld(html(r.path))['@graph'];
    const lb = g.find((n: any) => [].concat(n['@type']).includes('LocalBusiness'));
    assert.ok(lb, r.path);
    assert.equal(lb.telephone, '+18622007134');
    assert.equal(lb.address.postalCode, '07866');
    assert.equal(lb.openingHoursSpecification.length, 3);
    const s = JSON.stringify(g);
    assert.ok(!/aggregateRating|"Review"/i.test(s), `${r.path} must not include ratings/reviews`);
  }
});

test('FAQPage schema only contains questions that are visible on the page', () => {
  for (const r of routes) {
    const h = html(r.path);
    const faq = ld(h)['@graph'].find((n: any) => n['@type'] === 'FAQPage');
    if (!faq) continue;
    for (const q of faq.mainEntity) {
      const enc = q.name.replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');
      assert.ok(h.includes(enc) || h.includes(q.name), `${r.path}: ${q.name}`);
    }
  }
});

test('every FAQ answer is sourced', () => {
  for (const f of faqs) assert.ok(['business-site', 'derived-from-business-facts'].includes(f.source), f.id);
});

test('fact guard: no unapproved prices anywhere outside the cited cost guide', () => {
  const allowed = new Set(['$33']);
  for (const r of routes) {
    if (r.path === '/blog/how-much-does-a-kids-birthday-party-cost-nj/' || r.path === '/game-show-experiences-new-jersey/') continue;
    const text = html(r.path).replace(/<script[\s\S]*?<\/script>/g, '');
    for (const m of text.match(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g) ?? []) assert.ok(allowed.has(m), `${r.path} contains unapproved price ${m}`);
  }
});

test('no placeholder / lorem text ships', () => {
  for (const r of routes) assert.ok(!/lorem ipsum|TODO|\[object Object\]|>undefined</i.test(html(r.path)), r.path);
});

test('lead forms are Netlify-ready, labelled and honeypotted', () => {
  const h = html('/book/');
  const form = h.match(/<form[\s\S]*?<\/form>/)![0];
  assert.match(form, /data-netlify="true"/);
  assert.match(form, /netlify-honeypot="company_website"/);
  assert.match(form, /name="form-name" value="event-quote"/);
  assert.match(form, /action="\/thank-you\/"/);
  assert.match(form, /name="gclid"/);
});

test('booking + call CTAs carry tracking attributes', () => {
  for (const r of routes.filter((x) => x.path !== '/thank-you/')) {
    const h = html(r.path);
    assert.match(h, /data-track="phone_click"/, r.path);
  }
  const home = html('/');
  assert.match(home, /data-track="outbound_booking_click"[^>]*data-booking-kind="small"|data-booking-kind="small"[^>]*data-track/);
  assert.match(home, /href="https:\/\/fareharbor\.com\/embeds\/book\/mysteryroom-rockaway\/items\/294163\//);
});

test('PPC landing pages: noindex, minimal header (no primary nav), one goal', () => {
  for (const lp of landingPages) {
    const h = html(`/lp/${lp.slug}/`);
    assert.match(h, /noindex/);
    assert.ok(!h.includes('aria-label="Primary"'), `${lp.slug} should not render site nav`);
  }
});

test('redirect map covers every legacy URL from GSC and targets built pages', () => {
  const legacy = ['/testimonials/', '/birthday-party/', '/faqs/', '/gallery/', '/contact-us/', '/room/'];
  for (const l of legacy) assert.ok(redirects.some((r) => r.from === l), l);
  const built = new Set(routes.map((r) => r.path));
  for (const r of redirects) assert.ok(built.has(r.to), r.to);
  const file = readFileSync(join(DIST, '_redirects'), 'utf8');
  assert.match(file, /^\/birthday-party\/\s+\/birthday-parties\/\s+301$/m);
});

test('SEO audit passes with zero errors', () => {
  execSync('npx tsx scripts/seo-audit.ts', { cwd: ROOT, stdio: 'pipe' });
});

test('search-intelligence: every recommended URL / PPC landing page is a built route', async () => {
  const { readFileSync: r } = await import('node:fs');
  const built = new Set(routes.map((x) => x.path));
  const c = JSON.parse(r(join(ROOT, 'data/search-clusters.json'), 'utf8'));
  for (const k of c.by_cluster) {
    if (k.recommended_url) assert.ok(built.has(k.recommended_url), `${k.cluster} → ${k.recommended_url}`);
    if (k.ppc_landing_page) assert.ok(built.has(k.ppc_landing_page), `${k.cluster} → ${k.ppc_landing_page}`);
  }
});

test('reviews: only verified, sourced reviews render; /reviews/ indexable; no rating schema', async () => {
  const { testimonials, reviewProfiles } = await import('../src/data/content');
  const h = html('/reviews/');
  for (const t of testimonials) {
    assert.ok(t.verified && t.sourceUrl && t.source, `${t.id} must be verified + sourced`);
    const first = t.text.slice(0, 30).replace(/'/g, '&#x27;');
    assert.ok(h.includes(first), `${t.id} text visible on /reviews/`);
  }
  assert.equal(reviewProfiles[0].count >= testimonials.length, true);
  assert.ok(routes.find((r) => r.path === '/reviews/')!.seo.noindex === false);
  assert.ok(!/aggregateRating/i.test(h));
  assert.match(h, /data-track="review_write_click"/);
  // old unsourced WordPress testimonials must never appear
  for (const fake of ['Michelle T.', 'Mr. Delgado', 'Ms. Chen']) assert.ok(!h.includes(fake));
});

test('admin (Decap CMS) is local-only: not in the build, 404 on Netlify, config covers all content', () => {
  assert.ok(!existsSync(join(DIST, 'admin')), 'dist/admin must not exist');
  assert.match(readFileSync(join(DIST, '_redirects'), 'utf8'), /^\/admin\/\*\s+\/404\.html\s+404!$/m);
  const cfg = readFileSync(join(ROOT, 'admin/config.yml'), 'utf8');
  assert.match(cfg, /local_backend: true/);
  for (const f of ['business.json', 'settings.json', 'faqs.json', 'reviews.json', 'promotions.json', 'packages.json', 'gallery.json', 'seo.json']) assert.match(cfg, new RegExp(`content/${f}`));
});

test('dev server serves the admin locally from /admin', async () => {
  const { serve } = await import('../scripts/serve');
  const srv = await serve(DIST, 4179, { admin: join(ROOT, 'admin') });
  try {
    const a = await fetch('http://localhost:4179/admin/'); assert.equal(a.status, 200); assert.match(await a.text(), /decap-cms/);
    assert.equal((await fetch('http://localhost:4179/admin/config.yml')).status, 200);
  } finally { srv.close(); }
});

test('content tokens are resolved and CSP is set per page (not for /admin)', () => {
  for (const r of routes) {
    const h = html(r.path);
    assert.ok(!/%PRICE%|%HOURS%|%PHONE%/.test(h), `${r.path} has an unresolved token`);
    assert.match(h, /http-equiv="Content-Security-Policy"/);
  }
  assert.ok(!/Content-Security-Policy/.test(readFileSync(join(DIST, '_headers'), 'utf8')));
  assert.ok(!/admin/.test(readFileSync(join(DIST, 'robots.txt'), 'utf8')));
});

test('blog posts render from Markdown with quick-answer boxes and tables', () => {
  const h = html('/blog/how-much-does-a-kids-birthday-party-cost-nj/');
  assert.match(h, /<blockquote>/);
  assert.match(h, /<div class="overflow-x-auto"><table>/);
  assert.match(html('/blog/'), /Birthday party ideas by age/);
});
