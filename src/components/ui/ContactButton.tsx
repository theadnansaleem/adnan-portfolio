"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ContactButtonProps {
  label: string;
  href: string;
  isEmail?: boolean;
  newTab?: boolean;
}

export default function ContactButton({ label, href, isEmail, newTab }: ContactButtonProps) {
  const [hovered, setHovered] = useState(false);
  const opensNewTab = newTab || href.startsWith('http');

  return (
    <motion.a
      href={href}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noopener noreferrer' : undefined}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: 'clamp(12px, 2vw, 18px) clamp(20px, 3vw, 36px)',
        border: '1px solid var(--chip-line)',
        background: 'var(--chip-bg)',
        fontFamily: 'var(--font-mono, "DM Mono"), monospace',
        fontSize: '13px',
        letterSpacing: '0.1em',
        textDecoration: 'none',
        color: hovered ? '#000' : 'var(--text)',
        transition: 'color 0.25s',
        textTransform: 'uppercase' as const,
        cursor: 'pointer',
      }}
      whileHover={{ borderColor: 'var(--accent)' }}
      transition={{ duration: 0.25 }}
    >
      {/* Accent fill slides up from bottom */}
      <motion.span
        initial={{ y: '101%' }}
        animate={{ y: hovered ? '0%' : '101%' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--accent-fill)',
          zIndex: 0,
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
      {isEmail && (
        <span style={{ position: 'relative', zIndex: 1, opacity: hovered ? 1 : 0.5, transition: 'opacity 0.2s' }}>
          ↗
        </span>
      )}
    </motion.a>
  );
}
