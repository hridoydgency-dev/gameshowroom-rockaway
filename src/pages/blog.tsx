import matter from 'gray-matter';
import { marked } from 'marked';
import { blogFiles } from '../lib/content-store';
import type { RouteDef } from '../lib/types';
import { Shell } from '../components/Layout';
import { QuickAnswer, Related, CtaBand } from '../components/sections';
import { Section, Eyebrow, Button } from '../components/ui';
import { article } from '../lib/schema';

/** Blog posts are Markdown files in content/blog (edited in /admin → Blog posts). */
interface Post {
  slug: string; title: string; seoTitle: string; description: string; published: string; modified: string;
  primaryTopic: string; secondaryTopics: string[]; excerpt: string; html: string;
  related: { href: string; label: string; blurb: string }[];
}

const isoDate = (d: unknown) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? '').slice(0, 10));
marked.setOptions({ gfm: true });

const posts: Post[] = blogFiles().map(({ slug, raw }) => {
  const { data: fm, content } = matter(raw);
  for (const k of ['title', 'seoTitle', 'description', 'primaryTopic', 'excerpt']) {
    if (!fm[k]) throw new Error(`Blog post "${slug}" is missing "${k}" — fix it in /admin → Blog posts`);
  }
  const html = (marked.parse(content) as string)
    .replace(/<table>/g, '<div class="overflow-x-auto"><table>').replace(/<\/table>/g, '</table></div>')
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" rel="noopener" target="_blank"');
  return {
    slug, title: fm.title, seoTitle: fm.seoTitle, description: fm.description,
    published: isoDate(fm.published), modified: isoDate(fm.modified ?? fm.published),
    primaryTopic: fm.primaryTopic, secondaryTopics: fm.secondaryTopics ?? [], excerpt: fm.excerpt,
    related: fm.related ?? [], html,
  };
}).sort((x, y) => y.modified.localeCompare(x.modified));

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
            <div className="prose-x mt-6 text-lg" dangerouslySetInnerHTML={{ __html: p.html }} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/birthday-parties/" size="lg" track={{ event: 'click_book_now', label: `blog_${p.slug}` }}>See game show birthday parties</Button>
              <Button href="/pricing/" size="lg" variant="outline">Pricing</Button>
            </div>
          </article>
        </Section>
        {p.related.length > 0 && <Related links={p.related} />}
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
