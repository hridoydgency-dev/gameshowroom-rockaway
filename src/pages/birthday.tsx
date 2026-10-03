import type { ReactNode } from 'react';
import type { RouteDef, FAQ } from '../lib/types';
import { Shell } from '../components/Layout';
import { Hero, QuickAnswer, Steps, FAQSection, PackageCard, VisitBlock, CtaBand, Related, QuoteForm, TrustRow } from '../components/sections';
import { Section, Eyebrow, H2, Button, CheckList, Card } from '../components/ui';
import { ReviewSnippets, GoogleRatingLine } from '../components/reviews';
import { faqsByIds } from '../data/faqs';
import { faqPage, service, ids } from '../lib/schema';

const crumbs = (name?: string, path?: string) =>
  [{ name: 'Home', path: '/' }, { name: 'Birthday Parties', path: '/birthday-parties/' }, ...(name && path ? [{ name, path }] : [])];

const partySteps = [
  { title: 'Request your date', body: 'Use the party calendar or send a quick quote request. Book 48+ hours ahead — weekends go first.' },
  { title: 'Personalize it', body: 'Tell us the birthday guest’s name and interests for custom trivia, themed rounds or spotlight moments.' },
  { title: 'Hour 1: the show', body: 'Guests play a private, host-led game show with buzzers, lights and music.' },
  { title: 'Hour 2: Party Room', body: 'Head to the private Party Room for cake, pizza or catering and presents.' },
];

function BirthdayTemplate({
  path, name, hero, intro, quick, fit, planning, faqs, related, label, steps = partySteps, stepsTitle = 'Two hours, zero party planning stress', hub,
}: {
  path: string; name?: string; hero: Parameters<typeof Hero>[0]; intro: ReactNode; quick: ReactNode; fit: ReactNode;
  planning?: ReactNode; faqs: FAQ[]; related: { href: string; label: string; blurb: string }[]; label: string;
  steps?: { title: string; body: ReactNode }[]; stepsTitle?: string; hub?: boolean;
}) {
  return (
    <Shell breadcrumb={crumbs(name, name ? path : undefined)} sticky={{ href: '#quote', label: 'Get my party quote' }}>
      <Hero {...hero} />
      <Section tone="light" labelledBy={`${label}-intro`}>
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-start">
          <div className="prose-x text-lg">{intro}</div>
          {quick}
        </div>
        {hub && <div className="mt-10"><TrustRow /></div>}
      </Section>
      <ReviewSnippets path={path} tone="paper" title="What parents say on Google" />
      <Section tone="dark" labelledBy={`${label}-how`}>
        <Eyebrow dark>How the party works</Eyebrow>
        <H2 id={`${label}-how`}>{stepsTitle}</H2>
        <Steps dark steps={steps} />
      </Section>
      <Section tone="paper" id="package" labelledBy={`${label}-pkg`}>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow>The package</Eyebrow>
            <H2 id={`${label}-pkg`}>What&rsquo;s included</H2>
            {fit}
          </div>
          <PackageCard trackLabel={label} />
        </div>
      </Section>
      {planning}
      <Section tone="light" id="quote" labelledBy={`quote-${label}`}>
        <div className="mx-auto max-w-3xl"><QuoteForm context={label} heading="Get a free party quote" defaultType={label === 'bday_teen' ? 'Teen / Sweet 16 party' : label === 'bday_adult' ? 'Adult birthday' : 'Kids birthday party'} /></div>
      </Section>
      {hub && <VisitBlock id={`${label}-visit`} />}
      <FAQSection list={faqs} title={hub ? 'Birthday party questions' : `${name} — questions parents & planners ask`} />
      <Related links={related} />
      <CtaBand label={label} primaryHref="#quote" primaryText="Get my party quote" title="Make them the star of the show" body="Tell us the date and guest count — we'll reply with availability and an exact price." />
    </Shell>
  );
}

const bdayService = (path: string, name: string, audience: string, description: string) =>
  service({ id: path === '/birthday-parties/' ? ids.birthday : `https://gameshowroomrockaway.com${path}#service`, name, serviceType: 'Birthday party venue', description, url: path, priceFrom: 33, audience });

