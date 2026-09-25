import type { Job, Project, SkillCategory, Stat, Credential } from '@/types';

// Mirrors the CV (cv-master.json). Change the CV first, then this file.

export const profile = {
    name: "M. Adnan Saleem",
    alternateNames: ["Muhammad Adnan Saleem", "Adnan Saleem"],
    headline: "Senior Full-Stack Software Engineer | React | Next.js | Angular | TypeScript | Node.js | .NET",
    jobTitle: "Senior Full-Stack Software Engineer",
    location: "Lahore, Pakistan (Open to Relocation)",
    availability: "Available Immediately",
    email: "heyadnansaleem@gmail.com",
    linkedin: "https://www.linkedin.com/in/theadnan",
    github: "https://github.com/theadnansaleem",
    url: "https://theadnansaleem.com",
    resume: "/Adnan-Saleem-Resume.pdf",
    // The CV summary, split into paragraphs; only the name was added to the opening sentence.
    summary: [
        "M. Adnan Saleem is a senior full-stack software engineer with 8 years of enterprise application development experience, including 8 years of hands-on Amazon Web Services (AWS) experience. Builds frontends in React, Next.js, and Angular with TypeScript and JavaScript, and backends in Node.js, C#, .NET 6/8, ASP.NET Core Web APIs, and Blazor, with REST and GraphQL APIs and microservices.",
        "Delivered production platforms for government, fintech, and cybersecurity clients, owning features across UI, APIs, databases (SQL Server with T-SQL and stored procedures, PostgreSQL), Azure OpenAI (GPT) integrations, testing, and CI/CD (Azure DevOps, Jenkins, GitLab CI/CD, GitHub Actions). Rearchitected a monolithic frontend into micro frontends with Module Federation, cutting release cycle time by about 40%, and designed .NET domain layers with Entity Framework Core, Domain-Driven Design, and CQRS.",
        "Leads code reviews and mentors engineers in Agile/Scrum teams; five years fully remote with US, UK, and German teams; available immediately.",
    ],
};

