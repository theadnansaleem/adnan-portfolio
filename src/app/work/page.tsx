import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageFrame from "@/components/home/PageFrame";
import { caseStudies } from "@/lib/case-studies";
import { profile } from "@/lib/data";

const SITE_URL = profile.url;
const TITLE = "Case studies: government, fintech, cybersecurity";
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
    <PageFrame>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="hx-head">
        <nav aria-label="Breadcrumb" className="hx-cap hx-crumbs">
          <Link href="/">{profile.name}</Link> / <b>Case studies</b>
        </nav>
        <h1>Case <em>studies</em></h1>
        <p>Deeper write-ups of production work: the platforms, what I built, and the numbers from my CV.</p>
      </header>

      <ol className="hx-studies">
        {caseStudies.map((study, i) => (
          <li key={study.slug} className="hx-card hx-tilt">
            <Link href={`/work/${study.slug}`}>
              <span className="hx-serif hx-studies-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <span className="hx-cap">{study.company} · {study.period}</span>
                <h2>{study.title}</h2>
                <p>{study.description}</p>
                <span className="hx-pill">Read case study ↘</span>
              </div>
              {study.image && (
                <div className="hx-shot">
                  <Image src={study.image} alt="" fill sizes="(max-width: 1000px) 100vw, 420px" />
                </div>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </PageFrame>
  );
}
