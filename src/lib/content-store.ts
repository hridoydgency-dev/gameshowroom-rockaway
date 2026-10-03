/**
 * Content store: reads the editable files in /content (managed through /admin, Decap CMS)
 * and validates them. Any problem throws → the build fails → Netlify keeps the previous
 * version live, so a bad edit in the admin can never take the site down.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../..');
export const CONTENT_DIR = join(ROOT, 'content');

const problems: string[] = [];
const need = (cond: unknown, msg: string) => { if (!cond) problems.push(msg); };

export function readJson<T = any>(file: string): T {
  const p = join(CONTENT_DIR, file);
  try { return JSON.parse(readFileSync(p, 'utf8')) as T; }
  catch (e) { throw new Error(`content/${file} could not be read: ${(e as Error).message}`); }
}

export interface BusinessContent {
  name: string; tagline: string; description: string;
  phone: { display: string; e164: string }; email: string;
  address: { street: string; venue: string; city: string; region: string; regionName: string; postalCode: string; country: string; county: string };
  hours: { days: string[]; label: string; opens: string; closes: string }[];
  pricePerGuestFrom: number;
  booking: { provider: string; smallGroupUrl: string; largeGroupUrl: string };
  mapsUrl: string; googleBusinessProfileUrl?: string; nearbyAreas: string[];
}
export interface SettingsContent {
  announcement: { enabled: boolean; text?: string; link?: string };
  homeHero: { title: string; lead: string };
  gtmId?: string;
}

export const businessContent = readJson<BusinessContent>('business.json');
export const settingsContent = readJson<SettingsContent>('settings.json');
export const faqContent = readJson<{ faqs: any[] }>('faqs.json').faqs ?? [];
export const reviewContent = readJson<{ profile: any; reviews: any[] }>('reviews.json');
export const promotionContent = readJson<{ promotions: any[] }>('promotions.json').promotions ?? [];
export const packageContent = readJson<{ packages: any[] }>('packages.json').packages ?? [];
export const galleryContent = (existsSync(join(CONTENT_DIR, 'gallery.json')) ? readJson<{ photos: any[] }>('gallery.json').photos : []) ?? [];
export const seoContent = readJson<{ pages: { path: string; title: string; description: string }[] }>('seo.json').pages ?? [];

export function blogFiles() {
  const dir = join(CONTENT_DIR, 'blog');
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')).sort().map((f) => ({ slug: f.replace(/\.md$/, ''), raw: readFileSync(join(dir, f), 'utf8') })) : [];
}

/* ---------------- validation ---------------- */
const b = businessContent;
need(b.name?.trim(), 'Business name is empty');
need(/^\+1\d{10}$/.test(b.phone?.e164 ?? ''), `Phone (tap-to-call) must be +1 and 10 digits, got "${b.phone?.e164}"`);
need(b.phone?.display?.trim(), 'Phone (shown on site) is empty');
need(/^\S+@\S+\.\S+$/.test(b.email ?? ''), `Email looks wrong: "${b.email}"`);
need(/^\d{5}$/.test(b.address?.postalCode ?? ''), `ZIP must be 5 digits, got "${b.address?.postalCode}"`);
need(Array.isArray(b.hours) && b.hours.length > 0, 'Opening hours are empty');
for (const h of b.hours ?? []) {
  need(/^([01]\d|2[0-3]):[0-5]\d$/.test(h.opens) && /^([01]\d|2[0-3]):[0-5]\d$/.test(h.closes), `Hours "${h.label}" must use HH:MM (24h)`);
  need(h.days?.length, `Hours "${h.label}" has no days selected`);
}
need(Number.isFinite(b.pricePerGuestFrom) && b.pricePerGuestFrom > 0, 'Price per guest must be a positive number');
need(/^https:\/\//.test(b.booking?.smallGroupUrl ?? '') && /^https:\/\//.test(b.booking?.largeGroupUrl ?? ''), 'Booking links must start with https://');

const ids = new Set<string>();
for (const f of faqContent) {
  need(f.id && /^[a-z0-9-]+$/.test(f.id), `FAQ id "${f.id}" must be lowercase letters, numbers and dashes`);
  need(!ids.has(f.id), `Duplicate FAQ id "${f.id}"`); ids.add(f.id);
  need(f.q?.trim() && f.a?.trim(), `FAQ "${f.id}" needs a question and an answer`);
  need(Array.isArray(f.topics) && f.topics.length, `FAQ "${f.id}" must be shown on at least one topic`);
}
const rp = reviewContent.profile;
need(rp && rp.rating >= 1 && rp.rating <= 5 && rp.count >= 0, 'Google rating must be 1–5 and review count ≥ 0');
for (const r of reviewContent.reviews ?? []) {
  need(r.id && r.author && r.text, `A review is missing id, name or text (${r.id ?? '?'})`);
  if (r.verified) need(/^https:\/\//.test(r.sourceUrl ?? ''), `Verified review "${r.id}" needs a link to its source`);
}
for (const p of promotionContent) {
  need(p.title && p.startDate && p.endDate, `Promotion "${p.id}" needs a headline, start and end date`);
  need(new Date(p.startDate) <= new Date(p.endDate), `Promotion "${p.id}" ends before it starts`);
}
for (const g of galleryContent) need(g.image && g.alt?.trim(), 'Every photo needs an image and a description (alt text)');
for (const s of seoContent) {
  need(s.path?.startsWith('/') && s.path.endsWith('/'), `SEO entry has an invalid path "${s.path}"`);
  need(s.title?.trim() && s.description?.trim(), `SEO entry ${s.path} needs a title and a description`);
}
const gtm = settingsContent.gtmId?.trim();
need(!gtm || /^GTM-[A-Z0-9]+$/.test(gtm), `GTM ID must look like GTM-XXXXXXX, got "${gtm}"`);

if (problems.length) {
  throw new Error('Content check failed — fix these in /admin (the live site is unchanged):\n  • ' + problems.join('\n  • '));
}

/** Tokens editors can use in any text field; replaced in the final HTML. */
const fmt = (t: string) => { const [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'pm' : 'am'; const hh = h % 12 || 12; return m ? `${hh}:${String(m).padStart(2, '0')}${ap}` : `${hh}${ap}`; };
export const tokens: Record<string, string> = {
  '%PRICE%': String(b.pricePerGuestFrom),
  '%PHONE%': b.phone.display,
  '%HOURS%': b.hours.map((h) => `${h.label} ${fmt(h.opens)}–${fmt(h.closes)}`).join(', '),
};
export const applyTokens = (s: string) => Object.entries(tokens).reduce((acc, [k, v]) => acc.split(k).join(v), s);
