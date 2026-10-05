/**
 * Real venue photography from Game Show Room Rockaway (sourced from gameshowroomrockaway.com,
 * optimized to WebP in public/images/brand). Only authentic event photos are used — no stock
 * composites. Alt text describes what is visible; never imply a photo shows a specific reviewer.
 */
export type Photo = { src: string; card?: string; mobile?: string; w: number; h: number; alt: string; position?: string };

export const photos = {
  home: {"src": "/images/brand/home.webp", "card": "/images/brand/home-900.webp", "mobile": "/images/brand/home-m.webp", "w": 1600, "h": 900, "alt": "Contestants celebrate at the glowing 3400-point buzzer podium in front of the prize wheel at Game Show Room Rockaway", "position": "50% 50%"},
  gameShow: {"src": "/images/brand/gameShow.webp", "card": "/images/brand/gameShow-900.webp", "mobile": "/images/brand/gameShow-m.webp", "w": 1600, "h": 1067, "alt": "A group poses on the game show stage in front of the Team Battle scoreboard at Game Show Room Rockaway", "position": "50% 45%"},
  birthday: {"src": "/images/brand/birthday.webp", "card": "/images/brand/birthday-900.webp", "mobile": "/images/brand/birthday-m.webp", "w": 1600, "h": 1067, "alt": "Guests in party hats cheer during a birthday game show at Game Show Room Rockaway", "position": "50% 40%"},
  kids: {"src": "/images/brand/kids.webp", "card": "/images/brand/kids-900.webp", "mobile": "/images/brand/kids-m.webp", "w": 1600, "h": 1067, "alt": "Kids race to stack cups during a game show challenge at Game Show Room Rockaway", "position": "50% 40%"},
  teen: {"src": "/images/brand/teen.webp", "card": "/images/brand/teen-900.webp", "mobile": "/images/brand/teen-m.webp", "w": 1600, "h": 1067, "alt": "A young contestant at the buzzer podium during a live game show round", "position": "55% 50%"},
  adult: {"src": "/images/brand/adult.webp", "card": "/images/brand/adult-900.webp", "mobile": "/images/brand/adult-m.webp", "w": 1600, "h": 1067, "alt": "Adults in party hats celebrating a win at the game show podium", "position": "45% 40%"},
  groups: {"src": "/images/brand/groups.webp", "card": "/images/brand/groups-900.webp", "mobile": "/images/brand/groups-m.webp", "w": 1600, "h": 1067, "alt": "Players compete in a ball-toss challenge at the game show table", "position": "50% 50%"},
  corporate: {"src": "/images/brand/corporate.webp", "card": "/images/brand/corporate-900.webp", "mobile": "/images/brand/corporate-m.webp", "w": 1600, "h": 1067, "alt": "A contestant writes an answer on the board during a game show round", "position": "50% 40%"},
  school: {"src": "/images/brand/school.webp", "card": "/images/brand/school-900.webp", "mobile": "/images/brand/school-m.webp", "w": 1600, "h": 1067, "alt": "A young player hops through a challenge while teammates watch from the stage", "position": "50% 45%"},
  reviews: {"src": "/images/brand/reviews.webp", "card": "/images/brand/reviews-900.webp", "mobile": "/images/brand/reviews-m.webp", "w": 1600, "h": 1067, "alt": "A family claps and cheers at the buzzer podium during their game show", "position": "50% 40%"},
  faq: {"src": "/images/brand/faq.webp", "card": "/images/brand/faq-900.webp", "mobile": "/images/brand/faq-m.webp", "w": 1600, "h": 1067, "alt": "Contestants line up at their podiums with the host during a game show", "position": "50% 40%"},
  contact: {"src": "/images/brand/contact.webp", "card": "/images/brand/contact-900.webp", "mobile": "/images/brand/contact-m.webp", "w": 1600, "h": 1067, "alt": "Game show props \u2014 colored cups, ball baskets and an hourglass on the challenge table", "position": "50% 50%"},
  location: {"src": "/images/brand/location.webp", "card": "/images/brand/location-900.webp", "mobile": "/images/brand/location-m.webp", "w": 1600, "h": 1067, "alt": "Players clap and celebrate around the game show podium", "position": "50% 40%"},
  winners: {"src": "/images/brand/winners.webp", "card": "/images/brand/winners-900.webp", "mobile": "/images/brand/winners-m.webp", "w": 1600, "h": 1067, "alt": "A winning family holds the giant Game Show Room prize check on stage", "position": "50% 45%"},
  cups: {"src": "/images/brand/cups.webp", "card": "/images/brand/cups-900.webp", "mobile": "/images/brand/cups-m.webp", "w": 1600, "h": 1067, "alt": "Players build a cup pyramid during a game show challenge", "position": "50% 50%"},
  buzzer: {"src": "/images/brand/buzzer.webp", "card": "/images/brand/buzzer-900.webp", "mobile": "/images/brand/buzzer-m.webp", "w": 1600, "h": 1067, "alt": "A child helps stack cups with family during a game show round", "position": "50% 40%"},
  stacking: {"src": "/images/brand/stacking.webp", "card": "/images/brand/stacking-900.webp", "mobile": "/images/brand/stacking-m.webp", "w": 1600, "h": 1067, "alt": "A family concentrates on a cup-stacking challenge at the game show table", "position": "50% 40%"},
  host: {"src": "/images/brand/host.webp", "card": "/images/brand/host-900.webp", "mobile": "/images/brand/host-m.webp", "w": 1600, "h": 2400, "alt": "A contestant at the podium during a live-hosted game show round", "position": "50% 40%"},
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

/** Gallery order (home + game show page). */
export const galleryKeys: PhotoKey[] = ['winners', 'cups', 'kids', 'groups', 'stacking', 'location', 'teen', 'corporate'];
