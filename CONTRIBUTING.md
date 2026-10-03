# Contributing

1. Branch from `main`; one topic per PR.
2. Never invent business facts (prices, policies, capacity, reviews, awards). Put confirmed facts in `src/data/business.ts`; mark unconfirmed ones `confirm: true`.
3. Every indexable page needs a unique `seo.primaryTopic`, title ≤ 65 chars, description 120–160 chars, one H1, and at least one inbound link.
4. Tracking: use `data-track="<event>" data-track-label="<placement>"` on CTAs; add new events to `docs/analytics.md`.
5. Run `npm run check` before pushing — build, SEO audit and tests must pass.
6. Never commit `.env`, raw Ads/GSC exports, or anything in `data-private/`.
7. Commit messages: imperative summary line, body explains *why*.
