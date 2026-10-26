import { articles } from './articles';
import { caseStudies } from './case-studies';
import { jobs, skills } from './data';

export interface Role {
  path: string;
  /** Short name, used in breadcrumbs and links */
  name: string;
  title: string;
  /** H1 as [before, emphasised, after] */
  heading: [string, string, string];
  description: string;
  lead: string;
  /** A CV bullet or stack tag belongs to this role when it matches */
  match: RegExp;
  skillGroups: string[];
  /** Case study slugs, for a role whose studies cannot be found from their stack tags */
  studies?: string[];
  /** Article slugs written from this role's work, in the order to show them */
  articles?: string[];
  /** Quick answers shown on the page and published as FAQ structured data: [question, answer] */
  faq?: string[][];
}

// Role landing pages. Nothing here is new copy about the work: the pages list the CV bullets,
// skills and case studies that match each role, so they stay in step with data.ts.
export const roles = {
  frontend: {
    path: '/frontend-developer',
    name: 'Frontend developer',
    title: 'Senior React Developer for Remote Teams',
    heading: ['Senior', 'React', 'Developer'],
    description:
      'Hire a senior React developer with 8 years of frontend experience in React, Next.js, Angular and TypeScript. Based in Lahore, available for remote work now.',
    lead: 'I build React and Next.js applications with TypeScript. Eight years of frontend experience across React, Next.js and Angular on government, fintech and cybersecurity platforms, including five years fully remote with US, UK and German teams. Based in Lahore and available immediately for international remote roles.',
    match: /React|Angular|Next\.js|frontend|front-end|Micro Frontends|Core Web Vitals|virtualization|component|dashboards|responsive|WCAG|TypeScript|Redux|Zustand/i,
    skillGroups: ['Frontend', 'Architecture & Performance', 'UI, Mobile & Accessibility', 'Testing & Quality'],
    articles: [
      'module-federation-micro-frontends-react',
      'react-table-virtualization-20000-rows',
      'core-web-vitals-react-lcp-code-splitting',
      'real-time-dashboard-react-websocket',
      'react-state-management-redux-zustand-context',
    ],
    faq: [
      ['Which frontend frameworks do you work in?', 'React, Next.js and Angular, with TypeScript. Eight years across government, fintech and cybersecurity platforms.'],
      ['Have you split a large frontend into micro frontends?', 'Yes. On the Qatar Events Platform I rearchitected a monolithic React frontend into micro frontends with Module Federation, which cut release cycle time by about 40%.'],
      ['What have you done for frontend performance?', 'Virtualization and memoization cut render time by about 70% on tables over 20,000 rows, code splitting cut an initial bundle by about 35%, and LCP improved by about 35% on core pages of a national platform.'],
      ['Do you build accessible interfaces?', 'Yes. The multi-currency payments platform I worked on met WCAG 2.1 accessibility and UK fintech regulatory standards.'],
      ['Are you available for remote work?', 'Yes. I am based in Lahore, have worked fully remote for five years with US, UK and German teams, and am available immediately.'],
    ],
  },
  dotnet: {
    path: '/dotnet-developer',
    name: '.NET developer',
    title: 'Senior .NET Developer: C#, ASP.NET Core and Blazor',
    heading: ['Senior', '.NET', 'Developer'],
    description:
      'Senior .NET developer: C#, ASP.NET Core Web APIs, Blazor, EF Core and SQL Server on government and fintech platforms. Remote from Lahore, available now.',
    lead: 'Backends in C#, .NET 6/8, ASP.NET Core Web APIs and Blazor, with SQL Server, T-SQL and Entity Framework Core, on government, fintech and cybersecurity platforms. Based in Lahore, five years fully remote with US, UK and German teams, and available immediately.',
    match: /\.NET|C#|Blazor|Entity Framework|EF Core|SQL Server|T-SQL|ASP\.NET|CQRS|Domain-Driven|DDD|stored procedures/i,
    skillGroups: ['Backend & APIs', 'Databases', 'Architecture & Performance', 'Cloud & DevOps'],
    articles: [
      'visual-foxpro-to-dotnet-migration-guide',
      'visual-foxpro-to-sql-server-data-migration',
      'visual-foxpro-reports-to-blazor-dotnet',
      'entity-framework-core-stored-procedures-sql-server',
      'ddd-cqrs-blazor-server-entity-framework-core',
      'role-based-access-control-data-redaction-dotnet',
    ],
    faq: [
      ['Which .NET versions and frameworks do you use?', 'C# on .NET 6 and .NET 8, with ASP.NET Core Web APIs, Blazor Server and Entity Framework Core.'],
      ['Have you migrated a legacy system to .NET?', 'Yes. As the sole engineer I migrated 42 financial workflows from a Visual FoxPro system to C# and .NET Core over a 2.5-year engagement, and retired the old system.'],
      ['Which databases do you work with?', 'SQL Server with T-SQL and stored procedures, plus PostgreSQL and MySQL. The FoxPro migration was rebuilt on Entity Framework Core and 42 T-SQL stored procedures.'],
      ['Do you use Domain-Driven Design and CQRS?', 'Yes. On a vehicle cybersecurity platform I created a C#/.NET Core module with Blazor Server and Entity Framework Core, applying Domain-Driven Design and CQRS for admin and reporting workflows.'],
      ['Do you also build the frontend?', 'Yes. I am full-stack: React, Next.js, Angular and Blazor on the frontend, .NET and Node.js behind it.'],
    ],
  },
  ai: {
    path: '/ai-engineer',
    name: 'AI engineer',
    title: 'AI Engineer: LLM integration, agents, evaluation',
    heading: ['Senior', 'AI-Integrated', 'Engineer'],
    description:
      'Microsoft Certified Azure AI developer (AI-103) who builds AI into products: Azure OpenAI integrations, LLM evaluation tooling since 2020, an agent harness.',
    lead: 'I build with AI and I build AI into products: Azure OpenAI (GPT) integrations on Qatar\'s government platforms, and evaluation and training interfaces for large language models at Turing in 2020 and 2021. Day to day I work through my own agent harness across Claude, Codex, Gemini, Kimi, DeepSeek and Groq.',
    match: /Azure OpenAI|evaluation|human feedback/i,
    skillGroups: ['AI & LLM Engineering', 'Backend & APIs', 'Cloud & DevOps'],
    studies: ['ai-evaluation-training-interfaces'],
    articles: ['rag-azure-openai-azure-ai-search-dotnet'],
    faq: [
      ['Are you Microsoft certified?', 'Yes. Microsoft Certified: Azure AI Apps and Agents Developer Associate (AI-103), earned in October 2026. It covers Microsoft Foundry, Azure OpenAI, agents with function calling and multi-agent orchestration, and RAG with Azure AI Search.'],
      ['Which AI models and tools do you use?', 'Claude, Codex, Gemini, Kimi, DeepSeek and Groq, run through an agent harness I built myself. Claude does most of the implementation, and Codex and Gemini review the finished change.'],
      ['How do you keep AI-written code safe to ship?', 'Every change takes six steps: ticket, investigate, implement, verify, review and approve. Guard hooks block destructive git and cloud commands, a second agent reviews the change, and I approve every merge myself.'],
      ['Have you worked on large language models directly?', 'Yes. At Turing in 2020 and 2021 I built evaluation and training interfaces for large language models, used by 100,000+ people for human feedback and data labelling.'],
      ['Have you put LLMs into production software?', 'Yes. I built Azure OpenAI (GPT) integrations on Qatar\'s government event platforms.'],
    ],
  },
  azure: {
    path: '/azure-developer',
    name: 'Azure developer',
    title: 'Azure Developer: .NET, Functions and Azure OpenAI',
    heading: ['Senior', 'Azure', 'Developer'],
    description:
      'Microsoft Certified (AI-103) senior developer shipping .NET and React apps on Azure: Functions, App Service, Azure DevOps pipelines and Azure OpenAI.',
    lead: 'I deploy .NET and React applications on Microsoft Azure: Azure Functions, App Service, Azure SQL, Blob Storage, Key Vault and Application Insights, with Azure DevOps pipelines and Azure OpenAI (GPT) integrations on Qatar\'s government platforms. Based in Lahore, five years fully remote with US, UK and German teams, and available immediately.',
    match: /Azure/i,
    skillGroups: ['Cloud & DevOps', 'Backend & APIs', 'Databases', 'AI & LLM Engineering'],
    articles: ['rag-azure-openai-azure-ai-search-dotnet'],
    studies: ['qatar-events-platform-module-federation', 'hayya-qatar-evisa-platform'],
    faq: [
      ['Are you Microsoft certified?', 'Yes. Microsoft Certified: Azure AI Apps and Agents Developer Associate (AI-103), earned in October 2026. It covers Microsoft Foundry, Azure OpenAI, agents with function calling and multi-agent orchestration, and RAG with Azure AI Search.'],
      ['Which Azure services do you use?', 'Azure Functions, App Service, Azure SQL, Blob Storage, Key Vault and Application Insights, with Azure DevOps for pipelines.'],
      ['Do you work with Azure OpenAI?', 'Yes. I built Azure OpenAI (GPT) integrations on Qatar\'s government event platforms.'],
      ['How do you deploy to Azure?', 'Through Azure DevOps CI/CD pipelines that build, test and deploy each change.'],
    ],
  },
} satisfies Record<string, Role>;

/** Jobs that have at least one matching CV bullet, with only those bullets. */
export const roleEvidence = (role: Role) =>
  jobs.map((job) => ({ job, bullets: job.bullets.filter((bullet) => role.match.test(bullet)) })).filter((entry) => entry.bullets.length > 0);

export const roleStudies = (role: Role) =>
  caseStudies.filter((study) => (role.studies ? role.studies.includes(study.slug) : study.stack.some((tag) => role.match.test(tag))));

export const roleArticles = (role: Role) =>
  (role.articles ?? []).map((slug) => articles.find((a) => a.slug === slug)).filter((a) => a !== undefined);

export const roleSkills = (role: Role) => skills.filter((group) => role.skillGroups.includes(group.category));
