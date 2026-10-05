import type { RouteDef } from '../lib/types';
import { Shell } from '../components/Layout';
import { Hero, QuickAnswer, Steps, Features, FAQSection, VisitBlock, CtaBand, Related, QuoteForm, PriceStrip } from '../components/sections';
import { Section, Eyebrow, H2, Button, CheckList, Card } from '../components/ui';
import { ReviewSnippets, GoogleRatingLine } from '../components/reviews';
import { faqsByIds } from '../data/faqs';
import { faqPage, service, ids } from '../lib/schema';

const crumbs = (name?: string, path?: string) =>
  [{ name: 'Home', path: '/' }, { name: 'Group Events', path: '/group-events/' }, ...(name && path ? [{ name, path }] : [])];

/* ======================= HUB /group-events/ ======================= */
const hubFaqs = faqsByIds(['large', 'players', 'private', 'deposit', 'discounts', 'corporate', 'school', 'seasonal', 'accessible', 'parking']);
export const groupsHub: RouteDef = {
  path: '/group-events/', template: 'service', pageType: 'service', trackView: 'view_service',
  breadcrumb: crumbs(),
  seo: {
    title: 'Group Events & Private Parties in Rockaway, NJ (up to 60)',
    description: 'Private game show events for 8 to 60 players at Rockaway Townsquare: team building, school groups, reunions, holiday parties. Custom trivia. Free event quote.',
    primaryTopic: 'rockaway nj event space',
    secondaryTopics: ['group activities near me', 'game shows for private parties', 'private room', 'fun group activities for adults'],
  },
  sitemap: { priority: 0.85, changefreq: 'monthly' },
  schema: () => [
    service({ id: ids.groups, name: 'Private group game show events', serviceType: 'Private event / group entertainment', description: 'Private, host-led game show events for 8 to 60 players with team rotations, custom trivia and an overall champion.', url: '/group-events/', priceFrom: 33, audience: 'Companies, schools, youth groups, families, social groups' }),
    faqPage('/group-events/', hubFaqs),
  ],
  render: () => (
    <Shell breadcrumb={crumbs()} sticky={{ href: '#quote', label: 'Get an event quote' }}>
      <Hero
        image="groups"
        eyebrow="Group events · 8 to 60 players"
        title={<>Private group events in <span className="text-gold">Rockaway, NJ</span></>}
        lead={<>Turn a group outing into a tournament. Teams rotate through host-led rounds of trivia, puzzles and challenges — with one overall champion — at Rockaway Townsquare.</>}
        primary={<Button href="#quote" size="lg" track={{ event: 'click_book_now', label: 'groups_hero' }}>Get a free event quote</Button>}
        secondary={<Button href="/group-events/corporate-team-building/" size="lg" variant="ghost-light">Corporate team building</Button>}
        chips={[{ k: 'Group size', v: '8 – 60' }, { k: 'Format', v: 'Team rotations' }, { k: 'Trivia', v: 'Customizable' }, { k: 'Price', v: 'From $%PRICE%/guest' }]}
      />
      <Section tone="light" labelledBy="g-what">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div className="prose-x text-lg">
            <Eyebrow>How big groups play</Eyebrow>
            <H2 id="g-what">One event, many teams, one champion</H2>
            <p>A standard Game Show Room session is designed for 6–8 players. For larger groups, the team runs <strong>extended sessions or back-to-back shows</strong> for 40–60 players: your group is split into teams that rotate through rounds, and scores roll up so you can crown an overall champion across every team.</p>
            <p>Questions can be <strong>customized</strong> — company-specific, industry-based, school-themed or built around a guest of honor — and seasonal shows run from Halloween to Christmas, which makes it an easy holiday party.</p>
          </div>
          <QuickAnswer q="Can you host 40+ people?">Yes. Groups of 40–60 players are hosted with extended or back-to-back shows. A deposit may be required to hold large-group time slots.</QuickAnswer>
        </div>
      </Section>
      <Section tone="paper" labelledBy="g-who">
        <Eyebrow>Popular group events</Eyebrow>
        <H2 id="g-who">Who books group shows</H2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { h: 'Companies', d: 'Team building, onboarding cohorts, holiday parties and client events.', href: '/group-events/corporate-team-building/', cta: 'Corporate team building' },
            { h: 'Schools & youth groups', d: 'Field trips, sports teams, scouts, clubs and end-of-season parties.', href: '/group-events/school-and-youth-groups/', cta: 'School & youth groups' },
            { h: 'Families & friends', d: 'Reunions, bachelor/bachelorette parties, big birthdays and holiday get-togethers.', href: '/birthday-parties/', cta: 'Birthday & celebration parties' },
          ].map((c) => (
            <Card key={c.h}><h3 className="text-xl font-bold">{c.h}</h3><p className="mt-2 text-mist">{c.d}</p><a href={c.href} className="mt-3 inline-block font-bold text-gold underline">{c.cta} →</a></Card>
          ))}
        </div>
        <div className="mt-10"><PriceStrip trackLabel="groups" /></div>
      </Section>
      <ReviewSnippets path="/group-events/" tone="paper" />
      <Section tone="light" id="quote"><div className="mx-auto max-w-3xl"><QuoteForm context="groups_hub" /></div></Section>
      <VisitBlock id="groups-visit" />
      <FAQSection list={hubFaqs} title="Group event questions" />
      <CtaBand label="groups" primaryHref="#quote" primaryText="Get a free event quote" title="Bring the whole crew" body="Tell us your group size and date — we'll reply with availability and pricing." />
    </Shell>
  ),
};