/* ======================= HUB: /birthday-parties/ ======================= */
const hubFaqs = faqsByIds(['bday-how', 'price', 'ages', 'bday-room', 'bday-cake', 'bday-custom', 'bday-advance', 'bday-supervision', 'bday-little', 'parking', 'cancel']);
export const birthdayHub: RouteDef = {
  path: '/birthday-parties/', template: 'service', pageType: 'service', trackView: 'view_birthday_party',
  breadcrumb: crumbs(),
  seo: {
    title: 'Game Show Birthday Parties in Rockaway, NJ | Party Room',
    description: 'Host a game show birthday party at Rockaway Townsquare: 1 hour of live game show + 1 hour in a private Party Room. Ages 6+. Bring your own cake. From $%PRICE%/guest.',
    primaryTopic: 'birthday party rockaway nj',
    secondaryTopics: ['game show birthday party', 'birthday party places near me', 'indoor birthday party nj', 'birthday party venues morris county'],
  },
  sitemap: { priority: 0.95, changefreq: 'monthly' },
  schema: () => [bdayService('/birthday-parties/', 'Game Show Birthday Party', 'Kids 6+, teens and adults', 'Private game show birthday party: 60 minutes of live, host-led game show plus an extra hour in a private Party Room. Custom birthday trivia. Bring your own cake.'), faqPage('/birthday-parties/', hubFaqs)],
  render: () => (
    <BirthdayTemplate
      path="/birthday-parties/" label="bday_hub" faqs={hubFaqs} hub
      hero={{
        eyebrow: 'Birthday parties · Rockaway, NJ',
        title: <>Game show birthday parties in <span className="text-gold">Rockaway, NJ</span></>,
        lead: <>The birthday guest gets the spotlight, everyone gets a buzzer. <strong>One hour of live game show</strong> + <strong>one hour in a private Party Room</strong> for cake and food — at Rockaway Townsquare.</>,
        primary: <Button href="#quote" size="lg" track={{ event: 'click_book_now', label: 'bday_hub_hero' }}>Get my party quote</Button>,
        secondary: <Button href="#package" size="lg" variant="ghost-light">What&rsquo;s included</Button>,
        note: <span className="flex flex-wrap items-center gap-x-3 gap-y-1"><GoogleRatingLine dark label="bday_hub_hero" /><span>Indoor · private · free parking</span></span>,
        chips: [{ k: 'Ages', v: '6 and up' }, { k: 'Party time', v: '~90 min–2 hrs' }, { k: 'Price', v: 'From $%PRICE%/guest' }, { k: 'Cake', v: 'Bring your own' }],
      }}
      intro={<>
        <Eyebrow>An indoor party they&rsquo;ll actually talk about</Eyebrow>
        <H2 id="bday_hub-intro">Not another bounce-and-pizza party</H2>
        <p>Parents searching for birthday party places near Rockaway mostly find the same formats: trampolines, arcades, bowling. A game show party is different — every guest plays together in one private room, a live host runs the show, and the birthday guest can get <strong>personalized trivia, themed rounds or a spotlight moment</strong>.</p>
        <p>After the show, the party moves to a <strong>private Party Room</strong> for an extra hour of cake, pizza or catering. You&rsquo;re welcome to bring your own cake, cupcakes and decorations — just let us know in advance.</p>
        <p>Choose your party:</p>
        <ul>
          <li><a href="/birthday-parties/kids/">Kids birthday parties (ages 6–12)</a></li>
          <li><a href="/birthday-parties/teen-and-sweet-16/">Teen, 13th &amp; Sweet 16 parties</a></li>
          <li><a href="/birthday-parties/adult/">Adult and milestone birthdays</a></li>
        </ul>
      </>}
      quick={<QuickAnswer q="Birthday party in one glance">
        <ul className="mt-1 space-y-1.5">
          <li><strong>Format:</strong> 1 hr game show + 1 hr private Party Room</li>
          <li><strong>Ages:</strong> 6+ to play; little ones can watch</li>
          <li><strong>Price:</strong> game show from $%PRICE% per guest — get a quote for your total</li>
          <li><strong>Food:</strong> bring your own cake, pizza or catering</li>
          <li><strong>Book:</strong> at least 48 hours ahead</li>
          <li><strong>Where:</strong> Rockaway Townsquare, free parking</li>
        </ul>
      </QuickAnswer>}
      fit={<>
        <p className="mt-3 text-lg">The Game Show Room Party Package covers the hard parts — entertainment, hosting and a room for cake — so you can actually enjoy the party.</p>
        <CheckList items={['A live host runs the entire game show', 'Custom birthday trivia and spotlight moments', 'Private session — no strangers in your party', 'Extra hour in a private Party Room', 'Parents can watch and cheer from the sidelines']} />
      </>}
      related={[
        { href: '/birthday-parties/kids/', label: 'Kids parties (6–12)', blurb: 'What a game show party looks like for younger kids.' },
        { href: '/blog/how-much-does-a-kids-birthday-party-cost-nj/', label: 'What does a party cost in NJ?', blurb: 'Published prices from local venues, compared.' },
        { href: '/blog/birthday-party-ideas-by-age/', label: 'Birthday ideas by age', blurb: 'From 6th birthdays to 50ths.' },
      ]}
    />
  ),
};

