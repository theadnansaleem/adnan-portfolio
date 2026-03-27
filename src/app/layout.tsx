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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theadnan.vercel.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050505',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Muhammad Adnan — Senior Software Engineer',
  description:
    'Senior Software Engineer based in Sahiwal. Specialising in Next.js, AI-powered workflows, and enterprise-scale applications.',
  keywords: ['Senior Software Engineer', 'Next.js', 'React', 'TypeScript', 'AI', 'Sahiwal', 'Portfolio'],
  authors: [{ name: 'Muhammad Adnan', url: SITE_URL }],
  creator: 'Muhammad Adnan',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Muhammad Adnan Portfolio',
    title: 'Muhammad Adnan — Senior Software Engineer',
    description: 'Senior Software Engineer based in Sahiwal. Next.js · AI · Enterprise Apps.',
    locale: 'en_US',
    images: [{ url: '/LinkedinPost.png', width: 1200, height: 630, alt: 'Muhammad Adnan — Senior Software Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Adnan — Senior Software Engineer',
    description: 'Senior Software Engineer based in Sahiwal. Next.js · AI · Enterprise Apps.',
    creator: '@adnan',
    images: ['/LinkedinPost.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? '',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${bricolage.variable} ${dmMono.variable}`}>
      <body>
        <SmoothScrollProvider>
          <MusicPlayerProvider>
            <PageLoader />
            <CustomCursor />
            <NoiseOverlay />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Person',
                  name: 'Muhammad Adnan',
                  jobTitle: 'Senior Software Engineer',
                  url: SITE_URL,
                  worksFor: { '@type': 'Organization', name: 'e& enterprise' },
                  address: { '@type': 'PostalAddress', addressLocality: 'Sahiwal', addressCountry: 'AE' },
                  knowsAbout: ['Next.js', 'React', 'TypeScript', 'AI Automation', 'n8n', 'Claude AI'],
                }),
              }}
            />
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
            <main>{children}</main>
            <Footer />
          </MusicPlayerProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
