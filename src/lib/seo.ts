import type { Credential } from '@/types';
import { profile } from './data';

/** WebPage and breadcrumb JSON-LD for a top-level page, serialised for an inline script. */
export function pageJsonLd(path: string, name: string, description: string, type = 'WebPage', inLanguage = 'en') {
  const url = profile.url + path;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': type,
        '@id': `${url}#webpage`,
        url,
        name,
        description,
        inLanguage,
        isPartOf: { '@id': `${profile.url}/#website` },
        about: { '@id': `${profile.url}/#person` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: profile.name, item: `${profile.url}/` },
          { '@type': 'ListItem', position: 2, name, item: url },
        ],
      },
    ],
  }).replace(/</g, '\\u003c');
}

/** FAQPage structured data for a list of [question, answer] pairs, ready for a JSON-LD script tag. */
export const faqJsonLd = (questions: string[][]) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }).replace(/</g, '\\u003c');

/** One certification as schema.org structured data. */
export const credentialJsonLd = (cert: Credential) => ({
  '@type': 'EducationalOccupationalCredential',
  name: cert.title,
  credentialCategory: 'certification',
  description: cert.detail,
  competencyRequired: cert.validates,
  url: cert.href,
  recognizedBy: cert.issuer && { '@type': 'Organization', name: cert.issuer },
});
