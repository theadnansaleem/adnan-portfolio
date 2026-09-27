import { jobs, projects } from "./data";
import type { CaseStudy } from "@/types";

// Case studies reuse the CV bullets and project copy already in data.ts.
// Nothing here is written fresh: pick() selects bullets from the role and
// throws at build time if the CV wording changed and a filter stopped matching.
function pick(company: string, match: RegExp): string[] {
  const job = jobs.find((j) => j.company === company);
  if (!job) throw new Error(`case-studies: no job for "${company}"`);
  const bullets = job.bullets.filter((b) => match.test(b));
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
  const job = jobs.find((j) => j.company === company);
  if (!job) throw new Error(`case-studies: no job for "${company}"`);
  return { company: job.company, role: job.role, period: job.period, location: job.location };
}

const SC = "Supreme Committee for Delivery & Legacy";
const VOLOPA = "Volopa Financial Services";

export const caseStudies: CaseStudy[] = [
  {
    slug: "qatar-events-platform-module-federation",
    title: "Micro Frontends with Module Federation on the Qatar Events Platform",
    metaTitle: "Module Federation micro frontends: Qatar Events Platform",
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
    metaTitle: "Hayya Qatar eVisa platform: .NET APIs and Core Web Vitals",
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
    metaTitle: "react-window virtualization on a fintech payments platform",
    description:
      "Volopa payments and card platform: react-window virtualization on 20,000+ row tables, code splitting, and WCAG 2.1 work for customers in 180+ countries.",
    summary: project("Volopa Financial Services").description,
    highlights: pick(VOLOPA, /./),
    stack: project("Volopa Financial Services").tags,
    live: project("Volopa Financial Services").href,
    image: project("Volopa Financial Services").image,
    ...role(VOLOPA),
  },
];

export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
