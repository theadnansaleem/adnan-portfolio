import { articles } from '@/lib/articles';
import { profile } from '@/lib/data';

export const dynamic = 'force-static';

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// RSS 2.0 feed of the articles, newest first
export function GET() {
  const items = [...articles]
    .sort((a, b) => b.published.localeCompare(a.published))
    .map((a) => {
      const url = `${profile.url}/articles/${a.slug}`;
      return `<item><title>${escape(a.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(a.published).toUTCString()}</pubDate><description>${escape(a.description)}</description></item>`;
    });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${escape(profile.name)}: articles</title>
<link>${profile.url}/articles</link>
<description>Practical write-ups on React, micro frontends, .NET and legacy migration.</description>
<language>en</language>
<atom:link href="${profile.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
