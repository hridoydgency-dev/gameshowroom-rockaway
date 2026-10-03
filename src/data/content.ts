/**
 * Reusable content collections: experiences, birthday packages, locations,
 * testimonials, promotions, nearby areas. Add entries here — pages render them.
 */
import type { Testimonial, Promotion, ReviewProfile } from '../lib/types';
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
 * Google Business Profile snapshot (read 2026-10-03 from the public listing,
 * kgmid /g/11yjpxzm89). Update `rating`, `count` and `capturedAt` whenever reviews change.
 * Shown as visible text only — NOT emitted as AggregateRating schema (Google treats a business
 * marking up its own reviews as self-serving and ineligible for review rich results).
 */
export const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/place/Game+Show+Room/@40.9080992,-74.5537202,17z/data=!4m8!3m7!1s0x89c30b1c819ea4f3:0x32f3b4377b6ec2e4!8m2!3d40.9080992!4d-74.5537202!9m1!1b1!16s%2Fg%2F11yjpxzm89';

export const reviewProfiles: ReviewProfile[] = [
  { platform: 'google', name: 'Google', rating: 5.0, count: 5, capturedAt: '2026-10-03', url: GOOGLE_REVIEWS_URL },
];

/**
 * Testimonials — ONLY verified reviews with a public source are rendered.
 * These are the Google reviews on the Game Show Room Rockaway profile (copied verbatim,
 * 2026-10-03). Authors are shown as first name + last initial (or the public username).
 * The 8 unsourced testimonials on the old WordPress site are intentionally NOT used.
 */
export const testimonials: Testimonial[] = [
  {
    id: 'g-ayouniques1', author: 'ayouniques1', source: 'google', sourceUrl: GOOGLE_REVIEWS_URL, rating: 5, date: '2026-07', verified: true,
    occasion: "Daughter's 10th birthday party",
    pages: ['/', '/birthday-parties/', '/birthday-parties/kids/', '/lp/kids-birthday-party/', '/lp/birthday-party/'],
    highlight: 'One of our favorite touches was the customized Harry Potter and Disney trivia they created for our group.',
    text: "Did our daughter's 10th birthday party here and overall it was a great experience! Dakota was a fantastic game show host; he came dressed to impress and did an amazing job keeping the kids engaged, laughing, and having fun throughout the event. One of our favorite touches was the customized Harry Potter and Disney trivia they created for our group. The kids were absolutely stoked whenever those categories came up! I also want to recognize manager Amelia, who stayed in communication throughout and ensured that we had a great experience. Most importantly, my daughter and her friends had an absolute blast, and that's what mattered most. Thank you for helping create such a special birthday celebration!",
  },
  {
    id: 'g-coryanna', author: 'Coryanna D.', source: 'google', sourceUrl: GOOGLE_REVIEWS_URL, rating: 5, date: '2026-06', verified: true,
    occasion: 'Family party with the Party Room',
    pages: ['/birthday-parties/', '/birthday-parties/adult/', '/group-events/', '/lp/birthday-party/'],
    highlight: 'A great and fun experience for all ages, children and adults.',
    text: 'My family and I did a party room was a great and fun experience for all ages children and adults. 10/10 recommend this place and our game host Dakota!!',
  },
  {
    id: 'g-ray', author: 'Ray H.', source: 'google', sourceUrl: GOOGLE_REVIEWS_URL, rating: 5, date: '2026-04', verified: true,
    occasion: 'Group of friends',
    pages: ['/', '/game-show-experience/', '/group-events/', '/lp/game-show-room/', '/lp/game-show-experience/'],
    highlight: 'Had a blast with our group of friends!',
    text: 'Dakota was awesome! Had a blast with our group of friends!',
  },
  {
    id: 'g-jasmine', author: 'Jasmine H.', source: 'google', sourceUrl: GOOGLE_REVIEWS_URL, rating: 5, date: '2026-06', verified: true,
    pages: ['/game-show-experience/', '/lp/game-show-experience/'],
    text: 'Dakota was great .. we had a blast !',
  },
  {
    id: 'g-jon', author: 'Jon T.', source: 'google', sourceUrl: GOOGLE_REVIEWS_URL, rating: 5, date: '2026-07', verified: true,
    pages: ['/game-show-experience/', '/lp/game-show-room/'],
    text: 'Great game show fun',
  },
];

export const reviewsFor = (path: string, limit = 3) => testimonials.filter((t) => t.verified && t.pages?.includes(path)).slice(0, limit);

/** Promotions — rendered only between start/end dates on listed pages. */
export const promotions: Promotion[] = [];

export const activePromotions = (path: string, today = new Date()) =>
  promotions.filter((p) => p.pages.includes(path) && new Date(p.startDate) <= today && today <= new Date(p.endDate));

/** Minimum number of verified reviews before /reviews/ becomes indexable. */
export const REVIEWS_INDEX_THRESHOLD = 3;
