# SEO, Local SEO & AEO Strategy

## Topical model

- **Primary entity/topic:** Game Show Room Rockaway — a live, host-led game show (EntertainmentBusiness) inside Rockaway Townsquare, Rockaway NJ 07866.
- **Secondary:** birthday parties (kids 6–12, teens/Sweet 16, adults).
- **Supporting:** group events & "event space", corporate team building, school/youth groups, things to do in Rockaway / Morris County, escape room vs game show, NJ game show experiences, party ideas & costs.

Each indexable page owns exactly one `primaryTopic` (cannibalization guard enforced by tests). Metadata lives with the page in `src/pages/*.tsx` and is exported to `data/seo-pages.json` on every audit.

## On-page rules used

- Title: offer + place (+ differentiator) ≤ 65 chars; description 120–160 with price/age facts and a CTA.
- H1 states what + where; first screen answers what/who/where/why/next.
- `QuickAnswer` blocks give a 1–3 sentence direct answer (AEO), followed by detail.
- FAQs are sourced (business site) and topic-filtered per page; FAQPage JSON-LD only includes questions visible on that page (test-enforced).
- Descriptive internal anchors ("kids birthday parties", "corporate team building"), never "click here".

## Local SEO

- Consistent NAP from one source (`src/data/business.ts`): Game Show Room Rockaway · 301 Mt Hope Ave, Suite 1001c, Rockaway, NJ 07866 · (862) 200-7134.
- Entrance detail (first floor by JCPenney), free parking, NJ Transit, accessibility, hours — on the location page and site-wide footer.
- Service area copy lists towns with demand/adjacency (Denville, Dover, Randolph, Parsippany, Wharton, Wayne…) on **one** location page — no doorway pages.
- **Off-site actions (owner):** verify Google Business Profile (primary category "Amusement center" or "Event venue" — test), add products: Game Show, Birthday Party Package, Team Building; add booking link → `/book/`; request reviews post-visit; claim Yelp & TripAdvisor (only the West Nyack Game Show Room listing was found on TripAdvisor — check for and create a Rockaway listing); align NAP on Simon mall directory.

## Entity / structured data graph

Every page: `Organization` (All In Adventures, parent) ← `EntertainmentBusiness+LocalBusiness` (NAP, hours, containedInPlace ShoppingCenter "Rockaway Townsquare", amenityFeature, makesOffer → Services) ← `WebSite` ← `WebPage`/`CollectionPage`/`ContactPage` + `BreadcrumbList`. Service pages add `Service` (provider → business, offers minPrice 33 USD per guest). Guides/blog add `BlogPosting`. FAQ-bearing pages add `FAQPage`.

Deliberately **not** emitted: `AggregateRating`/`Review` (no verified data), `Event` (no dated public events), `Product`, `geo` (exact pin not supplied). Note: Google restricts FAQ rich results to authoritative gov/health sites (since Aug 2023); FAQPage is kept for machine understanding, not expected rich results.

Validation done: JSON parse + structural assertions (types, @id uniqueness, breadcrumb positions, FAQ visibility, provider links) in `scripts/seo-audit.ts` and tests. **Not done:** Google Rich Results Test / Schema.org validator (requires network access to those tools) — run after deploy.

## Internal linking engine

- Global: header nav (occasion-grouped), footer "Explore" list of all hubs and guides.
- Contextual: homepage occasion router → all commercial pages; segment pages link siblings and blog; guides link back to commercial pages; `Related` blocks per page.
- Audit computes inbound links per page and **fails on orphans**; graph exported to `data/internal-links.json`.

## Migration (from WordPress)

301s for every legacy URL with impressions (`src/data/redirects.ts` → `dist/_redirects`). Canonicals absolute to `https://gameshowroomrockaway.com`. At launch: submit new sitemap in GSC, inspect top URLs, monitor 404s in Netlify logs for 2–4 weeks.

## AEO / GEO checklist (per commercial page)

Direct answer ✓ · price ✓ · duration ✓ · ages ✓ · group size ✓ · location + entrance ✓ · booking path ✓ · named entity relationships in schema ✓ · FAQs from real query language ✓ · comparison content for alternatives (escape room, other NJ venues) ✓.
