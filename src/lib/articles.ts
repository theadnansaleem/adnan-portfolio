export interface Article {
  slug: string;
  title: string;
  description: string;
  /** ISO date of first publication */
  published: string;
  /** ISO date of the last substantial revision, when there has been one */
  updated?: string;
  /** Case study that covers the same work */
  caseStudy: string;
  minutes: number;
  /** Quick answers shown under the body and published as FAQ structured data: [question, answer] */
  faq?: string[][];
}

// The body of each article lives in src/app/articles/<slug>/page.tsx.
// Claims about my own work in them restate CV bullets; the rest is general engineering practice.
export const articles: Article[] = [
  {
    slug: 'react-state-management-redux-zustand-context',
    title: 'Redux Toolkit, Zustand or Context: where React state belongs',
    description: 'Server state, shared client state, local UI state and URL state each have a natural home. When to use TanStack Query, Redux Toolkit, Zustand or Context.',
    published: '2026-10-22',
    caseStudy: 'qatar-events-platform-module-federation',
    minutes: 7,
    faq: [
      ['Should I use Redux Toolkit or Zustand?', 'Zustand when a few components share client state and you want little setup. Redux Toolkit when many screens write to the same state and you need named actions and DevTools history to trace changes.'],
      ['Is React Context a replacement for Redux?', 'No. Context passes a value down the tree, and every component that reads it re-renders when it changes. It suits values that rarely change, such as a theme, a locale or the signed-in user.'],
      ['Where should data from an API live?', 'In a server-state cache such as TanStack Query, or RTK Query if the app already uses Redux Toolkit. They handle caching, refetching and shared requests, which a client store makes you write by hand.'],
      ['Why does my Zustand selector cause an infinite loop?', 'In Zustand 5, a selector that returns a new array or object on every call can trigger React\'s "Maximum update depth exceeded" error. Return primitives, or wrap the selector in useShallow.'],
      ['Can Redux and Zustand be used in the same app?', 'Yes. Each store owns different state, and many apps pair a server-state cache with one small client store. What matters is that each piece of state has one owner.'],
    ],
  },
  {
    slug: 'module-federation-micro-frontends-react',
    title: 'React micro frontends with Module Federation: split a monolith',
    description: 'When micro frontends are worth it, how a shell and its remotes fit together, and the contracts that keep independent deploys from breaking each other.',
    published: '2026-10-05',
    updated: '2026-10-13',
    caseStudy: 'qatar-events-platform-module-federation',
    minutes: 6,
    faq: [
      ['What is Module Federation?', 'A bundler feature, introduced in webpack 5, that lets one JavaScript application load code from another separately built and deployed application at runtime, while sharing dependencies such as React between them.'],
      ['When are micro frontends worth it?', "When several teams ship into one frontend and block each other's releases. With a single team, a well-structured monolith with code splitting is simpler and faster."],
      ['How do micro frontends share React?', 'Each build lists React under shared with singleton set to true, so the page loads one copy and every remote uses it. Two copies on one page break hooks and context.'],
      ['What happens when a remote fails to load?', 'If it is loaded lazily behind an error boundary, only that section shows a fallback and the rest of the page keeps working.'],
    ],
  },
  {
    slug: 'react-table-virtualization-20000-rows',
    title: 'Rendering 20,000 rows in React without freezing the page',
    description: 'A reproducible React virtualization benchmark with 20,000 synthetic rows, raw runs, median filter delays, fixed-height windowing code and measurement limits.',
    published: '2026-10-05',
    updated: '2026-10-15',
    caseStudy: 'volopa-react-performance',
    minutes: 9,
    faq: [
      ['What is virtualization in React?', 'Rendering only the rows that are visible in the scroll area, plus a few either side, while the full list stays in memory. It is also called windowing.'],
      ['How many rows can a React table handle?', 'It depends on row complexity, device and interaction. This synthetic example keeps 20,000 rows in memory but mounts 18 at scroll position zero. The article reports repeatable filter measurements, not a universal row limit.'],
      ['Should I use virtualization or pagination?', 'Paginate when users look things up and the server can filter and sort. Virtualize when users scan or compare a long list and scrolling is the natural way to read it.'],
      ['Is react-window better than writing it by hand?', 'For production, yes. It is maintained and handles the edge cases. Writing the fixed-height version once by hand is still the quickest way to understand what the library does.'],
    ],
  },
  {
    slug: 'visual-foxpro-to-dotnet-migration-guide',
    title: 'Visual FoxPro to .NET and C#: a step-by-step migration guide',
    description: 'How to convert a legacy Visual FoxPro app to C#, .NET and SQL Server when the old code is the only spec: inventory, data, domain rules, reports, cutover.',
    published: '2026-10-05',
    updated: '2026-10-20',
    caseStudy: 'visual-foxpro-to-dotnet-migration',
    minutes: 10,
    faq: [
      ['Is Visual FoxPro still supported?', "No. Version 9 was the last release, and Microsoft's extended support for it ended in January 2015. Existing applications keep running, but nothing is being fixed."],
      ['Can a FoxPro application be converted to C# automatically?', 'Tools can translate syntax, but the result keeps the old structure: logic inside forms, shared state and row-by-row loops. For a system that will be maintained for years, rewriting workflow by workflow against tests gives a better result than a mechanical translation.'],
      ['How long does a FoxPro to .NET migration take?', 'It depends on the number of workflows and on how much of the knowledge is written down. Mine covered 42 workflows as a part-time engagement over two and a half years, with one engineer and no specification.'],
      ['Should the database move first or the application?', 'The data model, because everything else is tested against it. Moving the tables to SQL Server early also lets old and new run against comparable data while workflows move across one at a time.'],
      ['Can .NET read FoxPro tables directly?', "Yes, through Microsoft's Visual FoxPro OLE DB provider and the System.Data.OleDb package. The provider is 32-bit and Windows only, so the loader has to run as an x86 process on Windows."],
    ],
  },
  {
    slug: 'core-web-vitals-react-lcp-code-splitting',
    title: 'Passing Core Web Vitals in a React app: what moves LCP',
    description: 'How to find the element that sets your LCP, ship less before the first paint with code splitting, preload only what matters, and measure the change properly.',
    published: '2026-10-05',
    updated: '2026-10-13',
    caseStudy: 'hayya-qatar-evisa-platform',
    minutes: 5,
    faq: [
      ['What is a good LCP score?', '2.5 seconds or less, measured at the 75th percentile of real visits. Between 2.5 and 4 seconds needs improvement, and above 4 seconds is poor.'],
      ['Did INP replace FID?', 'Yes. Interaction to Next Paint replaced First Input Delay as a Core Web Vital in March 2024. It measures the whole interaction through to the next paint, not only the delay before the handler starts.'],
      ['Does code splitting improve LCP?', 'It does when JavaScript is what delays the first paint, which is the usual case in a client-rendered React app. It does little if the LCP element is a slow image or the server response itself is slow.'],
      ['Why is my Lighthouse score different from Search Console?', 'Lighthouse runs one simulated visit in a lab. Search Console reports what real Chrome users experienced over the previous 28 days. The field data is the one Google uses.'],
    ],
  },
  {
    slug: 'role-based-access-control-data-redaction-dotnet',
    title: 'Role-based data redaction and access control in ASP.NET Core',
    description: 'Authorization decides who may call an endpoint. Role-based redaction decides what they get back. How to do both in ASP.NET Core, and where data still leaks.',
    published: '2026-10-05',
    updated: '2026-10-20',
    caseStudy: 'codex-vehicle-cybersecurity-platform',
    minutes: 8,
    faq: [
      ['What is the difference between authorization and redaction?', 'Authorization decides whether a caller may use an endpoint at all. Redaction decides which fields of the answer that caller receives.'],
      ['Is hiding a field in the frontend enough?', "No. If the API returns the field, anyone signed in can read it in the browser's network tab. It has to be removed on the server before the response is serialized."],
      ['Should a forbidden record return 403 or 404?', 'Return 404 when the caller is not allowed to know the record exists, and 403 when the existence is not a secret but the action is not allowed.'],
      ['Where should redaction happen in ASP.NET Core?', 'In one step between the domain object and the response object, used by every endpoint, export and real-time channel that returns that type. For lists, write it as an expression so Entity Framework Core applies it inside the SQL query.'],
      ['What is the difference between role-based and resource-based authorization?', 'Role-based authorization checks only the caller, so an [Authorize] attribute can decide it before any data is loaded. Resource-based authorization checks the caller against one record, such as its team or owner, so it runs in code after the record is loaded, through IAuthorizationService.'],
      ['How do I redact sensitive data in ASP.NET Core logs?', 'Use Microsoft.Extensions.Compliance.Redaction with Microsoft.Extensions.Telemetry: call AddRedaction and EnableRedaction, then mark sensitive LoggerMessage parameters with a data classification attribute. The default redactor erases the value.'],
    ],
  },
  {
    slug: 'real-time-dashboard-react-websocket',
    title: 'A real-time React dashboard that keeps up with WebSockets',
    description: 'Why a live dashboard slows down over time, and the fixes: render once per frame, cap the list, aggregate as events arrive, and plan for reconnects.',
    published: '2026-10-05',
    updated: '2026-10-20',
    caseStudy: 'codex-vehicle-cybersecurity-platform',
    minutes: 7,
    faq: [
      ['Why does a React dashboard get slower over time?', 'Usually because a list in state grows for as long as the tab stays open, so every render has more to do, and because each incoming message triggers its own render.'],
      ['How often should a live dashboard re-render?', 'At most once per animation frame, which is about sixty times a second. Buffer incoming messages and flush them together.'],
      ['WebSocket or Server-Sent Events for a dashboard?', 'Server-Sent Events are simpler when data only flows from server to browser, and they reconnect on their own. Use a WebSocket when the browser also sends messages, or when you need binary data.'],
      ['How do I reconnect a WebSocket safely?', 'Retry with a delay that doubles up to a ceiling, add some randomness so clients do not all return at once, and after reconnecting ask the server for the events you missed.'],
      ['How do I detect a WebSocket connection that died without closing?', 'Have the server send a small heartbeat every few seconds. If the client hears nothing for two or three intervals, drop the socket and reconnect yourself, because the browser may not fire onclose for a long time.'],
      ['Should a live dashboard keep every event in React state?', 'No. Keep the few dozen events the screen shows, update counters and chart buckets as events arrive, and leave the full history to the server to page through.'],
    ],
  },
];

export const article = (slug: string) => {
  const found = articles.find((a) => a.slug === slug);
  if (!found) throw new Error(`articles: no article "${slug}"`);
  return found;
};
