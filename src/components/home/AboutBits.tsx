"use client";

import Image from 'next/image';
import { useRef, useState } from 'react';
import { profile } from '@/lib/data';
import { PHOTOS } from './photos';

/** Photo grid; a photo opens large in a dialog with previous and next. */
export function PhotoWall() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [at, setAt] = useState(0);
  const step = (by: number) => setAt((n) => (n + by + PHOTOS.length) % PHOTOS.length);
  const [file, alt] = PHOTOS[at];

  return (
    <>
      <ul className="hx-wall">
        {PHOTOS.map(([src, label], i) => (
          <li key={src}>
            <button type="button" aria-label={`Open photo: ${label}`} onClick={() => { setAt(i); dialog.current?.showModal(); }}>
              <Image src={'/me/' + src} alt={label} fill sizes="(max-width: 760px) 50vw, 300px" />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        className="hx-look hx-photo"
        ref={dialog}
        aria-label="Photo"
        data-lenis-prevent
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); }}
      >
        <figure>
          <div><Image key={file} src={'/me/' + file} alt={alt} fill sizes="(max-width: 1000px) 100vw, 900px" /></div>
          <figcaption>
            <span className="hx-cap">{at + 1} / {PHOTOS.length}</span>
            <span className="hx-actions">
              <button className="hx-pill" type="button" onClick={() => step(-1)} aria-label="Previous photo">←</button>
              <button className="hx-pill" type="button" onClick={() => step(1)} aria-label="Next photo">→</button>
              <button className="hx-pill is-solid" type="button" onClick={() => dialog.current?.close()}>Close</button>
            </span>
          </figcaption>
        </figure>
      </dialog>
    </>
  );
}

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
