# Game Show Room Rockaway — website & search acquisition system

Data-driven, PPC-first, SEO/AEO-optimized static website for **Game Show Room, Rockaway Townsquare, Rockaway NJ** (live game show, birthday parties, group & corporate events). Built from 8 months of Google Ads search-term data, Google Search Console data, competitor and review research.

> ⚠️ Keep this repository **private**: `data/search-intelligence.json` contains aggregated campaign cost data. Raw exports live in git-ignored `data-private/`.

## Tech stack
| Layer | Choice | Why |
|---|---|---|
| Components | React 19 + TypeScript (TSX) | reusable, typed components & content models |
| Rendering | React SSR → static HTML (`scripts/build.tsx`) | crawlable HTML, zero hydration JS, Netlify-native |
| Styling | Tailwind CSS v4 (design tokens in `src/styles/app.css`) | small purged CSS, inlined in `<head>` |
| Client JS | one ~4 KB esbuild bundle (`src/client/main.ts`) | tracking, consent, forms only |
| Forms | Netlify Forms | no backend, spam honeypot |
| Booking | FareHarbor (outbound links) | existing system |
| Tests | `node:test` + Playwright/Chromium | build, SEO, schema, tracking, mobile |

Next.js was the preferred direction; it could not be installed in the build sandbox (no npm registry access), so the same component/data architecture was implemented on React SSR. See `docs/technical-seo.md` for the migration path.

## Project structure
```
src/
  data/        business.ts (NAP & facts — single source of truth), faqs.ts, content.ts
               (experiences, packages, locations, testimonials, promotions), navigation.ts, redirects.ts
  components/  ui.tsx (buttons, cards, chips), sections.tsx (hero, FAQ, forms, CTA…), Layout.tsx, StageArt.tsx
  pages/       one module per page family; each exports RouteDef objects (path, seo, schema, render)
  lib/         schema.ts (JSON-LD), document.ts (<head>), config.ts (env), types.ts
  client/      main.ts (dataLayer, consent, attribution, forms)
  routes.ts    route registry
scripts/       build.tsx, seo-audit.ts, perf.ts, screens.ts, content-map.ts, serve.ts, analysis/analyze.py
tests/         build.test.ts, tracking.test.ts
data/          search-intelligence.json, search-clusters.json, competitors.json, content-map.json,
               internal-links.json, seo-pages.json
docs/          strategy, seo-strategy, ppc-strategy, competitor-analysis, search-intent,
               content-strategy, technical-seo, analytics, deployment, qa
```

## Install & develop
```bash
npm install
npm run build          # → dist/
npm run preview        # serve dist/ (or: npx tsx scripts/serve.ts)
npm run check          # build + SEO audit + content map + all tests (pre-deploy gate)
npm run seo:audit      # SEO/content QA only
npm run perf           # throttled mobile lab CWV
npm run screens -- / /birthday-parties/   # screenshots at 320/375/390/414/768/1280
npm run analyze        # re-run search intelligence (needs exports in data-private/)
```
Playwright tests need Chromium: `npx playwright install chromium` locally.

## Environment variables
See `.env.example` and `docs/deployment.md`. Key ones: `SITE_URL`, `ALLOW_INDEXING` (false until launch), `PUBLIC_GTM_ID`, consent defaults. No secrets are needed.

## Content management
A WordPress-style admin (Decap CMS) runs **locally only** at `http://localhost:4173/admin/` via `start-local-dev.bat` / `npm run dev` + `npx decap-server`. It is never deployed. See `docs/admin.md`.

- **Business facts** (phone, hours, price, ages): edit `src/data/business.ts` only — every page, schema and FAQ reads from it. Never add a fact the owner hasn't published/confirmed.
- **FAQ:** add to `src/data/faqs.ts` with `topics` (pages pull by topic) and `source`.
- **Testimonials:** add to `content.ts → testimonials` with `source`, `sourceUrl`, `verified: true`. `/reviews/` becomes indexable at 3 verified reviews. No AggregateRating is emitted.
- **Promotions:** add to `content.ts → promotions` with dates + page paths; banner shows automatically in range.
- **Party packages / games:** `content.ts → birthdayPackages`, `experiences`.

### Add a page
1. Create/extend a module in `src/pages/` exporting a `RouteDef` (path, `seo` with a **unique** `primaryTopic`, `breadcrumb`, `schema`, `render`).
2. Register it in `src/routes.ts`.
3. Link to it from at least one indexable page (the audit fails on orphans).
4. `npm run check`.

### Add a PPC landing page
Add an object to `landingPages` in `src/pages/ppc.tsx` (slug, ad groups, H1, goal `book|quote`, FAQs). It is noindex and excluded from the sitemap automatically.

### Add a location / service
Location: add to `content.ts → locations` and create a page module modelled on `info.tsx → location` (unique local info only — no doorway pages). Service: add to `experiences`, create a page with `service()` schema, add to `navigation.ts`.

## SEO architecture
Per-page metadata + canonical + robots, generated sitemap/robots, 301 map, JSON-LD entity graph (LocalBusiness/EntertainmentBusiness ↔ Services ↔ WebPages ↔ Breadcrumbs ↔ FAQPage), internal-link graph with orphan detection. Details: `docs/seo-strategy.md`, `docs/technical-seo.md`.

## Analytics architecture
Consent Mode v2 defaults → GTM → dataLayer events (`generate_lead`, `phone_click`, `outbound_booking_click`, `begin_booking`, `pricing_view`, …). Event dictionary and the fix for the current 0-conversion problem: `docs/analytics.md`.

## Deployment
Netlify: build `npm run build`, publish `dist`. See `docs/deployment.md` for the launch checklist.
