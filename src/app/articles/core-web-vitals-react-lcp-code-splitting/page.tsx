import type { Metadata } from 'next';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('core-web-vitals-react-lcp-code-splitting');
export const metadata: Metadata = articleMetadata(meta);

const SPLIT = `// Before: the reports screen ships in the first bundle, to every visitor
import Reports from './Reports';

// After: it is downloaded only when someone opens it
const Reports = React.lazy(() => import('./Reports'));

<Suspense fallback={<ScreenSkeleton />}>
  <Reports />
</Suspense>`;

const RESERVE = `/* The image box has its final size before the image arrives, so nothing jumps */
.hero-image { aspect-ratio: 16 / 9; width: 100%; }`;

const HERO = `<!-- In the HTML itself, not added later by JavaScript, and never lazy-loaded -->
<img src="/hero.avif" width="1200" height="675" fetchpriority="high" alt="Stadium at night" />`;

const TRANSITION = `const [isPending, startTransition] = useTransition();

function onChange(event) {
  setText(event.target.value);                              // urgent: the field shows the key press
  startTransition(() => setQuery(event.target.value));     // can wait: the results list
}`;

const FIELD = `import { onCLS, onINP, onLCP } from 'web-vitals';

const send = (metric) =>
  navigator.sendBeacon('/vitals', JSON.stringify({ name: metric.name, value: metric.value, id: metric.id }));

onLCP(send);
onINP(send);
onCLS(send);`;

const YIELD = `async function applyFilters(rows, filters) {
  for (const chunk of chunksOf(rows, 500)) {
    processChunk(chunk, filters);
    // Let the browser paint between chunks:
    // scheduler.yield() where it exists, setTimeout elsewhere
    if ('scheduler' in window && 'yield' in scheduler) await scheduler.yield();
    else await new Promise((resolve) => setTimeout(resolve, 0));
  }
}`;

const ATTRIBUTION = `import { onINP, onLCP } from 'web-vitals/attribution';

onLCP(({ value, attribution: a }) => {
  // Which of the four delays is the big one?
  send('LCP', value, {
    element: a.target,
    ttfb: a.timeToFirstByte,
    loadDelay: a.resourceLoadDelay,
    loadDuration: a.resourceLoadDuration,
    renderDelay: a.elementRenderDelay,
  });
});

onINP(({ value, attribution: a }) => {
  // Which element, and was it the handler or the paint that was slow?
  send('INP', value, {
    element: a.interactionTarget,
    type: a.interactionType,
    inputDelay: a.inputDelay,
    processing: a.processingDuration,
    presentation: a.presentationDelay,
  });
});`;

const NEXT_VITALS = `// app/web-vitals.tsx
'use client';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    navigator.sendBeacon('/vitals', JSON.stringify(metric));
  });
  return null;
}

// app/layout.tsx: render <WebVitals /> once inside <body>`;

