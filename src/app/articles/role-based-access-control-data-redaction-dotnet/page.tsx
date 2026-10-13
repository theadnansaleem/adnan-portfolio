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

const REQUIREMENT = `public record MinimumTierRequirement(int Tier) : IAuthorizationRequirement;

public class MinimumTierHandler : AuthorizationHandler<MinimumTierRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, MinimumTierRequirement requirement)
    {
        if (int.TryParse(context.User.FindFirst("tier")?.Value, out var tier) && tier >= requirement.Tier)
            context.Succeed(requirement);

        return Task.CompletedTask;
    }
}

// Program.cs
builder.Services.AddSingleton<IAuthorizationHandler, MinimumTierHandler>();
options.AddPolicy("Tier3", policy => policy.AddRequirements(new MinimumTierRequirement(3)));`;

const FALLBACK = `builder.Services.AddAuthorization(options =>
{
    // Any endpoint without its own rule still requires a signed-in user
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});`;

const TABLE_TEST = `[Theory]
[InlineData(2, false, false)]
[InlineData(3, true, false)]
[InlineData(4, true, true)]
public void Each_tier_sees_only_its_fields(int tier, bool seesComponent, bool seesSteps)
{
    var dto = FindingRedactor.For(tier, SampleFinding());

    Assert.Equal(seesComponent, dto.AffectedComponent is not null);
    Assert.Equal(seesSteps, dto.ReproductionSteps is not null);
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

      <p>
        Listing the allowed values works for four tiers and gets tedious beyond that. When the rule is really &quot;this tier or higher&quot;, say so once with a requirement and a handler:
      </p>
      <pre><code>{REQUIREMENT}</code></pre>

      <h2>Deny by default</h2>
      <p>
        An endpoint that someone forgot to decorate should not be public. A fallback policy applies to every endpoint that has no rule of its own, so forgetting an attribute fails closed:
      </p>
      <pre><code>{FALLBACK}</code></pre>
      <p>
        The few endpoints that really are public, such as sign-in and health checks, then say so explicitly with <code>[AllowAnonymous]</code>, which is easy to find in review.
      </p>

      <h2>Where the tier comes from</h2>
      <p>
        The tier must come from something the server issued and can verify: a claim in a signed token or a server-side session. It must never be read from a request header, query string or body, because the caller controls those. A claim in a token also stays valid until the token expires, so a user who is moved down a tier keeps the old access until then. Keep access tokens short-lived, and for the most sensitive records look the tier up on the server for each request.
      </p>

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

      <h2>403, or 404?</h2>
      <p>
        The status code is part of what you reveal. If a low-tier caller asks for a record they may not see and gets <code>403 Forbidden</code>, they have learned that the record exists. Where existence itself is sensitive, return <code>404 Not Found</code>, exactly as for an id that was never issued. Use 403 when the caller may know the thing exists but may not perform the action.
      </p>

      <h2>Record who looked</h2>
      <p>
        For sensitive data, access control is not finished until reads are recorded: who requested which record, at which tier, and when. Log the identifiers, never the values, or the audit log becomes the easiest place to steal the data from.
      </p>

      <h2>Test it as a table</h2>
      <p>
        Access rules are a grid of tiers against fields, so test them as one: for every tier, request the same record and assert exactly which fields are present. When someone adds a field, the test for the lowest tier fails until they decide who may see it. That failing test is the review.
      </p>
      <pre><code>{TABLE_TEST}</code></pre>
      <p>
        One row per tier, one column per sensitive field. The test reads like the policy document, which is the point: a security reviewer who does not write C# can still check it.
      </p>
    </ArticlePage>
  );
}
