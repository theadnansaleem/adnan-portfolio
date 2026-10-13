"use client";

import { useState } from 'react';

const FINDING = {
  id: 'F-2291',
  title: 'Unsigned firmware accepted over diagnostics',
  severity: 'High',
  affectedComponent: 'Gateway ECU, bootloader 4.2',
  reproductionSteps: 'Open a diagnostic session, request download, send an image with no signature block.',
};
const FIELDS = Object.keys(FINDING).length;

// The same rules as the article: tier 2 may call the endpoint, tier 3 sees the component, tier 4 the steps
const respond = (tier: number) =>
  tier < 2
    ? { status: '403 Forbidden', body: null }
    : {
        status: '200 OK',
        body: {
          id: FINDING.id,
          title: FINDING.title,
          severity: FINDING.severity,
          affectedComponent: tier >= 3 ? FINDING.affectedComponent : null,
          reproductionSteps: tier >= 4 ? FINDING.reproductionSteps : null,
        },
      };

/** One record, four callers: what the server sends back changes with the caller's tier. */
export default function AccessTiers() {
  const [tier, setTier] = useState(2);
  const { status, body } = respond(tier);
  const withheld = body ? Object.values(body).filter((value) => value === null).length : FIELDS;

  return (
    <div className="hx-demo hx-card">
      <div className="hx-demo-bar" role="group" aria-label="Caller tier">
        {[1, 2, 3, 4].map((n) => (
          <button key={n} type="button" className={`hx-pill${tier === n ? ' is-solid' : ''}`} aria-pressed={tier === n} onClick={() => setTier(n)}>
            Tier {n}
          </button>
        ))}
      </div>
      <dl className="hx-demo-stats" aria-live="polite">
        <div><dt data-state={body ? undefined : 'Failed'}>{status.slice(0, 3)}</dt><dd>{status.slice(4)}</dd></div>
        <div><dt>{FIELDS - withheld}</dt><dd>fields sent</dd></div>
        <div><dt data-state={withheld ? 'Review' : undefined}>{withheld}</dt><dd>fields withheld</dd></div>
      </dl>
      <pre className="hx-demo-code" tabIndex={0} aria-label="Response body"><code>{body ? JSON.stringify(body, null, 2) : '// No body. A tier 1 caller fails the policy before the record is loaded.'}</code></pre>
      <p className="hx-demo-note">An invented finding. The redaction runs in your browser here; in production it runs on the server, before the response is serialized.</p>
    </div>
  );
}
