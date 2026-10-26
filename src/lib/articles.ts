export const topics = ['React', '.NET', 'Azure AI', 'Legacy migration'] as const;
export type Topic = (typeof topics)[number];

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
  /** The one section of the articles index this belongs to */
  topic: Topic;
  /** Search terms the article answers; also the related-article signal, the OG tags and the feed categories */
  tags: string[];
  /** Quick answers shown under the body and published as FAQ structured data: [question, answer] */
  faq?: string[][];
}

// The body of each article lives in src/app/articles/<slug>/page.tsx.
// Claims about my own work in them restate CV bullets; the rest is general engineering practice.
export const articles: Article[] = [
  {
    slug: 'rag-azure-openai-azure-ai-search-dotnet',
    title: 'RAG in .NET with Azure OpenAI and Azure AI Search',
    description: 'Retrieval-augmented generation in C#: chunk and embed documents, index them in Azure AI Search, run a hybrid vector query, and ground the answer with citations.',
    published: '2026-10-26',
    caseStudy: 'qatar-events-platform-module-federation',
    minutes: 11,
    topic: 'Azure AI',
    tags: ['RAG', 'Azure OpenAI', 'Azure AI Search', 'C#', '.NET', 'ASP.NET Core', 'embeddings', 'vector search', 'Microsoft Foundry', 'generative AI'],
    faq: [
      ['What is retrieval-augmented generation?', 'A pattern where the application first retrieves the passages most relevant to a question from its own documents, then sends those passages to a language model with the question, so the answer is grounded in your data instead of the model\'s training set.'],
      ['Which Azure services does a RAG app need?', 'An embedding deployment and a chat deployment in Azure OpenAI, and an Azure AI Search index with a vector field. Document Intelligence is optional for turning PDFs into text.'],
      ['Should I use vector search or keyword search for RAG?', 'Both, in one hybrid query. Vector search finds passages that mean the same thing in different words; keyword search finds exact product names, codes and identifiers that embeddings blur. Azure AI Search fuses the two result lists with reciprocal rank fusion.'],
      ['How big should a chunk be?', 'A few hundred tokens with some overlap. Chunks that are too small lose the sentence that answers the question; chunks that are too large dilute the embedding and waste the prompt budget.'],
      ['How do I stop the model inventing answers?', 'Tell it in the system message to answer only from the supplied passages and to say when they do not contain the answer, pass the passages with identifiers, require a citation per claim, and check in tests that answers to questions outside the corpus come back as "not found".'],
      ['What is the difference between Azure OpenAI On Your Data and building RAG yourself?', 'On Your Data wires Azure AI Search into the chat completion call for you, so one request does retrieval and generation. Building it yourself means two calls, but you control chunking, filters, the number of passages and the prompt, and you can test retrieval on its own.'],
    ],
  },
  {
    slug: 'entity-framework-core-stored-procedures-sql-server',
    title: 'Stored procedures in Entity Framework Core: call, map, test',
    description: 'When a stored procedure belongs in an EF Core app, how to call one with FromSql and ExecuteSql, read output parameters, map saves, and test the data layer.',
    published: '2026-10-26',
    caseStudy: 'visual-foxpro-to-dotnet-migration',
    minutes: 10,
    topic: '.NET',
    tags: ['Entity Framework Core', 'stored procedures', 'SQL Server', 'T-SQL', 'C#', 'ASP.NET Core', 'FromSql', 'SqlQuery'],
    faq: [
      ['How do I call a stored procedure in Entity Framework Core?', 'For entity results, FromSql on the DbSet with an EXECUTE statement and interpolated parameters, then ToListAsync. For scalar or unmapped result types, Database.SqlQuery<T>. For procedures that return nothing, Database.ExecuteSqlAsync. FromSql was added in EF Core 7; older versions use FromSqlInterpolated.'],
      ['Can I add Where or OrderBy after FromSql on a stored procedure?', 'No. EF Core composes LINQ by wrapping your SQL in a subquery, and SQL Server does not allow a procedure call inside a subquery. Call AsEnumerable or AsAsyncEnumerable straight after FromSql and filter in memory, or move the filter into a procedure parameter.'],
      ['How do I get an output parameter back from a stored procedure in EF Core?', 'Create a SqlParameter with Direction set to Output, pass it to ExecuteSqlRawAsync alongside the input parameters, and read its Value after the call completes.'],
      ['Is FromSql safe from SQL injection?', 'Yes, when values are placed inside the interpolated string: EF Core turns each one into a DbParameter. FromSqlRaw with string concatenation is not safe, and it is the only option when a column or table name has to vary, so validate that name against an allow list.'],
      ['Can EF Core use stored procedures for SaveChanges?', 'Yes, since EF Core 7. InsertUsingStoredProcedure, UpdateUsingStoredProcedure and DeleteUsingStoredProcedure on the entity builder map each operation to a procedure, with HasParameter, HasOriginalValueParameter and HasResultColumn describing its shape. Microsoft notes that the support does not mean procedures are recommended.'],
      ['How do I unit test code that calls stored procedures?', 'You cannot, in memory: the procedure is the logic. Put each call behind a small interface so the business code can be tested with a fake, and run the real procedures against a disposable SQL Server in an integration test.'],
    ],
  },
  {
    slug: 'ddd-cqrs-blazor-server-entity-framework-core',
    title: 'DDD and CQRS in a .NET module without the ceremony',
    description: 'DDD and CQRS in a Blazor Server and EF Core module: aggregates that guard the rules, one handler per command, queries as projections, no MediatR.',
    published: '2026-10-26',
    caseStudy: 'codex-vehicle-cybersecurity-platform',
    minutes: 10,
    topic: '.NET',
    tags: ['Domain-Driven Design', 'CQRS', 'Blazor Server', 'Entity Framework Core', 'C#', 'ASP.NET Core', 'clean architecture'],
    faq: [
      ['What is CQRS in simple terms?', 'Command Query Responsibility Segregation: code that changes data (commands) is separate from code that reads it (queries). Commands go through the domain model and its rules; queries read whatever shape the screen needs, straight from the database.'],
      ['Do I need MediatR for CQRS?', 'No. CQRS is a separation, not a library. A command is a record, a handler is a class with one Handle method, and the handler is injected where it is used. MediatR adds a dispatcher and a pipeline, which helps once there are dozens of handlers with shared behaviours such as validation and logging.'],
      ['Does CQRS require two databases?', 'No. The usual form has one database with two kinds of code reading and writing it. Separate read stores arrive only when the read load or the read shape justifies the synchronisation work.'],
      ['What is an aggregate in Domain-Driven Design?', 'A cluster of objects, with one root entity, that is loaded and saved as a unit and enforces its own invariants. Code outside the aggregate changes it only through methods on the root, never by setting properties on its children.'],
      ['Why should Blazor Server use IDbContextFactory instead of a scoped DbContext?', 'In server-side Blazor, scoped services live for the user\'s circuit, so a scoped DbContext is shared by every component on the page and can be used concurrently, which DbContext does not support. Microsoft recommends AddDbContextFactory and one context per operation.'],
      ['Where do domain events get published?', 'After the aggregate\'s changes are saved. An EF Core SaveChanges interceptor can collect the events from tracked aggregates and dispatch them once the transaction commits, so a handler never sees an event for a change that was rolled back.'],
    ],
  },
  {
    slug: 'visual-foxpro-reports-to-blazor-dotnet',
    title: 'Replacing Visual FoxPro reports with Blazor and SQL Server',
    description: 'How to retire FoxPro .frx reports without losing a number: inventory, totals in T-SQL, a Blazor QuickGrid screen, CSV and PDF exports, and parity tests.',
    published: '2026-10-26',
    caseStudy: 'visual-foxpro-to-dotnet-migration',
    minutes: 9,
    topic: 'Legacy migration',
    tags: ['Visual FoxPro', 'reports', 'Blazor', 'SQL Server', 'T-SQL', 'QuickGrid', 'legacy modernization', 'FoxPro to .NET migration'],
    faq: [
      ['How do I convert Visual FoxPro reports to .NET?', 'Inventory the .frx files and who still runs each one, read the report\'s query and calculated fields as the specification, move the aggregation into a T-SQL query or procedure, render the result in a Blazor page, and prove parity by running old and new for the same period and comparing totals.'],
      ['What is an .frx file?', 'A Visual FoxPro report definition. It is itself a FoxPro table: each row is a band, field, line or label, with the expression, position and format in its columns. USE the .frx as a table to read every expression it contains.'],
      ['Which .NET reporting tool replaces FoxPro reports?', 'For on-screen reports, a Blazor page with QuickGrid and a T-SQL query is enough. For printed output, choose a PDF library for .NET and check its licence terms for your company size. Most FoxPro reports turn out to be lists with totals that need no report designer at all.'],
      ['Why do the totals differ between the FoxPro report and the new one?', 'Usually one of four things: rows FoxPro skipped because SET DELETED was on, rounding done per line in FoxPro and once at the end in SQL, a filter buried in the report\'s data environment, or a date range that FoxPro treated as inclusive. Compare row counts before comparing sums.'],
      ['Should reports be migrated before or after the data?', 'After. A report is a view over the data, so migrating it before the tables are in SQL Server means writing it twice. The same rule holds for the application logic: move the data model first, then the workflows, then the reports that read what the workflows wrote.'],
    ],
  },
  {
    slug: 'visual-foxpro-to-sql-server-data-migration',
    title: 'Visual FoxPro to SQL Server: a repeatable data migration',
    description: 'Moving Visual FoxPro tables into SQL Server: a mapping for every field type, deleted rows, code pages, and a staging load with control totals you can rehearse.',
    published: '2026-10-22',
    caseStudy: 'visual-foxpro-to-dotnet-migration',
    minutes: 12,
    topic: 'Legacy migration',
    tags: ['Visual FoxPro', 'SQL Server', 'data migration', 'T-SQL', 'BULK INSERT', 'SqlBulkCopy', 'legacy modernization'],
    faq: [
      ['How do I migrate a Visual FoxPro database to SQL Server?', 'Inventory the .dbf, .fpt and .cdx files, map every field type to a SQL Server type, load the raw rows into staging tables with BULK INSERT or SqlBulkCopy, then transform them into the new schema in T-SQL with row counts and money totals compared at each step. Rehearse the whole load from one command until the totals agree three times.'],
      ['What SQL Server type should a FoxPro Currency field become?', 'decimal(19,4). FoxPro Currency is exact to four decimal places. SQL Server money has the same range, but Microsoft recommends decimal with at least four places for values used in calculations.'],
      ['Why do deleted FoxPro records appear after migration?', 'FoxPro DELETE only flags the record; the row stays in the .dbf until the table is packed, and SET DELETED defaults to off. Carry DELETED() into staging as a column, count the flagged rows, and load only unflagged rows into the final schema.'],
      ['Can SQL Server read FoxPro tables directly?', 'Only through the Visual FoxPro OLE DB provider, which ships as a 32-bit DLL. A 64-bit SQL Server cannot load it as a linked server, so the usual route is an x86 .NET loader with SqlBulkCopy, or a COPY TO export from FoxPro loaded with BULK INSERT.'],
      ['How do I convert FoxPro code pages to Unicode?', 'Read the code page mark from each table with CPDBF(), export with COPY TO ... AS 1252 or let the OLE DB provider translate to .NET strings, and load into nvarchar columns. With BULK INSERT, set CODEPAGE to match the export, then check rows with accented characters by eye.'],
    ],
  },
  {
    slug: 'react-state-management-redux-zustand-context',
    title: 'Redux Toolkit, Zustand or Context: where React state belongs',
    description: 'Server state, shared client state, local UI state and URL state each have a natural home. When to use TanStack Query, Redux Toolkit, Zustand or Context.',
    published: '2026-10-22',
    caseStudy: 'qatar-events-platform-module-federation',
    minutes: 7,
    topic: 'React',
    tags: ['React', 'Redux Toolkit', 'Zustand', 'React Context', 'TanStack Query', 'state management', 'TypeScript'],
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
    updated: '2026-10-22',
    caseStudy: 'qatar-events-platform-module-federation',
    minutes: 8,
    topic: 'React',
    tags: ['React', 'micro frontends', 'Module Federation', 'webpack', 'Rspack', 'frontend architecture'],
    faq: [
      ['What is Module Federation?', 'A bundler feature, introduced in webpack 5, that lets one JavaScript application load code from another separately built and deployed application at runtime, while sharing dependencies such as React between them.'],
      ['When are micro frontends worth it?', "When several teams ship into one frontend and block each other's releases. With a single team, a well-structured monolith with code splitting is simpler and faster."],
      ['How do micro frontends share React?', 'Each build lists React under shared with singleton set to true, so the page loads one copy and every remote uses it. Two copies on one page break hooks and context.'],
      ['Does Module Federation work with Rspack and Vite?', 'Yes. Module Federation 2.0, published as @module-federation/enhanced, runs on webpack and Rspack, and the project ships integrations for Vite, Next.js and others. The configuration keeps the same shape: name, exposes, remotes and shared.'],
      ['What is mf-manifest.json?', 'A manifest that Module Federation 2.0 builds emit next to remoteEntry.js. A host that points a remote at the manifest instead of the JavaScript entry gets the remote\'s types, resource preloading and devtools support.'],
      ['Can a remote URL be decided at runtime?', 'Yes. The runtime API loadRemote loads a remote by name, and registerRemotes adds remotes from configuration or an API response, so one shell build can serve environments with different remote URLs.'],
      ['What happens when a remote fails to load?', 'If it is loaded lazily behind an error boundary, only that section shows a fallback and the rest of the page keeps working.'],
    ],
  },
  {
    slug: 'react-table-virtualization-20000-rows',
    title: 'Rendering 20,000 rows in React without freezing the page',
    description: 'A reproducible React virtualization benchmark with 20,000 synthetic rows, raw runs, median filter delays, fixed-height windowing code and measurement limits.',
    published: '2026-10-05',
    updated: '2026-10-22',
    caseStudy: 'volopa-react-performance',
    minutes: 11,
    topic: 'React',
    tags: ['React', 'virtualization', 'react-window', 'TanStack Virtual', 'web performance', 'large tables'],
    faq: [
      ['What is virtualization in React?', 'Rendering only the rows that are visible in the scroll area, plus a few either side, while the full list stays in memory. It is also called windowing.'],
      ['How many rows can a React table handle?', 'It depends on row complexity, device and interaction. This synthetic example keeps 20,000 rows in memory but mounts 18 at scroll position zero. The article reports repeatable filter measurements, not a universal row limit.'],
      ['Should I use virtualization or pagination?', 'Paginate when users look things up and the server can filter and sort. Virtualize when users scan or compare a long list and scrolling is the natural way to read it.'],
      ['How do I virtualize rows with different heights?', 'Use a library that measures rows as they render. With TanStack Virtual, give it an estimateSize and attach measureElement to each row; positions are corrected as the real heights arrive.'],
      ['Can a React table show a million rows?', 'Not by loading them all. Keep the data on the server, fetch it in pages as the user scrolls, and virtualize whatever has arrived. The DOM then holds a few dozen rows whatever the total.'],
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
    topic: 'Legacy migration',
    tags: ['Visual FoxPro', 'FoxPro to .NET migration', 'C#', '.NET', 'SQL Server', 'Entity Framework Core', 'legacy modernization'],
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
    updated: '2026-10-22',
    caseStudy: 'hayya-qatar-evisa-platform',
    minutes: 7,
    topic: 'React',
    tags: ['React', 'Core Web Vitals', 'LCP', 'INP', 'code splitting', 'web performance', 'Next.js'],
    faq: [
      ['What is a good LCP score?', '2.5 seconds or less, measured at the 75th percentile of real visits. Between 2.5 and 4 seconds needs improvement, and above 4 seconds is poor.'],
      ['Did INP replace FID?', 'Yes. Interaction to Next Paint replaced First Input Delay as a Core Web Vital in March 2024. It measures the whole interaction through to the next paint, not only the delay before the handler starts.'],
      ['Does code splitting improve LCP?', 'It does when JavaScript is what delays the first paint, which is the usual case in a client-rendered React app. It does little if the LCP element is a slow image or the server response itself is slow.'],
      ['What is a good INP score?', '200 milliseconds or less at the 75th percentile of real visits. Up to 500 milliseconds needs improvement, and above 500 is poor.'],
      ['How do I find which interaction has a bad INP?', 'Use the attribution build of the web-vitals library. Each INP report names the element that was interacted with and splits the time into input delay, processing duration and presentation delay.'],
      ['How do I break up a long task in JavaScript?', 'Split the work into chunks and let the browser paint between them: await scheduler.yield() where it is supported (Chrome 129, Firefox 142), with a setTimeout fallback elsewhere.'],
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
    topic: '.NET',
    tags: ['ASP.NET Core', '.NET', 'authorization', 'RBAC', 'data redaction', 'C#', 'Entity Framework Core', 'API security'],
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
    topic: 'React',
    tags: ['React', 'WebSocket', 'real-time dashboard', 'Server-Sent Events', 'web performance', 'TypeScript'],
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

/** The three articles closest to this one: same topic first, then the most shared tags */
export const related = (a: Article, count = 3) =>
  articles
    .filter((other) => other.slug !== a.slug)
    .map((other) => ({ other, score: (other.topic === a.topic ? 10 : 0) + other.tags.filter((t) => a.tags.includes(t)).length }))
    .sort((x, y) => y.score - x.score)
    .slice(0, count)
    .map(({ other }) => other);

export const article = (slug: string) => {
  const found = articles.find((a) => a.slug === slug);
  if (!found) throw new Error(`articles: no article "${slug}"`);
  return found;
};
