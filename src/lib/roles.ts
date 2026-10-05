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
}

// Role landing pages. Nothing here is new copy about the work: the pages list the CV bullets,
// skills and case studies that match each role, so they stay in step with data.ts.
export const roles = {
  frontend: {
    path: '/frontend-developer',
    name: 'Frontend developer',
    title: 'Senior Frontend Developer: React, Next.js and Angular',
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
} satisfies Record<string, Role>;

/** Jobs that have at least one matching CV bullet, with only those bullets. */
export const roleEvidence = (role: Role) =>
  jobs.map((job) => ({ job, bullets: job.bullets.filter((bullet) => role.match.test(bullet)) })).filter((entry) => entry.bullets.length > 0);

export const roleStudies = (role: Role) => caseStudies.filter((study) => study.stack.some((tag) => role.match.test(tag)));

export const roleSkills = (role: Role) => skills.filter((group) => role.skillGroups.includes(group.category));
