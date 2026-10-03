import type { RouteDef } from '../lib/types';
import { Shell } from '../components/Layout';
import { QuickAnswer, FAQSection, PriceStrip, PackageCard, VisitBlock, CtaBand, Related, QuoteForm } from '../components/sections';
import { Section, Eyebrow, H2, Button, BookingLink, CheckList, Card, PhoneLink, MapLink } from '../components/ui';
import { faqs, faqsFor, faqsByIds } from '../data/faqs';
import { faqPage, service, ids, article } from '../lib/schema';
import { business } from '../data/business';
import { nearbyAreas } from '../data/content';
import { fmtTime } from '../lib/format';

const bc = (name: string, path: string) => [{ name: 'Home', path: '/' }, { name, path }];

/* ======================= /pricing/ ======================= */
const priceFaqs = faqsByIds(['price', 'deposit', 'discounts', 'gift-cards', 'food-included', 'add-people', 'cancel']);
export const pricing: RouteDef = {
  path: '/pricing/', template: 'service', pageType: 'service', trackView: 'pricing_view',
  breadcrumb: bc('Pricing', '/pricing/'),
  seo: {
    title: 'Game Show Room Prices | From $%PRICE% per Guest | Rockaway NJ',
    description: 'How much is the Game Show Room in Rockaway, NJ? From $%PRICE% per guest for a private 60-minute live game show. Party, large-group & corporate pricing by quote.',
    primaryTopic: 'game show room price',
    secondaryTopics: ['how much is the game show', 'birthday party packages', 'affordable birthday party places'],
  },
  sitemap: { priority: 0.85, changefreq: 'monthly' },
  schema: () => [
    service({ id: ids.gameShow, name: 'Live Game Show Room experience', serviceType: 'Interactive live game show experience', description: 'Private 60-minute live game show. Pricing from $%PRICE% per guest, depending on group size and package.', url: '/game-show-experience/', priceFrom: 33 }),
    faqPage('/pricing/', priceFaqs),
  ],
  render: () => (
    <Shell breadcrumb={bc('Pricing', '/pricing/')}>
      <Section tone="light">
        <Eyebrow>Pricing</Eyebrow>
        <h1 className="text-[2rem] font-black leading-tight sm:text-5xl">Game Show Room pricing</h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="text-lg">
            <QuickAnswer q="How much does it cost?">Pricing starts at <strong>$%PRICE% per guest</strong> for a private, 60-minute live game show. The total depends on your group size and package — parties, large groups and corporate events get an exact quote.</QuickAnswer>
            <div className="mt-6"><PriceStrip trackLabel="pricing_page" /></div>
            <h2 className="mt-8 text-2xl font-black">What every booking includes</h2>
            <CheckList items={['A private session — your group only', 'A live host running the full show', 'Buzzers, lights, music and all equipment', 'Family, kid-focused or adult-level questions', 'Free parking at Rockaway Townsquare']} />
            <h2 className="mt-8 text-2xl font-black">Ways to save</h2>
            <CheckList items={['Special rates for qualifying groups, including nonprofits and large groups', 'Seasonal promotions and returning-player perks run from time to time — ask when you book', 'Gift cards available in custom amounts']} />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <BookingLink kind="small" label="pricing_page" size="lg">See times &amp; book online</BookingLink>
              <Button href="#quote" size="lg" variant="outline" track={{ event: 'click_book_now', label: 'pricing_quote' }}>Get a party/group quote</Button>
            </div>
          </div>
          <PackageCard trackLabel="pricing_page" />
        </div>
      </Section>
      <Section tone="paper" id="quote"><div className="mx-auto max-w-3xl"><QuoteForm context="pricing" heading="Get an exact price for your group" /></div></Section>
      <FAQSection list={priceFaqs} title="Pricing questions" />
      <Related links={[
        { href: '/blog/how-much-does-a-kids-birthday-party-cost-nj/', label: 'Kids party costs in NJ', blurb: 'How local venues price parties.' },
        { href: '/birthday-parties/', label: 'Birthday parties', blurb: 'Show + Party Room.' },
        { href: '/group-events/', label: 'Group events', blurb: '8 to 60 players.' },
      ]} />
    </Shell>
  ),
};

