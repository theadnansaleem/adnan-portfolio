import type { Metadata } from 'next';
import PageFrame from '@/components/home/PageFrame';
import { pageJsonLd } from '@/lib/seo';
import FitMatcher from '@/components/home/FitMatcher';
import { jobs, profile, stats } from '@/lib/data';

const TITLE = 'Hire me: the short version for recruiters';
const DESCRIPTION = 'Role, availability, location, work history at a glance, and a tool that checks a job description against my stack.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/hire' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/hire', images: ['/opengraph-image'] },
};

const FACTS = [
  ['Role', profile.jobTitle],
  ['Availability', profile.availability],
  ['Based in', profile.location],
  ['Time zone', 'Pakistan Standard Time, UTC+5'],
  ['Remote', 'Five years fully remote with US, UK and German teams'],
  ['Email', profile.email],
];

export default function HirePage() {
  return (
    <PageFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageJsonLd('/hire', 'Hire', DESCRIPTION) }} />
      <header className="hx-head">
        <p className="hx-cap"><b>Hire</b> For recruiters and hiring managers</p>
        <h1>The two-minute <em>version</em></h1>
        <p>{profile.summary[0]}</p>
        <div className="hx-actions">
          <a className="hx-pill is-solid is-big" href={profile.resume} target="_blank" rel="noopener noreferrer">Download CV ↓</a>
          {profile.booking && <a className="hx-pill is-big" href={profile.booking} target="_blank" rel="noopener noreferrer">Book a call ↗</a>}
          <a className="hx-pill is-big" href={`mailto:${profile.email}`}>Email me</a>
          <a className="hx-pill is-big" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </div>
      </header>

      <section className="hx-grid-2">
        <dl className="hx-facts hx-card">
          {FACTS.map(([term, value]) => <div key={term}><dt className="hx-cap">{term}</dt><dd>{value}</dd></div>)}
        </dl>
        <div className="hx-facts hx-card">
          <p className="hx-cap">Work history</p>
          <ol>
            {jobs.map((job) => (
              <li key={job.id}><strong>{job.role}</strong><span>{job.company} · {job.location}</span><span className="hx-cap">{job.period}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <dl className="hx-stats hx-card">
        {stats.map((stat) => <div key={stat.label}><dt>{stat.number}</dt><dd>{stat.label}</dd></div>)}
      </dl>

      <section className="hx-lab is-stacked">
        <div>
          <p className="hx-cap"><b>Fit check</b> Runs in your browser</p>
          <h2>Paste your job description</h2>
          <p>It lists which technologies in the role are on my CV, which are not, and the bullets where I used them.</p>
        </div>
        <FitMatcher />
      </section>
    </PageFrame>
  );
}