/* ======================= /group-events/corporate-team-building/ ======================= */
const corpFaqs = faqsByIds(['corporate', 'large', 'challenges', 'deposit', 'discounts', 'seasonal', 'accessible', 'transit', 'food-included']);
export const corporate: RouteDef = {
  path: '/group-events/corporate-team-building/', template: 'service', pageType: 'landing', trackView: 'view_service',
  breadcrumb: crumbs('Corporate team building', '/group-events/corporate-team-building/'),
  seo: {
    title: 'Corporate Team Building in Morris County, NJ | Game Show',
    description: 'Team building that people actually enjoy: a private live game show with company-specific trivia for 8–60 employees at Rockaway Townsquare, NJ. Free event quote.',
    primaryTopic: 'team building activities morris county nj',
    secondaryTopics: ['corporate game show host', 'team building activities near me for adults', 'team building events ledgewood nj', 'team outing', 'family feud corporate event'],
  },
  sitemap: { priority: 0.8, changefreq: 'monthly' },
  schema: () => [
    service({ id: 'https://gameshowroomrockaway.com/group-events/corporate-team-building/#service', name: 'Corporate team building game show', serviceType: 'Corporate team building', description: 'Private, host-led game show for 8–60 employees with company-specific or industry trivia, team rotations and an overall champion.', url: '/group-events/corporate-team-building/', priceFrom: 33, audience: 'Companies and teams' }),
    faqPage('/group-events/corporate-team-building/', corpFaqs),
  ],
  render: () => (
    <Shell breadcrumb={crumbs('Corporate team building', '/group-events/corporate-team-building/')} sticky={{ href: '#quote', label: 'Get a team quote' }}>
      <Hero
        image="corporate"
        eyebrow="Corporate team building · Morris County"
        title={<>Team building your team <span className="text-gold">won&rsquo;t groan about</span></>}
        lead={<>A private, host-led game show with trivia about your company or industry. Departments compete, everyone participates, and an overall champion takes the bragging rights. Rockaway Townsquare, off Route 80.</>}
        primary={<Button href="#quote" size="lg" track={{ event: 'click_book_now', label: 'corp_hero' }}>Get a team-building quote</Button>}
        secondary={<Button href="/game-show-experience/" size="lg" variant="ghost-light">How the show works</Button>}
        chips={[{ k: 'Team size', v: '8 – 60' }, { k: 'Show', v: '60 min each' }, { k: 'Trivia', v: 'Company-custom' }, { k: 'Parking', v: 'Free' }]}
      />
      <Section tone="light" labelledBy="c-why">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div className="prose-x text-lg">
            <Eyebrow>Why a game show works for teams</Eyebrow>
            <H2 id="c-why">Low-pressure, high-energy, everyone included</H2>
            <p>The best team-building activities give every personality a role. Buzz-in trivia rewards the quick thinkers, puzzles reward the problem-solvers, and light physical and creative challenges get the quiet folks laughing. Nobody has to give a speech, and nobody sits out.</p>
            <p>Customize the content with <strong>company-specific or industry-based trivia</strong> — product knowledge, company history, inside jokes — to make it feel built for your team. Large teams split into groups that rotate through rounds, and scores combine into one overall leaderboard.</p>
          </div>
          <QuickAnswer q="For HR & office managers">
            <ul className="mt-1 space-y-1.5">
              <li><strong>Size:</strong> 8 to 60 players</li>
              <li><strong>Time:</strong> ~60 min per show; big groups run extended or back-to-back shows</li>
              <li><strong>Where:</strong> Rockaway Townsquare, Rockaway NJ 07866</li>
              <li><strong>Access:</strong> wheelchair accessible; free parking; NJ Transit buses</li>
              <li><strong>Food:</strong> not included — dining options at the mall</li>
            </ul>
          </QuickAnswer>
        </div>
      </Section>
      <Section tone="dark" labelledBy="c-steps">
        <Eyebrow dark>From request to results</Eyebrow>
        <H2 id="c-steps">How booking a team event works</H2>
        <Steps dark steps={[
          { title: 'Send a quote request', body: 'Headcount, preferred dates and any custom-trivia ideas.' },
          { title: 'Confirm the plan', body: 'We propose a schedule (one show or back-to-back) and pricing. A deposit may be required.' },
          { title: 'Share your trivia', body: 'Send company facts or themes for custom rounds.' },
          { title: 'Show day', body: 'Arrive 10–15 minutes early. We run everything and crown the champion.' },
        ]} />
      </Section>
      <Section tone="paper" labelledBy="c-uses">
        <Eyebrow>Occasions</Eyebrow>
        <H2 id="c-uses">Popular with teams for</H2>
        <Features items={[
          { icon: 'users', title: 'Team building & offsites', body: 'A fun anchor activity for a half-day offsite in Morris County.' },
          { icon: 'star', title: 'Onboarding cohorts', body: 'Mix new hires and veterans on the same team.' },
          { icon: 'ticket', title: 'Holiday parties', body: 'Seasonal themed shows run from Halloween through Christmas.' },
          { icon: 'trophy', title: 'Department rivalries', body: 'Sales vs. ops, office vs. office — with a shared leaderboard.' },
          { icon: 'brain', title: 'Client events', body: 'An easy, memorable activity for client or partner groups.' },
          { icon: 'buzzer', title: 'Summer & intern events', body: 'A summer outing that gets every intern talking to the team.' },
        ]} />
      </Section>
      <Section tone="light" id="quote"><div className="mx-auto max-w-3xl"><QuoteForm context="corporate" heading="Get a team-building quote" defaultType="Corporate / team building" /></div></Section>
      <FAQSection list={corpFaqs} title="Corporate event FAQ" />
      <Related links={[
        { href: '/group-events/', label: 'All group events', blurb: 'How we run shows for 8–60 players.' },
        { href: '/location/rockaway-nj/', label: 'Directions & parking', blurb: 'Route 80, mall entrances, transit.' },
        { href: '/pricing/', label: 'Pricing', blurb: 'From $%PRICE% per guest.' },
      ]} />
      <CtaBand label="corporate" primaryHref="#quote" primaryText="Get a team-building quote" title="Give your team a story to tell Monday" body="Send headcount and dates — we'll reply with options and pricing." />
    </Shell>
  ),
};

