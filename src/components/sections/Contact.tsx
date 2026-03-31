"use client";

import { useState, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import RevealText from '@/components/ui/RevealText';
import SectionLabel from '@/components/ui/SectionLabel';

// Dynamic import to avoid SSR issues with WebGL
const ContactModel = dynamic(() => import('@/components/ui/ContactModel'), { ssr: false });

interface ContactButtonProps {
  label: string;
  href: string;
  isEmail?: boolean;
}

function ContactButton({ label, href, isEmail }: ContactButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
        border: '1px solid var(--border)',
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
          background: 'var(--accent)',
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

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

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

  const buttons = [
    { label: 'Email Me',    href: 'mailto:contact@theadnansaleem.com',                                    isEmail: true  },
    { label: 'LinkedIn',    href: 'https://www.linkedin.com/in/theadnan/'                             },
    { label: 'GitHub',      href: 'https://github.com/theadnansaleem?tab=repositories'                                },
    { label: 'Download CV', href: 'https://drive.google.com/file/d/1zxuwvoAxmLXlZEJlsYHrjV03xSxlmDYa/view?usp=sharing'                                                                                  },
  ];

  return (
    <section
      id="contact"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: 'var(--bg2)',
        padding: 'clamp(60px, 10vw, 140px) clamp(20px, 4vw, 48px) clamp(50px, 7vw, 100px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Atmosphere layer ─────────────────────────────────────────────── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <motion.div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-15%',
            width: 'clamp(300px, 50vw, 700px)',
            height: 'clamp(300px, 50vw, 700px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,255,71,0.05) 0%, transparent 70%)',
            filter: 'blur(60px)',
            x: orb1X,
            y: orb1Y,
          }}
        />
        <motion.div style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: 'clamp(250px,35vw,550px)', height: 'clamp(250px,35vw,550px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,71,71,0.05) 0%, transparent 70%)', filter: 'blur(60px)', x: orb2X, y: orb2Y }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 100%)' }} />
      </div>

      {/* ── Ghost text ───────────────────────────────────────────────────── */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0, pointerEvents: 'none', userSelect: 'none' }}>
        <motion.div style={{ x: ghostX, y: ghostY }}>
          <span style={{ fontFamily: 'var(--font-display,"Bebas Neue"),cursive', fontSize: 'clamp(80px,14vw,220px)', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.04)', whiteSpace: 'nowrap', letterSpacing: '0.06em', display: 'block' }}>
            CONTACT
          </span>
        </motion.div>
      </div>

      {/* SectionLabel stays above counter-parallax wrapper */}
      <SectionLabel number="005" text="Contact" />

      {/* ── Two-column row: left = text/buttons, right = 3D model ─────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(40px, 6vw, 100px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* LEFT — heading + buttons + divider + location note */}
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          {/* ── Big CTA heading — counter-parallax ────────────────────────── */}
          <motion.div style={{ x: contentX, y: contentY }}>
            <div
              style={{
                maxWidth: '860px',
                marginBottom: '72px',
                lineHeight: 0.9,
              }}
            >
              {[
                { text: "Let's",    filled: true,  delay: 0.1  },
                { text: "Work",     filled: false, delay: 0.25 },
                { text: "Together", filled: true,  delay: 0.4  },
              ].map((line) => (
                <RevealText key={line.text} delay={line.delay}>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
                      fontSize: 'clamp(40px, 10vw, 140px)',
                      lineHeight: 0.92,
                      letterSpacing: '-0.02em',
                      color: line.filled ? 'var(--text)' : 'transparent',
                      WebkitTextStroke: line.filled ? undefined : '2px rgba(240,240,240,0.9)',
                    }}
                  >
                    {line.text}
                  </span>
                </RevealText>
              ))}
            </div>
          </motion.div>

          {/* ── Buttons row — per-button blur+fade stagger ────────────────── */}
          <div
            ref={ref}
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap' as const,
              position: 'relative',
              zIndex: 1,
            }}
            className="max-sm:flex-col"
          >
            {buttons.map((btn, i) => (
              <motion.div
                key={btn.label}
                initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
                animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <ContactButton {...btn} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT — 3D model (hidden on mobile) */}
        <div
          className="max-lg:hidden"
          style={{
            flex: '0 0 clamp(440px, 50vw, 700px)',
            height: 'clamp(540px, 78vh, 860px)',
            position: 'relative',
            // Fade all edges seamlessly into the section bg (#0a0a0a)
            maskImage:
              'radial-gradient(ellipse 88% 85% at 54% 50%, black 25%, transparent 72%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 88% 85% at 54% 50%, black 25%, transparent 72%)',
          }}
        >
          {/* Subtle yellow-green glow behind the figure */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 60% 55% at 54% 52%, rgba(232,255,71,0.07) 0%, transparent 68%)',
              pointerEvents: 'none',
            }}
          />
          <ContactModel />
        </div>
      </div>

      {/* ── Divider + location note — full width, below both columns ── */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: 'clamp(40px, 6vh, 80px)' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '1px',
            background: 'var(--border)',
            transformOrigin: 'left',
            marginBottom: '32px',
          }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-mono, "DM Mono"), monospace',
            fontSize: '12px',
            color: 'var(--muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
          }}
        >
          Based in Sahiwal, Pakistan · Open to remote &amp; relocation
        </motion.p>
      </div>
    </section>
  );
}
