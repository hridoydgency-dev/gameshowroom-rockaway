import type { ReactNode } from 'react';
import { business } from '../data/business';
import { nav, footerNav } from '../data/navigation';
import { Button, PhoneLink, MapLink, cx } from './ui';
import { fmtTime } from '../lib/format';
import { settingsContent } from '../lib/content-store';

function Logo({ dark = true }: { dark?: boolean }) {
  return (
    <a href="/" className="flex items-center gap-2 no-underline" aria-label="Game Show Room Rockaway — home">
      <svg viewBox="0 0 40 40" className="h-9 w-9 flex-none" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="#ffc53d" stroke="#15102f" strokeWidth="2.5" />
        <ellipse cx="20" cy="17" rx="10" ry="4.5" fill="#e5336b" stroke="#15102f" strokeWidth="2.5" />
        <path d="M10 17v5c0 2.5 4.5 4.5 10 4.5s10-2 10-4.5v-5" fill="#b8174c" stroke="#15102f" strokeWidth="2.5" />
        <path d="M8 32h24" stroke="#15102f" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className={cx('leading-none', dark ? 'text-paper' : 'text-ink')}>
        <span className="block whitespace-nowrap font-[family-name:var(--font-display)] text-[1.02rem] font-black tracking-tight sm:text-lg">GAME SHOW ROOM</span>
        <span className={cx('block text-[0.7rem] font-bold uppercase tracking-[0.2em]', dark ? 'text-gold' : 'text-flash-dark')}>Rockaway, NJ</span>
      </span>
    </a>
  );
}

