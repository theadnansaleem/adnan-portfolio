"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { profile } from '@/lib/data';
import { toggleTheme } from '@/components/ui/ThemeToggle';
import CommandPalette, { openPalette } from './CommandPalette';
import { hxFonts } from './fonts';
import './home.css';

/** Backdrop, top bar and footer for the pages that share the home page's look. */
export default function PageFrame({ children }: { children: React.ReactNode }) {
  const arabic = usePathname() === '/ar';
  return (
    <div className={`hx is-scrolled ${hxFonts}`}>
      <div className="hx-stage" aria-hidden="true">
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          <path d="M-80 260C180 120 380 380 620 250S1010 40 1240 210s330 150 480 60" />
          <path d="M-60 520c210-150 420 90 650-10s330-260 560-120 320 210 520 90" />
          <path d="M-90 790c260-120 400 130 660 40s360-240 600-110 300 160 520 50" />
          <path d="M1210 560c150 30 240 170 170 300s-250 160-350 60-60-400 180-360z" />
        </svg>
      </div>
      <header className="hx-top">
        <Link className="hx-wordmark" href="/" title="Home">
          adnan<span className="hx-serif">saleem</span>
        </Link>
        <nav className="hx-nav" aria-label="Primary">
          {[['/', 'Home'], ['/#projects', 'Work'], ['/work', 'Case studies'], ['/lab', 'Lab'], ['/about', 'About'], ['/hire', 'Hire']].map(([href, label]) => (
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
          <Link href="/hire">Hire</Link>
          <Link href="/lab">Lab</Link>
          <Link href="/frontend-developer">Frontend developer</Link>
          <Link href="/dotnet-developer">.NET developer</Link>
        </nav>
      </footer>
      <CommandPalette />
    </div>
  );
}
