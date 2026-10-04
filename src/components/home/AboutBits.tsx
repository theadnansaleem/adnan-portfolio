"use client";

import { useState } from 'react';
import { profile } from '@/lib/data';

/** Native share sheet where the browser has one, otherwise the link goes to the clipboard. */
export function ShareButton() {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = profile.url + '/about';
    try {
      if (navigator.share) await navigator.share({ title: profile.name, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // The visitor closed the share sheet; nothing to do
    }
  };
  return (
    <button className="hx-pill is-big" type="button" onClick={share}>
      <span aria-live="polite">{copied ? 'Link copied' : 'Share this page'}</span>
    </button>
  );
}
