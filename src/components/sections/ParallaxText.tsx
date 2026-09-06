"use client";

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from 'framer-motion';

const lines = [
  { text: "BUILDING",    speed: -0.3,  style: "outlined" },
  { text: "THE FUTURE",  speed:  0.2,  style: "colored"  },
  { text: "ONE COMMIT",  speed: -0.15, style: "outlined" },
  { text: "AT A TIME",   speed:  0.1,  style: "filled"   },
] as const;

export default function ParallaxText() {
  const sectionRef = useRef<HTMLElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  // ── In-view detection for stagger reveal ─────────────────────────────────
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  // ── Scroll-driven parallax ────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Scroll X
  const rawLine0 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const rawLine1 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const rawLine2 = useTransform(scrollYProgress, [0, 1], [75, -75]);
  const rawLine3 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  // Scroll Y (alternating vertical drift)
  const rawLine0Y = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const rawLine1Y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const rawLine2Y = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const rawLine3Y = useTransform(scrollYProgress, [0, 1], [15, -15]);

  const springCfg = { stiffness: 55, damping: 20, mass: 1 };

  // Springs for scroll X
  const line0X = useSpring(rawLine0, springCfg);
  const line1X = useSpring(rawLine1, springCfg);
  const line2X = useSpring(rawLine2, springCfg);
  const line3X = useSpring(rawLine3, springCfg);

  // Springs for scroll Y
  const line0Y = useSpring(rawLine0Y, springCfg);
  const line1Y = useSpring(rawLine1Y, springCfg);
  const line2Y = useSpring(rawLine2Y, springCfg);
  const line3Y = useSpring(rawLine3Y, springCfg);

  const lineXValues = [line0X, line1X, line2X, line3X];
  const lineYValues = [line0Y, line1Y, line2Y, line3Y];

  // ── Mouse parallax ────────────────────────────────────────────────────────
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const orbSpring = { stiffness: 45, damping: 14, mass: 1 };
  const smoothX = useSpring(mouseX, orbSpring);
  const smoothY = useSpring(mouseY, orbSpring);

  // Orb transforms
  const orbAX = useTransform(smoothX, [0, 1], [-60, 60]);
  const orbAY = useTransform(smoothY, [0, 1], [-40, 40]);
  const orbBX = useTransform(smoothX, [0, 1], [50, -50]);
  const orbBY = useTransform(smoothY, [0, 1], [35, -35]);

  // Per-line mouse X (different magnitudes = different Z depths)
  const mouseX0 = useTransform(smoothX, [0, 1], [-18, 18]);
  const mouseX1 = useTransform(smoothX, [0, 1], [-28, 28]);
  const mouseX2 = useTransform(smoothX, [0, 1], [-12, 12]);
  const mouseX3 = useTransform(smoothX, [0, 1], [-22, 22]);

  // Per-line mouse Y
  const mouseY0 = useTransform(smoothY, [0, 1], [-10, 10]);
  const mouseY1 = useTransform(smoothY, [0, 1], [-16, 16]);
  const mouseY2 = useTransform(smoothY, [0, 1], [-8, 8]);
  const mouseY3 = useTransform(smoothY, [0, 1], [-13, 13]);

  const lineMouseXs = [mouseX0, mouseX1, mouseX2, mouseX3];
  const lineMouseYs = [mouseY0, mouseY1, mouseY2, mouseY3];

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX / rect.width);
    mouseY.set(e.clientY / rect.height);
  };
  const handleMouseLeave = () => { mouseX.set(0.5); mouseY.set(0.5); };

  const getStyle = (style: 'outlined' | 'colored' | 'filled'): React.CSSProperties => {
    if (style === 'outlined')
      return { color: 'transparent', WebkitTextStroke: '2px var(--stroke)' };
    if (style === 'colored')
      return {
        color: 'var(--accent)',
        textShadow: '0 0 60px rgba(232,255,71,0.35), 0 0 120px rgba(232,255,71,0.12)',
      };
    return { color: 'var(--text)' };
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: '160px 0',
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--bg)',
      }}
      className="max-md:py-24"
    >
      {/* ── Video background ─────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            opacity: videoReady ? 'var(--band-video)' : 0,
            mixBlendMode: 'screen' as const,
            transition: 'opacity 1.4s ease',
            willChange: 'opacity',
          }}
        >
          <source src="/Cinematic_abstract_seamless_1080p_20260221232.mp4" type="video/mp4" />
        </video>

        {/* Top + bottom gradient fade */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, var(--bg) 0%, transparent 25%, transparent 75%, var(--bg) 100%)',
          }}
        />

        {/* Overall darkness overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(var(--scrim-rgb),0.15)',
          }}
        />

        {/* Light-theme stand-in for the video — CSS only, hidden on dark */}
        <div aria-hidden="true" className="band-aurora" />

        {/* Atmospheric orbs — mouse-driven */}
        <motion.div style={{ position: 'absolute', top: '20%', right: '15%', width: 'clamp(300px,40vw,600px)', height: 'clamp(300px,40vw,600px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--orb-a-rgb),0.06) 0%, transparent 70%)', filter: 'blur(50px)', x: orbAX, y: orbAY }} />
        <motion.div style={{ position: 'absolute', bottom: '20%', left: '10%', width: 'clamp(200px,30vw,450px)', height: 'clamp(200px,30vw,450px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--orb-b-rgb),0.04) 0%, transparent 70%)', filter: 'blur(60px)', x: orbBX, y: orbBY }} />
      </div>

      {/* ── Parallax text lines ───────────────────────────────────────────── */}
      {lines.map((line, i) => (
        <motion.div
          key={i}
          style={{
            x: lineXValues[i],
            y: lineYValues[i],
            willChange: 'transform',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Mouse parallax layer */}
          <motion.div style={{ x: lineMouseXs[i], y: lineMouseYs[i] }}>
            {/* Clip mask for slide-up reveal */}
            <div style={{ overflow: 'hidden', lineHeight: 1.08 }}>
              <motion.span
                initial={{ y: 80, opacity: 0, filter: 'blur(8px)' }}
                animate={isInView ? { y: 0, opacity: 1, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.95, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
                  fontSize: 'clamp(36px, 11vw, 148px)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  whiteSpace: 'nowrap',
                  paddingLeft: 'clamp(16px, 4vw, 48px)',
                  ...getStyle(line.style),
                }}
              >
                {line.text}
              </motion.span>
            </div>

            {/* Decorative git label for "ONE COMMIT" */}
            {line.text === 'ONE COMMIT' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.18 + 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                  fontSize: 'clamp(10px, 1.2vw, 14px)',
                  color: 'var(--accent)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  paddingLeft: 'clamp(16px, 4vw, 48px)',
                  marginTop: '8px',
                  opacity: 0.7,
                }}
              >
                git commit -m &quot;ship it&quot;
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      ))}
    </section>
  );
}
