"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

/* ─── Equalizer bar — pure CSS keyframe animation ───────────────────────── */
function EqBar({ delay }: { delay: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 3,
        borderRadius: 2,
        background: "var(--accent)",
        animationName: "eqBar",
        animationDuration: "0.8s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        animationDelay: delay,
      }}
    />
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function MusicPlayer() {
  const { playing, volume, ready, pending, toggle, changeVolume } = useMusicPlayer();
  const [expanded, setExpanded] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const bottomOffset = footerVisible ? 104 : 28;

  const statusLabel = playing ? "PLAYING" : pending ? "CLICK ▶" : ready ? "PAUSED" : "LOADING";
  const statusColor = playing ? "var(--accent)" : pending ? "var(--accent2)" : "var(--muted)";

  return (
    <>
      {/* ── Keyframe injection ── */}
      <style>{`
        @keyframes eqBar {
          from { height: 4px;  opacity: 0.5; }
          to   { height: 14px; opacity: 1;   }
        }
      `}</style>

      {/* ── Floating widget ── */}
      <div
        style={{
          position: "fixed",
          bottom: bottomOffset,
          right: 'clamp(12px, 2vw, 28px)',
          transition: 'bottom 0.3s ease',
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 8,
          fontFamily: "var(--font-mono)",
        }}
      >
        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderRadius: 12,
                padding: "12px 16px",
                minWidth: 'min(200px, calc(100vw - 56px))',
                boxShadow: playing
                  ? "0 0 18px rgba(var(--orb-a-rgb),0.14)"
                  : "var(--panel-shadow)",
              }}
            >
              {/* Track name + eq bars */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                {playing ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "flex-end",
                      gap: 2,
                      height: 14,
                    }}
                  >
                    <EqBar delay="0s" />
                    <EqBar delay="0.15s" />
                    <EqBar delay="0.3s" />
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>♫</span>
                )}
                <span
                  style={{
                    fontSize: 11,
                    color: playing ? "var(--accent)" : "var(--muted)",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 140,
                  }}
                >
                  Ambient Atmosphere
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 10,
                    color: statusColor,
                    letterSpacing: "0.08em",
                  }}
                >
                  {statusLabel}
                </span>
              </div>

              {/* Volume slider */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: "var(--muted)" }}>VOL</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: "var(--accent)",
                    height: 2,
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontSize: 10, color: "var(--muted)", minWidth: 26, textAlign: "right" }}>
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Icon button row ── */}
        <div style={{ display: "flex", gap: 6 }}>
          {/* Expand / collapse toggle */}
          <motion.button
            onClick={() => setExpanded((p) => !p)}
            whileTap={{ scale: 0.92 }}
            title={expanded ? "Collapse player" : "Expand player"}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--panel)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: expanded ? "var(--accent)" : "var(--muted)",
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            ♫
          </motion.button>

          {/* Play / pause button */}
          <motion.button
            onClick={toggle}
            whileTap={{ scale: 0.92 }}
            title={playing ? "Pause music" : "Play ambient music"}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: `1px solid ${playing ? "var(--accent-soft-line)" : pending ? "rgba(var(--orb-b-rgb),0.45)" : "var(--border)"}`,
              background: playing
                ? "var(--accent-soft)"
                : pending
                ? "rgba(var(--orb-b-rgb),0.10)"
                : "var(--panel)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: playing ? "var(--accent)" : pending ? "var(--accent2)" : "var(--muted)",
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              boxShadow: playing
                ? "0 0 12px rgba(var(--orb-a-rgb),0.18)"
                : pending
                ? "0 0 10px rgba(var(--orb-b-rgb),0.15)"
                : "none",
            }}
          >
            {playing ? "⏸" : "▶"}
          </motion.button>
        </div>
      </div>
    </>
  );
}
