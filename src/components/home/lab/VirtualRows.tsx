"use client";

import { useMemo, useState } from 'react';

const TOTAL = 20_000, ROW = 36, VIEW = 432, OVERSCAN = 6;
const CURRENCIES = ['GBP', 'EUR', 'USD', 'AED', 'CAD', 'JPY', 'SEK', 'PLN'];
const STATES = ['Settled', 'Pending', 'Review', 'Failed'];

// Deterministic synthetic transfers, so server and client render the same rows
const ROWS = (() => {
  let seed = 42;
  const next = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  return Array.from({ length: TOTAL }, (_, i) => ({
    id: `TX-${String(100000 + i)}`,
    currency: CURRENCIES[Math.floor(next() * CURRENCIES.length)],
    amount: (next() * 25000 + 10).toFixed(2),
    status: STATES[Math.floor(next() * next() * STATES.length)],
  }));
})();

/**
 * The technique behind the "~70% less render time on 20,000+ rows" bullet:
 * only the rows inside the viewport exist in the DOM. Toggle it off to feel the difference.
 */
export default function VirtualRows() {
  const [virtual, setVirtual] = useState(true);
  const [top, setTop] = useState(0);
  const [query, setQuery] = useState('');
  const [elapsed, setElapsed] = useState<number | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toUpperCase();
    return q ? ROWS.filter((r) => r.id.includes(q) || r.currency.includes(q) || r.status.toUpperCase().includes(q)) : ROWS;
  }, [query]);

  const first = virtual ? Math.max(0, Math.floor(top / ROW) - OVERSCAN) : 0;
  const last = virtual ? Math.min(rows.length, Math.ceil((top + VIEW) / ROW) + OVERSCAN) : rows.length;
  const visible = rows.slice(first, last);

  // Frame-dependent estimate, not a React render duration or a paint timestamp.
  const timed = (change: () => void) => {
    const started = performance.now();
    change();
    requestAnimationFrame(() => requestAnimationFrame(() => setElapsed(Math.round(performance.now() - started))));
  };

  return (
    <div className="hx-demo hx-card">
      <div className="hx-demo-bar">
        <input
          type="search"
          value={query}
          onChange={(e) => timed(() => { setQuery(e.target.value); setTop(0); })}
          placeholder="Filter 20,000 rows: try EUR or Failed"
          aria-label="Filter rows"
        />
        <button type="button" className={`hx-pill${virtual ? ' is-solid' : ''}`} aria-pressed={virtual} onClick={() => timed(() => setVirtual((v) => !v))}>
          Virtualization {virtual ? 'on' : 'off'}
        </button>
      </div>
      <dl className="hx-demo-stats" aria-live="polite">
        <div><dt>{rows.length.toLocaleString('en-US')}</dt><dd>rows in the data</dd></div>
        <div><dt>{visible.length.toLocaleString('en-US')}</dt><dd>rows in the DOM</dd></div>
        <div><dt>{elapsed === null ? '–' : `${elapsed} ms`}</dt><dd>update delay estimate</dd></div>
      </dl>
      <div className="hx-vrows" data-lenis-prevent style={{ height: VIEW }} onScroll={(e) => setTop(e.currentTarget.scrollTop)} tabIndex={0} aria-label="Transfers table">
        <div style={{ height: rows.length * ROW, position: 'relative' }}>
          <div style={{ transform: `translateY(${first * ROW}px)` }}>
            {visible.map((r) => (
              <div className="hx-vrow" key={r.id} style={{ height: ROW }}>
                <span>{r.id}</span><span>{r.currency}</span><span>{r.amount}</span><span data-state={r.status}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="hx-demo-note">Synthetic data. Timing runs from the update handler to the second animation-frame callback, rounded to milliseconds. It includes frame scheduling and is not a paint timestamp. Compare the same filter action in each mode.</p>
    </div>
  );
}
