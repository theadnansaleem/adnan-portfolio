import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageFrame from '@/components/home/PageFrame';
import { certifications, education, profile } from '@/lib/data';
import { credentialJsonLd, faqJsonLd, pageJsonLd } from '@/lib/seo';

const TITLE = 'Certifications: Microsoft Azure AI and Cisco';
const DESCRIPTION = `The ${certifications.length} certifications held by M. Adnan Saleem, from Microsoft, Cisco and others, each with its date and a link to the issuer's record where one exists.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/certifications' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/certifications', images: ['/opengraph-image'] },
};

const verifiable = certifications.filter((cert) => cert.href).length;

// Every answer restates the list above it
const FAQ = [
  ['Which Microsoft certification do you hold?', `${certifications[0].title}, earned in ${certifications[0].meta}. The link on its card opens Microsoft's own record of it.`],
  ['Can these certifications be verified?', `${verifiable} of the ${certifications.length} link to the issuer's public record. The others have no public record page.`],
  ['What is your level of English?', 'CEFR C1 on the Oxford ELLT (June 2025), and LanguageCert ESOL International B2 in listening, reading, writing and speaking (May 2025).'],
  ['What did you study?', education.map((item) => `${item.title} at ${item.issuer}`).join(', and a ') + '.'],
];

export default function CertificationsPage() {
  const list = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITLE,
    itemListElement: certifications.map((cert, i) => ({ '@type': 'ListItem', position: i + 1, item: credentialJsonLd(cert) })),
  }).replace(/</g, '\\u003c');

  return (
    <PageFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageJsonLd('/certifications', 'Certifications', DESCRIPTION, 'CollectionPage') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: list }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(FAQ) }} />
      <header className="hx-head">
        <nav aria-label="Breadcrumb" className="hx-cap hx-crumbs">
          <Link href="/">{profile.name}</Link> / <b>Certifications</b>
        </nav>
        <h1>Certified, and <em>checkable</em></h1>
        <p>{certifications.length} certifications, newest first. {verifiable} link straight to the issuer&apos;s record, so you do not have to take my word for them.</p>
      </header>

      <ul className="hx-grid-3 hx-certgrid">
        {certifications.map((cert) => (
          <li key={cert.title} className="hx-card">
            {cert.image && <Image src={cert.image} alt={`${cert.title} certificate`} width={672} height={352} sizes="(max-width: 760px) 100vw, 400px" />}
            <h2>{cert.title}</h2>
            <p>{cert.issuer}</p>
            <p className="hx-cap">
              <b>{cert.meta}</b>{' '}
              {cert.href && <a className="hx-out" href={cert.href} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${cert.title}`}>Verify</a>}
            </p>
          </li>
        ))}
      </ul>

      <section className="hx-lab">
        <div>
          <p className="hx-cap"><b>Quick answers</b></p>
          <h2>Asked before you ask</h2>
        </div>
        <div className="hx-qa hx-card">
          {FAQ.map(([question, answer], i) => (
            <details key={question} open={i === 0}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="hx-study-cta hx-card">
        <div>
          <p className="hx-cap">Beyond the certificates</p>
          <h2>See the work itself</h2>
          <p>Eight years of production platforms for government, fintech and cybersecurity clients.</p>
        </div>
        <div className="hx-actions">
          <Link className="hx-pill is-solid is-big" href="/work">Read the case studies ↘</Link>
          <Link className="hx-pill is-big" href="/azure-developer">Azure developer</Link>
          <Link className="hx-pill is-big" href="/ai-engineer">AI engineer</Link>
        </div>
      </section>
    </PageFrame>
  );
}
