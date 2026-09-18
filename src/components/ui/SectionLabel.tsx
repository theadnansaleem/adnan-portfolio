"use client";

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionLabelProps {
  number: string;
  text: string;
}

export default function SectionLabel({ number, text }: SectionLabelProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.h2
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '64px',
      }}
    >
      {/* Gradient line — more premium than a flat accent line */}
      <div
        className="section-label-line"
        style={{ width: '40px', height: '1px', flexShrink: 0 }}
      />
      <span
        style={{
          fontFamily: 'var(--font-mono, "DM Mono"), monospace',
          fontSize: '11px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase' as const,
          color: 'var(--accent)',
        }}
      >
        <span aria-hidden="true">{number} — </span>{text}
      </span>
    </motion.h2>
  );
}
