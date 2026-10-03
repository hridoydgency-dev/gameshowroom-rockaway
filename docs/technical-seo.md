# Technical SEO & Architecture Decisions

## Stack decision

| Option | Verdict |
|---|---|
| Next.js (preferred in brief) | Not used: this build environment had **no npm registry access** (org egress policy), so Next.js could not be installed, built or tested. Shipping untested framework code was rejected. |
| **Chosen:** React 19 SSR → static HTML + TypeScript + Tailwind CSS v4 + esbuild | Same React/TSX component model and content-as-data approach a Next.js `output: 'export'` site would use, with zero framework JS on the client. Fully built and tested here. |

Migration path: components (`src/components`), data (`src/data`) and page modules are framework-agnostic TSX. Moving to Next.js App Router later = wrap each `RouteDef.render()` in `app/<path>/page.tsx` and map `seo` → `generateMetadata`. No content rewrite needed.

## Rendering & performance

- Every page pre-rendered to `dist/<path>/index.html` (crawlable, no hydration).
- CSS: Tailwind compiled from used classes only (~28 KB min), **inlined** when < 40 KB → no render-blocking request.
- JS: one 4.2 KB deferred file for tracking/consent/forms. Navigation, FAQ accordions and mobile menu work without JS (`<details>`).
- Hero art is inline SVG (no image request, no CLS). Fonts: system stack (no webfont download).
- Lab results (Chromium, 390×844, 4× CPU throttle, ~1.6 Mbps/150 ms): LCP 0.36–0.44 s, CLS 0, TBT 0 ms across 6 key pages (`npm run perf`, `qa-artifacts/perf.json`). Lab ≠ field — confirm with CrUX/PageSpeed after launch.
- Netlify: hashed `/assets/*` cached 1 year immutable; HTML revalidated; Brotli/gzip by CDN.

## Crawl & index controls

| Control | Implementation |
|---|---|
| Canonical | Absolute self-canonical on every page from `SITE_URL` |
| Robots meta | `index, follow, max-image-preview:large` for indexable pages; `noindex, follow` for PPC/utility/legal; **everything noindex unless `ALLOW_INDEXING=true`** (staging safety) |
| X-Robots-Tag | `/lp/*`, `/thank-you/*` (netlify.toml) |
| robots.txt | Generated: production allows all except `/lp/` and `/thank-you/`, lists sitemap; staging disallows all |
| Sitemap | Generated from route registry; only indexable pages; `lastmod` per page |
| Redirects | `src/data/redirects.ts` → `dist/_redirects` (301); test ensures targets exist and no redirect shadows a page |
| 404 | `dist/404.html` with recovery links (served by Netlify with 404 status) |
| URLs | lowercase, hyphenated, trailing slash, no parameters (test-enforced) |
| Headings | exactly one H1 (test), no level skips (audit) |
| Security headers | HSTS, nosniff, frame-options, referrer-policy, permissions-policy, CSP allowing GTM/GA/Ads/Meta/UET |

## Automated checks

`npm run seo:audit` (also in Netlify production build) — titles/descriptions length & uniqueness, canonical, robots, OG/Twitter, lang/viewport, H1 count, heading order, JSON-LD validity & required nodes, no ratings, FAQ visibility, breadcrumbs, placeholder text, thin content, click-to-call presence, img alt, SVG labels, Netlify form wiring & labels, broken internal links & fragments, links to redirects, `_blank` safety, orphans, near-duplicate content (shingle Jaccard), sitemap ↔ routes, robots.txt mode, redirect targets.
