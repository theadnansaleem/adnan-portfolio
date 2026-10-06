import { jobs, projects } from "./data";
import type { CaseStudy } from "@/types";

// Case studies reuse the CV bullets and project copy already in data.ts.
// Nothing here is written fresh: pick() selects bullets from the role and
// throws at build time if the CV wording changed and a filter stopped matching.
function job(company: string) {
  const found = jobs.find((j) => j.company === company);
  if (!found) throw new Error(`case-studies: no job for "${company}"`);
  return found;
}

function pick(company: string, match: RegExp): string[] {
  const bullets = job(company).bullets.filter((b) => match.test(b));
  if (bullets.length === 0) {
    throw new Error(`case-studies: ${match} matched no bullet of "${company}"`);
  }
  return bullets;
}

function project(title: string) {
  const found = projects.find((p) => p.title === title);
  if (!found) throw new Error(`case-studies: no project "${title}"`);
  return found;
}

function role(company: string) {
  const { role, period, location } = job(company);
  return { company, role, period, location };
}

const SC = "Supreme Committee for Delivery & Legacy";
const VOLOPA = "Volopa Financial Services";
const BENINGTON = "Benington Financials Canada";
const PRIMARY_TARGET = "Primary Target GmbH";
const TURING = "Turing Enterprises Inc.";
const TECHSURGE = "TechSurge Inc";

export const caseStudies: CaseStudy[] = [
  {
    slug: "qatar-events-platform-module-federation",
    title: "Micro Frontends with Module Federation on the Qatar Events Platform",
    metaTitle: "Micro frontends with Module Federation in React",
    description:
      "How a monolithic React frontend became Module Federation micro frontends on Qatar's National Events Calendar, cutting release cycle time by about 40%.",
    summary: project("Qatar Events Platform (QEP)").description,
    highlights: pick(SC, /Module Federation|ApexCharts|Standardized Vite/),
    stack: project("Qatar Events Platform (QEP)").tags,
    live: project("Qatar Events Platform (QEP)").href,
    image: project("Qatar Events Platform (QEP)").image,
    ...role(SC),
  },
  {
    slug: "hayya-qatar-evisa-platform",
    title: "Hayya Qatar eVisa and event access platform",
    metaTitle: "Hayya eVisa platform: .NET APIs, Core Web Vitals",
    description:
      "Qatar's official eVisa and event access platform: .NET APIs, SQL Server, Azure OpenAI integrations, and Core Web Vitals work across 3 national platforms.",
    summary: project("Hayya Qatar eVisa & Event Access Platform").description,
    highlights: pick(SC, /Hayya|all 3 national platforms|Core Web Vitals compliance/),
    stack: project("Hayya Qatar eVisa & Event Access Platform").tags,
    live: project("Hayya Qatar eVisa & Event Access Platform").href,
    image: project("Hayya Qatar eVisa & Event Access Platform").image,
    ...role(SC),
  },
  {
    slug: "volopa-react-performance",
    title: "React performance on a multi-currency payments platform",
    metaTitle: "react-window virtualization on a fintech platform",
    description:
      "Volopa payments and card platform: react-window virtualization on 20,000+ row tables, code splitting, and WCAG 2.1 work for customers in 180+ countries.",
    summary: project("Volopa Financial Services").description,
    highlights: pick(VOLOPA, /./),
    stack: project("Volopa Financial Services").tags,
    live: project("Volopa Financial Services").href,
    image: project("Volopa Financial Services").image,
    ...role(VOLOPA),
  },
  {
    slug: "visual-foxpro-to-dotnet-migration",
    title: "Migrating 42 financial workflows from Visual FoxPro to .NET",
    metaTitle: "Visual FoxPro to .NET Core migration: 42 workflows",
    description:
      "A 2.5-year solo migration of 42 financial workflows from Visual FoxPro to C#/.NET Core, Entity Framework Core, SQL Server, Angular and Blazor.",
    // No project card for this engagement, so the opening CV bullet is the summary.
    summary: pick(BENINGTON, /Independently migrated/)[0],
    highlights: pick(BENINGTON, /Redesigned|Rebuilt|Replaced/),
    stack: job(BENINGTON).tags,
    ...role(BENINGTON),
  },
  {
    slug: "codex-vehicle-cybersecurity-platform",
    title: "Real-time threat dashboards on a vehicle cybersecurity platform",
    metaTitle: "Vehicle cybersecurity platform: React, .NET, RBAC",
    description:
      "Codex assesses attack surfaces across 60M+ lines of vehicle software: real-time React dashboards over WebSockets, a Blazor Server module, and 4-tier RBAC.",
    summary: project("Codex: Cybersecurity Platform").description,
    highlights: pick(PRIMARY_TARGET, /./),
    stack: job(PRIMARY_TARGET).tags,
    live: project("Codex: Cybersecurity Platform").href,
    image: project("Codex: Cybersecurity Platform").image,
    ...role(PRIMARY_TARGET),
  },
  {
    slug: "ai-evaluation-training-interfaces",
    title: "Evaluation and training interfaces used by 100,000+ people",
    metaTitle: "LLM evaluation and labeling interfaces in React",
    description:
      "Full-stack evaluation, human feedback and data-labeling interfaces used by 100,000+ people, built with React, Angular, TypeScript and Node.js on AWS.",
    // No project card is tied to this role, so the opening CV bullet is the summary.
    summary: pick(TURING, /100,000\+ people/)[0],
    highlights: pick(TURING, /evaluation dashboards|AWS EC2/),
    stack: job(TURING).tags,
    ...role(TURING),
  },
  {
    slug: "reusable-ui-component-libraries",
    title: "Reusable UI component libraries across two products",
    metaTitle: "Reusable React and Angular component libraries",
    description:
      "Responsive, cross-browser React and Angular applications with reusable UI component libraries adopted across 2 internal projects, plus a promotion in 6 months.",
    summary: pick(TECHSURGE, /component libraries/)[0],
    highlights: pick(TECHSURGE, /Promoted/),
    stack: job(TECHSURGE).tags,
    ...role(TECHSURGE),
  },
];

export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
