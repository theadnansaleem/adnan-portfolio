import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageFrame from "@/components/home/PageFrame";
import { caseStudies, caseStudyBySlug } from "@/lib/case-studies";
import { articles } from "@/lib/articles";
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

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  if (!study) notFound();

  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const written = articles.filter((article) => article.caseStudy === study.slug);
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
    <PageFrame>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <article className="hx-study">
        <header className="hx-head">
          <nav aria-label="Breadcrumb" className="hx-cap hx-crumbs">
            <Link href="/">{profile.name}</Link> / <Link href="/work">Case studies</Link> / <b>{String(index + 1).padStart(2, "0")}</b>
          </nav>
          <h1>{study.title}</h1>
          <p>{study.summary}</p>
        </header>

        <dl className="hx-stats hx-card">
          <div><dt>{study.company}</dt><dd>Company</dd></div>
          <div><dt>{study.role}</dt><dd>Role</dd></div>
          <div><dt>{study.period}</dt><dd>Period</dd></div>
          <div><dt>{study.location}</dt><dd>Location</dd></div>
        </dl>

        {study.image && (
          <div className="hx-study-shot hx-card">
            <Image src={study.image} alt={`${study.title} screenshot`} fill sizes="(max-width: 1280px) 100vw, 1180px" priority />
          </div>
        )}

        <section className="hx-lab">
          <div>
            <p className="hx-cap"><b>01</b> The work</p>
            <h2>What I did</h2>
          </div>
          <ol className="hx-steps">
            {study.highlights.map((item, i) => (
              <li key={item} className="hx-card">
                <span className="hx-serif">{String(i + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="hx-lab">
          <div>
            <p className="hx-cap"><b>02</b> Tools</p>
            <h2>Stack</h2>
          </div>
          <ul className="hx-tags is-large">
            {study.stack.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        </section>

        {written.length > 0 && (
          <section className="hx-lab">
            <div>
              <p className="hx-cap"><b>03</b> Articles</p>
              <h2>How it was done</h2>
            </div>
            <div className="hx-facts hx-card">
              <ol>
                {written.map((article) => (
                  <li key={article.slug} className="hx-go">
                    <strong><Link className="hx-go-link" href={`/articles/${article.slug}`}>{article.title}</Link></strong>
                    <span>{article.description}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        <section className="hx-study-cta hx-card">
          <div>
            <p className="hx-cap">Work with me</p>
            <h2>Available immediately</h2>
            <p>Based in Lahore, Pakistan, open to remote work and relocation.</p>
          </div>
          <div className="hx-actions">
            <a className="hx-pill is-solid is-big" href={profile.resume} target="_blank" rel="noopener noreferrer">Download CV ↓</a>
            <a className="hx-pill is-big" href={`mailto:${profile.email}`}>Email me</a>
            <a className="hx-pill is-big" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            {study.live && (
              <a className="hx-pill is-big" href={study.live} target="_blank" rel="noopener noreferrer">
                Visit {new URL(study.live).hostname} ↗
              </a>
            )}
          </div>
        </section>

        <Link className="hx-next" href={`/work/${next.slug}`}>
          <span className="hx-cap">Next case study</span>
          <strong>{next.title} <span aria-hidden="true">→</span></strong>
        </Link>
      </article>
    </PageFrame>
  );
}
