import { profile } from '@/lib/data';

export const dynamic = 'force-static';

// Contact card built from the same profile data as the pages
export function GET() {
  const card = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.name}`,
    'N:Saleem;Adnan;;;',
    `TITLE:${profile.jobTitle}`,
    `EMAIL;TYPE=INTERNET:${profile.email}`,
    `URL:${profile.url}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedin}`,
    'ADR;TYPE=HOME:;;;Lahore;;;Pakistan',
    'END:VCARD',
  ].join('\r\n');
  return new Response(card, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="adnan-saleem.vcf"',
    },
  });
}
