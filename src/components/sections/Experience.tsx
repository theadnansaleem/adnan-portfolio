"use client";

import { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import SectionLabel from '@/components/ui/SectionLabel';
import { jobs } from '@/lib/data';
import type { Job } from '@/types';

function JobItem({ job, index }: { job: Job; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.93, y: 32, filter: 'blur(6px)' }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, scale: 0.93, y: 32, filter: 'blur(6px)' }}
      whileHover="hovered"
      variants={{
        hovered: {
          paddingLeft: '60px',
          backgroundColor: 'rgba(232,255,71,0.018)',
          transition: {
            paddingLeft: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
            backgroundColor: { duration: 0.4 },
          },
        },
      }}
      transition={{ duration: 0.75, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        padding: 'clamp(24px, 3vw, 40px) clamp(20px, 4vw, 48px)',
        display: 'grid',
        gap: 'clamp(20px, 3vw, 40px)',
        alignItems: 'start',
        cursor: 'default',
      }}
      className="[grid-template-columns:200px_1fr_auto] max-lg:grid-cols-1"
    >
      {/* Accent bar */}
      <motion.div
        variants={{
          hovered: {
            scaleY: 1,
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          },
        }}
        initial={{ scaleY: 0 }}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          background: 'linear-gradient(to bottom, var(--accent), rgba(232,255,71,0.3))',
          transformOrigin: 'top',
        }}
      />

      {/* Period */}
      <div
        style={{
          fontFamily: 'var(--font-mono, "DM Mono"), monospace',
          fontSize: '12px',
          color: 'var(--muted)',
          paddingTop: '6px',
          letterSpacing: '0.06em',
        }}
      >
        {job.period}
      </div>

      {/* Content */}
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
            fontSize: 'clamp(22px, 4vw, 32px)',
            letterSpacing: '0.04em',
            marginBottom: '6px',
            lineHeight: 1,
          }}
        >
          {job.company}
        </h3>
        <div
          style={{
            fontFamily: 'var(--font-mono, "DM Mono"), monospace',
            fontSize: '11px',
            backgroundColor: 'var(--accent-fill)',
            color: '#000',
            letterSpacing: '0.06em',
            marginBottom: '16px',
            textTransform: 'uppercase' as const,
            display: 'inline-block',
            padding: '2px 10px',
          }}
        >
          {job.role}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono, "DM Mono"), monospace',
            fontSize: '11px',
            color: 'var(--muted)',
            letterSpacing: '0.06em',
            marginBottom: '16px',
          }}
        >
          {job.location} · {job.workMode}
        </div>
        <ul
          style={{
            fontSize: '14px',
            opacity: 'var(--dim)',
            lineHeight: 1.75,
            marginBottom: '20px',
            maxWidth: '640px',
            paddingLeft: '18px',
            listStyle: 'disc',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {job.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
          {job.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                fontSize: '11px',
                padding: '4px 12px',
                border: '1px solid var(--chip-line)',
                background: 'var(--chip-bg)',
                color: 'var(--muted)',
                letterSpacing: '0.05em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <motion.span
        variants={{ hovered: { x: 4, y: -4, color: 'var(--accent)' } }}
        style={{
          fontSize: '22px',
          color: 'var(--muted)',
          display: 'inline-block',
          transition: 'color 0.3s',
          paddingTop: '4px',
        }}
        className="max-md:hidden"
      >
        ↗
      </motion.span>
    </motion.div>
  );
}

export default function Experience() {
  const scrollY = useScrollProgress();

  // ── Mouse parallax setup ─────────────────────────────────────────────────
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springCfg = { stiffness: 45, damping: 14, mass: 1 };
  const smoothX = useSpring(mouseX, springCfg);
  const smoothY = useSpring(mouseY, springCfg);

  // Orb 1: top-LEFT (variety from About)
  const orb1X = useTransform(smoothX, [0, 1], [-60, 60]);
  const orb1Y = useTransform(smoothY, [0, 1], [-40, 40]);
  // Orb 2: bottom-right (inverted)
  const orb2X = useTransform(smoothX, [0, 1], [50, -50]);
  const orb2Y = useTransform(smoothY, [0, 1], [35, -35]);
  const ghostX = useTransform(smoothX, [0, 1], [-40, 40]);
  const ghostY = useTransform(smoothY, [0, 1], [-20, 20]);
  const contentX = useTransform(smoothX, [0, 1], [8, -8]);
  const contentY = useTransform(smoothY, [0, 1], [5, -5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX / rect.width);
    mouseY.set(e.clientY / rect.height);
  };
  const handleMouseLeave = () => { mouseX.set(0.5); mouseY.set(0.5); };

  return (
    <section
      id="experience"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ background: 'var(--bg2)', padding: '120px 0', position: 'relative', overflow: 'hidden' }}
    >
      {/* ── Atmosphere layer ─────────────────────────────────────────────── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <motion.div style={{ position: 'absolute', bottom: '-10%', right: '-8%', width: 'clamp(400px,55vw,800px)', height: 'clamp(400px,55vw,800px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--orb-a-rgb),0.08) 0%, rgba(var(--orb-a-rgb),0.025) 40%, transparent 70%)', filter: 'blur(40px)', x: orb1X, y: orb1Y }} />
        <motion.div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 'clamp(250px,35vw,550px)', height: 'clamp(250px,35vw,550px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--orb-b-rgb),0.05) 0%, transparent 70%)', filter: 'blur(60px)', x: orb2X, y: orb2Y }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--dot) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 100%)' }} />
      </div>

      {/* ── Ghost text with scroll drift ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: `translate(-50%, calc(-50% + ${scrollY * 0.08}px))`,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <motion.div style={{ x: ghostX, y: ghostY }}>
          <span style={{ fontFamily: 'var(--font-display,"Bebas Neue"),cursive', fontSize: 'clamp(120px,20vw,320px)', color: 'transparent', WebkitTextStroke: '1px var(--ghost)', whiteSpace: 'nowrap', letterSpacing: '0.06em', display: 'block' }}>
            002
          </span>
        </motion.div>
      </div>

      {/* ── Content — counter-parallax ───────────────────────────────────── */}
      <motion.div style={{ x: contentX, y: contentY, position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '0 48px' }} className="max-md:px-6">
          <SectionLabel number="002" text="Experience" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {jobs.map((job, i) => (
              <JobItem key={job.id} job={job} index={i} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