export const jobs: Job[] = [
    {
        id: 1,
        period: "Oct 2025 - Aug 2026",
        company: "Supreme Committee for Delivery & Legacy",
        role: "Senior Fullstack Developer",
        location: "Doha, Qatar",
        workMode: "Hybrid, Full-Time",
        bullets: [
            "Owned features end to end across Qatar's flagship government event platforms (the Qatar Events Platform, Road to Qatar, and the Hayya eVisa platform), serving 10+ government entities and supporting post-FIFA World Cup digital infrastructure.",
            "Rearchitected a monolithic React frontend into Micro Frontends using Module Federation, defining versioned contracts between the shell and remotes, cutting release cycle time by approximately 40% and enabling teams to deploy independently.",
            "Developed .NET backend APIs, SQL Server data access with T-SQL stored procedures, and Azure OpenAI (GPT) integrations across API and data contracts, authentication flows, and performance-critical endpoints for all 3 national platforms.",
            "Achieved Core Web Vitals compliance through memoization, virtualization, lazy loading, and code splitting, improving LCP by approximately 35% and TTI by approximately 30% on core pages.",
            "Designed data-intensive dashboards and real-time event density heatmaps with ApexCharts, giving stakeholders across 10+ government entities nationwide visibility into event scheduling and preventing calendar conflicts.",
            "Standardized Vite and Webpack build pipelines, ran Azure DevOps and Jenkins CI/CD deployments, led code reviews, and mentored 7 junior developers alongside backend, product, and design teams.",
        ],
        tags: ["React", "TypeScript", "Redux Toolkit", "Module Federation", "ApexCharts", "C#", ".NET", "SQL Server", "T-SQL", "Azure OpenAI", "Azure CI/CD"]
    },
    {
        id: 2,
        period: "Jun 2023 - Oct 2025",
        company: "Volopa Financial Services",
        role: "Senior Fullstack Developer",
        location: "London, United Kingdom",
        workMode: "Remote, Full-Time",
        bullets: [
            "Shipped production features across a multi-currency payments and card platform covering transfers, transaction tracking, and KYC for customers in 180+ countries, with a React and Ant Design frontend over PHP and Node.js backend services, meeting WCAG 2.1 accessibility and UK fintech regulatory standards.",
            "Optimized large-scale data tables with react-window virtualization and memoization, reducing render time by approximately 70% on datasets exceeding 20,000 rows.",
            "Introduced dynamic code splitting that cut initial bundle size by approximately 35%, directly improving First Contentful Paint on financial dashboards.",
            "Refactored a legacy codebase into a modular architecture with a reusable component library, reducing feature development time by approximately 25%.",
        ],
        tags: ["React", "TypeScript", "Redux Toolkit", "Zustand", "Ant Design", "Tailwind CSS", "react-window", "Node.js", "PHP", "REST APIs", "Agile/Scrum"]
    },
    {
        id: 3,
        period: "Feb 2023 - Sep 2025",
        company: "Benington Financials Canada",
        role: "Freelance Full-Stack Developer",
        location: "Canada",
        workMode: "Remote, Part-Time Independent Contract",
        bullets: [
            "Independently migrated 42 financial workflows from a legacy Visual FoxPro system carrying two decades of business logic to C#/.NET Core, delivering Angular and Blazor frontend features as the sole engineer responsible for end-to-end development.",
            "Redesigned legacy data models and business logic with no existing specification into a maintainable .NET Core domain layer, preserving all 42 existing financial workflows.",
            "Rebuilt core financial workflows on Entity Framework Core and 42 T-SQL stored procedures against SQL Server, with a testable data access layer.",
            "Replaced the legacy Visual FoxPro reports with reporting workflows in the new Blazor application, retiring the old system over a 2.5-year engagement.",
        ],
        tags: ["C#", ".NET Core", "Angular", "Blazor", "Entity Framework Core", "SQL Server", "T-SQL", "Stored Procedures"]
    },
    {
        id: 4,
        period: "Dec 2021 - Jun 2023",
        company: "Primary Target GmbH",
        role: "Mid-Level Fullstack Developer",
        location: "Bavaria, Germany",
        workMode: "Remote, Full-Time",
        bullets: [
            "Maintained React, Angular, and TypeScript interfaces for Codex, a cybersecurity platform assessing attack surfaces across 60M+ lines of vehicle software.",
            "Engineered real-time threat detection dashboards in React and TypeScript with WebSocket feeds, reducing analyst time-to-insight by approximately 20%.",
            "Created a C#/.NET Core module using Blazor Server and Entity Framework Core, applying Domain-Driven Design and CQRS patterns for admin and reporting workflows.",
            "Developed an internal custom hooks library and component system that standardized patterns across the team, improving delivery velocity by approximately 30%.",
            "Secured sensitive security data with 4-tier Role-Based Access Control, secure .NET API integrations, and data redaction pipelines filtered by caller tier.",
        ],
        tags: ["React", "Redux", "Angular", "TypeScript", "C#", ".NET Core", "Blazor Server", "EF Core", "DDD", "CQRS", "Material UI", "WebSockets", "GitLab CI/CD", "RBAC"]
    },
    {
        id: 5,
        period: "May 2020 - Dec 2021",
        company: "Turing Enterprises Inc.",
        role: "JavaScript / TypeScript Developer",
        location: "Palo Alto, United States",
        workMode: "Remote, Full-Time (US business hours from Pakistan)",
        bullets: [
            "Built full-stack evaluation and training interfaces used by 100,000+ people, with React, Angular, TypeScript, and Node.js, supporting human feedback and data-labeling workflows.",
            "Developed evaluation dashboards and integrated frontend workflows with backend APIs for research and training activities.",
            "Deployed application components on AWS EC2, S3, and Lambda with Docker, working full US business hours from Pakistan for nearly two years.",
        ],
        tags: ["React", "Redux", "Angular", "TypeScript", "Node.js", "Python", "PostgreSQL", "Redis", "AWS (EC2, S3, Lambda)", "Docker"]
    },
    {
        id: 6,
        period: "Sep 2018 - May 2020",
        company: "TechSurge Inc",
        role: "Frontend Developer",
        location: "Karachi, Pakistan",
        workMode: "Onsite, Full-Time",
        bullets: [
            "Created responsive, cross-browser applications with React, Angular, JavaScript, and Redux, including reusable UI component libraries adopted across 2 internal projects.",
            "Promoted from Junior to Frontend Developer within 6 months; integrated .NET APIs and helped establish frontend coding standards.",
        ],
        tags: ["React", "Angular", "JavaScript", "Redux", "HTML5", "CSS3", ".NET", "REST APIs"]
    }
];

