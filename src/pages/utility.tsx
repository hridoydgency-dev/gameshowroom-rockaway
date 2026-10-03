import type { RouteDef } from '../lib/types';
import { Shell } from '../components/Layout';
import { Section, H2, Eyebrow, Button, BookingLink, PhoneLink, EmailLink, MapLink, Card } from '../components/ui';
import { QuoteForm, VisitBlock, CtaBand } from '../components/sections';
import { RatingSummary, ReviewWall } from '../components/reviews';
import { business } from '../data/business';
import { testimonials, reviewProfiles, REVIEWS_INDEX_THRESHOLD } from '../data/content';
import { config } from '../lib/config';

const crumb = (name: string, path: string) => [{ name: 'Home', path: '/' }, { name, path }];

export const notFound: RouteDef = {
  path: '/404/', template: 'utility', pageType: 'utility',
  seo: { title: 'Page not found | Game Show Room Rockaway', description: 'This page has moved or no longer exists. Find the live game show, birthday parties and booking here.', primaryTopic: '404', noindex: true },
  render: () => (
    <Shell>
      <Section tone="light">
        <div className="mx-auto max-w-2xl py-8 text-center">
          <p className="font-[family-name:var(--font-display)] text-7xl text-flash-dark">404</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Wrong answer — this page isn&rsquo;t here</h1>
          <p className="mt-3 text-lg text-muted">It may have moved when we rebuilt the site. Try one of these instead:</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button href="/game-show-experience/" variant="outline">The game show</Button>
            <Button href="/birthday-parties/" variant="outline">Birthday parties</Button>
            <Button href="/pricing/" variant="outline">Pricing</Button>
            <Button href="/book/" track={{ event: 'click_book_now', label: '404' }}>Book now</Button>
          </div>
        </div>
      </Section>
    </Shell>
  ),
};

export const book: RouteDef = {
  path: '/book/', template: 'utility', pageType: 'utility', trackView: 'view_booking',
  breadcrumb: crumb('Book', '/book/'),
  seo: {
    title: 'Book the Game Show Room in Rockaway, NJ',
    description: 'Book a private 60-minute live game show for 6–8 players online, or request a free quote for birthday parties, corporate events and groups up to 60.',
    primaryTopic: 'book game show rockaway',
  },
  sitemap: { priority: 0.8, changefreq: 'monthly' },
  render: () => (
    <Shell breadcrumb={crumb('Book', '/book/')} sticky={{ href: '#quote', label: 'Get a party quote' }}>
      <Section tone="light">
        <Eyebrow>Booking</Eyebrow>
        <h1 className="text-[2rem] font-black sm:text-5xl">Book the Game Show Room</h1>
        <p className="mt-3 max-w-2xl text-lg">Choose the option that fits your group. Please book at least <strong>48 hours in advance</strong> — weekends and evenings fill first. Need it sooner? Call <PhoneLink label="book_intro" className="font-bold text-flash-dark underline" />.</p>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <Card>
            <p className="text-sm font-bold uppercase tracking-wider text-flash-dark">Small group · 6–8 players</p>
            <h2 className="mt-1 text-2xl font-black">Book online now</h2>
            <p className="mt-2 text-muted">Friends, family, date night with another couple or two. Pick a date and time, pay online. From $33 per guest.</p>
            <BookingLink kind="small" label="book_page_small" size="lg" className="mt-5 w-full">See available times</BookingLink>
          </Card>
          <Card>
            <p className="text-sm font-bold uppercase tracking-wider text-flash-dark">Party · large group</p>
            <h2 className="mt-1 text-2xl font-black">Party &amp; group calendar</h2>
            <p className="mt-2 text-muted">Birthday Party Package (1 hour of game show + 1 hour in the private Party Room) and groups bigger than 8.</p>
            <BookingLink kind="large" label="book_page_large" size="lg" variant="dark" className="mt-5 w-full">Check party dates</BookingLink>
          </Card>
          <Card>
            <p className="text-sm font-bold uppercase tracking-wider text-flash-dark">Not sure yet?</p>
            <h2 className="mt-1 text-2xl font-black">Ask for a free quote</h2>
            <p className="mt-2 text-muted">Corporate, school, 20+ guests, custom trivia, or you just want an exact price first. We reply with availability.</p>
            <Button href="#quote" size="lg" variant="outline" className="mt-5 w-full" track={{ event: 'click_book_now', label: 'book_page_quote' }}>Request a quote</Button>
          </Card>
        </div>
      </Section>
      <Section id="quote" tone="paper">
        <div className="mx-auto max-w-3xl"><QuoteForm context="book_page" /></div>
      </Section>
    </Shell>
  ),
};

