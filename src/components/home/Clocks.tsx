"use client";

import { useEffect, useState } from 'react';
import { jobs } from '@/lib/data';

// Time zone per role location. Benington is listed only as "Canada"; Eastern Time is assumed.
const ZONES: Record<string, string> = {
  Canada: 'America/Toronto',
  'Doha, Qatar': 'Asia/Qatar',
  'London, United Kingdom': 'Europe/London',
  'Bavaria, Germany': 'Europe/Berlin',
  'Palo Alto, United States': 'America/Los_Angeles',
  'Karachi, Pakistan': 'Asia/Karachi',
};

const timeIn = (zone: string) => new Date().toLocaleTimeString('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit' });

/** The teams behind the six roles, each with its local time right now. With onPick, a team opens its role. */
export default function Clocks({ onPick }: { onPick?: (index: number) => void }) {
  const [, setTick] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const update = () => { setLive(true); setTick((n) => n + 1); };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <ul className="hx-clocks hx-rv">
      <li className="is-home">
        <span className="hx-cap">I am in</span>
        <strong>Lahore</strong>
        <time suppressHydrationWarning>{live ? timeIn('Asia/Karachi') : '--:--'}</time>
      </li>
      {jobs.map((job, i) => {
        const cell = (
          <>
            <span className="hx-cap">{job.company}</span>
            <strong>{job.location.split(',')[0]}</strong>
            <time suppressHydrationWarning>{live ? timeIn(ZONES[job.location]) : '--:--'}</time>
          </>
        );
        return (
          <li key={job.id}>
            {onPick ? <button type="button" onClick={() => onPick(i)} aria-label={`${job.company}: show this role`}>{cell}</button> : cell}
          </li>
        );
      })}
    </ul>
  );
}
