import type { Metadata } from 'next';
import Link from 'next/link';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('visual-foxpro-reports-to-blazor-dotnet');
export const metadata: Metadata = articleMetadata(meta);

// Illustrations of the method, not code from any project.
const INVENTORY = `* In Visual FoxPro: a report definition is a table, so read it like one
USE aging.frx ALIAS frx
SELECT expr, picture FROM frx WHERE NOT EMPTY(expr) INTO CURSOR expressions
BROWSE   && every expression the report evaluates: fields, totals, calculated columns`;

const TOTALS = `CREATE OR ALTER PROCEDURE dbo.Report_Aging
    @AsOf date
AS
BEGIN
    SET NOCOUNT ON;

    WITH Open AS (
        SELECT c.CustomerId, c.Name,
               i.Amount - ISNULL(p.Paid, 0) AS Outstanding,
               DATEDIFF(day, i.DueOn, @AsOf) AS DaysLate
        FROM dbo.Invoice i
        JOIN dbo.Customer c ON c.CustomerId = i.CustomerId
        OUTER APPLY (SELECT SUM(Amount) AS Paid FROM dbo.Payment WHERE InvoiceId = i.InvoiceId AND PaidOn < DATEADD(day, 1, @AsOf)) p
        WHERE i.IssuedOn < DATEADD(day, 1, @AsOf)      -- inclusive of @AsOf, like the FoxPro report
          AND i.Amount - ISNULL(p.Paid, 0) <> 0
    )
    SELECT ISNULL(Name, 'Total') AS Customer,
           SUM(CASE WHEN DaysLate <= 0  THEN Outstanding ELSE 0 END) AS Current,
           SUM(CASE WHEN DaysLate BETWEEN 1 AND 30  THEN Outstanding ELSE 0 END) AS Days1To30,
           SUM(CASE WHEN DaysLate BETWEEN 31 AND 60 THEN Outstanding ELSE 0 END) AS Days31To60,
           SUM(CASE WHEN DaysLate > 60  THEN Outstanding ELSE 0 END) AS Over60,
           SUM(Outstanding) AS Total,
           COUNT(*) AS Invoices
    FROM Open
    GROUP BY ROLLUP (CustomerId, Name)
    HAVING GROUPING(CustomerId) = GROUPING(Name)   -- one row per customer plus the grand total
    ORDER BY GROUPING(CustomerId), Name;
END`;

const PAGE = `@page "/reports/aging"
@using Microsoft.AspNetCore.Components.QuickGrid
@inject IReports Reports

<h1>Aged receivables</h1>

<form @onsubmit="RunAsync" @onsubmit:preventDefault>
    <label>As of <InputDate @bind-Value="asOf" /></label>
    <button type="submit" disabled="@busy">Run</button>
    <a href="/reports/aging.csv?asOf=@asOf.ToString("yyyy-MM-dd")">Download CSV</a>
</form>

@if (rows.Count == 0 && !busy)
{
    <p>No open invoices on that date.</p>
}
else
{
    <QuickGrid Items="@rows.AsQueryable()" Pagination="@pagination">
        <PropertyColumn Property="@(r => r.Customer)" Sortable="true" />
        <PropertyColumn Property="@(r => r.Current)" Format="N2" Align="Align.Right" />
        <PropertyColumn Property="@(r => r.Days1To30)" Title="1 to 30" Format="N2" Align="Align.Right" />
        <PropertyColumn Property="@(r => r.Days31To60)" Title="31 to 60" Format="N2" Align="Align.Right" />
        <PropertyColumn Property="@(r => r.Over60)" Title="Over 60" Format="N2" Align="Align.Right" />
        <PropertyColumn Property="@(r => r.Total)" Format="N2" Align="Align.Right" Sortable="true" />
    </QuickGrid>
    <Paginator State="@pagination" />
}

@code {
    private DateOnly asOf = DateOnly.FromDateTime(DateTime.Today);
    private IReadOnlyList<AgingRow> rows = [];
    private bool busy;
    private readonly PaginationState pagination = new() { ItemsPerPage = 50 };

    protected override Task OnInitializedAsync() => RunAsync();

    private async Task RunAsync()
    {
        if (busy) return;
        busy = true;
        try { rows = await Reports.AgingAsync(asOf, CancellationToken.None); }
        finally { busy = false; }
    }
}`;

