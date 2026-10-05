import type { ReactNode } from 'react';
import { business } from '../data/business';
import { nav, footerNav } from '../data/navigation';
import { Button, PhoneLink, MapLink, EmailLink, WaveDivider } from './ui';
import { Icon } from './StageArt';
import { fmtTime } from '../lib/format';
import { settingsContent } from '../lib/content-store';

function Logo({ size = 'header' }: { size?: 'header' | 'footer'; dark?: boolean }) {
  return (
    <a href="/" className="flex flex-none items-center no-underline" aria-label="Game Show Room Rockaway — home">
      {size === 'header' ? (
        <img src="/images/brand/logo-lockup.svg" alt="Game Show Room Rockaway NJ — an All In Adventures experience" width={267} height={85} className="h-12 w-auto sm:h-14" />
      ) : (
        <img src="/images/brand/logo-emblem.svg" alt="Game Show Room" width={350} height={198} loading="lazy" className="h-24 w-auto sm:h-28" />
      )}
    </a>
  );
}

export function Header({ minimal }: { minimal?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-edge/70 bg-night/95 text-bone backdrop-blur supports-[backdrop-filter]:bg-night/80">
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-3">
        <Logo />
        {minimal ? (
          <PhoneLink label="header_minimal" className="btn-line min-h-11 whitespace-nowrap px-4 text-sm">
            <span className="sm:hidden">Call us</span><span className="hidden sm:inline">Call {business.phone.display}</span>
          </PhoneLink>
        ) : (
          <>
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-0.5 text-[1.02rem] font-semibold">
                {nav.map((item) => (
                  <li key={item.href} className="group relative">
                    <a href={item.href} className="inline-flex min-h-11 items-center whitespace-nowrap rounded-[4px] px-2.5 text-bone no-underline hover:text-gold xl:px-3">
                      {item.label}
                    </a>
                    {item.children && (
                      <ul className="invisible absolute left-0 top-full z-50 min-w-60 rounded-[var(--radius-card)] border border-edge bg-panel p-2 text-bone opacity-0 shadow-[var(--shadow-pop)] transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <a href={c.href} className="block rounded-[4px] px-3 py-2 text-bone no-underline hover:bg-panel-2 hover:text-gold">{c.label}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-2">
              <PhoneLink label="header" className="hidden min-h-11 items-center whitespace-nowrap px-2 text-sm font-bold text-bone no-underline hover:text-gold md:inline-flex lg:hidden xl:inline-flex">
                {business.phone.display}
              </PhoneLink>
              <span className="hidden sm:block">
                <Button href="/book/" size="sm" track={{ event: 'click_book_now', label: 'header' }}>Book Now</Button>
              </span>
              {/* Mobile menu: <details> works without JavaScript */}
              <details className="relative lg:hidden" data-mobile-nav>
                <summary className="flex min-h-11 min-w-11 items-center justify-center rounded-[4px] border border-bone/40 px-3 font-bold" aria-label="Open menu">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
                  <span className="sr-only">Menu</span>
                </summary>
                <nav aria-label="Mobile" className="fixed inset-x-0 top-[4.5rem] max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-edge bg-night p-4 text-bone shadow-xl">
                  <ul className="space-y-1">
                    {nav.map((item) => (
                      <li key={item.href}>
                        <a href={item.href} className="font-display flex min-h-12 items-center rounded-[4px] px-3 text-xl font-semibold uppercase tracking-wide text-gold no-underline hover:bg-panel">{item.label}</a>
                        {item.children && (
                          <ul className="mb-2 ml-3 border-l border-edge pl-2">
                            {item.children.map((c) => (
                              <li key={c.href}>
                                <a href={c.href} className="flex min-h-11 items-center rounded-[4px] px-3 text-mist no-underline hover:bg-panel hover:text-bone">{c.label}</a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button href="/book/" track={{ event: 'click_book_now', label: 'mobile_menu' }}>Book Now</Button>
                    <PhoneLink label="mobile_menu" className="btn-line min-h-12">Call</PhoneLink>
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
  const head = 'font-display text-xl font-semibold uppercase tracking-wide text-gold';
  return (
    <footer className="relative bg-night pb-28 text-bone lg:pb-10">
      <div className="relative pt-2">
        <WaveDivider className="absolute inset-x-0 top-[4.25rem] sm:top-[5rem]" />
        <div className="relative flex flex-col items-center">
          <span className="bg-night px-4"><Logo size="footer" /></span>
          <p className="font-display mt-2 text-2xl font-semibold uppercase tracking-wide text-gold-2">Rockaway NJ</p>
        </div>
      </div>
      <div className="container-x mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.15fr_0.95fr_1.7fr]">
        <div>
          <h2 className={head}>{business.name}</h2>
          <p className="mt-3 max-w-sm text-mist">
            A live, host-led game show for private groups inside Rockaway Townsquare — birthday parties, team building, school groups and family nights out.
          </p>
          <address className="mt-4 flex gap-3 not-italic text-mist">
            <Icon name="pin" className="mt-0.5 h-5 w-5 flex-none text-bronze" />
            <span>
              {a.street}<br />{a.city}, {a.region} {a.postalCode}<br />
              <span className="text-smoke">Inside Rockaway Townsquare · first floor by the JCPenney entrance</span>
            </span>
          </address>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 pl-8">
            <MapLink label="footer" className="font-bold text-gold underline-offset-4 hover:underline">Get directions</MapLink>
          </p>
        </div>
        <div>
          <h2 className={head}>Contact &amp; hours</h2>
          <ul className="mt-3 space-y-2 text-mist">
            <li className="flex gap-3"><Icon name="phone" className="h-5 w-5 flex-none text-bronze" /><PhoneLink label="footer" className="font-bold text-bone hover:text-gold" /></li>
            <li className="flex gap-3"><Icon name="mail" className="h-5 w-5 flex-none text-bronze" /><EmailLink label="footer" className="break-all text-mist hover:text-gold" /></li>
          </ul>
          <dl className="mt-4 space-y-1 text-mist">
            {business.hours.map((h) => (
              <div key={h.label} className="flex justify-between gap-4 border-b border-edge/70 py-1.5">
                <dt>{h.label}</dt>
                <dd className="text-bone">{fmtTime(h.opens)} – {fmtTime(h.closes)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-smoke">Book at least 48 hours ahead. Same-day? Call to check.</p>
        </div>
        {!minimal && (
          <nav aria-label="Footer" className="md:col-span-2 lg:col-span-1">
            <h2 className={head}>Quick links</h2>
            <ul className="mt-2 gap-x-10 sm:columns-2">
              {footerNav.map((l) => (
                <li key={l.href} className="break-inside-avoid"><a href={l.href} className="inline-block py-1.5 leading-snug text-mist hover:text-gold">{l.label}</a></li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <div className="container-x mt-10 flex flex-col gap-2 border-t border-edge pt-6 text-sm text-smoke sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {business.legalBrand}.</p>
        <p className="flex gap-4">
          <a href="/privacy/" className="text-smoke hover:text-gold">Privacy</a>
          <a href="/terms/" className="text-smoke hover:text-gold">Terms</a>
          <button type="button" data-consent-open className="text-smoke underline hover:text-gold">Cookie settings</button>
        </p>
      </div>
    </footer>
  );
}


/** Thumb-zone CTA bar on mobile. Hidden on large screens. */
export function StickyCTA({ primary = { href: '/book/', label: 'Book Now' } }: { primary?: { href: string; label: string } }) {
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-edge bg-night/95 px-3 pt-2 shadow-[0_-8px_24px_rgba(0,0,0,.6)] backdrop-blur lg:hidden" data-sticky-cta>
      <div className="mx-auto grid max-w-lg grid-cols-[1fr_auto] gap-2">
        <Button href={primary.href} track={{ event: 'click_book_now', label: 'sticky_mobile' }}>{primary.label}</Button>
        <PhoneLink label="sticky_mobile" className="btn-line min-h-12 gap-2 px-5">
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
      <ol className="flex flex-wrap items-center gap-1 text-smoke">
        {items.map((c, i) => (
          <li key={c.path} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className="font-semibold text-mist">{c.name}</span>
            ) : (
              <a href={c.path} className="text-smoke underline hover:text-gold">{c.name}</a>
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
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:font-bold focus:text-night">
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
      className="fixed inset-x-2 bottom-[4.75rem] z-50 mx-auto flex max-w-xl flex-wrap items-center gap-x-3 gap-y-2 rounded-[var(--radius-card)] border border-edge bg-panel px-3 py-2 text-sm text-bone shadow-[var(--shadow-pop)] lg:bottom-4"
    >
      <p className="flex-1 basis-56">We use cookies to measure bookings &amp; ads. <a href="/privacy/" className="underline">Privacy</a></p>
      <div className="flex gap-2">
        <button type="button" data-consent="accept" className="btn-red min-h-10 px-4">Accept</button>
        <button type="button" data-consent="decline" className="btn-line min-h-10 px-4">Decline</button>
      </div>
    </div>
  );
}

/** Site-wide announcement bar — edited in /admin → Settings → Site settings. */
function Announcement() {
  const a = settingsContent.announcement;
  if (!a?.enabled || !a.text?.trim()) return null;
  return (
    <div className="bg-gold text-night" data-announcement>
      <div className="container-x py-2 text-center text-sm font-bold">
        {a.link ? <a href={a.link} className="text-night underline" data-track="click_announcement" data-track-label="announcement">{a.text}</a> : a.text}
      </div>
    </div>
  );
}
