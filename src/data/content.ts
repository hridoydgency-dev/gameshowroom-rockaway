/**
 * Reusable content collections: experiences, birthday packages, locations,
 * testimonials, promotions, nearby areas. Add entries here — pages render them.
 */
import type { Testimonial, Promotion, ReviewProfile } from '../lib/types';
import { business } from './business';
import { businessContent, reviewContent, promotionContent, packageContent, galleryContent } from '../lib/content-store';

/** Photos uploaded in /admin → Photos. */
export const gallery = galleryContent as { image: string; alt: string; caption?: string }[];

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
export const birthdayPackages = (packageContent as any[]).map((p) => ({
  ...p,
  price: (p.price ?? null) as number | null,
  bookingUrl: business.booking.largeGroupUrl,
}));

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
export const nearbyAreas: string[] = businessContent.nearbyAreas ?? [];

/**
 * Google Business Profile snapshot (read 2026-10-03 from the public listing,
 * kgmid /g/11yjpxzm89). Update `rating`, `count` and `capturedAt` whenever reviews change.
 * Shown as visible text only — NOT emitted as AggregateRating schema (Google treats a business
 * marking up its own reviews as self-serving and ineligible for review rich results).
 */
export const reviewProfiles: ReviewProfile[] = [reviewContent.profile as ReviewProfile];
export const GOOGLE_REVIEWS_URL = reviewProfiles[0].url;

/**
 * Testimonials — ONLY verified reviews with a public source are rendered.
 * Edited in /admin → Reviews (content/reviews.json); copied verbatim from Google.
 * The 8 unsourced testimonials on the old WordPress site are intentionally NOT used.
 */
export const testimonials: Testimonial[] = reviewContent.reviews as Testimonial[];

export const reviewsFor = (path: string, limit = 3) => testimonials.filter((t) => t.verified && t.pages?.includes(path)).slice(0, limit);

/** Promotions — rendered only between start/end dates on listed pages. */
export const promotions: Promotion[] = promotionContent as Promotion[];

export const activePromotions = (path: string, today = new Date()) =>
  promotions.filter((p) => p.pages.includes(path) && new Date(p.startDate) <= today && today <= new Date(p.endDate));

/** Minimum number of verified reviews before /reviews/ becomes indexable. */
export const REVIEWS_INDEX_THRESHOLD = 3;
