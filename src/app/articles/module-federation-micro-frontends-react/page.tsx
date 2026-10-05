import type { Metadata } from 'next';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('module-federation-micro-frontends-react');
export const metadata: Metadata = articleMetadata(meta);

const HOST_CONFIG = `// shell/webpack.config.js
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    events: 'events@https://events.example.com/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
  },
});`;

const REMOTE_CONFIG = `// events/webpack.config.js
new ModuleFederationPlugin({
  name: 'events',
  filename: 'remoteEntry.js',
  exposes: {
    './EventsApp': './src/EventsApp',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
  },
});`;

const LAZY_REMOTE = `const EventsApp = React.lazy(() => import('events/EventsApp'));

<ErrorBoundary fallback={<SectionUnavailable name="Events" />}>
  <Suspense fallback={<SectionSkeleton />}>
    <EventsApp user={user} basePath="/events" />
  </Suspense>
</ErrorBoundary>`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        On the Qatar Events Platform I rearchitected a monolithic React frontend into micro frontends using Module Federation. With versioned contracts between the shell and the remotes, release cycle time dropped by about 40% and teams could deploy independently. This is the shape of that kind of split, and the parts that decide whether it helps or hurts.
      </p>

      <h2>First, check that you have the problem</h2>
      <p>
        Micro frontends solve an organisational problem, not a technical one. They are worth the cost when several teams ship into one frontend and block each other: one release train, one long build, one team&apos;s unfinished work holding up another team&apos;s fix. If one team owns the whole frontend, a well-structured monolith with code splitting is simpler and faster.
      </p>

      <h2>The pieces</h2>
      <p>
        A <strong>shell</strong> (also called the host) owns the page frame, routing, authentication and the shared design system. Each <strong>remote</strong> is a separately built and deployed application that exposes one or more modules. At runtime the shell fetches a small manifest from each remote, called <code>remoteEntry.js</code>, and loads the exposed module from it.
      </p>
      <p>The remote declares what it exposes:</p>
      <pre><code>{REMOTE_CONFIG}</code></pre>
      <p>The shell declares where to find it:</p>
      <pre><code>{HOST_CONFIG}</code></pre>
      <p>
        The <code>shared</code> block matters most. React must be a singleton: two copies on one page break hooks and context. Declaring a required version makes a mismatch a visible warning, not a silent second copy.
      </p>

      <h2>The contract is the product</h2>
      <p>
        Independent deploys only work if the boundary between shell and remote is treated as a public interface. In practice that means three rules.
      </p>
      <ul>
        <li><strong>Small, typed surface.</strong> A remote exposes a root component with a handful of props (the user, a base path, callbacks for navigation). It does not reach into the shell&apos;s store.</li>
        <li><strong>Versioned.</strong> A breaking change to the props is a new major version of the contract, and the shell keeps supporting the previous one until every remote has moved.</li>
        <li><strong>Checked in CI.</strong> The contract types live in a shared package, so a remote that drifts fails its own build, not production.</li>
      </ul>

      <h2>Fail small</h2>
      <p>
        A remote is a network dependency, so it can fail to load. Load each one lazily behind an error boundary, so a broken remote takes down its own section and not the whole page:
      </p>
      <pre><code>{LAZY_REMOTE}</code></pre>

      <h2>What goes wrong</h2>
      <ul>
        <li><strong>Shared state creep.</strong> The moment two remotes share a store, they deploy together again. Pass data through the contract or through the URL.</li>
        <li><strong>CSS leaking across remotes.</strong> Use scoped styles (CSS Modules or a prefix per remote) and keep global styles in the shell only.</li>
        <li><strong>Dependency drift.</strong> If remotes upgrade shared libraries at different times, users download several versions. Agree an upgrade window for the shared set.</li>
        <li><strong>Slower first load.</strong> More requests before the first paint. Preload the remote entry for the route the user is most likely to open.</li>
      </ul>

      <h2>How to tell it worked</h2>
      <p>
        Measure the thing you were trying to fix: time from merge to production for a single team, and how often one team&apos;s release waits on another. Release cycle time is the number that moved for us. Bundle size and load time should stay flat or improve; if they got worse, the shared configuration needs another look.
      </p>
    </ArticlePage>
  );
}
