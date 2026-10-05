"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { caseStudies } from '@/lib/case-studies';
import { profile } from '@/lib/data';
import { toggleTheme } from '@/components/ui/ThemeToggle';

interface Action { label: string; hint: string; run: () => void }

const go = (href: string) => () => { window.location.href = href; };
const open = (href: string) => () => { window.open(href, '_blank', 'noopener'); };

const ACTIONS: Action[] = [
  { label: 'Download CV', hint: 'PDF', run: open(profile.resume) },
  { label: 'Email Adnan', hint: profile.email, run: go(`mailto:${profile.email}`) },
  { label: 'Copy email address', hint: 'Clipboard', run: () => { navigator.clipboard?.writeText(profile.email); } },
  ...(profile.booking ? [{ label: 'Book a call', hint: 'Calendar', run: open(profile.booking) }] : []),
  { label: 'Check a job description against my stack', hint: 'Page', run: go('/hire') },
  { label: 'Open the lab: live demos', hint: 'Page', run: go('/lab') },
  { label: 'About Adnan: photos and quick answers', hint: 'Page', run: go('/about') },
  { label: 'Frontend developer: React, Next.js, Angular', hint: 'Page', run: go('/frontend-developer') },
  { label: '.NET developer: C#, ASP.NET Core, Blazor', hint: 'Page', run: go('/dotnet-developer') },
  { label: 'Home', hint: 'Page', run: go('/') },
  { label: 'Impact', hint: 'Section', run: go('/#about') },
  { label: 'Selected work', hint: 'Section', run: go('/#projects') },
  { label: 'Experience', hint: 'Section', run: go('/#experience') },
  { label: 'Stack', hint: 'Section', run: go('/#skills') },
  { label: 'Terminal', hint: 'Section', run: go('/#terminal') },
  { label: 'Contact', hint: 'Section', run: go('/#contact') },
  ...caseStudies.map((study) => ({ label: study.title, hint: 'Case study', run: go(`/work/${study.slug}`) })),
  { label: 'LinkedIn', hint: 'Opens in a new tab', run: open(profile.linkedin) },
  { label: 'GitHub', hint: 'Opens in a new tab', run: open(profile.github) },
  { label: 'Switch light and dark theme', hint: 'Theme', run: toggleTheme },
];

/** Keyboard launcher on ⌘K / Ctrl+K. A native <dialog> gives the focus trap and Escape for free. */
export default function CommandPalette() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ACTIONS.filter((a) => `${a.label} ${a.hint}`.toLowerCase().includes(q)) : ACTIONS;
  }, [query]);

  useEffect(() => {
    const show = () => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.open) return;
      setQuery('');
      setActive(0);
      dialog.showModal();
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); show(); }
    };
    window.addEventListener('keydown', onKey);
    // Buttons anywhere on the page open it with this event
    window.addEventListener('hx:palette', show);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hx:palette', show);
    };
  }, []);

  const run = (action?: Action) => {
    if (!action) return;
    dialogRef.current?.close();
    action.run();
  };

  return (
    <dialog
      className="hx-palette"
      ref={dialogRef}
      aria-label="Command palette"
      onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
    >
      <input
        type="text"
        value={query}
        placeholder="Type a command or search…"
        aria-label="Search commands"
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => { setQuery(e.target.value); setActive(0); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
          if (e.key === 'Enter') { e.preventDefault(); run(results[active]); }
        }}
      />
      <ul role="listbox" aria-label="Commands" data-lenis-prevent>
        {results.map((action, i) => (
          <li key={action.label} role="option" aria-selected={i === active}>
            <button type="button" tabIndex={-1} onClick={() => run(action)} onPointerEnter={() => setActive(i)}>
              <span>{action.label}</span>
              <small>{action.hint}</small>
            </button>
          </li>
        ))}
        {results.length === 0 && <li className="hx-palette-empty">Nothing matches “{query}”.</li>}
      </ul>
      <p className="hx-cap">↑ ↓ to move · Enter to run · Esc to close</p>
    </dialog>
  );
}

/** Opens the palette from any button. */
export const openPalette = () => window.dispatchEvent(new Event('hx:palette'));
