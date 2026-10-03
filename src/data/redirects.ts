/**
 * 301 map: legacy WordPress URLs (from GSC "Pages" export) → new architecture.
 * Emitted to dist/_redirects at build. Keep every legacy URL with impressions here.
 */
export const redirects: { from: string; to: string; status: 301 | 302; reason: string }[] = [
  { from: '/room/', to: '/game-show-experience/', status: 301, reason: 'legacy room page (322 impr)' },
  { from: '/room', to: '/game-show-experience/', status: 301, reason: 'no-slash variant' },
  { from: '/birthday-party/', to: '/birthday-parties/', status: 301, reason: 'legacy birthday page (1,251 impr)' },
  { from: '/birthday-party', to: '/birthday-parties/', status: 301, reason: 'no-slash variant' },
  { from: '/faqs/', to: '/faq/', status: 301, reason: 'legacy FAQ (989 impr)' },
  { from: '/faqs', to: '/faq/', status: 301, reason: 'no-slash variant' },
  { from: '/testimonials/', to: '/reviews/', status: 301, reason: 'legacy testimonials (895 impr)' },
  { from: '/testimonials', to: '/reviews/', status: 301, reason: 'no-slash variant' },
  { from: '/gallery/', to: '/game-show-experience/', status: 301, reason: 'legacy gallery (541 impr) — photos move to experience page' },
  { from: '/gallery', to: '/game-show-experience/', status: 301, reason: 'no-slash variant' },
  { from: '/contact-us/', to: '/contact/', status: 301, reason: 'legacy contact (422 impr)' },
  { from: '/contact-us', to: '/contact/', status: 301, reason: 'no-slash variant' },
  { from: '/birthday', to: '/birthday-parties/', status: 301, reason: 'typed shortcut' },
  { from: '/party', to: '/birthday-parties/', status: 301, reason: 'typed shortcut' },
  { from: '/booking', to: '/book/', status: 301, reason: 'typed shortcut' },
  { from: '/pricing.html', to: '/pricing/', status: 301, reason: 'defensive' },
  { from: '/feed/*', to: '/blog/', status: 301, reason: 'retired WP feed' },
];
