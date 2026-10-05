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
  {
    slug: 'core-web-vitals-react-lcp-code-splitting',
    title: 'Passing Core Web Vitals in a React app: what moves LCP',
    description: 'How to find the element that sets your LCP, ship less before the first paint with code splitting, preload only what matters, and measure the change properly.',
    published: '2026-10-05',
    caseStudy: 'hayya-qatar-evisa-platform',
    minutes: 3,
  },
  {
    slug: 'role-based-access-control-data-redaction-dotnet',
    title: 'Role-based access control with data redaction in ASP.NET Core',
    description: 'Authorization decides who may call an endpoint. Redaction decides what they get back. How to do both in ASP.NET Core, and where data still leaks.',
    published: '2026-10-05',
    caseStudy: 'codex-vehicle-cybersecurity-platform',
    minutes: 3,
  },
  {
    slug: 'real-time-dashboard-react-websocket',
    title: 'A React dashboard that keeps up with a WebSocket feed',
    description: 'Why a live dashboard slows down over time, and the fixes: render once per frame, cap the list, aggregate as events arrive, and plan for reconnects.',
    published: '2026-10-05',
    caseStudy: 'codex-vehicle-cybersecurity-platform',
    minutes: 3,
  },
];

export const article = (slug: string) => {
  const found = articles.find((a) => a.slug === slug);
  if (!found) throw new Error(`articles: no article "${slug}"`);
  return found;
};
