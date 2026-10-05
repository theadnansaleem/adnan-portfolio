export interface Article {
  slug: string;
  title: string;
  description: string;
  /** ISO date of first publication */
  published: string;
  /** Case study that covers the same work */
  caseStudy: string;
  minutes: number;
}

// The body of each article lives in src/app/articles/<slug>/page.tsx.
// Claims about my own work in them restate CV bullets; the rest is general engineering practice.
export const articles: Article[] = [
  {
    slug: 'module-federation-micro-frontends-react',
    title: 'Splitting a React monolith into micro frontends with Module Federation',
    description: 'When micro frontends are worth it, how a shell and its remotes fit together, and the contracts that keep independent deploys from breaking each other.',
    published: '2026-10-05',
    caseStudy: 'qatar-events-platform-module-federation',
    minutes: 3,
  },
  {
    slug: 'react-table-virtualization-20000-rows',
    title: 'Rendering 20,000 rows in React without freezing the page',
    description: 'Why big tables are slow, the windowing maths that fixes it in about ten lines, where memoization fits, and how to measure the result.',
    published: '2026-10-05',
    caseStudy: 'volopa-react-performance',
    minutes: 3,
  },
  {
    slug: 'visual-foxpro-to-dotnet-migration-guide',
    title: 'Migrating a Visual FoxPro system to .NET: an order of work that holds up',
    description: 'How to move a legacy Visual FoxPro application to C# and .NET when the only specification is the old code: inventory, data, domain layer, reports, retirement.',
    published: '2026-10-05',
    caseStudy: 'visual-foxpro-to-dotnet-migration',
    minutes: 3,
  },
];

export const article = (slug: string) => {
  const found = articles.find((a) => a.slug === slug);
  if (!found) throw new Error(`articles: no article "${slug}"`);
  return found;
};
