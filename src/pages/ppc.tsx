/**
 * PPC landing pages — message-matched to ad groups found in the search-term data.
 * noindex (they duplicate organic intent on purpose), minimal navigation, ONE primary action.
 * Add a new landing page by adding an object to `landingPages`.
 */
import type { RouteDef } from '../lib/types';
import { Shell } from '../components/Layout';
import { Hero, Steps, PackageCard, QuoteForm, TrustRow, PriceStrip, VisitBlock } from '../components/sections';
import { Section, Eyebrow, H2, Button, BookingLink, CheckList } from '../components/ui';
import { ReviewSnippets, GoogleRatingLine } from '../components/reviews';
import { faqsByIds } from '../data/faqs';

interface LP {
  slug: string; adGroups: string[]; title: string; description: string;
  eyebrow: string; h1: string; lead: string; goal: 'quote' | 'book';
  chips: { k: string; v: string }[]; bullets: string[]; faqIds: string[]; defaultType?: string;
  view: string;
}

export const landingPages: LP[] = [
  {
    slug: 'game-show-room', view: 'view_game_show',
    adGroups: ['"game show room rockaway"', '"game show room"', '"the game show room"'],
    title: 'Game Show Room Rockaway NJ — Book Online',
    description: 'Official Game Show Room at Rockaway Townsquare. Private 60-minute live game show, ages 6+, from $%PRICE%/guest. Book online.',
    eyebrow: 'Game Show Room · Rockaway Townsquare', h1: 'Game Show Room — Rockaway, NJ',
    lead: 'Private, host-led live game show: 60 minutes of buzzers, trivia, puzzles and challenges. Pick a time and you’re booked.',
    goal: 'book', chips: [{ k: 'Price', v: 'From $%PRICE%/guest' }, { k: 'Length', v: '60 min' }, { k: 'Ages', v: '6+' }, { k: 'Group', v: '6–8 players' }],
    bullets: ['Private to your group', 'Live host, buzzers, lights & music', 'Free parking — enter by JCPenney', 'Book at least 48 hours ahead'],
    faqIds: ['price', 'players', 'ages', 'where'],
  },
  {
    slug: 'game-show-experience', view: 'view_game_show',
    adGroups: ['"game show"', '"live game show"', '"game show experience"', '"unique game show"', '"game shows in new jersey"', 'competitor terms (American Dream / Great Big Game Show)'],
    title: 'Live Game Show Experience in NJ — Morris County',
    description: 'Play a real live game show with your group at Rockaway Townsquare, NJ. Private sessions, live host, ages 6+, from $%PRICE% per guest.',
    eyebrow: 'Live game show experience · New Jersey', h1: 'Play a live game show — right here in Morris County',
    lead: 'Your group on the buzzers with a live host, lights and music. Private sessions at Rockaway Townsquare — no city traffic, free parking.',
    goal: 'book', chips: [{ k: 'Where', v: 'Rockaway, NJ' }, { k: 'Price', v: 'From $%PRICE%/guest' }, { k: 'Privacy', v: 'Your group only' }, { k: 'Big groups', v: 'Up to 60' }],
    bullets: ['Every session private to your group — no strangers on your team', 'Family, kid-focused or adult-level questions', 'Groups of 6–8, or 40–60 for events', 'Free surface parking at Rockaway Townsquare'],
    faqIds: ['what-is', 'private', 'price', 'players'],
  },
  {
    slug: 'kids-birthday-party', view: 'view_birthday_party',
    adGroups: ['"kids birthday party places"', '"kids birthday parties"', '"birthday party places kids"', '"birthday near me kids"', '"kid birthday party places"', '"kids birthday party venues"'],
    title: 'Kids Birthday Party Place Near Rockaway NJ',
    description: 'Indoor kids birthday party for ages 6–12: private live game show + party room at Rockaway Townsquare. Bring your own cake. Free quote.',
    eyebrow: 'Kids birthday parties · ages 6–12', h1: 'Kids birthday party place in Rockaway, NJ',
    lead: '1 hour of live game show starring the birthday kid + 1 hour in a private Party Room for cake. Indoors, private, and parents can relax.',
    goal: 'quote', defaultType: 'Kids birthday party',
    chips: [{ k: 'Ages', v: '6–12' }, { k: 'Party', v: '~2 hours' }, { k: 'Price', v: 'From $%PRICE%/guest' }, { k: 'Cake', v: 'Bring your own' }],
    bullets: ['A host runs the whole game — every kid plays', 'Custom trivia about the birthday kid', 'Private Party Room for cake, pizza or catering', 'Free parking at Rockaway Townsquare'],
    faqIds: ['bday-how', 'price', 'bday-cake', 'bday-supervision', 'bday-little'],
  },
  {
    slug: 'birthday-party', view: 'view_birthday_party',
    adGroups: ['"birthday party places"', '"places to celebrate birthday"', '"birthday party venue"', '"birthday parties near me"', '"options for birthday party"', '"teen birthday party ideas"', '"birthday activities for adults"'],
    title: 'Birthday Party Venue in Rockaway NJ — Game Show',
    description: 'A birthday party venue for kids 6+, teens & adults: private live game show + party room at Rockaway Townsquare. Free quote.',
    eyebrow: 'Birthday parties · all ages 6+', h1: 'A birthday party where the guest of honor is the star of the show',
    lead: 'Private, host-led game show with custom birthday trivia — then an extra hour in a private Party Room. For kids, teens and adults at Rockaway Townsquare.',
    goal: 'quote', defaultType: 'Kids birthday party',
    chips: [{ k: 'Ages', v: '6 to 60+' }, { k: 'Party', v: '~90 min–2 hrs' }, { k: 'Price', v: 'From $%PRICE%/guest' }, { k: 'Room', v: 'Private' }],
    bullets: ['Kids, teen, Sweet 16 and adult versions', 'Custom trivia & spotlight moments', 'Bring your own cake, food & decorations', 'Groups from 6 up to 60'],
    faqIds: ['bday-how', 'price', 'ages', 'bday-cake', 'bday-advance'],
  },
  {
    slug: 'team-building', view: 'view_service',
    adGroups: ['team building', 'corporate game show host', 'group activities'],
    title: 'Team Building Game Show — Morris County NJ',
    description: 'Private live game show for teams of 8–60 with custom company trivia. Rockaway Townsquare, NJ. Get a free quote.',
    eyebrow: 'Corporate team building', h1: 'Team building your team will actually enjoy',
    lead: 'Host-led game show with company-specific trivia, rotating teams and one overall champion. 8 to 60 players at Rockaway Townsquare.',
    goal: 'quote', defaultType: 'Corporate / team building',
    chips: [{ k: 'Team size', v: '8–60' }, { k: 'Trivia', v: 'Custom' }, { k: 'Access', v: 'Wheelchair OK' }, { k: 'Parking', v: 'Free' }],
    bullets: ['Company or industry trivia rounds', 'Teams rotate; scores combine into one leaderboard', 'Seasonal holiday-party shows', 'Off Route 80 in Rockaway'],
    faqIds: ['corporate', 'large', 'deposit', 'accessible'],
  },
];

