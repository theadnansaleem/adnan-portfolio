import Image from 'next/image';
import Link from 'next/link';
import { certifications } from '@/lib/data';
import type { Credential } from '@/types';

// The newest certification leads the list in data.ts
const cert = certifications[0];

/** The four-square Microsoft mark, in its own colours. */
export function MicrosoftMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 23 23" aria-hidden="true">
      <path fill="#f25022" d="M1 1h10v10H1z" />
      <path fill="#7fba00" d="M12 1h10v10H12z" />
      <path fill="#00a4ef" d="M1 12h10v10H1z" />
      <path fill="#ffb900" d="M12 12h10v10H12z" />
    </svg>
  );
}

/** A certificate picture. When the credential has a dark version, each theme shows its own. */
export function CertPicture({ cert, ...rest }: { cert: Credential; className?: string; width: number; height: number; sizes: string }) {
  if (!cert.image) return null;
  const alt = `${cert.title} certificate`;
  const classes = (theme: string) => [rest.className, cert.imageDark && theme].filter(Boolean).join(' ');
  return (
    <>
      <Image {...rest} className={classes('hx-light-only')} src={cert.image} alt={alt} />
      {cert.imageDark && <Image {...rest} className={classes('hx-dark-only')} src={cert.imageDark} alt={alt} />}
    </>
  );
}

/** The Microsoft certification, with what it validates and a link to Microsoft's record of it. */
export default function CertHighlight({ className = '' }: { className?: string }) {
  return (
    <aside className={`hx-certhero hx-card ${className}`} aria-label="Microsoft certification">
      {cert.image && (
        <a className="hx-certhero-shot" href={cert.href} target="_blank" rel="noopener noreferrer" aria-label="Open the certificate on Microsoft Learn">
          <CertPicture cert={cert} width={1120} height={724} sizes="(max-width: 1000px) 100vw, 460px" />
        </a>
      )}
      <div>
        <p className="hx-cap"><MicrosoftMark /> <b>Microsoft Certified</b> {cert.meta}</p>
        <h3>{cert.title.replace('Microsoft Certified: ', '')}</h3>
        <p>{cert.detail}</p>
        <ul className="hx-tags">{cert.validates?.map((topic) => <li key={topic}>{topic}</li>)}</ul>
        <div className="hx-actions">
          <a className="hx-pill is-solid" href={cert.href} target="_blank" rel="noopener noreferrer">Verify on Microsoft Learn ↗</a>
          <Link className="hx-pill" href="/certifications">All certifications</Link>
        </div>
      </div>
    </aside>
  );
}
