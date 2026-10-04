"use client";

import { useEffect, useState } from 'react';
import { jobs } from '@/lib/data';

// Time zone per role location. Benington is listed only as "Canada", so it gets no clock.
const ZONES: Record<string, string> = {
  'Doha, Qatar': 'Asia/Qatar',
  'London, United Kingdom': 'Europe/London',
  'Bavaria, Germany': 'Europe/Berlin',
  'Palo Alto, United States': 'America/Los_Angeles',
  'Karachi, Pakistan': 'Asia/Karachi',
};

const timeIn = (zone: string) => new Date().toLocaleTimeString('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit' });

/** The teams behind the six roles, each with its local time right now. */
export default function Clocks() {
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
      {jobs.map((job) => {
        const zone = ZONES[job.location];
        return (
          <li key={job.id}>
            <span className="hx-cap">{job.company}</span>
            <strong>{job.location.split(',')[0]}</strong>
            <time suppressHydrationWarning>{zone && live ? timeIn(zone) : zone ? '--:--' : 'Remote'}</time>
          </li>
        );
      })}
    </ul>
  );
}
