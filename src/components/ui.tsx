import type { ReactNode } from 'react';
import { business } from '../data/business';

const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(' ');

type Track = { event: string; label: string };
const trackAttrs = (t?: Track) => (t ? { 'data-track': t.event, 'data-track-label': t.label } : {});

type Variant = 'gold' | 'outline' | 'dark' | 'ghost-light';
type Size = 'md' | 'lg' | 'sm';
/** Brand buttons: 'gold' = primary red CTA (name kept for API stability), others = light outline. */
const btnClass = (variant: Variant, size: Size, hasSub: boolean) =>
  cx(
    variant === 'gold' ? 'btn-red' : 'btn-line',
    hasSub ? 'flex-col gap-0 leading-tight' : '',
    { sm: 'min-h-10 px-4 text-sm', md: 'min-h-12 px-6 text-base', lg: 'min-h-14 px-7 text-lg' }[size],
  );
const SubLine = ({ sub }: { sub?: ReactNode }) =>
  sub ? <span className="block text-[0.7rem] font-semibold normal-case tracking-normal opacity-90">{sub}</span> : null;

export function Button({
  href, children, variant = 'gold', size = 'md', track, external, className, ariaLabel, sub,
}: {
  href: string; children: ReactNode; variant?: Variant;
  size?: Size; track?: Track; external?: boolean; className?: string; ariaLabel?: string; sub?: ReactNode;
}) {
  return (
    <a
      href={href}
      className={cx(btnClass(variant, size, !!sub), className)}
      aria-label={ariaLabel}
      {...(external ? { rel: 'noopener', target: '_blank' } : {})}
      {...trackAttrs(track)}
    >
      {sub ? <span>{children}</span> : children}
      <SubLine sub={sub} />
    </a>
  );
}

export const PhoneLink = ({ label, className, children }: { label: string; className?: string; children?: ReactNode }) => (
  <a href={`tel:${business.phone.e164}`} className={className} data-track="phone_click" data-track-label={label}>
    {children ?? business.phone.display}
  </a>
);

export const EmailLink = ({ label, className }: { label: string; className?: string }) => (
  <a href={`mailto:${business.email}`} className={className} data-track="email_click" data-track-label={label}>
    {business.email}
  </a>
);

export const MapLink = ({ label, className, children }: { label: string; className?: string; children: ReactNode }) => (
  <a href={business.mapsUrl} className={className} rel="noopener" target="_blank" data-track="map_click" data-track-label={label}>
    {children}
  </a>
);

/** Outbound FareHarbor link — fires begin_booking + outbound_booking_click. */
export function BookingLink({
  kind, label, children, variant = 'gold', size = 'md', className, sub,
}: { kind: 'small' | 'large'; label: string; children: ReactNode; variant?: Variant; size?: Size; className?: string; sub?: ReactNode }) {
  const href = kind === 'small' ? business.booking.smallGroupUrl : business.booking.largeGroupUrl;
  return (
    <a
      href={href}
      rel="noopener"
      data-track="outbound_booking_click"
      data-track-label={label}
      data-booking-kind={kind}
      className={cx(btnClass(variant, size, !!sub), className)}
    >
      {sub ? <span>{children}</span> : children}
      <SubLine sub={sub} />
    </a>
  );
}

export function Section({
  id, children, tone = 'light', className, labelledBy,
}: { id?: string; children: ReactNode; tone?: 'light' | 'paper' | 'dark' | 'gold'; className?: string; labelledBy?: string }) {
  const tones = {
    light: 'bg-night text-bone',
    paper: 'stripes text-bone',
    dark: 'spot text-bone',
    gold: 'bg-night text-bone',
  };
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx('py-14 sm:py-20', tones[tone], className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export const Eyebrow = ({ children }: { children: ReactNode; dark?: boolean }) => (
  <p className="eyebrow-x mb-2 text-sm text-bronze">{children}</p>
);

export const H2 = ({ id, children, className }: { id?: string; children: ReactNode; className?: string }) => (
  <h2 id={id} className={cx('title-glow text-[2rem] sm:text-[2.6rem]', className)}>{children}</h2>
);

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cx('card-glow p-5 text-bone sm:p-6', className)}>{children}</div>
);

/** Key-facts strip — rendered as the brand's lit marquee scoreboard. */
export function FactChips({ items }: { items: { k: string; v: string }[]; dark?: boolean }) {
  return (
    <div className="marquee marquee-thin mx-auto mt-8 w-full max-w-3xl">
      <ul className="grid grid-cols-2 bg-night/95 sm:grid-cols-4" aria-label="Key facts">
        {items.map((i, n) => (
          <li
            key={i.k}
            className={cx(
              'flex flex-col items-center justify-center px-3 py-3 text-center sm:py-4',
              n % 2 === 1 && 'border-l border-edge',
              n >= 2 && 'border-t border-edge sm:border-t-0',
              n === 2 && 'sm:border-l',
            )}
          >
            <span className="font-display text-2xl font-semibold uppercase leading-none text-gold sm:text-3xl">{i.v}</span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-mist">{i.k}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CheckList({ items }: { items: ReactNode[]; dark?: boolean }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-1 h-5 w-5 flex-none text-gold">
            <circle cx="10" cy="10" r="9" fill="currentColor" opacity=".18" />
            <path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** Gold torn-line divider — brand signature under heroes and above the footer. */
export const WaveDivider = ({ className, flip }: { className?: string; flip?: boolean }) => (
  <svg viewBox="0 0 1440 26" preserveAspectRatio="none" aria-hidden="true" className={cx('wave-gold', flip && 'rotate-180', className)}>
    <path
      d="M0 15 C 60 9, 95 21, 150 16 S 250 7, 320 13 S 420 22, 500 14 S 600 6, 690 12 S 790 21, 880 15 S 980 6, 1060 12 S 1170 22, 1250 15 S 1360 7, 1440 13"
      fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
    />
  </svg>
);

/** Section heading block, centred like the brand site. */
export function SectionHead({ id, eyebrow, title, lead, align = 'center' }: { id?: string; eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; align?: 'center' | 'left' }) {
  return (
    <div className={cx(align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl')}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <H2 id={id}>{title}</H2>
      {lead && <div className="mt-3 text-lg text-mist">{lead}</div>}
    </div>
  );
}

/** Small "needs confirmation" marker — renders ONLY in non-production builds. */
export const Confirm = ({ note }: { note: string }) =>
  process.env.CONTEXT === 'production' ? null : (
    <span data-confirm={note} className="ml-1 rounded bg-red/25 px-1.5 py-0.5 align-middle text-[0.65rem] font-bold uppercase text-gold-2">
      confirm
    </span>
  );

export { cx };
