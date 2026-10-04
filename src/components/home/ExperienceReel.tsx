"use client";

import { useEffect, useRef, useState } from 'react';
import { jobs } from '@/lib/data';

/**
 * Experience as a scrubbed sequence: on wide screens the section pins and each
 * role takes the stage in turn as the page scrolls, like frames of a film.
 * On small screens, or with reduced motion, every role is simply listed.
 */
export default function ExperienceReel() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const box = el.getBoundingClientRect();
      const run = box.height - window.innerHeight;
      if (run <= 0) return;
      const progress = Math.min(Math.max(-box.top / run, 0), 0.9999);
      el.style.setProperty('--reel', progress.toFixed(4));
      setActive(Math.floor(progress * jobs.length));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const [from, to] = jobs[active].period.split(' - ');

  return (
    <div className="hx-reel" ref={ref} style={{ '--roles': jobs.length } as React.CSSProperties}>
      <div className="hx-reel-pin">
        <div className="hx-reel-side" aria-hidden="true">
          <p className="hx-cap">Role {String(active + 1).padStart(2, '0')} / {String(jobs.length).padStart(2, '0')}</p>
          {/* key restarts the rise animation every time the role changes */}
          <p className="hx-reel-year" key={active}><span>{to}</span><small>from {from}</small></p>
          <ol className="hx-reel-dots">
            {jobs.map((job, i) => <li key={job.id} className={i === active ? 'is-on' : i < active ? 'is-done' : undefined}>{job.company}</li>)}
          </ol>
          <div className="hx-reel-bar"><i /></div>
        </div>
        <ol className="hx-reel-cards">
          {jobs.map((job, i) => (
            <li key={job.id} className={`hx-card${i === active ? ' is-on' : ''}`}>
              <p className="hx-cap">{job.period} · {job.workMode}</p>
              <h3>{job.company}</h3>
              <p className="hx-reel-role">{job.role} · {job.location}</p>
              <ul className="hx-bullets">
                {job.bullets.map((bullet, n) => <li key={bullet} style={{ '--i': n } as React.CSSProperties}>{bullet}</li>)}
              </ul>
              <ul className="hx-tags">{job.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
