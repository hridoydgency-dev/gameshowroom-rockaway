import type { RouteDef } from '../lib/types';
import { Shell } from '../components/Layout';
import { Hero, QuickAnswer, Steps, Features, FAQSection, PriceStrip, PackageCard, VisitBlock, CtaBand, TrustRow, PromoSlot, Photo, Gallery } from '../components/sections';
import { photos, type PhotoKey } from '../data/images';
import { Section, Eyebrow, H2, Button, BookingLink, SectionHead } from '../components/ui';
import { ReviewSnippets, GoogleRatingLine } from '../components/reviews';
import { faqsByIds } from '../data/faqs';
import { settingsContent } from '../lib/content-store';

/** Highlight the place name in gold when the editor's headline contains it. */
const heroTitle = (t: string) => {
  const m = t.match(/(Rockaway,? NJ|Rockaway)/);
  if (!m || m.index === undefined) return <>{t}</>;
  return <>{t.slice(0, m.index)}<span className="text-gold">{m[0]}</span>{t.slice(m.index + m[0].length)}</>;
};
import { faqPage, service, ids } from '../lib/schema';

const homeFaqs = faqsByIds(['what-is', 'price', 'ages', 'players', 'how-long', 'bday-how', 'where', 'parking', 'book-how']);

const occasions = [
  {
    href: '/birthday-parties/kids/', photo: 'kids' as PhotoKey, tag: 'Ages 6–12', title: 'Kids birthday parties',
    body: 'Buzzers, a live host and a private Party Room for cake. The birthday kid gets custom trivia and the spotlight.',
  },
  {
    href: '/birthday-parties/teen-and-sweet-16/', photo: 'teen' as PhotoKey, tag: 'Teens', title: 'Teen & Sweet 16 parties',
    body: 'Competitive, loud and not a kiddie venue — a party teens actually want, with custom rounds about the guest of honor.',
  },
  {
    href: '/birthday-parties/adult/', photo: 'adult' as PhotoKey, tag: 'Adults', title: 'Adult birthdays',
    body: '30th, 40th, 50th — trade the restaurant table for a live game show built around the birthday person.',
  },
  {
    href: '/group-events/corporate-team-building/', photo: 'corporate' as PhotoKey, tag: 'Companies', title: 'Corporate team building',
    body: 'Company-specific trivia, team rounds and an overall champion. Scales to 40–60 players.',
  },
  {
    href: '/group-events/school-and-youth-groups/', photo: 'school' as PhotoKey, tag: 'Schools & teams', title: 'School & youth groups',
    body: 'Field trips, sports teams, scouts and clubs. Trivia can be tuned to the group’s age.',
  },
  {
    href: '/game-show-experience/', photo: 'stacking' as PhotoKey, tag: 'Friends & family', title: 'A night out, any night',
    body: 'Book a private session for 6–8 players — date night, family visit, reunion or just because.',
  },
];

