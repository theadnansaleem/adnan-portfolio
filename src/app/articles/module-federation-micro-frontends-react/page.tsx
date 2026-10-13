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

const BOOTSTRAP = `// shell/src/index.js: the only line in the entry file
import('./bootstrap');

// shell/src/bootstrap.js: what index.js used to contain
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(<App />);`;

const ROUTES = `// The shell owns the first path segment and hands the rest to the remote
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/events/*" element={<EventsApp user={user} basePath="/events" />} />
</Routes>`;

const TYPES = `// shell/src/remotes.d.ts
declare module 'events/EventsApp' {
  import type { ComponentType } from 'react';
  import type { EventsAppProps } from '@platform/contracts';

  const EventsApp: ComponentType<EventsAppProps>;
  export default EventsApp;
}`;

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

      <h2>Start the app behind an async boundary</h2>
      <p>
        Shared modules are negotiated at runtime: the shell and its remotes compare versions and agree on one copy before any of them uses it. That takes a moment, so the entry file cannot import React directly. If it does, webpack stops with &quot;Shared module is not available for eager consumption&quot;. The fix is to move the real entry into a second file and import it dynamically:
      </p>
      <pre><code>{BOOTSTRAP}</code></pre>
      <p>Every shell and every remote needs this, and it is the first thing to check when a new remote fails on start.</p>

      <h2>Routing: split the path, not the router</h2>
      <p>
        Two routers fighting over one URL is the most common early bug. Give the shell the first path segment and give each remote everything below its own prefix:
      </p>
      <pre><code>{ROUTES}</code></pre>
      <p>
        The remote builds its links from <code>basePath</code>, never from a hard-coded <code>/events</code>, so the shell can mount it anywhere. Navigation between remotes goes through the URL or through a callback in the contract, not through a shared router instance.
      </p>

      <h2>Give the compiler the remote&apos;s types</h2>
      <p>
        TypeScript cannot see a module that only exists at runtime, so an import from a remote is untyped unless you declare it. Point the declaration at the shared contract package:
      </p>
      <pre><code>{TYPES}</code></pre>
      <p>
        Now a shell that passes the wrong props fails to compile, and a remote that changes its props without a new contract version fails its own build.
      </p>

      <h2>Deploys and caching</h2>
      <p>Independent deploys depend on two caching rules that pull in opposite directions.</p>
      <ul>
        <li><strong><code>remoteEntry.js</code> must stay fresh.</strong> Its name never changes, so serve it with a short cache lifetime or with revalidation. A shell that holds a stale copy keeps loading last week&apos;s remote.</li>
        <li><strong>Chunks can be cached for a long time.</strong> Give them content hashes in their file names and cache them for as long as you like.</li>
        <li><strong>Keep old chunks on the server for a while.</strong> A user with the page already open still holds the previous manifest, which points at the previous chunk names. Delete those on deploy and that user gets a failed load on their next click.</li>
        <li><strong>Rolling back is a redeploy of the previous <code>remoteEntry.js</code>.</strong> Because the old chunks are still there, it takes effect on the next page load.</li>
      </ul>

      <h2>Working on one remote locally</h2>
      <p>
        Nobody should need every application running to change one. Run the remote you are working on locally and point the shell at the deployed versions of the others, with the remote URLs read from environment configuration. A remote should also start on its own, with a small stand-in for the shell that supplies the same props, so its team can develop and test without the rest of the platform.
      </p>

      <h2>Rule out the simpler options first</h2>
      <ul>
        <li><strong>A monorepo with clear ownership.</strong> One build, one deploy, with each team owning its folders and routes split into separate chunks. This solves slow builds and tangled code. It does not solve teams waiting on one release.</li>
        <li><strong>Packages composed at build time.</strong> Each team publishes its section as a package and the shell installs it. Simple and type-safe, but every change still needs a shell release.</li>
        <li><strong>Iframes.</strong> The strongest isolation there is, at the price of awkward sizing, routing, focus handling and shared sign-in.</li>
      </ul>
      <p>Module Federation is the right answer only when independent runtime deploys are the actual requirement.</p>

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
