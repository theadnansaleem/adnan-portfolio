"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Page-load reveal animation.
 *
 * Sequence:
 *  0.0s  — full-screen overlay appears instantly (no flash of content)
 *  0.1s  — logo letter-space animates closed + fades in
 *  0.3s  — loading bar fills left-to-right (completes ~1.4s)
 *  0.5s  — subtitle fades in
 *  ~1.5s — overlay exits: zooms out + blurs out, revealing the page beneath
 *
 * Exit waits for the real window `load` event (all resources fetched), with a
 * 1500ms minimum so the bar animation plays in full, and a 3s safety cap so it
 * never hangs on broken resources.
 *
 * Respects `prefers-reduced-motion`: on reduced-motion devices the exit is a
 * plain opacity fade — no scale or blur.
 */
export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  // Read once at mount — no need to re-render on change
  const [reduceMotion] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const MIN_MS = 1500; // bar animation completes at ~1.4s; 1.5s closes the dead pause
    const MAX_MS = 3000; // safety cap — never hang forever
    const start = Date.now();
    let dismissed = false;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setVisible(false);
    };

    const onLoad = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_MS - elapsed);
      setTimeout(dismiss, remaining);
    };

    let cap: ReturnType<typeof setTimeout>;

    if (document.readyState === 'complete') {
      // Already loaded before this effect ran (fast connection / cache hit)
      const elapsed = Date.now() - start;
      cap = setTimeout(dismiss, Math.max(0, MIN_MS - elapsed));
    } else {
      window.addEventListener('load', onLoad);
      cap = setTimeout(dismiss, MAX_MS);
    }

    return () => {
      window.removeEventListener('load', onLoad);
      clearTimeout(cap);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          // Exit: loader zooms out + blurs away — page "rushes in"
          initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={
            reduceMotion
              ? { opacity: 0, transition: { duration: 0.4 } }
              : { opacity: 0, scale: 1.1, filter: 'blur(16px)', transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
          }
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg)',
            zIndex: 9500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, scale: 1, letterSpacing: '0.25em' }}
            transition={{ delay: 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
              fontSize: 'clamp(32px, 5vw, 52px)',
              color: 'var(--accent)',
            }}
          >
            MUHAMMAD ADNAN
          </motion.div>

          {/* Loading bar */}
          <div
            style={{
              width: '180px',
              height: '1px',
              background: 'rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent), rgba(232,255,71,0.5))',
                transformOrigin: 'left',
              }}
            />
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.55, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              fontFamily: 'var(--font-mono, "DM Mono"), monospace',
              fontSize: '10px',
              color: 'var(--muted)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase' as const,
              marginTop: '4px',
            }}
          >
            Senior Software Engineer · OPEN TO GCC ROLES
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
