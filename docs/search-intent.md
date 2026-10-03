# Search-Intent Model & GSC Report

## Inputs & data quality

| File | Rows | Notes |
|---|---|---|
| Birthday search terms (Google Ads) | 15,263 term×keyword rows → ~9,700 unique terms | 1,960 rows marked *Excluded* ($157 spend before exclusion); "Other search terms" hides 51% of spend |
| Game Show search terms | 146 rows | small campaign; 6 terms added as keywords |
| GSC Queries | 424 | **no date column** — period assumed ~6 months; top-1,000 export limit applies |
| GSC Pages / Devices / Countries | 8 / 3 / 48 | 236 of 266 clicks go to the homepage |
| Both PPC files | — | `Conversions`, `Conv. value`, `Cross-device conv.` are **0 for every row** → tracking anomaly |

Duplicates: the same search term appears under multiple keywords (5,780 duplicate term rows); the engine aggregates by term.

## Taxonomy (in `scripts/analysis/analyze.py`)

**Intent:** `brand`, `competitor`, `transactional`, `local_transactional`, `commercial_investigation`, `informational`.
**Topic:** `game_show`, `game_show_party`, `birthday`, `party_event`, `escape_room`, `things_to_do`, `mall_navigational`, `other`.
**Occasions:** kids_birthday, teen_birthday, adult_milestone_birthday, corporate_team_building, school_youth_group, bachelor_bachelorette, date_night, family_outing, holiday_party, graduation.
**Cluster:** page-mappable groups (e.g. `birthday-venue:kids`, `escape-room:local`, `competitor:great big game show / american dream`).
**Commercial-intent score:** 0–100 (penalises out-of-area geo, TV-viewing intent, under-6 ages).

| Intent | Unique queries | PPC cost | GSC impr. |
|---|---|---|---|
| local_transactional | 2,596 | $822 | 2,235 |
| informational | 4,045 | $759 | 232 |
| commercial_investigation | 2,731 | $395 | 604 |
| competitor | 425 | $175 | 453 |
| brand | 23 | $38 | 639 |
| transactional | 113 | $23 | 10 |

## GSC report

**Totals:** 266 clicks · 9,289 impressions · CTR 2.9% · 97% of impressions US. Mobile = 60% of clicks (avg pos 7.8) vs desktop pos 16.9.

**Top pages (legacy site)**

| URL | Clicks | Impr. | CTR | Pos | New home |
|---|---|---|---|---|---|
| / | 236 | 7,867 | 3.0% | 10.2 | / |
| /birthday-party/ | 9 | 1,251 | **0.72%** | 12.5 | /birthday-parties/ (301) |
| /faqs/ | 9 | 989 | 0.91% | 11.4 | /faq/ (301) |
| /testimonials/ | 11 | 895 | 1.23% | 6.5 | /reviews/ (301) |
| /gallery/ | 1 | 541 | 0.18% | 12.2 | /game-show-experience/ (301) |
| /contact-us/ | 1 | 422 | 0.24% | 18.4 | /contact/ (301) |
| /room/ | 1 | 322 | 0.31% | 15.5 | /game-show-experience/ (301) |

**CTR / position opportunities (≥20 impr, CTR <3%)**

| Query | Impr. | Pos | Action |
|---|---|---|---|
| escape room rockaway nj | 453 | 9.5 | `/game-show-vs-escape-room/` answers the intent honestly + links to sister escape rooms |
| rockaway mall escape room / escape room rockaway mall (+variants) | ~1,000 | 10–19 | same page |
| game show battle rooms | 254 | 4.1 | competitor brand; experience page + non-affiliation note |
| rockaway nj event space | 201 | 31 | `/group-events/` targets "event space" (40–60 players) |
| in the spotlight rockaway nj | 189 | 12 | **unknown entity** — possibly a former tenant/brand at the address. Owner to clarify |
| unique game show new jersey | 151 | 26 | `/game-show-experiences-new-jersey/` |
| game shows near me | 61 | 26 | experience page + LP |
| rockaway mall activities / events / kids activities | 106 | 7–9 | `/location/rockaway-nj/` + `/things-to-do-rockaway-nj/` |
| things to do near rockaway nj | 45 | 8.5 | `/things-to-do-rockaway-nj/` |
| school game shows new jersey | 37 | 13 | `/group-events/school-and-youth-groups/` |

**Keyword cannibalization (legacy):** the homepage ranked for nearly everything (birthday, escape, things-to-do) because it was the only substantive page. New architecture assigns one `primaryTopic` per indexable page; a unit test fails the build if two pages share one.

**PPC ↔ GSC overlap** (top): `kids birthday party places near me` (PPC $63.93 · GSC pos 4.8), `birthday party places near me` ($40.60 · pos 1.0), `game show room rockaway nj` ($25.60 · pos 1.25), `game show room` ($10.03 · 215 impr pos 5.3), `game show birthday party` ($9.73 · pos 12.1). Brand terms rank #1 organically → test lowering brand bids once conversions are tracked.

**Gaps (paid demand, no organic visibility):** kids/teen/adult birthday venue intent (GSC ≈ 0 impressions for thousands of paid impressions), corporate team building, birthday cost questions. New pages built for each.

## Search-intent → page map

| Cluster | Intent | Page | H1 | Primary CTA |
|---|---|---|---|---|
| brand | brand | `/` · `/lp/game-show-room/` | Live Game Show Room in Rockaway, NJ | Book (FareHarbor) |
| game show generic/local | commercial | `/game-show-experience/` | A live game show where your group are the contestants | Book 6–8 online |
| game show birthday, birthday venue general/indoor | local transactional | `/birthday-parties/` | Game show birthday parties in Rockaway, NJ | Quote |
| kids birthday places | local transactional | `/birthday-parties/kids/` | A kids birthday party starring your kid | Quote |
| teen / sweet 16 | local transactional | `/birthday-parties/teen-and-sweet-16/` | The party teens won't call babyish | Quote |
| adult birthday | commercial / informational | `/birthday-parties/adult/` | Skip the dinner reservation. Host a game show. | Quote / Book |
| corporate | commercial | `/group-events/corporate-team-building/` | Team building your team won't groan about | Quote |
| school / youth | commercial | `/group-events/school-and-youth-groups/` | A field trip that's secretly a quiz | Quote |
| event space / groups | local | `/group-events/` | Private group events in Rockaway, NJ | Quote |
| escape room local | navigational (sister brand) | `/game-show-vs-escape-room/` | Game Show Room vs. escape room | Book / outbound |
| competitor (GBGS) | competitor | `/game-show-experiences-new-jersey/` | Live game show experiences in New Jersey | Book |
| mall / directions | navigational | `/location/rockaway-nj/` | Find us inside Rockaway Townsquare | Directions / Call |
| things to do | informational-local | `/things-to-do-rockaway-nj/` | Indoor things to do in Rockaway, NJ | Book |
| birthday ideas | informational | `/blog/birthday-party-ideas-by-age/` | Birthday party ideas by age | → birthday hub |
| price / cost | commercial investigation | `/pricing/` · `/blog/how-much-does-a-kids-birthday-party-cost-nj/` | Game Show Room pricing | Book / Quote |
