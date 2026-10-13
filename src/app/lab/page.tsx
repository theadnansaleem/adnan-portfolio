import type { Metadata } from 'next';
import PageFrame from '@/components/home/PageFrame';
import { pageJsonLd } from '@/lib/seo';
import VirtualRows from '@/components/home/lab/VirtualRows';
import ThreatFeed from '@/components/home/lab/ThreatFeed';
import AccessTiers from '@/components/home/lab/AccessTiers';
import FailSmall from '@/components/home/lab/FailSmall';
import PageVitals from '@/components/home/lab/PageVitals';

const TITLE = 'Lab: live demos';
const DESCRIPTION = 'Five working demos of techniques from my CV: a virtualized 20,000-row table, a real-time dashboard, tiered data redaction, sections that fail alone, and live Core Web Vitals.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/lab' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/lab', images: ['/opengraph-image'] },
};

export default function LabPage() {
  return (
    <PageFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageJsonLd('/lab', 'Lab', DESCRIPTION) }} />
      <header className="hx-head">
        <p className="hx-cap"><b>Lab</b> Live demos</p>
        <h1>Claims you can <em>click</em></h1>
        <p>Five lines from my CV, each running in your browser with synthetic data. Break things: that is what they are for.</p>
      </header>

      <section className="hx-lab">
        <div>
          <p className="hx-cap"><b>01</b> Volopa Financial Services</p>
          <h2>20,000 rows that still scroll</h2>
          <p>On a multi-currency payments platform I cut table render time by about 70% on datasets over 20,000 rows, using virtualization and memoization. Filter, scroll, then switch virtualization off.</p>
        </div>
        <VirtualRows />
      </section>

      <section className="hx-lab">
        <div>
          <p className="hx-cap"><b>02</b> Primary Target GmbH</p>
          <h2>A dashboard that keeps up with its feed</h2>
          <p>For the Codex vehicle cybersecurity platform I built real-time threat dashboards on WebSocket feeds. This one runs on a simulated feed: raise the rate and watch the counters, chart and log stay in step.</p>
        </div>
        <ThreatFeed />
      </section>

      <section className="hx-lab">
        <div>
          <p className="hx-cap"><b>03</b> Primary Target GmbH</p>
          <h2>One record, four answers</h2>
          <p>On the same platform I secured sensitive security data with four-tier role-based access control and data redaction filtered by caller tier. Change the tier and watch what the response leaves out.</p>
        </div>
        <AccessTiers />
      </section>

      <section className="hx-lab">
        <div>
          <p className="hx-cap"><b>04</b> Supreme Committee for Delivery &amp; Legacy</p>
          <h2>Break one section, keep the page</h2>
          <p>I rearchitected a monolithic React frontend into micro frontends with Module Federation. A remote can fail to load, so each one sits behind its own error boundary. Break one here and use the others.</p>
        </div>
        <FailSmall />
      </section>

      <section className="hx-lab">
        <div>
          <p className="hx-cap"><b>05</b> Supreme Committee for Delivery &amp; Legacy</p>
          <h2>This page, measured as you read it</h2>
          <p>On Qatar&apos;s national event platforms I brought core pages to Core Web Vitals compliance. These are the same metrics for the page you are on, read live from your browser.</p>
        </div>
        <PageVitals />
      </section>
    </PageFrame>
  );
}
