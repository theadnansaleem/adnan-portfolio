import type { Metadata } from 'next';
import Link from 'next/link';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('ddd-cqrs-blazor-server-entity-framework-core');
export const metadata: Metadata = articleMetadata(meta);

// Illustrations of the shape, not code from any project. .NET 8, EF Core 8, Blazor Server.
const AGGREGATE = `public sealed class Assessment
{
    private readonly List<Finding> _findings = [];
    private readonly List<IDomainEvent> _events = [];

    public Guid Id { get; private set; }
    public string Target { get; private set; } = "";
    public AssessmentStatus Status { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public IReadOnlyCollection<Finding> Findings => _findings;
    public IReadOnlyCollection<IDomainEvent> Events => _events;

    private Assessment() { }                                   // for EF Core

    public static Assessment Open(string target, DateTime now)
    {
        if (string.IsNullOrWhiteSpace(target)) throw new DomainException("An assessment needs a target.");
        return new Assessment { Id = Guid.NewGuid(), Target = target.Trim(), Status = AssessmentStatus.Open, UpdatedAt = now };
    }

    public void AddFinding(string title, Severity severity, DateTime now)
    {
        if (Status == AssessmentStatus.Closed) throw new DomainException("A closed assessment cannot take new findings.");
        _findings.Add(new Finding(Guid.NewGuid(), title, severity));
        UpdatedAt = now;
    }

    public void Resolve(Guid findingId, DateTime now)
    {
        var finding = _findings.SingleOrDefault(f => f.Id == findingId)
            ?? throw new DomainException("No such finding on this assessment.");
        finding.Resolve();
        UpdatedAt = now;
    }

    public void Close(string closedBy, DateTime now)
    {
        if (_findings.Any(f => f.Severity == Severity.Critical && !f.Resolved))
            throw new DomainException("Resolve every critical finding before closing.");
        Status = AssessmentStatus.Closed;
        UpdatedAt = now;
        _events.Add(new AssessmentClosed(Id, closedBy, now));
    }

    public void ClearEvents() => _events.Clear();
}`;

const MAPPING = `protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    var assessment = modelBuilder.Entity<Assessment>();
    assessment.HasKey(a => a.Id);
    assessment.Property(a => a.Target).HasMaxLength(200);
    assessment.HasMany(a => a.Findings).WithOne().HasForeignKey("AssessmentId");
    assessment.Navigation(a => a.Findings).HasField("_findings");   // EF Core writes to the list, not the read-only view
    assessment.Ignore(a => a.Events);                                // events are not persisted
}`;

const COMMAND = `public sealed record CloseAssessment(Guid AssessmentId, string ClosedBy);

public sealed class CloseAssessmentHandler(IDbContextFactory<CodexDbContext> factory, TimeProvider clock)
{
    public async Task HandleAsync(CloseAssessment command, CancellationToken ct)
    {
        await using var db = await factory.CreateDbContextAsync(ct);

        var assessment = await db.Assessments
            .Include(a => a.Findings)
            .SingleAsync(a => a.Id == command.AssessmentId, ct);

        assessment.Close(command.ClosedBy, clock.GetUtcNow().UtcDateTime);   // the rule lives in the aggregate

        await db.SaveChangesAsync(ct);
    }
}`;

const QUERY = `public sealed record AssessmentRow(Guid Id, string Target, AssessmentStatus Status, int OpenCritical, DateTime UpdatedAt);

public sealed class AssessmentListQuery(IDbContextFactory<CodexDbContext> factory)
{
    public async Task<IReadOnlyList<AssessmentRow>> RunAsync(AssessmentStatus? status, CancellationToken ct)
    {
        await using var db = await factory.CreateDbContextAsync(ct);

        return await db.Assessments
            .AsNoTracking()
            .Where(a => status == null || a.Status == status)
            .Select(a => new AssessmentRow(
                a.Id,
                a.Target,
                a.Status,
                a.Findings.Count(f => f.Severity == Severity.Critical && !f.Resolved),   // counted in SQL, not in memory
                a.UpdatedAt))
            .OrderByDescending(r => r.UpdatedAt)
            .ToListAsync(ct);
    }
}`;

const REGISTRATION = `builder.Services.AddSingleton<DomainEventsInterceptor>();
builder.Services.AddDbContextFactory<CodexDbContext>((services, options) => options
    .UseSqlServer(builder.Configuration.GetConnectionString("Codex"))
    .AddInterceptors(services.GetRequiredService<DomainEventsInterceptor>()));

builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddScoped<CloseAssessmentHandler>();
builder.Services.AddScoped<AssessmentListQuery>();`;