export const projects: Project[] = [
    {
        id: 1,
        number: "01",
        featured: true,
        title: "Hayya Qatar eVisa & Event Access Platform",
        description: "Qatar's official eVisa and event access platform under the Supreme Committee, handling international visitor entry, accommodation, and event management since the FIFA World Cup 2022.",
        tags: ["Next.js", "React", "TypeScript", "Redux", "Node.js", "Tailwind CSS"],
        gradient: "linear-gradient(135deg, #1a0a1f 0%, #2d1145 50%, #110820 100%)",
        href: "https://hayya.qa",
        image: "/projects/hayya.png"
    },
    {
        id: 2,
        number: "02",
        featured: true,
        title: "Qatar Events Platform (QEP)",
        description: "Unified hub for planning and coordinating Qatar's National Events Calendar, connecting government entities and preventing scheduling overlaps nationwide.",
        tags: ["React", "TypeScript", "Redux Toolkit", "Micro Frontends (Module Federation)", "React Router", ".NET"],
        gradient: "linear-gradient(135deg, #0a1a20 0%, #0d3045 50%, #050f18 100%)",
        href: "https://qep.sc.qa",
        image: "/projects/qep.png"
    },
    {
        id: 3,
        number: "03",
        featured: false,
        title: "Road to Qatar",
        description: "Supreme Committee fan gaming and engagement platform with interactive challenges, fantasy football, match predictions, and global leaderboards.",
        tags: ["React", "TypeScript", "Redux Toolkit", "REST APIs", ".NET"],
        gradient: "linear-gradient(135deg, #200a12 0%, #45112a 50%, #180610 100%)",
        image: "/projects/roadtoqatar.png"
    },
    {
        id: 4,
        number: "04",
        featured: false,
        title: "Volopa Financial Services",
        description: "Multi-currency payments and card management platform serving customers across 180+ countries, covering global transfers, transaction tracking, KYC, and employee expense management.",
        tags: ["React", "TypeScript", "Zustand", "Ant Design", "Node.js", "PHP"],
        gradient: "linear-gradient(135deg, #0f1f0a 0%, #1a3311 50%, #0a1a08 100%)",
        href: "https://volopa.com",
        image: "/projects/volopa.png"
    },
    {
        id: 5,
        number: "05",
        featured: false,
        title: "Norstella Pharma Solutions Platform",
        description: "Web platform for Norstella, a group of pharmaceutical solutions providers whose mission is to smooth the path to life-saving therapies for patients and providers.",
        tags: ["React", "Angular", "JavaScript", "Bootstrap", "Zustand", "Server-Side Rendering (SSR)"],
        gradient: "linear-gradient(135deg, #0a1020 0%, #0d2045 50%, #060c1a 100%)",
        href: "https://norstella.com",
        image: "/projects/norstella.png"
    },
    {
        id: 6,
        number: "06",
        featured: false,
        title: "Eclipse AI",
        description: "Generative AI voice-of-customer analytics platform for customer experience teams. Worked on the React frontend with Redux Toolkit in 2023, alongside the team lead.",
        tags: ["React", "Redux Toolkit"],
        gradient: "linear-gradient(135deg, #0f0f1f 0%, #1a1a3f 50%, #0a0a1a 100%)",
        href: "https://eclipse-ai.com",
        image: "/projects/eclipse.png"
    },
    {
        id: 7,
        number: "07",
        featured: false,
        title: "Meta LLaMA: RLHF Tooling",
        description: "Full-stack infrastructure for training, fine-tuning, alignment, and evaluation of LLaMA 2 and early LLaMA 3. Built agentic evaluation pipelines, human feedback collection interfaces, and multi-turn prompt orchestration tooling for ML researchers.",
        tags: ["React", "Node.js", "Python", "RLHF", "AWS"],
        gradient: "linear-gradient(135deg, #1a1200 0%, #2e2000 50%, #0f0b00 100%)",
        href: "https://ai.meta.com/llama/",
        image: "/projects/llama.png"
    },
    {
        id: 8,
        number: "08",
        featured: false,
        title: "Google DeepMind: LLM Optimization",
        description: "Fine-tuned and optimized large language models using DeepMind frameworks and Meta's LLaMA architecture. Implemented RLHF, LoRA, and PEFT techniques with prompt engineering and benchmarking pipelines for model alignment.",
        tags: ["Python", "PyTorch", "RLHF", "LoRA", "Docker"],
        gradient: "radial-gradient(ellipse at 30% 50%, #0f1f0a 0%, #050a04 60%)",
        href: "https://deepmind.google",
        image: "/projects/deepmind.png"
    },
    {
        id: 9,
        number: "09",
        featured: false,
        title: "Codex: Cybersecurity Platform",
        description: "Digital thread assessment tool mapping components, protocols, and software across vehicle stacks with 60M+ lines of code to automatically surface attack vectors, remediations, and penetration test data.",
        tags: ["React", "TypeScript", "C#", "Blazor Server", ".NET"],
        gradient: "linear-gradient(135deg, #0a1020 0%, #0d2045 50%, #060c1a 100%)",
        href: "https://primary-target.com/",
        image: "/projects/codex.png"
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
        title: "VMA Advisor: BG Products",
        description: "Platform for BG Products, Inc. which manufactures and distributes professional-use additives, cleaners, specialty lubricants, and precision tools used to service vehicles in countries worldwide.",
        tags: ["React", "Node.js", "TypeScript", "Material UI"],
        gradient: "linear-gradient(135deg, #0a1020 0%, #0d2045 50%, #060c1a 100%)",
        href: "https://bgprod.com/",
        image: "/projects/bgproducts.png"
    }
];

