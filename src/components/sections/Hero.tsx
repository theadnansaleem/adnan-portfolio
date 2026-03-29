"use client";

import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useMusicPlayer } from '@/context/MusicPlayerContext';

/**
 * Hero uses THREE layered parallax systems:
 *
 *  1. SCROLL PARALLAX — ghost text drifts down + scales as user scrolls
 *  2. MOUSE PARALLAX — each depth layer (orbs, ghost text, content) moves at
 *     a different speed in the mouse direction, creating genuine Z-depth illusion.
 *     Driven by useMotionValue + useSpring (zero re-renders).
 *  3. STAGGER REVEAL — title lines zoom + slide up on load with spring easing.
 */
export default function Hero() {
  const [videoReady, setVideoReady] = useState(false);
  const scrollY = useScrollProgress();
  const { triggerPlay } = useMusicPlayer();

  // ── Mouse parallax setup ─────────────────────────────────────────────────
  // Normalized 0→1, centred at 0.5
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Lazy spring — slow, drifting feel matches the atmospheric aesthetic
  const springCfg = { stiffness: 45, damping: 14, mass: 1 };
  const smoothX = useSpring(mouseX, springCfg);
  const smoothY = useSpring(mouseY, springCfg);

  // Each layer gets its own range — farther "back" = larger offset
  const ghostX   = useTransform(smoothX, [0, 1], [-70, 70]);
  const ghostY   = useTransform(smoothY, [0, 1], [-30, 30]);

  const orb1X    = useTransform(smoothX, [0, 1], [-90, 90]);
  const orb1Y    = useTransform(smoothY, [0, 1], [-55, 55]);

  const orb2X    = useTransform(smoothX, [0, 1], [80, -80]);
  const orb2Y    = useTransform(smoothY, [0, 1], [50, -50]);

  // Foreground content moves against mouse (counter-parallax) — feels closest
  const contentX = useTransform(smoothX, [0, 1], [10, -10]);
  const contentY = useTransform(smoothY, [0, 1], [6, -6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX / rect.width);
    mouseY.set(e.clientY / rect.height);
  };

  // Reset parallax when mouse leaves the section
  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // ── Title animation variants ─────────────────────────────────────────────
  const titleVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.35 } },
  };

  const lineVariants = {
    hidden: { y: '108%', scale: 0.96 },
    visible: {
      y: '0%',
      scale: 1,
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
      className="px-12 pb-20 max-md:px-6 max-md:pb-16 [@media(max-height:850px)]:pb-10"
    >
      {/* ── Video background — deepest layer ────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
      >
        {/* Raw video — fills the frame */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => { setVideoReady(true); triggerPlay(); }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: videoReady ? 0.38 : 0,
            transition: 'opacity 1.4s ease',
            willChange: 'opacity',
          }}
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>

        {/* 4-stop gradient: transparent top → heavy bottom — blends into --bg */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: [
              'linear-gradient(to bottom,',
              '  rgba(5,5,5,0.55) 0%,',
              '  rgba(5,5,5,0.20) 30%,',
              '  rgba(5,5,5,0.45) 65%,',
              '  rgba(5,5,5,0.97) 100%',
              ')',
            ].join(' '),
          }}
        />

        {/* Side vignette — prevents harsh edges on wide screens */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(5,5,5,0.75) 100%)',
          }}
        />
      </div>

      {/* ── Atmospheric orbs — each on its own parallax layer ───────────── */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}
      >
        {/* Accent orb — top-right, layer 1 */}
        <motion.div
          style={{
            position: 'absolute',
            top: '-15%',
            right: '-10%',
            width: 'clamp(400px, 60vw, 900px)',
            height: 'clamp(400px, 60vw, 900px)',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(232,255,71,0.08) 0%, rgba(232,255,71,0.025) 40%, transparent 70%)',
            filter: 'blur(40px)',
            x: orb1X,
            y: orb1Y,
          }}
        />

        {/* Accent2 orb — bottom-left, layer 2 (moves opposite) */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '-5%',
            left: '-8%',
            width: 'clamp(300px, 40vw, 600px)',
            height: 'clamp(300px, 40vw, 600px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,71,71,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
            x: orb2X,
            y: orb2Y,
          }}
        />

        {/* Dot grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage:
              'radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 100%)',
          }}
        />

        {/* Bottom rule */}
        <div
          style={{
            position: 'absolute',
            bottom: '180px',
            height: '1px',
            background: 'var(--border)',
          }}
          className="left-12 right-12 max-md:left-6 max-md:right-6 [@media(max-height:850px)]:hidden"
        />
      </div>

      {/* ── Ghost parallax text — deepest layer (scroll + mouse) ────────── */}
      {/* Outer div: scroll parallax */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          willChange: 'transform',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 2,
          // Scroll-driven transform: translateY + scale
          transform: `translate(-50%, -50%) translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0003})`,
        }}
      >
        {/* Inner motion.div: mouse parallax layered on top of scroll */}
        <motion.div style={{ x: ghostX, y: ghostY }}>
          <span
            style={{
              fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
              fontSize: 'clamp(80px, 22vw, 360px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.04)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.06em',
              display: 'block',
            }}
          >
            ENGINEER
          </span>
        </motion.div>
      </div>

      {/* ── Foreground content — counter-parallax (closest layer) ───────── */}
      <motion.div style={{ x: contentX, y: contentY, position: 'relative', zIndex: 3 }}>
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: 'min(28px, 4vh)',
            padding: '8px 16px',
            border: '1px solid rgba(232,255,71,0.18)',
            background: 'rgba(232,255,71,0.04)',
            backdropFilter: 'blur(4px)',
            width: 'fit-content',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#4ade80',
              display: 'inline-block',
              boxShadow: '0 0 10px rgba(74,222,128,0.7)',
              animation: 'pulse-dot 2s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono, "DM Mono"), monospace',
              fontSize: '11px',
              color: 'var(--accent)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
            }}
          >
            Available for opportunities · Open to GCC Roles
          </span>
        </motion.div>

        {/* Hero title — staggered zoom-slide reveal */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          style={{ marginBottom: 'min(56px, 6vh)' }}
        >
          {/* Semantic h1 wraps all title words — one per page for SEO */}
          <h1 style={{ margin: 0, padding: 0, lineHeight: 0.92 }}>
            {(['Senior', 'Software', 'Engineer'] as const).map((word, i) => (
              <div key={word} style={{ overflow: 'hidden', lineHeight: 0.92 }}>
                <motion.span
                  variants={lineVariants}
                  className="hero-title-word"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
                    fontSize: 'clamp(52px, min(14vw, 22vh), 210px)',
                    lineHeight: 0.88,
                    letterSpacing: '-0.02em',
                    color: i === 2 ? 'var(--accent)' : 'var(--text)',
                  }}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </h1>
        </motion.div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap' as const,
            gap: '24px',
          }}
          className="max-md:flex-col max-md:items-start max-md:gap-6"
        >
          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: '15px',
              color: 'var(--text)',
              opacity: 0.5,
              fontWeight: 300,
              maxWidth: 'min(380px, 100%)',
              lineHeight: 1.75,
            }}
          >
            <strong style={{ fontWeight: 'inherit' }}>Muhammad Adnan Saleem</strong> — building
            production-grade interfaces at the intersection of design, engineering, and AI.
            Frontend Developer &amp; Software Engineer based in Sahiwal, Pakistan.
          </motion.p>

          {/* CTA */}
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: 'clamp(14px, 2vw, 20px) clamp(24px, 3.5vw, 40px)',
              background: 'var(--accent)',
              color: '#000',
              fontFamily: 'var(--font-mono, "DM Mono"), monospace',
              fontSize: '13px',
              letterSpacing: '0.12em',
              textDecoration: 'none',
              fontWeight: 500,
              textTransform: 'uppercase' as const,
            }}
            whileHover="hovered"
          >
            <motion.span
              variants={{ hovered: { x: '0%' } }}
              initial={{ x: '-101%' }}
              style={{ position: 'absolute', inset: 0, background: '#111' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.span
              style={{ position: 'relative', zIndex: 1 }}
              variants={{ hovered: { color: 'var(--accent)' } }}
              transition={{ duration: 0.2 }}
            >
              Let&apos;s Build Together
            </motion.span>
            <motion.span
              style={{ position: 'relative', zIndex: 1, fontSize: '18px' }}
              variants={{ hovered: { color: 'var(--accent)', x: 4, y: -4 } }}
              transition={{ duration: 0.2 }}
            >
              ↗
            </motion.span>
          </motion.a>
        </div>
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '88px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          zIndex: 4,
        }}
        className="max-md:hidden [@media(max-height:850px)]:hidden"
      >
        <span
          style={{
            fontFamily: 'var(--font-mono, "DM Mono"), monospace',
            fontSize: '9px',
            color: 'var(--muted)',
            writingMode: 'vertical-rl',
            letterSpacing: '0.25em',
            textTransform: 'uppercase' as const,
          }}
        >
          Scroll
        </span>
        <div
          className="scroll-line"
          style={{
            width: '1px',
            height: '64px',
            background: 'linear-gradient(to bottom, var(--accent), transparent)',
          }}
        />
      </motion.div>
    </section>
  );
}
