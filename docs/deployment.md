# Deployment (Netlify)

## Settings
- Build command: `npm run build` (production context runs `npm run build && npm run seo:audit`)
- Publish directory: `dist`
- Node: 22 (set in `netlify.toml`)
- Forms: Netlify Forms auto-detects the `event-quote` form in the static HTML. In Site settings → Forms → enable form detection; add an email notification to the events inbox.

## Environment variables (Site settings → Environment variables)
| Var | Value | Notes |
|---|---|---|
| `SITE_URL` | `https://gameshowroomrockaway.com` | canonical origin |
| `ALLOW_INDEXING` | `false` until launch → `true` (production context only) | staging safety switch |
| `PUBLIC_GTM_ID` | `GTM-XXXXXXX` | preferred tag loader |
| `PUBLIC_GA4_ID`, `PUBLIC_GOOGLE_ADS_ID`, `PUBLIC_GOOGLE_ADS_LEAD_LABEL` | optional | only if not using GTM |
| `PUBLIC_META_PIXEL_ID`, `PUBLIC_MS_UET_ID` | optional | loaded only with ad consent |
| `PUBLIC_CONSENT_ADS_DEFAULT` | `granted` (US opt-out) or `denied` (opt-in banner) | legal decision |
| `PUBLIC_GOOGLE_BUSINESS_PROFILE_URL` | GBP link | adds `sameAs` + reviews link |

No secrets are required to build.

## First deploy (two options)
**A. Git-connected (recommended):** push this repo to a private GitHub repo → Netlify → Add new site → Import from Git → pick repo → deploy. Every push deploys; PRs get previews (noindex).
**B. Manual:** `npm ci && npm run build` locally → drag the `dist/` folder onto app.netlify.com/drop (note: Netlify Forms requires a Git or CLI deploy to process form detection reliably; use A for production).

## Launch checklist
1. Owner confirms facts in [strategy.md](strategy.md#facts-requiring-owner-confirmation-blocking-for-launch).
2. Attach custom domain; enable HTTPS; uncomment the www→apex redirect in `netlify.toml`.
3. Set `ALLOW_INDEXING=true` for **production** only; redeploy; check `/robots.txt` lists the sitemap and pages say `index, follow`.
4. GSC: submit `/sitemap.xml`; URL-inspect `/`, `/birthday-parties/`, `/birthday-parties/kids/`; validate legacy 301s (`/birthday-party/`, `/faqs/`, `/testimonials/`, `/room/`, `/gallery/`, `/contact-us/`).
5. Rich Results Test on `/`, `/birthday-parties/`, `/blog/...` posts.
6. GTM preview: verify events in [analytics.md](analytics.md); submit a test quote → check Netlify Forms + `generate_lead`.
7. Google Ads: update final URLs to `/lp/*` pages per [ppc-strategy.md](ppc-strategy.md#5-recommended-account-structure); add negatives.
8. Monitor Netlify 404 log & GSC Coverage for 4 weeks.
