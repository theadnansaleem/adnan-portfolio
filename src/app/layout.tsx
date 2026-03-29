import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Bricolage_Grotesque, DM_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import { MusicPlayerProvider } from '@/context/MusicPlayerContext';
import PageLoader from '@/components/PageLoader';
import CustomCursor from '@/components/ui/CustomCursor';
import NoiseOverlay from '@/components/ui/NoiseOverlay';
import MusicPlayer from '@/components/ui/MusicPlayer';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const dmMono = DM_Mono({
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theadnansaleem.com';
const FULL_NAME = 'Muhammad Adnan Saleem';
const SHORT_NAME = 'Adnan Saleem';
const TITLE_SUFFIX = 'Senior Software Engineer & Frontend Developer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050505',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  /* ── Primary title & description ─────────────────────────────────────── */
  title: {
    default: `${FULL_NAME} — ${TITLE_SUFFIX}`,
    template: `%s | ${FULL_NAME}`,
  },
  description:
    `${FULL_NAME} (Adnan Saleem) is a Senior Software Engineer and Frontend Developer with 7+ years of experience. ` +
    `Expert in React, Next.js, TypeScript, Micro Frontend architecture, and AI-powered workflows. ` +
    `Based in Sahiwal, Pakistan. Available for remote opportunities worldwide.`,

  /* ── Extended keyword set (all name variants + role terms) ──────────── */
  keywords: [
    // Name variants
    'Adnan',
    'Muhammad Adnan',
    'Adnan Saleem',
    'Muhammad Adnan Saleem',
    'theadnan',
    'theadnansaleem',
    // Role terms
    'Frontend Developer',
    'Frontend Engineer',
    'Software Engineer',
    'Senior Software Engineer',
    'Senior Frontend Developer',
    'Senior Frontend Engineer',
    'React Developer',
    'Next.js Developer',
    'TypeScript Developer',
    'JavaScript Developer',
    'Web Developer',
    'Full Stack Developer',
    // Skills & specialities
    'React',
    'Next.js',
    'TypeScript',
    'AI Developer',
    'LLM Engineer',
    'Micro Frontend',
    'Module Federation',
    'Redux Toolkit',
    'Node.js',
    'RLHF',
    'Agentic AI',
    // Location
    'Sahiwal',
    'Pakistan',
    'Remote Developer Pakistan',
    // Portfolio
    'Portfolio',
    'Muhammad Adnan Portfolio',
    'Adnan Saleem Portfolio',
  ],

  /* ── Authorship & creator ────────────────────────────────────────────── */
  authors: [
    { name: FULL_NAME, url: SITE_URL },
    { name: SHORT_NAME, url: SITE_URL },
    { name: 'Adnan', url: SITE_URL },
  ],
  creator: FULL_NAME,
  publisher: FULL_NAME,

  /* ── Canonical + alternates ──────────────────────────────────────────── */
  alternates: {
    canonical: SITE_URL,
    languages: { 'en-US': SITE_URL },
  },

  /* ── Robots ──────────────────────────────────────────────────────────── */
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  /* ── Open Graph ──────────────────────────────────────────────────────── */
  openGraph: {
    type: 'profile',
    url: SITE_URL,
    siteName: `${FULL_NAME} — Portfolio`,
    title: `${FULL_NAME} — ${TITLE_SUFFIX}`,
    description:
      `${FULL_NAME} (Adnan Saleem) — Senior Software Engineer & Frontend Developer. ` +
      `React · Next.js · TypeScript · AI. Based in Sahiwal, Pakistan. ` +
      `7+ years building enterprise-scale, production-grade applications.`,
    locale: 'en_US',
    images: [
      {
        url: '/LinkedinPost.png',
        width: 1200,
        height: 630,
        alt: `${FULL_NAME} — Senior Software Engineer & Frontend Developer`,
        type: 'image/png',
      },
    ],
    firstName: 'Muhammad Adnan',
    lastName: 'Saleem',
    username: 'theadnansaleem',
    gender: 'male',
  },

  /* ── Twitter / X ─────────────────────────────────────────────────────── */
  twitter: {
    card: 'summary_large_image',
    site: '@theadnansaleem',
    creator: '@theadnansaleem',
    title: `${FULL_NAME} — ${TITLE_SUFFIX}`,
    description:
      `Senior Software Engineer & Frontend Developer. React · Next.js · TypeScript · AI. ` +
      `Based in Sahiwal, Pakistan. Available for remote opportunities.`,
    images: [
      {
        url: '/LinkedinPost.png',
        alt: `${FULL_NAME} — Senior Software Engineer & Frontend Developer`,
      },
    ],
  },

  /* ── Icons ───────────────────────────────────────────────────────────── */
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/favicon.ico',
    shortcut: '/favicon.ico',
  },

  /* ── Search Console / Bing verification ──────────────────────────────── */
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? '',
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION ?? '',
    },
  },

  /* ── Additional SEO meta ─────────────────────────────────────────────── */
  category: 'technology',
  classification: 'portfolio',
  referrer: 'origin-when-cross-origin',
};

