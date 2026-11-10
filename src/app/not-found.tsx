import type { Metadata } from 'next';
import Link from 'next/link';
import PageFrame from '@/components/home/PageFrame';

// The root layout's canonical and robots values describe the home page, so they are cleared here
export const metadata: Metadata = { title: 'Page not found', robots: { index: false }, alternates: { canonical: null } };

export default function NotFound() {
  return (
    <PageFrame>
      <header className="hx-head">
        <p className="hx-cap"><b>404</b> Page not found</p>
        <h1>Nothing at this <em>address</em></h1>
        <p>This link is old or mistyped, so pick up from one of these pages.</p>
        <div className="hx-actions">
          <Link className="hx-pill is-solid is-big" href="/">Back to home</Link>
          <Link className="hx-pill is-big" href="/work">All case studies</Link>
          <Link className="hx-pill is-big" href="/articles">All articles</Link>
          <Link className="hx-pill is-big" href="/hire">Hire me</Link>
        </div>
      </header>
    </PageFrame>
  );
}
