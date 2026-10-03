# Content Strategy & SEO Roadmap

All new content must be: original, specific, sourced from business facts (`src/data/business.ts`, `faqs.ts`), and tied to a cluster in `data/search-clusters.json`.

## Immediate (launch – week 2): commercial pages ✅ built
Home, game show experience, birthday hub + kids/teen/adult, group hub + corporate + school, pricing, FAQ, location, booking, 5 PPC landing pages.
**Owner inputs to finish:** photos, party package price/inclusions, deposit/cancellation terms, verified reviews.

## Short term (weeks 2–8): supporting pages
| Page | Cluster / evidence |
|---|---|
| ✅ `/game-show-vs-escape-room/` | escape-room local (1,483 GSC impr) |
| ✅ `/game-show-experiences-new-jersey/` | competitor GBGS ($102 PPC), "unique game show new jersey" (151) |
| ✅ `/blog/how-much-does-a-kids-birthday-party-cost-nj/` | price questions; "affordable birthday party places" 20% CTR |
| `/gift-cards/` | FAQ fact; needs purchase URL |
| `/group-events/holiday-parties/` | seasonal shows fact; Q4 corporate demand (create Oct–Nov) |
| Host profiles section on experience page | review theme: host quality drives satisfaction |

## Medium term (months 2–4): local & informational
- ✅ `/things-to-do-rockaway-nj/`; ✅ `/blog/birthday-party-ideas-by-age/`
- Age-specific posts only if GSC shows impressions: "10 year old birthday party ideas" (age 10 = #1 age modifier, 865 impr), "13th birthday party ideas" (593).
- "Rainy day things to do in Morris County with kids" (problem/need intent).
- Bachelor/bachelorette and family-reunion section on group hub (testimonial themes; no page until demand appears).

## Long term (months 4–12): topical authority
- Trivia/game-show culture content that earns links (e.g., "How to host a game show party at home" with a CTA to the real thing).
- School/education resources (trivia packs for teachers) to support field-trip intent.
- Second location page (`src/data/content.ts → locations`) only if a new venue opens; West Nyack stays on its own domain.

## Process
1. Monthly `npm run analyze` with fresh Ads + GSC exports.
2. New cluster with PPC clicks ≥ 20 or GSC impressions ≥ 100 and no page → brief → page module → `routes.ts` → `npm run check`.
3. Existing page with impressions but CTR < 2% at position ≤ 10 → rewrite title/description first.
