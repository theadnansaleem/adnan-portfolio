"use client";

import { Component, useState, type ReactNode } from 'react';

const SECTIONS = ['Events', 'Tickets', 'Reports'];

/** Catches a render error in one section, so the sections beside it keep working. */
class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function Section({ name, broken }: { name: string; broken: boolean }) {
  const [clicks, setClicks] = useState(0);
  if (broken) throw new Error(`${name} failed to load`);
  return (
    <>
      <strong>{name}</strong>
      <button type="button" className="hx-pill" onClick={() => setClicks((n) => n + 1)}>Clicked {clicks}</button>
    </>
  );
}

/**
 * Three stand-ins for remotes, each behind its own error boundary. Breaking one throws a real
 * render error (React logs it to the console); only that section falls back.
 */
export default function FailSmall() {
  const [broken, setBroken] = useState<string[]>([]);
  const toggle = (name: string) => setBroken((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  return (
    <div className="hx-demo hx-card">
      <div className="hx-demo-bar" role="group" aria-label="Break a section">
        {SECTIONS.map((name) => (
          <button key={name} type="button" className={`hx-pill${broken.includes(name) ? ' is-solid' : ''}`} aria-pressed={broken.includes(name)} onClick={() => toggle(name)}>
            {broken.includes(name) ? `Restore ${name}` : `Break ${name}`}
          </button>
        ))}
      </div>
      <dl className="hx-demo-stats" aria-live="polite">
        <div><dt>{SECTIONS.length - broken.length}</dt><dd>sections working</dd></div>
        <div><dt data-state={broken.length ? 'Failed' : undefined}>{broken.length}</dt><dd>sections down</dd></div>
        <div><dt>1</dt><dd>page still up</dd></div>
      </dl>
      <ul className="hx-remotes">
        {SECTIONS.map((name) => (
          <li key={name}>
            {/* The key remounts the boundary when the section is restored */}
            <Boundary key={String(broken.includes(name))} fallback={<><strong data-state="Failed">{name} is unavailable</strong><span>The rest of the page is unaffected.</span></>}>
              <Section name={name} broken={broken.includes(name)} />
            </Boundary>
          </li>
        ))}
      </ul>
      <p className="hx-demo-note">Each section keeps its own click count, so you can see the others carry on while one is down.</p>
    </div>
  );
}
