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
  /** Quick answers shown on the page and published as FAQ structured data: [question, answer] */
  faq?: string[][];
}

// Role landing pages. Nothing here is new copy about the work: the pages list the CV bullets,
// skills and case studies that match each role, so they stay in step with data.ts.
export const roles = {
  frontend: {
    path: '/frontend-developer',
    name: 'Frontend developer',
    title: 'Senior Frontend Developer: React, Next.js, Angular',
    heading: ['Senior', 'Frontend', 'Developer'],
    description:
      'Senior frontend developer with 8 years of React, Next.js, Angular and TypeScript on government and fintech platforms. Remote from Lahore, available now.',
    lead: 'Eight years building frontends in React, Next.js and Angular with TypeScript, on government, fintech and cybersecurity platforms. Based in Lahore, five years fully remote with US, UK and German teams, and available immediately.',
    match: /React|Angular|Next\.js|frontend|front-end|Micro Frontends|Core Web Vitals|virtualization|component|dashboards|responsive|WCAG|TypeScript|Redux|Zustand/i,
    skillGroups: ['Frontend', 'Architecture & Performance', 'UI, Mobile & Accessibility', 'Testing & Quality'],
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
  },
  ai: {
    path: '/ai-engineer',
    name: 'AI engineer',
    title: 'AI Engineer: LLM integration, agents, evaluation',
    heading: ['Senior', 'AI-Integrated', 'Engineer'],
    description:
      'Full-stack engineer who builds with AI and builds AI into products: Azure OpenAI integrations, LLM evaluation tooling since 2020, a self-built agent harness.',
    lead: 'I build with AI and I build AI into products: Azure OpenAI (GPT) integrations on Qatar\'s government platforms, and evaluation and training interfaces for large language models at Turing in 2020 and 2021. Day to day I work through my own agent harness across Claude, Codex, Gemini, Kimi, DeepSeek and Groq.',
    match: /Azure OpenAI|evaluation|human feedback/i,
    skillGroups: ['AI & LLM Engineering', 'Backend & APIs', 'Cloud & DevOps'],
    studies: ['ai-evaluation-training-interfaces'],
    faq: [
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
      'Senior developer shipping .NET and React apps on Microsoft Azure: Functions, App Service, Azure SQL, Azure DevOps pipelines and Azure OpenAI integrations.',
    lead: 'I deploy .NET and React applications on Microsoft Azure: Azure Functions, App Service, Azure SQL, Blob Storage, Key Vault and Application Insights, with Azure DevOps pipelines and Azure OpenAI (GPT) integrations on Qatar\'s government platforms. Based in Lahore, five years fully remote with US, UK and German teams, and available immediately.',
    match: /Azure/i,
    skillGroups: ['Cloud & DevOps', 'Backend & APIs', 'Databases', 'AI & LLM Engineering'],
    studies: ['qatar-events-platform-module-federation', 'hayya-qatar-evisa-platform'],
    faq: [
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

export const roleSkills = (role: Role) => skills.filter((group) => role.skillGroups.includes(group.category));
