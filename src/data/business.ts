/**
 * BUSINESS TRUTH — single source of NAP + core facts.
 * Every fact carries its source. Anything marked `confirm` is published by the
 * business today but is inconsistent or vague and must be confirmed by the owner
 * (see docs/strategy.md → "Facts requiring confirmation").
 * NEVER add a fact here that the business has not published or confirmed.
 */
import type { Business } from '../lib/types';

import { businessContent as c } from '../lib/content-store';

/** Editable fields come from content/business.json (managed in /admin). Code-only fields stay here. */
export const business: Business = {
  name: c.name,
  legalBrand: 'Game Show Room — an All In Adventures experience',
  parentOrganization: { name: 'All In Adventures', url: 'https://allinadventures.com/' },
  tagline: c.tagline,
  description: c.description,
  phone: c.phone,
  email: c.email,
  address: c.address,
  hours: c.hours,
  mapsUrl: c.mapsUrl,
  sameAs: [
    // Social profiles listed on the current site are All In Adventures brand profiles.
    'https://allinadventures.com/',
    // Google Business Profile (knowledge-graph id /g/11yjpxzm89), supplied by owner 2026-10-03
    'https://www.google.com/maps?cid=3671476271624143588',
  ],
  googleBusinessProfileUrl: c.googleBusinessProfileUrl,
  facts: {
    pricePerGuestFrom: { value: c.pricePerGuestFrom, currency: 'USD', source: 'content/business.json (owner-editable in /admin); originally site: "starting at $%PRICE% per guest"' },
    sessionMinutes: { value: 60, source: 'site FAQ' },
    minAge: { value: 6, source: 'site FAQ: "perfect for ages 6 and up"' },
    standardGroup: {
      value: '6–8 players',
      source: 'site FAQ ("designed for 6-8 players"); room page states 4–16 — CONFIRM',
      confirm: true,
    },
    largeGroups: { value: '40–60 players (extended or back-to-back shows)', source: 'site FAQ' },
    privateBookings: { value: true, source: 'site FAQ: "Every booking is private to your group."' },
    advanceBooking: {
      value: 'Book at least 48 hours in advance',
      source: 'FAQ says "recommend"; room page says "required" — CONFIRM',
      confirm: true,
    },
    partyFormat: {
      value: '1 hour in the Game Show Room + 1 extra hour in a private Party Room',
      source: 'site FAQ',
    },
    freeParking: { value: true, source: 'site FAQ: "completely free—no validation required"' },
    wheelchairAccessible: { value: true, source: 'site FAQ' },
    adultSupervision: { value: 'At least one adult (18+) required for children’s parties', source: 'site FAQ' },
    outsideCake: { value: 'Bring your own cake, cupcakes or decorations with advance notice', source: 'site FAQ' },
    customTrivia: { value: true, source: 'site FAQ' },
    giftCards: { value: true, source: 'site FAQ' },
    seasonalShows: { value: 'Holiday and seasonal themed shows (e.g. Halloween to Christmas)', source: 'site FAQ' },
    arrival: { value: 'Arrive 10–15 minutes early', source: 'site FAQ' },
    hoursMatchGBP: {
      value: false,
      source: 'Website: Mon–Thu 11–8, Fri–Sat 11–9, Sun 11–7. Google Business Profile (Oct 3 2026): Mon–Thu 12–8, Fri–Sat 12–9, Sun 12–6 — CONFIRM which is correct and align both',
      confirm: true,
    },
  },
  booking: c.booking,
  sisterLocations: [
    { name: 'Game Show Room West Nyack, NY', url: 'https://gameshowroomwestnyack.com/' },
  ],
  sisterExperiences: [
    {
      name: 'All In Adventures Escape Rooms — Rockaway',
      url: 'https://allinadventures.com/',
      note: 'Escape rooms operated by the same company at Rockaway Townsquare',
    },
  ],
  // Google Business Profile map pin (read 2026-10-03)
  geo: { lat: 40.9080992, lng: -74.5537202 },
};

/** Facts the owner must confirm before launch. Surfaced in docs + build report. */
export const factsToConfirm = Object.entries(business.facts)
  .filter(([, f]) => f.confirm)
  .map(([k, f]) => ({ key: k, value: f.value, source: f.source }));