const NEXT_IMAGE = `import Image from 'next/image';

// The hero: preloaded from <head>, never lazy.
// Next.js 16 calls this preload; earlier versions used priority
<Image
  src="/hero.avif"
  width={1200}
  height={675}
  preload
  alt="Stadium at night"
/>`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        On Qatar&apos;s national event platforms I brought core pages to Core Web Vitals compliance through memoization, virtualization, lazy loading and code splitting, which improved LCP by about 35% and TTI by about 30%. On a payments platform, dynamic code splitting cut the initial bundle by about 35%. The method is the same every time, and it starts with measuring, not with optimizing.
      </p>

      <h2>The three numbers</h2>
      <ul>
        <li><strong>LCP</strong> (Largest Contentful Paint): when the biggest visible element appears. Good is 2.5 seconds or less.</li>
        <li><strong>INP</strong> (Interaction to Next Paint): how long the page takes to respond to a tap or key press. Good is 200 milliseconds or less.</li>
        <li><strong>CLS</strong> (Cumulative Layout Shift): how much the page jumps while loading. Good is 0.1 or less.</li>
      </ul>
      <p>
        Google judges these on real visits at the 75th percentile, so a fast laptop on office wifi tells you very little. Test with mobile emulation and a throttled connection.
      </p>
      <div className="hx-prose-table" role="region" aria-label="Core Web Vitals thresholds" tabIndex={0}>
        <table>
          <caption>The thresholds, as published in Google&apos;s web-vitals library</caption>
          <thead><tr><th scope="col">Metric</th><th scope="col">Good</th><th scope="col">Needs improvement</th><th scope="col">Poor</th></tr></thead>
          <tbody>
            <tr><td>LCP</td><td>2.5 s or less</td><td>2.5 s to 4 s</td><td>over 4 s</td></tr>
            <tr><td>INP</td><td>200 ms or less</td><td>200 ms to 500 ms</td><td>over 500 ms</td></tr>
            <tr><td>CLS</td><td>0.1 or less</td><td>0.1 to 0.25</td><td>over 0.25</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Find the LCP element first</h2>
      <p>
        Lighthouse and the Performance panel in Chrome both name the element that counts as the largest paint. Until you know which one it is, every optimization is a guess. It is usually a hero image or a headline, and the question is always the same: what has to download and run before that one element can appear?
      </p>

      <h2>LCP is four delays added together</h2>
      <p>The time to the largest paint breaks down into four parts, and each has a different fix:</p>
      <ul>
        <li><strong>Time to first byte.</strong> How long the server takes to start answering. Fixed with caching, a CDN, or rendering on the server ahead of time.</li>
        <li><strong>Resource load delay.</strong> The gap before the browser even starts fetching the LCP resource. Long when the image is only discovered after JavaScript runs.</li>
        <li><strong>Resource load duration.</strong> The download itself. Fixed with smaller, better-compressed files.</li>
        <li><strong>Element render delay.</strong> The resource has arrived but the page cannot paint it yet, usually because scripts or stylesheets are still blocking.</li>
      </ul>
      <p>
        In a client-rendered React app the second and fourth parts are usually the large ones: nothing can be discovered or painted until the bundle has downloaded and run. That is why the next two sections matter most.
      </p>

      <h2>If the LCP element is an image</h2>
      <pre><code>{HERO}</code></pre>
      <ul>
        <li><strong>Put it in the first HTML response.</strong> An image that React adds after hydration cannot start downloading until the JavaScript has finished.</li>
        <li><strong>Mark it as high priority</strong> with <code>fetchpriority=&quot;high&quot;</code>, and never give it <code>loading=&quot;lazy&quot;</code>.</li>
        <li><strong>Send the right size.</strong> Use <code>srcset</code> so a phone does not download a desktop image, and a modern format such as AVIF or WebP.</li>
        <li><strong>Set width and height</strong> so the space is reserved before the file arrives.</li>
      </ul>

      <h2>Ship less before the first paint</h2>
      <p>
        Most React apps send every screen to every visitor. Code splitting sends a screen only when it is opened:
      </p>
      <pre><code>{SPLIT}</code></pre>
      <p>
        Split by route first, then split heavy pieces inside a route: charts, editors, maps, export dialogs. Anything below the fold or behind a click is a candidate.
      </p>

      <h2>Preload only what the first screen needs</h2>
      <p>
        Preloading is a promise that a file is urgent. Break that promise and the urgent files wait behind the others. This site is a small example: every page preloaded seven font files, four of which were used on one page each. Removing those four preloads took the Lighthouse mobile score from between 85 and 88 to 92 and cut the simulated LCP from about 4.1 seconds to 3.4, with no visible change.
      </p>

      <h2>Keep interactions cheap</h2>
      <p>
        INP suffers when one interaction re-renders too much. Two tools cover most cases. Memoization (<code>React.memo</code>, <code>useMemo</code>) stops components and calculations from repeating when their inputs did not change. Virtualization keeps long lists and tables down to the rows that are on screen.
      </p>
      <p>
        When the work cannot be avoided, tell React which part is urgent. A transition lets the key press paint first and the heavy update follow:
      </p>
      <pre><code>{TRANSITION}</code></pre>

      <h2>Break up long tasks</h2>
      <p>
        An interaction is three parts: the input delay before your handler starts, the processing time of the handler, and the presentation delay until the next frame is painted. A handler that runs for 300 milliseconds blocks all three for every other interaction that arrives meanwhile. When the work cannot be made smaller, split it into chunks and hand control back to the browser between them:
      </p>
      <pre><code>{YIELD}</code></pre>
      <p>
        <code>scheduler.yield()</code> resumes your work as a prioritised task, ahead of other queued work, which a plain <code>setTimeout</code> does not. It is in Chrome from version 129 and Firefox from 142; Safari does not have it at the time of writing, hence the fallback. Large DOMs make the presentation part slow on their own, which is where virtualization and <code>content-visibility</code> come in.
      </p>

      <h2>Stop the page from jumping</h2>
      <p>
        Layout shift comes from content that arrives without reserved space: images, embeds, late banners, fonts that swap to a different width. Reserve the space up front:
      </p>
      <pre><code>{RESERVE}</code></pre>

      <h2>Measure before and after, the same way</h2>
      <ul>
        <li>Run the same test three times before a change and three times after. Single runs vary too much to trust.</li>
        <li>Change one thing at a time, so you know what worked. I tried deferring hidden images on this site and it measured no gain, so it was dropped.</li>
        <li>Lab tools estimate. Real-user data, from the Chrome UX Report or your own analytics, is what Google uses, so confirm there once traffic allows.</li>
      </ul>

      <h2>Collect the numbers from real visits</h2>
      <p>
        Google&apos;s <code>web-vitals</code> library reports the same three metrics from your own users, so you do not have to wait for enough traffic to appear in the public data set:
      </p>
      <pre><code>{FIELD}</code></pre>
      <p>
        The <a href="#try-it">demo at the end of this article</a> reads the same browser entries directly and shows them for the page you have open.
      </p>
      <p>
        Store them with the page path and the device type. The pages that fail are rarely the ones the team tests every day, and the 75th percentile on mobile is usually far from what a developer laptop shows.
      </p>

      <h2>Where the time goes: attribution</h2>
      <p>
        A bad number on its own does not say what to fix. The library&apos;s attribution build splits each metric into the parts described above, and names the element involved:
      </p>
      <pre><code>{ATTRIBUTION}</code></pre>
      <p>
        With the LCP parts recorded, the fix is usually obvious: a large <code>resourceLoadDelay</code> means the image is discovered late, a large <code>elementRenderDelay</code> means scripts are blocking the paint. For INP, <code>interactionTarget</code> is a CSS selector for the element the user touched, which is how you find the one slow button among hundreds of fast ones.
      </p>

      <h2>In Next.js</h2>
      <p>
        Next.js wraps the same library. One client component in the root layout reports every metric:
      </p>
      <pre><code>{NEXT_VITALS}</code></pre>
      <p>
        For the LCP image, the <code>Image</code> component adds the <code>width</code>, <code>height</code> and <code>srcset</code> for you. What it cannot guess is which image matters, so say so:
      </p>
      <pre><code>{NEXT_IMAGE}</code></pre>
      <p>
        Use it on one image per page, the one that is the largest paint on most viewports. Preloading several images puts them in a queue together, which is the font problem from earlier in a different costume.
      </p>
    </ArticlePage>
  );
}