/* ── Structured data (JSON-LD) ──────────────────────────────────────────── */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: FULL_NAME,
  alternateName: ['Adnan Saleem', 'Muhammad Adnan', 'Adnan', 'theadnan', 'theadnansaleem'],
  givenName: 'Muhammad Adnan',
  familyName: 'Saleem',
  jobTitle: ['Senior Software Engineer', 'Senior Frontend Developer', 'Frontend Engineer'],
  description:
    'Senior Software Engineer and Frontend Developer with 7+ years of experience building production-grade web applications. Expert in React, Next.js, TypeScript, Micro Frontend architecture, and AI-powered workflows.',
  url: SITE_URL,
  image: `${SITE_URL}/LinkedinPost.png`,
  sameAs: [
    'https://www.linkedin.com/in/theadnan/',
    'https://github.com/theadnansaleem',
    `${SITE_URL}`,
  ],
  email: 'heyadnansaleem@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sahiwal',
    addressRegion: 'Punjab',
    addressCountry: 'PK',
  },
  nationality: {
    '@type': 'Country',
    name: 'Pakistan',
  },
  knowsAbout: [
    'React', 'Next.js', 'TypeScript', 'JavaScript',
    'Frontend Development', 'Software Engineering',
    'Micro Frontend Architecture', 'Module Federation',
    'AI Automation', 'LLM Fine-tuning', 'RLHF', 'Agentic AI',
    'Node.js', 'Redux Toolkit', 'TanStack Query',
    'Web Performance Optimization', 'Core Web Vitals',
  ],
  knowsLanguage: [
    { '@type': 'Language', name: 'English' },
    { '@type': 'Language', name: 'Urdu' },
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Dallah Holding Media (Supreme Committee for Delivery & Legacy)',
    url: 'https://sc.qa',
  },
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Senior Software Engineer',
    occupationLocation: {
      '@type': 'City',
      name: 'Sahiwal',
    },
    skills: 'React, Next.js, TypeScript, Micro Frontend, AI, Node.js',
    estimatedSalary: {
      '@type': 'MonetaryAmountDistribution',
      currency: 'USD',
      duration: 'P1Y',
      percentile10: 60000,
      percentile50: 90000,
      percentile90: 130000,
    },
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Education',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lahore',
      addressCountry: 'PK',
    },
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: `${FULL_NAME} — Portfolio`,
  description:
    'Official portfolio of Muhammad Adnan Saleem, Senior Software Engineer & Frontend Developer based in Sahiwal, Pakistan.',
  author: { '@id': `${SITE_URL}/#person` },
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const webpageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: `${FULL_NAME} — Senior Software Engineer & Frontend Developer`,
  description:
    'Portfolio of Muhammad Adnan Saleem (Adnan Saleem), Senior Software Engineer and Frontend Developer with 7+ years of experience in React, Next.js, TypeScript, and AI-powered systems.',
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#person` },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
    ],
  },
  mainEntity: { '@id': `${SITE_URL}/#person` },
  datePublished: '2026-02-01',
  dateModified: new Date().toISOString().split('T')[0],
  inLanguage: 'en-US',
};

const workExperienceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Work Experience — Muhammad Adnan Saleem',
  description: 'Professional work history of Muhammad Adnan Saleem (Adnan Saleem), Senior Software Engineer.',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'WorkBasedProgram',
        name: 'Senior Frontend Engineer',
        employmentType: 'FULL_TIME',
        description:
          'Leading frontend architecture for the Qatar Events Platform (QEP), a critical government system. ' +
          'Refactored monolithic frontend into Micro Frontend architecture using Module Federation.',
        occupationalCategory: 'Software Engineering',
        provider: {
          '@type': 'Organization',
          name: 'Dallah Holding Media (Supreme Committee for Delivery & Legacy)',
          url: 'https://sc.qa',
        },
        startDate: '2025',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'WorkBasedProgram',
        name: 'Senior Frontend Developer',
        employmentType: 'FULL_TIME',
        description:
          'Delivered production features across a multi-currency payment and card management platform ' +
          'handling operations for customers across 180+ countries.',
        occupationalCategory: 'Software Engineering',
        provider: {
          '@type': 'Organization',
          name: 'MicrosysX (Volopa Financial Services)',
          url: 'https://volopa.com',
        },
        startDate: '2023',
        endDate: '2025',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'WorkBasedProgram',
        name: 'Senior Frontend Developer',
        employmentType: 'FULL_TIME',
        description:
          'Built the core UI of Codex, a cybersecurity monitoring platform enabling security teams ' +
          'to assess attack surfaces across vehicle software stacks containing 60M+ lines of code.',
        occupationalCategory: 'Software Engineering',
        provider: {
          '@type': 'Organization',
          name: 'Primary Target GmbH',
          url: 'https://primary-target.com',
        },
        startDate: '2021',
        endDate: '2023',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${bricolage.variable} ${dmMono.variable}`}>
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for analytics */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        {/* Geo / author meta */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Sahiwal, Punjab, Pakistan" />
        <meta name="author" content={FULL_NAME} />
        <meta name="copyright" content={FULL_NAME} />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(workExperienceSchema) }}
        />
      </head>
      <body>
        <SmoothScrollProvider>
          <MusicPlayerProvider>
            <PageLoader />
            <CustomCursor />
            <NoiseOverlay />
            {/* Google Analytics */}
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
            {/* Microsoft Clarity */}
            <Script id="microsoft-clarity" strategy="afterInteractive">
              {`
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", '${process.env.NEXT_PUBLIC_CLARITY_ID}');
              `}
            </Script>
            <MusicPlayer />
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
          </MusicPlayerProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
