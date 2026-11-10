import { card } from "@/app/og/card";
import { articles } from "@/lib/articles";
import { profile } from "@/lib/data";

export const alt = "Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

// The article pages are static folders beside this segment, so articleMetadata points each one here.
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articles.find((entry) => entry.slug === slug);
  return card(a ? a.topic : "Article", a ? a.title : profile.jobTitle, profile.name);
}
