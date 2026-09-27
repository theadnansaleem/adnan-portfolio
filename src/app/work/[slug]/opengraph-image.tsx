import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { caseStudies, caseStudyBySlug } from "@/lib/case-studies";
import { profile } from "@/lib/data";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

// Satori mis-measures hyphenated words, so each word is laid out as its own box.
function Words({ text, gap }: { text: string; gap: number }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap }}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} style={{ display: "flex" }}>
          {word.split(/(-)/).map((part, j) => (
            <span key={j}>{part}</span>
          ))}
        </span>
      ))}
    </div>
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  const bebas = await readFile(join(process.cwd(), "src/app/og/bebas-neue.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#050505",
          color: "#f0f0f0",
          fontFamily: "Bebas Neue",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 30,
            letterSpacing: 6,
          }}
        >
          <div style={{ width: 48, height: 2, background: "#e8ff47" }} />
          <span style={{ color: "#e8ff47" }}>Case study</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.05 }}>
          <Words text={study ? study.title : profile.jobTitle} gap={18} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 30,
            letterSpacing: 3,
            color: "#8a8a8a",
          }}
        >
          <span>{study ? study.company : profile.name}</span>
          <span style={{ color: "#e8ff47" }}>theadnansaleem.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bebas Neue", data: bebas, style: "normal", weight: 400 }],
    },
  );
}
