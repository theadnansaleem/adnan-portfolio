import { card } from "@/app/og/card";
import { caseStudies, caseStudyBySlug } from "@/lib/case-studies";
import { notFound } from "next/navigation";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  if (!study) notFound();
  return card("Case study", study.title, study.company);
}
