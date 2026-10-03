import type { RouteDef } from '../lib/types';
import { Shell } from '../components/Layout';
import { Section, H2, Eyebrow, Button, BookingLink, PhoneLink, EmailLink, MapLink, Card } from '../components/ui';
import { QuoteForm, VisitBlock } from '../components/sections';
import { business } from '../data/business';
import { testimonials, REVIEWS_INDEX_THRESHOLD } from '../data/content';
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
              <div><dt className="text-sm font-bold uppercase tracking-wider text-flash-dark">Email</dt><dd><EmailLink label="contact_page" className="font-bold text-ink underline" /></dd></div>
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

export const reviews: RouteDef = {
  path: '/reviews/', template: 'utility', pageType: 'utility',
  breadcrumb: crumb('Reviews', '/reviews/'),
  seo: {
    title: 'Game Show Room Rockaway Reviews',
    description: 'What groups say about the live Game Show Room at Rockaway Townsquare — verified guest reviews for birthday parties, team building and family nights.',
    primaryTopic: 'game show room rockaway reviews',
    // Auto-indexable once enough verified reviews exist (never fake ones).
    noindex: testimonials.filter((t) => t.verified).length < REVIEWS_INDEX_THRESHOLD,
  },
  sitemap: { priority: 0.5, changefreq: 'monthly' },
  render: () => {
    const verified = testimonials.filter((t) => t.verified);
    return (
      <Shell breadcrumb={crumb('Reviews', '/reviews/')}>
        <Section tone="light">
          <Eyebrow>Reviews</Eyebrow>
          <h1 className="text-[2rem] font-black sm:text-5xl">Game Show Room Rockaway reviews</h1>
          {verified.length ? (
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {verified.map((t) => (
                <li key={t.id}><Card><blockquote className="text-lg">&ldquo;{t.text}&rdquo;</blockquote><p className="mt-3 font-bold">{t.author}{t.occasion ? ` · ${t.occasion}` : ''}</p><p className="text-sm text-muted">Source: {t.sourceUrl ? <a href={t.sourceUrl} rel="noopener">{t.source}</a> : t.source}</p></Card></li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 max-w-2xl space-y-4 text-lg">
              <p>We only publish reviews we can link back to a real, verifiable source. Our guest reviews are collected on our public profiles — read them there, and if you&rsquo;ve played, we&rsquo;d love to hear from you.</p>
              {config.googleBusinessProfileUrl && (
                <p><a href={config.googleBusinessProfileUrl} rel="noopener" className="font-bold text-flash-dark underline">Read Game Show Room Rockaway reviews on Google</a></p>
              )}
              <p>Planning a party and want to talk to a real person first? Call <PhoneLink label="reviews_page" className="font-bold text-flash-dark underline" />.</p>
            </div>
          )}
        </Section>
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
