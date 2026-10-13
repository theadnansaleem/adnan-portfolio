import type { Metadata } from 'next';
import HomeExperience from '@/components/home/HomeExperience';
import { hxFonts } from '@/components/home/fonts';
import { certifications, profile, stats } from '@/lib/data';
import { faqJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: { canonical: '/', languages: { en: '/', ar: '/ar', 'x-default': '/' } },
};

// Only the home page is the profile page; Person and WebSite come from the layout.
const profilePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${profile.url}/#profilepage`,
  url: `${profile.url}/`,
  name: `${profile.name} | ${profile.jobTitle}`,
  inLanguage: 'en',
  isPartOf: { '@id': `${profile.url}/#website` },
  mainEntity: { '@id': `${profile.url}/#person` },
  dateModified: new Date().toISOString(),
};

// Quick answers on the home page, also published as FAQ structured data. Every answer restates the CV.
const FAQ = [
  ['Who is M. Adnan Saleem?', profile.summary[0]],
  ['What does he work with?', 'React, Next.js and Angular with TypeScript on the frontend; Node.js, C#, .NET 6/8 and ASP.NET Core on the backend; SQL Server and PostgreSQL for data; AWS and Microsoft Azure for cloud.'],
  ['What results has he delivered?', 'A micro frontend rearchitecture that cut release cycle time by about 40%, table virtualization that cut render time by about 70% on 20,000+ rows, a migration of 42 financial workflows from Visual FoxPro to .NET, and Core Web Vitals work that improved LCP by about 35%.'],
  ['Is he available, and where is he based?', `Yes. ${profile.availability}, based in Lahore, Pakistan and open to relocation, with ${stats[1].number} years of fully remote work with US, UK and German teams.`],
  ['Which certifications does he hold?', `${certifications.length}, led by ${certifications[0].title} (${certifications[0].meta}). Each one is listed with its issuer on the certifications page.`],
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profilePageJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(FAQ) }} />
      <HomeExperience faq={FAQ} fontClass={hxFonts} updated={new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} />
    </>
  );
}
