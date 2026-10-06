"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { profile } from '@/lib/data';
import { toggleTheme } from '@/components/ui/ThemeToggle';
import CommandPalette, { openPalette } from './CommandPalette';
import { hxFonts } from './fonts';
import { spotlight } from './spotlight';
import './home.css';

/** Counts a figure up from zero to its data-count, keeping the data-suffix. */
function countUp(el: HTMLElement) {
  const end = Number(el.dataset.count);
  const started = performance.now();
  const tick = (now: number) => {
    const progress = Math.min(1, (now - started) / 900);
    el.textContent = Math.round(end * (1 - (1 - progress) ** 3)).toLocaleString('en-US') + (el.dataset.suffix ?? '');
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Backdrop, top bar and footer for the pages that share the home page's look. */
export default function PageFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const arabic = pathname === '/ar';
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  // Reading progress along the top edge, and the highlight that follows the pointer across cards
  useEffect(() => {
    const frame = root.current;
    if (!frame) return;
    const onScroll = () => {
      const room = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${room > 0 ? Math.min(1, window.scrollY / room) : 0})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    frame.addEventListener('pointermove', spotlight);
    return () => {
      window.removeEventListener('scroll', onScroll);
      frame.removeEventListener('pointermove', spotlight);
    };
  }, [pathname]);

  // Content below the first screen rises in as it is reached, and figures count up when seen.
  // The first screen is left alone so the page paints without waiting for this.
  useEffect(() => {
    const frame = root.current;
    if (!frame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const blocks = [...frame.querySelectorAll<HTMLElement>('.hx-page section > *, .hx-page .hx-grid-3 > li, .hx-page .hx-grid-2 > li, .hx-page .hx-studies > li')];
    const reveals = blocks.filter(
      (block) => !blocks.some((other) => other !== block && block.contains(other)) && block.getBoundingClientRect().top > window.innerHeight * 0.9,
    );
    reveals.forEach((block) => {
      block.classList.add('hx-rv');
      block.style.setProperty('--d', String(block.parentElement ? [...block.parentElement.children].indexOf(block) % 3 : 0));
    });
    // Components shared with the home page carry the reveal class in their markup: watch those too,
    // or arming the frame would leave them hidden
    const watched = new Set([...reveals, ...frame.querySelectorAll<HTMLElement>('.hx-rv')]);
    frame.classList.add('is-armed');
    const timers: number[] = [];
    const watch = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const seen = entry.target as HTMLElement;
        watch.unobserve(seen);
        if (seen.dataset.count) return countUp(seen);
        seen.classList.add('is-in');
        // Once it has arrived the block goes back to its own styles, so its hover transitions apply
        timers.push(window.setTimeout(() => seen.classList.remove('hx-rv', 'is-in'), 5000));
      }),
      { threshold: 0.12 },
    );
    watched.forEach((block) => watch.observe(block));
    frame.querySelectorAll<HTMLElement>('[data-count]').forEach((figure) => watch.observe(figure));
    return () => {
      watch.disconnect();
      timers.forEach(clearTimeout);
      watched.forEach((block) => block.classList.remove('hx-rv', 'is-in'));
      frame.classList.remove('is-armed');
    };
  }, [pathname]);

  return (
    <div ref={root} className={`hx is-scrolled ${hxFonts}`}>
      <div className="hx-stage" aria-hidden="true">
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          <path d="M-80 260C180 120 380 380 620 250S1010 40 1240 210s330 150 480 60" />
          <path d="M-60 520c210-150 420 90 650-10s330-260 560-120 320 210 520 90" />
          <path d="M-90 790c260-120 400 130 660 40s360-240 600-110 300 160 520 50" />
          <path d="M1210 560c150 30 240 170 170 300s-250 160-350 60-60-400 180-360z" />
        </svg>
      </div>
      <div className="hx-progress" ref={bar} aria-hidden="true" />
      <header className="hx-top">
        <Link className="hx-wordmark" href="/" title="Home">
          adnan<span className="hx-serif">saleem</span>
        </Link>
        <nav className="hx-nav" aria-label="Primary">
          {[['/', 'Home'], ['/#projects', 'Work'], ['/work', 'Case studies'], ['/articles', 'Articles'], ['/lab', 'Lab'], ['/about', 'About'], ['/hire', 'Hire']].map(([href, label]) => (
            <Link key={href} href={href} data-text={label}><span>{label}</span></Link>
          ))}
        </nav>
        <div className="hx-tools">
          {/* One button, two states: Arabic from any English page, English from the Arabic page */}
          {arabic ? (
            <Link className="hx-pill hx-lang" href="/" lang="en" aria-label="Switch to English">EN</Link>
          ) : (
            <Link className="hx-pill hx-lang" href="/ar" lang="ar" aria-label="التبديل إلى العربية">ع</Link>
          )}
          <button className="hx-pill hx-kbd" type="button" onClick={openPalette} aria-label="Open the command palette">⌘K</button>
          <a className="hx-pill is-solid hx-cv" href={profile.resume} target="_blank" rel="noopener noreferrer">Download CV</a>
          {/* Small screens hide the link row; the palette lists every destination */}
          <button className="hx-round hx-menu-btn" type="button" onClick={openPalette} aria-label="Open the menu">
            <span className="hx-dots" />
          </button>
          <button className="hx-round" type="button" onClick={toggleTheme} aria-label="Toggle colour theme" title="Toggle colour theme">
            <svg className="theme-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
            </svg>
            <svg className="theme-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z" />
            </svg>
          </button>
        </div>
      </header>
      <div className="hx-page">{children}</div>
      <footer className="hx-foot hx-cap">
        <span>©{new Date().getFullYear()} {profile.name}</span>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <nav aria-label="Footer">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/work">Case studies</Link>
          <Link href="/articles">Articles</Link>
          <Link href="/hire">Hire</Link>
          <Link href="/lab">Lab</Link>
          <Link href="/frontend-developer">Frontend developer</Link>
          <Link href="/dotnet-developer">.NET developer</Link>
          <Link href="/ai-engineer">AI engineer</Link>
          <Link href="/azure-developer">Azure developer</Link>
        </nav>
      </footer>
      <CommandPalette />
    </div>
  );
}
