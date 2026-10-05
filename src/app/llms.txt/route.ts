import { articles } from '@/lib/articles';
import { caseStudies } from '@/lib/case-studies';
import { profile } from '@/lib/data';

export const dynamic = 'force-static';

// Plain-text map of the site for language-model crawlers (https://llmstxt.org), built from the same data as the pages
export function GET() {
  const link = (label: string, path: string) => `- [${label}](${profile.url}${path})`;
  const text = [
    `# ${profile.name}`,
    '',
    `> ${profile.summary[0]}`,
    '',
    '## Pages',
    '',
    link('Home: summary, impact, projects, experience and skills', '/'),
    link('About: background, education and quick answers', '/about'),
    link('Hire: role, availability and work history at a glance', '/hire'),
    link('Lab: live demos of table virtualization and a real-time dashboard', '/lab'),
    link('Frontend developer: React, Next.js and Angular experience', '/frontend-developer'),
    link('.NET developer: C#, ASP.NET Core and Blazor experience', '/dotnet-developer'),
    link('Arabic version', '/ar'),
    link('CV (PDF)', profile.resume),
    '',
    '## Case studies',
    '',
    link('All case studies', '/work'),
    ...caseStudies.map((study) => link(study.title, `/work/${study.slug}`)),
    '',
    '## Articles',
    '',
    link('All articles', '/articles'),
    ...articles.map((a) => link(a.title, `/articles/${a.slug}`)),
    '',
    '## Contact',
    '',
    `- Email: ${profile.email}`,
    `- LinkedIn: ${profile.linkedin}`,
    `- GitHub: ${profile.github}`,
    '',
  ].join('\n');
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