export const ppcRoutes: RouteDef[] = landingPages.map((lp) => {
  const path = `/lp/${lp.slug}/`;
  const faqs = faqsByIds(lp.faqIds);
  const primary = lp.goal === 'book'
    ? <BookingLink kind="small" label={`lp_${lp.slug}_hero`} size="lg">See available times</BookingLink>
    : <Button href="#quote" size="lg" track={{ event: 'click_book_now', label: `lp_${lp.slug}_hero` }}>Get my free quote</Button>;
  return {
    path, template: 'ppc', pageType: 'ppc', layout: 'ppc', trackView: lp.view,
    seo: { title: lp.title, description: lp.description, primaryTopic: lp.adGroups[0].replace(/"/g, ''), noindex: true, canonical: undefined },
    render: () => (
      <Shell minimal sticky={lp.goal === 'book' ? { href: '#book', label: 'See available times' } : { href: '#quote', label: 'Get my free quote' }}>
        <Hero
          image={/kid/.test(lp.slug) ? 'kids' : /birthday|party/.test(lp.slug) ? 'birthday' : /team|corporate/.test(lp.slug) ? 'corporate' : 'home'} eyebrow={lp.eyebrow} title={lp.h1} lead={lp.lead} chips={lp.chips} primary={primary}
          secondary={lp.goal === 'quote' ? <BookingLink kind="large" label={`lp_${lp.slug}_hero_calendar`} size="lg" variant="ghost-light">Check party dates</BookingLink> : undefined}
          note={<span className="flex flex-wrap items-center gap-x-3 gap-y-1"><GoogleRatingLine dark label={`lp_${lp.slug}_hero`} /><span>Rockaway Townsquare · Rockaway NJ</span></span>}
        />
        <Section tone="light">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <Eyebrow>Why groups book us</Eyebrow>
              <H2>Everything you need, nothing you don&rsquo;t</H2>
              <CheckList items={lp.bullets} />
              <div className="mt-6"><PriceStrip trackLabel={`lp_${lp.slug}`} /></div>
            </div>
            {lp.goal === 'quote' ? <PackageCard trackLabel={`lp_${lp.slug}`} /> : (
              <div id="book" className="rounded-[var(--radius-card)] border border-edge bg-panel p-6 shadow-[var(--shadow-pop)]">
                <h2 className="text-2xl font-bold">Book in under 2 minutes</h2>
                <p className="mt-2 text-mist">Choose your date and time for 6–8 players. Bigger group or a party? Use the party calendar.</p>
                <div className="mt-5 grid gap-3">
                  <BookingLink kind="small" label={`lp_${lp.slug}_card`} size="lg">See available times</BookingLink>
                  <BookingLink kind="large" label={`lp_${lp.slug}_card_large`} variant="outline">Party &amp; large-group calendar</BookingLink>
                </div>
              </div>
            )}
          </div>
          <div className="mt-10"><TrustRow /></div>
        </Section>
        <ReviewSnippets path={path} tone="paper" />
        <Section tone="dark">
          <H2>How it works</H2>
          <Steps dark steps={[
            { title: lp.goal === 'book' ? 'Pick a time' : 'Request a quote', body: lp.goal === 'book' ? 'Book online — at least 48 hours ahead.' : 'Date + guest count. We reply with availability & price.' },
            { title: 'Arrive early', body: '10–15 minutes before. Free parking; enter by JCPenney.' },
            { title: 'Play the show', body: '60 minutes with a live host, buzzers and lights.' },
            { title: lp.goal === 'book' ? 'Crown a champion' : 'Party Room', body: lp.goal === 'book' ? 'Bragging rights included.' : 'Extra hour for cake & presents.' },
          ]} />
        </Section>
        {lp.goal === 'quote' && (
          <Section tone="paper" id="quote"><div className="mx-auto max-w-3xl"><QuoteForm context={`lp_${lp.slug}`} defaultType={lp.defaultType} /></div></Section>
        )}
        <Section tone="light">
          <H2 className="text-2xl sm:text-3xl">Quick answers</H2>
          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.id} className="rounded-2xl border border-edge bg-panel p-5"><dt className="font-bold">{f.q}</dt><dd className="mt-1 text-mist">{f.a}</dd></div>
            ))}
          </dl>
        </Section>
        <VisitBlock id={`lp-${lp.slug}-visit`} />
      </Shell>
    ),
  };
});
