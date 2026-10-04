import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import SiteShell from '@/components/layout/SiteShell';
import { certifications, profile, skills } from '@/lib/data';

const SITE_URL = profile.url;
const TITLE = `${profile.name} | ${profile.jobTitle}`;
const DESCRIPTION =
  'M. Adnan Saleem, Senior Full-Stack Software Engineer: React, Next.js, Angular, .NET and Node.js. Working remote from Lahore, Pakistan.';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d0e0b',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${profile.name}`,
  },
  description: DESCRIPTION,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: profile.name,
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
    firstName: 'Adnan',
    lastName: 'Saleem',
  },
  // No title or description here: each page's card falls back to its own Open Graph values.
  twitter: {
    card: 'summary_large_image',
    creator: '@adnan_muhamadi',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
  },
  // Set these in Vercel (Production) to the tokens Search Console / Bing issue.
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
};

/* ── Structured data (JSON-LD) ──────────────────────────────────────────── */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: profile.name,
      alternateName: profile.alternateNames,
      jobTitle: profile.jobTitle,
      description: profile.summary[0],
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/opengraph-image`,
      email: `mailto:${profile.email}`,
      sameAs: [profile.linkedin, profile.github, profile.x],
      knowsLanguage: 'en',
      knowsAbout: [...new Set(skills.flatMap((group) => group.tags))],
      alumniOf: [
        { '@type': 'CollegeOrUniversity', name: 'Iqra University' },
        { '@type': 'EducationalOrganization', name: 'Qualifi Ltd.' },
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lahore',
        addressCountry: 'PK',
      },
      hasOccupation: {
        '@type': 'Occupation',
        name: profile.jobTitle,
        occupationalCategory: '15-1252.00',
        skills: skills.flatMap((group) => group.tags).join(', '),
        occupationLocation: { '@type': 'City', name: 'Lahore' },
      },
      hasCredential: certifications.map((cert) => ({
        '@type': 'EducationalOccupationalCredential',
        name: cert.title,
        url: cert.href,
      })),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: profile.name,
      inLanguage: 'en',
      publisher: { '@id': `${SITE_URL}/#person` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        {/* Theme — runs before paint so a saved light preference never flashes
            dark. Defaults to dark; the system preference is not auto-applied
            because the dark treatment is the intended default presentation. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}})()`,
          }}
        />
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        {/* Microsoft Clarity */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", '${process.env.NEXT_PUBLIC_CLARITY_ID}');
            `}
          </Script>
        )}
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