/* ======================= /birthday-parties/kids/ ======================= */
const kidsFaqs = faqsByIds(['ages', 'bday-supervision', 'bday-little', 'bday-cake', 'bday-custom', 'price', 'bday-advance', 'watchers', 'what-to-wear', 'parking']);
export const kidsBirthday: RouteDef = {
  path: '/birthday-parties/kids/', template: 'service', pageType: 'landing', trackView: 'view_birthday_party',
  breadcrumb: crumbs('Kids parties', '/birthday-parties/kids/'),
  seo: {
    title: 'Kids Birthday Party Place in Rockaway, NJ (Ages 6–12)',
    description: 'Looking for a kids birthday party place near Rockaway? A private live game show + party room for ages 6–12 at Rockaway Townsquare. Bring your own cake. Get a quote.',
    primaryTopic: 'kids birthday party places near me',
    secondaryTopics: ['kids birthday party rockaway nj', 'birthday party places for kids near me', 'indoor kids birthday party nj', '10 year old birthday party', 'girls birthday party places'],
  },
  sitemap: { priority: 0.9, changefreq: 'monthly' },
  schema: () => [bdayService('/birthday-parties/kids/', 'Kids Game Show Birthday Party', 'Children ages 6–12 and their parents', 'Private, host-led game show birthday party for kids ages 6–12 with an extra hour in a private Party Room.'), faqPage('/birthday-parties/kids/', kidsFaqs)],
  render: () => (
    <BirthdayTemplate
      path="/birthday-parties/kids/" name="Kids parties" label="bday_kids" faqs={kidsFaqs}
      stepsTitle="What the kids actually do"
      steps={[
        { title: 'Team huddle', body: 'The host splits the kids into teams and explains the buzzers — no experience needed.' },
        { title: 'Buzz & answer', body: 'Kid-focused trivia rounds; the birthday kid gets a custom round about them.' },
        { title: 'Silly challenges', body: 'Puzzles and light physical challenges that get everyone laughing.' },
        { title: 'Cake time', body: 'Champions crowned, then everyone moves to the private Party Room.' },
      ]}
      hero={{
        eyebrow: 'Kids birthday parties · ages 6–12',
        title: <>A kids birthday party <span className="text-gold">starring your kid</span></>,
        lead: <>Buzzers, lights, a live host and trivia about the birthday kid — then cake in a private Party Room. An indoor party place in <strong>Rockaway, NJ</strong> that works rain or shine.</>,
        primary: <Button href="#quote" size="lg" track={{ event: 'click_book_now', label: 'bday_kids_hero' }}>Get my party quote</Button>,
        secondary: <Button href="#package" size="lg" variant="ghost-light">See the package</Button>,
        note: 'Parents watch free from the sidelines · younger siblings welcome to cheer',
        chips: [{ k: 'Best for', v: 'Ages 6–12' }, { k: 'Party time', v: '~2 hours' }, { k: 'Price', v: 'From $%PRICE%/guest' }, { k: 'Room', v: 'Private' }],
      }}
      intro={<>
        <Eyebrow>Why parents pick it</Eyebrow>
        <H2 id="bday_kids-intro">Every kid plays — nobody wanders off</H2>
        <p>At a lot of party places, kids scatter the moment they arrive. In the Game Show Room, the whole group plays together for the full hour — buzzing in, solving puzzles and taking on silly, light physical challenges — while a host keeps the energy up and makes sure the birthday kid gets the spotlight.</p>
        <p>It&rsquo;s especially popular for <strong>7th to 12th birthdays</strong>, when kids are old enough to love competition and trivia but still want a &ldquo;real&rdquo; party. The questions use a kid-focused version of the game, and the host can adjust activities for younger players.</p>
        <h3>What parents need to know</h3>
        <ul>
          <li>At least one adult (18+) must stay for kids&rsquo; parties — our staff host the game.</li>
          <li>Bring your own cake, cupcakes or decorations; tell us in advance and we&rsquo;ll set up.</li>
          <li>Comfortable clothes and closed-toe shoes for the light physical challenges.</li>
          <li>Free parking at Rockaway Townsquare; enter by JCPenney.</li>
        </ul>
      </>}
      quick={<QuickAnswer q="Is it right for my kid?">
        <p>Yes if they&rsquo;re <strong>6 or older</strong> and like games, trivia or friendly competition. Younger siblings can come and cheer. For toddler or 1st–5th birthdays, the play portion isn&rsquo;t designed for that age.</p>
      </QuickAnswer>}
      fit={<>
        <p className="mt-3 text-lg">Everything you need for a stress-free kids party in one place.</p>
        <CheckList items={['60-minute private game show with a live host', 'Kid-focused questions + custom birthday trivia', 'Extra hour in a private Party Room', 'Bring your own cake, pizza or catering', 'Parents can watch and take (limited) photos']} />
      </>}
      planning={
        <Section tone="light" labelledBy="kids-plan">
          <Eyebrow>Planning checklist</Eyebrow>
          <H2 id="kids-plan">Plan it in 10 minutes</H2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { t: '2+ weeks out', d: 'Pick a date and request a quote. Weekends and evenings fill first.' },
              { t: '1 week out', d: 'Send the birthday kid’s name, age and favorite things for custom trivia. Confirm cake/pizza plans.' },
              { t: 'Party day', d: 'Arrive 10–15 minutes early. One adult (18+) stays. We run the show.' },
            ].map((x) => <Card key={x.t}><p className="font-black text-flash-dark">{x.t}</p><p className="mt-1">{x.d}</p></Card>)}
          </div>
        </Section>
      }
      related={[
        { href: '/blog/birthday-party-ideas-by-age/', label: 'Party ideas for ages 6–12', blurb: 'Themes and ideas by age.' },
        { href: '/blog/how-much-does-a-kids-birthday-party-cost-nj/', label: 'Kids party costs in NJ', blurb: 'Local published prices compared.' },
        { href: '/birthday-parties/teen-and-sweet-16/', label: 'Turning 13+?', blurb: 'Teen & Sweet 16 game show parties.' },
      ]}
    />
  ),
};

