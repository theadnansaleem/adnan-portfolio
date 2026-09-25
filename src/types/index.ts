export interface Job {
    id: number;
    period: string;
    company: string;
    role: string;
    location: string;
    workMode: string;
    bullets: string[];
    tags: string[];
}

export interface Project {
    id: number;
    number: string;
    featured: boolean;
    title: string;
    description: string;
    tags: string[];
    gradient: string;
    href?: string;
    image?: string;
    caseStudy?: string;
}

export interface SkillCategory {
    category: string;
    tags: string[];
}

export interface Stat {
    number: string;
    label: string;
}

export interface Credential {
    title: string;
    issuer?: string;
    meta: string;
    href?: string;
}

export interface CaseStudy {
    slug: string;
    title: string;
    metaTitle: string;
    description: string;
    summary: string;
    highlights: string[];
    stack: string[];
    live?: string;
    image?: string;
    company: string;
    role: string;
    period: string;
    location: string;
}
