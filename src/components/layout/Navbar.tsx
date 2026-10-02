"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/ui/ThemeToggle';

const navLinks = [
  { label: 'About',    href: '#about' },
  { label: 'Work',     href: '#experience' },
  { label: 'Stack',    href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  // On a case study page the section anchors have to point back at the home page.
  const sectionHref = (hash: string) => (pathname === '/' ? hash : `/${hash}`);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const sectionIds = ['contact', 'projects', 'skills', 'experience', 'about', 'home'];

    const detect = () => {
      const y = window.scrollY;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop - 200;
        const bottom = top + el.offsetHeight;
        if (y >= top && y <= bottom) {
          setActiveSection((prev) => (prev === id ? prev : id));
          break;
        }
      }
    };

    detect(); // run once on mount
    window.addEventListener('scroll', detect, { passive: true });
    return () => window.removeEventListener('scroll', detect);
  }, []); // empty — listener handles its own updates, no re-run loop possible

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="nav-blend px-12 py-6 max-md:px-6 max-md:py-4"
      >
        {/* Logo */}
        <a
          href={sectionHref('#home')}
          style={{
            fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
            fontSize: '22px',
            letterSpacing: '0.2em',
            color: 'var(--text)',
            textDecoration: 'none',
          }}
        >
          M●ADNAN
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex" style={{ gap: '40px', alignItems: 'center' }}>
          {navLinks.map((link) => {
            const id = link.href.replace('#', '');
            const isActive = activeSection === id;
            return (
              <motion.a
                key={link.href}
                href={sectionHref(link.href)}
                onHoverStart={() => setHoveredLink(id)}
                onHoverEnd={() => setHoveredLink(null)}
                style={{
                  fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                  fontSize: '12px',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.15em',
                  color: isActive ? 'var(--accent)' : (hoveredLink === id ? 'var(--nav-hover)' : 'var(--text)'),
                  opacity: isActive ? 1 : (hoveredLink === id ? 1 : 'var(--dim)'),
                  textDecoration: 'none',
                  transition: 'opacity 0.25s, color 0.25s',
                  position: 'relative' as const,
                  display: 'inline-flex',
                }}
              >
                {link.label.split('').map((char, idx) => (
                  <motion.span
                    key={idx}
                    style={{ display: 'inline-block' }}
                    whileHover={{ scale: 1.35 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 12 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.a>
            );
          })}
          <ThemeToggle />
        </div>

        {/* Mobile — theme toggle + hamburger */}
        <div className="hidden max-md:flex" style={{ alignItems: 'center', gap: '8px' }}>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '6px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 24,
                  height: 1,
                  background: 'var(--text)',
                  display: 'block',
                  transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.35s',
                  transform:
                    menuOpen && i === 0 ? 'rotate(45deg) translate(5px, 5px)' :
                    menuOpen && i === 2 ? 'rotate(-45deg) translate(5px, -5px)' :
                    'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* FIX: Wrap mobile overlay in AnimatePresence for proper exit animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'var(--bg)',
              zIndex: 99,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={sectionHref(link.href)}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-display, "Bebas Neue"), cursive',
                  fontSize: 'clamp(36px, 10vw, 56px)',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  lineHeight: 1.1,
                }}
                whileHover={{ color: 'var(--accent)', x: 8 }}
              >
                {link.label}
              </motion.a>
            ))}

            {/* Bottom bar in mobile menu */}
            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                fontFamily: 'var(--font-mono, "DM Mono"), monospace',
                fontSize: '11px',
                color: 'var(--muted)',
                letterSpacing: '0.2em',
              }}
            >
              LAHORE, PAKISTAN · AVAILABLE IMMEDIATELY · OPEN TO RELOCATION
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
