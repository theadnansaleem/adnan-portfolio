import Image from 'next/image';
import Link from 'next/link';

/** Public explanation of the CV-backed architecture change, with illustrative module labels. */
export default function QatarFederationCase() {
  return (
    <>
      <section className="hx-lab" id="architecture">
        <div>
          <p className="hx-cap">Architecture</p>
          <h2>One interface, separate release boundaries</h2>
        </div>
        <div className="hx-prose">
          <p>
            The Qatar Events Platform coordinates the National Events Calendar across government entities. My frontend rearchitecture moved a monolithic React application to Module Federation micro frontends, with versioned contracts between the shell and its remotes. The delivery goal was to let teams deploy independently while keeping one application experience.
          </p>
          <figure style={{ maxWidth: 600 }}>
            <Image src="/diagrams/qatar-module-federation-architecture.svg" width={600} height={460} sizes="(max-width: 760px) 100vw, 680px" alt="Conceptual architecture: a shell composes separately built and released remote modules through versioned contracts." />
            <figcaption>
              Conceptual view of the shell/remote boundary. A and B are illustrative placeholders; production module names and the deployed remote count are omitted. <a href="/diagrams/qatar-module-federation-architecture.svg">Open the SVG diagram</a>.
            </figcaption>
          </figure>
          <p>
            In <a href="https://webpack.js.org/concepts/module-federation/">webpack&apos;s Module Federation model</a>, separately built applications expose and consume modules at runtime. In this view, the shell composes the interface and each remote has its own build and release boundary. The contract is the agreed integration surface between them.
          </p>
          <p>
            A remote can change internally while its contract remains compatible. A breaking contract change still needs coordination with its consumers. Independent deployment therefore depends on boundary discipline as well as the bundler configuration.
          </p>
        </div>
      </section>

      <section className="hx-lab" id="delivery-workflow">
        <div>
          <p className="hx-cap">Delivery workflow</p>
          <h2>What changed for a frontend release</h2>
        </div>
        <div className="hx-prose">
          <div className="hx-delivery-flow">
            <section className="hx-card" aria-labelledby="delivery-before">
              <h3 id="delivery-before">Before: React monolith</h3>
              <ol>
                <li>Change a feature inside the shared frontend.</li>
                <li>Build the frontend as one application.</li>
                <li>Ship the change through the application&apos;s shared release boundary.</li>
              </ol>
            </section>
            <section className="hx-card" aria-labelledby="delivery-after">
              <h3 id="delivery-after">After: shell and remotes</h3>
              <ol>
                <li>Change a remote within its versioned contract.</li>
                <li>Build and release that remote independently.</li>
                <li>The shell loads the deployed module at runtime.</li>
              </ol>
            </section>
          </div>
          <p>
            This is a high-level comparison of the build and release boundaries. Team-specific test stages, approval gates and deployment configuration are outside its scope. The shell retains its own release lifecycle, and changes to a shared contract can still require a coordinated release.
          </p>
          <h3 id="delivery-outcome">Reported outcome: approximately 40% shorter release cycles</h3>
          <p>
            My project record reports approximately 40% lower release cycle time and the ability for teams to deploy independently. The original baseline durations, exact start/end definition, release sample and observation window are not published with this case study. Treat the percentage as a reported historical outcome rather than a reproducible benchmark. It describes delivery time, not browser rendering or page-load speed.
          </p>
          <p>
            To assess the same change on another project, define consistent start and end events, compare similar releases before and after, and record time spent waiting for other teams separately from build and deployment time. Those are suggested evaluation steps, not a reconstruction of the original measurement.
          </p>
          <p>
            <Link href="/articles/module-federation-micro-frontends-react">Read the Module Federation implementation guide</Link> for example configuration and integration tradeoffs. The <Link href="/lab#failure-isolation">error-boundary demo</Link> shows local React failure isolation with synthetic sections; it does not run independently deployed federated builds. For relevant roles, <Link href="/frontend-developer">see my React experience</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
