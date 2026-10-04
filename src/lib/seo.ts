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
