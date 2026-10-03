import type { RouteDef } from '../lib/types';
import { Shell } from '../components/Layout';
import { Hero, QuickAnswer, Steps, Features, FAQSection, PriceStrip, VisitBlock, CtaBand, Related, TrustRow } from '../components/sections';
import { Section, Eyebrow, H2, Button, BookingLink, CheckList, Card } from '../components/ui';
import { ReviewSnippets, GoogleRatingLine } from '../components/reviews';
import { faqsByIds } from '../data/faqs';
import { faqPage, service, ids, article } from '../lib/schema';
import { business } from '../data/business';

const bc = (name: string, path: string) => [{ name: 'Home', path: '/' }, { name, path }];

/* ======================= /game-show-experience/ ======================= */
const gsFaqs = faqsByIds(['what-is', 'challenges', 'how-long', 'ages', 'players', 'private', 'watchers', 'price', 'what-to-wear', 'photos', 'same-day', 'escape-vs']);

export const gameShow: RouteDef = {
  path: '/game-show-experience/', template: 'service', pageType: 'service', trackView: 'view_game_show',
  breadcrumb: bc('The Game Show', '/game-show-experience/'),
  seo: {
    title: 'Live Game Show Experience in NJ | How It Works & Prices',
    description: 'A 60-minute live game show with a host, buzzers, trivia, puzzles & challenges at Rockaway Townsquare, NJ. Private groups of 6–8 (up to 60). Ages 6+. From $33.',
    primaryTopic: 'live game show experience nj',
    secondaryTopics: ['interactive game show experience', 'game show near me', 'game show battle rooms', 'family game show near me'],
  },
  sitemap: { priority: 0.9, changefreq: 'monthly' },
  schema: () => [
    service({
      id: ids.gameShow, name: 'Live Game Show Room experience', serviceType: 'Interactive live game show experience',
      description: 'Host-led 60-minute live game show for private groups: buzz-in trivia, puzzles, creative and light physical challenges. Family, kid and adult versions. Ages 6+.',
      url: '/game-show-experience/', priceFrom: 33, audience: 'Families, friends, teens, adults, corporate teams, schools',
    }),
    faqPage('/game-show-experience/', gsFaqs),
  ],
  render: () => (
    <Shell breadcrumb={bc('The Game Show', '/game-show-experience/')}>
      <Hero
        eyebrow="The experience"
        title={<>A live game show where <span className="text-gold">your group</span> are the contestants</>}
        lead={<>One hour. One live host. Buzzers, lights, music and rounds of trivia, puzzles and challenges — in a private room at Rockaway Townsquare, NJ.</>}
        primary={<BookingLink kind="small" label="gs_hero" size="lg">Book 6–8 players online</BookingLink>}
        secondary={<Button href="/book/#quote" size="lg" variant="ghost-light" track={{ event: 'click_book_now', label: 'gs_hero_quote' }}>Bigger group? Get a quote</Button>}
        chips={[{ k: 'Length', v: '60 minutes' }, { k: 'Ages', v: '6 and up' }, { k: 'Group', v: '6–8 players' }, { k: 'Price', v: 'From $33/guest' }]}
      />
      <Section tone="light" labelledBy="gs-what">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="prose-x text-lg">
            <Eyebrow>What is a live game show experience?</Eyebrow>
            <H2 id="gs-what">TV-style competition you play in person</H2>
            <p>
              A live game show experience puts you behind the podium instead of on the couch. At Game Show Room, a host leads your group
              through a full show — buzz-in trivia, brain-teasing puzzles, creative challenges and light physical challenges — while the
              lights, music and scoreboard make it feel like a studio taping.
            </p>
            <p>
              Every booking is <strong>private to your group</strong>, so you&rsquo;re competing against the people you came with — family vs.
              family, department vs. department, the birthday kid&rsquo;s team vs. everyone else. Groups bigger than 8 are split into teams
              that rotate through rounds, with an overall champion crowned at the end.
            </p>
          </div>
          <QuickAnswer q="At a glance">
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-base">
              <dt className="font-bold">Duration</dt><dd>About 60 minutes</dd>
              <dt className="font-bold">Players</dt><dd>6–8 per standard session; 40–60 with back-to-back or extended shows</dd>
              <dt className="font-bold">Ages</dt><dd>6 and up (family, kid-focused &amp; adult-level versions)</dd>
              <dt className="font-bold">Price</dt><dd>From $33 per guest</dd>
              <dt className="font-bold">Book ahead</dt><dd>At least 48 hours</dd>
              <dt className="font-bold">Where</dt><dd>Rockaway Townsquare, Rockaway NJ 07866</dd>
            </dl>
          </QuickAnswer>
        </div>
      </Section>
      <Section tone="dark" labelledBy="gs-how">
        <Eyebrow dark>How it works</Eyebrow>
        <H2 id="gs-how">What happens during your hour</H2>
        <Steps dark steps={[
          { title: 'Check in', body: 'Arrive 10–15 minutes early. Your host explains the rules and splits teams.' },
          { title: 'Take the podium', body: 'Buzzers, lights and music go live. The host runs the rounds and keeps score.' },
          { title: 'Mix it up', body: 'Trivia, puzzles, creative and light physical challenges — every type of player gets a moment.' },
          { title: 'Final round', body: 'Scores are tallied and a champion is crowned. Bragging rights included.' },
        ]} />
      </Section>
      <Section tone="light" labelledBy="gs-rounds">
        <Eyebrow>The challenges</Eyebrow>
        <H2 id="gs-rounds">Built so everyone gets to shine</H2>
        <Features items={[
          { icon: 'buzzer', title: 'Buzz-in trivia', body: 'Quick hands and quick thinking. Questions are matched to your group — kids, families or adults.' },
          { icon: 'brain', title: 'Puzzles', body: 'Brain-teasers that reward teamwork and the quiet problem-solvers.' },
          { icon: 'trophy', title: 'Light physical challenges', body: 'Nothing extreme — just enough to get people up and laughing. Wear closed-toe shoes.' },
          { icon: 'star', title: 'Custom trivia', body: 'Birthday-themed, company-specific or industry rounds on request.' },
          { icon: 'ticket', title: 'Seasonal & holiday shows', body: 'Themed shows run through the year, from Halloween to Christmas.' },
          { icon: 'users', title: 'Spectators welcome', body: 'Guests who’d rather watch can cheer from the sidelines.' },
        ]} />
      </Section>
      <Section tone="paper" labelledBy="gs-who">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Eyebrow>Who it&rsquo;s for</Eyebrow>
            <H2 id="gs-who">Great for almost any group of 6 or more</H2>
            <CheckList items={[
              <><a className="font-bold text-flash-dark underline" href="/birthday-parties/kids/">Kids birthday parties</a> — ages 6+, with a private Party Room for cake</>,
              <><a className="font-bold text-flash-dark underline" href="/birthday-parties/teen-and-sweet-16/">Teen &amp; Sweet 16 parties</a> — competitive, social, phone-free fun</>,
              <><a className="font-bold text-flash-dark underline" href="/birthday-parties/adult/">Adult birthdays</a>, reunions and bachelor/bachelorette groups</>,
              <><a className="font-bold text-flash-dark underline" href="/group-events/corporate-team-building/">Corporate team building</a> with custom company trivia</>,
              <><a className="font-bold text-flash-dark underline" href="/group-events/school-and-youth-groups/">School trips, sports teams and youth groups</a></>,
              <>Families looking for something <a className="font-bold text-flash-dark underline" href="/things-to-do-rockaway-nj/">indoors to do in Rockaway</a> on a weekend or rainy day</>,
            ]} />
          </div>
          <div>
            <Eyebrow>Pricing</Eyebrow>
            <H2>From $33 per guest</H2>
            <p className="mt-3 text-lg">Pricing depends on group size and package. See <a className="font-bold text-flash-dark underline" href="/pricing/">full pricing</a>.</p>
            <div className="mt-5"><PriceStrip trackLabel="game_show" /></div>
          </div>
        </div>
        <div className="mt-10"><TrustRow /></div>
      </Section>
      <Section tone="light" id="photos" labelledBy="gs-photos">
        <Eyebrow>Inside the room</Eyebrow>
        <H2 id="gs-photos">See the set before you book</H2>
        <p className="mt-3 max-w-2xl text-lg text-muted">Real photos of the Rockaway set — podiums, buzzers and the Party Room — are being added here. In the meantime, call {business.phone.display} and the team can describe the room for your group.</p>
      </Section>
      <ReviewSnippets path="/game-show-experience/" title="Reviews from real players" />
      <VisitBlock />
      <FAQSection list={gsFaqs} title="Live game show FAQ" />
      <Related links={[
        { href: '/birthday-parties/', label: 'Game show birthday parties', blurb: '1 hour of game show + 1 hour in a private Party Room.' },
        { href: '/game-show-vs-escape-room/', label: 'Game show vs. escape room', blurb: 'Which one fits your group? A straight comparison.' },
        { href: '/game-show-experiences-new-jersey/', label: 'NJ game show experiences compared', blurb: 'Rockaway, East Rutherford, Freehold — how they differ.' },
      ]} />
      <CtaBand label="game_show" booking="small" primaryText="See available times" title="Get your group on the buzzers" body="Book a private 60-minute show online for 6–8 players, or call for parties and large groups." />
    </Shell>
  ),
};