/* ======================= /birthday-parties/teen-and-sweet-16/ ======================= */
const teenFaqs = faqsByIds(['bday-how', 'bday-custom', 'players', 'large', 'price', 'bday-cake', 'bday-nonplayers', 'bday-advance', 'photos']);
export const teenBirthday: RouteDef = {
  path: '/birthday-parties/teen-and-sweet-16/', template: 'service', pageType: 'landing', trackView: 'view_birthday_party',
  breadcrumb: crumbs('Teen & Sweet 16', '/birthday-parties/teen-and-sweet-16/'),
  seo: {
    title: 'Teen & Sweet 16 Party Venue in Rockaway, NJ | Game Show',
    description: 'A 13th birthday or Sweet 16 teens actually want: a private live game show with custom trivia about the guest of honor, plus a party room. Rockaway Townsquare, NJ.',
    primaryTopic: 'teen birthday party places near me',
    secondaryTopics: ['sweet 16 venues near me', '13th birthday party ideas', 'teen birthday party ideas near me', 'sweet sixteen party venues near me'],
  },
  sitemap: { priority: 0.8, changefreq: 'monthly' },
  schema: () => [bdayService('/birthday-parties/teen-and-sweet-16/', 'Teen & Sweet 16 Game Show Party', 'Teenagers ages 13–19', 'Private game show party for teens and Sweet 16s with custom trivia about the guest of honor and an extra hour in a private Party Room.'), faqPage('/birthday-parties/teen-and-sweet-16/', teenFaqs)],
  render: () => (
    <BirthdayTemplate
      path="/birthday-parties/teen-and-sweet-16/" name="Teen & Sweet 16" label="bday_teen" faqs={teenFaqs}
      stepsTitle="How a teen game show party plays out"
      steps={[
        { title: 'Pick the squad', body: 'Friend groups split into teams — rivalries encouraged.' },
        { title: 'Inside-joke trivia', body: 'Send us facts about the guest of honor; the host turns them into a round.' },
        { title: 'Head-to-head', body: 'Buzzers, puzzles and challenges — with a live scoreboard.' },
        { title: 'Cake & content', body: 'The Party Room is yours for cake, food and the group photo.' },
      ]}
      hero={{
        eyebrow: 'Teen, 13th & Sweet 16 parties',
        title: <>The party teens <span className="text-gold">won&rsquo;t call babyish</span></>,
        lead: <>A private, host-led game show with trivia written around the guest of honor — then the Party Room for cake. Competitive, loud and very group-chat-worthy. At Rockaway Townsquare, NJ.</>,
        primary: <Button href="#quote" size="lg" track={{ event: 'click_book_now', label: 'bday_teen_hero' }}>Get my party quote</Button>,
        secondary: <Button href="#package" size="lg" variant="ghost-light">What&rsquo;s included</Button>,
        chips: [{ k: 'Best for', v: '13–19' }, { k: 'Party time', v: '~2 hours' }, { k: 'Group', v: '6–8 · up to 60' }, { k: 'Price', v: 'From $%PRICE%/guest' }],
      }}
      intro={<>
        <Eyebrow>Why it works for teens</Eyebrow>
        <H2 id="bday_teen-intro">Competitive, social and built around them</H2>
        <p>Parents planning <strong>13th birthdays and Sweet 16s</strong> run into the same problem: the old kids&rsquo; party places stop working. Teens want something social and a little competitive — not a play area.</p>
        <p>A game show hits that. Friends split into teams, the host keeps it moving, and rounds of custom trivia about the guest of honor (inside jokes welcome) make them the star without a microphone in their face. Bigger friend groups? Teams rotate through rounds and one overall champion is crowned.</p>
        <p>Afterwards, the private Party Room is yours for cake, pizza or catering — bring your own decorations and dessert.</p>
      </>}
      quick={<QuickAnswer q="Good for a Sweet 16?">
        <p>Yes — especially for friend groups of 6 to 30+. For bigger Sweet 16s, ask for a quote: the team can run extended or back-to-back shows for 40–60 guests.</p>
      </QuickAnswer>}
      fit={<>
        <p className="mt-3 text-lg">Everything happens in private rooms — just your guests.</p>
        <CheckList items={['Custom trivia about the guest of honor', 'Adult-level or family questions — your call', 'Teams for bigger friend groups', 'Extra hour in a private Party Room', 'Bring your own cake & decorations']} />
      </>}
      related={[
        { href: '/blog/birthday-party-ideas-by-age/', label: 'Teen party ideas', blurb: 'What works for 13ths and Sweet 16s.' },
        { href: '/birthday-parties/adult/', label: 'Adult birthdays', blurb: '21st, 30th, 40th and beyond.' },
        { href: '/game-show-experience/', label: 'How the game show works', blurb: 'Rounds, rules and what to expect.' },
      ]}
    />
  ),
};

