import type { Metadata } from 'next';
import Link from 'next/link';
import PageFrame from '@/components/home/PageFrame';
import { articles } from '@/lib/articles';
import { pageJsonLd } from '@/lib/seo';

const TITLE = 'Articles: micro frontends, React performance and legacy migration';
const DESCRIPTION = 'Practical write-ups by M. Adnan Saleem on Module Federation micro frontends, rendering large tables in React, and migrating Visual FoxPro systems to .NET.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/articles' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/articles', images: ['/opengraph-image'] },
};

export default function ArticlesPage() {
  return (
    <PageFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageJsonLd('/articles', 'Articles', DESCRIPTION, 'CollectionPage') }} />
      <header className="hx-head">
        <p className="hx-cap"><b>Articles</b> How the work was done</p>
        <h1>Things I can <em>explain</em></h1>
        <p>Each one is the method behind a line on my CV, written so you can use it.</p>
      </header>
      <div className="hx-facts hx-card">
        <ol className="hx-role">
          {articles.map((a) => (
            <li key={a.slug}>
              <strong><Link href={`/articles/${a.slug}`}>{a.title}</Link></strong>
              <span>{a.description}</span>
              <span className="hx-cap">{a.minutes} min read</span>
            </li>
          ))}
        </ol>
      </div>
    </PageFrame>
  );
}
