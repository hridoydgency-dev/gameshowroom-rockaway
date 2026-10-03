import type { ReactNode } from 'react';
import { business } from '../data/business';
import type { FAQ } from '../lib/types';
import { birthdayPackages, activePromotions } from '../data/content';
import { Button, BookingLink, Section, Eyebrow, H2, Card, FactChips, CheckList, PhoneLink, MapLink, cx } from './ui';
import { StageArt, Icon } from './StageArt';
import { fmtTime } from '../lib/format';

/* ---------------- HERO ---------------- */
export function Hero({
  eyebrow, title, lead, chips, primary, secondary, art = true, note, id = 'hero-title',
}: {
  eyebrow: string; title: ReactNode; lead: ReactNode; chips: { k: string; v: string }[];
  primary: ReactNode; secondary?: ReactNode; art?: boolean; note?: ReactNode; id?: string;
}) {
  return (
    <section aria-labelledby={id} className="stage-glow on-dark relative overflow-hidden text-paper">
      <div className="container-x grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.15fr_1fr] lg:py-20">
        <div>
          <Eyebrow dark>{eyebrow}</Eyebrow>
          <h1 id={id} className="text-[2.15rem] font-black leading-[1.05] sm:text-5xl lg:text-[3.6rem]">{title}</h1>
          <div className="mt-4 max-w-xl text-lg text-paper/90 sm:text-xl">{lead}</div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">{primary}{secondary}</div>
          {note && <p className="mt-3 text-sm text-paper/75">{note}</p>}
          <FactChips items={chips} dark />
        </div>
        {art && (
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <StageArt className="w-full drop-shadow-[0_18px_40px_rgba(0,0,0,.45)]" />
          </div>
        )}
      </div>
      <div className="bulb-row opacity-60" aria-hidden="true" />
    </section>
  );
}

