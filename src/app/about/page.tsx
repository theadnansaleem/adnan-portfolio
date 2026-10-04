import type { Metadata } from 'next';
import Image from 'next/image';
import PageFrame from '@/components/home/PageFrame';
import Clocks from '@/components/home/Clocks';
import { ShareButton } from '@/components/home/AboutBits';
import { hxHand } from '@/components/home/fonts';
import { MOMENTS } from '@/components/home/photos';
import { education, jobs, profile } from '@/lib/data';
import { pageJsonLd } from '@/lib/seo';

const TITLE = 'About Adnan Saleem: the person behind the work';
const DESCRIPTION = 'Who M. Adnan Saleem is beyond the CV: where he is based, where he studied, the teams he has worked with, photos, and how to say hello.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/about', images: ['/opengraph-image'] },
};

const FACTS = [
  ['Home', 'Lahore, Pakistan'],
  ['Time zone', 'Pakistan Standard Time, UTC+5'],
  ['Studied', `${education[0].title}, ${education[0].issuer}`],
  ['Also studied', `${education[1].title}, ${education[1].issuer}`],
  ['English', 'CEFR C1, Oxford ELLT'],
  ['Relocation', 'Open to it'],
];

// Every answer restates something from the CV
const QUESTIONS = [
  ['Where are you based?', 'Lahore, Pakistan. I studied in Karachi, and my teams have been in Doha, London, Canada, Bavaria and Palo Alto.'],
  ['Would you move for the right thing?', 'Yes. I am open to relocation, and the Arabic version of this site is there for the Gulf.'],
  ['How is your English?', 'CEFR C1 on the Oxford ELLT, and five years of daily work with US, UK and German teams.'],
  ['What did you study?', `${education[0].title} at ${education[0].issuer} in Karachi, then an ${education[1].title} from ${education[1].issuer} in London, finished in April 2025 while working full time.`],
  ['What are you like to work with?', 'I lead code reviews and have mentored 27 junior developers.'],
  ['What is the quickest way to reach you?', `Email ${profile.email}, or message me on LinkedIn.`],
];

export default function AboutPage() {
  return (
    <PageFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageJsonLd('/about', 'About', DESCRIPTION, 'AboutPage') }} />
      <header className="hx-head">
        <p className="hx-cap"><b>About</b> The person</p>
        <h1>More than a <em>CV</em></h1>
        <p>Based in Lahore, five years fully remote, and open to relocation. This page is the part a CV has no room for.</p>
        <div className="hx-actions">
          <a className="hx-pill is-solid is-big" href={`mailto:${profile.email}`}>Say hello</a>
          <a className="hx-pill is-big" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a className="hx-pill is-big" href="/adnan-saleem.vcf" download>Save my contact ↓</a>
        </div>
      </header>

      <section className={hxHand}>
        <p className="hx-cap"><b>01</b> Off the clock</p>
        <h2 className="hx-moments-title">Conferences, coffee and the <em>odd lake</em></h2>
        <ul className="hx-moments">
          {MOMENTS.map((moment) => (
            <li key={moment.file}>
              <figure>
                <Image src={`/me/m/${moment.file}.webp`} alt={moment.alt} width={720} height={moment.height} unoptimized />
                <figcaption>
                  {/* Hand-drawn arrow that keeps nudging up at the photo */}
                  <svg viewBox="0 0 48 56" aria-hidden="true">
                    <path d="M40 52C22 50 10 38 14 10" />
                    <path d="M4 20 14 8l9 13" />
                  </svg>
                  <span>{moment.note}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className="hx-grid-2">
        <dl className="hx-facts hx-card">
          {FACTS.map(([term, value]) => <div key={term}><dt className="hx-cap">{term}</dt><dd>{value}</dd></div>)}
        </dl>
        <div className="hx-facts hx-card">
          <p className="hx-cap">The route so far</p>
          <ol>
            <li><strong>{education[0].title}</strong><span>{education[0].issuer} · Karachi, Pakistan</span><span className="hx-cap">Feb 2014 - May 2018</span></li>
            {[...jobs].reverse().map((job) => (
              <li key={job.id}><strong>{job.company}</strong><span>{job.role} · {job.location}</span><span className="hx-cap">{job.period}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <p className="hx-cap"><b>02</b> Where my teams are right now</p>
        <Clocks />
      </section>

      <section className="hx-lab">
        <div>
          <p className="hx-cap"><b>03</b> Quick answers</p>
          <h2>Things people ask first</h2>
          <p>Short answers. Anything else, ask me directly.</p>
        </div>
        <div className="hx-qa hx-card">
          {QUESTIONS.map(([question, answer], i) => (
            <details key={question} open={i === 0}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="hx-study-cta hx-card">
        <div>
          <p className="hx-cap">Say hello</p>
          <h2>Not here about a job? Write anyway</h2>
          <p>A question, an idea, or just a hello.</p>
        </div>
        <div className="hx-actions">
          <a className="hx-pill is-solid is-big" href={`mailto:${profile.email}`}>Email me</a>
          {profile.booking && <a className="hx-pill is-big" href={profile.booking} target="_blank" rel="noopener noreferrer">Book a call ↗</a>}
          <ShareButton />
        </div>
      </section>
    </PageFrame>
  );
}
