import type { MetadataRoute } from "next";
import { profile } from "@/lib/data";
import { caseStudies } from "@/lib/case-studies";

// Home plus one URL per case study; section anchors (#about etc.) are not separate URLs.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${profile.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudies.map((study) => ({
      url: `${profile.url}/work/${study.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