const CSV = `app.MapGet("/reports/aging.csv", async (DateOnly asOf, IReports reports, CancellationToken ct) =>
{
    var rows = await reports.AgingAsync(asOf, ct);
    var sb = new StringBuilder("Customer,Current,1 to 30,31 to 60,Over 60,Total,Invoices\\r\\n");
    foreach (var r in rows)
    {
        var name = r.Customer.Contains(',') || r.Customer.Contains('"') ? '"' + r.Customer.Replace("\\"", "\\"\\"") + '"' : r.Customer;
        sb.Append(name).Append(',').Append(r.Current).Append(',').Append(r.Days1To30).Append(',')
          .Append(r.Days31To60).Append(',').Append(r.Over60).Append(',').Append(r.Total).Append(',').Append(r.Invoices).Append("\\r\\n");
    }
    return Results.File(Encoding.UTF8.GetBytes(sb.ToString()), "text/csv", $"aging-{asOf:yyyy-MM-dd}.csv");
}).RequireAuthorization("Finance");`;

const PARITY = `// Fixture: the old report, run in FoxPro for the same date and exported with COPY TO aging-2025-12-31.csv TYPE CSV
public sealed class AgingParityTests(ReportsFixture fx)
{
    [Theory]
    [InlineData("2025-12-31")]
    [InlineData("2026-01-31")]
    public async Task New_report_matches_the_FoxPro_export(string date)
    {
        var asOf = DateOnly.Parse(date);
        var expected = FoxProExport.Read($"fixtures/aging-{date}.csv");      // one row per customer plus Total
        var actual = await fx.Reports.AgingAsync(asOf, CancellationToken.None);

        Assert.Equal(expected.Count, actual.Count);                            // row count first
        foreach (var (e, a) in expected.Zip(actual))
        {
            Assert.Equal(e.Customer, a.Customer);
            Assert.Equal(e.Total, a.Total);                                     // then money, exact to the cent
            Assert.Equal(e.Invoices, a.Invoices);
        }
    }
}`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        The last thing I retired on the Visual FoxPro migration was the reports. Over a two-and-a-half-year engagement I replaced the legacy FoxPro reports with reporting workflows in the new Blazor application, and only then could the old system be switched off, because reports are what a finance team looks at every month. This is the method: treat each report as a specification, move its arithmetic into T-SQL, give it a Blazor screen and an export, and prove the numbers match before anyone stops running the old one.
      </p>

      <h2>Why reports go last, and why they matter most</h2>
      <p>
        A report is a view over the data. Migrate it before the tables are in SQL Server and you write it twice. So the order of the <Link href="/articles/visual-foxpro-to-dotnet-migration-guide">migration guide</Link> stands: data model first, then the workflows, then the reports that read what the workflows wrote. But do not mistake &quot;last&quot; for &quot;least&quot;. Users forgive a slower screen; they do not forgive a month-end total that differs from last month&apos;s by a cent, because that cent means they cannot trust any of it.
      </p>

      <h2>Inventory: the .frx is a table</h2>
      <p>
        A FoxPro report lives in an <code>.frx</code> file, and that file is itself a FoxPro table. Each row is one object on the report, a band, a label, a field or a variable, with the expression it evaluates in the <code>EXPR</code> column and its format in <code>PICTURE</code>. Open it like any other table and you have every calculation the report performs, including the ones nobody remembers adding.
      </p>
      <pre><code>{INVENTORY}</code></pre>
      <p>
        Two more things to collect per report. Who runs it, and when: expect the menu to list more reports than anyone runs, and a month of asking who uses which usually cuts the list hard. The dead ones are not migrated; they are listed in the cutover note so nobody asks for them in a year. And the report&apos;s data environment: the <code>SET FILTER</code>, relations and <code>SET DELETED</code> state it runs under, because those are conditions that never appear in the expressions and change the totals.
      </p>

      <h2>Totals belong in T-SQL</h2>
      <p>
        Most FoxPro reports are a list with subtotals and a grand total. In the <code>.frx</code> that is a group band and report variables with a reset condition; in SQL Server it is one grouped query. Doing the arithmetic in the database means the screen, the CSV export and the parity test all read the same numbers from the same place.
      </p>
      <pre><code>{TOTALS}</code></pre>
      <p>
        <code>ROLLUP</code> produces the per-customer rows and the grand total in one result set, which is the shape the old report printed. The date comparisons are written as <code>&lt; DATEADD(day, 1, @AsOf)</code> rather than <code>&lt;= @AsOf</code> so they stay correct if a column ever becomes a datetime, and so the as-of day is inclusive, which is how FoxPro&apos;s date comparisons behaved. Money stays <code>decimal(19,4)</code> all the way through; rounding happens once, at display.
      </p>

      <h2>The screen: a Blazor page with QuickGrid</h2>
      <p>
        On screen, most reports need a date picker, a table and a download. <code>QuickGrid</code>, Microsoft&apos;s grid component for Blazor, does sorting and paging with no JavaScript and no third-party package. The page calls a small <code>IReports</code> interface whose implementation runs the procedure through EF Core, the same seam as in <Link href="/articles/entity-framework-core-stored-procedures-sql-server">the stored procedure article</Link>.
      </p>
      <pre><code>{PAGE}</code></pre>
      <p>
        The empty state is explicit, because &quot;no open invoices&quot; and &quot;the query failed&quot; must never look alike on a finance screen. The <code>busy</code> flag follows Microsoft&apos;s Blazor Server guidance: one database operation per circuit at a time.
      </p>

      <h2>Exports: CSV first, PDF when someone needs paper</h2>
      <p>
        A CSV endpoint comes before anything else, because a CSV opens in Excel, which is where a finance team continues its work anyway. The endpoint runs the same procedure and needs no library; quoting is the only detail to get right.
      </p>
      <pre><code>{CSV}</code></pre>
      <p>
        PDF comes later, and only for the reports that are printed or sent to customers. Pick a PDF library for .NET and read its licence terms for your company size before choosing; several are free for small companies and paid above a revenue line. Resist a report designer. A list with totals, which is what most FoxPro reports turn out to be, does not need one.
      </p>

      <h2>Parity: old and new for the same period</h2>
      <p>
        The proof is mechanical. Run the FoxPro report for a closed period and export it with <code>COPY TO ... TYPE CSV</code>. Run the new one for the same date. Compare row counts first, then money, exact to the cent. The exports become test fixtures, so the comparison runs on every build, not once on cutover day.
      </p>
      <pre><code>{PARITY}</code></pre>
      <p>
        When a parity test fails, the cause is almost always one of four things, and this is the order to check them in:
      </p>
      <div className="hx-prose-table" role="region" aria-label="Why FoxPro and SQL Server report totals differ" tabIndex={0}>
        <table>
          <caption>Why the totals differ, and what to look for</caption>
          <thead><tr><th scope="col">Symptom</th><th scope="col">Usual cause</th><th scope="col">Fix</th></tr></thead>
          <tbody>
            <tr><td>Row count differs</td><td>Rows flagged deleted in FoxPro, skipped with <code>SET DELETED ON</code> but present in the migrated table</td><td>Carry the deleted flag through the migration and exclude it in the query, or pack before export.</td></tr>
            <tr><td>Totals differ by cents</td><td>FoxPro rounded each line to two places before summing; SQL summed four-place values and rounded once</td><td>Decide which is right with finance, then match it. Usually the new way, documented as a change.</td></tr>
            <tr><td>One customer missing or extra</td><td>A <code>SET FILTER</code> or relation in the report&apos;s data environment</td><td>Add the condition to the <code>WHERE</code> clause and to the inventory note.</td></tr>
            <tr><td>Last day of the period missing</td><td>A <code>&lt;</code> where FoxPro had an inclusive comparison</td><td>Use <code>&lt; DATEADD(day, 1, @To)</code>.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Cutover, one report at a time</h2>
      <ul>
        <li><strong>Parallel run for one month-end.</strong> Both reports produced, both compared by the person who signs them off.</li>
        <li><strong>Then the old menu item goes</strong>, with a note saying where the report now lives.</li>
        <li><strong>The dead reports are listed</strong> in the same note with the last date anyone ran them.</li>
        <li><strong>The parity fixtures stay</strong> in the repository. They are the only specification the reports ever had.</li>
      </ul>

      <h2>Mistakes I would check for first</h2>
      <ul>
        <li><strong>Migrating every report.</strong> Count who runs what first; most are dead.</li>
        <li><strong>Arithmetic in C# or in the grid.</strong> Three places to disagree. Put it in the query.</li>
        <li><strong>Comparing totals before row counts.</strong> A missing row and a rounding difference look the same in the total.</li>
        <li><strong>A report designer on day one.</strong> Lists with totals need a query and a grid.</li>
        <li><strong>Retiring FoxPro before the parallel month-end.</strong> The first discrepancy then has nothing to compare against.</li>
      </ul>

      <p>
        The tables these reports read were loaded and reconciled with control totals in <Link href="/articles/visual-foxpro-to-sql-server-data-migration">Visual FoxPro to SQL Server: a repeatable data migration</Link>; the whole engagement is the <Link href="/work/visual-foxpro-to-dotnet-migration">FoxPro to .NET case study</Link>.
      </p>
    </ArticlePage>
  );
}
