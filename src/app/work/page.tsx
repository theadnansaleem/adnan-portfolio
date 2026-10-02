import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/lib/case-studies";
import { profile } from "@/lib/data";

const SITE_URL = profile.url;
const TITLE = "Case studies: government, fintech and cybersecurity platforms";
const DESCRIPTION =
  "Case studies by M. Adnan Saleem: Module Federation micro frontends, the Hayya eVisa platform, React performance, a Visual FoxPro to .NET migration, and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: "/work",
    title: `${TITLE} | ${profile.name}`,
    description: DESCRIPTION,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: profile.name }],
  },
};

const mono = {
  fontFamily: 'var(--font-mono, "DM Mono"), monospace',
  letterSpacing: "0.06em",
} as const;

export default function WorkIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/work#webpage`,
        url: `${SITE_URL}/work`,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#person` },
        hasPart: caseStudies.map((study) => ({
          "@type": "WebPage",
          "@id": `${SITE_URL}/work/${study.slug}#webpage`,
          url: `${SITE_URL}/work/${study.slug}`,
          name: study.metaTitle,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/work#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: profile.name, item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Case studies", item: `${SITE_URL}/work` },
        ],
      },
    ],
  };

  return (
    <div
      style={{
        padding: "clamp(120px, 18vh, 200px) clamp(20px, 4vw, 48px) clamp(60px, 10vw, 120px)",
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
        <span style={{ color: "var(--muted)" }}> / Case studies</span>
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
        Case studies
      </h1>

      <p
        style={{
          fontSize: "clamp(15px, 2.5vw, 18px)",
          lineHeight: 1.8,
          opacity: "var(--dim)",
          margin: "0 0 48px",
        }}
      >
        Deeper write-ups of production work: the platforms, what I built, and the numbers from my CV.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            href={`/work/${study.slug}`}
            style={{
              display: "block",
              border: "1px solid var(--border)",
              background: "var(--glass)",
              padding: "clamp(20px, 3vw, 32px)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
                fontSize: "clamp(20px, 3vw, 28px)",
                letterSpacing: "0.03em",
                lineHeight: 1.1,
                margin: "0 0 10px",
              }}
            >
              {study.title}
            </h2>
            <p style={{ ...mono, fontSize: "11px", color: "var(--muted)", margin: "0 0 12px" }}>
              {study.company} · {study.period}
            </p>
            <p style={{ fontSize: "14px", lineHeight: 1.7, opacity: "var(--dim)", margin: 0 }}>
              {study.description}
            </p>
            <span
              style={{
                ...mono,
                fontSize: "12px",
                color: "var(--accent)",
                display: "inline-block",
                marginTop: "16px",
              }}
            >
              Read case study →
            </span>
          </Link>
        ))}
      </div>

      <Link
        href="/"
        style={{
          ...mono,
          fontSize: "12px",
          color: "var(--muted)",
          textDecoration: "none",
          display: "inline-block",
          marginTop: "48px",
        }}
      >
        ← {profile.name}
      </Link>
    </div>
  );
}