export const thankYou: RouteDef = {
  path: '/thank-you/', template: 'utility', pageType: 'utility',
  seo: { title: 'Thanks — we got your request | Game Show Room', description: 'Your event quote request was received. We will reply with availability and pricing.', primaryTopic: 'lead confirmation', noindex: true },
  render: () => (
    <Shell sticky={false}>
      <Section tone="light">
        <div className="mx-auto max-w-2xl py-6 text-center">
          <p className="text-6xl" aria-hidden="true">🏆</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Request received — you&rsquo;re in the game!</h1>
          <p className="mt-3 text-lg text-muted">The Rockaway team will reply with availability and an exact price. Need an answer sooner? Call <PhoneLink label="thank_you" className="font-bold text-flash-dark underline" />.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/faq/" variant="outline">Read the FAQ</Button>
            <Button href="/location/rockaway-nj/" variant="outline">Directions &amp; parking</Button>
          </div>
        </div>
      </Section>
    </Shell>
  ),
};

export const contact: RouteDef = {
  path: '/contact/', template: 'utility', pageType: 'utility',
  breadcrumb: crumb('Contact', '/contact/'),
  seo: {
    title: 'Contact Game Show Room Rockaway | (862) 200-7134',
    description: 'Call (862) 200-7134 or email the Game Show Room at Rockaway Townsquare, 301 Mt Hope Ave, Rockaway NJ. Hours, directions and event quotes.',
    primaryTopic: 'contact game show room rockaway',
  },
  sitemap: { priority: 0.5, changefreq: 'yearly' },
  render: () => (
    <Shell breadcrumb={crumb('Contact', '/contact/')}>
      <Section tone="light">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="text-[2rem] font-black sm:text-5xl">Contact Game Show Room Rockaway</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-2xl font-black">Talk to the Rockaway team</h2>
            <dl className="mt-4 space-y-3 text-lg">
              <div><dt className="text-sm font-bold uppercase tracking-wider text-flash-dark">Phone</dt><dd><PhoneLink label="contact_page" className="font-black text-ink underline" /></dd></div>
              <div><dt className="text-sm font-bold uppercase tracking-wider text-flash-dark">Email</dt><dd className="[overflow-wrap:anywhere]"><EmailLink label="contact_page" className="font-bold text-ink underline" /></dd></div>
              <div><dt className="text-sm font-bold uppercase tracking-wider text-flash-dark">Address</dt><dd>{business.address.street}, {business.address.city}, {business.address.region} {business.address.postalCode}<br /><span className="text-muted">Inside Rockaway Townsquare, first floor by JCPenney</span></dd></div>
            </dl>
            <MapLink label="contact_page" className="mt-5 inline-flex min-h-12 items-center rounded-full border-2 border-ink bg-gold px-6 font-bold text-ink no-underline">Get directions</MapLink>
          </Card>
          <QuoteForm context="contact_page" heading="Planning an event? Get a quote" />
        </div>
      </Section>
      <VisitBlock id="contact-visit" />
    </Shell>
  ),
};

/** Review themes — counts are computed from the verified reviews at build time, so they stay accurate. */
const reviewThemes: { label: string; re: RegExp; href: string; link: string }[] = [
  { label: 'Praise the host by name', re: /dakota|host/i, href: '/game-show-experience/', link: 'How the live-hosted show works' },
  { label: 'Celebrated a birthday or party', re: /birthday|party/i, href: '/birthday-parties/', link: 'Birthday party package' },
  { label: 'Came as a group of friends or family', re: /friends|family|group/i, href: '/group-events/', link: 'Group events' },
  { label: 'Mention fun for all ages / kids', re: /all ages|kids|children/i, href: '/birthday-parties/kids/', link: 'Kids parties (6+)' },
  { label: 'Mention custom trivia', re: /custom/i, href: '/birthday-parties/', link: 'Custom birthday trivia' },
];

