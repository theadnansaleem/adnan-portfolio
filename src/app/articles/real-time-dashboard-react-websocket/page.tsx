import type { Metadata } from 'next';
import Link from 'next/link';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('real-time-dashboard-react-websocket');
export const metadata: Metadata = articleMetadata(meta);

const NAIVE = `socket.onmessage = (message) => {
  // One render per message, and a list that grows for as long as the tab is open
  setEvents((prev) => [JSON.parse(message.data), ...prev]);
};`;

const BATCHED = `useEffect(() => {
  const socket = new WebSocket(url);
  const buffer = [];
  let frame = 0;

  const flush = () => {
    frame = 0;
    const batch = buffer.splice(0).reverse();              // newest first
    setEvents((prev) => [...batch, ...prev].slice(0, 40)); // keep what the screen can show
  };

  socket.onmessage = (message) => {
    buffer.push(JSON.parse(message.data));
    if (!frame) frame = requestAnimationFrame(flush);      // at most one render per frame
  };

  return () => {
    socket.close();
    cancelAnimationFrame(frame);
  };
}, [url]);`;

const AGGREGATE = `// Counters grow by one per event; no need to recount the list
setCounts((prev) => ({ ...prev, [event.level]: prev[event.level] + 1 }));

// One bucket per second for the chart: add to the newest, drop the oldest every second
setHistory((prev) => [...prev.slice(0, -1), prev[prev.length - 1] + 1]);
setInterval(() => setHistory((prev) => [...prev.slice(1), 0]), 1000);`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        For a vehicle cybersecurity platform I engineered real-time threat detection dashboards in React and TypeScript on WebSocket feeds, which cut analyst time-to-insight by about 20%. A live dashboard has one job that a normal page does not: it must stay responsive while data keeps arriving, for hours. The <Link href="/lab">feed demo on this site</Link> shows the same state handling on a simulated feed.
      </p>

      <h2>What goes wrong first</h2>
      <p>The obvious version works in a demo and falls over in production:</p>
      <pre><code>{NAIVE}</code></pre>
      <p>
        It has two faults. Every message triggers a render, so a burst of fifty messages is fifty renders in a row. And the list never stops growing, so memory and render time climb all day until the tab is reloaded.
      </p>

      <h2>Render per frame, not per message</h2>
      <p>
        The screen updates about sixty times a second, so rendering more often than that is wasted work. Collect incoming messages in a buffer and flush it once per animation frame:
      </p>
      <pre><code>{BATCHED}</code></pre>
      <p>
        A burst of any size now costs one render. The cleanup function matters as much as the handler: without it, every remount leaves a socket open behind it.
      </p>

      <h2>Keep only what the screen can show</h2>
      <p>
        An analyst reads the latest few dozen events, not the last ten thousand. Cap the list (the demo keeps 40) and leave history to the server, which can page through it on request.
      </p>

      <h2>Aggregate as events arrive</h2>
      <p>
        Totals and charts should not be recalculated from the list, because the list is capped and recounting is slow. Update them incrementally:
      </p>
      <pre><code>{AGGREGATE}</code></pre>
      <p>
        The chart then draws thirty numbers, whatever the event rate.
      </p>

      <h2>Plan for the connection dropping</h2>
      <ul>
        <li><strong>Reconnect with backoff.</strong> Wait one second, then two, then four, up to a ceiling, so a server restart is not met by every client at once.</li>
        <li><strong>Show the state.</strong> A dashboard that silently stopped updating is worse than one that says it is reconnecting.</li>
        <li><strong>Catch up.</strong> After reconnecting, ask the server for what was missed, using the last event id you saw.</li>
      </ul>

      <h2>Give the user control</h2>
      <ul>
        <li><strong>Pause.</strong> Nobody can read a row that keeps moving. A pause button holds the view while events keep buffering.</li>
        <li><strong>Announce politely.</strong> Mark the event list with <code>role=&quot;log&quot;</code> so screen readers announce new entries without interrupting.</li>
        <li><strong>Make severity more than colour.</strong> Pair each colour with a word, so the meaning survives for colour-blind users and in print.</li>
      </ul>

      <h2>How to tell it holds</h2>
      <p>
        Raise the event rate well past what production sends and leave the page open. Frame rate should stay steady and memory should level off, not climb. If either drifts, something is still growing without a cap.
      </p>
    </ArticlePage>
  );
}