const COMPONENT = `@page "/assessments"
@using Microsoft.AspNetCore.Components.QuickGrid
@inject AssessmentListQuery Query
@inject CloseAssessmentHandler Close

<h1>Assessments</h1>

@if (error is not null)
{
    <p role="alert">@error</p>
}

<QuickGrid Items="@rows.AsQueryable()">
    <PropertyColumn Property="@(r => r.Target)" Sortable="true" />
    <PropertyColumn Property="@(r => r.Status)" />
    <PropertyColumn Property="@(r => r.OpenCritical)" Title="Open critical" Sortable="true" />
    <PropertyColumn Property="@(r => r.UpdatedAt)" Format="yyyy-MM-dd HH:mm" Sortable="true" />
    <TemplateColumn Title="">
        <button type="button" disabled="@(busy || context.Status == AssessmentStatus.Closed)" @onclick="() => CloseAsync(context.Id)">Close</button>
    </TemplateColumn>
</QuickGrid>

@code {
    private IReadOnlyList<AssessmentRow> rows = [];
    private bool busy;
    private string? error;

    protected override async Task OnInitializedAsync()
        => rows = await Query.RunAsync(null, CancellationToken.None);

    private async Task CloseAsync(Guid id)
    {
        if (busy) return;                                       // one operation at a time per circuit
        busy = true;
        error = null;
        try
        {
            await Close.HandleAsync(new CloseAssessment(id, "current user"), CancellationToken.None);
            rows = await Query.RunAsync(null, CancellationToken.None);
        }
        catch (DomainException ex)
        {
            error = ex.Message;                                 // the rule's own wording, shown to the user
        }
        finally
        {
            busy = false;
        }
    }
}`;

const INTERCEPTOR = `public sealed class DomainEventsInterceptor(IDomainEventPublisher publisher) : SaveChangesInterceptor
{
    public override async ValueTask<int> SavedChangesAsync(
        SaveChangesCompletedEventData eventData, int result, CancellationToken cancellationToken = default)
    {
        if (eventData.Context is null) return result;

        var aggregates = eventData.Context.ChangeTracker.Entries<Assessment>()
            .Select(e => e.Entity)
            .Where(a => a.Events.Count > 0)
            .ToList();

        var events = aggregates.SelectMany(a => a.Events).ToList();
        aggregates.ForEach(a => a.ClearEvents());

        foreach (var domainEvent in events)
            await publisher.PublishAsync(domainEvent, cancellationToken);   // after the commit, so never for a rolled-back change

        return result;
    }
}`;

