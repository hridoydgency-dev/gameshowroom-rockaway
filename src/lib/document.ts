/** HTML document shell: <head> metadata, JSON-LD graph, consent defaults, tag loaders. */
import type { RouteDef } from './types';
import { config, absUrl } from './config';
import { sitewideSchema, webPage, breadcrumbList, graph } from './schema';
import { business } from '../data/business';

/** CSP as a <meta> (not a header) so the /admin CMS can run with its own needs. */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://connect.facebook.net https://bat.bing.com",
  "img-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.doubleclick.net https://www.google.com https://www.facebook.com https://bat.bing.com",
  "frame-src https://www.googletagmanager.com https://fareharbor.com https://td.doubleclick.net",
  "form-action 'self'", "base-uri 'self'", "object-src 'none'",
].join('; ');

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** JSON for <script> blocks: escape "<" so content can never close the tag. */
const safeJson = (o: unknown) => JSON.stringify(o).replace(/</g, '\\u003c');

export function robotsFor(route: RouteDef) {
  if (!config.allowIndexing) return 'noindex, nofollow';
  return route.seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1';
}

export function jsonLdFor(route: RouteDef) {
  const crumbs = route.breadcrumb ?? [{ name: 'Home', path: '/' }];
  const pageType = route.pageType === 'hub' ? 'CollectionPage' : route.path === '/contact/' ? 'ContactPage' : 'WebPage';
  const nodes: object[] = [
    ...sitewideSchema(),
    webPage(route.path, route.seo.title, route.seo.description, pageType),
    breadcrumbList(route.path, crumbs),
    ...(route.schema ? route.schema() : []),
  ];
  return graph(nodes);
}

export function renderDocument(route: RouteDef, body: string, assets: { css: string; cssInline?: string; js: string }) {
  const s = route.seo;
  const canonical = s.canonical ?? absUrl(route.path);
  const og = absUrl(s.ogImage ?? '/images/og-default.png');
  const t = config.tracking;
  const pageCfg = {
    pageType: route.pageType,
    pageTopic: s.primaryTopic,
    viewEvent: route.trackView,
    metaPixelId: t.metaPixelId || undefined,
    msUetId: t.msUetId || undefined,
  };
  const consentDefaults = {
    ad_storage: t.consentAdsDefault,
    ad_user_data: t.consentAdsDefault,
    ad_personalization: t.consentAdsDefault,
    analytics_storage: t.consentAnalyticsDefault,
    wait_for_update: 500,
  };
  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    `<meta http-equiv="Content-Security-Policy" content="${CSP}">`,
    `<title>${esc(s.title)}</title>`,
    `<meta name="description" content="${esc(s.description)}">`,
    `<link rel="canonical" href="${canonical}">`,
    `<meta name="robots" content="${robotsFor(route)}">`,
    '<meta name="theme-color" content="#15102f">',
    '<meta name="format-detection" content="telephone=no">',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    '<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">',
    // Open Graph / Twitter
    '<meta property="og:type" content="' + (route.pageType === 'article' ? 'article' : 'website') + '">',
    `<meta property="og:site_name" content="${esc(business.name)}">`,
    `<meta property="og:title" content="${esc(s.title)}">`,
    `<meta property="og:description" content="${esc(s.description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${og}">`,
    '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">',
    '<meta property="og:locale" content="en_US">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(s.title)}">`,
    `<meta name="twitter:description" content="${esc(s.description)}">`,
    `<meta name="twitter:image" content="${og}">`,
    // Local signals
    '<meta name="geo.region" content="US-NJ"><meta name="geo.placename" content="Rockaway">',
    // Styles
    assets.cssInline ? `<style>${assets.cssInline}</style>` : `<link rel="stylesheet" href="${assets.css}">`,
    // Consent Mode v2 defaults MUST run before any tag
    `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',${safeJson(consentDefaults)});try{var c=localStorage.getItem('gsr_consent');if(c)gtag('consent','update',JSON.parse(c));}catch(e){}window.__GSR=${safeJson(pageCfg)};window.__GSR_CONSENT_MODE=${safeJson(t.consentAdsDefault === 'denied' ? 'opt-in' : 'opt-out')};dataLayer.push({page_type:${safeJson(route.pageType)},page_topic:${safeJson(s.primaryTopic)}});</script>`,
    t.gtmId
      ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${safeJson(t.gtmId)});</script>`
      : t.ga4Id || t.adsId
        ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(t.ga4Id || t.adsId)}"></script><script>gtag('js',new Date());${t.ga4Id ? `gtag('config',${safeJson(t.ga4Id)});` : ''}${t.adsId ? `gtag('config',${safeJson(t.adsId)});` : ''}</script>`
        : '<!-- analytics: set PUBLIC_GTM_ID (preferred) or PUBLIC_GA4_ID / PUBLIC_GOOGLE_ADS_ID -->',
    `<script type="application/ld+json">${safeJson(jsonLdFor(route))}</script>`,
    `<script src="${assets.js}" defer></script>`,
  ].join('\n');

  const gtmNoscript = t.gtmId
    ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${esc(t.gtmId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`
    : '';
  const bodyAttrs = route.path === '/thank-you/' ? ' data-thank-you="true"' : '';
  return `<!doctype html>\n<html lang="en-US">\n<head>\n${head}\n</head>\n<body data-page-type="${route.pageType}"${bodyAttrs}>${gtmNoscript}\n${body}\n</body>\n</html>\n`;
}