export const reviews: RouteDef = {
  path: '/reviews/', template: 'utility', pageType: 'utility', trackView: 'view_reviews',
  breadcrumb: crumb('Reviews', '/reviews/'),
  seo: {
    title: 'Game Show Room Rockaway Reviews | 5.0 on Google',
    description: 'Read verified Google reviews of the live Game Show Room at Rockaway Townsquare, NJ: kids birthday parties, family parties and friend groups. Rated 5.0.',
    primaryTopic: 'game show room rockaway reviews',
    // Auto-indexable once enough verified reviews exist (never fake ones).
    noindex: testimonials.filter((t) => t.verified).length < REVIEWS_INDEX_THRESHOLD,
  },
  sitemap: { priority: 0.6, changefreq: 'monthly' },
  lastModified: reviewProfiles[0].capturedAt,
  render: () => {
    const verified = testimonials.filter((t) => t.verified);
    const g = reviewProfiles[0];
    return (
      <Shell breadcrumb={crumb('Reviews', '/reviews/')}>
        <Section tone="light">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <Eyebrow>Reviews</Eyebrow>
              <h1 className="text-[2rem] font-black leading-tight sm:text-5xl">Game Show Room Rockaway reviews</h1>
              <p className="mt-4 max-w-xl text-lg">
                Every review on this page is copied word-for-word from our public <strong>Google Business Profile</strong> and links back to the original.
                We don&rsquo;t edit, select or invent reviews — {g.count === verified.length ? 'these are all of them' : 'see Google for the full list'}.
              </p>
            </div>
            <RatingSummary />
          </div>
          {verified.length > 0 && (
            <>
              <h2 className="mt-12 text-2xl font-black sm:text-3xl">What guests mention most</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {reviewThemes
                  .map((th) => ({ ...th, n: verified.filter((t) => th.re.test(t.text)).length }))
                  .filter((th) => th.n > 0)
                  .sort((a, b) => b.n - a.n)
                  .map((th) => (
                    <li key={th.label} className="rounded-2xl border-2 border-ink bg-paper p-4">
                      <p className="font-[family-name:var(--font-display)] text-3xl">{th.n} of {verified.length}</p>
                      <p className="font-bold">{th.label}</p>
                      <a href={th.href} className="mt-1 inline-block text-sm font-bold text-flash-dark underline">{th.link}</a>
                    </li>
                  ))}
              </ul>
              <h2 className="mt-12 text-2xl font-black sm:text-3xl">All Google reviews</h2>
              <ReviewWall />
            </>
          )}
          <div className="mt-10 rounded-2xl border-2 border-dashed border-ink/40 p-5 text-lg">
            <p><strong>Played with us?</strong> Reviews help other Morris County families and teams find us. <a href={g.url} rel="noopener" target="_blank" className="font-bold text-flash-dark underline" data-track="review_write_click" data-track-label="reviews_footer">Leave a Google review</a> — it takes about a minute.</p>
            <p className="mt-2 text-base text-muted">Questions before you book? Call <PhoneLink label="reviews_page" className="font-bold text-flash-dark underline" />.</p>
          </div>
        </Section>
        <CtaBand label="reviews" title="Ready to be the next 5-star game show?" body="Book a private 60-minute show, or get a quote for your birthday or group event." />
      </Shell>
    );
  },
};

const legalPage = (path: string, name: string): RouteDef => ({
  path, template: 'legal', pageType: 'utility', breadcrumb: crumb(name, path),
  seo: { title: `${name} | Game Show Room Rockaway`, description: `${name} for gameshowroomrockaway.com, the website of Game Show Room at Rockaway Townsquare, Rockaway, New Jersey.`, primaryTopic: 'legal', noindex: true },
  render: () => (
    <Shell breadcrumb={crumb(name, path)}>
      <Section tone="light">
        <h1 className="text-3xl font-black sm:text-4xl">{name}</h1>
        <div className="prose-x mt-4 max-w-2xl">
          <p><strong>Pending legal review.</strong> The business&rsquo;s official {name.toLowerCase()} will be published here. This page is intentionally set to <code>noindex</code> until approved text is supplied.</p>
          <p>This website uses Google Consent Mode. Marketing cookies (advertising measurement) load only after you choose &ldquo;Accept all&rdquo; in Cookie settings. Event quote form submissions are used only to respond to your enquiry.</p>
          <p>Questions: <EmailLink label={`legal_${path}`} /> · <PhoneLink label={`legal_${path}`} /></p>
        </div>
      </Section>
    </Shell>
  ),
});
export const privacy = legalPage('/privacy/', 'Privacy Policy');
export const terms = legalPage('/terms/', 'Terms of Use');
