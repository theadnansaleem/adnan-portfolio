import type { Metadata } from 'next';
import Image from 'next/image';
import RolePage, { roleMetadata } from '@/components/home/RolePage';
import { roles } from '@/lib/roles';

export const metadata: Metadata = roleMetadata(roles.azure);

// [service, what it does in a deployment, kind]
const SERVICES = [
  ['Azure Functions', 'Serverless code for timers, queues and HTTP triggers.', 'Compute'],
  ['App Service', 'Hosting for .NET APIs and web front ends.', 'Compute'],
  ['Azure SQL', 'Managed SQL Server for relational data.', 'Data'],
  ['Blob Storage', 'Files, documents and static assets.', 'Data'],
  ['Key Vault', 'Secrets, keys and connection strings kept out of code.', 'Security'],
  ['Application Insights', 'Requests, failures and performance traced in production.', 'Monitoring'],
];

const FLOW = [
  ['Commit', 'A reviewed change merges.'],
  ['Azure DevOps', 'The pipeline builds and tests it.'],
  ['App Service', 'APIs and front ends deploy.'],
  ['Functions', 'Background and scheduled work runs serverless.'],
  ['Data and secrets', 'Azure SQL and Blob Storage hold the data, Key Vault the secrets.'],
  ['Application Insights', 'Production is watched for failures and slow requests.'],
];

export default function AzureDeveloperPage() {
  return (
    <RolePage role={roles.azure}>
      <section className="hx-lab is-stacked">
        <div>
          <p className="hx-cap"><b>Azure</b> Services</p>
          <h2><Image className="hx-h2-logo" src="/ai/azure.svg" alt="" width={44} height={44} unoptimized /> What I deploy on</h2>
          <p>The Azure services I have used on real projects.</p>
        </div>
        <ul className="hx-grid-3 hx-tools">
          {SERVICES.map(([name, note, kind]) => (
            <li key={name} className="hx-card">
              <h3>{name}</h3>
              <p>{note}</p>
              <p className="hx-cap">{kind}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="hx-lab is-stacked">
        <div>
          <p className="hx-cap"><b>Azure</b> Delivery</p>
          <h2>From commit to production</h2>
          <p>How these services fit together in a typical release.</p>
        </div>
        <ol className="hx-flow hx-card">
          {FLOW.map(([step, note]) => (
            <li key={step}>
              <strong>{step}</strong>
              <span>{note}</span>
            </li>
          ))}
        </ol>
      </section>
    </RolePage>
  );
}
