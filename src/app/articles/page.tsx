import type { Metadata } from 'next';
import Link from 'next/link';
import PageFrame from '@/components/home/PageFrame';
import { articles, topics } from '@/lib/articles';
import { profile } from '@/lib/data';
import { pageJsonLd } from '@/lib/seo';

const TITLE = 'Articles on React, .NET and Azure AI';
const DESCRIPTION = 'Practical write-ups by Adnan Saleem on React performance and micro frontends, ASP.NET Core and EF Core, RAG with Azure OpenAI, and Visual FoxPro migration.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/articles', types: { 'application/rss+xml': '/feed.xml' } },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/articles', images: ['/opengraph-image'] },
};

// The list of every article, so search engines see the whole index as one ordered set
const listJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${profile.url}/articles#list`,
  itemListElement: articles.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.title, url: `${profile.url}/articles/${a.slug}` })),
}).replace(/</g, '\\u003c');

// '.NET' becomes 'topic-net', not 'topic--net'
const anchor = (topic: string) => 'topic-' + topic.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');

export default function ArticlesPage() {
  return (
    <PageFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageJsonLd('/articles', 'Articles', DESCRIPTION, 'CollectionPage') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: listJsonLd }} />
      <header className="hx-head">
        <p className="hx-cap"><b>Articles</b> How the work was done</p>
        <h1>Things I can <em>explain</em></h1>
        <p>Each one is the method behind a line on my CV, written so you can use it. {articles.length} articles in {topics.length} topics.</p>
      </header>
      {topics.map((topic) => {
        const group = articles.filter((a) => a.topic === topic);
        if (group.length === 0) return null;
        return (
          <section key={topic} className="hx-lab" aria-labelledby={anchor(topic)}>
            <div>
              <p className="hx-cap">{group.length} {group.length === 1 ? 'article' : 'articles'}</p>
              <h2 id={anchor(topic)}>{topic}</h2>
            </div>
            <div className="hx-facts hx-card">
              <ol className="hx-role">
                {group.map((a) => (
                  <li key={a.slug} className="hx-go">
                    <strong><Link className="hx-go-link" href={`/articles/${a.slug}`}>{a.title}</Link></strong>
                    <span>{a.description}</span>
                    <span className="hx-cap">{a.minutes} min read · {a.tags.slice(0, 4).join(' · ')}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        );
      })}
    </PageFrame>
  );
}
