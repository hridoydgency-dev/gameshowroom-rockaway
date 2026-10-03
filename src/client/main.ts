/**
 * Client runtime (~3 KB min). Progressive enhancement only — every page works without it.
 * Responsibilities:
 *  1. dataLayer event tracking via data-track / data-track-view attributes (GTM-ready)
 *  2. Google Consent Mode v2 banner + updates
 *  3. Attribution capture (gclid / utm) into lead-form hidden fields
 *  4. Lead form start/submit events
 *  5. Optional direct pixels (Meta, Microsoft UET) when IDs are configured and consent granted
 */
type DL = Record<string, unknown>;
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...a: unknown[]) => void;
    __GSR: { pageType: string; pageTopic: string; viewEvent?: string; metaPixelId?: string; msUetId?: string; adsId?: string; adsLeadLabel?: string };
    fbq?: (...a: unknown[]) => void;
    uetq?: unknown[];
  }
}

const w = window;
w.dataLayer = w.dataLayer || [];
const cfg = w.__GSR || { pageType: 'unknown', pageTopic: 'unknown' };

export function push(event: string, params: DL = {}) {
  const payload = { event, page_type: cfg.pageType, page_topic: cfg.pageTopic, page_path: location.pathname, ...params };
  w.dataLayer.push(payload);
  return payload;
}

const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
  sget(k: string) { try { return sessionStorage.getItem(k); } catch { return null; } },
  sset(k: string, v: string) { try { sessionStorage.setItem(k, v); } catch { /* storage blocked */ } },
};

/* ---------- 1. Page-level view event (view_game_show, view_birthday_party, view_service…) ---------- */
if (cfg.viewEvent) push(cfg.viewEvent);

/* ---------- 2. Click tracking (delegated) ---------- */
document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
  if (!el) return;
  const event = el.dataset.track!;
  const label = el.dataset.trackLabel || '';
  const href = (el as HTMLAnchorElement).href || '';
  if (event === 'outbound_booking_click') {
    // begin_booking marks funnel entry; outbound_booking_click is the hand-off to FareHarbor
    push('begin_booking', { booking_kind: el.dataset.bookingKind, cta_label: label });
  }
  push(event, { cta_label: label, link_url: href, link_text: (el.textContent || '').trim().slice(0, 80) });
  if (event === 'phone_click' || event === 'outbound_booking_click') fireAdsPixels('Lead_intent');
});

/* FAQ engagement */
document.querySelectorAll<HTMLDetailsElement>('details[data-faq]').forEach((d) =>
  d.addEventListener('toggle', () => { if (d.open) push('faq_open', { faq_id: d.dataset.faq }); }),
);
/* Close mobile nav after choosing a link */
document.querySelectorAll<HTMLDetailsElement>('details[data-mobile-nav]').forEach((d) =>
  d.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { d.open = false; })),
);

/* ---------- 3. View tracking (pricing_view, package_view) ---------- */
const seen = new Set<string>();
if ('IntersectionObserver' in w) {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const el = en.target as HTMLElement;
      const key = `${el.dataset.trackView}:${el.dataset.trackLabel}`;
      if (!seen.has(key)) { seen.add(key); push(el.dataset.trackView!, { section_label: el.dataset.trackLabel }); }
      io.unobserve(el);
    }
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-track-view]').forEach((el) => io.observe(el));
}

