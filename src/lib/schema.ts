/**
 * JSON-LD builders. Only facts from business.ts are used. No Review/AggregateRating
 * is emitted until verified first-party review data exists (see content.ts → testimonials).
 * Entity graph uses stable @id URIs so every page references the same business entity.
 */
import { business } from '../data/business';
import type { FAQ } from './types';
import { absUrl, config } from './config';

export const ids = {
  org: absUrl('/#organization'),
  business: absUrl('/#localbusiness'),
  website: absUrl('/#website'),
  gameShow: absUrl('/game-show-experience/#service'),
  birthday: absUrl('/birthday-parties/#service'),
  groups: absUrl('/group-events/#service'),
};

const dayMap: Record<string, string> = {
  Monday: 'https://schema.org/Monday', Tuesday: 'https://schema.org/Tuesday', Wednesday: 'https://schema.org/Wednesday',
  Thursday: 'https://schema.org/Thursday', Friday: 'https://schema.org/Friday', Saturday: 'https://schema.org/Saturday',
  Sunday: 'https://schema.org/Sunday',
};

export const postalAddress = () => ({
  '@type': 'PostalAddress',
  streetAddress: business.address.street,
  addressLocality: business.address.city,
  addressRegion: business.address.region,
  postalCode: business.address.postalCode,
  addressCountry: business.address.country,
});

export function sitewideSchema() {
  const lb: Record<string, unknown> = {
    '@type': ['EntertainmentBusiness', 'LocalBusiness'],
    '@id': ids.business,
    name: business.name,
    alternateName: ['Game Show Room', 'Game Show Room Rockaway NJ', 'Live Game Show Room Rockaway'],
    description: business.description,
    url: absUrl('/'),
    telephone: business.phone.e164,
    email: business.email,
    image: absUrl('/images/og-default.png'),
    logo: absUrl('/images/logo.png'),
    priceRange: '$33+ per guest',
    currenciesAccepted: 'USD',
    address: postalAddress(),
    containedInPlace: { '@type': 'ShoppingCenter', name: 'Rockaway Townsquare', address: postalAddress() },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Morris County, New Jersey' },
      { '@type': 'City', name: 'Rockaway, New Jersey' },
    ],
    openingHoursSpecification: business.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => dayMap[d]),
      opens: h.opens,
      closes: h.closes,
    })),
    hasMap: business.mapsUrl,
    isAccessibleForFree: false,
    publicAccess: true,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Free parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Wheelchair accessible', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Private party room', value: true },
    ],
    parentOrganization: { '@id': ids.org },
    makesOffer: [
      { '@type': 'Offer', itemOffered: { '@id': ids.gameShow } },
      { '@type': 'Offer', itemOffered: { '@id': ids.birthday } },
      { '@type': 'Offer', itemOffered: { '@id': ids.groups } },
    ],
  };
  if (business.geo) lb.geo = { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng };
  const sameAs = business.sameAs.filter(Boolean);
  if (sameAs.length) lb.sameAs = sameAs;

  return [
    {
      '@type': 'Organization',
      '@id': ids.org,
      name: business.parentOrganization.name,
      url: business.parentOrganization.url,
    },
    lb,
    {
      '@type': 'WebSite',
      '@id': ids.website,
      url: absUrl('/'),
      name: 'Game Show Room Rockaway',
      publisher: { '@id': ids.business },
      inLanguage: 'en-US',
    },
  ];
}

export function webPage(path: string, name: string, description: string, type = 'WebPage') {
  return {
    '@type': type,
    '@id': absUrl(path) + '#webpage',
    url: absUrl(path),
    name,
    description,
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.business },
    inLanguage: 'en-US',
    breadcrumb: { '@id': absUrl(path) + '#breadcrumb' },
  };
}

export function breadcrumbList(path: string, crumbs: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': absUrl(path) + '#breadcrumb',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absUrl(c.path) })),
  };
}

export function service(opts: {
  id: string; name: string; serviceType: string; description: string; url: string;
  audience?: string; priceFrom?: number;
}) {
  const s: Record<string, unknown> = {
    '@type': 'Service',
    '@id': opts.id,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: absUrl(opts.url),
    provider: { '@id': ids.business },
    areaServed: { '@type': 'AdministrativeArea', name: 'Morris County, New Jersey' },
  };
  if (opts.audience) s.audience = { '@type': 'Audience', audienceType: opts.audience };
  if (opts.priceFrom)
    s.offers = {
      '@type': 'Offer',
      priceCurrency: 'USD',
      priceSpecification: { '@type': 'UnitPriceSpecification', minPrice: opts.priceFrom, priceCurrency: 'USD', unitText: 'per guest' },
      url: absUrl('/book/'),
      availability: 'https://schema.org/InStock',
    };
  return s;
}

/** FAQPage — valid schema.org markup. Note: Google limits FAQ rich results to authoritative
 *  gov/health sites since 2023, but the markup still aids machine understanding (AEO). */
export function faqPage(path: string, list: FAQ[]) {
  return {
    '@type': 'FAQPage',
    '@id': absUrl(path) + '#faq',
    mainEntity: list.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function article(path: string, headline: string, description: string, datePublished: string, dateModified: string) {
  return {
    '@type': 'BlogPosting',
    '@id': absUrl(path) + '#article',
    headline,
    description,
    datePublished,
    dateModified,
    mainEntityOfPage: { '@id': absUrl(path) + '#webpage' },
    author: { '@type': 'Organization', name: business.name, url: absUrl('/') },
    publisher: { '@id': ids.business },
    image: absUrl('/images/og-default.png'),
    inLanguage: 'en-US',
  };
}

export const graph = (nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
