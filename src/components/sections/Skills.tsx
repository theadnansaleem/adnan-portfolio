"use client";

import { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SectionLabel from '@/components/ui/SectionLabel';
import { skills, education, certifications } from '@/lib/data';
import type { Credential } from '@/types';

function CredentialList({ heading, items, inView }: { heading: string; items: Credential[]; inView: boolean }) {
  return (
    <div>
      <h3
        style={{
          fontFamily: 'var(--font-mono, "DM Mono"), monospace',
          fontSize: '11px',
          color: 'var(--muted)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase' as const,
          marginBottom: '28px',
        }}
      >
        {heading}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}
          >
            <div style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', lineHeight: 1.4, marginBottom: '6px' }}>
              {item.title}
            </div>
            {item.issuer && (
              <div
                style={{
                  fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                  fontSize: '12px',
                  color: 'var(--accent)',
                  letterSpacing: '0.05em',
                  marginBottom: '4px',
                }}
              >
                {item.issuer}
              </div>
            )}
            <div
              style={{
                fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                fontSize: '11px',
                color: 'var(--muted)',
                letterSpacing: '0.05em',
              }}
            >
              {item.meta}
            </div>
            {item.href && (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify credential: ${item.title}`}
                style={{
                  fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                  fontSize: '11px',
                  color: 'var(--accent)',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--accent-soft-line)',
                  paddingBottom: '2px',
                  display: 'inline-block',
                  marginTop: '8px',
                }}
              >
                Verify credential ↗
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const credsRef = useRef<HTMLDivElement>(null);
  const credsInView = useInView(credsRef, { once: true, margin: '-80px' });
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

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
      id="skills"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ padding: 'clamp(60px, 10vw, 120px) clamp(20px, 4vw, 48px)', position: 'relative', overflow: 'hidden' }}
    >
      {/* ── Atmosphere layer ─────────────────────────────────────────────── */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <motion.div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 'clamp(400px,55vw,800px)', height: 'clamp(400px,55vw,800px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--orb-a-rgb),0.08) 0%, rgba(var(--orb-a-rgb),0.025) 40%, transparent 70%)', filter: 'blur(40px)', x: orb1X, y: orb1Y }} />
        <motion.div style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: 'clamp(250px,35vw,550px)', height: 'clamp(250px,35vw,550px)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--orb-b-rgb),0.05) 0%, transparent 70%)', filter: 'blur(60px)', x: orb2X, y: orb2Y }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, var(--dot) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black 0%, transparent 100%)' }} />
      </div>

      {/* ── Ghost text ───────────────────────────────────────────────────── */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0, pointerEvents: 'none', userSelect: 'none' }}>
        <motion.div style={{ x: ghostX, y: ghostY }}>
          <span style={{ fontFamily: 'var(--font-display,"Bebas Neue"),cursive', fontSize: 'clamp(120px,20vw,320px)', color: 'transparent', WebkitTextStroke: '1px var(--ghost)', whiteSpace: 'nowrap', letterSpacing: '0.06em', display: 'block' }}>
            STACK
          </span>
        </motion.div>
      </div>

      {/* ── Content — counter-parallax ───────────────────────────────────── */}
      <motion.div ref={containerRef} style={{ x: contentX, y: contentY, position: 'relative', zIndex: 1 }}>
        <SectionLabel number="003" text="Stack" />

        {/* Skill Category Cards */}
        <div
          style={{
            display: 'grid',
            gap: '2px',
            marginBottom: 'clamp(40px, 8vw, 80px)',
          }}
          className="grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1"
        >
          {skills.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, scale: 0.92, y: 24, filter: 'blur(6px)' }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -8,
                rotateX: 2,
                borderColor: 'var(--hover-line)',
              }}
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                padding: 'clamp(20px, 3vw, 40px)',
                perspective: '800px',
                cursor: 'default',
                position: 'relative' as const,
                overflow: 'hidden',
                transition: 'border-color 0.3s',
              }}
            >
              {/* Top accent line on hover */}
              <motion.div
                variants={{}}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, var(--accent), transparent)',
                  transformOrigin: 'left',
                }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
              />

              <h3
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
                  fontSize: 'clamp(18px, 3vw, 24px)',
                  color: 'var(--accent)',
                  letterSpacing: '0.05em',
                  marginBottom: '24px',
                }}
              >
                {cat.category}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
                {cat.tags.map((tag, tagIndex) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.1 + tagIndex * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{
                      borderColor: 'var(--accent)',
                      color: 'var(--accent)',
                      backgroundColor: 'var(--accent-soft)',
                    }}
                    style={{
                      fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                      fontSize: '11px',
                      padding: '6px 14px',
                      border: '1px solid var(--chip-line)',
                      background: 'var(--chip-bg)',
                      color: 'var(--muted)',
                      letterSpacing: '0.05em',
                      cursor: 'default',
                      transition: 'border-color 0.2s, color 0.2s, background-color 0.2s',
                    }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Education & Certifications */}
        <div ref={credsRef} style={{ marginTop: 'clamp(40px, 8vw, 80px)' }}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={credsInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: '1px', background: 'linear-gradient(90deg, var(--accent), transparent)', transformOrigin: 'left', marginBottom: '40px' }}
          />
          <div
            style={{ display: 'grid', gap: '48px' }}
            className="grid-cols-2 max-md:grid-cols-1"
          >
            <CredentialList heading="Education" items={education} inView={credsInView} />
            <CredentialList heading="Certifications" items={certifications} inView={credsInView} />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
