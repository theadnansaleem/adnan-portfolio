"use client";

import { useState, useEffect } from 'react';

export default function Footer() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setTime(`Lahore · ${t}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const year = new Date().getFullYear();

  const monoStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono, "DM Mono"), monospace',
    fontSize: '11px',
    color: 'var(--muted)',
    letterSpacing: '0.1em',
  };

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap' as const,
        gap: '16px',
        position: 'relative',
      }}
      className="px-12 py-10 max-md:px-6 max-md:py-6 max-md:flex-col max-md:text-center"
    >
      {/* Gradient accent line — overlays the border-top with a glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, var(--accent) 30%, rgba(232,255,71,0.4) 60%, transparent 100%)',
          opacity: 0.4,
        }}
      />

      <span style={monoStyle}>© {year} M. Adnan Saleem. All rights reserved.</span>
      <span style={monoStyle}>Senior Full-Stack Software Engineer · Lahore, Pakistan</span>
      {/* key={time} remounts span on each tick → restarts clockGlow animation */}
      <span
        key={time}
        style={{ ...monoStyle, animation: 'clockGlow 0.6s ease-out forwards' }}
        suppressHydrationWarning
      >
        {time ?? ''}
      </span>
    </footer>
  );
}
