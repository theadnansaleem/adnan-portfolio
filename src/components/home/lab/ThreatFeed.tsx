"use client";

import { useEffect, useState } from 'react';

type Level = 'low' | 'medium' | 'high';
interface Threat { id: number; at: string; level: Level; unit: string; vector: string }

const UNITS = ['Gateway ECU', 'Infotainment', 'Telematics', 'ADAS camera', 'Body control', 'OBD-II port'];
const VECTORS = ['CAN injection', 'Firmware downgrade', 'Replay attack', 'Open debug port', 'Weak TLS cipher', 'Unsigned update'];
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
const BUCKETS = 30;

/**
 * A stand-in for the Codex dashboards: events arrive on a timer here, where the
 * production version read a WebSocket. The state handling is the same idea.
 */
export default function ThreatFeed() {
  const [running, setRunning] = useState(true);
  const [rate, setRate] = useState(3);
  const [events, setEvents] = useState<Threat[]>([]);
  const [counts, setCounts] = useState<Record<Level, number>>({ low: 0, medium: 0, high: 0 });
  // Events per second for the last 30 seconds, newest last
  const [history, setHistory] = useState<number[]>(() => Array(BUCKETS).fill(0));

  useEffect(() => {
    if (!running) return;
    let id = 0;
    const feed = setInterval(() => {
      const roll = Math.random();
      const level: Level = roll > 0.9 ? 'high' : roll > 0.6 ? 'medium' : 'low';
      const threat = { id: Date.now() + id++, at: new Date().toLocaleTimeString('en-GB'), level, unit: pick(UNITS), vector: pick(VECTORS) };
      setEvents((prev) => [threat, ...prev].slice(0, 40));
      setCounts((prev) => ({ ...prev, [level]: prev[level] + 1 }));
      setHistory((prev) => [...prev.slice(0, -1), prev[prev.length - 1] + 1]);
    }, 1000 / rate);
    const second = setInterval(() => setHistory((prev) => [...prev.slice(1), 0]), 1000);
    return () => { clearInterval(feed); clearInterval(second); };
  }, [running, rate]);

  const peak = Math.max(4, ...history);
  const points = history.map((n, i) => `${(i / (BUCKETS - 1)) * 300},${60 - (n / peak) * 54}`).join(' ');

  return (
    <div className="hx-demo hx-card">
      <div className="hx-demo-bar">
        <button type="button" className={`hx-pill${running ? ' is-solid' : ''}`} aria-pressed={running} onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause feed' : 'Resume feed'}
        </button>
        <label className="hx-cap">
          Events per second: {rate}
          <input type="range" min={1} max={12} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </label>
      </div>
      <dl className="hx-demo-stats">
        <div><dt data-state="Failed">{counts.high}</dt><dd>high</dd></div>
        <div><dt data-state="Review">{counts.medium}</dt><dd>medium</dd></div>
        <div><dt>{counts.low}</dt><dd>low</dd></div>
      </dl>
      <svg className="hx-spark" viewBox="0 0 300 62" preserveAspectRatio="none" role="img" aria-label="Events per second over the last 30 seconds">
        <polyline points={points} />
      </svg>
      <div className="hx-vrows" data-lenis-prevent style={{ height: 288 }} role="log" aria-label="Incoming threats" tabIndex={0}>
        {events.map((t) => (
          <div className="hx-vrow" key={t.id} style={{ height: 36 }}>
            <span>{t.at}</span><span>{t.unit}</span><span>{t.vector}</span><span data-state={t.level === 'high' ? 'Failed' : t.level === 'medium' ? 'Review' : 'Settled'}>{t.level}</span>
          </div>
        ))}
        {events.length === 0 && <p className="hx-demo-note">Waiting for the first event…</p>}
      </div>
      <p className="hx-demo-note">Simulated events, generated in your browser. Nothing here is real vehicle data.</p>
    </div>
  );
}
