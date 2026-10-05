import type { Metadata } from 'next';
import Link from 'next/link';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('react-table-virtualization-20000-rows');
export const metadata: Metadata = articleMetadata(meta);

const WINDOW = `const ROW = 36;       // row height in px
const VIEW = 432;     // height of the scroll area in px
const OVERSCAN = 6;   // extra rows above and below, so fast scrolling shows no gaps

const first = Math.max(0, Math.floor(scrollTop / ROW) - OVERSCAN);
const last = Math.min(rows.length, Math.ceil((scrollTop + VIEW) / ROW) + OVERSCAN);
const visible = rows.slice(first, last);`;

const MARKUP = `<div style={{ height: VIEW, overflow: 'auto' }} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
  {/* Full height, so the scrollbar behaves as if every row were there */}
  <div style={{ height: rows.length * ROW, position: 'relative' }}>
    <div style={{ transform: \`translateY(\${first * ROW}px)\` }}>
      {visible.map((row) => <Row key={row.id} row={row} />)}
    </div>
  </div>
</div>`;

const MEMO = `const Row = React.memo(function Row({ row }) {
  return <div className="row">...</div>;
});

const filtered = useMemo(() => rows.filter(matches(query)), [rows, query]);`;

const MEASURE = `const started = performance.now();
setQuery(next);
requestAnimationFrame(() =>
  requestAnimationFrame(() => console.log(performance.now() - started, 'ms to paint')),
);`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        On a multi-currency payments platform I optimized large data tables with react-window virtualization and memoization, which cut render time by about 70% on datasets over 20,000 rows. The technique is small enough to write by hand, and writing it once makes the libraries easy to reason about. The code below is the same code that runs in the <Link href="/lab">live demo on this site</Link>.
      </p>

      <h2>Why a big table is slow</h2>
      <p>
        The data is rarely the problem. Twenty thousand objects in memory is nothing. The cost is the DOM: every row is several elements that the browser has to create, style, lay out and paint, and React has to reconcile all of them on every update. A filter keystroke that touches 20,000 rows means 20,000 rows of work, even though the user can see about twelve.
      </p>

      <h2>Render only what is visible</h2>
      <p>
        Virtualization, also called windowing, keeps the full list in memory and puts only the visible slice in the DOM. With fixed-height rows it is arithmetic on the scroll position:
      </p>
      <pre><code>{WINDOW}</code></pre>
      <p>
        Then give the browser an inner element as tall as the whole list, and shift the visible slice down to where it belongs:
      </p>
      <pre><code>{MARKUP}</code></pre>
      <p>
        In the demo that turns 20,000 rows of data into roughly two dozen rows in the DOM, whatever the scroll position.
      </p>

      <h2>Where memoization fits</h2>
      <p>
        Windowing fixes how many rows exist. Memoization fixes how often the survivors re-render. Two places matter:
      </p>
      <pre><code>{MEMO}</code></pre>
      <ul>
        <li><strong>The row.</strong> Wrapped in <code>React.memo</code> with a stable <code>key</code>, a row that scrolls but does not change is not rendered again.</li>
        <li><strong>The derived list.</strong> Filtering and sorting 20,000 items on every scroll event is wasted work. <code>useMemo</code> recomputes only when the inputs change.</li>
      </ul>
      <p>
        Memoization only helps if props are stable. An inline object or arrow function passed to every row defeats it.
      </p>

      <h2>Measure it</h2>
      <p>
        React finishing is not the same as the user seeing the result. To time an update through to paint, wait two animation frames after the state change:
      </p>
      <pre><code>{MEASURE}</code></pre>
      <p>
        Record the number with virtualization off, then on, with the same data and the same action. That before and after is the only claim worth putting in a pull request.
      </p>

      <h2>What to watch for</h2>
      <ul>
        <li><strong>Variable row heights.</strong> The arithmetic above needs a fixed height. For rows that grow, use a library that measures them, and expect more complexity.</li>
        <li><strong>Find in page.</strong> The browser&apos;s search cannot see rows that are not in the DOM. Provide your own filter, as the demo does.</li>
        <li><strong>Accessibility.</strong> Tell assistive technology the real size with <code>aria-rowcount</code> and <code>aria-rowindex</code>, and make the scroll area focusable so it can be scrolled from the keyboard.</li>
        <li><strong>Production use.</strong> For real products use a maintained library such as react-window. It handles the edge cases; the principle is exactly the one above.</li>
      </ul>
    </ArticlePage>
  );
}