export const home: RouteDef = {
  path: '/',
  template: 'home',
  pageType: 'home',
  trackView: 'view_service',
  seo: {
    title: 'Live Game Show Room in Rockaway, NJ | Parties & Groups',
    description: 'Be the contestants on a live, host-led game show at Rockaway Townsquare. Birthday parties (ages 6+), team building & groups. From $%PRICE%/guest. Book online.',
    primaryTopic: 'game show room rockaway nj',
    secondaryTopics: ['live game show experience', 'birthday party rockaway nj', 'things to do rockaway nj'],
  },
  sitemap: { priority: 1.0, changefreq: 'weekly' },
  schema: () => [
    service({
      id: ids.gameShow, name: 'Live Game Show Room experience', serviceType: 'Interactive live game show experience',
      description: '60-minute, host-led live game show for private groups of 6–8 players (40–60 for large events): trivia, puzzles, creative and light physical challenges with buzzers, lights and music. Ages 6+.',
      url: '/game-show-experience/', priceFrom: 33, audience: 'Families, friends, kids 6+, teens, adults, corporate teams, schools',
    }),
    faqPage('/', homeFaqs),
  ],
  render: () => (
    <Shell>
      <PromoSlot path="/" />
      <Hero
        eyebrow="Inside Rockaway Townsquare · Morris County, NJ"
        title={heroTitle(settingsContent.homeHero.title)}
        lead={settingsContent.homeHero.lead}
        primary={<Button href="/book/" size="lg" track={{ event: 'click_book_now', label: 'home_hero' }}>Book your game show</Button>}
        secondary={<Button href="/birthday-parties/" size="lg" variant="ghost-light" track={{ event: 'click_book_now', label: 'home_hero_birthday' }}>Plan a birthday party</Button>}
        note={<span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1"><GoogleRatingLine dark label="home_hero" /><span>Book 48+ hours ahead · Free parking</span></span>}
        artOnMobile
        chips={[
          { k: 'Price', v: 'From $%PRICE%/guest' },
          { k: 'Length', v: '60 minutes' },
          { k: 'Ages', v: '6 and up' },
          { k: 'Group', v: '6–8 · up to 60' },
        ]}
      />

      <Section tone="light" labelledBy="what-title">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <Eyebrow>What is it?</Eyebrow>
            <H2 id="what-title">Like being on a TV game show — except it&rsquo;s your crew on the buzzers</H2>
            <p className="mt-4 text-lg">
              Game Show Room is a live, interactive game show you play with your own group. A host runs the show, the lights and music
              kick in, and your team competes through rounds of <strong>trivia, puzzles, creative challenges and light physical
              challenges</strong>. There&rsquo;s a family-friendly version, a kid-focused version and an adult-level version, so the
              questions fit the room.
            </p>
            <p className="mt-3 text-lg">
              It&rsquo;s not an escape room and it&rsquo;s not an arcade: nobody gets locked in, nobody wanders off to a screen —
              everyone plays together for the whole hour. <a className="font-bold text-gold underline" href="/game-show-vs-escape-room/">See how it compares to an escape room</a>.
            </p>
          </div>
          <div className="grid gap-5">
          <Photo name="winners" framed sizes="(min-width: 1024px) 40vw, 100vw" />
          <QuickAnswer q="The 5-second version">
            <ul className="mt-1 space-y-1.5">
              <li><strong>Where:</strong> Rockaway Townsquare, 301 Mt Hope Ave, Rockaway NJ — by the JCPenney entrance</li>
              <li><strong>How long:</strong> 60 minutes (parties ~90 min–2 hrs with the Party Room)</li>
              <li><strong>Who:</strong> ages 6+, private groups of 6–8; events up to 40–60</li>
              <li><strong>Cost:</strong> from $%PRICE% per guest</li>
            </ul>
          </QuickAnswer>
          </div>
        </div>
        <div className="mt-12"><TrustRow /></div>
      </Section>

      <Section tone="paper" labelledBy="occ-title">
        <SectionHead id="occ-title" eyebrow="Choose your occasion" title="What are you celebrating?" lead="One private studio, a live host and a show tuned to your crew." />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((o) => (
            <li key={o.href}>
              <a href={o.href} className="card-noir group flex h-full flex-col overflow-hidden text-bone no-underline transition hover:-translate-y-0.5 hover:border-bronze">
                <span className="relative block aspect-[2/1] overflow-hidden sm:aspect-[16/10]">
                  <img src={photos[o.photo].card} alt="" width={900} height={600} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" style={{ objectPosition: photos[o.photo].position }} />
                  <span className="eyebrow-x absolute left-3 top-3 rounded-[4px] bg-night/85 px-2.5 py-1 text-[0.7rem] text-gold">{o.tag}</span>
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="font-display text-2xl font-semibold uppercase text-gold">{o.title}</span>
                  <span className="mt-2 flex-1 text-mist">{o.body}</span>
                  <span className="mt-4 font-bold text-bone group-hover:text-gold">See details →</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <ReviewSnippets path="/" />

      <Section tone="dark" labelledBy="how-title">
        <SectionHead id="how-title" eyebrow="How it works" title="From booking to champion in four steps" />
        <Steps
          dark
          steps={[
            { title: 'Pick a time', body: 'Book online for 6–8 players, or request a quote for parties and big groups. Aim for 48+ hours ahead.' },
            { title: 'Arrive early', body: 'Come 10–15 minutes before showtime. Free parking; enter by JCPenney.' },
            { title: 'Play the show', body: '60 minutes of buzz-in trivia, puzzles and challenges with a live host.' },
            { title: 'Crown a winner', body: 'Birthday bookings continue with an extra hour in the private Party Room.' },
          ]}
        />
      </Section>

      <Section tone="light" labelledBy="play-title">
        <SectionHead id="play-title" eyebrow="What you’ll play" title="Challenges for brains, buzzers and big personalities" />
        <Features
          items={[
            { icon: 'buzzer', title: 'Buzz-in trivia', body: 'Fast rounds where the quickest hand on the buzzer wins the points.' },
            { icon: 'brain', title: 'Puzzles', body: 'Brain-teasers that reward the quiet thinkers on the team.' },
            { icon: 'trophy', title: 'Creative & physical challenges', body: 'Light, laugh-out-loud challenges that get everyone off their seats.' },
            { icon: 'star', title: 'Custom rounds', body: 'Birthday-themed, company-specific or industry trivia on request.' },
            { icon: 'users', title: 'Made for teams', body: 'Groups over 8 split into teams that rotate rounds — with an overall champion.' },
            { icon: 'ticket', title: 'Seasonal shows', body: 'Themed shows run through the year, from Halloween to Christmas.' },
          ]}
        />
      </Section>

      <Gallery />

      <Section tone="light" labelledBy="price-title">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow>Pricing</Eyebrow>
            <H2 id="price-title">Simple pricing, no strangers on your team</H2>
            <p className="mt-3 text-lg">Game show pricing starts at <strong>$%PRICE% per guest</strong> and depends on group size and package. Every session is private to your group.</p>
            <div className="mt-6"><PriceStrip trackLabel="home" /></div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <BookingLink kind="small" label="home_pricing" size="lg">Book 6–8 players online</BookingLink>
              <Button href="/pricing/" variant="outline" size="lg">Full pricing details</Button>
            </div>
          </div>
          <PackageCard trackLabel="home" />
        </div>
      </Section>

      <VisitBlock />
      <FAQSection list={homeFaqs} title="Game Show Room questions, answered" />
      <CtaBand
        label="home"
        title="Ready to hit the buzzer?"
        body="Book a private 60-minute show for your group, or tell us about your party and we'll send a quote."
      />
    </Shell>
  ),
};
