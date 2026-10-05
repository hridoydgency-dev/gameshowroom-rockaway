# Design system — "Showtime Noir" (Game Show Room brand)

Derived from the official brand site (gameshowroomrockaway.com, crawled Oct 2026) and applied to this
site's PPC/SEO architecture. Tokens live in `src/styles/app.css`; components in `src/components/`.

## Brand principles
1. **Dark stage, bright lights.** Near-black pages (`night #080709`) so photos, gold titles and red CTAs glow.
2. **Marquee energy.** Lit-bulb frames (`.marquee`), the gold torn-line divider (`<WaveDivider/>`) and gold Oswald headlines.
3. **Real people, real shows.** Only authentic venue photography (`src/data/images.ts`). No stock composites, no
   photos implying they show a specific reviewer.
4. **One loud action.** Red glowing button = book/quote; white outline = secondary.
5. **Facts first.** Stats strip (price · length · ages · group) uses only sourced facts from `business.ts`.

## Tokens
| Token | Hex | Use | Contrast |
|---|---|---|---|
| night | #080709 | page background | — |
| night-2 / panel / panel-2 | #0f0e11 / #151317 / #1d1a20 | alt sections, cards, inputs | — |
| edge | #3f3b44 | 1px borders | — |
| bone | #f6f3ec | body text | 18.1:1 on night |
| mist | #c9c4cc | secondary text | 10.8:1 on panel |
| smoke | #a29ca7 | meta text | 7.5:1 on night |
| gold | #efe285 | H1/H2, links | 15.2:1 on night |
| bronze | #ca9342 | eyebrows, frames | 7.4:1 on night |
| red | #d92123 | primary CTA (white text) | 5.0:1 |

## Type
- Display: **Oswald** 600, uppercase (H1/H2, stats, card titles) — self-hosted `/fonts/oswald.woff2`.
- Body: **Source Sans 3** 400–700 — `/fonts/source-sans-3.woff2`. Both SIL OFL; metric-matched fallbacks prevent CLS.
- Eyebrows: `.eyebrow-x` (700, 0.22em tracking, uppercase, bronze).

## Components
`Hero` (photo + shade + centred title + CTAs + marquee stats + wave) · `PageHero` (inner-page title banner) ·
`SectionHead` (centred eyebrow/title/lead) · `Photo` (optional `framed` marquee) · `Gallery` · `Steps` · `Features` ·
`FaqList` (brand "Q." rows) · review cards (Google G + stars) · `Button`/`BookingLink` (`sub` prop for two-line
"Book Online Now / Small groups 6–8" style) · `.card-noir` / `.card-glow` surfaces · `.stripes` / `.spot` section tones.

## Adding photos
Drop originals in `_brand-src/` (git-ignored), add an entry to the processing step (see commit history) or export
WebP at 1600w / 900w / 768×1024 mobile, then register it in `src/data/images.ts` with honest alt text.
