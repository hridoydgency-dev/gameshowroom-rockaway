# Analytics & Conversion Tracking

## Architecture

```
<head>  Consent Mode v2 defaults → page context push → GTM (or gtag.js fallback)
<body>  data-track / data-track-view attributes on links & sections
/assets/app.[hash].js  → delegated listeners → window.dataLayer.push({...})
GTM     → GA4 events, Google Ads conversions, Meta Pixel, Microsoft UET (via templates)
```

- **No IDs in code.** Configure via env: `PUBLIC_GTM_ID` (preferred) or `PUBLIC_GA4_ID` / `PUBLIC_GOOGLE_ADS_ID`; optional `PUBLIC_META_PIXEL_ID`, `PUBLIC_MS_UET_ID` for direct loading.
- Every event carries `page_type`, `page_topic`, `page_path` (verified by `tests/tracking.test.ts`).

## Event dictionary

| Event | Fires when | Key params | Suggested use |
|---|---|---|---|
| `view_service` / `view_game_show` / `view_birthday_party` / `view_booking` / `view_location` / `view_article` | page load (per route `trackView`) | page_type, page_topic | GA4 audiences, remarketing lists |
| `pricing_view` | pricing block ≥50% visible (once) or /pricing/ load | section_label | Micro-conversion |
| `package_view` | party package card ≥50% visible (once) | section_label | Micro-conversion |
| `click_book_now` | internal Book/Quote CTA click | cta_label, link_url | CTA placement testing |
| `begin_booking` | any FareHarbor link click | booking_kind (small/large), cta_label | Funnel entry |
| `outbound_booking_click` | FareHarbor link click | cta_label, link_url | **Secondary Ads conversion** |
| `phone_click` | tel: link | cta_label | **Ads conversion (calls from website)** |
| `email_click` / `map_click` | mailto: / maps link | cta_label | Micro-conversion |
| `faq_open` | FAQ accordion opened | faq_id | Content insight |
| `form_start` | first focus in a lead form | form_name, form_context | Form friction analysis |
| `form_submit` | valid form submit | form_context, event_type, guests | — |
| `generate_lead` | thank-you page load within 30 min of a submit (dedupes reloads) | form_context, event_type, value=1 | **Primary Ads conversion** |
| `consent_update` | user changes cookie choice | consent_ads | — |

Lead forms also carry hidden `gclid`, `utm_source`, `utm_campaign`, `utm_term` (captured to sessionStorage for the session) so Netlify form submissions can be matched to campaigns / uploaded as offline conversions.

## Fixing the zero-conversion problem

The 8-month PPC export shows **0 conversions on 3,286 clicks**. Do these in order:

1. **Google Ads → Goals → Conversions:** audit existing actions; disable stale/duplicate ones. Create:
   - `Lead – Event quote` (website, GTM trigger: event `generate_lead`) — Primary.
   - `Booking – FareHarbor purchase` — Primary (see step 2).
   - `Call from website` (`phone_click`) and `Calls from ads` (call extensions, ≥60s) — Primary.
   - `Begin booking` (`outbound_booking_click`) — **Secondary** (observation only).
2. **FareHarbor:** Dashboard → Settings → Integrations/Analytics: connect **GA4 measurement ID** and **Google Ads conversion ID/label** so completed bookings fire a purchase with value. If FareHarbor's embed/lightframe is used later, enable cross-domain measurement in GA4 for `fareharbor.com`.
3. **GA4:** mark `generate_lead` and `purchase` (from FareHarbor) as key events; link GA4 ↔ Google Ads; import.
4. **Enhanced conversions for leads** (optional): hash the email/phone on `generate_lead` in GTM.
5. Wait ~30 days of clean data before judging any search term as "non-converting".

## GTM setup checklist

- Container with: GA4 Configuration (Google tag), GA4 Event tag (trigger: all custom events above, pass params), Ads Conversion tags (triggers: `generate_lead`, `phone_click`), Conversion Linker, Meta Pixel / UET community templates.
- Consent: site sets Consent Mode v2 defaults before GTM. `PUBLIC_CONSENT_ADS_DEFAULT=granted` = US opt-out model (footer "Cookie settings" lets users decline); `denied` = opt-in banner on first visit. A certified CMP can replace the built-in banner — remove `ConsentBanner` and call `gtag('consent','update',…)` from the CMP. **Choose the model with counsel; this is not legal advice.**

## Verified

`npm test` runs Chromium against the built site and asserts: consent default is the first dataLayer command; view events per page type; booking click → `begin_booking` + `outbound_booking_click` with required params; phone/email/map/book clicks; `pricing_view`/`package_view` fire once; form attribution capture; `form_start` → `form_submit` → `generate_lead` on thank-you with no double-count on reload; invalid forms don't fire; consent decline persists.

Not verifiable here: real GTM/GA4/Ads receipt (no container ID supplied) and FareHarbor-side conversion firing.
