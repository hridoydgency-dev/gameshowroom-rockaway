# QA Report — final master audit (local build, 2026-10-03)

Run everything with `npm run check` (+ `npm run perf`, `npm run screens`).

## Results

| Area | Check | Result |
|---|---|---|
| Build | 29 routes + 404 rendered | ✅ 30 files, ~0.4 s |
| Tests | `npm test` (build output + real Chromium) | ✅ 28/28 pass |
| SEO audit | `npm run seo:audit` | ✅ 0 errors, 1 warning (teen ↔ adult birthday 33% shared boilerplate — package card + form; acceptable) |
| Orphans / broken links / fragments | audit | ✅ none |
| Metadata | unique titles/descriptions/primary topics on indexable pages | ✅ |
| Structured data | JSON parses; LocalBusiness on all pages; FAQ questions visible; no ratings | ✅ structural · ⏳ Google Rich Results Test after deploy |
| Indexing guard | staging = noindex + `Disallow: /`; `ALLOW_INDEXING=true` = index + sitemap | ✅ both modes tested |
| Redirects | 6 legacy URLs (+ variants) 301 to built pages | ✅ tested via local server |
| Mobile | 29 pages × 320/375/390/414/768/1280: no horizontal overflow, no tap targets < 24 px outside text | ✅ (one 320 px overflow on /contact/ found & fixed) |
| Accessibility | skip link first in tab order; one H1; labelled form fields; `<details>` FAQ/menu work by keyboard; visible focus ring; reduced-motion respected; contrast: body 17.1:1, muted 7.6:1, accent text 6.0:1, CTA 11.6:1 | ✅ (low-contrast white-on-pink badge found & fixed). Not run: axe/screen-reader manual pass |
| Performance (lab) | 390×844, 4× CPU, ~1.6 Mbps/150 ms | ✅ LCP 0.38–0.43 s, CLS 0, TBT 0 ms, 2 requests/page |
| Tracking | dataLayer contract incl. consent, view, click, scroll-view, form start/submit, generate_lead dedupe | ✅ in Chromium · ⏳ GTM/GA4/Ads receipt needs IDs |
| Forms | Netlify attributes, honeypot, hidden attribution fields, thank-you redirect | ✅ markup · ⏳ live submission after deploy |
| Content | no lorem/TODO/undefined; prices only $33 except cited cost/comparison guides | ✅ test-enforced |
| Security | no secrets in repo; `.env*` ignored; raw data ignored; security headers in netlify.toml | ✅ |
| Typecheck | `tsc --noEmit` | ⏳ not runnable in sandbox (no `@types/react`); runs after `npm install` |

## Fixed during QA
- Header nav wrapping at 1280 px; PPC header phone wrapping on mobile.
- Consent dialog covering the hero on mobile → compact bar, shown only in opt-in mode.
- Hero illustration pushing CTAs/benefits down on mobile landing pages → hidden < 640 px (kept on homepage).
- Birthday pages near-duplicate (up to 47% overlap) → segment-specific steps, FAQ titles, visit block only on hub.
- Email overflow at 320 px; white-on-pink badge contrast 4.2:1 → 6.3:1.
- Removed unverifiable claims found in copy review (drive-time, "only venue that…", "low-cost", "Route 46", "milestones we see most").

## Outstanding (needs human input)
See `docs/strategy.md → Facts requiring owner confirmation`, plus GitHub/Netlify authorization.
