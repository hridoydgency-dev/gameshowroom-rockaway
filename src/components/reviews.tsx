/**
 * Review UI — renders ONLY verified, sourced reviews from content.ts.
 * Visible rating text is fine; no AggregateRating/Review schema is emitted (self-serving reviews
 * are ineligible for Google review rich results).
 */
import { testimonials, reviewProfiles, reviewsFor } from '../data/content';
import type { Testimonial } from '../lib/types';
import { Section, Eyebrow, H2, cx } from './ui';

const google = reviewProfiles.find((p) => p.platform === 'google')!;
const fmtDate = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export function Stars({ rating, className = 'h-5 w-5' }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={cx(className, i <= Math.round(rating) ? 'text-gold' : 'text-line')} aria-hidden="true">
          <path fill="currentColor" stroke="#15102f" strokeWidth="1" d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z" />
        </svg>
      ))}
    </span>
  );
}

/** Compact "★ 5.0 on Google · 5 reviews" line — for hero notes and trust rows. */
export function GoogleRatingLine({ dark, label }: { dark?: boolean; label: string }) {
  return (
    <a
      href={google.url} rel="noopener" target="_blank" data-track="review_click" data-track-label={label}
      className={cx('inline-flex items-center gap-2 font-semibold no-underline hover:underline', dark ? 'text-paper' : 'text-ink')}
    >
      <Stars rating={google.rating} className="h-4 w-4" />
      <span>{google.rating.toFixed(1)} on Google · {google.count} reviews</span>
    </a>
  );
}

function ReviewCard({ t, excerpt }: { t: Testimonial; excerpt?: boolean }) {
  const body = excerpt && t.highlight ? t.highlight : t.text;
  return (
    <figure className="flex h-full flex-col rounded-2xl border-2 border-ink bg-paper p-5 shadow-[var(--shadow-pop)]">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={t.rating ?? 5} />
        <span className="text-xs font-bold uppercase tracking-wider text-muted">Google review</span>
      </div>
      <blockquote className="mt-3 flex-1 text-lg leading-relaxed">&ldquo;{body}&rdquo;</blockquote>
      <figcaption className="mt-4 text-sm">
        <span className="font-black">{t.author}</span>
        {t.occasion && <span className="text-muted"> · {t.occasion}</span>}
        <span className="block text-muted">
          Posted on{' '}
          <a href={t.sourceUrl} rel="noopener" target="_blank" className="underline" data-track="review_click" data-track-label={`card_${t.id}`}>Google</a>
          {excerpt && t.highlight && t.highlight !== t.text ? ' · excerpt' : ''}
        </span>
      </figcaption>
    </figure>
  );
}

/** Social-proof strip for commercial pages: reviews tagged for this path. Renders nothing if none. */
export function ReviewSnippets({ path, title = 'What guests say on Google', tone = 'light' }: { path: string; title?: string; tone?: 'light' | 'paper' }) {
  const list = reviewsFor(path, 3);
  if (!list.length) return null;
  return (
    <Section tone={tone} labelledBy={`reviews-${path.replace(/\W/g, '') || 'home'}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Reviews</Eyebrow>
          <H2 id={`reviews-${path.replace(/\W/g, '') || 'home'}`} className="text-2xl sm:text-3xl">{title}</H2>
        </div>
        <GoogleRatingLine label={`snippets_${path}`} />
      </div>
      <ul className={cx('mt-6 grid gap-4', list.length > 1 && 'md:grid-cols-2', list.length > 2 && 'lg:grid-cols-3')}>
        {list.map((t) => <li key={t.id}><ReviewCard t={t} excerpt /></li>)}
      </ul>
      <p className="mt-4"><a href="/reviews/" className="font-bold text-flash-dark underline">Read all reviews</a></p>
    </Section>
  );
}

/** Full review wall for /reviews/. */
export function ReviewWall() {
  const list = testimonials.filter((t) => t.verified);
  return (
    <ul className="mt-8 grid items-start gap-4 md:grid-cols-2">
      {list.map((t) => <li key={t.id}><ReviewCard t={t} /></li>)}
    </ul>
  );
}

export function RatingSummary() {
  const list = testimonials.filter((t) => t.verified);
  const dist = [5, 4, 3, 2, 1].map((s) => ({ s, n: list.filter((t) => (t.rating ?? 5) === s).length }));
  return (
    <div className="grid gap-6 rounded-2xl border-2 border-ink bg-paper p-6 shadow-[var(--shadow-pop)] sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="text-center sm:pr-6">
        <p className="font-[family-name:var(--font-display)] text-6xl leading-none">{google.rating.toFixed(1)}</p>
        <div className="mt-2"><Stars rating={google.rating} className="h-6 w-6" /></div>
        <p className="mt-2 text-sm text-muted">{google.count} Google reviews<br />as of {fmtDate(google.capturedAt)}</p>
      </div>
      <div>
        <ul className="space-y-1.5" aria-label="Rating breakdown">
          {dist.map((d) => (
            <li key={d.s} className="flex items-center gap-3 text-sm">
              <span className="w-12 font-bold">{d.s} star</span>
              <span className="h-3 flex-1 overflow-hidden rounded-full bg-cream" aria-hidden="true">
                <span className="block h-full rounded-full bg-gold" style={{ width: `${list.length ? (d.n / list.length) * 100 : 0}%` }} />
              </span>
              <span className="w-6 text-right text-muted">{d.n}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-col gap-3">
          <a href={google.url} rel="noopener" target="_blank" data-track="review_click" data-track-label="summary_read"
            className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full border-2 border-ink bg-paper px-5 font-bold text-ink no-underline">
            Read on Google
          </a>
          <a href={google.url} rel="noopener" target="_blank" data-track="review_write_click" data-track-label="summary_write"
            className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-ink bg-gold px-5 text-center font-bold text-ink no-underline shadow-[0_4px_0_0_#15102f]">
            Leave a Google review
          </a>
        </div>
      </div>
    </div>
  );
}
