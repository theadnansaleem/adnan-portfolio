"use client";

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import { projects } from '@/lib/data';
import type { Project } from '@/types';

// Per-project accent orb positions
const ORB_POSITIONS = [
  { top: '45%', left: '35%' },  // DevOps AI
  { top: '30%', left: '62%' },  // Instruction Stability Engine
  { top: '55%', left: '25%' },  // Enterprise Component Library
  { top: '20%', left: '50%' },  // AI Code Review System
  { top: '65%', left: '42%' },  // WhatsApp Automation Platform
  { top: '38%', left: '68%' },  // Quran Application
  { top: '50%', left: '30%' },  // Smart Khateeb
];

const WIPE_TRANSITION = {
  duration: 0.65,
  ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
};

// ── Left panel visual ─────────────────────────────────────────────────────
function ProjectVisual({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const orb = ORB_POSITIONS[index % ORB_POSITIONS.length];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      key={project.id}
      initial={{ clipPath: 'inset(100% 0 0% 0)' }}
      animate={{ clipPath: 'inset(0% 0 0% 0)' }}
      exit={{ clipPath: 'inset(0% 0 100% 0)' }}
      transition={WIPE_TRANSITION}
      onMouseEnter={() => { if (project.image) setIsHovered(true); }}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        inset: 0,
        cursor: project.image ? 'pointer' : 'default',
      }}
    >
      {/* Perspective wrapper */}
      <div style={{ position: 'absolute', inset: 0, perspective: 1200 }}>
        {/* Flipper */}
        <motion.div
          animate={{ rotateY: isHovered ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* FRONT — gradient + orb (unchanged) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: project.gradient,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              overflow: 'hidden',
            }}
          >
            {/* Giant ghost number — outline text, 4% opacity */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
                fontSize: '32vw',
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255,255,255,0.04)',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {project.number}
            </div>

            {/* Horizontal scan line */}
            <div
              aria-hidden="true"
              className="scroll-line"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent, rgba(232,255,71,0.25), transparent)',
                pointerEvents: 'none',
              }}
            />

            {/* Pulsing accent orb */}
            <motion.div
              aria-hidden="true"
              animate={{ scale: [1, 1.2, 1], opacity: [0.45, 0.75, 0.45] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: orb.top,
                left: orb.left,
                transform: 'translate(-50%, -50%)',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(232,255,71,0.14) 0%, transparent 70%)',
                filter: 'blur(32px)',
                pointerEvents: 'none',
              }}
            />

            {/* Bottom overlay gradient */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)',
                pointerEvents: 'none',
              }}
            />

            {/* Bottom-left badge: number + first tag */}
            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                left: '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                {project.number}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                  fontSize: '10px',
                  color: 'var(--accent)',
                  border: '1px solid rgba(232,255,71,0.3)',
                  background: 'rgba(232,255,71,0.06)',
                  padding: '3px 10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {project.tags[0]}
              </span>
            </div>

            {/* Right edge 1px accent line */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '1px',
                height: '100%',
                background:
                  'linear-gradient(to bottom, transparent 0%, rgba(232,255,71,0.25) 40%, rgba(232,255,71,0.25) 60%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Hover hint — only if has image */}
            {project.image && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                hover to preview
              </div>
            )}
          </div>

          {/* BACK — screenshot (only if project.image exists) */}
          {project.image && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                overflow: 'hidden',
              }}
            >
              {/* Screenshot */}
              <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover' }} priority={false} />

              {/* L1 — Yellow colour wash */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(232,255,71,0.06)', pointerEvents: 'none' }} />

              {/* L2 — Bottom gradient */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(232,255,71,0.08) 18%, transparent 52%)',
              }} />

              {/* L3 — Top dark fade */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 22%)',
              }} />

              {/* L4 — Viewfinder corner brackets */}
              {/* top-left */}
              <div style={{ position: 'absolute', top: 12, left: 12, width: 28, height: 28,
                borderTop: '2px solid rgba(232,255,71,0.7)', borderLeft: '2px solid rgba(232,255,71,0.7)', pointerEvents: 'none' }} />
              {/* top-right */}
              <div style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28,
                borderTop: '2px solid rgba(232,255,71,0.7)', borderRight: '2px solid rgba(232,255,71,0.7)', pointerEvents: 'none' }} />
              {/* bottom-left */}
              <div style={{ position: 'absolute', bottom: 12, left: 12, width: 28, height: 28,
                borderBottom: '2px solid rgba(232,255,71,0.7)', borderLeft: '2px solid rgba(232,255,71,0.7)', pointerEvents: 'none' }} />
              {/* bottom-right */}
              <div style={{ position: 'absolute', bottom: 12, right: 12, width: 28, height: 28,
                borderBottom: '2px solid rgba(232,255,71,0.7)', borderRight: '2px solid rgba(232,255,71,0.7)', pointerEvents: 'none' }} />

              {/* L5 — Right-edge accent line */}
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '1px', height: '100%', pointerEvents: 'none',
                background: 'linear-gradient(to bottom, transparent 0%, rgba(232,255,71,0.4) 35%, rgba(232,255,71,0.4) 65%, transparent 100%)',
              }} />

              {/* L6 — Label */}
              <div style={{ position: 'absolute', bottom: 20, left: 16, pointerEvents: 'none', userSelect: 'none' }}>
                <span style={{
                  fontFamily: 'var(--font-mono, "DM Mono"), monospace', fontSize: '10px',
                  color: 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase',
                  display: 'block', marginBottom: '4px',
                }}>
                  {project.number}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono, "DM Mono"), monospace', fontSize: '11px',
                  color: 'rgba(255,255,255,0.75)', letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  {project.title}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Right panel: single project item ─────────────────────────────────────
