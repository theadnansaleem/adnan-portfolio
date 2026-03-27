"use client";

import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, useSpring, animate } from 'framer-motion';
import { useTilt } from '@/hooks/useTilt';
import SectionLabel from '@/components/ui/SectionLabel';
import { stats } from '@/lib/data';
import type { Stat } from '@/types';

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [inView, value, motionVal]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  // UPDATED: new useTilt API — no ref param, returns MotionValues
  const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt(10);

  const numeric = parseInt(stat.number, 10);
  const isNumeric = !isNaN(numeric);
  const suffix = isNumeric ? stat.number.replace(/[0-9]/g, '') : '';

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, scale: 0.88, y: 24, filter: 'blur(6px)' }}
      animate={
        isInView
          ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, scale: 0.88, y: 24, filter: 'blur(6px)' }
      }
      whileHover={{ y: -6, borderColor: 'rgba(232,255,71,0.35)' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        padding: 'clamp(20px, 3vw, 36px) clamp(16px, 2.5vw, 32px)',
        rotateX,
        rotateY,
        transformPerspective: 900,
        willChange: 'transform',
        cursor: 'default',
        position: 'relative' as const,
        overflow: 'hidden',
      }}
    >
      <div
        className="shimmer"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
      <div
        style={{
          fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
          fontSize: 'clamp(44px, 8vw, 68px)',
          color: 'var(--accent)',
          lineHeight: 1,
          marginBottom: '10px',
          letterSpacing: '-0.02em',
        }}
      >
        {isNumeric ? <AnimatedNumber value={numeric} suffix={suffix} /> : stat.number}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono, "DM Mono"), monospace',
          fontSize: '12px',
          color: 'var(--muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
        }}
      >
        {stat.label}
      </div>
    </motion.div>
  );
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // ── Mouse parallax setup ─────────────────────────────────────────────────
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springCfg = { stiffness: 45, damping: 14, mass: 1 };
  const smoothX = useSpring(mouseX, springCfg);
  const smoothY = useSpring(mouseY, springCfg);

  const orb1X = useTransform(smoothX, [0, 1], [-60, 60]);
  const orb1Y = useTransform(smoothY, [0, 1], [-40, 40]);
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
      id="about"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: 'clamp(60px, 10vw, 120px) clamp(20px, 4vw, 48px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Atmosphere layer ─────────────────────────────────────────────── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <motion.div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 'clamp(400px,55vw,800px)', height: 'clamp(400px,55vw,800px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,255,71,0.08) 0%, rgba(232,255,71,0.025) 40%, transparent 70%)', filter: 'blur(40px)', x: orb1X, y: orb1Y }} />
        <motion.div style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: 'clamp(250px,35vw,550px)', height: 'clamp(250px,35vw,550px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,71,71,0.05) 0%, transparent 70%)', filter: 'blur(60px)', x: orb2X, y: orb2Y }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 100%)' }} />
      </div>

      {/* ── Ghost text ───────────────────────────────────────────────────── */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0, pointerEvents: 'none', userSelect: 'none' }}>
        <motion.div style={{ x: ghostX, y: ghostY }}>
          <span style={{ fontFamily: 'var(--font-display,"Bebas Neue"),cursive', fontSize: 'clamp(120px,20vw,320px)', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.04)', whiteSpace: 'nowrap', letterSpacing: '0.06em', display: 'block' }}>
            ABOUT
          </span>
        </motion.div>
      </div>

      {/* ── Content — counter-parallax ───────────────────────────────────── */}
      <motion.div style={{ x: contentX, y: contentY, position: 'relative', zIndex: 1 }}>
        <SectionLabel number="001" text="About Me" />

        <div
          ref={ref}
          style={{
            display: 'grid',
            alignItems: 'center',
          }}
          className="grid-cols-2 gap-20 max-lg:grid-cols-1 max-lg:gap-16 max-md:gap-12"
        >
          {/* Left — Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {[
              <>
                I&apos;m a{' '}
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Senior Software Engineer</strong>{' '}
                based in Sahiwal with 7+ years of experience building production-ready software
                that is fast, accessible, and visually refined.
              </>,
              <>
                My work lives at the intersection of{' '}
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>engineering and AI</strong>{' '}
                — I don&apos;t just build UIs, I architect complete workflows that bridge design tools,
                code, and intelligent systems.
              </>,
              <>
                Currently focused on the{' '}
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>next iteration</strong> of
                human-computer interaction: AI-native development environments, multi-agent pipelines,
                and design-to-code automation.
              </>,
            ].map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', opacity: 0.65, fontWeight: 300, lineHeight: 1.8 }}
              >
                {para}
              </motion.p>
            ))}

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '1px',
                background: 'linear-gradient(90deg, var(--accent), transparent)',
                transformOrigin: 'left',
                marginTop: '8px',
              }}
            />
          </div>

          {/* Right — Stats */}
          <div
            style={{ display: 'grid', gap: '2px' }}
            className="grid-cols-2 max-sm:grid-cols-1"
          >
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
