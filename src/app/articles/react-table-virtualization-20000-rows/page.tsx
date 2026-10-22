import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';
import benchmark from '../../../../public/benchmarks/react-virtualization-2026-10-15/results.json';

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
  requestAnimationFrame(() => console.log(Math.round(performance.now() - started), 'ms update delay estimate')),
);`;

const DEFERRED = `const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);

// The input updates at once; the expensive filter follows when the browser has time
const filtered = useMemo(() => rows.filter(matches(deferredQuery)), [rows, deferredQuery]);`;

const REACT_WINDOW = `import { FixedSizeList } from 'react-window';

<FixedSizeList height={432} width="100%" itemCount={rows.length} itemSize={36} overscanCount={6}>
  {({ index, style }) => (
    <div style={style} className="row">{rows[index].name}</div>
  )}
</FixedSizeList>`;

const TANSTACK = `import { useVirtualizer } from '@tanstack/react-virtual';

function Log({ entries }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // a guess; rows are measured as they render
    overscan: 6,
  });

  return (
    <div ref={parentRef} style={{ height: 432, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            data-index={row.index}
            ref={virtualizer.measureElement}
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              transform: \`translateY(\${row.start}px)\`,
            }}
          >
            {entries[row.index].message}
          </div>
        ))}
      </div>
    </div>
  );
}`;

const PAGED = `const PAGE = 200;
const items = virtualizer.getVirtualItems();
const lastVisible = items[items.length - 1]?.index ?? 0;

// Within half a page of the end of what is loaded, and nothing in flight: fetch the next page
useEffect(() => {
  if (hasMore && !loading && lastVisible >= rows.length - PAGE / 2) loadMore();
}, [lastVisible, rows.length, hasMore, loading]);`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        On a multi-currency payments platform I optimized large data tables with react-window virtualization and memoization, which cut render time by about 70% on datasets over 20,000 rows. That is a historical client result. The synthetic benchmark below is a separate reproduction of the windowing technique, using the hand-written <a href="#try-it">live demo at the end of this article</a>; it does not recreate the client application or validate that percentage.
      </p>

      <h2 id="benchmark">Reproducible React virtualization benchmark: 20,000 rows</h2>
      <p>
        On 15 October 2026 I tested the same two filter actions with windowing off and on in a local production build. The demo generates 20,000 synthetic transfers from seed 42; exactly 2,361 match <code>EUR</code>. Each row has four cells, a fixed height of 36px, a 432px scroll area and six overscan rows on each side. At scroll position zero, windowing mounts 18 rows. This implementation uses <code>useMemo</code> for filtering, but no memoized row component and no react-window dependency.
      </p>
      <div className="hx-prose-table" role="region" aria-label="Virtualization benchmark results" tabIndex={0}>
        <table>
          <caption>Update delay estimate in milliseconds: median (minimum–maximum), 10 measured runs per cell</caption>
          <thead><tr><th scope="col">Same filter action</th><th scope="col">Windowing off</th><th scope="col">Windowing on</th></tr></thead>
          <tbody>
            {benchmark.summaries.map((result) => (
              <tr key={result.transition}>
                <th scope="row">{result.transition === 'blank-to-EUR' ? 'Blank → EUR' : 'EUR → blank'}</th>
                <td>{result.off.median_ms} ({result.off.min_ms}–{result.off.max_ms})</td>
                <td>{result.on.median_ms} ({result.on.min_ms}–{result.on.max_ms})</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        After filtering, the non-windowed DOM contains 2,361 rows; clearing it restores 20,000. The windowed DOM holds 18 in both cases at the top of the list. Filtering still scans the same data in either mode. The difference here is how much of the result React and the browser have to update.
      </p>
      <p>
        <strong>Test environment:</strong> Apple M5, 16 GiB RAM, macOS 27.0.1, Codex in-app browser reporting Chromium 155, React/React DOM 19.2.3 and Next.js 16.3.5. The visible viewport was 1280 × 720 CSS pixels at device pixel ratio 2. No CPU or network throttling was applied by the test. Other desktop work was running and the display refresh rate was not recorded, so these absolute timings are specific to this session.
      </p>
      <h2>Repeat the benchmark</h2>
      <p>
        Start with the <a href={`https://github.com/theadnansaleem/adnan-portfolio/blob/${benchmark.source_commit}/${benchmark.source_path}`}>exact measured demo source</a> at commit <code>{benchmark.source_commit.slice(0, 7)}</code>. The <a href="/benchmarks/react-virtualization-2026-10-15/results.json" download>raw JSON</a> records all 64 official samples, environment, source checksum and summaries, including warmups.
      </p>
      <pre><code>{`git clone https://github.com/theadnansaleem/adnan-portfolio.git
cd adnan-portfolio
git checkout ${benchmark.source_commit}
npm ci
npm run build
npm run start -- --hostname 127.0.0.1 --port 3047`}</code></pre>
      <ol>
        <li>Open <code>http://127.0.0.1:3047/lab</code> in a visible browser tab. Use the same viewport for both modes, pause the simulated threat feed, leave the transfer table scrolled to the top, and start with a blank filter.</li>
        <li>Replace the whole filter with <code>EUR</code> in one action, then clear it in one action. Wait for the timer to update after each action and record the displayed estimate and row count. Typing E, U and R separately is a different test.</li>
        <li>Use four blocks in this order: windowing off, on, on, off. In each block, discard three filter/clear warmup pairs, then record five pairs. This gives ten measured runs for each action in each mode. Do not include the mode-toggle timings.</li>
        <li>Keep the two actions separate. Sort each group of ten timings and average its fifth and sixth values for the median; also report the minimum and maximum. Retain every measured sample, including slow outliers.</li>
      </ol>
      <p>
        For the recorded run, browser automation changed the whole input value, captured a screenshot after each action, then read the timer and row count. That observation can add overhead. Preliminary pilots were excluded when full-DOM accessibility snapshots exceeded the browser message limit; all official samples used the same screenshot procedure. No official measured sample was removed. The timings exclude page load and network transfer, and do not measure scroll smoothness, memory, INP or a general React speedup.
      </p>
      <figure>
        <Image src="/benchmarks/react-virtualization-2026-10-15/virtualized.jpg" width={1280} height={720} sizes="(max-width: 760px) 100vw, 720px" alt="The synthetic demo with virtualization on: 20,000 data rows and 18 DOM rows at the top of the list." />
        <figcaption>A separate demonstration capture after the measured runs. Its 14 ms reading is one update, not the median. <a href="/benchmarks/react-virtualization-2026-10-15/full-dom.jpg">View the full-DOM comparison</a>.</figcaption>
      </figure>
      <p>
        A <a href="/benchmarks/react-virtualization-2026-10-15/full-dom-trace.json.gz" download>compressed performance trace</a> captures a separate non-windowed filter/clear pair with <code>devtools.timeline</code> and <code>blink.user_timing</code> categories. It is excluded from the table because tracing adds overhead. Load it in the Chrome DevTools Performance panel to inspect scripting, layout and paint activity; <a href="https://developer.chrome.com/docs/devtools/performance/save-trace">Chrome documents saving and loading traces</a>. Record your own trace with windowing on for comparison.
      </p>
      <p>
        <Link href="/frontend-developer">See my React experience</Link> or <Link href="/work/volopa-react-performance">read the payments-platform case study</Link> for the production context behind this example.
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

      <h2>Keep typing responsive while the list filters</h2>
      <p>
        Windowing makes rendering cheap, but filtering 20,000 objects still takes time, and doing it on every keystroke makes the input lag behind the keyboard. React 18 can separate the two: the text field updates immediately and the filter runs at a lower priority.
      </p>
      <pre><code>{DEFERRED}</code></pre>
      <p>
        If the filter is slow even then, the data set has outgrown the browser and the filtering belongs on the server.
      </p>

      <h2>Virtualize or paginate?</h2>
      <ul>
        <li><strong>Paginate</strong> when people look something up: they search, open one record and leave. The server filters and sorts, and each page is small.</li>
        <li><strong>Virtualize</strong> when people scan and compare: transaction histories, logs, monitoring views. Scrolling is how they read, and page breaks get in the way.</li>
        <li><strong>Do both</strong> when the list is too big to download at once. Fetch pages from the server as the user scrolls and virtualize whatever has arrived.</li>
      </ul>

      <h2>A million rows</h2>
      <p>
        Past a few hundred thousand rows the browser is the wrong place for the data, whatever the rendering technique. Downloading it takes longer than anyone will wait, filtering it on the main thread freezes the input, and the memory is paid by every visitor. The pattern that scales is the third option above: the server owns the data and the sort order, the client fetches pages as the user scrolls, and the virtualizer renders whatever has arrived.
      </p>
      <pre><code>{PAGED}</code></pre>
      <p>
        The DOM then holds a few dozen rows whether the total is twenty thousand or twenty million. Show the server&apos;s total count in the header, so the user knows how long the list is, and reset the loaded pages when the filter or sort changes.
      </p>

      <h2>The same thing with react-window</h2>
      <p>
        In version 1 of react-window, the hand-written version above becomes one component. The <code>style</code> it passes to each row carries the position, so it has to be applied:
      </p>
      <pre><code>{REACT_WINDOW}</code></pre>
      <p>
        The numbers are the same three as before: the height of the scroll area, the height of a row, and the overscan.
      </p>

      <h2>Variable row heights with TanStack Virtual</h2>
      <p>
        The arithmetic above assumes every row is the same height. Log lines, comments and messages are not, and guessing wrong leaves gaps or overlaps. A library that measures rows as they render solves it; TanStack Virtual does so with a resize observer, and asks only for an estimate to lay out the rows it has not seen yet:
      </p>
      <pre><code>{TANSTACK}</code></pre>
      <p>
        Three details carry the weight. <code>estimateSize</code> should be close to the largest common height, so positions start near their final values. <code>measureElement</code> on the row&apos;s <code>ref</code>, together with <code>data-index</code>, is what reports the real height back. And <code>getTotalSize()</code> grows and shrinks as measurements arrive, so the scrollbar stays honest. The same hook handles fixed heights, columns and grids, so it is a reasonable default for new work.
      </p>

      <h2>Headers and wide tables</h2>
      <p>
        Keep the header row outside the scrolling element, or make it <code>position: sticky</code>, so it does not scroll away with the rows. Column widths must then be fixed or shared between header and body, because the rows no longer sit in one table layout that sizes them together. If the table is wide as well as long, the same arithmetic works sideways: render only the columns in view.
      </p>

      <h2>What the timer actually measures</h2>
      <p>
        The demo starts its clock inside the input handler, changes state, then reads the clock in the second animation-frame callback. Each interaction captures its own start time. This is an update-delay estimate, not a paint timestamp:
      </p>
      <pre><code>{MEASURE}</code></pre>
      <p>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame">Animation-frame callbacks run before repaint</a>, depend on the display refresh rate and may pause in background tabs. Two callbacks do not guarantee that a particular React update was painted. Fast results can mostly reflect frame scheduling, and slow results can include unrelated main-thread work. For React render duration use <a href="https://react.dev/reference/react/Profiler">React&apos;s Profiler</a> in a profiling-enabled build, separately from this normal production-build comparison.
      </p>

      <h2>What to watch for</h2>
      <ul>
        <li><strong>Variable row heights.</strong> The arithmetic above needs a fixed height. For rows that grow, use a library that measures them, as in the <a href="#variable-row-heights-with-tanstack-virtual">TanStack Virtual example</a>.</li>
        <li><strong>Find in page.</strong> The browser&apos;s search cannot see rows that are not in the DOM. Provide your own filter, as the demo does.</li>
        <li><strong>Accessibility.</strong> Tell assistive technology the real size with <code>aria-rowcount</code> and <code>aria-rowindex</code>, and make the scroll area focusable so it can be scrolled from the keyboard.</li>
        <li><strong>Production use.</strong> For real products use a maintained library such as react-window. It handles the edge cases; the principle is exactly the one above.</li>
      </ul>
    </ArticlePage>
  );
}
