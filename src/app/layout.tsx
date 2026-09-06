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
const TITLE_SUFFIX = 'Senior Full-Stack Software Engineer';

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
    `${FULL_NAME} (Adnan Saleem) is a Senior Full-Stack Software Engineer with 8 years of experience. ` +
    `React, Next.js, TypeScript, Node.js, and C#/.NET Core, with deep Micro Frontend and AI workflow expertise. ` +
    `Based in Lahore, Pakistan. Available immediately for remote roles and relocation.`,

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
    'Fullstack Engineer',
    '.NET Developer',
    'Node.js Developer',
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
    'C#',
    '.NET Core',
    'Blazor',
    'RLHF',
    'Agentic AI',
    // Location
    'Lahore',
    'Pakistan',
    'Qatar',
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
      `${FULL_NAME} (Adnan Saleem) — Senior Full-Stack Software Engineer. ` +
      `React · Next.js · TypeScript · Node.js · .NET. Based in Lahore, Pakistan. ` +
      `8 years building enterprise-scale, production-grade applications.`,
    locale: 'en_US',
    images: [
      {
        url: '/LinkedinPost.png',
        width: 1200,
        height: 630,
        alt: `${FULL_NAME} — ${TITLE_SUFFIX}`,
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
      `Senior Full-Stack Software Engineer. React · Next.js · TypeScript · Node.js · .NET. ` +
      `Based in Lahore, Pakistan. Available immediately for remote roles and relocation.`,
    images: [
      {
        url: '/LinkedinPost.png',
        alt: `${FULL_NAME} — ${TITLE_SUFFIX}`,
      },
    ],
  },

  /* ── Icons ───────────────────────────────────────────────────────────── */
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
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
  jobTitle: ['Senior Full-Stack Software Engineer', 'Senior Software Engineer', 'Senior Fullstack Developer'],
  description:
    'Senior Full-Stack Software Engineer with 8 years of experience building production platforms across government, fintech, cybersecurity, and AI. React, Next.js, TypeScript, Node.js, and C#/.NET Core, with deep Micro Frontend and AI workflow expertise.',
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
    addressLocality: 'Lahore',
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
    'C#', '.NET Core', 'Blazor Server', 'Entity Framework Core',
    'Domain-Driven Design', 'CQRS', 'REST API Design',
    'Web Performance Optimization', 'Core Web Vitals',
  ],
  knowsLanguage: [
    { '@type': 'Language', name: 'English' },
    { '@type': 'Language', name: 'Urdu' },
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Supreme Committee for Delivery & Legacy',
    url: 'https://sc.qa',
  },
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Senior Full-Stack Software Engineer',
    occupationLocation: {
      '@type': 'City',
      name: 'Lahore',
    },
    skills: 'React, Next.js, TypeScript, Micro Frontend, AI, Node.js, C#, .NET Core, Blazor',
    estimatedSalary: {
      '@type': 'MonetaryAmountDistribution',
      currency: 'USD',
      duration: 'P1Y',
      percentile10: 60000,
      percentile50: 90000,
      percentile90: 130000,
    },
  },
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Iqra University',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Karachi',
        addressCountry: 'PK',
      },
    },
    {
      '@type': 'EducationalOrganization',
      name: 'Qualifi Ltd.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'London',
        addressCountry: 'GB',
      },
    },
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Certified Cybersecurity Educator Professional (CCEP)',
      credentialCategory: 'certificate',
      dateCreated: '2025-12',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'HP LIFE: Data Science & Analytics',
      credentialCategory: 'certificate',
      dateCreated: '2025-11',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Scrimba Frontend Career Path',
      credentialCategory: 'certificate',
      dateCreated: '2018-03',
    },
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: `${FULL_NAME} — Portfolio`,
  description:
    'Official portfolio of Muhammad Adnan Saleem, Senior Full-Stack Software Engineer based in Lahore, Pakistan.',
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
  name: `${FULL_NAME} — ${TITLE_SUFFIX}`,
  description:
    'Portfolio of Muhammad Adnan Saleem (Adnan Saleem), Senior Full-Stack Software Engineer with 8 years of experience in React, Next.js, TypeScript, Node.js, .NET, and AI-powered systems.',
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
  description: 'Professional work history of Muhammad Adnan Saleem (Adnan Saleem), Senior Full-Stack Software Engineer.',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'WorkBasedProgram',
        name: 'Senior Fullstack Developer',
        employmentType: 'FULL_TIME',
        description:
          'Owned features end to end across Qatar\'s government event platforms — the Qatar Events Platform, ' +
          'Road to Qatar, and the Hayya eVisa system — and rearchitected a monolithic React frontend into ' +
          'Micro Frontends using Module Federation.',
        occupationalCategory: 'Software Engineering',
        provider: {
          '@type': 'Organization',
          name: 'Supreme Committee for Delivery & Legacy',
          url: 'https://sc.qa',
        },
        startDate: '2025-10',
        endDate: '2026-08',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'WorkBasedProgram',
        name: 'Senior Fullstack Developer',
        employmentType: 'FULL_TIME',
        description:
          'Delivered production features across a multi-currency payments and card platform ' +
          'serving customers in 180+ countries, meeting WCAG 2.1 and UK fintech regulatory standards.',
        occupationalCategory: 'Software Engineering',
        provider: {
          '@type': 'Organization',
          name: 'Volopa Financial Services',
          url: 'https://volopa.com',
        },
        startDate: '2023-06',
        endDate: '2025-10',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'WorkBasedProgram',
        name: 'Freelance Full-Stack Developer',
        employmentType: 'CONTRACTOR',
        description:
          'Migrated a legacy Visual FoxPro financial system to a C#/.NET Core and Blazor web application ' +
          'as the sole engineer, rebuilding core financial workflows on Entity Framework Core and SQL Server.',
        occupationalCategory: 'Software Engineering',
        provider: {
          '@type': 'Organization',
          name: 'Benington Financials Canada',
        },
        startDate: '2023-02',
        endDate: '2025-09',
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'WorkBasedProgram',
        name: 'Mid-Level Fullstack Developer',
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
        startDate: '2021-12',
        endDate: '2023-06',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${bricolage.variable} ${dmMono.variable}`}
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
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for analytics */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        {/* Geo / author meta */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Lahore, Punjab, Pakistan" />
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
