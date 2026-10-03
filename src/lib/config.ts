import { settingsContent } from './content-store';
/** Build-time configuration from environment variables. No secrets live here. */
const env = (k: string, d = '') => (process.env[k] ?? d).trim();

export const config = {
  siteUrl: env('SITE_URL', 'https://gameshowroomrockaway.com').replace(/\/$/, ''),
  /** Global indexing guard. Production launch sets ALLOW_INDEXING=true. */
  allowIndexing: env('ALLOW_INDEXING', 'false') === 'true',
  netlifyContext: env('CONTEXT', 'local'),
  tracking: {
    gtmId: env('PUBLIC_GTM_ID') || (settingsContent.gtmId ?? '').trim(),
    ga4Id: env('PUBLIC_GA4_ID'),
    adsId: env('PUBLIC_GOOGLE_ADS_ID'),
    adsLeadLabel: env('PUBLIC_GOOGLE_ADS_LEAD_LABEL'),
    metaPixelId: env('PUBLIC_META_PIXEL_ID'),
    msUetId: env('PUBLIC_MS_UET_ID'),
    consentAnalyticsDefault: env('PUBLIC_CONSENT_ANALYTICS_DEFAULT', 'granted') === 'denied' ? 'denied' : 'granted',
    consentAdsDefault: env('PUBLIC_CONSENT_ADS_DEFAULT', 'granted') === 'denied' ? 'denied' : 'granted',
  },
  googleBusinessProfileUrl: env('PUBLIC_GOOGLE_BUSINESS_PROFILE_URL', 'https://share.google/pjcBtcrmgphIDwWXv'),
  buildDate: new Date().toISOString().slice(0, 10),
};

export const absUrl = (path: string) => config.siteUrl + path;
