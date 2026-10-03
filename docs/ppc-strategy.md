# PPC Search Intelligence Report & Landing-Page Strategy

Source: Google Ads search-term reports, **Feb 1 – Sep 30 2026** (8 months — the export header, not 6 as briefed).
Engine: `scripts/analysis/analyze.py` → `data/search-intelligence.json`, `data/search-clusters.json`.

## 1. Headline findings

| Campaign | Clicks | Cost | Impr. | CTR | Avg CPC | Conversions |
|---|---|---|---|---|---|---|
| Birthday Party | 3,035 | $4,226.32 | 65,496 | 4.63% | $1.39 | **0** |
| Game Show | 251 | $266.69 | 1,706 | 14.71% | $1.06 | **0** |
| **Total** | **3,286** | **$4,493.01** | 67,202 | | | **0** |

1. **Conversion tracking is broken, not demand.** 3,286 paid clicks and zero recorded conversions (and zero conversion value) across 8 months is statistically implausible for a business that takes online bookings. Most likely cause: bookings complete on `fareharbor.com` and no conversion is sent back to Google Ads (no FareHarbor ↔ Google Ads/GA4 integration, no cross-domain tag, no thank-you trigger). **Until this is fixed, Smart Bidding is optimizing blind and no term can be called "non-converting".** Fix list in [analytics.md](analytics.md#fixing-the-zero-conversion-problem).
2. **~51% of birthday spend is invisible** ("Other search terms": 1,549 clicks / $2,158.39). Only the visible half can be classified.
3. **The birthday campaign is mostly buying research, not bookings.** Search terms containing "ideas" cost **$654 (32% of visible birthday spend)**; adult/milestone terms ("70th birthday ideas", "40th birthday ideas") cost **~$287**; toddler/1st-birthday terms (product is 6+) ~$15. The largest-spend keywords are broad research phrases: `"birthday party ideas"` ($147.62), `"options for birthday party"` ($109.72), `"birthday activities for adults"` ($98.50).
4. **"Near me" is the money modifier.** Terms with "near me" = $599, 443 clicks, 8,911 impressions. The top two terms by spend are `kids birthday party places near me` ($63.93, 48 clicks) and `birthday party places near me` ($40.60, 31 clicks). Both also appear in GSC at positions 1–5 → highest-value overlap.
5. **Game-show spend leaks to a competitor brand.** Great Big Game Show / American Dream queries: ~68 variants, 816 impressions, 71 clicks, **$101.69 = 38% of visible game-show spend**. High CTR (8.7%) because the ad looks relevant — but the searcher wants a venue 30+ miles away in East Rutherford.
6. **Brand is the best performer.** `game show room rockaway nj`: 32 clicks, 28.8% CTR, $0.79 CPC. `game show room`: 38% CTR. Cheap, high-intent — protect with exact match.
7. **Age signal:** age modifiers in queries peak at **10, 13, 11, 12, 8, 6, 9, 7** (kids/tweens) and **40, 50, 30, 60** (adult milestones). The product's 6+ minimum age fits the kid peak; adult milestones are real but research-heavy.
8. **Geography:** "rockaway" appears in 2,360 impressions of queries; "wayne" 121; "morris county" 77; "randolph" 43. Not enough town-level demand to justify town pages (no doorway pages built).

## 2. Search themes (visible PPC + GSC, by cluster)

See `data/search-clusters.json` for the full rollup. Top PPC clusters by spend:

| Cluster | PPC cost | PPC clicks | CTR | Landing page |
|---|---|---|---|---|
| birthday-venue:kids | $547.60 | 398 | 4.9% | `/lp/kids-birthday-party/` (paid) · `/birthday-parties/kids/` (organic) |
| birthday-venue:general | $457.26 | 334 | 3.7% | `/lp/birthday-party/` · `/birthday-parties/` |
| birthday-ideas:adult | $233.71 | 162 | 5.9% | negative / organic via `/birthday-parties/adult/` |
| birthday-ideas:kids | $229.73 | 167 | 5.0% | negative / organic via blog |
| birthday-ideas:general | $146.21 | 103 | 3.9% | negative / organic via blog |
| birthday-ideas:teen | $141.88 | 102 | 5.5% | test as separate low-bid ad group |
| competitor: Great Big Game Show | $101.69 | 71 | 8.7% | `/lp/game-show-experience/` or exclude |
| birthday-venue:teen | $88.70 | 63 | 5.2% | `/lp/birthday-party/` · `/birthday-parties/teen-and-sweet-16/` |
| birthday-venue:adult | $67.61 | 51 | 5.6% | `/lp/birthday-party/` · `/birthday-parties/adult/` |
| birthday-venue:indoor | $45.25 | 32 | 5.2% | `/lp/kids-birthday-party/` |
| brand:game-show-room | $37.77 | 42 | 28.0% | `/lp/game-show-room/` |

## 3. Classification

- **High-value (by intent, since conversions are untracked):** brand terms; `kids birthday party places near me`; `birthday party places near me`; `kids birthday party venue(s) near me`; `game show birthday party` (6 clicks / 18 impr = 33% CTR); `indoor birthday party places nj`; `game room birthday party`; `party room near me`.
- **High-click / unknown-conversion:** all of the above — re-evaluate after tracking is fixed (min. 30 days of data).
- **High-impression / low-CTR:** `kids empire near me` (258 impr, 2.3%), `kids birthday party` (173, 1.7%), `sky zone birthday party` (128, 0.8%), `birthday party venues near me` (104, 1.9%). Competitor-brand and very broad head terms; ad relevance is weak because the ad can't credibly be "Kids Empire" or "Sky Zone".
- **High-CTR / low-volume (dedicated LP or exact match):** `game show birthday party`, `teen birthday party ideas near me` (22.7%), `kids birthday party venue near me` (25%), `birthday party places near me for kids` (20%), `affordable birthday party places` (20%).
- **Expensive research terms (review, not auto-negate):** `birthday party ideas` ($20.71), `adult birthday party ideas` ($18.14), `13th birthday party ideas` ($9.44), `70th birthday ideas` ($7.93). Some "ideas" searchers do book a venue; the fix is structural (separate ad group, low bid, blog LP) rather than blanket exclusion.

## 4. Negative-keyword candidates (review list)

Visible spend on low-commercial-intent terms (score ≤ 30): **$759.09**. Full list: `search-clusters.json → negative_candidates`.

| Add as negative (phrase) | Why |
|---|---|
| `70th`, `80th`, `60th birthday ideas` (and "ideas for mom/dad/husband/wife") | Gift/idea research; low venue intent |
| `1st birthday`, `first birthday`, `toddler`, `baby`, `2 year old`…`5 year old` | Product is ages 6+ |
| `theme`, `decorations`, `cake ideas`, `invitations`, `games to play at home` | DIY research |
| `nyc`, `new york`, `times square`, `palisades`, `west nyack`, `oak brook`, `new mexico` | Out of area (West Nyack has its own site) |
| `tv`, `to watch`, `snl`, `saturday night live`, `daytime game shows`, `videogame` | TV-viewing intent |
| `jobs`, `host jobs`, `groupon` (test) | Non-buyer intent |
| Competitor brands for kids active-play (`kids empire`, `sky zone`, `urban air`, `funplex`) | Weak ad relevance; consider a separate, capped "competitor" ad group instead of the core group |

Decision on **Great Big Game Show / American Dream** terms: either (a) move to a capped competitor ad group pointing to `/lp/game-show-experience/` with copy "Private live game show in Morris County — from $33, no seat buyouts", or (b) negate. Recommend (a) for 30 days **after** conversion tracking works, then decide on data.

## 5. Recommended account structure

| Campaign | Ad groups (match) | Final URL |
|---|---|---|
| Brand | `game show room rockaway` / `game show room` / `the game show room` (exact + phrase) | `/lp/game-show-room/` |
| Game Show – Generic | `live game show`, `game show experience`, `game show near me`, `interactive game show` | `/lp/game-show-experience/` |
| Game Show – Competitor (capped) | Great Big Game Show / American Dream terms | `/lp/game-show-experience/` |
| Birthday – Kids | `kids birthday party places`, `kids birthday party venue`, `kids party places`, `indoor birthday party` (+ near me) | `/lp/kids-birthday-party/` |
| Birthday – General/Teen/Adult | `birthday party places`, `birthday party venue`, `teen birthday party places`, `sweet 16 venues`, `adult birthday party places` | `/lp/birthday-party/` |
| Birthday – Ideas (low bid, test) | `birthday party ideas for kids`, `teen birthday party ideas` | `/blog/birthday-party-ideas-by-age/` |
| Groups | `team building`, `corporate game show`, `group activities` | `/lp/team-building/` |

Geo: radius ~20–25 mi around Rockaway Townsquare, **presence** only (not "interest"). Ad schedule: align with hours (Mon–Thu 11–8, Fri–Sat 11–9, Sun 11–7) for call extensions.

## 6. Message match (search term → ad → page)

| Search term | Headline idea | LP H1 |
|---|---|---|
| kids birthday party places near me | Kids Birthday Party Place – Rockaway NJ | "Kids birthday party place in Rockaway, NJ" |
| game show birthday party | Game Show Birthday Parties – Party Room Incl. | "A birthday party where the guest of honor is the star of the show" |
| game show room rockaway nj | Game Show Room Rockaway – Book Online | "Game Show Room — Rockaway, NJ" |
| great big game show american dream | Live Game Show in Morris County – From $33 | "Play a live game show — right here in Morris County" |
| team building activities near me | Team Building Game Show – 8 to 60 People | "Team building your team will actually enjoy" |

## 7. PPC ↔ SEO synergy loop

1. Monthly: export search terms + GSC queries into `data-private/`, run `npm run analyze`.
2. Clusters with PPC clicks **and** GSC impressions (see `ppc_gsc_overlap`) → strengthen the organic page; consider reducing paid bids where organic ranks top-3.
3. High-CTR paid terms with no organic page → create content (add to `src/pages`, register in `src/routes.ts`).
4. Informational paid spend → shift to organic content (blog) and lower bids.
