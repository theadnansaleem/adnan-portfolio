import HomeExperience from '@/components/home/HomeExperience';
import { hxFonts } from '@/components/home/fonts';
import { profile } from '@/lib/data';

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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profilePageJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <HomeExperience fontClass={hxFonts} />
    </>
  );
}
