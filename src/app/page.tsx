import Hero from '@/components/sections/Hero';
import MarqueeStrip from '@/components/ui/MarqueeStrip';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import ParallaxText from '@/components/sections/ParallaxText';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import { marqueeItems, profile } from '@/lib/data';

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
      <Hero />
      <MarqueeStrip items={marqueeItems} />
      <About />
      <Experience />
      <ParallaxText />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}