const TEST = `public class AssessmentTests
{
    private static readonly DateTime Now = new(2026, 3, 1, 9, 0, 0, DateTimeKind.Utc);

    [Fact]
    public void Cannot_close_with_an_unresolved_critical_finding()
    {
        var assessment = Assessment.Open("gateway-ecu", Now);
        assessment.AddFinding("Unauthenticated diagnostic write", Severity.Critical, Now);

        var ex = Assert.Throws<DomainException>(() => assessment.Close("reviewer", Now));

        Assert.Equal("Resolve every critical finding before closing.", ex.Message);
        Assert.Equal(AssessmentStatus.Open, assessment.Status);
    }

    [Fact]
    public void Closing_raises_one_event()
    {
        var assessment = Assessment.Open("gateway-ecu", Now);

        assessment.Close("reviewer", Now);

        var closed = Assert.Single(assessment.Events);
        Assert.IsType<AssessmentClosed>(closed);
    }
}`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        On Codex, a cybersecurity platform that assesses attack surfaces across vehicle software, I created a C#/.NET Core module with Blazor Server and Entity Framework Core for the admin and reporting workflows, built with Domain-Driven Design and CQRS. Those two names carry a lot of ceremony in the literature: repositories, unit-of-work wrappers, a mediator, a bus. None of it is required. This is the shape I would build again, with the code for each part.
      </p>

      <h2>Two kinds of code, one database</h2>
      <p>
        An admin screen and a report need the same tables for opposite reasons. The admin screen <strong>changes</strong> things, and every change has rules: an assessment cannot close with a critical finding open. The report <strong>reads</strong> things, in whatever shape the screen needs, and the rules do not apply to reading. CQRS is the decision to write those two kinds of code differently: commands go through a domain model that guards the rules; queries read straight from the database into the row the screen shows.
      </p>
      <p>
        That is the whole of it. One database, no message bus, no separate read store. Those are later additions for when the read load or the read shape demands them, and most modules never need them.
      </p>

      <h2>The aggregate guards its own rules</h2>
      <p>
        Domain-Driven Design&apos;s most useful idea is the aggregate: a cluster of objects, with one root, that is loaded and saved as a unit and that changes only through methods on the root. The rules live in those methods, so there is exactly one place where &quot;can this close?&quot; is answered, and no screen, job or import can bypass it by setting a property.
      </p>
      <pre><code>{AGGREGATE}</code></pre>
      <p>
        Three details carry the design. Setters are private, so the only way to change state is a method that checks the rule. Findings are exposed read-only and added through the root. And a successful close records an event, which the aggregate holds until the change is saved.
      </p>
      <p>
        EF Core maps this without a repository. It needs a private constructor, a backing field for the collection, and to be told the events are not a column:
      </p>
      <pre><code>{MAPPING}</code></pre>

      <h2>Commands: a record and one handler, no MediatR</h2>
      <p>
        A command is what the user asked for, as data. A handler is the one class that carries it out: load the aggregate, call the method, save. The handler is injected where it is used. There is no dispatcher, because with a dozen handlers a dispatcher adds a level of indirection and nothing else. MediatR earns its place later, when there are dozens of handlers sharing validation, logging and transaction behaviours through a pipeline.
      </p>
      <pre><code>{COMMAND}</code></pre>
      <p>
        <code>Include</code> loads the whole aggregate, because the rule needs the findings. The handler does not know the rule; it only knows which method to call. <code>TimeProvider</code> is injected so tests can fix the clock.
      </p>

      <h2>Queries: project straight to the row</h2>
      <p>
        A query never loads an aggregate. It asks EF Core for the exact shape the screen will show, as a projection, with no tracking and with the counting done in SQL. There is no DTO mapper and no repository, because the projection <em>is</em> the mapping.
      </p>
      <pre><code>{QUERY}</code></pre>
      <p>
        When a projection grows past what LINQ expresses cleanly, the query class is the one place that changes: it can switch to a SQL view or a <Link href="/articles/entity-framework-core-stored-procedures-sql-server">stored procedure through FromSql</Link> without the screen or the domain noticing.
      </p>

      <h2>Blazor Server: one DbContext per operation</h2>
      <p>
        This is the part that bites teams coming from ASP.NET Core controllers. In server-side Blazor, a scoped service lives for the user&apos;s circuit, which is the whole time the browser tab is open. A scoped <code>DbContext</code> is therefore shared by every component on the page and every event handler, and <code>DbContext</code> is not safe for concurrent use. Microsoft&apos;s guidance is <code>AddDbContextFactory</code> and a fresh context per operation, which is what the handler and the query above do.
      </p>
      <pre><code>{REGISTRATION}</code></pre>
      <p>
        The component then has one job: call the query, call the handler, show the rule&apos;s message when it refuses. The <code>busy</code> flag is the other half of Microsoft&apos;s guidance, so a double click cannot start two operations on one circuit.
      </p>
      <pre><code>{COMPONENT}</code></pre>

      <h2>Domain events, published after the commit</h2>
      <p>
        Closing an assessment should notify the reporting side and whoever subscribed. The aggregate recorded the event; something has to publish it, and the timing matters. Publish before <code>SaveChanges</code> and a failed save leaves subscribers believing a close that never happened. An EF Core <code>SaveChangesInterceptor</code> runs after the save succeeded, collects the events from the tracked aggregates and publishes them then.
      </p>
      <pre><code>{INTERCEPTOR}</code></pre>
      <p>
        The interceptor is a singleton, so its publisher must be one too: a <code>Channel</code> drained by a hosted service does the job and keeps the user&apos;s request from waiting on the subscribers. If a subscriber must never miss an event even when the process dies, the event goes into an outbox table inside the same transaction instead, and that is a deliberate step up in complexity.
      </p>

      <h2>Where the files go</h2>
      <p>
        Folders by feature, not by layer: <code>Assessments/Assessment.cs</code>, <code>Assessments/CloseAssessment.cs</code>, <code>Assessments/AssessmentListQuery.cs</code>, <code>Assessments/AssessmentsPage.razor</code>. Everything about closing an assessment is in one folder, and a new engineer finds the rule by opening the aggregate. The alternative, a <code>Domain</code>, <code>Application</code> and <code>Infrastructure</code> project each, is three places to look for one change.
      </p>

      <h2>Tests that follow the split</h2>
      <p>
        The aggregate is plain C#, so its rules are unit tests with no database and no mocks. Handlers and queries are integration tests against a real SQL Server, one per behaviour, in the style of the <Link href="/articles/entity-framework-core-stored-procedures-sql-server">stored procedure article</Link>. The Blazor component has almost nothing left to test.
      </p>
      <pre><code>{TEST}</code></pre>

      <h2>Mistakes I would check for first</h2>
      <ul>
        <li><strong>Public setters on the aggregate.</strong> The rule can be bypassed; the first import job will.</li>
        <li><strong>Queries that load aggregates.</strong> Slow, and a temptation to put logic in the screen. Project.</li>
        <li><strong>A scoped DbContext in Blazor Server.</strong> Works on your machine, throws under two quick clicks.</li>
        <li><strong>A repository interface over DbContext.</strong> It hides <code>Include</code> and projections, and every test mocks it instead of testing SQL.</li>
        <li><strong>Events published before the save.</strong> Subscribers learn about changes that were rolled back.</li>
        <li><strong>A mediator on day one.</strong> Indirection with no pipeline to justify it. Add it when the pipeline arrives.</li>
      </ul>

      <p>
        The same platform had a second rule set, about who may see what: <Link href="/articles/role-based-access-control-data-redaction-dotnet">role-based data redaction in ASP.NET Core</Link> covers the four-tier access control that sat in front of these screens, and the <Link href="/work/codex-vehicle-cybersecurity-platform">Codex case study</Link> has the project it came from.
      </p>
    </ArticlePage>
  );
}
