import type { MetadataRoute } from "next";
import { profile } from "@/lib/data";
import { articles } from "@/lib/articles";
import { caseStudies } from "@/lib/case-studies";

// Section anchors are not separate URLs. Use reviewed content dates for lastModified,
// rather than a timestamp that changes on every build.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${profile.url}/`,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { en: `${profile.url}/`, ar: `${profile.url}/ar` } },
    },
    {
      url: `${profile.url}/work`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    ...["about", "hire", "lab", "ar", "frontend-developer", "dotnet-developer", "ai-engineer", "azure-developer", "certifications", "articles"].map((page) => ({
      url: `${profile.url}/${page}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${profile.url}/articles/${a.slug}`,
      lastModified: new Date(a.updated ?? a.published),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    ...caseStudies.map((study) => ({
      url: `${profile.url}/work/${study.slug}`,
      ...(study.updated && { lastModified: new Date(study.updated) }),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
