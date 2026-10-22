import { Children, cloneElement, isValidElement, type ComponentType, type ReactElement } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PageFrame from './PageFrame';
import ShareArticle from './ShareArticle';
import VirtualRows from './lab/VirtualRows';
import ThreatFeed from './lab/ThreatFeed';
import AccessTiers from './lab/AccessTiers';
import FailSmall from './lab/FailSmall';
import PageVitals from './lab/PageVitals';
import { profile } from '@/lib/data';
import { articles, type Article } from '@/lib/articles';
import { faqJsonLd } from '@/lib/seo';

// The lab demo that matches each article, with the instruction the lab page gives for it
const demos: Record<string, { Demo: ComponentType; hint: string }> = {
  'react-table-virtualization-20000-rows': { Demo: VirtualRows, hint: 'Filter, scroll, then switch virtualization off.' },
  'real-time-dashboard-react-websocket': { Demo: ThreatFeed, hint: 'A simulated feed: raise the rate and watch the counters, chart and log stay in step.' },
  'role-based-access-control-data-redaction-dotnet': { Demo: AccessTiers, hint: 'Change the tier and watch what the response leaves out.' },
  'module-federation-micro-frontends-react': { Demo: FailSmall, hint: 'Each section sits behind its own error boundary. Break one and use the others.' },
  'core-web-vitals-react-lcp-code-splitting': { Demo: PageVitals, hint: 'The same metrics for the page you are on, read live from your browser.' },
};

const anchor = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const date = (iso: string) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const articleMetadata = (a: Article): Metadata => ({
  // No site suffix: the titles are long enough on their own
  title: { absolute: a.title },
  description: a.description,
  alternates: { canonical: `/articles/${a.slug}`, types: { 'application/rss+xml': '/feed.xml' } },
  openGraph: { type: 'article', title: a.title, description: a.description, url: `/articles/${a.slug}`, publishedTime: a.published, modifiedTime: a.updated, authors: [profile.name], images: ['/opengraph-image'] },
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
        dateModified: a.updated ?? a.published,
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

  // Every plain-text h2 in the body gets an id, so the contents list and search results can link to it
  const contents: [string, string][] = [];
  const body = Children.map(children, (child) => {
    if (!isValidElement(child) || child.type !== 'h2') return child;
    const h2 = child as ReactElement<{ children?: unknown; id?: string }>;
    if (typeof h2.props.children !== 'string') return child;
    const id = anchor(h2.props.children);
    contents.push([id, h2.props.children]);
    return cloneElement(h2, { id });
  });
  const demo = demos[a.slug];

  return (
    <PageFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      {a.faq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(a.faq) }} />}
      <article className="hx-study">
        <header className="hx-head">
          <nav aria-label="Breadcrumb" className="hx-cap hx-crumbs">
            <Link href="/">{profile.name}</Link> / <Link href="/articles">Articles</Link>
          </nav>
          <h1 className="hx-article-title">{a.title}</h1>
          <p>{a.description}</p>
          <p className="hx-cap">By {profile.name} · <time dateTime={a.published}>{date(a.published)}</time>{a.updated && <> · Updated <time dateTime={a.updated}>{date(a.updated)}</time></>} · {a.minutes} min read</p>
          <ShareArticle url={url} title={a.title} />
        </header>
        {contents.length > 2 && (
          <nav className="hx-toc hx-card" aria-label="On this page">
            <p className="hx-cap">On this page</p>
            <ol>
              {contents.map(([id, text]) => <li key={id}><a href={`#${id}`}>{text}</a></li>)}
              {demo && <li><a href="#try-it">Try it live</a></li>}
            </ol>
          </nav>
        )}
        <div className="hx-prose">{body}</div>
        {demo && (
          <section className="hx-lab" id="try-it">
            <div>
              <p className="hx-cap">Live demo</p>
              <h2>Try it live</h2>
              <p>{demo.hint} <Link href="/lab">All five demos</Link>.</p>
            </div>
            <demo.Demo />
          </section>
        )}
        {a.faq && (
          <section className="hx-lab">
            <div>
              <p className="hx-cap">Quick answers</p>
              <h2>The short version</h2>
            </div>
            <div className="hx-qa hx-card">
              {a.faq.map(([question, answer], i) => (
                <details key={question} open={i === 0}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
        <section className="hx-lab">
          <div>
            <p className="hx-cap">Keep reading</p>
            <h2>More articles</h2>
          </div>
          <div className="hx-facts hx-card">
            <ol>
              {articles.filter((other) => other.slug !== a.slug).map((other) => (
                <li key={other.slug} className="hx-go">
                  <strong><Link className="hx-go-link" href={`/articles/${other.slug}`}>{other.title}</Link></strong>
                  <span>{other.description}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
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
