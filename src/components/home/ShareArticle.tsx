"use client";

import { useState } from 'react';
import { trackShare } from '@/lib/analytics';

/** Copy-link and LinkedIn share for an article. Plain links and buttons; no third-party script. */
export default function ShareArticle({ url, title }: { url: string; title: string }) {
  const [status, setStatus] = useState('');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus('Link copied');
      trackShare('copy_link');
    } catch {
      setStatus('Copy failed: the address bar has the link');
    }
  };

  return (
    <div className="hx-share">
      <button type="button" className="hx-pill" onClick={copy}>Copy link</button>
      <a
        className="hx-pill"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share "${title}" on LinkedIn (opens in a new tab)`}
        onClick={() => trackShare('linkedin')}
      >
        Share on LinkedIn ↗
      </a>
      <span role="status">{status}</span>
    </div>
  );
}
