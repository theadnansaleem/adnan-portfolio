import type { Job, Project, SkillCategory, SkillBar, Stat, Credential } from '@/types';

export const jobs: Job[] = [
    {
        id: 1,
        period: "Oct 2025 — Aug 2026",
        company: "Supreme Committee for Delivery & Legacy",
        role: "Senior Fullstack Developer",
        description: "Owned features end to end across Qatar's flagship government event platforms — the Qatar Events Platform, Road to Qatar, and the Hayya eVisa system — serving 10+ government entities on post-World Cup digital infrastructure. Rearchitected a monolithic React frontend into Micro Frontends with Module Federation, cutting release cycle time by ~40%, and hit Core Web Vitals compliance with ~35% LCP and ~30% TTI improvements.",
        tags: ["React", "TypeScript", "Module Federation", "Redux Toolkit", "ApexCharts", ".NET", "Azure CI/CD"]
    },
    {
        id: 2,
        period: "Jun 2023 — Oct 2025",
        company: "Volopa Financial Services",
        role: "Senior Fullstack Developer",
        description: "Delivered production features across a multi-currency payments and card platform covering transfers, transaction tracking, and KYC for customers in 180+ countries, meeting WCAG 2.1 and UK fintech regulatory standards. Optimized large data tables with react-window virtualization, cutting render time by ~70% on 20,000+ row datasets, and reduced initial bundle size by ~35% through dynamic code splitting.",
        tags: ["React", "TypeScript", "Ant Design", "Tailwind CSS", "Node.js", "PHP", "Fintech"]
    },
    {
        id: 3,
        period: "Feb 2023 — Sep 2025",
        company: "Benington Financials Canada",
        role: "Freelance Full-Stack Developer",
        description: "Migrated a legacy Visual FoxPro financial system to a C#/.NET Core and Blazor web application as the sole engineer on the engagement. Redesigned legacy data models into a maintainable domain layer, rebuilt core financial workflows on Entity Framework Core against SQL Server with a testable data access layer, and retired the legacy reporting stack.",
        tags: ["C#", ".NET Core", "Blazor", "Entity Framework Core", "SQL Server"]
    },
    {
        id: 4,
        period: "Dec 2021 — Jun 2023",
        company: "Primary Target GmbH",
        role: "Mid-Level Fullstack Developer",
        description: "Built the core UI of Codex, a cybersecurity platform for assessing attack surfaces across vehicle software stacks containing 60M+ lines of code. Shipped real-time threat detection dashboards over WebSocket feeds, reducing analyst time-to-insight by ~20%, plus a .NET Core module on Blazor Server applying Domain-Driven Design and CQRS for admin and reporting workflows.",
        tags: ["React", "TypeScript", "C#", ".NET Core", "Blazor Server", "DDD", "CQRS", "WebSockets", "RBAC"]
    },
    {
        id: 5,
        period: "May 2020 — Dec 2021",
        company: "Turing Enterprises Inc.",
        role: "JavaScript / TypeScript Developer",
        description: "Built full-stack human evaluation interfaces and agentic AI tooling used by research teams at Google DeepMind, Meta, and Amazon to run training loops, collect RLHF feedback, and benchmark LLaMA 2 and early LLaMA 3. Designed tool-calling pipelines, multi-turn prompt orchestration, and automated evaluation harnesses deployed on AWS with Docker.",
        tags: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "AWS", "RLHF", "Agentic AI"]
    },
    {
        id: 6,
        period: "Sep 2018 — May 2020",
        company: "TechSurge Inc",
        role: "Frontend Developer",
        description: "Built responsive, cross-browser web applications using React, JavaScript, and Redux, including reusable UI component libraries adopted across multiple internal projects. Promoted from Junior to Frontend Developer within 6 months; integrated .NET APIs and helped establish frontend coding standards.",
        tags: ["React", "JavaScript", "Redux", ".NET", "REST APIs"]
    }
];

