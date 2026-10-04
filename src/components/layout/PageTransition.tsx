"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * A lime curtain covers the screen before an internal navigation and lifts once
 * the new route has rendered. Hash links, new tabs and modified clicks are left alone.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const curtain = useRef<HTMLDivElement>(null);

  // The route changed underneath the curtain: lift it
  useEffect(() => {
    const el = curtain.current;
    if (el?.dataset.state !== 'cover') return;
    // Smooth scrolling keeps the old offset across routes, so start the new page at its top
    if (!window.location.hash) window.scrollTo(0, 0);
    el.dataset.state = 'lift';
    // Parked below the screen again, without a transition, once the lift has finished
    const reset = window.setTimeout(() => { delete el.dataset.state; }, 800);
    return () => window.clearTimeout(reset);
  }, [pathname]);

  useEffect(() => {
    const el = curtain.current;
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest?.('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      e.preventDefault();
      el.dataset.state = 'cover';
      window.setTimeout(() => router.push(url.pathname + url.search + url.hash), 460);
    };
    // Capture phase, so this runs before next/link handles the click
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return <div className="pt-curtain" ref={curtain} aria-hidden="true" />;
}