/* ======================= /group-events/school-and-youth-groups/ ======================= */
const schoolFaqs = faqsByIds(['school', 'large', 'ages', 'discounts', 'fundraiser', 'deposit', 'transit', 'accessible']);
export const school: RouteDef = {
  path: '/group-events/school-and-youth-groups/', template: 'service', pageType: 'landing', trackView: 'view_service',
  breadcrumb: crumbs('Schools & youth groups', '/group-events/school-and-youth-groups/'),
  seo: {
    title: 'School Field Trips & Youth Group Game Shows in NJ',
    description: 'Field trips, sports teams, scouts and youth groups play a private live game show at Rockaway Townsquare, NJ. Ages 6+, groups up to 60, rates for qualifying groups.',
    primaryTopic: 'school game shows new jersey',
    secondaryTopics: ['field trip ideas morris county', 'youth group activities nj', 'sports team party', 'kids events near me'],
  },
  sitemap: { priority: 0.7, changefreq: 'monthly' },
  schema: () => [
    service({ id: 'https://gameshowroomrockaway.com/group-events/school-and-youth-groups/#service', name: 'School & youth group game shows', serviceType: 'Educational group entertainment', description: 'Private, host-led game show for schools, sports teams and youth groups; ages 6+, groups up to 60.', url: '/group-events/school-and-youth-groups/', priceFrom: 33, audience: 'Schools, sports teams, youth groups' }),
    faqPage('/group-events/school-and-youth-groups/', schoolFaqs),
  ],
  render: () => (
    <Shell breadcrumb={crumbs('Schools & youth groups', '/group-events/school-and-youth-groups/')} sticky={{ href: '#quote', label: 'Get a group quote' }}>
      <Hero
        image="school"
        eyebrow="Schools · sports teams · youth groups"
        title={<>A field trip that&rsquo;s <span className="text-gold">secretly a quiz</span></>}
        lead={<>Classes, teams, scouts and clubs play a private, host-led game show at Rockaway Townsquare — trivia can be tuned to your group&rsquo;s age or subject. Up to 60 players.</>}
        primary={<Button href="#quote" size="lg" track={{ event: 'click_book_now', label: 'school_hero' }}>Get a group quote</Button>}
        chips={[{ k: 'Ages', v: '6 and up' }, { k: 'Group', v: 'Up to 60' }, { k: 'Rates', v: 'For qualifying groups' }, { k: 'Bus', v: 'NJ Transit served' }]}
      />
      <Section tone="light" labelledBy="s-what">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          <div className="prose-x text-lg">
            <Eyebrow>For teachers, coaches & leaders</Eyebrow>
            <H2 id="s-what">Teamwork, quick thinking and a lot of noise (the good kind)</H2>
            <p>Game Show Room regularly hosts schools, sports teams and youth groups. Students split into teams and rotate through rounds of trivia, puzzles and light challenges, with an overall champion at the end — great for end-of-year trips, team celebrations and club outings.</p>
            <p>Ask about tailoring questions to your group&rsquo;s grade level or subject, special rates for qualifying groups, and raffle or auction donations for school and nonprofit fundraisers.</p>
          </div>
          <QuickAnswer q="Chaperones">Adults are welcome to play or watch from the sidelines. For children&rsquo;s groups, at least one adult (18+) must be present.</QuickAnswer>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { h: 'Classes & field trips', d: 'Trivia tuned to the group’s age; teams rotate rounds.' },
            { h: 'Sports teams', d: 'End-of-season party with a different kind of competition.' },
            { h: 'Scouts, clubs & youth groups', d: 'A reward outing or rainy-day plan that keeps everyone together.' },
          ].map((c) => <Card key={c.h}><h3 className="text-xl font-bold">{c.h}</h3><p className="mt-2 text-mist">{c.d}</p></Card>)}
        </div>
        <CheckList items={['Every session is private to your group', 'Wheelchair accessible', 'Free parking for buses and parents — confirm bus drop-off with the team', 'Fundraiser donations available for schools & nonprofits']} />
      </Section>
      <Section tone="paper" id="quote"><div className="mx-auto max-w-3xl"><QuoteForm context="school" heading="Get a school or group quote" defaultType="School / youth group" /></div></Section>
      <FAQSection list={schoolFaqs} title="School & youth group FAQ" />
      <CtaBand label="school" primaryHref="#quote" primaryText="Get a group quote" title="Plan your group's game day" body="Send your group size, ages and preferred dates." />
    </Shell>
  ),
};
