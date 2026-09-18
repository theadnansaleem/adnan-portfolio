"use client";
import { useEffect, useRef, useState } from "react";

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- augmenting React.JSX requires a namespace
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': {
        url: string;
        loading?: string;
        style?: import('react').CSSProperties;
        className?: string;
      };
    }
  }
}

export default function ContactModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only mount the Spline scene once the container scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Inject the viewer script only when visible
  useEffect(() => {
    if (!isVisible) return;
    const ATTR = 'data-spline-viewer';
    if (!document.querySelector(`script[${ATTR}]`)) {
      const s = document.createElement('script');
      s.type = 'module';
      s.src = 'https://unpkg.com/@splinetool/viewer@1.12.58/build/spline-viewer.js';
      s.setAttribute(ATTR, '');
      document.head.appendChild(s);
    }
  }, [isVisible]);

  // Inject a <style> into the shadow root so #logo is hidden the moment it appears
  useEffect(() => {
    if (!isVisible) return;
    const id = setInterval(() => {
      const viewer = document.querySelector('spline-viewer');
      const root = viewer?.shadowRoot;
      if (root && !root.querySelector('style[data-hide-logo]')) {
        const style = document.createElement('style');
        style.setAttribute('data-hide-logo', '');
        style.textContent = '#logo { display: none !important; }';
        root.appendChild(style);
        clearInterval(id);
      }
    }, 100);
    return () => clearInterval(id);
  }, [isVisible]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {isVisible && (
        <spline-viewer
          url="https://prod.spline.design/jR5SCSM2jYrARfXa/scene.splinecode"
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      )}
    </div>
  );
}
