import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, caseStudyBySlug } from "@/lib/case-studies";
import { profile } from "@/lib/data";

const SITE_URL = profile.url;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  if (!study) return {};

  return {
    title: study.metaTitle,
    description: study.description,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${study.slug}`,
      title: `${study.metaTitle} | ${profile.name}`,
      description: study.description,
    },
  };
}

const mono = {
  fontFamily: 'var(--font-mono, "DM Mono"), monospace',
  letterSpacing: "0.06em",
} as const;

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  if (!study) notFound();

  const others = caseStudies.filter((other) => other.slug !== study.slug);
  const pageUrl = `${SITE_URL}/work/${study.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: study.metaTitle,
        description: study.description,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#person` },
        author: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: profile.name, item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Case studies", item: `${SITE_URL}/work` },
          { "@type": "ListItem", position: 3, name: study.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <article
      style={{
        padding:
          "clamp(120px, 18vh, 200px) clamp(20px, 4vw, 48px) clamp(60px, 10vw, 120px)",
        maxWidth: "860px",
        margin: "0 auto",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav aria-label="Breadcrumb" style={{ ...mono, fontSize: "12px" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          {profile.name}
        </Link>
        <span style={{ color: "var(--muted)" }}> / </span>
        <Link href="/work" style={{ color: "var(--accent)", textDecoration: "none" }}>
          Case studies
        </Link>
      </nav>

      <h1
        style={{
          fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
          fontSize: "clamp(34px, 6vw, 64px)",
          lineHeight: 1,
          letterSpacing: "0.01em",
          margin: "28px 0 16px",
        }}
      >
        {study.title}
      </h1>

      <p style={{ ...mono, fontSize: "12px", color: "var(--muted)", margin: 0 }}>
        {study.role} · {study.company} · {study.period} · {study.location}
      </p>

      <p
        style={{
          fontSize: "clamp(15px, 2.5vw, 18px)",
          lineHeight: 1.8,
          opacity: "var(--dim)",
          margin: "32px 0 0",
        }}
      >
        {study.summary}
      </p>

      <h2
        style={{
          ...mono,
          fontSize: "11px",
          color: "var(--accent)",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          margin: "48px 0 20px",
        }}
      >
        What I did
      </h2>
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          paddingLeft: "18px",
          margin: 0,
          fontSize: "15px",
          lineHeight: 1.75,
          opacity: "var(--dim)",
          listStyle: "disc",
        }}
      >
        {study.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2
        style={{
          ...mono,
          fontSize: "11px",
          color: "var(--accent)",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          margin: "48px 0 20px",
        }}
      >
        Stack
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {study.stack.map((tag) => (
          <span
            key={tag}
            style={{
              ...mono,
              fontSize: "11px",
              padding: "4px 12px",
              border: "1px solid var(--chip-line)",
              background: "var(--chip-bg)",
              color: "var(--muted)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {others.length > 0 && (
        <>
          <h2
            style={{
              ...mono,
              fontSize: "11px",
              color: "var(--accent)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              margin: "48px 0 20px",
            }}
          >
            More case studies
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/work/${other.slug}`}
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "var(--text)",
                  opacity: "var(--dim)",
                  textDecoration: "none",
                  borderLeft: "1px solid var(--border)",
                  paddingLeft: "16px",
                }}
              >
                {other.title} →
              </Link>
            ))}
          </div>
        </>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          alignItems: "center",
          marginTop: "48px",
          paddingTop: "24px",
          borderTop: "1px solid var(--border)",
        }}
      >
        {study.live && (
          <a
            href={study.live}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...mono,
              fontSize: "12px",
              color: "var(--accent)",
              textDecoration: "none",
              borderBottom: "1px solid var(--accent-soft-line)",
              paddingBottom: "2px",
            }}
          >
            Visit {new URL(study.live).hostname} ↗
          </a>
        )}
        <Link
          href="/"
          style={{
            ...mono,
            fontSize: "12px",
            color: "var(--muted)",
            textDecoration: "none",
          }}
        >
          ← {profile.name}
        </Link>
      </div>
    </article>
  );
}
