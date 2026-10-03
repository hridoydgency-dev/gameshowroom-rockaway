/** One-time migration: export the TS data modules into editable /content JSON files for the admin (Decap CMS). */
import { writeFileSync, mkdirSync } from 'node:fs';
import { business } from '../src/data/business';
import { faqs } from '../src/data/faqs';
import { testimonials, reviewProfiles, promotions, birthdayPackages, nearbyAreas } from '../src/data/content';
import { routes } from '../src/routes';

mkdirSync('content/blog', { recursive: true });
const w = (f: string, o: unknown) => writeFileSync('content/' + f, JSON.stringify(o, null, 2) + '\n');
const b = business as any;
w('business.json', {
  name: b.name, tagline: b.tagline, description: b.description, phone: b.phone, email: b.email, address: b.address,
  hours: b.hours, pricePerGuestFrom: b.facts.pricePerGuestFrom.value, booking: b.booking, mapsUrl: b.mapsUrl,
  googleBusinessProfileUrl: b.googleBusinessProfileUrl ?? '', nearbyAreas,
});
w('faqs.json', { faqs });
w('reviews.json', { profile: reviewProfiles[0], reviews: testimonials });
w('promotions.json', { promotions });
w('packages.json', { packages: birthdayPackages.map(({ bookingUrl, ...p }) => p) });
w('gallery.json', { photos: [] });
w('seo.json', { pages: routes.filter((r) => !r.path.startsWith('/blog/') || r.path === '/blog/').map((r) => ({ path: r.path, title: r.seo.title, description: r.seo.description })) });
w('settings.json', {
  announcement: { enabled: false, text: '', link: '' },
  homeHero: {
    title: 'Live Game Show Room in Rockaway, NJ',
    lead: 'Your group becomes the contestants: 60 minutes of buzzers, trivia, puzzles and challenges run by a live host. Always private to your group — made for birthdays, team building and nights out.',
  },
  gtmId: '',
});
console.log('content exported');
