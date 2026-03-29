import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theadnansaleem.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      /* ── Google (main + image + video crawlers) ─────────────────────── */
      {
        userAgent: ['Googlebot', 'Googlebot-Image', 'Googlebot-Video'],
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/'],
      },
      /* ── Bing crawlers ──────────────────────────────────────────────── */
      {
        userAgent: ['Bingbot', 'BingPreview'],
        allow: '/',
        disallow: ['/api/', '/_next/', '/static/'],
      },
      /* ── Other major search engines ─────────────────────────────────── */
      {
        userAgent: [
          'DuckDuckBot',
          'Slurp',        // Yahoo
          'Baiduspider',
          'YandexBot',
          'facebookexternalhit',
          'Twitterbot',
          'LinkedInBot',
          'WhatsApp',
        ],
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      /* ── Catch-all for everything else ──────────────────────────────── */
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/static/',
          '/*.json$',
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
