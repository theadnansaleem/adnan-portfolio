import type { Metadata } from 'next';
import PageFrame from '@/components/home/PageFrame';
import { pageJsonLd } from '@/lib/seo';
import VirtualRows from '@/components/home/lab/VirtualRows';
import ThreatFeed from '@/components/home/lab/ThreatFeed';

const TITLE = 'Lab: live demos';
const DESCRIPTION = 'Two working demos of techniques from my CV: a virtualized 20,000-row table and a real-time event dashboard.';

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
        <p>Two lines on my CV are about making heavy interfaces fast. Here is each technique running in your browser, with synthetic data.</p>
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
    </PageFrame>
  );
}