export const skills: SkillCategory[] = [
    {
        category: "Frontend",
        tags: ["React 18", "Next.js 14", "Angular", "TypeScript", "JavaScript (ES6+)", "RxJS", "State Management (Redux, Redux Toolkit, NgRx, Zustand, React Query / TanStack Query)", "React Router", "React Hooks", "SSR / SSG / ISR", "React Server Components", "HTML5", "CSS3"]
    },
    {
        category: "Backend & APIs",
        tags: ["C#", ".NET 6", ".NET 8", ".NET Core", "ASP.NET Core Web APIs", "Node.js", "Express.js", "Blazor Server", "Entity Framework Core", "REST APIs", "API Design", "GraphQL", "WebSockets", "Webhooks", "Microservices", "PHP Integration", "Python"]
    },
    {
        category: "Architecture & Performance",
        tags: ["System Design", "Distributed Systems", "Micro-Frontend Architecture (Module Federation)", "Monorepos (Nx, Turborepo)", "Design Systems", "OOP", "SOLID", "Design Patterns", "Domain-Driven Design", "CQRS", "Clean Architecture", "Code Splitting", "Lazy Loading", "Virtualization", "Memoization", "Core Web Vitals (LCP, FID, CLS)", "RBAC", "OAuth 2.0 / JWT / SSO"]
    },
    {
        category: "Databases",
        tags: ["SQL Server (T-SQL, Stored Procedures)", "PostgreSQL", "MySQL", "NoSQL (MongoDB, Redis)", "Prisma ORM"]
    },
    {
        category: "Cloud & DevOps",
        tags: ["Amazon Web Services (AWS, 8 years)", "EC2", "S3", "Lambda", "Azure DevOps", "Jenkins", "CI/CD (Continuous Integration / Continuous Deployment)", "GitHub Actions", "GitLab CI/CD", "Docker", "Kubernetes", "Terraform (Infrastructure as Code)", "Google Cloud Platform", "Vite", "Webpack", "Git / GitFlow"]
    },
    {
        category: "UI, Mobile & Accessibility",
        tags: ["Tailwind CSS", "Material UI", "Ant Design", "Bootstrap 5", "Styled Components", "Storybook", "Figma Handoff", "Data Visualization (ApexCharts)", "Mobile-First Responsive Design", "PWA", "Flutter (iOS and Android)", "WCAG 2.1", "i18n"]
    },
    {
        category: "Testing & Quality",
        tags: ["Jest", "Vitest", "React Testing Library", "Playwright", "Cypress", "Test-Driven Development (TDD)", "Unit / Integration / E2E Testing", "Code Review", "Debugging and Production Troubleshooting", "ESLint", "Prettier"]
    },
    {
        category: "Ways of Working",
        tags: ["Agile / Scrum", "Code Review", "Mentoring", "Technical Documentation", "QA Collaboration", "Cross-Functional Teams", "Remote (US, UK, Germany)"]
    },
    {
        category: "AI & LLM Engineering",
        tags: ["Azure OpenAI (GPT) Integration", "Agentic Workflows", "Tool and Function Calling (OpenAI, Anthropic Claude)", "MCP", "RAG", "LangChain", "Vector Databases", "RLHF", "LoRA", "PEFT", "Prompt Engineering", "Streaming Responses (SSE)", "Vercel AI SDK"]
    }
];

