"use client";

import { useEffect, useState, useSyncExternalStore } from 'react';

interface Vitals { lcp?: number; cls?: number; slowest?: number }

// Google's "good" and "poor" boundaries for each metric
const LIMITS = { lcp: [2500, 4000], cls: [0.1, 0.25], slowest: [200, 500] };
const grade = (value: number | undefined, [good, poor]: number[]) =>
  value === undefined || value <= good ? undefined : value <= poor ? 'Review' : 'Failed';
const show = (value: number | undefined, format: (n: number) => string) => (value === undefined ? '–' : format(value));

/** Core Web Vitals of this visit, read from the browser's own performance entries. */
export default function PageVitals() {
  const [vitals, setVitals] = useState<Vitals>({});
  // No shift entries means a score of 0 only where the browser reports shifts at all
  const shifts = useSyncExternalStore(() => () => undefined, () => PerformanceObserver.supportedEntryTypes?.includes('layout-shift') ?? false, () => false);

  useEffect(() => {
    const watch = (type: string, read: (entry: PerformanceEntry, prev: Vitals) => Vitals, options: object = {}) => {
      if (!PerformanceObserver.supportedEntryTypes?.includes(type)) return;
      const observer = new PerformanceObserver((list) => setVitals((prev) => list.getEntries().reduce((next, entry) => read(entry, next), prev)));
      observer.observe({ type, buffered: true, ...options });
      return () => observer.disconnect();
    };
    const stops = [
      watch('largest-contentful-paint', (entry, prev) => ({ ...prev, lcp: entry.startTime })),
      // Shifts that follow a tap or key press are expected and do not count
      watch('layout-shift', (entry, prev) => {
        const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
        return shift.hadRecentInput ? prev : { ...prev, cls: (prev.cls ?? 0) + shift.value };
      }),
      // ponytail: the slowest interaction, not INP's high percentile; they match until a visit has 50+ interactions
      watch('event', (entry, prev) => ({ ...prev, slowest: Math.max(prev.slowest ?? 0, entry.duration) }), { durationThreshold: 16 }),
    ];
    return () => stops.forEach((stop) => stop?.());
  }, []);

  // Deliberately holds the main thread, so the next paint is late and the number moves
  const block = () => { const until = performance.now() + 300; while (performance.now() < until); };

  return (
    <div className="hx-demo hx-card">
      <dl className="hx-demo-stats is-long" aria-live="polite">
        <div><dt data-state={grade(vitals.lcp, LIMITS.lcp)}>{show(vitals.lcp, (n) => `${(n / 1000).toFixed(2)} s`)}</dt><dd>largest contentful paint</dd></div>
        <div><dt data-state={grade(vitals.cls, LIMITS.cls)}>{show(vitals.cls ?? (shifts ? 0 : undefined), (n) => n.toFixed(3))}</dt><dd>layout shift</dd></div>
        <div><dt data-state={grade(vitals.slowest, LIMITS.slowest)}>{show(vitals.slowest, (n) => `${Math.round(n)} ms`)}</dt><dd>slowest interaction</dd></div>
      </dl>
      <div className="hx-demo-bar">
        <button type="button" className="hx-pill" onClick={block}>Block the main thread for 300 ms</button>
      </div>
      <p className="hx-demo-note">
        Measured in your browser on this visit, on your device and connection. Press the button and the slowest interaction passes 200 ms, the line Google draws for a good one. A dash means this browser does not report that metric.
      </p>
    </div>
  );
}
