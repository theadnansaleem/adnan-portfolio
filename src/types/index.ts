export interface Job {
    id: number;
    period: string;
    company: string;
    role: string;
    description: string;
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
    href: string;
    image?: string;
}

export interface SkillCategory {
    category: string;
    tags: string[];
}

export interface SkillBar {
    label: string;
    value: number;
}

export interface Stat {
    number: string;
    label: string;
}

export interface Credential {
    title: string;
    issuer: string;
    meta: string;
}
