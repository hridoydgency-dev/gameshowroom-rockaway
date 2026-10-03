/** Generates data/content-map.json: page ↔ search cluster ↔ intent ↔ CTA ↔ schema ↔ tracking. */
import { readFileSync, writeFileSync } from 'node:fs';
import { routes } from '../src/routes';
import { landingPages } from '../src/pages/ppc';

const clusters = JSON.parse(readFileSync('data/search-clusters.json', 'utf8')).by_cluster as any[];
const pages = JSON.parse(readFileSync('data/seo-pages.json', 'utf8')) as any[];
const out = routes.map((r) => {
  const own = clusters.filter((c) => c.recommended_url === r.path);
  const paid = clusters.filter((c) => c.ppc_landing_page === r.path);
  const meta = pages.find((p) => p.path === r.path) ?? {};
  const lp = landingPages.find((l) => `/lp/${l.slug}/` === r.path);
  return {
    path: r.path, pageType: r.pageType, template: r.template, indexable: meta.indexable,
    h1: meta.h1, title: r.seo.title, primaryTopic: r.seo.primaryTopic, secondaryTopics: r.seo.secondaryTopics ?? [],
    organicClusters: own.map((c) => ({ cluster: c.cluster, queries: c.queries, gsc_impr: c.gsc_impr, ppc_impr: c.ppc_impr, ppc_cost: c.ppc_cost })),
    paidClusters: paid.map((c) => c.cluster), adGroups: lp?.adGroups ?? [],
    primaryConversion: lp ? (lp.goal === 'book' ? 'outbound_booking_click (FareHarbor)' : 'generate_lead (quote form)') :
      r.path.startsWith('/birthday') || r.path.startsWith('/group') ? 'generate_lead (quote form)' : 'outbound_booking_click (FareHarbor)',
    viewEvent: r.trackView ?? null, schemaTypes: meta.schemaTypes ?? [], words: meta.words,
  };
});
writeFileSync('data/content-map.json', JSON.stringify(out, null, 2) + '\n');
console.log('content-map:', out.length, 'pages');
