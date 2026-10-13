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

const HIDDEN = `socket.onmessage = (message) => {
  buffer.push(JSON.parse(message.data));
  if (buffer.length > 40) buffer.shift();              // the buffer is capped too
  if (!frame) frame = requestAnimationFrame(flush);
};`;

const RECONNECT = `let attempt = 0;
let lastId = null;
let timer = 0;

function connect() {
  const socket = new WebSocket(lastId ? \`\${url}?after=\${lastId}\` : url);

  socket.onopen = () => { attempt = 0; };
  socket.onmessage = (message) => {
    const event = JSON.parse(message.data);
    lastId = event.id;
    receive(event);
  };
  socket.onclose = () => {
    const ceiling = Math.min(30000, 1000 * 2 ** attempt++);   // 1s, 2s, 4s ... up to 30s
    timer = setTimeout(connect, ceiling / 2 + Math.random() * (ceiling / 2));
  };
}`;

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

      <h2>The hidden-tab trap</h2>
      <p>
        Browsers stop calling <code>requestAnimationFrame</code> while a tab is in the background, but the socket keeps receiving. With the code above, a dashboard left in another tab over lunch buffers every message until someone looks at it again, then tries to process them all at once. Cap the buffer the same way as the list:
      </p>
      <pre><code>{HIDDEN}</code></pre>
      <p>
        Counters that must stay exact should be updated in the message handler, not in the flush, so they stay correct while nothing is being drawn.
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

      <p>Put together, the reconnect logic is short:</p>
      <pre><code>{RECONNECT}</code></pre>
      <p>
        The random part of the delay matters. Without it, every client that lost the connection at the same moment comes back at the same moment, and the restarted server is hit by all of them together.
      </p>

      <h2>Notice a connection that died quietly</h2>
      <p>
        A connection can stop delivering without closing: a laptop wakes from sleep, a proxy drops an idle connection, a phone changes network. The browser may not fire <code>onclose</code> for a long time. Have the server send a small heartbeat message every few seconds, and if the client has received nothing for two or three intervals, close the socket yourself and let the reconnect logic take over.
      </p>

      <h2>Do not trust the feed</h2>
      <p>
        One malformed message should not stop the dashboard. Wrap the parse in a <code>try</code> block, check that the fields you rely on are present, and drop anything that fails while counting how often it happens. Treat text from the feed as text: render it through React as usual and never as HTML.
      </p>

      <h2>WebSocket or Server-Sent Events?</h2>
      <p>
        If data only flows from the server to the browser, Server-Sent Events are worth a look before a WebSocket. They run over ordinary HTTP, reconnect on their own, and resend the last event id for you through the <code>Last-Event-ID</code> header. Choose a WebSocket when the browser also needs to send messages on the same connection, or when the payload is binary.
      </p>

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
