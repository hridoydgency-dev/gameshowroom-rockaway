/** Route registry — the single list of pages. Add a page module, then register it here. */
import type { RouteDef } from './lib/types';
import { home } from './pages/home';
import { gameShow, vsEscape, njGuide } from './pages/game-show';
import { birthdayHub, kidsBirthday, teenBirthday, adultBirthday } from './pages/birthday';
import { groupsHub, corporate, school } from './pages/groups';
import { pricing, faqPageRoute, location, thingsToDo } from './pages/info';
import { blogIndex, blogRoutes } from './pages/blog';
import { ppcRoutes } from './pages/ppc';
import { book, thankYou, contact, reviews, privacy, terms } from './pages/utility';

const baseRoutes: RouteDef[] = [
  home,
  gameShow,
  birthdayHub, kidsBirthday, teenBirthday, adultBirthday,
  groupsHub, corporate, school,
  pricing, faqPageRoute, location,
  vsEscape, njGuide, thingsToDo,
  blogIndex, ...blogRoutes,
  book, contact, reviews,
  ...ppcRoutes,
  thankYou, privacy, terms,
];

/** Titles & descriptions edited in /admin → SEO titles (content/seo.json) override the page defaults. */
import { seoContent } from './lib/content-store';
const seoByPath = new Map(seoContent.map((s) => [s.path, s]));
export const routes: RouteDef[] = baseRoutes.map((r) => {
  const o = seoByPath.get(r.path);
  return o ? { ...r, seo: { ...r.seo, title: o.title, description: o.description } } : r;
});
