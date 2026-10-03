/**
 * Reusable content collections: experiences, birthday packages, locations,
 * testimonials, promotions, nearby areas. Add entries here — pages render them.
 */
import type { Testimonial, Promotion } from '../lib/types';
import { business } from './business';

/** Bookable experiences (services). Add new games/rooms here. */
export const experiences = [
  {
    id: 'live-game-show',
    name: 'Live Game Show Room',
    url: '/game-show-experience/',
    summary: '60 minutes of host-led trivia, puzzles and challenges with buzzers, lights and music.',
    priceFrom: business.facts.pricePerGuestFrom.value as number,
    minutes: 60,
    minAge: 6,
    group: '6–8 players per standard session; 40–60 for large events',
    variants: ['Family-friendly', 'Kid-focused', 'Adult-level'], // source: room page "game options offered"
    bookingUrl: business.booking.smallGroupUrl,
  },
];

/**
 * Birthday packages. ONLY the Game Show Room Party Package is published by the business.
 * Price and inclusions beyond the published format are NOT published → `priceNote` routes
 * guests to a quote. Fill `price` only after owner confirmation.
 */
export const birthdayPackages = [
  {
    id: 'game-show-party-package',
    name: 'Game Show Room Party Package',
    format: ['60 minutes playing the live game show', '+1 hour in a private Party Room'],
    includes: [
      'Live host running the show — buzzers, lights and music',
      'Private session for your group only',
      'Personalized trivia, themed rounds or spotlight moments for the birthday guest',
      'Private Party Room for cake, pizza or catering',
      'Bring your own cake, cupcakes or decorations (tell us in advance)',
    ],
    price: null as number | null,
    priceNote: 'Game show pricing starts at $33 per guest. Ask for a free quote for your party’s exact total.',
    totalTime: 'About 90 minutes to 2 hours',
    ages: '6+ to play; younger siblings welcome to watch',
    bookingUrl: business.booking.largeGroupUrl,
  },
];

/** Locations. Add a location object to scale to new venues (West Nyack exists externally). */
export const locations = [
  {
    slug: 'rockaway-nj',
    name: 'Rockaway, NJ — Rockaway Townsquare',
    url: '/location/rockaway-nj/',
    primary: true,
  },
];

/**
 * Communities with search demand in the PPC/GSC data (geo modifiers) or that are
 * the immediate neighbours of Rockaway. Used for service-area copy only — NO doorway pages.
 * Drive times intentionally omitted until verified.
 */
export const nearbyAreas = [
  'Rockaway Township', 'Rockaway Borough', 'Denville', 'Dover', 'Randolph', 'Wharton',
  'Mine Hill', 'Parsippany', 'Mountain Lakes', 'Boonton', 'Kinnelon', 'Jefferson',
  'Roxbury', 'Mount Arlington', 'Morristown', 'Wayne',
];

/**
 * Testimonials — ONLY verified reviews with a source are rendered.
 * The 8 testimonials on the current site have no source attribution and could not be
 * verified, so they are intentionally NOT migrated (see docs/strategy.md).
 */
export const testimonials: Testimonial[] = [];

/** Promotions — rendered only between start/end dates on listed pages. */
export const promotions: Promotion[] = [];

export const activePromotions = (path: string, today = new Date()) =>
  promotions.filter((p) => p.pages.includes(path) && new Date(p.startDate) <= today && today <= new Date(p.endDate));

/** Minimum number of verified reviews before /reviews/ becomes indexable. */
export const REVIEWS_INDEX_THRESHOLD = 3;
