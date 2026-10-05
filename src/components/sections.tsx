import type { ReactNode } from 'react';
import { business } from '../data/business';
import type { FAQ } from '../lib/types';
import { birthdayPackages, activePromotions } from '../data/content';
import { Button, BookingLink, Section, Eyebrow, H2, Card, FactChips, CheckList, PhoneLink, MapLink, WaveDivider, SectionHead, cx } from './ui';
import { Icon } from './StageArt';
import { photos, galleryKeys, type PhotoKey } from '../data/images';
import { fmtTime } from '../lib/format';

/* ---------------- HERO ---------------- */
export function Hero({
  eyebrow, title, lead, chips, primary, secondary, note, id = 'hero-title', image = 'home',
}: {
  eyebrow: string; title: ReactNode; lead: ReactNode; chips: { k: string; v: string }[];
  primary: ReactNode; secondary?: ReactNode; art?: boolean; artOnMobile?: boolean; note?: ReactNode; id?: string; image?: PhotoKey;
}) {
  const ph = photos[image];
  return (
    <section aria-labelledby={id} className="relative isolate overflow-hidden bg-night text-bone">
      <picture className="absolute inset-0 -z-20">
        {ph.mobile && <source media="(max-width: 767px)" srcSet={ph.mobile} />}
        <img src={ph.src} alt="" width={ph.w} height={ph.h} fetchPriority="high" decoding="async" className="h-full w-full object-cover" style={{ objectPosition: ph.position ?? 'center' }} />
      </picture>
      <div className="hero-shade absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container-x pb-12 pt-12 text-center sm:pb-16 sm:pt-20 lg:pt-24">
        <p className="eyebrow-x text-xs text-bone sm:text-sm">{eyebrow}</p>
        <h1 id={id} className="title-glow mx-auto mt-3 max-w-4xl text-[2.35rem] sm:text-6xl lg:text-[4.1rem]">{title}</h1>
        <div className="mx-auto mt-4 max-w-2xl text-lg text-bone/90 sm:text-xl">{lead}</div>
        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">{primary}{secondary}</div>
        {note && <div className="mt-4 flex justify-center text-center text-sm text-bone/85">{note}</div>}
        <FactChips items={chips} />
      </div>
      <WaveDivider className="-mb-px" />
    </section>
  );
}

/* ---------------- PHOTO (real venue photography) ---------------- */
export function Photo({ name, className, framed, sizes = '(min-width: 1024px) 50vw, 100vw', eager }: { name: PhotoKey; className?: string; framed?: boolean; sizes?: string; eager?: boolean }) {
  const ph = photos[name];
  const img = (
    <img
      src={ph.card ?? ph.src}
      srcSet={ph.card ? `${ph.card} 900w, ${ph.src} ${ph.w}w` : undefined}
      sizes={ph.card ? sizes : undefined}
      alt={ph.alt}
      width={ph.w}
      height={ph.h}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="h-full w-full object-cover"
      style={{ objectPosition: ph.position ?? 'center' }}
    />
  );
  return framed ? <div className={cx('marquee', className)}><div className="aspect-[4/3]">{img}</div></div> : <div className={cx('overflow-hidden rounded-[var(--radius-card)]', className)}>{img}</div>;
}

