# Strategy — Game Show Room Rockaway Digital Acquisition System

**Goal:** qualified traffic → message-matched page → trust → booking or quote → revenue — measurable end-to-end.

## Executive summary

- Analysed 8 months of Google Ads search terms (Birthday + Game Show campaigns, $4,493 spend), GSC queries/pages/devices/countries, the current site, 7 competitor sites and public review platforms.
- **#1 finding:** zero recorded conversions on 3,286 paid clicks → tracking failure. The new site ships a tested dataLayer contract (`generate_lead`, `phone_click`, `outbound_booking_click`, …) and docs to connect FareHarbor/GA4/Ads. See [analytics.md](analytics.md).
- **#2:** ~32% of visible birthday spend buys "ideas" research and ~$287 adult-milestone research → negatives + blog content. See [ppc-strategy.md](ppc-strategy.md).
- **#3:** the legacy site had one strong page (homepage = 89% of clicks); birthday page CTR 0.72%; ~1,500 GSC impressions for "escape room rockaway" with no matching page. New IA gives each intent its own page.
- Built a 29-page static site (React SSR → HTML, Tailwind, ~4 KB JS) with 5 noindex PPC landing pages, JSON-LD entity graph, automated SEO audit and 28 automated tests.

## Decision framework applied

1. Business truth (only facts published on gameshowroomrockaway.com) → 2. search intent → 3. PPC data → 4. GSC → 5. reviews → 6. competitors → 7–9. best practice.

## Facts requiring owner confirmation (blocking for launch)

| Item | Current published value(s) | Why it matters |
|---|---|---|
| Standard group size | FAQ "6–8 players" vs room page "4–16" | Used in heroes, schema, FAQs (site uses 6–8) |
| 48-hour advance booking | FAQ "recommend" vs room page "required" | Site says "book at least 48 hours ahead" |
| Party Package price & inclusions | Only format published; FAQ also says package "includes food, drinks, and dessert" while elsewhere guests bring their own | Package card shows "from $33/guest, quote for total" until confirmed |
| Party Room capacity / max guests | not published | Party page planning |
| Deposit & cancellation terms | "may be required" / "contact us" | Parents' top objection |
| Exact Google Business Profile URL + lat/lng | not supplied | `sameAs`, `geo` in schema |
| Real photos (set, podiums, Party Room, groups) | none accessible | #1 CRO + trust asset; photo slot ready on experience page |
| Verified reviews | 8 unsourced testimonials on current site — **not migrated** | Reviews page noindex until ≥3 verified |
| "In the Spotlight Rockaway" (189 GSC impr) | unknown | Possible former brand at the address — redirect/mention if related |
| Gift card purchase URL | "available" | Add CTA |
| Legal: privacy, terms, cookie policy, consent model | none | Placeholders are noindex |

## Information architecture

```
/                                   Home (brand + occasion router)
├── game-show-experience/           Service: the live game show (← /room/, /gallery/)
├── birthday-parties/               Service hub (← /birthday-party/)
│   ├── kids/                       Landing: ages 6–12
│   ├── teen-and-sweet-16/          Landing: 13–19
│   └── adult/                      Landing: adult & milestone
├── group-events/                   Service hub: 8–60 players ("event space")
│   ├── corporate-team-building/
│   └── school-and-youth-groups/
├── pricing/
├── faq/                            (← /faqs/)
├── location/rockaway-nj/           Directions, parking, hours, service area
├── game-show-vs-escape-room/       Escape-room intent (sister brand)
├── game-show-experiences-new-jersey/  Competitor/comparison intent
├── things-to-do-rockaway-nj/       Local informational
├── blog/ → birthday-party-ideas-by-age/, how-much-does-a-kids-birthday-party-cost-nj/
├── book/  contact/  reviews/ (← /testimonials/)
├── lp/{game-show-room, game-show-experience, kids-birthday-party, birthday-party, team-building}/  (noindex, PPC)
└── thank-you/ privacy/ terms/      (noindex)
```

**Not built, deliberately:** town-by-town pages (geo demand: "rockaway" 2,360 impr; next highest "wayne" 121 — too thin, doorway risk); separate "game show birthday party" page (would cannibalise the birthday hub, which owns that topic); escape-room pages (different product, run by sister brand).

## Page prioritisation (score = commercial intent × demand × evidence overlap)

| Priority | Page | Evidence |
|---|---|---|
| P0 | `/birthday-parties/kids/` + `/lp/kids-birthday-party/` | $548 PPC, 398 clicks; GSC pos 4.8 for top term |
| P0 | `/birthday-parties/` + `/lp/birthday-party/` | $457 PPC; legacy page 1,251 impr at 0.72% CTR |
| P0 | `/` + `/lp/game-show-room/` | Brand 28% CTR; homepage 89% of organic clicks |
| P1 | `/game-show-experience/` | game-show clusters + "battle rooms" 350 impr |
| P1 | `/game-show-vs-escape-room/` | 1,483 GSC impr, no page |
| P1 | `/pricing/` | price questions in GSC + PPC |
| P2 | teen, adult, group, corporate, school pages | $88 / $68 PPC; "event space" 201 impr; "school game shows" 37 |
| P2 | NJ comparison guide | $102 competitor PPC; 151 impr "unique game show new jersey" |
| P3 | blog, things-to-do | informational spend to move organic |

## CRO framework (applied to every commercial page)

| Lens | Implementation |
|---|---|
| Awareness | H1 names the offer + place; 4 fact chips (price, length, ages, group) above the fold |
| Relevance | One page per intent cluster; PPC LPs mirror ad-group language |
| Trust | Fact-based trust row (private, live host, Party Room, free parking); sourced FAQs; NAP everywhere; no fake reviews |
| Desire | "What you'll play", custom trivia for the birthday guest, steps |
| Friction | 6-field quote form (2 required + type), BYO cake answered early, parking/entrance answered, 48 h rule visible |
| Action | Sticky mobile CTA (Book/Quote + Call); single primary goal per LP |

**CRO test backlog:** (1) price shown vs. hidden on kids LP hero; (2) "Get my party quote" vs. "Check party dates" as primary; (3) form length 4 vs 6 fields; (4) photo hero vs. illustration (once photos exist); (5) sticky CTA copy; (6) weekday promotion banner via `promotions`; (7) review snippet placement once verified reviews exist.