export const projects: Project[] = [
    {
        id: 1,
        number: "01",
        featured: true,
        title: "Qatar Events Platform (QEP)",
        description: "Qatar's unified hub for planning and coordinating the National Events Calendar across 10+ government entities. Features Micro Frontend architecture, real-time event density heatmaps, and data-intensive dashboards for nationwide event scheduling.",
        tags: ["React", "TypeScript", "Module Federation", ".NET"],
        gradient: "linear-gradient(135deg, #0a1a20 0%, #0d3045 50%, #050f18 100%)",
        href: "https://qep.sc.qa",
        image: "/projects/qep.png"
    },
    {
        id: 2,
        number: "02",
        featured: true,
        title: "Hayya Qatar E-Visa Platform",
        description: "Qatar's official eVisa and event access platform for the FIFA World Cup 2022 and beyond. Streamlines international visitor entry, visa processing, accommodation, and travel coordination at national scale.",
        tags: ["Next.js", "TypeScript", "Redux", "Node.js", "Tailwind CSS"],
        gradient: "linear-gradient(135deg, #1a0a1f 0%, #2d1145 50%, #110820 100%)",
        href: "https://www.hayya.qa",
        image: "/projects/hayya.png"
    },
    {
        id: 3,
        number: "03",
        featured: false,
        title: "Road to Qatar",
        description: "Supreme Committee fan gaming and engagement platform built around interactive challenges, fantasy football, match predictions, and global leaderboards for supporters following Qatar's national events.",
        tags: ["React", "TypeScript", "Redux Toolkit", ".NET"],
        gradient: "linear-gradient(135deg, #200a12 0%, #45112a 50%, #180610 100%)",
        href: "https://www.sc.qa"
    },
    {
        id: 4,
        number: "04",
        featured: false,
        title: "Volopa Financial Services",
        description: "Multi-currency payment and card management platform enabling global payments from the UK and EEA to 180+ countries, with multicurrency prepaid cards and simplified employee expense management.",
        tags: ["React", "TypeScript", "Zustand", "Ant Design"],
        gradient: "linear-gradient(135deg, #0f1f0a 0%, #1a3311 50%, #0a1a08 100%)",
        href: "https://volopa.com",
        image: "/projects/volopa.png"
    },
    {
        id: 5,
        number: "05",
        featured: false,
        title: "Meta LLaMA — RLHF Tooling",
        description: "Full-stack infrastructure for training, fine-tuning, alignment, and evaluation of LLaMA 2 and early LLaMA 3. Built agentic evaluation pipelines, human feedback collection interfaces, and multi-turn prompt orchestration tooling for ML researchers.",
        tags: ["React", "Node.js", "Python", "RLHF", "AWS"],
        gradient: "linear-gradient(135deg, #1a1200 0%, #2e2000 50%, #0f0b00 100%)",
        href: "https://ai.meta.com/llama/",
        image: "/projects/llama.png"
    },
    {
        id: 6,
        number: "06",
        featured: false,
        title: "Google DeepMind — LLM Optimization",
        description: "Fine-tuned and optimized large language models using DeepMind frameworks and Meta's LLaMA architecture. Implemented RLHF, LoRA, and PEFT techniques with prompt engineering and benchmarking pipelines for model alignment.",
        tags: ["Python", "PyTorch", "RLHF", "LoRA", "Docker"],
        gradient: "radial-gradient(ellipse at 30% 50%, #0f1f0a 0%, #050a04 60%)",
        href: "https://deepmind.google",
        image: "/projects/deepmind.png"
    },
    {
        id: 7,
        number: "07",
        featured: false,
        title: "Codex — Cybersecurity Platform",
        description: "Digital thread assessment tool mapping components, protocols, and software across vehicle stacks with 60M+ lines of code to automatically surface attack vectors, remediations, and penetration test data.",
        tags: ["React", "TypeScript", "C#", "Blazor Server", ".NET"],
        gradient: "linear-gradient(135deg, #0a1020 0%, #0d2045 50%, #060c1a 100%)",
        href: "https://primary-target.com/",
        image: "/projects/codex.png"
    },
    {
        id: 8,
        number: "08",
        featured: false,
        title: "Eclipse AI",
        description: "Large language model project focused on training, fine-tuning, and deploying advanced generative models with RLHF, dataset preparation, prompt engineering, and optimization for human-aligned AI outputs.",
        tags: ["React", "Node.js", "MongoDB", "Redux Toolkit"],
        gradient: "linear-gradient(135deg, #0f0f1f 0%, #1a1a3f 50%, #0a0a1a 100%)",
        href: "https://eclipse-ai.com",
        image: "/projects/eclipse.png"
    },
    {
        id: 9,
        number: "09",
        featured: false,
        title: "Norstella",
        description: "Platform for prominent pharmaceutical solutions providers offering a full range of consultancy services to smooth the path to life-saving therapies for patients and healthcare providers.",
        tags: ["React", "JavaScript", "Zustand", "SSR"],
        gradient: "linear-gradient(135deg, #0a1a20 0%, #0d3045 50%, #050f18 100%)",
        href: "https://www.norstella.com/",
        image: "/projects/norstella.png"
    },
    {
        id: 10,
        number: "10",
        featured: false,
        title: "National Compliance Management System",
        description: "Comprehensive compliance management platform for US oil and gas operators, encompassing policies, procedures, and practices to meet legal, regulatory, and ethical standards with non-compliance risk mitigation.",
        tags: ["Angular", ".NET", "Bootstrap", "RxJS"],
        gradient: "linear-gradient(135deg, #1a0a1f 0%, #2d1145 50%, #110820 100%)",
        href: "https://www.nationalcompliance.com/",
        image: "/projects/ncms.png"
    },
    {
        id: 11,
        number: "11",
        featured: false,
        title: "TopTech TMS",
        description: "Terminal Management System for a US-based oil and gas company, handling the full operational workflow of fuel terminal logistics including truck management, scheduling, and compliance tracking.",
        tags: ["React", ".NET", "PostgreSQL", "Redux"],
        gradient: "linear-gradient(135deg, #0f1f0a 0%, #1a3311 50%, #0a1a08 100%)",
        href: "https://toptech.com",
        image: "/projects/toptech.png"
    },
    {
        id: 12,
        number: "12",
        featured: false,
        title: "VMA Advisor — BG Products",
        description: "Platform for BG Products, Inc. which manufactures and distributes professional-use additives, cleaners, specialty lubricants, and precision tools used to service vehicles in countries worldwide.",
        tags: ["React", "Node.js", "TypeScript", "Material UI"],
        gradient: "linear-gradient(135deg, #0a1020 0%, #0d2045 50%, #060c1a 100%)",
        href: "https://bgprod.com/",
        image: "/projects/bgproducts.png"
    }
];