function ProjectItem({
  project,
  isActive,
}: {
  project: Project;
  isActive: boolean;
}) {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 clamp(32px, 5vw, 80px)',
        position: 'relative',
      }}
    >
      {/* Left accent bar */}
      <motion.div
        animate={{
          scaleY: isActive ? 1 : 0,
          opacity: isActive ? 1 : 0,
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{
          position: 'absolute',
          left: 0,
          top: '25%',
          height: '50%',
          width: '2px',
          background: 'var(--accent)',
          transformOrigin: 'top',
        }}
      />

      <div style={{ maxWidth: '460px' }}>
        {/* Number + category row */}
        <motion.div
          animate={{ opacity: isActive ? 1 : 0.25 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '28px',
            fontFamily: 'var(--font-mono, "DM Mono"), monospace',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>{project.number}</span>
          <span
            style={{
              display: 'inline-block',
              width: '36px',
              height: '1px',
              background: 'rgba(255,255,255,0.18)',
            }}
          />
          <span style={{ color: 'var(--muted)' }}>
            {project.tags.join(' · ')}
          </span>
        </motion.div>

        {/* Title — split-word mask reveal */}
        <h3
          style={{
            fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
            fontSize: 'clamp(38px, 4.5vw, 68px)',
            lineHeight: 1.05,
            letterSpacing: '0.02em',
            marginBottom: '28px',
          }}
        >
          {project.title.split(' ').map((word, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                marginRight: '0.22em',
              }}
            >
              <motion.span
                style={{ display: 'inline-block' }}
                animate={
                  isActive
                    ? { y: '0%', opacity: 1 }
                    : { y: '110%', opacity: 0 }
                }
                transition={{
                  duration: 0.65,
                  delay: i * 0.07,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h3>

        {/* Description */}
        <motion.p
          animate={{ opacity: isActive ? 0.5 : 0, y: isActive ? 0 : 12 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: '14px',
            lineHeight: 1.72,
            fontWeight: 300,
            marginBottom: '28px',
            color: 'var(--text)',
            margin: '0 0 28px',
          }}
        >
          {project.description}
        </motion.p>

        {/* Tags */}
        <motion.div
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '32px',
          }}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                fontSize: '10px',
                color: 'var(--accent)',
                border: '1px solid rgba(232,255,71,0.3)',
                background: 'rgba(232,255,71,0.06)',
                padding: '3px 10px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {project.href && (
            <a
              href={project.href}
              style={{
                fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                fontSize: '12px',
                color: 'var(--accent)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(232,255,71,0.35)',
                letterSpacing: '0.08em',
                paddingBottom: '3px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Visit {new URL(project.href).hostname} ↗
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ── Mobile card (simplified vertical stack) ───────────────────────────────
function MobileProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => { if (project.image) setFlipped((f) => !f); }}
      style={{
        position: 'relative',
        border: '1px solid var(--border)',
        aspectRatio: '4/3',
        cursor: project.image ? 'pointer' : 'default',
        perspective: 1200,
      }}
    >
      {/* Flipper */}
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* FRONT — gradient + content (unchanged) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div
            style={{ position: 'absolute', inset: 0, background: project.gradient }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
                marginBottom: '10px',
              }}
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                    fontSize: '9px',
                    color: 'var(--accent)',
                    border: '1px solid rgba(232,255,71,0.3)',
                    padding: '2px 8px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
                fontSize: 'clamp(24px, 6vw, 40px)',
                letterSpacing: '0.02em',
                lineHeight: 1,
                marginBottom: '8px',
              }}
            >
              {project.title}
            </h3>
            <p
              style={{
                fontSize: '12px',
                opacity: 0.45,
                fontWeight: 300,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {project.description}
            </p>
            {project.image ? (
              <span
                style={{
                  fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginTop: '12px',
                }}
              >
                tap to preview
              </span>
            ) : project.href && (
                <a
                  href={project.href}
                  style={{
                    fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                    fontSize: '11px',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(232,255,71,0.35)',
                    letterSpacing: '0.08em',
                    paddingBottom: '2px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    marginTop: '16px',
                  }}
                >
                  Visit {new URL(project.href).hostname} ↗
                </a>
            )}
          </div>
        </div>

        {/* BACK — screenshot (only if project.image exists) */}
        {project.image && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Screenshot */}
            <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover' }} />

            {/* L1 — Yellow colour wash */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(232,255,71,0.06)', pointerEvents: 'none' }} />

            {/* L2 — Bottom gradient */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(232,255,71,0.08) 18%, transparent 52%)',
            }} />

            {/* L3 — Top dark fade */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 22%)',
            }} />

            {/* L4 — Viewfinder corner brackets (22×22, inset 10px for mobile) */}
            {/* top-left */}
            <div style={{ position: 'absolute', top: 10, left: 10, width: 22, height: 22,
              borderTop: '2px solid rgba(232,255,71,0.7)', borderLeft: '2px solid rgba(232,255,71,0.7)', pointerEvents: 'none' }} />
            {/* top-right */}
            <div style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22,
              borderTop: '2px solid rgba(232,255,71,0.7)', borderRight: '2px solid rgba(232,255,71,0.7)', pointerEvents: 'none' }} />
            {/* bottom-left */}
            <div style={{ position: 'absolute', bottom: 10, left: 10, width: 22, height: 22,
              borderBottom: '2px solid rgba(232,255,71,0.7)', borderLeft: '2px solid rgba(232,255,71,0.7)', pointerEvents: 'none' }} />
            {/* bottom-right */}
            <div style={{ position: 'absolute', bottom: 10, right: 10, width: 22, height: 22,
              borderBottom: '2px solid rgba(232,255,71,0.7)', borderRight: '2px solid rgba(232,255,71,0.7)', pointerEvents: 'none' }} />

            {/* L5 — Right-edge accent line */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '1px', height: '100%', pointerEvents: 'none',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(232,255,71,0.4) 35%, rgba(232,255,71,0.4) 65%, transparent 100%)',
            }} />

            {/* L6 — Label + View project link */}
            <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, pointerEvents: 'none', userSelect: 'none' }}>
              <span style={{
                fontFamily: 'var(--font-mono, "DM Mono"), monospace', fontSize: '9px',
                color: 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase',
                display: 'block', marginBottom: '3px',
              }}>
                {project.number}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono, "DM Mono"), monospace', fontSize: '10px',
                color: 'rgba(255,255,255,0.75)', letterSpacing: '0.08em', textTransform: 'uppercase',
                display: 'block', marginBottom: '12px',
              }}>
                {project.title}
              </span>
              {project.href && (
                <a
                  href={project.href}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                    fontSize: '11px',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(232,255,71,0.35)',
                    letterSpacing: '0.08em',
                    paddingBottom: '2px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    pointerEvents: 'auto',
                  }}
                >
                  Visit {new URL(project.href).hostname} ↗
                </a>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scroll tracking — target the outer section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Continuous float index 0 → N-1
  const floatIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, projects.length - 1]
  );

  useMotionValueEvent(floatIndex, 'change', (v) => {
    setActiveIndex(
      Math.round(Math.max(0, Math.min(projects.length - 1, v)))
    );
  });

  // Right panel Y: raw transform — no spring, no jank with Lenis
  const rightY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0vh', `${-(projects.length - 1) * 100}vh`]
  );

  // Scroll to a specific project by computing its position in the section
  const scrollToProject = (index: number) => {
    const el = sectionRef.current;
    if (!el) return;
    // Each project occupies exactly 1 viewport of scroll within the section
    const sectionTop = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: sectionTop + index * window.innerHeight, behavior: 'smooth' });
  };

  // ── Mobile layout ──────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section
        id="projects"
        style={{
          padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 40px)',
          background: 'var(--bg2)',
        }}
      >
        <SectionLabel number="004" text="Projects" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {projects.map((project, i) => (
            <MobileProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>
    );
  }

  // ── Desktop: sticky scroll panel ──────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{
        height: `${projects.length * 100}vh`,
        background: 'var(--bg2)',
        position: 'relative',
      }}
    >
      {/* Sticky viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* ── LEFT PANEL (55%) ────────────────────────────────────────── */}
        <div
          style={{
            width: '55%',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {/* Section label overlay */}
          <div
            style={{
              position: 'absolute',
              top: 'clamp(76px, 9vh, 100px)',
              left: 'clamp(24px, 3vw, 48px)',
              zIndex: 10,
            }}
          >
            <SectionLabel number="004" text="Projects" />
          </div>

          <AnimatePresence mode="wait">
            <ProjectVisual
              key={activeIndex}
              project={projects[activeIndex]}
              index={activeIndex}
            />
          </AnimatePresence>
        </div>

        {/* ── DIVIDER ─────────────────────────────────────────────────── */}
        <div
          style={{
            width: '1px',
            background:
              'linear-gradient(to bottom, transparent 0%, var(--border) 15%, var(--border) 85%, transparent 100%)',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {/* Pulsing dot at midpoint */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
        </div>

        {/* ── RIGHT PANEL (45%) ───────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Raw Y transform — no spring wrapper */}
          <motion.div style={{ y: rightY }}>
            {projects.map((project, i) => (
              <ProjectItem
                key={project.id}
                project={project}
                isActive={i === activeIndex}
              />
            ))}
          </motion.div>
        </div>

        {/* ── PROGRESS TICKS (far right edge) ─────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            // Minus half of the 24px hit box, so the 2px tick keeps its old position
            right: 'calc(clamp(14px, 2vw, 28px) - 11px)',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToProject(i)}
              // 24x24 hit box meets the WCAG 2.2 target size; the visible tick stays 2px wide
              style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label={`Go to project ${i + 1}: ${projects[i].title}`}
            >
              <motion.span
                animate={{
                  height: i === activeIndex ? 24 : 8,
                  background:
                    i === activeIndex ? 'var(--accent)' : 'var(--muted)',
                  opacity: i === activeIndex ? 1 : 0.5,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                style={{ width: '2px', borderRadius: '1px' }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
