/**
 * Static site generator: React SSR → static HTML (zero framework JS shipped).
 *   1. Compile Tailwind v4 CSS from class candidates found in src/
 *   2. Bundle the tiny client runtime with esbuild
 *   3. Render every route to dist/<path>/index.html with full SEO head + JSON-LD
 *   4. Emit sitemap.xml, robots.txt, _redirects, 404.html, build report
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { compile } from 'tailwindcss';
import { build as esbuild } from 'esbuild';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync, cpSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { routes } from '../src/routes';
import { notFound } from '../src/pages/utility';
import { renderDocument } from '../src/lib/document';
import { redirects } from '../src/data/redirects';
import { config, absUrl } from '../src/lib/config';
import { factsToConfirm } from '../src/data/business';
import { applyTokens } from '../src/lib/content-store';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const require = createRequire(import.meta.url);
const t0 = Date.now();

rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, 'assets'), { recursive: true });
if (existsSync(join(ROOT, 'public'))) cpSync(join(ROOT, 'public'), DIST, { recursive: true });
// Safety net: the admin is local-only (repo /admin folder). Never ship a stray public/admin.
rmSync(join(DIST, 'admin'), { recursive: true, force: true });

const hash = (s: string | Buffer) => createHash('sha256').update(s).digest('hex').slice(0, 10);
const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));

// ---------- 1. CSS ----------
async function buildCss() {
  const candidates = new Set<string>();
  for (const f of walk(join(ROOT, 'src')).filter((f) => /\.(tsx?|ts)$/.test(f))) {
    for (const tok of readFileSync(f, 'utf8').split(/[\s"'`{}()<>,;]+/)) if (tok && tok.length < 120) candidates.add(tok);
  }
  const twDir = dirname(require.resolve('tailwindcss/package.json'));
  const compiler = await compile(readFileSync(join(ROOT, 'src/styles/app.css'), 'utf8'), {
    base: ROOT,
    loadStylesheet: async (id: string, base: string) => {
      const path = id.startsWith('tailwindcss/') ? join(twDir, id.replace('tailwindcss/', '')) : resolve(base, id);
      return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
    },
  });
  const raw = compiler.build([...candidates]);
  const min = await esbuild({ stdin: { contents: raw, loader: 'css' }, write: false, minify: true, target: ['chrome100', 'safari15', 'firefox100'] });
  return min.outputFiles[0].text;
}

// ---------- 2. JS ----------
async function buildJs() {
  const out = await esbuild({
    entryPoints: [join(ROOT, 'src/client/main.ts')], bundle: true, minify: true, write: false,
    format: 'iife', target: ['chrome100', 'safari15', 'firefox100'], legalComments: 'none',
  });
  return out.outputFiles[0].text;
}

const css = await buildCss();
const js = await buildJs();
const cssName = `/assets/app.${hash(css)}.css`;
const jsName = `/assets/app.${hash(js)}.js`;
writeFileSync(join(DIST, cssName), css);
writeFileSync(join(DIST, jsName), js);
// Inline CSS when small enough: removes the only render-blocking request (LCP win).
const INLINE_LIMIT = 40_000;
const assets = { css: cssName, cssInline: css.length <= INLINE_LIMIT ? css : undefined, js: jsName };

// ---------- 3. Pages ----------
const seen = new Set<string>();
const report: { path: string; title: string; bytes: number; noindex: boolean }[] = [];
for (const route of [...routes, notFound]) {
  if (seen.has(route.path)) throw new Error(`Duplicate route ${route.path}`);
  seen.add(route.path);
  const body = renderToStaticMarkup(route.render() as any);
  const html = applyTokens(renderDocument(route, body, assets));
  const file = route.path === '/404/' ? join(DIST, '404.html') : join(DIST, route.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  report.push({ path: route.path, title: route.seo.title, bytes: html.length, noindex: !!route.seo.noindex });
}

// ---------- 4. sitemap / robots / redirects ----------
const indexable = routes.filter((r) => !r.seo.noindex && r.pageType !== 'ppc' && r.path !== '/404/');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
  .map((r) => `  <url><loc>${absUrl(r.path)}</loc><lastmod>${r.lastModified ?? config.buildDate}</lastmod>${r.sitemap ? `<changefreq>${r.sitemap.changefreq}</changefreq><priority>${r.sitemap.priority.toFixed(1)}</priority>` : ''}</url>`)
  .join('\n')}\n</urlset>\n`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
writeFileSync(
  join(DIST, 'robots.txt'),
  config.allowIndexing
    ? `User-agent: *\nAllow: /\nDisallow: /lp/\nDisallow: /thank-you/\n\nSitemap: ${absUrl('/sitemap.xml')}\n`
    : `# Staging build — indexing disabled (set ALLOW_INDEXING=true at launch)\nUser-agent: *\nDisallow: /\n`,
);
// The admin (Decap CMS) is local-only: it is never copied to dist, and /admin returns 404 on Netlify.
writeFileSync(join(DIST, '_redirects'), redirects.map((r) => `${r.from}  ${r.to}  ${r.status}`).join('\n') + '\n/admin  /404.html  404!\n/admin/*  /404.html  404!\n');
// Netlify _headers (read from the publish dir; single source of truth for headers)
writeFileSync(join(DIST, '_headers'), headersFile());

// ---------- 5. Report ----------
const qa = join(ROOT, 'qa-artifacts');
mkdirSync(qa, { recursive: true });
writeFileSync(join(qa, 'build-report.json'), JSON.stringify({
  builtAt: new Date().toISOString(), ms: Date.now() - t0, allowIndexing: config.allowIndexing, context: config.netlifyContext,
  css: { bytes: css.length, inlined: !!assets.cssInline }, js: { bytes: js.length }, pages: report, factsToConfirm,
}, null, 2));
console.log(`Built ${report.length} pages in ${Date.now() - t0}ms · css ${(css.length / 1024).toFixed(1)}KB${assets.cssInline ? ' (inlined)' : ''} · js ${(js.length / 1024).toFixed(1)}KB · indexing ${config.allowIndexing ? 'ON' : 'OFF'}`);

function headersFile() {
  const block = (path: string, h: Record<string, string>) => `${path}\n${Object.entries(h).map(([k, v]) => `  ${k}: ${v}`).join('\n')}\n`;
  return [
    block('/*', {
      'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'SAMEORIGIN', 'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      ...(config.allowIndexing ? {} : { 'X-Robots-Tag': 'noindex, nofollow' }),
    }),
    block('/assets/*', { 'Cache-Control': 'public, max-age=31536000, immutable' }),
    block('/images/*', { 'Cache-Control': 'public, max-age=2592000' }),
    block('/lp/*', { 'X-Robots-Tag': 'noindex, follow' }),
    block('/thank-you/*', { 'X-Robots-Tag': 'noindex, follow' }),
  ].join('\n');
}
