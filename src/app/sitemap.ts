import type { MetadataRoute } from "next";
import { profile } from "@/lib/data";
import { articles } from "@/lib/articles";
import { caseStudies } from "@/lib/case-studies";

// Home plus one URL per case study; section anchors (#about etc.) are not separate URLs.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${profile.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { en: `${profile.url}/`, ar: `${profile.url}/ar` } },
    },
    {
      url: `${profile.url}/work`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    ...["about", "hire", "lab", "ar", "frontend-developer", "dotnet-developer", "articles"].map((page) => ({
      url: `${profile.url}/${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${profile.url}/articles/${a.slug}`,
      lastModified: new Date(a.published),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    ...caseStudies.map((study) => ({
      url: `${profile.url}/work/${study.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
