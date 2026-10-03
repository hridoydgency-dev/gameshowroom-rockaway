import type { ReactNode } from 'react';
import type { RouteDef } from '../lib/types';
import { Shell } from '../components/Layout';
import { QuickAnswer, Related, CtaBand } from '../components/sections';
import { Section, Eyebrow, Button } from '../components/ui';
import { article } from '../lib/schema';

/** Blog post registry — add a post object here; listing + routes generate automatically. */
interface Post {
  slug: string; title: string; seoTitle: string; description: string; published: string; modified: string;
  primaryTopic: string; secondaryTopics: string[]; excerpt: string; body: () => ReactNode;
  related: { href: string; label: string; blurb: string }[];
}

const posts: Post[] = [
  {
    slug: 'birthday-party-ideas-by-age',
    title: 'Birthday party ideas by age: from 6th birthdays to 60ths',
    seoTitle: 'Birthday Party Ideas by Age (6 to 60+) | NJ Parent Guide',
    description: 'Birthday party ideas that fit the age: what works for 6–8, 9–12, 13th and Sweet 16, 21st and milestone adult birthdays — with indoor options near Rockaway, NJ.',
    published: '2026-10-03', modified: '2026-10-03',
    primaryTopic: 'birthday party ideas',
    secondaryTopics: ['kids birthday party ideas', '10 year old birthday party ideas', 'teen birthday party ideas', '13th birthday party ideas', 'adult birthday party ideas', '40th birthday ideas'],
    excerpt: 'What actually works at each age — and the questions to ask before you book a venue.',
    related: [
      { href: '/birthday-parties/kids/', label: 'Kids game show parties', blurb: 'Ages 6–12 with a Party Room.' },
      { href: '/birthday-parties/teen-and-sweet-16/', label: 'Teen & Sweet 16 parties', blurb: 'Custom trivia about the guest of honor.' },
      { href: '/birthday-parties/adult/', label: 'Adult birthdays', blurb: 'A game show instead of a dinner reservation.' },
    ],
    body: () => (
      <>
        <p>The right birthday party depends less on the theme and more on the age. A 6-year-old needs short, simple activities and a parent nearby; a 13-year-old wants friends, competition and nothing that looks &ldquo;little kid&rdquo;; a 40-year-old wants something more memorable than another dinner. Here&rsquo;s a practical guide, age by age.</p>
        <QuickAnswer q="The short version">
          <ul className="mt-1 space-y-1">
            <li><strong>Ages 6–8:</strong> short, structured, active; one adult per few kids</li>
            <li><strong>Ages 9–12:</strong> competition and teams; let the birthday kid &ldquo;star&rdquo;</li>
            <li><strong>13–16:</strong> social, phone-worthy, not babyish</li>
            <li><strong>Adults:</strong> a shared experience beats another restaurant</li>
          </ul>
        </QuickAnswer>
        <h2>Ages 6–8: keep it structured</h2>
        <p>Kids this age do best when an adult (or host) is running the activity and the schedule is predictable: an activity, food, cake, presents. Look for venues with a separate room for cake so the energy can come down before pickup.</p>
        <ul><li>Ideas: craft parties, simple sports games, a kid-version game show, a themed scavenger hunt at home.</li><li>Ask venues: minimum age, adult supervision rules, and whether you can bring your own cake.</li></ul>
        <h2>Ages 9–12: add competition</h2>
        <p>This is the peak age for team games, trivia and challenges. Kids want to win something and want the birthday kid to be celebrated without being embarrassed. Personalized touches — trivia about the birthday kid, a team named after them — land well.</p>
        <ul><li>Ideas: game show parties, laser tag, bowling, a backyard &ldquo;olympics&rdquo;, cooking challenges.</li><li>Tip: girls&rsquo; and boys&rsquo; parties at this age are often mixed friend groups — pick an activity where everyone plays together.</li></ul>
        <h2>13th birthdays and Sweet 16s: social first</h2>
        <p>Teens judge a party by whether their friends will talk about it. Anything that looks like a play area is out. Competitive group activities, a reserved room and freedom to bring their own decorations and food go a long way.</p>
        <ul><li>Ideas: a <a href="/birthday-parties/teen-and-sweet-16/">game show party with inside-joke trivia</a>, karaoke, a paint-and-sip (mocktail) night, a progressive dinner.</li><li>For bigger Sweet 16s, ask how the venue handles 30–60 guests.</li></ul>
        <h2>21st to 30th: before the night out</h2>
        <p>Friend groups often want a &ldquo;pregame&rdquo; activity that gets everyone together before dinner or drinks. Something with teams and a scoreboard breaks the ice between different friend circles.</p>
        <h2>40th, 50th and 60th: make it a story</h2>
        <p>Milestone birthdays are about the people. Activities where spouses, old friends and family can all play — and where the birthday person is the focus — beat a long dinner. A custom trivia round about the birthday person is a reliable crowd-pleaser.</p>
        <ul><li>Ideas: a <a href="/birthday-parties/adult/">private game show</a>, a cooking class, a family trivia night, a weekend getaway.</li></ul>
        <h2>70th and family-wide celebrations</h2>
        <p>When guests span three generations, pick something that works for ages 6 to 80+ at once and lets some people simply watch. A host-led game show where non-players can cheer from the sidelines fits that brief.</p>
        <h2>Questions to ask any party venue</h2>
        <ol><li>What&rsquo;s the minimum age, and do parents need to stay?</li><li>Is the room private, or will other groups be there?</li><li>Can we bring our own cake, food and decorations?</li><li>What&rsquo;s the total price for my guest count — and what&rsquo;s the deposit and cancellation policy?</li><li>Where do we park?</li></ol>
      </>
    ),
  },
  {
    slug: 'how-much-does-a-kids-birthday-party-cost-nj',
    title: 'How much does a kids birthday party cost in NJ? (Rockaway-area prices)',
    seoTitle: 'How Much Does a Kids Birthday Party Cost in NJ? (2026)',
    description: 'Real published 2026 prices for kids birthday parties near Rockaway, NJ — bowling, active play and game show parties — and what each price includes.',
    published: '2026-10-03', modified: '2026-10-03',
    primaryTopic: 'how much does a kids birthday party cost',
    secondaryTopics: ['affordable birthday party places', 'birthday party packages', 'kids birthday party venues near me', 'birthday party prices nj'],
    excerpt: 'Published prices from Rockaway-area venues, side by side — and the hidden costs to check.',
    related: [
      { href: '/pricing/', label: 'Game Show Room pricing', blurb: 'From $33 per guest.' },
      { href: '/birthday-parties/kids/', label: 'Kids game show parties', blurb: 'Show + Party Room.' },
      { href: '/blog/birthday-party-ideas-by-age/', label: 'Party ideas by age', blurb: 'What works at 6, 10, 13 and beyond.' },
    ],
    body: () => (
      <>
        <p>Venue party prices are confusing because every place bundles differently: per child or per package, food included or not, minimum guest counts, deposits. Below are <strong>published prices from venues in and around Rockaway, NJ</strong>, collected from their own websites in October 2026, so you can compare like with like.</p>
        <QuickAnswer q="Typical range">
          Based on the published packages below, venue-hosted kids parties near Rockaway run from roughly <strong>$22 to $79 per child</strong>, depending on whether food is included and what the activity is. Most packages are about 2 hours.
        </QuickAnswer>
        <h2>Published prices near Rockaway (October 2026)</h2>
        <div className="overflow-x-auto">
          <table>
            <caption className="sr-only">Published kids birthday party prices near Rockaway NJ, October 2026</caption>
            <thead><tr><th scope="col">Venue &amp; package</th><th scope="col">Published price</th><th scope="col">What&rsquo;s included</th><th scope="col">Notes</th></tr></thead>
            <tbody>
              <tr><th scope="row">Rockaway Lanes — bowling party</th><td>$21.95–$25.50 per person</td><td>2 hours (1 hr bowling + 1 hr party room), food &amp; drink, shoes</td><td>10-child minimum; $40 deposit</td></tr>
              <tr><th scope="row">Xtreme Energy (Rockaway Townsquare) — active play</th><td>$590 for 10 guests; $885–$1,185 for 15</td><td>2 hours, play areas, party room, pizza, juice, cake or cupcakes</td><td>$59–$79 per additional child</td></tr>
              <tr><th scope="row">Game Show Room (Rockaway Townsquare)</th><td>From $33 per guest</td><td>Private 60-min live game show; Party Package adds 1 hr private Party Room</td><td>Bring your own cake/food; exact party total by quote</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted">Sources: rockawaylanes.com/birthday-parties and xtreme.energy/party/rockaway, accessed October 2026. Prices change — confirm with each venue. Game Show Room is not affiliated with the other venues listed.</p>
        <h2>How to compare fairly</h2>
        <h3>1. Price per child vs. package price</h3>
        <p>A package for 10 or 15 kids can look expensive but include food and dessert; a lower per-child price may exclude them. Convert everything to &ldquo;total for my guest count, including food&rdquo;.</p>
        <h3>2. Food rules</h3>
        <p>Some venues require their own catering or ban outside food except cake. If you&rsquo;d rather order from a favorite local pizzeria or bring homemade cupcakes, check first. At Game Show Room you can bring your own cake, cupcakes, food and decorations with advance notice.</p>
        <h3>3. Minimums and deposits</h3>
        <p>Minimum guest counts (often 10+) and deposits change the real cost for small parties. Ask what happens if fewer kids show up.</p>
        <h3>4. Who runs the party?</h3>
        <p>A dedicated host or game runner means parents can actually enjoy the party. Ask whether staff run the activity or just supervise the room.</p>
        <h3>5. Hidden extras</h3>
        <p>Grip socks, waivers, adult admission, decorations, tax and gratuity can add up. Ask for an all-in quote.</p>
        <h2>Budget tips</h2>
        <ul><li>Weekday or earlier-in-the-day slots are often easier to get — ask about availability and any promotions.</li><li>Keep the guest list to the activity&rsquo;s sweet spot (for a game show, a group of 6–8 is a standard session).</li><li>Bring your own dessert where allowed.</li></ul>
      </>
    ),
  },
];

