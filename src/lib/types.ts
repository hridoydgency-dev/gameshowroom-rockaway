import type { ReactNode } from 'react';

export interface Fact<T = unknown> { value: T; source: string; confirm?: boolean }

export interface Business {
  name: string;
  legalBrand: string;
  parentOrganization: { name: string; url: string };
  tagline: string;
  description: string;
  phone: { display: string; e164: string };
  email: string;
  address: {
    street: string; venue: string; city: string; region: string; regionName: string;
    postalCode: string; country: string; county: string;
  };
  hours: { days: string[]; label: string; opens: string; closes: string }[];
  mapsUrl: string;
  sameAs: string[];
  facts: Record<string, Fact>;
  booking: { provider: string; smallGroupUrl: string; largeGroupUrl: string };
  sisterLocations: { name: string; url: string }[];
  sisterExperiences: { name: string; url: string; note: string }[];
  geo?: { lat: number; lng: number };
}

export interface FAQ {
  id: string;
  q: string;
  a: string;               // plain text (also used in FAQPage JSON-LD)
  topics: string[];        // e.g. ['birthday','pricing'] — pages pull FAQs by topic
  source: 'business-site' | 'derived-from-business-facts';
  searchEvidence?: string; // the query/review signal that justifies this question
}

export interface Testimonial {
  id: string;
  author: string;           // as published by the reviewer (first name + initial)
  text: string;
  occasion?: string;
  source: 'google' | 'tripadvisor' | 'yelp' | 'facebook' | 'direct';
  sourceUrl?: string;
  date?: string;
  verified: boolean;        // only verified=true is ever rendered
}

export interface Promotion {
  id: string; title: string; detail: string; code?: string;
  startDate: string; endDate: string; pages: string[]; terms: string;
}

export interface SeoMeta {
  title: string;            // <= 60 chars ideally
  description: string;      // 120–160 chars
  primaryTopic: string;
  secondaryTopics?: string[];
  ogImage?: string;
  noindex?: boolean;
  canonical?: string;       // defaults to self
}

export interface RouteDef {
  path: string;             // trailing slash, e.g. '/birthday-parties/'
  seo: SeoMeta;
  breadcrumb?: { name: string; path: string }[];
  template: string;         // page module key, for docs/content-map
  pageType: 'home' | 'service' | 'landing' | 'hub' | 'guide' | 'article' | 'utility' | 'ppc';
  trackView?: string;       // dataLayer event fired on view, e.g. 'view_birthday_party'
  render: () => ReactNode;
  schema?: () => object[];  // page-level JSON-LD (in addition to sitewide)
  sitemap?: { priority: number; changefreq: 'weekly' | 'monthly' | 'yearly' };
  layout?: 'default' | 'ppc';
  lastModified?: string;
}
