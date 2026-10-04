"use client";

import { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { certifications, education, profile, projects, skills, stats } from '@/lib/data';
import { toggleTheme } from '@/components/ui/ThemeToggle';
import Clocks from './Clocks';
import ExperienceReel from './ExperienceReel';
import CommandPalette, { openPalette } from './CommandPalette';
import FitMatcher from './FitMatcher';
import Terminal from './Terminal';
import { MOMENTS } from './photos';
import './home.css';

// Preview images published by each credential page, saved under public/certs
const CERT_PREVIEW: Record<string, string> = {
  'Cisco: Introduction to Modern AI': 'cisco-modern-ai.png',
  'Cisco: Python Essentials': 'cisco-python.png',
  'Cisco: JavaScript Essentials': 'cisco-javascript.png',
  'Cisco: Introduction to Cybersecurity': 'cisco-cybersecurity.png',
  'HP LIFE: Data Science & Analytics': 'hp-life.png',
};

/** The LinkedIn mark, in its own blue on a white tile so it reads on both themes. */
function LinkedInMark({ size = 18 }: { size?: number }) {
  return (
    <svg className="hx-li" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#fff" />
      <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/** Outlined words that slide sideways as the page scrolls past them. */
function Band({ text }: { text: string }) {
  return (
    <div className="hx-slide" aria-hidden="true">
      <span>{Array(8).fill(text).join(' · ')}</span>
    </div>
  );
}

const KONAMI =['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Section ids are the anchors the case study pages already link to
const SECTIONS = [
  { id: 'home', label: 'Intro' },
  { id: 'about', label: 'Impact' },
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
];

// Numbers lifted from the CV bullets in data.ts. If a bullet changes, change it here too.
const IMPACT = [
  { figure: '~40%', label: 'faster release cycle', detail: 'Rearchitected a monolithic React frontend into micro frontends with Module Federation.', where: 'Supreme Committee for Delivery & Legacy' },
  { figure: '~70%', label: 'less render time', detail: 'react-window virtualization and memoization on tables exceeding 20,000 rows.', where: 'Volopa Financial Services' },
  { figure: '42', label: 'workflows migrated', detail: 'Visual FoxPro to C#/.NET Core, with Angular and Blazor frontends, as the sole engineer.', where: 'Benington Financials Canada' },
  { figure: '~35%', label: 'better LCP', detail: 'Core Web Vitals compliance through memoization, virtualization, lazy loading and code splitting.', where: 'Supreme Committee for Delivery & Legacy' },
  { figure: '60M+', label: 'lines of vehicle software', detail: 'Real-time threat dashboards on WebSocket feeds for the Codex cybersecurity platform.', where: 'Primary Target GmbH' },
  { figure: '180+', label: 'countries served', detail: 'Multi-currency payments and card platform meeting WCAG 2.1 and UK fintech regulation.', where: 'Volopa Financial Services' },
];

const FEATURED = projects.slice(0, 6);
const MORE = projects.slice(6);
// The names a recruiter recognises, straight from the project list
const WORKED_ON = ['Hayya Qatar', 'Qatar Events Platform', 'Volopa', 'Meta LLaMA', 'Google DeepMind', 'Norstella', 'Codex'];

const projectLink = (p: (typeof projects)[number]) => (p.caseStudy ? `/work/${p.caseStudy}` : p.href);

function ProjectLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return href.startsWith('http') ? (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  ) : (
    <Link className={className} href={href}>{children}</Link>
  );
}

/** Heading whose words rise out of a clip one after another. Parts are [text, emphasised]. */
function Roll({ parts }: { parts: [string, boolean?][] }) {
  let n = 0;
  return (
    <>
      {parts.map(([text, strong]) =>
        text.split(' ').map((word) => {
          const i = n++;
          const inner = <span style={{ '--i': i } as React.CSSProperties}>{strong ? <em>{word}</em> : word}</span>;
          // The space lives outside the clip box, or the inline-block swallows it
          return <Fragment key={i}><span className="hx-w">{inner}</span>{' '}</Fragment>;
        }),
      )}
    </>
  );
}

export default function HomeExperience({ fontClass }: { fontClass: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [current, setCurrent] = useState('home');
  const [look, setLook] = useState<(typeof projects)[number] | null>(null);
  const [nudge, setNudge] = useState<'idle' | 'shown' | 'closed'>('idle');
  const lookRef = useRef<HTMLDialogElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = rootRef.current, portrait = portraitRef.current, rail = railRef.current, track = trackRef.current;
    if (!root || !portrait || !rail || !track) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sectionWatch = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) setCurrent(entry.target.id); }),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) sectionWatch.observe(el); });

    // Content is visible by default; the reveal only arms once JS is running
    root.classList.add('is-armed');
    const revealWatch = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); revealWatch.unobserve(entry.target); }
      }),
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    );
    root.querySelectorAll('.hx-rv').forEach((el) => revealWatch.observe(el));

    // ── Horizontal work rail: vertical scroll drives the cards sideways on wide screens
    let railTop = 0, railRun = 0;
    const slides = root.querySelectorAll<HTMLElement>('.hx-slide');
    const measure = () => {
      const wide = window.innerWidth > 1000 && !reduced;
      railRun = wide ? Math.max(0, track.scrollWidth - window.innerWidth) : 0;
      rail.style.height = wide ? `${window.innerHeight + railRun}px` : '';
      railTop = rail.getBoundingClientRect().top + window.scrollY;
      if (!wide) track.style.transform = '';
    };

    const onScroll = () => {
      const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      root.classList.toggle('is-scrolled', y > 40);
      // 0 at the top of the page, 1 once the hero has scrolled away
      root.style.setProperty('--hero', Math.min(y / window.innerHeight, 1).toFixed(4));
      slides.forEach((slide) => {
        const box = slide.getBoundingClientRect();
        if (box.bottom > 0 && box.top < window.innerHeight) slide.style.setProperty('--shift', ((box.top - window.innerHeight / 2) * 0.35).toFixed(1) + 'px');
      });
      // The invitation to the recruiter page appears once someone has started reading
      if (y > window.innerHeight * 0.9) setNudge((state) => (state === 'idle' ? 'shown' : state));
      if (railRun) track.style.transform = `translate3d(${-Math.min(Math.max(y - railTop, 0), railRun)}px,0,0)`;
    };

    // ── Pointer: the reveal blob inside the portrait, the 3D lean, magnetic buttons, card tilt
    const target = { x: 0.5, y: 0.42, px: 0, py: 0 };
    // Three points chase the cursor at different speeds, which reads as one fluid blob
    // A chain of points, each chasing the one before it: the body of the liquid shape
    const chain = Array.from({ length: 16 }, () => ({ x: 0.5, y: 0.42 }));
    const codeLayer = portrait.querySelector<HTMLElement>('.hx-code > div');
    let heading = 0;
    const lean = { x: 0, y: 0 };

    // Outline of the shape in pixels: a rounded head at the cursor, a body that thins
    // along the chain, a small rounded tail. The widths breathe so it never looks rigid.
    const blobPath = (size: number, amount: number, time: number) => {
      const last = chain.length - 1;
      const left: number[][] = [], right: number[][] = [];
      let tailAngle = heading;
      chain.forEach((p, i) => {
        const a = chain[Math.max(i - 1, 0)], b = chain[Math.min(i + 1, last)];
        const dx = (a.x - b.x) * size, dy = (a.y - b.y) * size;
        // A resting cursor gives no direction, so keep the last one
        const angle = Math.hypot(dx, dy) > 0.6 ? Math.atan2(dy, dx) : (i === 0 ? heading : tailAngle);
        if (i === 0) heading = angle;
        tailAngle = angle;
        const width = size * 0.15 * amount * (1 - 0.62 * (i / last)) * (1 + 0.07 * Math.sin(time / 420 + i * 0.9));
        const nx = -Math.sin(angle) * width, ny = Math.cos(angle) * width;
        left.push([p.x * size + nx, p.y * size + ny]);
        right.push([p.x * size - nx, p.y * size - ny]);
      });
      const cap = (centre: { x: number; y: number }, from: number[], start: number) => {
        const radius = Math.hypot(from[0] - centre.x * size, from[1] - centre.y * size);
        return Array.from({ length: 7 }, (_, k) => {
          const angle = start - ((k + 1) * Math.PI) / 8;
          const wobble = 1 + 0.06 * Math.sin(time / 300 + k * 1.7);
          return [centre.x * size + Math.cos(angle) * radius * wobble, centre.y * size + Math.sin(angle) * radius * wobble];
        });
      };
      const outline = [
        left[0], ...cap(chain[0], left[0], heading + Math.PI / 2), ...right,
        ...cap(chain[last], right[last], tailAngle - Math.PI / 2), ...left.slice(1).reverse(),
      ];
      // Quadratic curves through the midpoints give one continuous smooth edge
      const mid = (p: number[], q: number[]) => `${((p[0] + q[0]) / 2).toFixed(1)} ${((p[1] + q[1]) / 2).toFixed(1)}`;
      return `M${mid(outline[outline.length - 1], outline[0])}` +
        outline.map((p, i) => `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${mid(p, outline[(i + 1) % outline.length])}`).join('') + 'Z';
    };
    // The blob only opens while the pointer is on the portrait, so the face is never covered at rest
    let over = false, open = 0, raf = 0;

    const onMove = (e: PointerEvent) => {
      const box = portrait.getBoundingClientRect();
      target.x = (e.clientX - box.left) / box.width;
      target.y = (e.clientY - box.top) / box.height;
      over = target.x > 0.08 && target.x < 0.92 && target.y > 0.05 && target.y < 1;
      if (e.pointerType === 'mouse') {
        target.px = e.clientX / window.innerWidth - 0.5;
        target.py = e.clientY / window.innerHeight - 0.5;
      }
      const el = e.target as Element;
      const magnet = el.closest?.<HTMLElement>('.hx-mag');
      if (magnet && e.pointerType === 'mouse') {
        const box = magnet.getBoundingClientRect();
        magnet.style.translate = `${(e.clientX - box.left - box.width / 2) * 0.25}px ${(e.clientY - box.top - box.height / 2) * 0.35}px`;
      }
      const card = el.closest?.<HTMLElement>('.hx-tilt');
      if (card && e.pointerType === 'mouse') {
        const box = card.getBoundingClientRect();
        card.style.setProperty('--ry', `${((e.clientX - box.left) / box.width - 0.5) * 8}deg`);
        card.style.setProperty('--rx', `${(0.5 - (e.clientY - box.top) / box.height) * 8}deg`);
      }
    };
    const onOut = (e: PointerEvent) => {
      const el = e.target as Element;
      const magnet = el.closest?.<HTMLElement>('.hx-mag');
      if (magnet && !magnet.contains(e.relatedTarget as Node)) magnet.style.translate = '';
      const card = el.closest?.<HTMLElement>('.hx-tilt');
      if (card && !card.contains(e.relatedTarget as Node)) { card.style.setProperty('--ry', '0deg'); card.style.setProperty('--rx', '0deg'); }
    };

    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      if (window.scrollY > window.innerHeight) return; // the hero is off screen
      open += ((over ? 1 : 0) - open) * 0.07;
      chain.forEach((p, i) => {
        const lead = i === 0 ? target : chain[i - 1];
        const pull = i === 0 ? 0.16 : 0.3;
        p.x += (lead.x - p.x) * pull;
        p.y += (lead.y - p.y) * pull;
      });
      if (codeLayer) codeLayer.style.clipPath = open > 0.01 ? `path("${blobPath(portrait.offsetWidth, open, time)}")` : 'circle(0)';
      lean.x += (target.px - lean.x) * 0.06;
      lean.y += (target.py - lean.y) * 0.06;
      root.style.setProperty('--px', lean.x.toFixed(4));
      root.style.setProperty('--py', lean.y.toFixed(4));
    };

    // ── Small rewards: a note for people who open DevTools, and confetti for the curious
    console.info('%cHello, fellow engineer.', 'font: 600 16px sans-serif; color: #7a9400', `\nThe source is at ${profile.github}. Try ⌘K, the terminal, or the Konami code.`);
    const confetti = () => {
      if (reduced) return;
      const burst = document.createElement('div');
      burst.className = 'hx-confetti';
      burst.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 70; i++) {
        const bit = document.createElement('i');
        bit.style.cssText = `left:${Math.random() * 100}%;animation-delay:${Math.random() * 0.4}s;--spin:${Math.random() * 720 - 360}deg;--drift:${Math.random() * 200 - 100}px;background:${['#d2ff00', '#f4f3ee', '#2fbf71', '#12130f'][i % 4]}`;
        burst.appendChild(bit);
      }
      root.appendChild(burst);
      window.setTimeout(() => burst.remove(), 3200);
    };
    let konami = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
      konami = e.key === KONAMI[konami] ? konami + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (konami === KONAMI.length) { konami = 0; confetti(); }
    };
    window.addEventListener('hx:confetti', confetti);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('pointermove', onMove);
    root.addEventListener('pointerout', onOut);
    window.addEventListener('keydown', onKey);
    measure();
    onScroll();
    if (!reduced) raf = requestAnimationFrame(frame);
    // Fonts and images change the track's width after first paint
    const settle = window.setTimeout(measure, 1200);

    return () => {
      sectionWatch.disconnect();
      revealWatch.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener('hx:confetti', confetti);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerout', onOut);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (look && !lookRef.current?.open) lookRef.current?.showModal();
  }, [look]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`hx ${fontClass}${menuOpen ? ' is-menu' : ''}`} ref={rootRef}>
      {/* Flat backdrop with slow contour lines */}
      <div className="hx-stage" aria-hidden="true">
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          <path d="M-80 260C180 120 380 380 620 250S1010 40 1240 210s330 150 480 60" />
          <path d="M-60 520c210-150 420 90 650-10s330-260 560-120 320 210 520 90" />
          <path d="M-90 790c260-120 400 130 660 40s360-240 600-110 300 160 520 50" />
          <path d="M260 90c160 60 210 220 120 330s-260 120-330 10S120 40 260 90z" />
          <path d="M1210 560c150 30 240 170 170 300s-250 160-350 60-60-400 180-360z" />
          <path d="M760 640c110-40 240 30 250 140s-110 190-230 160-150-250-20-300z" />
        </svg>
      </div>
      <div className="hx-progress" ref={barRef} aria-hidden="true" />
      <div className="hx-curtain" aria-hidden="true"><span>adnan<i>saleem</i></span></div>

      {/* Name and portrait sit beside the stage: the cutout stands in front of the giant name.
          The portrait is a pre-built 97 KB WebP with transparency, so it skips the optimizer. */}
      <p className="hx-giant" aria-hidden="true"><span>Adnan</span> <span><em>Saleem</em></span></p>
      <div className="hx-portrait" ref={portraitRef}>
        <Image src="/me/adnan-soft.webp" alt={`Portrait of ${profile.name}`} fill priority unoptimized />
        <div className="hx-code" aria-hidden="true">
          <div><Image src="/me/adnan-soft.webp" alt="" fill unoptimized /></div>
        </div>
      </div>

      <header className="hx-top">
        <a className="hx-wordmark" href="#home" aria-label={`${profile.name}, back to top`} onClick={closeMenu}>
          adnan<span className="hx-serif">saleem</span>
        </a>
        <nav className="hx-nav" aria-label="Primary">
          {SECTIONS.slice(1).filter((s) => s.id !== 'skills').map((s) => (
            <a key={s.id} href={`#${s.id}`} data-text={s.label} aria-current={current === s.id ? 'true' : undefined}>
              <span>{s.label}</span>
            </a>
          ))}
          <Link href="/lab" data-text="Lab"><span>Lab</span></Link>
          <Link href="/hire" data-text="Hire me" className="is-hot"><span>Hire me</span></Link>
        </nav>
        <div className="hx-tools">
          <Link className="hx-pill hx-lang" href="/ar" lang="ar" aria-label="التبديل إلى العربية">ع</Link>
          <button className="hx-pill hx-kbd" type="button" onClick={openPalette} aria-label="Open the command palette">⌘K</button>
          <a className="hx-pill is-solid hx-cv hx-mag" href={profile.resume} target="_blank" rel="noopener noreferrer">Download CV</a>
          <button className="hx-round" type="button" onClick={toggleTheme} aria-label="Toggle colour theme" title="Toggle colour theme">
            <svg className="theme-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
            </svg>
            <svg className="theme-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z" />
            </svg>
          </button>
          <button
            className="hx-round hx-menu-btn"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="hx-menu"
          >
            <span className="hx-dots" />
          </button>
        </div>
      </header>

      {/* ── Intro: the face, the title, and the actions a recruiter needs ── */}
      <section className="hx-hero" id="home">
        <div className="hx-hero-left">
          <p className="hx-badge"><span aria-hidden="true" />{profile.availability} · Open to relocation</p>
          <h1>
            <span className="hx-name">{profile.name}</span>
            Senior <em>Full-Stack</em> Engineer
          </h1>
        </div>
        <div className="hx-hero-right">
          <p className="hx-lede">
            8 years building enterprise platforms for government, fintech and cybersecurity clients.
            React, Next.js and Angular up front. Node.js, C#, .NET and AWS behind.
          </p>
          <div className="hx-actions">
            <a className="hx-pill is-solid is-big hx-mag" href={profile.resume} target="_blank" rel="noopener noreferrer">Download CV <span aria-hidden="true">↓</span></a>
            <a className="hx-pill is-big hx-mag" href={`mailto:${profile.email}`}>Email me</a>
            <a className="hx-pill is-big hx-mag" href={profile.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInMark /> LinkedIn</a>
          </div>
        </div>
        <p className="hx-hint hx-cap" aria-hidden="true">Move the cursor over the portrait</p>
      </section>

      <section className="hx-band" aria-label="At a glance">
        <dl className="hx-stats">
          {stats.map((stat) => (
            <div key={stat.label}><dt>{stat.number}</dt><dd>{stat.label}</dd></div>
          ))}
        </dl>
        <div className="hx-marquee" aria-label={`Platforms I have worked on: ${WORKED_ON.join(', ')}`}>
          {/* Two copies so the loop has no seam; the second is hidden from assistive tech */}
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1}>
              {WORKED_ON.map((name) => <li key={name}>{name}</li>)}
            </ul>
          ))}
        </div>
      </section>

      <section className="hx-section" id="about">
        <header className="hx-head hx-rv">
          <p className="hx-cap"><b>01</b> Impact</p>
          <h2><Roll parts={[['Results I can put a'], ['number', true], ['on']]} /></h2>
          <p>{profile.summary[1]}</p>
        </header>
        <ul className="hx-grid-3">
          {IMPACT.map((item, i) => (
            <li key={item.label} className="hx-card hx-tilt hx-rv" style={{ '--d': i } as React.CSSProperties}>
              <strong>{item.figure}</strong>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
              <span className="hx-cap">{item.where}</span>
            </li>
          ))}
        </ul>
      </section>

      <Band text="Selected work" />

      {/* ── Work: on wide screens the page pins and the cards travel sideways ── */}
      <section className="hx-rail" id="projects" ref={railRef}>
        <div className="hx-rail-pin">
          <ul className="hx-rail-track" ref={trackRef}>
            <li className="hx-rail-head hx-rv">
              <p className="hx-cap"><b>02</b> Selected work</p>
              <h2><Roll parts={[['Platforms in'], ['production', true]]} /></h2>
              <p>Six platforms I shipped features on. Keep scrolling.</p>
            </li>
            {FEATURED.map((p) => {
              const href = projectLink(p);
              return (
                <li key={p.id} className="hx-card hx-project hx-tilt">
                  {p.image && (
                    <button type="button" className="hx-shot" onClick={() => setLook(p)} aria-label={'Quick look: ' + p.title}>
                      <Image src={p.image} alt="" fill sizes="(max-width: 1000px) 100vw, 560px" />
                      <span className="hx-shot-cue">Quick look</span>
                    </button>
                  )}
                  <div className="hx-card-body">
                    <span className="hx-cap">{p.number} · {p.caseStudy ? 'Case study' : 'Project'}</span>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <ul className="hx-tags">{p.tags.slice(0, 5).map((tag) => <li key={tag}>{tag}</li>)}</ul>
                    {href && <ProjectLink className="hx-pill" href={href}>{p.caseStudy ? 'Read the case study ↘' : 'Visit site ↗'}</ProjectLink>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="hx-section hx-after-rail">
        <ul className="hx-rows hx-card hx-rv">
          {MORE.map((p) => {
            const href = projectLink(p);
            return (
              <li key={p.id}>
                <div className="hx-when">{p.number}</div>
                <div>
                  <h3>{href ? <ProjectLink href={href}>{p.title} ↗</ProjectLink> : p.title}</h3>
                  <p>{p.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="hx-more hx-rv"><Link className="hx-pill hx-mag" href="/work">All case studies ↘</Link></p>
      </section>

      <section className="hx-section" id="fit">
        <header className="hx-head hx-rv">
          <p className="hx-cap"><b>Hiring?</b> Fit check</p>
          <h2><Roll parts={[['Paste the role, see the'], ['overlap', true]]} /></h2>
          <p>Drop in a job description. It lists which technologies in the role are on my CV, which are not, and the bullets where I used them.</p>
        </header>
        <FitMatcher />
        <p className="hx-more hx-rv"><Link className="hx-pill hx-mag" href="/hire">The two-minute version for recruiters ↘</Link></p>
      </section>

      <Band text="Experience" />

      <section className="hx-section hx-exp" id="experience">
        <header className="hx-head hx-rv">
          <p className="hx-cap"><b>03</b> Experience</p>
          <h2><Roll parts={[['Eight years,'], ['six', true], ['teams']]} /></h2>
          <p>{profile.summary[2]}</p>
        </header>
        <Clocks />
      </section>
      <ExperienceReel />

      <section className="hx-section" id="skills">
        <header className="hx-head hx-rv">
          <p className="hx-cap"><b>04</b> Stack</p>
          <h2><Roll parts={[['Frontend to'], ['infrastructure', true]]} /></h2>
          <p>{profile.summary[0]}</p>
        </header>
        <ul className="hx-rows hx-card hx-rv">
          {skills.map((group) => (
            <li key={group.category}>
              <div className="hx-when">{group.category}</div>
              <ul className="hx-tags" style={{ marginTop: 0 }}>{group.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </li>
          ))}
        </ul>
        <div className="hx-grid-2 hx-creds">
          <div className="hx-card hx-rv">
            <p className="hx-cap">Education</p>
            <ul>
              {education.map((item) => (
                <li key={item.title}><h3>{item.title}</h3><p>{item.issuer} · {item.meta}</p></li>
              ))}
            </ul>
          </div>
          <div className="hx-card hx-rv" style={{ '--d': 1 } as React.CSSProperties}>
            <p className="hx-cap">Certifications</p>
            <ul>
              {certifications.map((item) => {
                const preview = CERT_PREVIEW[item.title];
                return (
                  <li key={item.title} className={preview ? 'has-preview' : undefined}>
                    <h3>{item.href ? <a href={item.href} target="_blank" rel="noopener noreferrer">{item.title} ↗</a> : item.title}</h3>
                    <p>{item.meta}</p>
                    {preview && <Image className="hx-cert" src={'/certs/' + preview} alt="" width={672} height={352} sizes="340px" />}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <Band text="Off the clock" />

      <section className="hx-section hx-person" id="person">
        <header className="hx-head hx-rv">
          <p className="hx-cap"><b>Off the clock</b> The person</p>
          <h2><Roll parts={[['The human behind the'], ['commits', true]]} /></h2>
          <p>Based in Lahore, five years fully remote, and open to relocation.</p>
        </header>
        <div className="hx-film">
          <ul>
            {/* The row is doubled so the loop has no seam; the copy is decorative */}
            {[...MOMENTS, ...MOMENTS].map((moment, i) => (
              <li key={i}><Image src={`/me/m/${moment.file}.webp`} alt={i < MOMENTS.length ? moment.alt : ''} fill unoptimized /></li>
            ))}
          </ul>
        </div>
        <dl className="hx-facts-row hx-rv">
          <div><dt className="hx-cap">Home</dt><dd>Lahore, Pakistan</dd></div>
          <div><dt className="hx-cap">Education</dt><dd>{education[0].title}, {education[0].issuer}</dd></div>
          <div><dt className="hx-cap">Also studied</dt><dd>{education[1].title}</dd></div>
          <div><dt className="hx-cap">English</dt><dd>CEFR C1, Oxford ELLT</dd></div>
          <div><dt className="hx-cap">Mentoring</dt><dd>27 junior developers</dd></div>
          <div><dt className="hx-cap">Relocation</dt><dd>Open to it</dd></div>
        </dl>
        <p className="hx-more hx-rv"><Link className="hx-pill hx-mag" href="/about">More about me ↘</Link></p>
      </section>

      <section className="hx-section" id="terminal">
        <header className="hx-head hx-rv">
          <p className="hx-cap"><b>05</b> Play</p>
          <h2><Roll parts={[['Or just'], ['ask', true], ['the terminal']]} /></h2>
          <p>Everything on this page is also a command. There are a couple of things in here that are not on the page.</p>
        </header>
        <Terminal />
        <ul className="hx-grid-2 hx-lab-teasers">
          <li className="hx-card hx-tilt hx-rv">
            <Link href="/lab">
              <span className="hx-cap">Lab · Demo 01</span>
              <h3>20,000 rows that still scroll</h3>
              <p>The virtualization technique from my payments work, running live. Switch it off and watch the paint time.</p>
              <span className="hx-pill">Open the demo ↘</span>
            </Link>
          </li>
          <li className="hx-card hx-tilt hx-rv" style={{ '--d': 1 } as React.CSSProperties}>
            <Link href="/lab">
              <span className="hx-cap">Lab · Demo 02</span>
              <h3>A dashboard that keeps up with its feed</h3>
              <p>A simulated real-time threat feed in the style of the Codex dashboards. Raise the rate and see it hold.</p>
              <span className="hx-pill">Open the demo ↘</span>
            </Link>
          </li>
        </ul>
      </section>

      <section className="hx-section hx-contact" id="contact">
        <p className="hx-badge hx-rv"><span aria-hidden="true" />{profile.availability} · Open to relocation</p>
        <h2 className="hx-rv"><Roll parts={[["Let's"], ['talk', true]]} /></h2>
        <a className="hx-mail hx-rv" href={`mailto:${profile.email}`}>{profile.email}</a>
        <p className="hx-rv">Lahore, Pakistan. Five years fully remote with US, UK and German teams.</p>
        <a className="hx-linkedin hx-card hx-tilt hx-rv" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          <LinkedInMark size={54} />
          <span>
            <strong>See my LinkedIn profile</strong>
            <small>Full work history and recommendations, and the fastest way to message me.</small>
          </span>
          <span className="hx-pill is-solid">Open LinkedIn ↗</span>
        </a>
        <ul className="hx-actions hx-rv">
          <li><a className="hx-pill is-solid is-big hx-mag" href={profile.resume} target="_blank" rel="noopener noreferrer">Download CV <span aria-hidden="true">↓</span></a></li>
          {profile.booking && <li><a className="hx-pill is-big hx-mag" href={profile.booking} target="_blank" rel="noopener noreferrer">Book a call ↗</a></li>}
          <li><a className="hx-pill is-big hx-mag" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
          <li><a className="hx-pill is-big hx-mag" href={profile.x} target="_blank" rel="noopener noreferrer">X ↗</a></li>
        </ul>
      </section>

      <footer className="hx-foot hx-cap">
        <span>©{new Date().getFullYear()} {profile.name}</span>
        <span>Lahore, Pakistan</span>
        <nav aria-label="Footer">
          <Link href="/about">About</Link>
          <Link href="/work">Case studies</Link>
          <Link href="/hire">Hire</Link>
          <Link href="/lab">Lab</Link>
          <Link href="/ar" lang="ar">العربية</Link>
        </nav>
      </footer>

      <dialog
        className="hx-look"
        ref={lookRef}
        aria-label={look ? look.title : 'Project'}
        data-lenis-prevent
        onClose={() => setLook(null)}
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
      >
        {look && (
          <article>
            {look.image && <div className="hx-shot"><Image src={look.image} alt={look.title + ' screenshot'} fill sizes="(max-width: 1000px) 100vw, 900px" /></div>}
            <div className="hx-look-body">
              <span className="hx-cap">Project {look.number}</span>
              <h3>{look.title}</h3>
              <p>{look.description}</p>
              <ul className="hx-tags">{look.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              <div className="hx-actions">
                {look.caseStudy && <Link className="hx-pill is-solid" href={'/work/' + look.caseStudy}>Read the case study ↘</Link>}
                {look.href && <a className="hx-pill" href={look.href} target="_blank" rel="noopener noreferrer">Visit site ↗</a>}
                <button type="button" className="hx-pill" onClick={() => lookRef.current?.close()}>Close</button>
              </div>
            </div>
          </article>
        )}
      </dialog>

      {/* Hidden from the stack section down, where it would sit on the certificate list and the footer links */}
      {nudge === 'shown' && current !== 'skills' && current !== 'contact' && (
        <aside className="hx-nudge" aria-label="For recruiters">
          <button type="button" className="hx-nudge-x" onClick={() => setNudge('closed')} aria-label="Dismiss">×</button>
          <p className="hx-cap">Hiring?</p>
          <p className="hx-serif">Paste your job description and see the fit in ten seconds.</p>
          <Link className="hx-pill is-solid" href="/hire">Open the recruiter page ↘</Link>
        </aside>
      )}

      <CommandPalette />

      <div className="hx-menu" id="hx-menu" inert={!menuOpen}>
        <ol>
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={closeMenu}><sup>{String(i + 1).padStart(2, '0')}</sup>{s.label}</a>
            </li>
          ))}
        </ol>
        <ul>
          <li><a href={`mailto:${profile.email}`}>⮡ {profile.email}</a></li>
          <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInMark size={14} /> LinkedIn</a></li>
          <li><a href={profile.github} target="_blank" rel="noopener noreferrer">⮡ GitHub</a></li>
          <li><a href={profile.resume} target="_blank" rel="noopener noreferrer">⮡ CV</a></li>
        </ul>
      </div>
    </div>
  );
}
