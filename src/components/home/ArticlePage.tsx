import type { Metadata } from 'next';
import Link from 'next/link';
import PageFrame from './PageFrame';
import { profile } from '@/lib/data';
import type { Article } from '@/lib/articles';

const date = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const articleMetadata = (a: Article): Metadata => ({
  // No site suffix: the titles are long enough on their own
  title: { absolute: a.title },
  description: a.description,
  alternates: { canonical: `/articles/${a.slug}` },
  openGraph: { type: 'article', title: a.title, description: a.description, url: `/articles/${a.slug}`, publishedTime: a.published, authors: [profile.name], images: ['/opengraph-image'] },
});

/** Frame for one article: heading, byline, body, and a pointer to the matching case study. */
export default function ArticlePage({ article: a, children }: { article: Article; children: React.ReactNode }) {
  const url = `${profile.url}/articles/${a.slug}`;
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        headline: a.title,
        description: a.description,
        datePublished: a.published,
        dateModified: a.published,
        inLanguage: 'en',
        author: { '@id': `${profile.url}/#person` },
        publisher: { '@id': `${profile.url}/#person` },
        mainEntityOfPage: url,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: profile.name, item: `${profile.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Articles', item: `${profile.url}/articles` },
          { '@type': 'ListItem', position: 3, name: a.title, item: url },
        ],
      },
    ],
  }).replace(/</g, '\\u003c');

  return (
    <PageFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <article className="hx-study">
        <header className="hx-head">
          <nav aria-label="Breadcrumb" className="hx-cap hx-crumbs">
            <Link href="/">{profile.name}</Link> / <Link href="/articles">Articles</Link>
          </nav>
          <h1 className="hx-article-title">{a.title}</h1>
          <p>{a.description}</p>
          <p className="hx-cap">By {profile.name} · <time dateTime={a.published}>{date(a.published)}</time> · {a.minutes} min read</p>
        </header>
        <div className="hx-prose">{children}</div>
        <section className="hx-study-cta hx-card">
          <div>
            <p className="hx-cap">The project behind this</p>
            <h2>Read the case study</h2>
            <p>What I built, where, and the numbers that came out of it.</p>
          </div>
          <div className="hx-actions">
            <Link className="hx-pill is-solid is-big" href={`/work/${a.caseStudy}`}>Open the case study ↘</Link>
            <Link className="hx-pill is-big" href="/articles">All articles</Link>
          </div>
        </section>
      </article>
    </PageFrame>
  );
}
