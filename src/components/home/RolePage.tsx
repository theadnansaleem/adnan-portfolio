import type { Metadata } from 'next';
import Link from 'next/link';
import PageFrame from './PageFrame';
import { profile } from '@/lib/data';
import { roleEvidence, roleSkills, roleStudies, type Role } from '@/lib/roles';
import { faqJsonLd, pageJsonLd } from '@/lib/seo';

export const roleMetadata = (role: Role): Metadata => ({
  title: role.title,
  description: role.description,
  alternates: { canonical: role.path },
  openGraph: { title: role.title, description: role.description, url: role.path, images: ['/opengraph-image'] },
});

/** One role, shown through the CV bullets, skills and case studies that match it. Children sit under the header. */
export default function RolePage({ role, children }: { role: Role; children?: React.ReactNode }) {
  const [before, strong, after] = role.heading;
  return (
    <PageFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageJsonLd(role.path, role.name, role.description) }} />
      {role.faq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(role.faq) }} />}
      <header className="hx-head">
        <p className="hx-cap"><b>{role.name}</b> {profile.availability}</p>
        <h1>{before} <em>{strong}</em> {after}</h1>
        <p>{role.lead}</p>
        <div className="hx-actions">
          <a className="hx-pill is-solid is-big" href={profile.resume} target="_blank" rel="noopener noreferrer">Download CV ↓</a>
          {profile.booking && <a className="hx-pill is-big" href={profile.booking} target="_blank" rel="noopener noreferrer">Book a call ↗</a>}
          <a className="hx-pill is-big" href={`mailto:${profile.email}`}>Email me</a>
          <a className="hx-pill is-big" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </div>
      </header>

      {children}

      <section className="hx-lab">
        <div>
          <p className="hx-cap"><b>01</b> Experience</p>
          <h2>What I did, by team</h2>
          <p>Taken from my CV. Only the work that belongs to this role is listed.</p>
        </div>
        <div className="hx-facts hx-card">
          <ol className="hx-role">
            {roleEvidence(role).map(({ job, bullets }) => (
              <li key={job.id}>
                <strong>{job.company}</strong>
                <span className="hx-cap">{job.role} · {job.period}</span>
                {bullets.map((bullet) => <span key={bullet}>{bullet}</span>)}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hx-lab">
        <div>
          <p className="hx-cap"><b>02</b> Skills</p>
          <h2>What I work with</h2>
        </div>
        <div className="hx-facts hx-card">
          <ol>
            {roleSkills(role).map((group) => (
              <li key={group.category}>
                <span className="hx-cap">{group.category}</span>
                <span>{group.tags.join(' · ')}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hx-lab">
        <div>
          <p className="hx-cap"><b>03</b> Case studies</p>
          <h2>The work in detail</h2>
        </div>
        <div className="hx-facts hx-card">
          <ol>
            {roleStudies(role).map((study) => (
              <li key={study.slug} className="hx-go">
                <strong><Link className="hx-go-link" href={`/work/${study.slug}`}>{study.title}</Link></strong>
                <span>{study.summary}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {role.faq && (
        <section className="hx-lab">
          <div>
            <p className="hx-cap"><b>04</b> Quick answers</p>
            <h2>Asked before you ask</h2>
          </div>
          <div className="hx-qa hx-card">
            {role.faq.map(([question, answer], i) => (
              <details key={question} open={i === 0}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="hx-study-cta hx-card">
        <div>
          <p className="hx-cap">Hiring for this role?</p>
          <h2>Check the fit in ten seconds</h2>
          <p>Paste your job description and see which of its technologies are on my CV.</p>
        </div>
        <div className="hx-actions">
          <Link className="hx-pill is-solid is-big" href="/hire">Open the recruiter page ↘</Link>
          <Link className="hx-pill is-big" href="/work">All case studies</Link>
        </div>
      </section>
    </PageFrame>
  );
}
