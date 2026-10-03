/**
 * Automated SEO / content QA over the built site (dist/).
 * Fails (exit 1) on errors; prints warnings. Also exports the internal-link graph and
 * page metadata inventory to data/internal-links.json and data/seo-pages.json.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { routes } from '../src/routes';
import { redirects } from '../src/data/redirects';
import { config } from '../src/lib/config';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const errors: string[] = [];
const warnings: string[] = [];
const err = (p: string, m: string) => errors.push(`${p}: ${m}`);
const warn = (p: string, m: string) => warnings.push(`${p}: ${m}`);

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&rsquo;/g, '’').replace(/&ldquo;|&rdquo;/g, '"').replace(/&nbsp;/g, ' ');
const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const metaContent = (html: string, key: string) => {
  const m = html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`));
  return m ? decode(m[1]) : undefined;
};
const visibleText = (html: string) =>
  decode(html.replace(/<head>[\s\S]*?<\/head>/, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const fileFor = (p: string) => (p === '/404/' ? join(DIST, '404.html') : join(DIST, p, 'index.html'));
const pages = routes.map((r) => ({ r, html: readFileSync(fileFor(r.path), 'utf8') }));
const builtPaths = new Set(routes.map((r) => r.path));
const redirectFrom = new Set(redirects.map((r) => r.from));
const ids = new Map(pages.map(({ r, html }) => [r.path, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));

const titles = new Map<string, string>(); const descs = new Map<string, string>(); const topics = new Map<string, string>();
const linkGraph: Record<string, { to: string; anchor: string }[]> = {};
const inventory: object[] = [];
const BAD = [/lorem ipsum/i, /\bTODO\b/, /\bundefined\b/, /\bNaN\b/, /\[object Object\]/, /\bFIXME\b/, /\{\{.*\}\}/];

for (const { r, html } of pages) {
  const p = r.path;
  const indexable = !r.seo.noindex && r.pageType !== 'ppc';
  // --- title / description ---
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  const desc = metaContent(html, 'description') ?? '';
  if (!title) err(p, 'missing <title>');
  if (title.length > 65) warn(p, `title ${title.length} chars (>65): ${title}`);
  if (title.length < 25) warn(p, `title short (${title.length})`);
  if (!desc) err(p, 'missing meta description');
  if (desc.length > 165 || desc.length < 70) warn(p, `meta description ${desc.length} chars`);
  if (indexable) {
    if (titles.has(title)) err(p, `duplicate title with ${titles.get(title)}`); else titles.set(title, p);
    if (descs.has(desc)) err(p, `duplicate description with ${descs.get(desc)}`); else descs.set(desc, p);
    const t = r.seo.primaryTopic.toLowerCase();
    if (topics.has(t)) err(p, `cannibalization: primaryTopic "${t}" also on ${topics.get(t)}`); else topics.set(t, p);
  }
  // --- canonical / robots / social ---
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) err(p, 'missing canonical');
  else if (!canonical.startsWith(config.siteUrl)) err(p, `canonical not on site origin: ${canonical}`);
  else if (!r.seo.canonical && canonical !== config.siteUrl + p) err(p, `canonical mismatch ${canonical}`);
  const robots = metaContent(html, 'robots') ?? '';
  if (!robots) err(p, 'missing meta robots');
  if (config.allowIndexing && indexable && robots.includes('noindex')) err(p, 'indexable page has noindex');
  if ((r.seo.noindex || r.pageType === 'ppc') && !robots.includes('noindex')) err(p, 'should be noindex');
  for (const k of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card']) if (!metaContent(html, k)) err(p, `missing ${k}`);
  if (!/<html lang="en-US">/.test(html)) err(p, 'missing html lang');
  if (!/name="viewport"/.test(html)) err(p, 'missing viewport');
  // --- headings ---
  const body = html.slice(html.indexOf('<body'));
  const h1s = body.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) err(p, `${h1s.length} <h1> elements`);
  const levels = [...body.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) { warn(p, `heading level skip h${levels[i - 1]}→h${levels[i]}`); break; }
  // --- JSON-LD ---
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  let types: string[] = [];
  if (!ld) err(p, 'missing JSON-LD');
  else {
    try {
      const j = JSON.parse(ld);
      const g: any[] = j['@graph'] ?? [];
      types = g.flatMap((n) => (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]));
      if (j['@context'] !== 'https://schema.org') err(p, 'JSON-LD @context');
      if (!types.includes('LocalBusiness')) err(p, 'JSON-LD missing LocalBusiness');
      if (!types.includes('BreadcrumbList')) err(p, 'JSON-LD missing BreadcrumbList');
      if (types.includes('AggregateRating') || ld.includes('aggregateRating') || ld.includes('"Review"')) err(p, 'Review/AggregateRating present without verified data');
      const nodeIds = g.map((n) => n['@id']).filter(Boolean);
      if (new Set(nodeIds).size !== nodeIds.length) err(p, 'duplicate @id in graph');
      for (const n of g.filter((n) => n['@type'] === 'FAQPage')) {
        for (const q of n.mainEntity) {
          if (!visibleText(html).includes(q.name)) err(p, `FAQ schema question not visible on page: "${q.name}"`);
          if (!q.acceptedAnswer?.text) err(p, 'FAQ answer empty');
        }
      }
      for (const n of g.filter((n) => n['@type'] === 'BreadcrumbList')) {
        n.itemListElement.forEach((it: any, i: number) => { if (it.position !== i + 1 || !it.item?.startsWith(config.siteUrl)) err(p, 'breadcrumb item malformed'); });
      }
      for (const n of g.filter((n) => n['@type'] === 'Service')) if (!n.provider) err(p, 'Service without provider');
    } catch (e) { err(p, `JSON-LD parse error ${(e as Error).message}`); }
  }
  // --- content quality ---
  const text = visibleText(html);
  for (const re of BAD) if (re.test(text)) err(p, `forbidden placeholder text ${re}`);
  const words = text.split(' ').length;
  if (indexable && words < 300) warn(p, `thin content (${words} words)`);
  if (!/href="tel:\+1\d{10}"/.test(html)) err(p, 'no click-to-call link');
  if (!/data-track="(click_book_now|outbound_booking_click)"/.test(html) && r.path !== '/thank-you/') warn(p, 'no booking CTA on page');
  // --- images / svg a11y ---
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) if (attr(img, 'alt') === undefined) err(p, `img without alt: ${img.slice(0, 80)}`);
  for (const svg of html.match(/<svg\b[^>]*role="img"[^>]*>/g) ?? []) if (!/aria-labelledby|aria-label/.test(svg)) err(p, 'svg role=img without label');
  // --- forms ---
  for (const form of html.match(/<form\b[\s\S]*?<\/form>/g) ?? []) {
    if (!/data-netlify="true"/.test(form)) err(p, 'form not wired to Netlify Forms');
    if (!/name="form-name"/.test(form)) err(p, 'form missing hidden form-name');
    const inputs = (form.match(/<(input|select|textarea)\b[^>]*>/g) ?? []).filter((i) => !/type="hidden"/.test(i) && !/company_website/.test(i));
    const labels = form.match(/<label\b/g)?.length ?? 0;
    if (labels < inputs.length) err(p, `form has ${inputs.length} fields but ${labels} labels`);
  }
  // --- links ---
  linkGraph[p] = [];
  for (const m of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const tag = m[1]; const href = attr(' ' + tag, 'href') ?? '';
    const anchor = visibleText(m[2]).slice(0, 80);
    if (!href) { err(p, 'anchor without href'); continue; }
    if (/target="_blank"/.test(tag) && !/rel="[^"]*noopener/.test(tag)) err(p, `_blank without noopener ${href}`);
    if (href.startsWith('/') && !href.startsWith('//')) {
      const [pathPart, frag] = href.split('#');
      const target = pathPart || p;
      if (!builtPaths.has(target) && !redirectFrom.has(target) && !existsSync(join(DIST, target))) err(p, `broken internal link ${href}`);
      if (redirectFrom.has(target)) warn(p, `internal link points at a redirect ${href}`);
      if (frag && builtPaths.has(target) && !ids.get(target)!.has(frag)) err(p, `broken fragment ${href}`);
      if (!anchor && !/aria-label/.test(tag)) warn(p, `empty anchor text → ${href}`);
      if (target !== p) linkGraph[p].push({ to: target, anchor });
    } else if (href.startsWith('#')) {
      if (href.length > 1 && !ids.get(p)!.has(href.slice(1))) err(p, `broken in-page fragment ${href}`);
    }
  }
  inventory.push({
    path: p, title, description: desc, canonical, robots, h1: visibleText(body.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? ''),
    primaryTopic: r.seo.primaryTopic, secondaryTopics: r.seo.secondaryTopics ?? [], pageType: r.pageType, template: r.template,
    indexable, schemaTypes: [...new Set(types)], words, trackView: r.trackView ?? null,
  });
}

// --- orphan detection (indexable pages need ≥1 inbound link from another indexable page) ---
const indexablePaths = routes.filter((r) => !r.seo.noindex && r.pageType !== 'ppc').map((r) => r.path);
const inbound: Record<string, Set<string>> = Object.fromEntries(routes.map((r) => [r.path, new Set<string>()]));
for (const [from, links] of Object.entries(linkGraph)) {
  if (!indexablePaths.includes(from)) continue;
  for (const l of links) inbound[l.to]?.add(from);
}
for (const p of indexablePaths) if (p !== '/' && inbound[p].size === 0) err(p, 'ORPHAN: no inbound links from indexable pages');
for (const p of indexablePaths) if (p !== '/' && inbound[p].size < 3) warn(p, `only ${inbound[p].size} inbound internal links`);

// --- duplicate-content heuristic (5-word shingles, Jaccard on main content) ---
const shingles = (s: string) => { const w = s.toLowerCase().split(/\W+/).filter(Boolean); const out = new Set<string>(); for (let i = 0; i + 5 <= w.length; i++) out.add(w.slice(i, i + 5).join(' ')); return out; };
const main = (html: string) => visibleText(html.match(/<main id="main">([\s\S]*?)<\/main>/)?.[1] ?? '');
const sh = pages.filter(({ r }) => indexablePaths.includes(r.path)).map(({ r, html }) => ({ p: r.path, s: shingles(main(html)) }));
for (let i = 0; i < sh.length; i++) for (let j = i + 1; j < sh.length; j++) {
  const a = sh[i].s, b = sh[j].s; let inter = 0; for (const x of a) if (b.has(x)) inter++;
  const jac = inter / (a.size + b.size - inter);
  if (jac > 0.5) err(sh[i].p, `near-duplicate content with ${sh[j].p} (${(jac * 100).toFixed(0)}%)`);
  else if (jac > 0.3) warn(sh[i].p, `content overlap with ${sh[j].p} (${(jac * 100).toFixed(0)}%)`);
}

// --- sitemap / robots / redirects ---
const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(config.siteUrl, ''));
for (const p of indexablePaths) if (!locs.includes(p)) err('sitemap', `missing ${p}`);
for (const l of locs) if (!indexablePaths.includes(l)) err('sitemap', `contains non-indexable ${l}`);
const robotsTxt = readFileSync(join(DIST, 'robots.txt'), 'utf8');
if (config.allowIndexing && !robotsTxt.includes('Sitemap:')) err('robots.txt', 'missing Sitemap line');
if (!config.allowIndexing && !robotsTxt.includes('Disallow: /')) err('robots.txt', 'staging build must disallow');
for (const r of redirects) {
  if (!r.to.endsWith('*') && !builtPaths.has(r.to.split('#')[0])) err('_redirects', `target not built: ${r.to}`);
  if (builtPaths.has(r.from)) err('_redirects', `redirect source shadows a live page ${r.from}`);
}

// --- outputs ---
mkdirSync(join(ROOT, 'qa-artifacts'), { recursive: true });
writeFileSync(join(ROOT, 'qa-artifacts/seo-audit.json'), JSON.stringify({ errors, warnings, pages: inventory.length }, null, 2));
writeFileSync(join(ROOT, 'data/seo-pages.json'), JSON.stringify(inventory, null, 2) + '\n');
writeFileSync(join(ROOT, 'data/internal-links.json'), JSON.stringify({
  generatedBy: 'scripts/seo-audit.ts',
  inboundCounts: Object.fromEntries(indexablePaths.map((p) => [p, inbound[p].size])),
  outbound: Object.fromEntries(Object.entries(linkGraph).filter(([k]) => indexablePaths.includes(k)).map(([k, v]) => [k, [...new Map(v.map((l) => [l.to + '|' + l.anchor, l])).values()]])),
}, null, 2) + '\n');

console.log(`SEO audit: ${inventory.length} pages · ${errors.length} errors · ${warnings.length} warnings`);
if (warnings.length) console.log('\nWARNINGS\n' + warnings.map((w) => '  ⚠ ' + w).join('\n'));
if (errors.length) { console.log('\nERRORS\n' + errors.map((e) => '  ✖ ' + e).join('\n')); process.exit(1); }
