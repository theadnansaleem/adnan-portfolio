"use client";

import { motion } from 'framer-motion';

/**
 * The active theme already lives on <html data-theme>, so this holds no React
 * state: both icons render and CSS reveals the right one. That keeps the server
 * and client markup identical no matter which theme was restored before paint.
 */
export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Private mode / blocked storage — the swap still applies for this session.
    }
  };

  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle colour theme"
      title="Toggle colour theme"
      whileHover={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '34px',
        height: '34px',
        padding: 0,
        border: '1px solid var(--chip-line)',
        background: 'var(--chip-bg)',
        color: 'var(--text)',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {/* Sun — shown on the dark theme, click to go light */}
      <svg className="theme-sun" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
      </svg>
      {/* Moon — shown on the light theme, click to go dark */}
      <svg className="theme-moon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z" />
      </svg>
    </motion.button>
  );
}