/* ---------------- DIRECT ANSWER (AEO) ---------------- */
export function QuickAnswer({ q, children }: { q: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-ink bg-paper p-5 shadow-[var(--shadow-pop)]" data-quick-answer>
      <p className="text-sm font-bold uppercase tracking-wider text-flash-dark">{q}</p>
      <div className="mt-1 text-lg">{children}</div>
    </div>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
export function Steps({ steps, dark }: { steps: { title: string; body: ReactNode }[]; dark?: boolean }) {
  return (
    <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <li key={s.title} className={cx('rounded-2xl border-2 p-5', dark ? 'border-paper/20 bg-paper/5' : 'border-ink bg-paper')}>
          <span className={cx('inline-flex h-10 w-10 items-center justify-center rounded-full border-2 font-black', dark ? 'border-gold text-gold' : 'border-ink bg-gold text-ink')}>{i + 1}</span>
          <h3 className="mt-3 text-lg font-black">{s.title}</h3>
          <div className={cx('mt-1', dark ? 'text-paper/85' : 'text-muted')}>{s.body}</div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- FEATURE GRID ---------------- */
export function Features({ items }: { items: { icon: Parameters<typeof Icon>[0]['name']; title: string; body: ReactNode }[] }) {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f) => (
        <li key={f.title} className="rounded-2xl border-2 border-ink bg-paper p-5">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-ink"><Icon name={f.icon} /></span>
          <h3 className="mt-3 text-lg font-black">{f.title}</h3>
          <div className="mt-1 text-muted">{f.body}</div>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- FAQ (native <details>, no JS) ---------------- */
export function FAQSection({ list, title = 'Questions parents & planners ask', id = 'faq', tone = 'paper' as const }: { list: FAQ[]; title?: string; id?: string; tone?: 'paper' | 'light' }) {
  return (
    <Section id={id} tone={tone} labelledBy={`${id}-title`}>
      <Eyebrow>FAQ</Eyebrow>
      <H2 id={`${id}-title`}>{title}</H2>
      <div className="mt-6 divide-y-2 divide-line rounded-2xl border-2 border-ink bg-paper">
        {list.map((f) => (
          <details key={f.id} className="group" data-faq={f.id}>
            <summary className="flex min-h-14 items-center justify-between gap-4 px-5 py-3 text-left text-lg font-bold">
              <h3 className="font-sans text-[1.05rem] font-bold">{f.q}</h3>
              <span aria-hidden="true" className="flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 border-ink text-xl leading-none transition group-open:rotate-45">+</span>
            </summary>
            <div className="px-5 pb-5 text-muted">{f.a}</div>
          </details>
        ))}
      </div>
      <p className="mt-4 text-muted">More answers on the <a className="font-bold text-flash-dark underline" href="/faq/">full FAQ page</a>, or call <PhoneLink label="faq_section" className="font-bold text-flash-dark underline" />.</p>
    </Section>
  );
}

/* ---------------- PARTY PACKAGE ---------------- */
export function PackageCard({ trackLabel }: { trackLabel: string }) {
  const p = birthdayPackages[0];
  return (
    <Card className="relative" >
      <div data-track-view="package_view" data-track-label={p.id}>
        <p className="inline-block rounded-full bg-flash px-3 py-1 text-xs font-bold uppercase tracking-wider text-paper">Party package</p>
        <h3 className="mt-3 text-2xl font-black">{p.name}</h3>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
          {p.format.map((f) => <li key={f} className="rounded-lg bg-cream px-3 py-1.5">{f}</li>)}
        </ul>
        <CheckList items={p.includes} />
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-cream p-3"><dt className="font-bold text-flash-dark">Total time</dt><dd className="font-bold">{p.totalTime}</dd></div>
          <div className="rounded-xl bg-cream p-3"><dt className="font-bold text-flash-dark">Ages</dt><dd className="font-bold">{p.ages}</dd></div>
        </dl>
        <p className="mt-4 rounded-xl border-2 border-dashed border-ink/40 p-3 text-sm" data-track-view="pricing_view" data-track-label={`${trackLabel}_package`}>
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
        { k: 'Game show', v: 'From $33', s: 'per guest · 60 minutes' },
        { k: 'Standard group', v: '6–8 players', s: 'private to your group' },
        { k: 'Big groups', v: '40–60 players', s: 'back-to-back or extended shows' },
      ].map((x) => (
        <div key={x.k} className="rounded-2xl border-2 border-ink bg-paper p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-flash-dark">{x.k}</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-3xl">{x.v}</p>
          <p className="text-sm text-muted">{x.s}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------- LEAD / EVENT QUOTE FORM (Netlify Forms) ---------------- */
export function QuoteForm({ context, heading = 'Get a free event quote', defaultType }: { context: string; heading?: string; defaultType?: string }) {
  const types = ['Kids birthday party', 'Teen / Sweet 16 party', 'Adult birthday', 'Corporate / team building', 'School / youth group', 'Family or friends group', 'Other'];
  const f = 'mt-1 block w-full min-h-12 rounded-xl border-2 border-ink bg-paper px-3 text-base text-ink';
  return (
    <Card>
      <h3 id={`quote-${context}`} className="text-2xl font-black">{heading}</h3>
      <p className="mt-1 text-muted">Tell us the basics — we reply with availability and an exact price. Takes about 30 seconds.</p>
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
          <label className="font-bold">Your name
            <input className={f} name="name" required autoComplete="name" />
          </label>
          <label className="font-bold">Phone or email
            <input className={f} name="contact" required autoComplete="email" inputMode="email" placeholder="So we can reply" />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="font-bold sm:col-span-1">Event type
            <select className={f} name="event_type" required defaultValue={defaultType ?? ''}>
              <option value="" disabled>Choose…</option>
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="font-bold">Preferred date
            <input className={f} type="date" name="date" />
          </label>
          <label className="font-bold">Guests (approx.)
            <input className={f} type="number" name="guests" min={1} max={200} inputMode="numeric" />
          </label>
        </div>
        <label className="font-bold">Anything else? <span className="font-normal text-muted">(optional)</span>
          <textarea className={cx(f, 'min-h-24 py-2')} name="message" rows={3} placeholder="Ages, birthday name for custom trivia, cake plans…" />
        </label>
        <button type="submit" className="min-h-14 rounded-full border-2 border-ink bg-gold px-6 text-lg font-bold shadow-[0_4px_0_0_#15102f]">
          Send my quote request
        </button>
        <p className="text-sm text-muted">We only use your details to reply about your event. Prefer to talk? <PhoneLink label={`form_${context}`} className="font-bold underline" />.</p>
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
              <li key={x.t} className="flex gap-3 rounded-xl border-2 border-ink bg-paper p-3">
                <Icon name={x.i} className="h-6 w-6 flex-none text-flash-dark" />
                <span><strong className="block">{x.t}</strong><span className="text-sm text-muted">{x.d}</span></span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <MapLink label={`${id}_block`} className="inline-flex min-h-12 items-center rounded-full border-2 border-ink bg-paper px-5 font-bold text-ink no-underline">Get directions</MapLink>
            <a href="/location/rockaway-nj/" className="inline-flex min-h-12 items-center px-2 font-bold text-flash-dark underline">Parking, hours &amp; nearby towns</a>
          </div>
        </div>
        <Card>
          <h3 className="text-xl font-black">Opening hours</h3>
          <dl className="mt-3">
            {business.hours.map((h) => (
              <div key={h.label} className="flex justify-between border-b-2 border-line py-2.5">
                <dt className="font-bold">{h.label}</dt>
                <dd>{fmtTime(h.opens)} – {fmtTime(h.closes)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-muted">Easy to reach from Denville, Dover, Randolph, Parsippany, Wharton and the rest of Morris County via Route 80 and Route 46.</p>
          <p className="mt-4"><PhoneLink label={`${id}_hours`} className="text-lg font-black text-flash-dark underline" /></p>
        </Card>
      </div>
    </Section>
  );
}

/* ---------------- RELATED LINKS (internal-link engine output) ---------------- */
export function Related({ title = 'Keep planning', links }: { title?: string; links: { href: string; label: string; blurb: string }[] }) {
  return (
    <Section tone="paper" labelledBy="related-title">
      <H2 id="related-title" className="text-2xl sm:text-3xl">{title}</H2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="block h-full rounded-2xl border-2 border-ink bg-cream p-5 text-ink no-underline transition hover:-translate-y-0.5 hover:bg-paper">
              <span className="text-lg font-black">{l.label} →</span>
              <span className="mt-1 block text-muted">{l.blurb}</span>
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
    <Section tone="dark" labelledBy={`cta-${label}`}>
      <div className="mx-auto max-w-3xl text-center">
        <H2 id={`cta-${label}`}>{title}</H2>
        <div className="mt-3 text-lg text-paper/85">{body}</div>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {booking ? (
            <BookingLink kind={booking} label={`cta_${label}`} size="lg">{primaryText}</BookingLink>
          ) : (
            <Button href={primaryHref} size="lg" track={{ event: 'click_book_now', label: `cta_${label}` }}>{primaryText}</Button>
          )}
          <PhoneLink label={`cta_${label}`} className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-paper/70 px-7 text-lg font-bold text-paper no-underline">
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
    <div className="bg-flash text-paper">
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
        <li key={x.t} className="rounded-2xl border-2 border-ink bg-paper p-4">
          <Icon name={x.i} className="h-7 w-7 text-flash-dark" />
          <p className="mt-2 font-black leading-tight">{x.t}</p>
          <p className="text-sm text-muted">{x.d}</p>
        </li>
      ))}
    </ul>
  );
}
