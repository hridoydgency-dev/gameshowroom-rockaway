import type { ReactNode } from 'react';
import { business } from '../data/business';

const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(' ');

type Track = { event: string; label: string };
const trackAttrs = (t?: Track) => (t ? { 'data-track': t.event, 'data-track-label': t.label } : {});

export function Button({
  href, children, variant = 'gold', size = 'md', track, external, className, ariaLabel,
}: {
  href: string; children: ReactNode; variant?: 'gold' | 'outline' | 'dark' | 'ghost-light';
  size?: 'md' | 'lg' | 'sm'; track?: Track; external?: boolean; className?: string; ariaLabel?: string;
}) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-bold text-center transition-transform active:translate-y-0.5 no-underline';
  const sizes = { sm: 'min-h-10 px-4 text-sm', md: 'min-h-12 px-6 text-base', lg: 'min-h-14 px-7 text-lg' };
  const variants = {
    gold: 'bg-gold text-ink shadow-[0_4px_0_0_#15102f] hover:bg-gold-2 border-2 border-ink',
    outline: 'bg-paper text-ink border-2 border-ink hover:bg-cream',
    dark: 'bg-ink text-paper border-2 border-ink hover:bg-stage',
    'ghost-light': 'bg-transparent text-paper border-2 border-paper/70 hover:bg-paper/10',
  };
  return (
    <a
      href={href}
      className={cx(base, sizes[size], variants[variant], className)}
      aria-label={ariaLabel}
      {...(external ? { rel: 'noopener', target: '_blank' } : {})}
      {...trackAttrs(track)}
    >
      {children}
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
  kind, label, children, variant = 'gold', size = 'md', className,
}: { kind: 'small' | 'large'; label: string; children: ReactNode; variant?: 'gold' | 'outline' | 'dark' | 'ghost-light'; size?: 'md' | 'lg' | 'sm'; className?: string }) {
  const href = kind === 'small' ? business.booking.smallGroupUrl : business.booking.largeGroupUrl;
  return (
    <a
      href={href}
      rel="noopener"
      data-track="outbound_booking_click"
      data-track-label={label}
      data-booking-kind={kind}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-full font-bold text-center no-underline transition-transform active:translate-y-0.5 border-2 border-ink',
        { sm: 'min-h-10 px-4 text-sm', md: 'min-h-12 px-6 text-base', lg: 'min-h-14 px-7 text-lg' }[size],
        {
          gold: 'bg-gold text-ink shadow-[0_4px_0_0_#15102f] hover:bg-gold-2',
          outline: 'bg-paper text-ink hover:bg-cream',
          dark: 'bg-ink text-paper hover:bg-stage',
          'ghost-light': 'bg-transparent text-paper border-paper/70 hover:bg-paper/10',
        }[variant],
        className,
      )}
    >
      {children}
    </a>
  );
}

export function Section({
  id, children, tone = 'light', className, labelledBy,
}: { id?: string; children: ReactNode; tone?: 'light' | 'paper' | 'dark' | 'gold'; className?: string; labelledBy?: string }) {
  const tones = {
    light: 'bg-cream text-ink',
    paper: 'bg-paper text-ink',
    dark: 'stage-glow text-paper on-dark',
    gold: 'bg-gold text-ink',
  };
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx('py-12 sm:py-16', tones[tone], className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export const Eyebrow = ({ children, dark }: { children: ReactNode; dark?: boolean }) => (
  <p className={cx('mb-2 text-sm font-bold uppercase tracking-[0.14em]', dark ? 'text-gold' : 'text-flash-dark')}>{children}</p>
);

export const H2 = ({ id, children, className }: { id?: string; children: ReactNode; className?: string }) => (
  <h2 id={id} className={cx('text-[1.75rem] sm:text-4xl font-black', className)}>{children}</h2>
);

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cx('rounded-[var(--radius-card)] border-2 border-ink bg-paper p-5 sm:p-6 shadow-[var(--shadow-pop)]', className)}>{children}</div>
);

/** Fact chips — the "answer in 5 seconds" strip used in every hero. */
export function FactChips({ items, dark }: { items: { k: string; v: string }[]; dark?: boolean }) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3" aria-label="Key facts">
      {items.map((i) => (
        <li
          key={i.k}
          className={cx(
            'rounded-xl border-2 px-3 py-2 text-sm leading-tight',
            dark ? 'border-paper/25 bg-paper/10 text-paper' : 'border-ink bg-paper text-ink',
          )}
        >
          <span className={cx('block text-[0.7rem] font-bold uppercase tracking-wider', dark ? 'text-gold' : 'text-flash-dark')}>{i.k}</span>
          <span className="font-bold">{i.v}</span>
        </li>
      ))}
    </ul>
  );
}

export function CheckList({ items, dark }: { items: ReactNode[]; dark?: boolean }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <svg aria-hidden="true" viewBox="0 0 20 20" className={cx('mt-1 h-5 w-5 flex-none', dark ? 'text-gold' : 'text-flash-dark')}>
            <circle cx="10" cy="10" r="9" fill="currentColor" opacity=".18" />
            <path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** Small "needs confirmation" marker — renders ONLY in non-production builds. */
export const Confirm = ({ note }: { note: string }) =>
  process.env.CONTEXT === 'production' ? null : (
    <span data-confirm={note} className="ml-1 rounded bg-flash/15 px-1.5 py-0.5 align-middle text-[0.65rem] font-bold uppercase text-flash-dark">
      confirm
    </span>
  );

export { cx };