/* ---------- 4. Attribution capture ---------- */
const ATTR = ['gclid', 'gbraid', 'wbraid', 'msclkid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const qs = new URLSearchParams(location.search);
const attribution: Record<string, string> = JSON.parse(store.sget('gsr_attr') || '{}');
ATTR.forEach((k) => { const v = qs.get(k); if (v) attribution[k] = v.slice(0, 200); });
if (Object.keys(attribution).length) store.sset('gsr_attr', JSON.stringify(attribution)); // session-only, first-party
document.querySelectorAll<HTMLInputElement>('input[data-attr]').forEach((i) => { i.value = attribution[i.dataset.attr!] || ''; });

/* ---------- 5. Lead forms ---------- */
document.querySelectorAll<HTMLFormElement>('form[data-lead-form]').forEach((form) => {
  let started = false;
  form.addEventListener('focusin', () => {
    if (started) return;
    started = true;
    push('form_start', { form_name: form.getAttribute('name'), form_context: form.dataset.leadForm });
  });
  form.addEventListener('submit', () => {
    if (!form.checkValidity()) return;
    const type = (form.querySelector('[name=event_type]') as HTMLSelectElement | null)?.value || '';
    const guests = (form.querySelector('[name=guests]') as HTMLInputElement | null)?.value || '';
    push('form_submit', { form_name: form.getAttribute('name'), form_context: form.dataset.leadForm, event_type: type, guests });
    store.sset('gsr_lead', JSON.stringify({ type, context: form.dataset.leadForm, t: Date.now() }));
  });
});
/* Thank-you page confirms the lead (server accepted the POST) → Ads conversion fires here */
if (document.body.dataset.thankYou === 'true') {
  const lead = JSON.parse(store.sget('gsr_lead') || 'null');
  if (lead && Date.now() - lead.t < 30 * 60 * 1000) {
    push('generate_lead', { form_context: lead.context, event_type: lead.type, value: 1, currency: 'USD' });
    fireAdsPixels('Lead');
    store.sset('gsr_lead', 'null');
  }
}

/* ---------- 6. Consent Mode v2 ---------- */
const banner = document.querySelector<HTMLElement>('[data-consent-banner]');
function applyConsent(choice: 'accept' | 'decline') {
  const ads = choice === 'accept' ? 'granted' : 'denied';
  const state = { ad_storage: ads, ad_user_data: ads, ad_personalization: ads, analytics_storage: 'granted' };
  w.gtag?.('consent', 'update', state);
  store.set('gsr_consent', JSON.stringify(state));
  push('consent_update', { consent_ads: ads });
  if (banner) banner.hidden = true;
  if (ads === 'granted') loadPixels();
}
const optIn = (window as any).__GSR_CONSENT_MODE === 'opt-in';
if (banner && optIn && !store.get('gsr_consent')) banner.hidden = false;
document.querySelectorAll<HTMLElement>('[data-consent]').forEach((b) =>
  b.addEventListener('click', () => applyConsent(b.dataset.consent as 'accept' | 'decline')),
);
document.querySelectorAll('[data-consent-open]').forEach((b) => b.addEventListener('click', () => { if (banner) banner.hidden = false; }));

/* ---------- 7. Optional direct pixels (prefer GTM; these run only if IDs set + consent) ---------- */
function adsGranted() {
  try {
    const c = store.get('gsr_consent');
    return c ? JSON.parse(c).ad_storage === 'granted' : !optIn; // opt-out model: granted until declined
  } catch { return !optIn; }
}
function loadScript(src: string) { const s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); return s; }
let pixelsLoaded = false;
function loadPixels() {
  if (pixelsLoaded || !adsGranted()) return;
  pixelsLoaded = true;
  if (cfg.metaPixelId) {
    const f: any = (w.fbq = function (...a: unknown[]) { f.callMethod ? f.callMethod(...a) : f.queue.push(a); });
    f.queue = []; f.loaded = true; f.version = '2.0';
    loadScript('https://connect.facebook.net/en_US/fbevents.js');
    w.fbq('init', cfg.metaPixelId); w.fbq('track', 'PageView');
  }
  if (cfg.msUetId) {
    w.uetq = w.uetq || [];
    const s = loadScript('https://bat.bing.com/bat.js');
    s.onload = () => {
      const o: any = { ti: cfg.msUetId, enableAutoSpaTracking: true, q: w.uetq };
      w.uetq = new (w as any).UET(o);
      (w.uetq as any).push('pageLoad');
    };
  }
}
function fireAdsPixels(kind: 'Lead' | 'Lead_intent') {
  if (!adsGranted()) return;
  if (w.fbq) w.fbq('track', kind === 'Lead' ? 'Lead' : 'Contact');
  if (w.uetq) w.uetq.push('event', kind === 'Lead' ? 'generate_lead' : 'contact', {});
}
loadPixels();

export {};