/* ======================= /birthday-parties/adult/ ======================= */
const adultFaqs = faqsByIds(['bday-how', 'challenges', 'bday-custom', 'players', 'large', 'price', 'bday-cake', 'where', 'parking']);
export const adultBirthday: RouteDef = {
  path: '/birthday-parties/adult/', template: 'service', pageType: 'landing', trackView: 'view_birthday_party',
  breadcrumb: crumbs('Adult birthdays', '/birthday-parties/adult/'),
  seo: {
    title: 'Adult Birthday Party Ideas in Rockaway, NJ | Game Show',
    description: 'Fun adult birthday idea in Morris County: host a private live game show with custom trivia about the birthday person — 30th, 40th, 50th or 60th. Rockaway, NJ.',
    primaryTopic: 'adult birthday party ideas near me',
    secondaryTopics: ['birthday activities for adults', 'places to have an adult birthday party', '40th birthday ideas', '50th birthday ideas', 'fun things to do for birthday adults near me'],
  },
  sitemap: { priority: 0.8, changefreq: 'monthly' },
  schema: () => [bdayService('/birthday-parties/adult/', 'Adult Birthday Game Show Party', 'Adults', 'Private, host-led game show with adult-level questions and custom trivia about the birthday person, plus an optional private Party Room.'), faqPage('/birthday-parties/adult/', adultFaqs)],
  render: () => (
    <BirthdayTemplate
      path="/birthday-parties/adult/" name="Adult birthdays" label="bday_adult" faqs={adultFaqs}
      stepsTitle="An evening plan that writes itself"
      steps={[
        { title: 'Book the show', body: 'Online for 6–8 adults, or ask for a quote for a bigger party.' },
        { title: 'Send the dirt', body: 'Give the host stories and facts for the birthday person’s custom round.' },
        { title: 'Play for an hour', body: 'Adult-level trivia, puzzles and challenges with a live host.' },
        { title: 'Toast after', body: 'Add the Party Room for cake, or head to dinner at the mall.' },
      ]}
      hero={{
        eyebrow: 'Adult & milestone birthdays',
        title: <>Skip the dinner reservation. <span className="text-gold">Host a game show.</span></>,
        lead: <>For a 30th, 40th, 50th or 60th: a private live game show with adult-level questions and a custom round about the birthday person. In Rockaway, NJ — dinner nearby after.</>,
        primary: <Button href="#quote" size="lg" track={{ event: 'click_book_now', label: 'bday_adult_hero' }}>Get my party quote</Button>,
        secondary: <Button href="/book/" size="lg" variant="ghost-light" track={{ event: 'click_book_now', label: 'bday_adult_hero_book' }}>Book 6–8 online</Button>,
        chips: [{ k: 'Version', v: 'Adult-level' }, { k: 'Length', v: '60 min show' }, { k: 'Group', v: '6–8 · up to 60' }, { k: 'Price', v: 'From $%PRICE%/guest' }],
      }}
      intro={<>
        <Eyebrow>An adult birthday idea that isn&rsquo;t a bar</Eyebrow>
        <H2 id="bday_adult-intro">Everyone plays. Somebody wins. The birthday person is the story.</H2>
        <p>Search &ldquo;adult birthday party ideas&rdquo; and most answers are dinner, drinks or a weekend away. A game show is the rare idea that works for a mixed crowd: competitive friends, quiet in-laws, the coworker who knows everything about 90s TV.</p>
        <p>The adult-level version raises the difficulty, and the host can build a custom round about the birthday person — embarrassing stories optional. Book a standard session for 6–8 players online, or request a quote for a bigger party with the Party Room.</p>
        <h3>Ideas by milestone</h3>
        <ul>
          <li><strong>21st–30th:</strong> friend groups who want something before going out.</li>
          <li><strong>40th–50th:</strong> couples and old friends — teams of spouses vs. spouses works well.</li>
          <li><strong>60th–70th+:</strong> family-wide parties with kids and grandkids playing together (ages 6+).</li>
        </ul>
      </>}
      quick={<QuickAnswer q="Do we need the Party Room?">
        <p>Not necessarily. For 6–8 adults, a standard 60-minute session is enough — then walk to dinner at the mall. Add the Party Package if you want cake and presents on site.</p>
      </QuickAnswer>}
      fit={<>
        <p className="mt-3 text-lg">A private show for your guests, with options for bigger celebrations.</p>
        <CheckList items={['Adult-level questions', 'Custom round about the birthday person', 'Private room — just your group', 'Optional extra hour in the Party Room', 'Good for bachelor/bachelorette groups and reunions too']} />
      </>}
      related={[
        { href: '/blog/birthday-party-ideas-by-age/', label: 'Birthday ideas by age', blurb: 'Including 30th to 70th ideas.' },
        { href: '/group-events/', label: 'Big group or reunion?', blurb: 'Shows for 40–60 players.' },
        { href: '/things-to-do-rockaway-nj/', label: 'Things to do in Rockaway', blurb: 'Make a day or night of it.' },
      ]}
    />
  ),
};
