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
    /** Picture of the certificate, under /public */
    image?: string;
    /** The same certificate on a dark background, shown on the dark theme */
    imageDark?: string;
    /** One or two sentences about the credential, from the CV */
    detail?: string;
    /** What the exam validates, from the CV */
    validates?: string[];
}

export interface CaseStudy {
    slug: string;
    title: string;
    metaTitle: string;
    description: string;
    summary: string;
    /** ISO date of the last substantial case-study revision, when reviewed. */
    updated?: string;
    highlights: string[];
    stack: string[];
    live?: string;
    image?: string;
    company: string;
    role: string;
    period: string;
    location: string;
}
