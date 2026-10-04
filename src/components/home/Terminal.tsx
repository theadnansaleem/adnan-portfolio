"use client";

import { useEffect, useRef, useState } from 'react';
import { jobs, profile, projects, skills, stats } from '@/lib/data';
import { toggleTheme } from '@/components/ui/ThemeToggle';

const HELP = [
  'whoami        who is this',
  'experience    six roles, newest first',
  'projects      twelve platforms',
  'skills [x]    the stack; try "skills cloud"',
  'stats         the short version',
  'contact       how to reach me',
  'cv            open the CV',
  'theme         switch light and dark',
  'clear         wipe the screen',
  'sudo hire-me  you know you want to',
];

// Every answer is read from data.ts, so the terminal can never drift from the CV
function answer(input: string): string[] | 'clear' {
  const [cmd, ...rest] = input.trim().toLowerCase().split(/\s+/);
  const arg = rest.join(' ');
  switch (cmd) {
    case 'help': return HELP;
    case 'whoami': return [`${profile.name}, ${profile.jobTitle}`, profile.location, profile.availability, '', profile.summary[2]];
    case 'experience': return jobs.map((j) => `${j.period.padEnd(20)} ${j.role} @ ${j.company} (${j.location})`);
    case 'projects': return projects.map((p) => `${p.number}  ${p.title}`);
    case 'stats': return stats.map((s) => `${s.number.padEnd(5)} ${s.label}`);
    case 'skills': {
      const groups = arg ? skills.filter((g) => g.category.toLowerCase().includes(arg)) : skills;
      if (!groups.length) return [`No group matches "${arg}". Groups: ${skills.map((g) => g.category).join(', ')}`];
      return groups.flatMap((g) => [`# ${g.category}`, `  ${g.tags.join(', ')}`]);
    }
    case 'contact': return [`email     ${profile.email}`, `linkedin  ${profile.linkedin}`, `github    ${profile.github}`];
    case 'cv': window.open(profile.resume, '_blank', 'noopener'); return ['Opening the CV in a new tab.'];
    case 'theme': toggleTheme(); return ['Theme switched.'];
    case 'clear': return 'clear';
    case 'sudo':
      if (arg === 'hire-me') {
        window.dispatchEvent(new Event('hx:confetti'));
        return ['Permission granted.', `Next step: ${profile.email}`];
      }
      return ['sudo: only "sudo hire-me" is allowed on this machine.'];
    case '': return [];
    default: return [`command not found: ${cmd}. Type "help".`];
  }
}

const CHIPS = ['whoami', 'experience', 'skills cloud', 'stats', 'sudo hire-me'];

export default function Terminal() {
  const [lines, setLines] = useState<string[]>(['Type "help", or tap a command below.']);
  const [value, setValue] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [lines]);

  const run = (input: string) => {
    const out = answer(input);
    setLines((prev) => (out === 'clear' ? [] : [...prev, `$ ${input}`, ...out]));
    setValue('');
  };

  return (
    <div className="hx-term hx-rv" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="hx-term-bar" aria-hidden="true"><i /><i /><i /><span>adnan@portfolio: ~</span></div>
      <div className="hx-term-log" data-lenis-prevent ref={logRef} role="log" aria-live="polite" aria-label="Terminal output" tabIndex={0}>
        {lines.map((line, i) => <div key={i} className={line.startsWith('$ ') ? 'is-cmd' : undefined}>{line || ' '}</div>)}
      </div>
      <form className="hx-term-in" onSubmit={(e) => { e.preventDefault(); run(value); }}>
        <span aria-hidden="true">$</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Terminal command"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </form>
      <div className="hx-term-chips">
        {CHIPS.map((chip) => <button key={chip} type="button" onClick={() => run(chip)}>{chip}</button>)}
      </div>
    </div>
  );
}
