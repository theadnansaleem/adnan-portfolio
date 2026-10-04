"use client";

import { useMemo, useState } from 'react';
import { jobs, skills } from '@/lib/data';

// "State Management (Redux, NgRx, React Query / TanStack Query)" yields each name on its own
// and "React 18" also answers to plain "React". A few spellings recruiters use are added by hand.
const MINE = [...new Set([
  ...skills.flatMap((group) => group.tags)
    .flatMap((tag) => tag.split(/[(),]| \/ | and /))
    .flatMap((t) => [t.trim(), t.trim().replace(/\s+\d+(\.\d+)?$/, '')])
    .filter((t) => t.length > 1),
  'Micro Frontends', 'Micro-frontends', 'Node', '.NET',
])];
// Well-known technology that is not on my CV, so the result can say so instead of hiding it
const NOT_MINE = ['Vue', 'Svelte', 'Java', 'Spring', 'Kotlin', 'Swift', 'Golang', 'Rust', 'Ruby', 'Rails', 'Django', 'Flask', 'Laravel', 'Scala', 'Elixir', 'Kafka', 'RabbitMQ', 'Elasticsearch', 'Snowflake', 'Oracle', 'DynamoDB', 'Cassandra', 'Ansible', 'Salesforce', 'SAP', 'Unity', 'Solidity', 'React Native', 'Remix', 'Nuxt', 'Astro', 'tRPC', 'Datadog'];

// Letters and digits on either side would mean a longer word, e.g. "Java" inside "JavaScript"
const mentions = (text: string, term: string) =>
  new RegExp(`(?<![a-z0-9])${term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z0-9])`).test(text);

const SAMPLE = 'We are hiring a Senior Full-Stack Engineer to build React and Next.js frontends with TypeScript, backed by .NET Core Web APIs and SQL Server. You will design micro frontends, improve Core Web Vitals, write tests with Jest and Playwright, and ship through Azure DevOps CI/CD. Experience with AWS, Docker and GraphQL is a plus. Kafka knowledge is nice to have.';

/** Compares a pasted job description with the skills on the CV. Runs in the browser only. */
export default function FitMatcher() {
  const [text, setText] = useState('');

  const result = useMemo(() => {
    const jd = text.toLowerCase();
    if (jd.trim().length < 40) return null;
    const matched = MINE.filter((term) => mentions(jd, term));
    const missing = NOT_MINE.filter((term) => mentions(jd, term));
    const total = matched.length + missing.length;
    // One CV bullet per matched skill, as evidence, without repeating a bullet
    const seen = new Set<string>();
    const evidence = matched.flatMap((term) => {
      for (const job of jobs) {
        const bullet = job.bullets.find((b) => mentions(b.toLowerCase(), term) && !seen.has(b));
        if (bullet) { seen.add(bullet); return [{ term, bullet, company: job.company }]; }
      }
      return [];
    }).slice(0, 4);
    return { matched, missing, evidence, score: total ? Math.round((matched.length / total) * 100) : 0 };
  }, [text]);

  return (
    <div className="hx-fit hx-card hx-rv">
      <div className="hx-fit-in">
        <label htmlFor="hx-jd" className="hx-cap">Job description</label>
        <textarea
          id="hx-jd"
          data-lenis-prevent
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the job description here…"
          rows={9}
        />
        <div className="hx-fit-tools">
          <button type="button" className="hx-pill" onClick={() => setText(SAMPLE)}>Try a sample</button>
          {text && <button type="button" className="hx-pill" onClick={() => setText('')}>Clear</button>}
          <span className="hx-cap">Nothing you paste leaves your browser</span>
        </div>
      </div>
      <div className="hx-fit-out" aria-live="polite">
        {!result ? (
          <p className="hx-fit-empty">Paste a role and this panel lists which of its technologies are on my CV, which are not, and where I used them.</p>
        ) : result.matched.length + result.missing.length === 0 ? (
          <p className="hx-fit-empty">No technology names recognised in that text. Try the full requirements section.</p>
        ) : (
          <>
            <div className="hx-fit-score">
              <strong>{result.score}%</strong>
              <span>{result.matched.length} of {result.matched.length + result.missing.length} technologies named in this role are on my CV</span>
            </div>
            <p className="hx-cap">On my CV</p>
            <ul className="hx-tags is-hit">{result.matched.map((t) => <li key={t}>{t}</li>)}</ul>
            {result.missing.length > 0 && (
              <>
                <p className="hx-cap">Asked for, not on my CV</p>
                <ul className="hx-tags">{result.missing.map((t) => <li key={t}>{t}</li>)}</ul>
              </>
            )}
            {result.evidence.length > 0 && (
              <>
                <p className="hx-cap">Where I used them</p>
                <ul className="hx-bullets">
                  {result.evidence.map((e) => <li key={e.bullet}>{e.bullet} <span className="hx-cap">{e.company}</span></li>)}
                </ul>
              </>
            )}
            <p className="hx-fit-note">A keyword comparison, not a verdict: it only counts technology names it recognises.</p>
          </>
        )}
      </div>
    </div>
  );
}
