import type { MetadataRoute } from "next";
import { profile } from "@/lib/data";

// Single page site: section anchors (#about etc.) are not separate URLs to crawlers.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${profile.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