/* ---------------- DIRECT ANSWER (AEO) ---------------- */
export function QuickAnswer({ q, children }: { q: string; children: ReactNode }) {
  return (
    <div className="card-glow border-l-4 border-l-bronze p-5" data-quick-answer>
      <p className="eyebrow-x text-xs text-bronze">{q}</p>
      <div className="mt-2 text-lg text-bone">{children}</div>
    </div>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
export function Steps({ steps }: { steps: { title: string; body: ReactNode }[]; dark?: boolean }) {
  return (
    <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.title} className="card-glow p-6 text-center">
          <span className="font-display mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-bronze/70 bg-night text-2xl font-semibold text-gold shadow-[0_0_18px_rgba(202,147,66,.25)]">{i + 1}</span>
          <h3 className="mt-4 text-xl text-bone">{s.title}</h3>
          <div className="mt-2 text-mist">{s.body}</div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- FEATURE GRID ---------------- */
export function Features({ items }: { items: { icon: Parameters<typeof Icon>[0]['name']; title: string; body: ReactNode }[] }) {
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f) => (
        <li key={f.title} className="card-glow p-6">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-bronze/60 bg-night text-gold"><Icon name={f.icon} /></span>
          <h3 className="mt-4 text-xl text-bone">{f.title}</h3>
          <div className="mt-1 text-mist">{f.body}</div>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- FAQ (native <details>, no JS) — brand "Q." list ---------------- */
export function FaqList({ list }: { list: FAQ[] }) {
  return (
    <div className="divide-y divide-edge border-y border-edge">
      {list.map((f) => (
        <details key={f.id} className="group" data-faq={f.id}>
          <summary className="flex min-h-14 items-center gap-4 py-3 text-left">
            <span aria-hidden="true" className="font-display flex-none text-lg font-semibold text-gold">Q.</span>
            <h3 className="flex-1 font-sans text-[1.05rem] font-semibold text-bone group-hover:text-gold-2">{f.q}</h3>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 flex-none text-bronze transition group-open:rotate-180"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </summary>
          <div className="pb-5 pl-9 pr-2 text-mist">{f.a}</div>
        </details>
      ))}
    </div>
  );
}

export function FAQSection({ list, title = 'Questions parents & planners ask', id = 'faq', tone = 'paper' as const }: { list: FAQ[]; title?: string; id?: string; tone?: 'paper' | 'light' }) {
  return (
    <Section id={id} tone={tone} labelledBy={`${id}-title`}>
      <SectionHead id={`${id}-title`} eyebrow="FAQ" title={title} />
      <div className="mx-auto mt-8 max-w-4xl">
        <FaqList list={list} />
        <p className="mt-6 text-center text-mist">More answers on the <a className="font-bold text-gold underline" href="/faq/">full FAQ page</a>, or call <PhoneLink label="faq_section" className="font-bold text-gold underline" />.</p>
      </div>
    </Section>
  );
}

/* ---------------- PARTY PACKAGE ---------------- */
export function PackageCard({ trackLabel }: { trackLabel: string }) {
  const p = birthdayPackages[0];
  return (
    <Card className="relative border-bronze/50">
      <div data-track-view="package_view" data-track-label={p.id}>
        <p className="eyebrow-x inline-block rounded-[4px] bg-red px-3 py-1 text-xs text-paper">Party package</p>
        <h3 className="font-display mt-3 text-3xl font-semibold uppercase text-gold">{p.name}</h3>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
          {p.format.map((f) => <li key={f} className="rounded-[4px] border border-edge bg-panel-2 px-3 py-1.5">{f}</li>)}
        </ul>
        <CheckList items={p.includes} />
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-panel-2 p-3"><dt className="font-bold text-gold">Total time</dt><dd className="font-bold">{p.totalTime}</dd></div>
          <div className="rounded-xl bg-panel-2 p-3"><dt className="font-bold text-gold">Ages</dt><dd className="font-bold">{p.ages}</dd></div>
        </dl>
        <p className="mt-4 rounded-xl border border-dashed border-edge p-3 text-sm" data-track-view="pricing_view" data-track-label={`${trackLabel}_package`}>
          <strong>Price:</strong> {p.priceNote}
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button href="/book/#quote" track={{ event: 'click_book_now', label: `${trackLabel}_package_quote` }}>Get my party quote</Button>
          <BookingLink kind="large" label={`${trackLabel}_package_calendar`} variant="outline">Check party dates</BookingLink>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- PRICE SUMMARY ---------------- */
export function PriceStrip({ trackLabel }: { trackLabel: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3" data-track-view="pricing_view" data-track-label={trackLabel}>
      {[
        { k: 'Game show', v: 'From $%PRICE%', s: 'per guest · 60 minutes' },
        { k: 'Standard group', v: '6–8 players', s: 'private to your group' },
        { k: 'Big groups', v: '40–60 players', s: 'back-to-back or extended shows' },
      ].map((x) => (
        <div key={x.k} className="card-glow p-5 text-center">
          <p className="eyebrow-x text-xs text-bronze">{x.k}</p>
          <p className="font-display mt-1 text-3xl font-semibold uppercase text-gold">{x.v}</p>
          <p className="text-sm text-mist">{x.s}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------- LEAD / EVENT QUOTE FORM (Netlify Forms) ---------------- */
export function QuoteForm({ context, heading = 'Get a free event quote', defaultType }: { context: string; heading?: string; defaultType?: string }) {
  const types = ['Kids birthday party', 'Teen / Sweet 16 party', 'Adult birthday', 'Corporate / team building', 'School / youth group', 'Family or friends group', 'Other'];
  const f = 'mt-1.5 block w-full min-h-12 rounded-[4px] border border-edge bg-panel-2 px-3 text-base font-normal text-bone placeholder:text-smoke focus:border-gold';
  return (
    <Card>
      <h3 id={`quote-${context}`} className="font-display text-3xl font-semibold uppercase text-gold">{heading}</h3>
      <p className="mt-1 text-mist">Tell us the basics — we reply with availability and an exact price. Takes about 30 seconds.</p>
      <form
        name="event-quote"
        method="POST"
        action="/thank-you/"
        data-netlify="true"
        netlify-honeypot="company_website"
        data-lead-form={context}
        aria-labelledby={`quote-${context}`}
        className="mt-4 grid gap-4"
      >
        <input type="hidden" name="form-name" value="event-quote" />
        <input type="hidden" name="page_context" value={context} />
        <input type="hidden" name="gclid" data-attr="gclid" />
        <input type="hidden" name="utm_source" data-attr="utm_source" />
        <input type="hidden" name="utm_campaign" data-attr="utm_campaign" />
        <input type="hidden" name="utm_term" data-attr="utm_term" />
        <p className="hidden"><label>Leave empty <input name="company_website" tabIndex={-1} autoComplete="off" /></label></p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold uppercase tracking-wide text-mist">Your name
            <input className={f} name="name" required autoComplete="name" />
          </label>
          <label className="text-sm font-semibold uppercase tracking-wide text-mist">Phone or email
            <input className={f} name="contact" required autoComplete="email" inputMode="email" placeholder="So we can reply" />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-semibold uppercase tracking-wide text-mist">Event type
            <select className={f} name="event_type" required defaultValue={defaultType ?? ''}>
              <option value="" disabled>Choose…</option>
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold uppercase tracking-wide text-mist">Preferred date
            <input className={f} type="date" name="date" />
          </label>
          <label className="text-sm font-semibold uppercase tracking-wide text-mist">Guests (approx.)
            <input className={f} type="number" name="guests" min={1} max={200} inputMode="numeric" />
          </label>
        </div>
        <label className="text-sm font-semibold uppercase tracking-wide text-mist">Anything else? <span className="font-normal normal-case tracking-normal text-smoke">(optional)</span>
          <textarea className={cx(f, 'min-h-24 py-2')} name="message" rows={3} placeholder="Ages, birthday name for custom trivia, cake plans…" />
        </label>
        <button type="submit" className="btn-red min-h-14 px-6 text-lg">
          Send my quote request
        </button>
        <p className="text-sm text-mist">We only use your details to reply about your event. Prefer to talk? <PhoneLink label={`form_${context}`} className="font-bold underline" />.</p>
      </form>
    </Card>
  );
}

/* ---------------- VISIT / LOCAL BLOCK ---------------- */
export function VisitBlock({ id = 'visit' }: { id?: string }) {
  const a = business.address;
  return (
    <Section id={id} tone="light" labelledBy={`${id}-title`}>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Eyebrow>Where we are</Eyebrow>
          <H2 id={`${id}-title`}>Inside Rockaway Townsquare, Rockaway NJ</H2>
          <p className="mt-3 text-lg">
            {a.street}, {a.city}, {a.region} {a.postalCode}. Use the <strong>mall entrance near JCPenney</strong> — our entrance is on the first floor, right next to it.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { i: 'parking' as const, t: 'Free parking', d: 'No validation needed' },
              { i: 'access' as const, t: 'Wheelchair accessible', d: 'Fully accessible location' },
              { i: 'clock' as const, t: 'Arrive 10–15 min early', d: 'For check-in & instructions' },
              { i: 'pin' as const, t: 'NJ Transit buses', d: 'Routes serve Rockaway Townsquare' },
            ].map((x) => (
              <li key={x.t} className="card-noir flex gap-3 p-3">
                <Icon name={x.i} className="h-6 w-6 flex-none text-gold" />
                <span><strong className="block">{x.t}</strong><span className="text-sm text-mist">{x.d}</span></span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <MapLink label={`${id}_block`} className="btn-line min-h-12 px-5">Get directions</MapLink>
            <a href="/location/rockaway-nj/" className="inline-flex min-h-12 items-center px-2 font-bold text-gold underline">Parking, hours &amp; nearby towns</a>
          </div>
        </div>
        <Card>
          <h3 className="font-display text-2xl font-semibold uppercase text-gold">Opening hours</h3>
          <dl className="mt-3">
            {business.hours.map((h) => (
              <div key={h.label} className="flex justify-between border-b border-edge py-2.5">
                <dt className="font-bold">{h.label}</dt>
                <dd>{fmtTime(h.opens)} – {fmtTime(h.closes)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-mist">Easy to reach from Denville, Dover, Randolph, Parsippany, Wharton and the rest of Morris County via Route 80.</p>
          <p className="mt-4"><PhoneLink label={`${id}_hours`} className="text-lg font-bold text-gold underline" /></p>
        </Card>
      </div>
    </Section>
  );
}

/* ---------------- RELATED LINKS (internal-link engine output) ---------------- */
export function Related({ title = 'Keep planning', links }: { title?: string; links: { href: string; label: string; blurb: string }[] }) {
  return (
    <Section tone="paper" labelledBy="related-title">
      <H2 id="related-title" className="text-[1.75rem] sm:text-4xl">{title}</H2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="card-noir block h-full p-5 text-bone no-underline transition hover:-translate-y-0.5 hover:border-bronze">
              <span className="text-lg font-bold text-gold-2">{l.label} →</span>
              <span className="mt-1 block text-mist">{l.blurb}</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------------- FINAL CTA BAND ---------------- */
export function CtaBand({ title, body, label, primaryHref = '/book/', primaryText = 'Book your game show', booking }: { title: string; body: ReactNode; label: string; primaryHref?: string; primaryText?: string; booking?: 'small' | 'large' }) {
  return (
    <Section tone="dark" labelledBy={`cta-${label}`} className="border-t border-edge">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow-x mb-2 text-sm text-bronze">Secure your spot</p>
        <H2 id={`cta-${label}`}>{title}</H2>
        <div className="mt-3 text-lg text-mist">{body}</div>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {booking ? (
            <BookingLink kind={booking} label={`cta_${label}`} size="lg">{primaryText}</BookingLink>
          ) : (
            <Button href={primaryHref} size="lg" track={{ event: 'click_book_now', label: `cta_${label}` }}>{primaryText}</Button>
          )}
          <PhoneLink label={`cta_${label}`} className="btn-line min-h-14 px-7 text-lg">
            Call {business.phone.display}
          </PhoneLink>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- PROMO SLOT ---------------- */
export function PromoSlot({ path }: { path: string }) {
  const promos = activePromotions(path);
  if (!promos.length) return null;
  return (
    <div className="bg-red-dark text-paper">
      <div className="container-x py-2 text-center text-sm font-bold">
        {promos.map((p) => <p key={p.id}>{p.title} — {p.detail}{p.code ? ` Code: ${p.code}` : ''}</p>)}
      </div>
    </div>
  );
}

/* ---------------- WHY US (fact-based trust, no fake reviews) ---------------- */
export function TrustRow() {
  const items = [
    { i: 'users' as const, t: 'Always private', d: 'Your group only — never paired with strangers' },
    { i: 'buzzer' as const, t: 'Live host', d: 'Buzzers, lights, music, real competition' },
    { i: 'cake' as const, t: 'Private Party Room', d: 'Extra hour for cake & food on party bookings' },
    { i: 'parking' as const, t: 'Free mall parking', d: 'Rockaway Townsquare, no validation' },
  ];
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Why groups choose Game Show Room">
      {items.map((x) => (
        <li key={x.t} className="card-glow p-4 sm:p-5">
          <Icon name={x.i} className="h-7 w-7 text-gold" />
          <p className="mt-2 font-bold leading-tight text-bone">{x.t}</p>
          <p className="text-sm text-mist">{x.d}</p>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- PHOTO GALLERY (real venue photos) ---------------- */
export function Gallery({ id = 'gallery', title = 'Real shows, real smiles', lead, keys = galleryKeys, tone = 'paper' as const }: { id?: string; title?: string; lead?: ReactNode; keys?: PhotoKey[]; tone?: 'paper' | 'light' }) {
  return (
    <Section id={id} tone={tone} labelledBy={`${id}-title`}>
      <SectionHead id={`${id}-title`} eyebrow="Inside the Game Show Room" title={title} lead={lead ?? 'Photos from real shows at our Rockaway Townsquare studio.'} />
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {keys.map((k, i) => (
          <li key={k} className={cx('overflow-hidden rounded-[var(--radius-card)] border border-edge', i === 0 && 'col-span-2 row-span-2')}>
            <img src={photos[k].card} alt={photos[k].alt} width={900} height={Math.round((900 * photos[k].h) / photos[k].w)} loading="lazy" decoding="async" className="aspect-[4/3] h-full w-full object-cover transition duration-500 hover:scale-[1.03]" style={{ objectPosition: photos[k].position }} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------------- PAGE BANNER (inner pages: big title over a venue photo) ---------------- */
export function PageHero({ eyebrow, title, image, id }: { eyebrow?: ReactNode; title: ReactNode; image: PhotoKey; id?: string }) {
  const ph = photos[image];
  return (
    <section aria-labelledby={id} className="relative isolate -mt-px overflow-hidden bg-night">
      <picture className="absolute inset-0 -z-20">
        {ph.mobile && <source media="(max-width: 767px)" srcSet={ph.mobile} />}
        <img src={ph.src} alt="" width={ph.w} height={ph.h} fetchPriority="high" decoding="async" className="h-full w-full object-cover" style={{ objectPosition: ph.position ?? 'center' }} />
      </picture>
      <div className="hero-shade absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container-x py-14 text-center sm:py-20">
        {eyebrow && <p className="eyebrow-x text-xs text-bone sm:text-sm">{eyebrow}</p>}
        <h1 id={id} className="title-glow mx-auto mt-2 max-w-4xl text-[2.4rem] sm:text-6xl">{title}</h1>
      </div>
      <WaveDivider className="-mb-px" />
    </section>
  );
}
