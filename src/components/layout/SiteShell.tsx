"use client";

import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import PageTransition from '@/components/layout/PageTransition';

/** Every route brings its own top bar and footer; this adds smooth scrolling and the page-change curtain. */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <main id="main-content">{children}</main>
      <PageTransition />
    </SmoothScrollProvider>
  );
}