/* ======================= /game-show-vs-escape-room/ ======================= */
const escFaqs = faqsByIds(['escape-vs', 'private', 'ages', 'how-long', 'price']);
const escRows: [string, string, string][] = [
  ['Format', 'Host-led show with rounds, buzzers, lights and music', 'Self-guided puzzle room with a countdown clock'],
  ['Who runs it', 'A live host on stage for the whole hour', 'Usually a game master watching remotely, giving hints'],
  ['Winning', 'Most points — teams compete against each other', 'Escape before time runs out — team vs. the room'],
  ['Best for', 'Mixed ages, birthdays, big personalities, people who like friendly competition', 'Puzzle lovers, smaller groups who like quiet problem-solving'],
  ['Spectators', 'Non-players can watch and cheer', 'Usually only players inside the room'],
  ['Length', '~60 minutes', 'Typically 45–60 minutes (varies by venue)'],
  ['Group size', '6–8 per session; 40–60 with back-to-back shows', 'Varies by room'],
];

export const vsEscape: RouteDef = {
  path: '/game-show-vs-escape-room/', template: 'guide', pageType: 'guide', trackView: 'view_service',
  breadcrumb: bc('Game show vs. escape room', '/game-show-vs-escape-room/'),
  seo: {
    title: 'Game Show Room vs. Escape Room in Rockaway, NJ',
    description: 'Looking for an escape room at Rockaway Townsquare? Compare it with the live Game Show Room: format, ages, group size, length and which suits your group.',
    primaryTopic: 'escape room rockaway nj',
    secondaryTopics: ['rockaway mall escape room', 'escape room game show', 'escape the mystery room rockaway'],
  },
  sitemap: { priority: 0.7, changefreq: 'monthly' },
  lastModified: '2026-10-03',
  schema: () => [faqPage('/game-show-vs-escape-room/', escFaqs)],
  render: () => (
    <Shell breadcrumb={bc('Game show vs. escape room', '/game-show-vs-escape-room/')}>
      <Section tone="light">
        <Eyebrow>Rockaway Townsquare guide</Eyebrow>
        <h1 className="text-[2rem] font-black leading-tight sm:text-5xl">Game Show Room vs. escape room: which one for your group?</h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="prose-x text-lg">
            <p>
              If you searched for an <strong>escape room in Rockaway, NJ</strong>, you&rsquo;re in the right building. The company behind the
              Game Show Room — All In Adventures — also runs escape rooms at Rockaway Townsquare. They&rsquo;re two very different
              experiences, and the right pick depends on your group.
            </p>
            <p>
              <strong>Short answer:</strong> choose the <a href="/game-show-experience/">Game Show Room</a> if you want a host, energy,
              mixed ages and teams competing against each other — it&rsquo;s the stronger pick for birthday parties and big groups. Choose an
              escape room if your group loves quiet, self-directed puzzle solving against the clock.
            </p>
          </div>
          <QuickAnswer q="Is the Game Show Room an escape room?">
            No. Nobody gets locked in. It&rsquo;s a live, host-led game show where your group competes in rounds of trivia, puzzles and
            challenges with buzzers and lights. The escape rooms are a separate experience run by the same company.
          </QuickAnswer>
        </div>
        <div className="mt-10 overflow-x-auto rounded-2xl border-2 border-ink bg-paper">
          <table className="w-full min-w-[34rem] text-left">
            <caption className="sr-only">Comparison of the Game Show Room and a typical escape room</caption>
            <thead className="bg-ink text-paper">
              <tr><th scope="col" className="p-3"> </th><th scope="col" className="p-3 text-gold">Game Show Room</th><th scope="col" className="p-3">Typical escape room</th></tr>
            </thead>
            <tbody>
              {escRows.map(([k, a, b]) => (
                <tr key={k} className="border-t-2 border-line align-top">
                  <th scope="row" className="p-3 font-bold">{k}</th><td className="p-3">{a}</td><td className="p-3 text-muted">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="text-2xl font-black">Pick the game show if…</h2>
            <CheckList items={['Ages range from 6 to 60+', 'You’re celebrating a birthday and want a Party Room after', 'Your group is bigger than 8 (up to 40–60)', 'Some guests would rather watch than play', 'You want a host to run everything']} />
            <BookingLink kind="small" label="vs_escape_card" className="mt-5 w-full">Book the game show</BookingLink>
          </Card>
          <Card>
            <h2 className="text-2xl font-black">Pick an escape room if…</h2>
            <CheckList items={['Your group loves puzzles above all', 'You’re a small group of friends or a couple of families', 'You prefer self-directed play with hints on request']} />
            <a href={business.sisterExperiences[0].url} rel="noopener" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full border-2 border-ink bg-paper px-6 font-bold text-ink no-underline" data-track="outbound_click" data-track-label="vs_escape_aia">Visit All In Adventures escape rooms</a>
          </Card>
        </div>
      </Section>
      <FAQSection list={escFaqs} title="Escape room & game show questions" />
      <CtaBand label="vs_escape" title="Want the energy of a game show?" body="Book a private 60-minute show for your group at Rockaway Townsquare." />
    </Shell>
  ),
};

/* ======================= /game-show-experiences-new-jersey/ ======================= */
export const njGuide: RouteDef = {
  path: '/game-show-experiences-new-jersey/', template: 'guide', pageType: 'guide', trackView: 'view_service',
  breadcrumb: bc('NJ game show experiences', '/game-show-experiences-new-jersey/'),
  seo: {
    title: 'Live Game Show Experiences in New Jersey (2026 Guide)',
    description: 'Where to play a real-life game show in New Jersey: Rockaway (Morris County), American Dream in East Rutherford and Freehold — format, group size, price & booking.',
    primaryTopic: 'game show experience new jersey',
    secondaryTopics: ['unique game show new jersey', 'great big game show new jersey', 'game show nj', 'game show near me'],
  },
  sitemap: { priority: 0.7, changefreq: 'monthly' },
  lastModified: '2026-10-03',
  schema: () => [article('/game-show-experiences-new-jersey/', 'Live Game Show Experiences in New Jersey (2026 Guide)', 'Compare in-person game show experiences in New Jersey.', '2026-10-03', '2026-10-03')],
  render: () => (
    <Shell breadcrumb={bc('NJ game show experiences', '/game-show-experiences-new-jersey/')}>
      <Section tone="light">
        <article className="mx-auto max-w-3xl">
          <Eyebrow>Guide · updated October 2026</Eyebrow>
          <h1 className="text-[2rem] font-black leading-tight sm:text-5xl">Live game show experiences in New Jersey</h1>
          <div className="prose-x mt-4 text-lg">
            <p>
              In-person game shows — where your group plays on a set with a host, buzzers and a scoreboard — have become one of New
              Jersey&rsquo;s most popular group outings. A few venues offer them, and they differ more than you&rsquo;d expect in group
              size, privacy and price. Here&rsquo;s a plain comparison so you can pick the one that fits your group and your drive.
            </p>
            <QuickAnswer q="Quick answer for Morris County">
              If you&rsquo;re in or near Rockaway, Denville, Dover, Randolph or Parsippany, the closest option is the{' '}
              <a href="/game-show-experience/">Game Show Room at Rockaway Townsquare</a>: private sessions for 6–8 players (40–60 for
              events), 60 minutes, from $33 per guest, ages 6+.
            </QuickAnswer>
            <h2>The options at a glance</h2>
            <div className="overflow-x-auto">
              <table>
                <caption className="sr-only">New Jersey live game show venues compared</caption>
                <thead><tr><th scope="col">Venue</th><th scope="col">Where</th><th scope="col">Format</th><th scope="col">Published price</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Game Show Room</th><td>Rockaway Townsquare, Rockaway (Morris County)</td><td>Private, host-led show; 6–8 players per session, 40–60 for events; 60 min; ages 6+</td><td>From $33/guest</td></tr>
                  <tr><th scope="row">Great Big Game Show</th><td>American Dream, East Rutherford (Bergen County)</td><td>Two teams on a studio-style set with a live host; up to 14 players per show</td><td>About $45/person (press reports)*</td></tr>
                  <tr><th scope="row">Game Show Challenge</th><td>Freehold (Monmouth County)</td><td>Trivia, survey, physical and puzzle challenges</td><td>Not listed on homepage*</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted">*Details for other venues come from their public websites and press coverage (e.g. NJ Monthly) as of October 2026 and can change — confirm directly with each venue. Game Show Room is not affiliated with these businesses or with &ldquo;Game Show Battle Rooms&rdquo;.</p>
            <h2>What to compare before you book</h2>
            <h3>1. Will you play with strangers?</h3>
            <p>Some venues fill open seats with other guests unless you buy out the show. Every Game Show Room booking is private to your group — useful for birthday parties and company events.</p>
            <h3>2. Group size</h3>
            <p>Shows built around two small teams cap out quickly. For a class, a department or a big family reunion, ask how the venue handles 20, 40 or 60 people. Game Show Room handles 40–60 players with extended or back-to-back shows and can crown one overall champion.</p>
            <h3>3. Ages</h3>
            <p>Check the minimum age and whether children need a paying adult with them. Game Show Room is designed for ages 6 and up, with kid-focused, family and adult versions of the questions.</p>
            <h3>4. The drive and parking</h3>
            <p>A large destination mall can mean garage parking and long walks. Rockaway Townsquare has free surface parking, and the Game Show Room entrance is on the first floor beside JCPenney.</p>
            <h3>5. What&rsquo;s included for parties</h3>
            <p>If it&rsquo;s a birthday, ask about a private room afterwards and whether you can bring your own cake. The Game Show Room Party Package adds an extra hour in a private Party Room, and you can bring your own cake, cupcakes or decorations.</p>
            <h2>Our take</h2>
            <p>If you&rsquo;re already near American Dream or the Jersey Shore, a local option will be easier. If you&rsquo;re anywhere in Morris, Sussex or Passaic County, the Rockaway Game Show Room is the practical choice, and every session is private to your group.</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BookingLink kind="small" label="nj_guide" size="lg">Book Game Show Room</BookingLink>
            <Button href="/pricing/" variant="outline" size="lg">See pricing</Button>
          </div>
        </article>
      </Section>
      <Related links={[
        { href: '/game-show-experience/', label: 'How our game show works', blurb: 'Rounds, ages, group sizes and what to expect.' },
        { href: '/birthday-parties/', label: 'Game show birthday parties', blurb: 'Party Room included with the Party Package.' },
        { href: '/group-events/corporate-team-building/', label: 'Corporate team building', blurb: 'Custom trivia for 40–60 players.' },
      ]} />
    </Shell>
  ),
};
