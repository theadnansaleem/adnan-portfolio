import type { Metadata } from 'next';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('role-based-access-control-data-redaction-dotnet');
export const metadata: Metadata = articleMetadata(meta);

const POLICIES = `// Program.cs: each policy names the lowest tier that passes
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Tier2", policy => policy.RequireClaim("tier", "2", "3", "4"));
    options.AddPolicy("Tier3", policy => policy.RequireClaim("tier", "3", "4"));
    options.AddPolicy("Tier4", policy => policy.RequireClaim("tier", "4"));
});`;

const ENDPOINT = `[Authorize(Policy = "Tier2")]
[HttpGet("findings/{id}")]
public async Task<ActionResult<FindingDto>> Get(Guid id)
{
    var finding = await _findings.Find(id);
    if (finding is null) return NotFound();

    var tier = int.Parse(User.FindFirstValue("tier")!);
    return FindingRedactor.For(tier, finding);
}`;

const REDACTOR = `public static class FindingRedactor
{
    public static FindingDto For(int tier, Finding f) => new()
    {
        Id = f.Id,
        Title = f.Title,
        Severity = f.Severity,
        // Each sensitive field names the tier that may see it; everyone else gets null
        AffectedComponent = tier >= 3 ? f.AffectedComponent : null,
        ReproductionSteps = tier >= 4 ? f.ReproductionSteps : null,
    };
}`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        On a vehicle cybersecurity platform I secured sensitive security data with four-tier role-based access control, secure .NET API integrations, and data redaction pipelines filtered by caller tier. The idea underneath is simple and often skipped: deciding who may call an endpoint is only half of access control. The other half is deciding what each caller gets back.
      </p>

      <h2>Hiding a field in the UI is not security</h2>
      <p>
        If the API returns a field and the frontend chooses not to show it, the field is one browser tool away from anyone who is logged in. Whatever a user must not see has to be removed on the server, before the response is serialized.
      </p>

      <h2>Two questions, two mechanisms</h2>
      <ul>
        <li><strong>May this caller use this endpoint at all?</strong> That is authorization, and ASP.NET Core policies answer it.</li>
        <li><strong>Which parts of the answer may this caller see?</strong> That is redaction, and it needs its own step.</li>
      </ul>

      <h2>Tiers as policies</h2>
      <p>
        Give each user a tier claim at sign-in and express every rule as a named policy. Controllers then state what they need, and the rule itself lives in one place:
      </p>
      <pre><code>{POLICIES}</code></pre>

      <h2>One redaction step, used everywhere</h2>
      <p>
        The endpoint loads the full record and hands it to a single function that builds the response for the caller&apos;s tier:
      </p>
      <pre><code>{ENDPOINT}</code></pre>
      <pre><code>{REDACTOR}</code></pre>
      <p>
        Three properties make this hold up over time. The domain object never leaves the server; only the response object does. Every sensitive field states its own rule, so a reviewer can read the whole policy in one file. And a new field is absent from the response until someone adds it to the redactor, which makes the default safe.
      </p>

      <h2>Where data leaks anyway</h2>
      <ul>
        <li><strong>Lists and search.</strong> A redacted detail page is pointless if the list endpoint returns the full record. Send every response for that type through the same redactor.</li>
        <li><strong>Exports and reports.</strong> CSV and PDF generation often bypasses the API layer. Give them the same step.</li>
        <li><strong>Filters and counts.</strong> If a low tier can filter by a hidden field, the result count reveals it. Reject filters on fields the caller cannot read.</li>
        <li><strong>Errors and logs.</strong> A validation message that quotes a hidden value leaks it. Keep sensitive values out of error text.</li>
        <li><strong>Real-time channels.</strong> A WebSocket that broadcasts full records to every subscriber undoes all of the above. Redact per connection.</li>
      </ul>

      <h2>Test it as a table</h2>
      <p>
        Access rules are a grid of tiers against fields, so test them as one: for every tier, request the same record and assert exactly which fields are present. When someone adds a field, the test for the lowest tier fails until they decide who may see it. That failing test is the review.
      </p>
    </ArticlePage>
  );
}