/* ======================= /faq/ ======================= */
const groups: { title: string; topic: string }[] = [
  { title: 'The game show', topic: 'game-show' },
  { title: 'Pricing', topic: 'pricing' },
  { title: 'Birthday parties', topic: 'birthday' },
  { title: 'Groups, schools & corporate', topic: 'groups' },
  { title: 'Booking', topic: 'booking' },
  { title: 'Visiting', topic: 'visit' },
];
export const faqPageRoute: RouteDef = {
  path: '/faq/', template: 'hub', pageType: 'hub',
  breadcrumb: bc('FAQ', '/faq/'),
  seo: {
    title: 'Game Show Room Rockaway FAQ | Ages, Prices, Parties',
    description: 'Answers about the Game Show Room in Rockaway, NJ: ages, group size, prices, birthday parties, cake policy, parking, booking, cancellations and accessibility.',
    primaryTopic: 'game show room faq',
  },
  sitemap: { priority: 0.7, changefreq: 'monthly' },
  schema: () => [faqPage('/faq/', faqs)],
  render: () => {
    const used = new Set<string>();
    return (
      <Shell breadcrumb={bc('FAQ', '/faq/')}>
        <Section tone="light">
          <Eyebrow>FAQ</Eyebrow>
          <h1 className="text-[2rem] font-black sm:text-5xl">Frequently asked questions</h1>
          <nav aria-label="FAQ topics" className="mt-6 flex flex-wrap gap-2">
            {groups.map((g) => <a key={g.topic} href={`#${g.topic}`} className="inline-flex min-h-11 items-center rounded-full border-2 border-ink bg-paper px-4 font-bold text-ink no-underline">{g.title}</a>)}
          </nav>
          {groups.map((g) => {
            const list = faqsFor([g.topic]).filter((f) => !used.has(f.id));
            list.forEach((f) => used.add(f.id));
            return (
              <section key={g.topic} id={g.topic} aria-labelledby={`h-${g.topic}`} className="mt-10 scroll-mt-20">
                <H2 id={`h-${g.topic}`} className="text-2xl sm:text-3xl">{g.title}</H2>
                <div className="mt-4 divide-y-2 divide-line rounded-2xl border-2 border-ink bg-paper">
                  {list.map((f) => (
                    <details key={f.id} className="group" data-faq={f.id}>
                      <summary className="flex min-h-14 items-center justify-between gap-4 px-5 py-3"><h3 className="font-sans text-[1.05rem] font-bold">{f.q}</h3><span aria-hidden="true" className="flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 border-ink text-xl group-open:rotate-45">+</span></summary>
                      <div className="px-5 pb-5 text-muted">{f.a}</div>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
          {(() => {
            const rest = faqs.filter((f) => !used.has(f.id));
            return rest.length ? (
              <section id="more" aria-labelledby="h-more" className="mt-10">
                <H2 id="h-more" className="text-2xl sm:text-3xl">More questions</H2>
                <div className="mt-4 divide-y-2 divide-line rounded-2xl border-2 border-ink bg-paper">
                  {rest.map((f) => (
                    <details key={f.id} className="group" data-faq={f.id}>
                      <summary className="flex min-h-14 items-center justify-between gap-4 px-5 py-3"><h3 className="font-sans text-[1.05rem] font-bold">{f.q}</h3><span aria-hidden="true" className="flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 border-ink text-xl group-open:rotate-45">+</span></summary>
                      <div className="px-5 pb-5 text-muted">{f.a}</div>
                    </details>
                  ))}
                </div>
              </section>
            ) : null;
          })()}
          <p className="mt-8 text-lg">Still have a question? Call <PhoneLink label="faq_page" className="font-bold text-flash-dark underline" /> or <a href="/contact/" className="font-bold text-flash-dark underline">contact us</a>.</p>
        </Section>
        <CtaBand label="faq" title="Ready to play?" body="Book online for 6–8 players or request a party quote." />
      </Shell>
    );
  },
};

/* ======================= /location/rockaway-nj/ ======================= */
const visitFaqs = faqsByIds(['where', 'parking', 'transit', 'accessible', 'late', 'same-day', 'food-included']);
export const location: RouteDef = {
  path: '/location/rockaway-nj/', template: 'location', pageType: 'service', trackView: 'view_location',
  breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Visit', path: '/location/rockaway-nj/' }],
  seo: {
    title: 'Directions, Parking & Hours | Game Show Room Rockaway NJ',
    description: 'Find the Game Show Room inside Rockaway Townsquare, 301 Mt Hope Ave, Rockaway NJ 07866 — first floor by JCPenney. Free parking, NJ Transit, hours and nearby towns.',
    primaryTopic: 'game show room rockaway townsquare directions',
    secondaryTopics: ['rockaway mall activities', 'rockaway mall events', '301 mount hope ave rockaway nj', 'rockaway mall kids activities'],
  },
  sitemap: { priority: 0.75, changefreq: 'monthly' },
  schema: () => [faqPage('/location/rockaway-nj/', visitFaqs)],
  render: () => (
    <Shell breadcrumb={[{ name: 'Home', path: '/' }, { name: 'Visit', path: '/location/rockaway-nj/' }]}>
      <Section tone="light">
        <Eyebrow>Visit · Rockaway, NJ</Eyebrow>
        <h1 className="text-[2rem] font-black leading-tight sm:text-5xl">Find us inside Rockaway Townsquare</h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="text-lg">
            <QuickAnswer q="Address">
              <address className="not-italic"><strong>{business.name}</strong><br />{business.address.street}<br />{business.address.city}, {business.address.region} {business.address.postalCode}</address>
              <p className="mt-2">Use the <strong>mall entrance near JCPenney</strong>. Our entrance is on the <strong>first floor, next to the JCPenney entrance</strong>.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <MapLink label="location_page" className="inline-flex min-h-12 items-center rounded-full border-2 border-ink bg-gold px-5 font-bold text-ink no-underline">Open in Google Maps</MapLink>
                <PhoneLink label="location_page" className="inline-flex min-h-12 items-center rounded-full border-2 border-ink bg-paper px-5 font-bold text-ink no-underline" />
              </div>
            </QuickAnswer>
            <h2 className="mt-8 text-2xl font-black">Getting here</h2>
            <CheckList items={[
              <><strong>By car:</strong> Rockaway Townsquare sits beside Route 80 in Rockaway, Morris County. Parking is <strong>free</strong> — no validation.</>,
              <><strong>By bus:</strong> NJ Transit bus routes serve Rockaway Townsquare — check current schedules before you travel.</>,
              <><strong>Accessibility:</strong> the Rockaway location is fully wheelchair accessible.</>,
              <><strong>Timing:</strong> arrive 10–15 minutes early. Late arrivals may get reduced playtime.</>,
            ]} />
          </div>
          <Card>
            <h2 className="text-2xl font-black">Hours</h2>
            <dl className="mt-3">
              {business.hours.map((h) => (
                <div key={h.label} className="flex justify-between border-b-2 border-line py-2.5"><dt className="font-bold">{h.days.join(', ').replace('Monday, Tuesday, Wednesday, Thursday', 'Monday – Thursday').replace('Friday, Saturday', 'Friday – Saturday')}</dt><dd>{fmtTime(h.opens)} – {fmtTime(h.closes)}</dd></div>
              ))}
            </dl>
            <p className="mt-3 text-sm text-muted">Sessions are by reservation — book at least 48 hours ahead. For same-day availability, call.</p>
            <h2 className="mt-8 text-2xl font-black">Nearby communities we serve</h2>
            <p className="mt-2 text-muted">Groups regularly come from across Morris County and beyond, including:</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {nearbyAreas.map((a) => <li key={a} className="rounded-full border-2 border-ink bg-cream px-3 py-1 text-sm font-bold">{a}</li>)}
            </ul>
          </Card>
        </div>
      </Section>
      <Section tone="paper" labelledBy="mall-title">
        <Eyebrow>Make a day of it</Eyebrow>
        <H2 id="mall-title">Things to do at Rockaway Townsquare</H2>
        <div className="prose-x max-w-3xl text-lg">
          <p>Looking for <strong>Rockaway mall activities</strong>? The Game Show Room is one of the indoor experiences at Rockaway Townsquare — book a show, then grab a meal at the mall&rsquo;s dining options. The same company also runs escape rooms at the mall; here&rsquo;s <a href="/game-show-vs-escape-room/">how a game show compares to an escape room</a>.</p>
          <p>For more ideas, see our guide to <a href="/things-to-do-rockaway-nj/">indoor things to do in Rockaway, NJ</a>.</p>
        </div>
      </Section>
      <FAQSection list={visitFaqs} title="Visiting questions" />
      <CtaBand label="location" title="See you at the podium" body="Book online or call the Rockaway team." />
    </Shell>
  ),
};

/* ======================= /things-to-do-rockaway-nj/ ======================= */
export const thingsToDo: RouteDef = {
  path: '/things-to-do-rockaway-nj/', template: 'guide', pageType: 'guide', trackView: 'view_service',
  breadcrumb: bc('Things to do in Rockaway', '/things-to-do-rockaway-nj/'),
  lastModified: '2026-10-03',
  seo: {
    title: 'Indoor Things to Do in Rockaway, NJ for Groups & Families',
    description: 'Indoor things to do near Rockaway, NJ: a live game show at Rockaway Townsquare for families, friends, teens and adults — plus ideas for rainy days and date nights.',
    primaryTopic: 'things to do in rockaway nj',
    secondaryTopics: ['things to do near rockaway nj', 'fun things to do rockaway nj', 'indoor activities near me', 'things to do near me for adults', 'kids activities rockaway'],
  },
  sitemap: { priority: 0.6, changefreq: 'monthly' },
  schema: () => [article('/things-to-do-rockaway-nj/', 'Indoor Things to Do in Rockaway, NJ for Groups & Families', 'Indoor group activity ideas near Rockaway, NJ.', '2026-10-03', '2026-10-03')],
  render: () => (
    <Shell breadcrumb={bc('Things to do in Rockaway', '/things-to-do-rockaway-nj/')}>
      <Section tone="light">
        <article className="mx-auto max-w-3xl">
          <Eyebrow>Local guide · Rockaway, Morris County</Eyebrow>
          <h1 className="text-[2rem] font-black leading-tight sm:text-5xl">Indoor things to do in Rockaway, NJ</h1>
          <div className="prose-x mt-4 text-lg">
            <p>Rockaway sits right on Route 80 in Morris County, which makes it an easy meeting point for groups from Denville, Dover, Randolph, Parsippany and the Lake Hopatcong area. When the weather turns — or you just want something more interesting than a movie — here&rsquo;s how to plan an indoor outing.</p>
            <QuickAnswer q="Best indoor group activity in Rockaway?">
              For a group of 6 or more, a <a href="/game-show-experience/">live game show at Rockaway Townsquare</a> is one of the most social options: 60 minutes, a live host, private to your group, ages 6+, from $%PRICE% per guest.
            </QuickAnswer>
            <h2>Ideas by who&rsquo;s coming</h2>
            <h3>Families with kids 6+</h3>
            <p>Kids and parents can play on the same team in the game show — the family-friendly version keeps questions fair for everyone. Younger siblings can watch from the sidelines. Pair it with lunch at the mall and you have a rainy-day plan.</p>
            <h3>Teens</h3>
            <p>Teens want something social that isn&rsquo;t a play area. A friend-group game show with teams and a scoreboard works for a Saturday, a <a href="/birthday-parties/teen-and-sweet-16/">13th birthday or a Sweet 16</a>.</p>
            <h3>Adults, date nights and friends</h3>
            <p>Two or three couples make a perfect 6–8 player group. The adult-level version raises the difficulty — then head to dinner. For milestone birthdays, see <a href="/birthday-parties/adult/">adult birthday parties</a>.</p>
            <h3>Work teams and big groups</h3>
            <p>Teams of 8–60 can play extended or back-to-back shows with an overall champion. See <a href="/group-events/corporate-team-building/">corporate team building</a>.</p>
            <h2>Escape room or game show?</h2>
            <p>Rockaway Townsquare also has escape rooms run by the same company. If your group loves silent puzzle-solving, try one; if you want a host, energy and head-to-head competition, pick the game show. <a href="/game-show-vs-escape-room/">Full comparison</a>.</p>
            <h2>Planning tips</h2>
            <ul>
              <li>Book at least 48 hours ahead; weekends and evenings fill first.</li>
              <li>Parking at Rockaway Townsquare is free.</li>
              <li>Enter by JCPenney — the Game Show Room entrance is on the first floor beside it.</li>
              <li>Hours: %HOURS%.</li>
            </ul>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BookingLink kind="small" label="things_to_do" size="lg">Book a game show</BookingLink>
            <Button href="/location/rockaway-nj/" variant="outline" size="lg">Directions &amp; parking</Button>
          </div>
        </article>
      </Section>
      <Related links={[
        { href: '/game-show-experience/', label: 'The live game show', blurb: 'How the hour works.' },
        { href: '/birthday-parties/kids/', label: 'Kids birthday parties', blurb: 'Ages 6–12, Party Room included.' },
        { href: '/game-show-experiences-new-jersey/', label: 'NJ game show experiences', blurb: 'Compare venues across the state.' },
      ]} />
    </Shell>
  ),
};