export function Header({ minimal }: { minimal?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-ink text-paper on-dark">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Logo />
        {minimal ? (
          <PhoneLink label="header_minimal" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full border-2 border-paper/60 px-4 text-sm font-bold text-paper no-underline">
            <span className="sm:hidden">Call us</span><span className="hidden sm:inline">Call {business.phone.display}</span>
          </PhoneLink>
        ) : (
          <>
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-0.5 text-[0.95rem] font-semibold">
                {nav.map((item) => (
                  <li key={item.href} className="group relative">
                    <a href={item.href} className="inline-flex min-h-11 items-center whitespace-nowrap rounded-lg px-2.5 text-paper no-underline hover:bg-paper/10 xl:px-3">
                      {item.label}
                    </a>
                    {item.children && (
                      <ul className="invisible absolute left-0 top-full z-50 min-w-60 rounded-xl border-2 border-ink bg-paper p-2 text-ink opacity-0 shadow-[var(--shadow-pop)] transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <a href={c.href} className="block rounded-lg px-3 py-2 text-ink no-underline hover:bg-cream">{c.label}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-2">
              <PhoneLink label="header" className="hidden min-h-11 items-center whitespace-nowrap px-2 text-sm font-bold text-paper no-underline md:inline-flex lg:hidden xl:inline-flex">
                {business.phone.display}
              </PhoneLink>
              <span className="hidden sm:block">
                <Button href="/book/" size="sm" track={{ event: 'click_book_now', label: 'header' }}>Book Now</Button>
              </span>
              {/* Mobile menu: <details> works without JavaScript */}
              <details className="relative lg:hidden" data-mobile-nav>
                <summary className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border-2 border-paper/40 px-3 font-bold" aria-label="Open menu">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
                  <span className="sr-only">Menu</span>
                </summary>
                <nav aria-label="Mobile" className="fixed inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b-2 border-ink bg-paper p-4 text-ink shadow-xl">
                  <ul className="space-y-1">
                    {nav.map((item) => (
                      <li key={item.href}>
                        <a href={item.href} className="flex min-h-12 items-center rounded-lg px-3 text-lg font-bold text-ink no-underline hover:bg-cream">{item.label}</a>
                        {item.children && (
                          <ul className="mb-2 ml-3 border-l-2 border-line pl-2">
                            {item.children.map((c) => (
                              <li key={c.href}>
                                <a href={c.href} className="flex min-h-11 items-center rounded-lg px-3 text-ink no-underline hover:bg-cream">{c.label}</a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button href="/book/" track={{ event: 'click_book_now', label: 'mobile_menu' }}>Book Now</Button>
                    <PhoneLink label="mobile_menu" className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-ink font-bold text-ink no-underline">Call</PhoneLink>
                  </div>
                </nav>
              </details>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export function Footer({ minimal }: { minimal?: boolean }) {
  const a = business.address;
  return (
    <footer className="bg-ink pb-28 pt-12 text-paper on-dark lg:pb-12">
      <div className="bulb-row mb-10 opacity-70" aria-hidden="true" />
      <div className="container-x grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-paper/80">
            A live, host-led game show for private groups inside Rockaway Townsquare — birthday parties, team building, school groups and family nights out.
          </p>
          <address className="mt-4 not-italic text-paper/90">
            <strong className="block text-paper">{business.name}</strong>
            {a.street}<br />
            {a.city}, {a.region} {a.postalCode}<br />
            <span className="text-paper/70">Inside Rockaway Townsquare · first floor by the JCPenney entrance</span>
          </address>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <PhoneLink label="footer" className="font-bold text-gold" />
            <MapLink label="footer" className="font-bold text-gold">Get directions</MapLink>
          </p>
        </div>
        <div>
          <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-gold">Hours</h2>
          <dl className="mt-3 space-y-1 text-paper/90">
            {business.hours.map((h) => (
              <div key={h.label} className="flex justify-between gap-4 border-b border-paper/10 py-1">
                <dt>{h.label}</dt>
                <dd>{fmtTime(h.opens)} – {fmtTime(h.closes)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-paper/70">Book at least 48 hours ahead. Same-day? Call to check.</p>
        </div>
        {!minimal && (
          <nav aria-label="Footer">
            <h2 className="font-sans text-sm font-bold uppercase tracking-widest text-gold">Explore</h2>
            <ul className="mt-3 grid grid-cols-1 gap-1 text-paper/90">
              {footerNav.map((l) => (
                <li key={l.href}><a href={l.href} className="inline-flex min-h-9 items-center text-paper/90 hover:text-gold">{l.label}</a></li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <div className="container-x mt-10 flex flex-col gap-2 border-t border-paper/15 pt-6 text-sm text-paper/60 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {business.legalBrand}.</p>
        <p className="flex gap-4">
          <a href="/privacy/" className="text-paper/70 hover:text-gold">Privacy</a>
          <a href="/terms/" className="text-paper/70 hover:text-gold">Terms</a>
          <button type="button" data-consent-open className="text-paper/70 underline hover:text-gold">Cookie settings</button>
        </p>
      </div>
    </footer>
  );
}


/** Thumb-zone CTA bar on mobile. Hidden on large screens. */
export function StickyCTA({ primary = { href: '/book/', label: 'Book Now' } }: { primary?: { href: string; label: string } }) {
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper px-3 pt-2 shadow-[0_-6px_20px_rgba(21,16,47,.15)] lg:hidden" data-sticky-cta>
      <div className="mx-auto grid max-w-lg grid-cols-[1fr_auto] gap-2">
        <Button href={primary.href} track={{ event: 'click_book_now', label: 'sticky_mobile' }}>{primary.label}</Button>
        <PhoneLink label="sticky_mobile" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-ink px-5 font-bold text-ink no-underline">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" /></svg>
          Call
        </PhoneLink>
      </div>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-x pt-4 text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-muted">
        {items.map((c, i) => (
          <li key={c.path} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className="font-semibold text-ink">{c.name}</span>
            ) : (
              <a href={c.path} className="text-muted underline hover:text-ink">{c.name}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Shell({ children, minimal, breadcrumb, sticky }: { children: ReactNode; minimal?: boolean; breadcrumb?: { name: string; path: string }[]; sticky?: { href: string; label: string } | false }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:font-bold focus:text-ink">
        Skip to content
      </a>
      <Announcement />
      <Header minimal={minimal} />
      {breadcrumb && breadcrumb.length > 1 && <Breadcrumbs items={breadcrumb} />}
      <main id="main">{children}</main>
      <Footer minimal={minimal} />
      {sticky !== false && <StickyCTA primary={sticky || undefined} />}
      <ConsentBanner />
    </>
  );
}

/** Lightweight consent UI → updates Google Consent Mode v2 via /assets/app.js.
 *  Replace with a certified CMP (Cookiebot, OneTrust, Termly…) if required — hook points documented in docs/analytics.md. */
function ConsentBanner() {
  // Shown automatically only in opt-in mode (PUBLIC_CONSENT_ADS_DEFAULT=denied); "Cookie settings" in the footer always opens it.
  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      hidden
      data-consent-banner
      className="fixed inset-x-2 bottom-[4.75rem] z-50 mx-auto flex max-w-xl flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border-2 border-ink bg-paper px-3 py-2 text-sm text-ink shadow-lg lg:bottom-4"
    >
      <p className="flex-1 basis-56">We use cookies to measure bookings &amp; ads. <a href="/privacy/" className="underline">Privacy</a></p>
      <div className="flex gap-2">
        <button type="button" data-consent="accept" className="min-h-10 rounded-full border-2 border-ink bg-gold px-4 font-bold">Accept</button>
        <button type="button" data-consent="decline" className="min-h-10 rounded-full border-2 border-ink bg-paper px-4 font-bold">Decline</button>
      </div>
    </div>
  );
}

/** Site-wide announcement bar — edited in /admin → Settings → Site settings. */
function Announcement() {
  const a = settingsContent.announcement;
  if (!a?.enabled || !a.text?.trim()) return null;
  return (
    <div className="bg-gold text-ink" data-announcement>
      <div className="container-x py-2 text-center text-sm font-bold">
        {a.link ? <a href={a.link} className="text-ink underline" data-track="click_announcement" data-track-label="announcement">{a.text}</a> : a.text}
      </div>
    </div>
  );
}
