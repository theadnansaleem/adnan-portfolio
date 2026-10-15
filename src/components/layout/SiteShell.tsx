"use client";

import type { MouseEvent } from 'react';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import PageTransition from '@/components/layout/PageTransition';
import { trackPortfolioAction, type PortfolioAction } from '@/lib/analytics';
import { profile } from '@/lib/data';

const TRACKED_LINKS = new Map<string, PortfolioAction>([
  [profile.resume, 'cv'],
  [`mailto:${profile.email}`, 'email'],
  [profile.booking, 'booking'],
  [profile.linkedin, 'linkedin'],
]);

function trackLinkClick(event: MouseEvent<HTMLElement>) {
  if (event.button > 1 || !(event.target instanceof Element)) return;
  const link = event.target.closest('a');
  const action = TRACKED_LINKS.get(link?.getAttribute('href') ?? '');
  if (link && action) {
    trackPortfolioAction(action, link.closest('.hx-fit-out') ? 'fit_results' : 'link');
  }
}

/** Every route brings its own top bar and footer; this adds smooth scrolling and the page-change curtain. */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <main id="main-content" onClickCapture={trackLinkClick} onAuxClickCapture={trackLinkClick}>{children}</main>
      <PageTransition />
    </SmoothScrollProvider>
  );
}