export const skills: SkillCategory[] = [
    {
        category: "Core Frontend",
        tags: ["React 18", "Next.js 14", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Angular (v15+)", "Angular Signals", "RxJS", "NgRx", "React Hooks", "Custom Hooks", "HOCs", "Isomorphic React", "SSR / ISR / SSG", "React Server Components", "Web Workers", "PWA", "App Router", "React Router"]
    },
    {
        category: "UI, Design Systems & Styling",
        tags: ["Tailwind CSS", "Material UI (MUI v5+)", "Ant Design", "Shadcn/UI", "Radix UI", "Bootstrap 5", "Kendo UI", "Chakra UI", "Styled Components", "CSS Modules", "Sass / Less", "Design Systems", "Storybook", "Figma (Dev Handoff)", "Responsive Design", "Mobile-First Design", "WCAG 2.1 Accessibility", "i18n / l10n", "Dark Mode Theming", "Framer Motion", "GSAP", "Flutter (iOS & Android)"]
    },
    {
        category: "State Management & Data Fetching",
        tags: ["Redux Toolkit", "TanStack Query", "Zustand", "Context API", "NgRx", "SWR", "GraphQL", "Apollo Client", "RESTful APIs", "gRPC", "WebSockets", "Webhooks", "Axios", "Fetch API"]
    },
    {
        category: "Architecture & Performance",
        tags: ["Micro Frontend (Module Federation)", "Monorepo (Nx, Turborepo)", "Domain-Driven Design", "CQRS", "Clean Architecture", "Microservices", "Code Splitting", "Lazy Loading", "Tree Shaking", "Virtualization (react-window)", "Memoization (useMemo, useCallback, React.memo)", "Core Web Vitals (LCP, FID, CLS)", "Lighthouse Optimization", "Bundle Analysis", "Critical CSS", "Image Optimization", "RBAC", "OAuth 2.0 / JWT / SSO", "Performance Profiling"]
    },
    {
        category: "Testing & Quality",
        tags: ["Jest", "Vitest", "React Testing Library", "Playwright", "Cypress", "Enzyme", "Jasmine", "Karma", "Unit Testing", "Integration Testing", "E2E Testing", "TDD", "Code Review", "Production Troubleshooting", "ESLint", "Prettier", "Husky / lint-staged"]
    },
    {
        category: "Backend & APIs",
        tags: ["Node.js", "Express.js", "C#", ".NET Core", "ASP.NET Core Web APIs", "Blazor Server", "Entity Framework Core", "Python", "FastAPI", "PHP Integration", "REST API Design", "GraphQL (Apollo Server)", "gRPC", "WebSockets", "PostgreSQL", "SQL Server", "MySQL", "MongoDB", "Redis", "Prisma ORM", "Supabase", "JWT Authentication", "API Gateway"]
    },
    {
        category: "Tooling, Build & DevOps",
        tags: ["Vite", "Webpack 5", "Babel", "Rollup", "esbuild", "NPM / Yarn / pnpm", "Docker", "Kubernetes (GKE)", "Terraform", "AWS (EC2, S3, Lambda, CloudFront)", "Azure (DevOps, Static Web Apps)", "GCP (GKE, Cloud Functions)", "CI/CD (GitHub Actions, GitLab CI, Jenkins)", "Git / GitFlow", "Nx Monorepo", "Jira", "Agile / Scrum", "Postman"]
    },
    {
        category: "AI, LLM & Agentic Systems",
        tags: ["Agentic AI Workflows", "Tool Calling & Function Calling", "MCP (Model Context Protocol)", "Multi-Agent Orchestration", "LangChain", "LlamaIndex", "RAG", "Vector Databases (Pinecone, Weaviate)", "OpenAI API (GPT-4, GPT-4o)", "Anthropic API (Claude)", "Vercel AI SDK", "LLM Fine-tuning", "RLHF", "LoRA", "PEFT", "Prompt Engineering", "Human Evaluation Interfaces", "AI Chat UI Development", "Streaming Responses (SSE)", "Model Benchmarking", "Data Labeling Pipelines", "Model Deployment (Docker, K8s)"]
    }
];

export const skillBars: SkillBar[] = [
    { label: "React / Next.js", value: 95 },
    { label: "TypeScript", value: 93 },
    { label: "Micro Frontend Arch.", value: 90 },
    { label: "Performance & Core Web Vitals", value: 92 },
    { label: "AI / LLM & Agentic Systems", value: 88 },
    { label: "UI / Design Systems", value: 91 },
    { label: "Node.js / Backend", value: 92 },
    { label: "C# / .NET & Blazor", value: 87 },
    { label: "Testing & Quality", value: 94 }
];

export const education: Credential[] = [
    {
        title: "BS in Computer Science",
        issuer: "Iqra University",
        meta: "Karachi, Pakistan · GPA 3.6"
    },
    {
        title: "Extended Level 5 Diploma in Business Management",
        issuer: "Qualifi Ltd.",
        meta: "London, United Kingdom"
    }
];

export const certifications: Credential[] = [
    {
        title: "Certified Cybersecurity Educator Professional (CCEP)",
        issuer: "CCEP",
        meta: "Dec 2025"
    },
    {
        title: "Data Science & Analytics",
        issuer: "HP LIFE",
        meta: "Nov 2025"
    },
    {
        title: "Frontend Career Path",
        issuer: "Scrimba",
        meta: "Mar 2018"
    }
];

export const marqueeItems: string[] = [
    "React 18", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit",
    "Module Federation", "Material UI", "Ant Design", "Node.js", "C#",
    ".NET Core", "Blazor", "Python", "RLHF", "LangChain", "Docker",
    "AWS", "Azure", "GraphQL", "Playwright"
];

export const stats: Stat[] = [
    { number: "8+", label: "Years of Experience" },
    { number: "25+", label: "Projects Delivered" },
    { number: "6", label: "Countries Served" },
    { number: "∞", label: "Problems Solved" }
];
