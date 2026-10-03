/**
 * BUSINESS TRUTH — single source of NAP + core facts.
 * Every fact carries its source. Anything marked `confirm` is published by the
 * business today but is inconsistent or vague and must be confirmed by the owner
 * (see docs/strategy.md → "Facts requiring confirmation").
 * NEVER add a fact here that the business has not published or confirmed.
 */
import type { Business } from '../lib/types';

export const business: Business = {
  name: 'Game Show Room Rockaway',
  legalBrand: 'Game Show Room — an All In Adventures experience',
  parentOrganization: { name: 'All In Adventures', url: 'https://allinadventures.com/' },
  tagline: 'Live Game Show Experience in Rockaway — just like on TV',
  description:
    'Game Show Room Rockaway is a live, host-led game show experience inside Rockaway Townsquare in Rockaway, New Jersey. Private groups play 60 minutes of trivia, puzzles and light physical challenges with buzzers, lights, music and a live host. Popular for kids birthday parties (ages 6+), teen and adult celebrations, family outings, school groups and corporate team building.',
  phone: { display: '(862) 200-7134', e164: '+18622007134' },
  email: 'support@allinadventures.com',
  address: {
    street: '301 Mt Hope Ave, Suite 1001c',
    venue: 'Rockaway Townsquare (mall), first floor next to the JCPenney entrance',
    city: 'Rockaway',
    region: 'NJ',
    regionName: 'New Jersey',
    postalCode: '07866',
    country: 'US',
    county: 'Morris County',
  },
  // Source: gameshowroomrockaway.com footer + room page (Oct 2026)
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], label: 'Mon–Thu', opens: '11:00', closes: '20:00' },
    { days: ['Friday', 'Saturday'], label: 'Fri–Sat', opens: '11:00', closes: '21:00' },
    { days: ['Sunday'], label: 'Sun', opens: '11:00', closes: '19:00' },
  ],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Game+Show+Room+301+Mt+Hope+Ave+Rockaway+NJ+07866',
  sameAs: [
    // Social profiles listed on the current site are All In Adventures brand profiles.
    'https://allinadventures.com/',
  ],
  facts: {
    pricePerGuestFrom: { value: 33, currency: 'USD', source: 'site: "starting at $33 per guest"' },
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
  },
  booking: {
    provider: 'FareHarbor',
    smallGroupUrl: 'https://fareharbor.com/embeds/book/mysteryroom-rockaway/items/294163/?full-items=yes&flow=no',
    largeGroupUrl: 'https://fareharbor.com/embeds/book/mysteryroom-rockaway/items/634281/calendar/',
  },
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
  // geo intentionally omitted: add exact lat/lng from the Google Business Profile pin.
  geo: undefined,
};

/** Facts the owner must confirm before launch. Surfaced in docs + build report. */
export const factsToConfirm = Object.entries(business.facts)
  .filter(([, f]) => f.confirm)
  .map(([k, f]) => ({ key: k, value: f.value, source: f.source }));