const bc = (title: string, path: string) => [{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog/' }, { name: title, path }];

export const blogRoutes: RouteDef[] = posts.map((p) => {
  const path = `/blog/${p.slug}/`;
  const crumbs = bc(p.title.split(':')[0].split('?')[0] + (p.title.includes('?') ? '?' : ''), path);
  return {
    path, template: 'article', pageType: 'article', trackView: 'view_article', breadcrumb: crumbs, lastModified: p.modified,
    seo: { title: p.seoTitle, description: p.description, primaryTopic: p.primaryTopic, secondaryTopics: p.secondaryTopics },
    sitemap: { priority: 0.6, changefreq: 'monthly' },
    schema: () => [article(path, p.title, p.description, p.published, p.modified)],
    render: () => (
      <Shell breadcrumb={crumbs}>
        <Section tone="light">
          <article className="mx-auto max-w-3xl">
            <Eyebrow>Party planning · {new Date(p.modified).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Eyebrow>
            <h1 className="text-[2rem] font-black leading-tight sm:text-5xl">{p.title}</h1>
            <p className="mt-3 text-sm text-muted">By the Game Show Room Rockaway team · Updated <time dateTime={p.modified}>{p.modified}</time></p>
            <div className="prose-x mt-6 text-lg">{p.body()}</div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/birthday-parties/" size="lg" track={{ event: 'click_book_now', label: `blog_${p.slug}` }}>See game show birthday parties</Button>
              <Button href="/pricing/" size="lg" variant="outline">Pricing</Button>
            </div>
          </article>
        </Section>
        <Related links={p.related} />
        <CtaBand label={`blog_${p.slug}`} primaryHref="/book/" title="Planning a party near Rockaway?" body="Get a free quote for a private game show party with a Party Room." />
      </Shell>
    ),
  };
});

export const blogIndex: RouteDef = {
  path: '/blog/', template: 'hub', pageType: 'hub',
  breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog/' }],
  seo: {
    title: 'Party Planning Blog | Game Show Room Rockaway NJ',
    description: 'Birthday party ideas, costs and group-outing guides for families and planners in Rockaway and Morris County, NJ.',
    primaryTopic: 'birthday party planning nj',
  },
  sitemap: { priority: 0.5, changefreq: 'weekly' },
  render: () => (
    <Shell breadcrumb={[{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog/' }]}>
      <Section tone="light">
        <Eyebrow>Blog</Eyebrow>
        <h1 className="text-[2rem] font-black sm:text-5xl">Party planning guides</h1>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {posts.map((p) => (
            <li key={p.slug}>
              <a href={`/blog/${p.slug}/`} className="block h-full rounded-2xl border-2 border-ink bg-paper p-6 text-ink no-underline shadow-[var(--shadow-pop)] hover:-translate-y-0.5">
                <h2 className="text-2xl font-black">{p.title}</h2>
                <p className="mt-2 text-muted">{p.excerpt}</p>
                <span className="mt-3 inline-block font-bold text-flash-dark">Read the guide →</span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </Shell>
  ),
};
