/**
 * FAQ ENGINE — every answer is sourced from the business's published FAQ
 * (gameshowroomrockaway.com/faqs, Oct 2026) or derived strictly from facts in business.ts.
 * `searchEvidence` records which PPC/GSC/review signal makes the question worth answering.
 * Pages pull FAQs by topic: faqsFor(['birthday']).
 */
import type { FAQ } from '../lib/types';

import { faqContent } from '../lib/content-store';

/** FAQs live in content/faqs.json (edited in /admin → FAQs). */
export const faqs: FAQ[] = faqContent as FAQ[];

export const faqsFor = (topics: string[], limit = 99) =>
  faqs.filter((f) => f.topics.some((t) => topics.includes(t))).slice(0, limit);

export const faqById = (id: string) => {
  const f = faqs.find((x) => x.id === id);
  if (!f) throw new Error(`Unknown FAQ id: ${id}`);
  return f;
};
export const faqsByIds = (ids: string[]) => ids.map(faqById);