export const education: Credential[] = [
    {
        title: "BS in Computer Science",
        issuer: "Iqra University",
        meta: "Karachi, Pakistan · GPA 3.60/4.00 · Feb 2014 - May 2018"
    },
    {
        title: "Extended Diploma in Business Management",
        issuer: "Qualifi Ltd.",
        meta: "London, United Kingdom · May 2023 - Apr 2025"
    }
];

export const certifications: Credential[] = [
    {
        title: "Cisco: Introduction to Modern AI",
        meta: "Sep 2026",
        href: "https://www.credly.com/badges/bde8c946-d3d2-4173-87b3-52af3dd5e6c5"
    },
    {
        title: "Cisco: Python Essentials",
        meta: "Sep 2026",
        href: "https://www.credly.com/badges/840bb802-3fb6-4dcb-959c-7821ec31564e"
    },
    {
        title: "Cisco: JavaScript Essentials",
        meta: "Sep 2026",
        href: "https://www.credly.com/badges/9ac940fc-1dd9-4b30-98db-bb35e64f1e5f"
    },
    {
        title: "Cisco: Introduction to Cybersecurity",
        meta: "Sep 2026",
        href: "https://www.credly.com/badges/82b24207-0c45-4910-970f-9cebc99da8d8/public_url"
    },
    {
        title: "Certified Cybersecurity Educator Professional (CCEP)",
        meta: "Dec 2025",
        href: "https://courses.redteamleaders.com/exam-completion/4b6458728d78b339"
    },
    {
        title: "Microsoft: Student SOC Program Foundations",
        meta: "Dec 2025"
    },
    {
        title: "HP LIFE: Data Science & Analytics",
        meta: "Nov 2025",
        href: "https://www.life-global.org/certificate/cf5a824e-9321-4809-a5ce-f7a370c78b9c"
    },
    {
        title: "Oxford ELLT: English Language Level Test (CEFR C1)",
        meta: "Jun 2025"
    },
    {
        title: "LanguageCert: ESOL International B2 (Listening, Reading, Writing)",
        meta: "May 2025"
    },
    {
        title: "LanguageCert: ESOL International B2 (Speaking)",
        meta: "May 2025"
    },
    {
        title: "Scrimba: Frontend Career Path",
        meta: "Mar 2018"
    }
];

export const marqueeItems: string[] = [
    "React", "Next.js", "Angular", "TypeScript", "Node.js", "C#", ".NET",
    "ASP.NET Core", "Blazor", "Module Federation", "Redux Toolkit", "SQL Server",
    "PostgreSQL", "GraphQL", "AWS", "Azure DevOps", "Docker", "Tailwind CSS",
    "Playwright", "Azure OpenAI"
];

export const stats: Stat[] = [
    { number: "8", label: "Years of Experience" },
    { number: "5", label: "Years Fully Remote" },
    { number: "10+", label: "Government Entities Served" },
    { number: "27", label: "Junior Developers Mentored" }
];
