/**
 * Review UI — renders ONLY verified, sourced reviews from content.ts.
 * Visible rating text is fine; no AggregateRating/Review schema is emitted (self-serving reviews
 * are ineligible for Google review rich results).
 */
import { testimonials, reviewProfiles, reviewsFor } from '../data/content';
import type { Testimonial } from '../lib/types';
import { Section, SectionHead, cx } from './ui';

/** Small Google "G" mark used to attribute reviews to their source. */
const GoogleG = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const google = reviewProfiles.find((p) => p.platform === 'google')!;
const fmtDate = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export function Stars({ rating, className = 'h-5 w-5' }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={cx(className, i <= Math.round(rating) ? 'text-gold' : 'text-edge')} aria-hidden="true">
          <path fill="currentColor" stroke="#080709" strokeWidth="1" d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z" />
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
      className={cx('inline-flex min-h-8 items-center gap-2 font-semibold no-underline hover:underline', dark ? 'text-paper' : 'text-bone')}
    >
      <Stars rating={google.rating} className="h-4 w-4" />
      <span>{google.rating.toFixed(1)} on Google · {google.count} reviews</span>
    </a>
  );
}

function ReviewCard({ t, excerpt }: { t: Testimonial; excerpt?: boolean }) {
  const body = excerpt && t.highlight ? t.highlight : t.text;
  return (
    <figure className="card-glow relative flex h-full flex-col p-6">
      <span aria-hidden="true" className="font-display pointer-events-none absolute right-5 top-1 text-7xl leading-none text-bronze/30">&rdquo;</span>
      <div className="flex items-center gap-3">
        <GoogleG className="h-7 w-7 flex-none" />
        <span><Stars rating={t.rating ?? 5} className="h-4 w-4" /><span className="block text-xs font-semibold uppercase tracking-wider text-smoke">Google review</span></span>
      </div>
      <blockquote className="mt-4 flex-1 text-lg italic leading-relaxed text-bone">&ldquo;{body}&rdquo;</blockquote>
      <figcaption className="mt-4 text-sm">
        <span className="font-bold text-gold-2">{t.author}</span>
        {t.occasion && <span className="text-mist"> · {t.occasion}</span>}
        <span className="block text-smoke">
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
      <SectionHead id={`reviews-${path.replace(/\W/g, '') || 'home'}`} eyebrow="See why players rave about us" title={title} lead={<GoogleRatingLine label={`snippets_${path}`} />} />
      <ul className={cx('mt-10 grid gap-5', list.length > 1 && 'md:grid-cols-2', list.length > 2 && 'lg:grid-cols-3')}>
        {list.map((t) => <li key={t.id}><ReviewCard t={t} excerpt /></li>)}
      </ul>
      <p className="mt-8 text-center"><a href="/reviews/" className="btn-line min-h-12 px-6">Read all reviews</a></p>
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
    <div className="card-glow grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="text-center sm:pr-6">
        <p className="font-display text-7xl font-semibold leading-none text-gold">{google.rating.toFixed(1)}</p>
        <div className="mt-2"><Stars rating={google.rating} className="h-6 w-6" /></div>
        <p className="mt-2 text-sm text-mist">{google.count} Google reviews<br />as of {fmtDate(google.capturedAt)}</p>
      </div>
      <div>
        <ul className="space-y-1.5" aria-label="Rating breakdown">
          {dist.map((d) => (
            <li key={d.s} className="flex items-center gap-3 text-sm">
              <span className="w-12 font-bold">{d.s} star</span>
              <span className="h-3 flex-1 overflow-hidden rounded-full bg-panel-2" aria-hidden="true">
                <span className="block h-full rounded-full bg-gold" style={{ width: `${list.length ? (d.n / list.length) * 100 : 0}%` }} />
              </span>
              <span className="w-6 text-right text-mist">{d.n}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-col gap-3">
          <a href={google.url} rel="noopener" target="_blank" data-track="review_click" data-track-label="summary_read"
            className="btn-line min-h-12 whitespace-nowrap px-5">
            Read on Google
          </a>
          <a href={google.url} rel="noopener" target="_blank" data-track="review_write_click" data-track-label="summary_write"
            className="btn-red min-h-12 px-5">
            Leave a Google review
          </a>
        </div>
      </div>
    </div>
  );
}
