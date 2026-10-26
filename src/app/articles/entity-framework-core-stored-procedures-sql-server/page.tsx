import type { Metadata } from 'next';
import Link from 'next/link';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('entity-framework-core-stored-procedures-sql-server');
export const metadata: Metadata = articleMetadata(meta);

// Illustrations of each pattern, not code from any project. EF Core 8 on SQL Server.
const KEYLESS = `public sealed class StatementLine
{
    public DateOnly PostedOn { get; init; }
    public string Reference { get; init; } = "";
    public decimal Amount { get; init; }
    public decimal RunningBalance { get; init; }
}

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // A result shape, not a table: no key, and ToView(null) keeps it out of migrations
    modelBuilder.Entity<StatementLine>().HasNoKey().ToView(null);
}`;

const FROMSQL = `var lines = await db.Set<StatementLine>()
    .FromSql($"EXECUTE dbo.Account_Statement @AccountId={accountId}, @From={from}, @To={to}")
    .AsNoTracking()
    .ToListAsync();

// Anything after FromSql becomes a subquery, and SQL Server cannot wrap EXECUTE in one.
// Filter in memory instead:
var debits = await db.Set<StatementLine>()
    .FromSql($"EXECUTE dbo.Account_Statement @AccountId={accountId}, @From={from}, @To={to}")
    .AsAsyncEnumerable()
    .Where(l => l.Amount < 0)
    .ToListAsync();`;

const PROCEDURE = `CREATE OR ALTER PROCEDURE dbo.Account_Statement
    @AccountId int,
    @From date,
    @To date
AS
BEGIN
    SET NOCOUNT ON;

    SELECT PostedOn,
           Reference,
           Amount,
           SUM(Amount) OVER (ORDER BY PostedOn, Id ROWS UNBOUNDED PRECEDING) AS RunningBalance
    FROM dbo.Ledger
    WHERE AccountId = @AccountId
      AND PostedOn >= @From
      AND PostedOn < DATEADD(day, 1, @To)
    ORDER BY PostedOn, Id;
END`;

const EXECUTE = `// Returns the rows affected, or -1 when the procedure sets NOCOUNT ON
var affected = await db.Database.ExecuteSqlAsync(
    $"EXECUTE dbo.Ledger_Post @InvoiceId={invoice.Id}, @PostedBy={userId}");`;

const OUTPUT = `using System.Data;
using Microsoft.Data.SqlClient;

var journalId = new SqlParameter("JournalId", SqlDbType.Int) { Direction = ParameterDirection.Output };

await db.Database.ExecuteSqlRawAsync(
    "EXECUTE dbo.Ledger_Post @InvoiceId, @PostedBy, @JournalId OUTPUT",
    new SqlParameter("InvoiceId", invoice.Id),
    new SqlParameter("PostedBy", userId),
    journalId);

var id = (int)journalId.Value;`;

const FACETS = `// decimal(19,4) in the procedure, so say so; the default inferred type is decimal(18,2)
var amount = new SqlParameter("Amount", SqlDbType.Decimal) { Precision = 19, Scale = 4, Value = payment.Amount };

await db.Database.ExecuteSqlRawAsync(
    "EXECUTE dbo.Payment_Apply @AccountId, @Amount",
    new SqlParameter("AccountId", payment.AccountId),
    amount);`;

const TRANSACTION = `await using var tx = await db.Database.BeginTransactionAsync();

db.Invoices.Add(invoice);
await db.SaveChangesAsync();                                    // the invoice row exists inside the transaction

await db.Database.ExecuteSqlAsync(
    $"EXECUTE dbo.Ledger_Post @InvoiceId={invoice.Id}, @PostedBy={userId}");  // same connection, same transaction

await tx.CommitAsync();`;

const MAPPED = `modelBuilder.Entity<Person>()
    .InsertUsingStoredProcedure(
        "People_Insert",
        storedProcedureBuilder =>
        {
            storedProcedureBuilder.HasParameter(a => a.Name);
            storedProcedureBuilder.HasResultColumn(a => a.Id);
        })
    .UpdateUsingStoredProcedure(
        "People_Update",
        storedProcedureBuilder =>
        {
            storedProcedureBuilder.HasOriginalValueParameter(person => person.Id);
            storedProcedureBuilder.HasOriginalValueParameter(person => person.Name);
            storedProcedureBuilder.HasParameter(person => person.Name);
            storedProcedureBuilder.HasRowsAffectedResultColumn();
        })
    .DeleteUsingStoredProcedure(
        "People_Delete",
        storedProcedureBuilder =>
        {
            storedProcedureBuilder.HasOriginalValueParameter(person => person.Id);
            storedProcedureBuilder.HasOriginalValueParameter(person => person.Name);
            storedProcedureBuilder.HasRowsAffectedResultColumn();
        });`;

const MIGRATION = `public partial class AccountStatement : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
        => migrationBuilder.Sql("""
            CREATE OR ALTER PROCEDURE dbo.Account_Statement
                @AccountId int, @From date, @To date
            AS
            BEGIN
                SET NOCOUNT ON;
                SELECT PostedOn, Reference, Amount,
                       SUM(Amount) OVER (ORDER BY PostedOn, Id ROWS UNBOUNDED PRECEDING) AS RunningBalance
                FROM dbo.Ledger
                WHERE AccountId = @AccountId AND PostedOn >= @From AND PostedOn < DATEADD(day, 1, @To)
                ORDER BY PostedOn, Id;
            END
            """);

    protected override void Down(MigrationBuilder migrationBuilder)
        => migrationBuilder.Sql("DROP PROCEDURE IF EXISTS dbo.Account_Statement;");
}`;

const SEAM = `public interface IStatements
{
    Task<IReadOnlyList<StatementLine>> ForAccountAsync(int accountId, DateOnly from, DateOnly to, CancellationToken ct);
}

public sealed class SqlStatements(LedgerDbContext db) : IStatements
{
    public async Task<IReadOnlyList<StatementLine>> ForAccountAsync(int accountId, DateOnly from, DateOnly to, CancellationToken ct)
        => await db.Set<StatementLine>()
            .FromSql($"EXECUTE dbo.Account_Statement @AccountId={accountId}, @From={from}, @To={to}")
            .AsNoTracking()
            .ToListAsync(ct);
}`;

const TEST = `// Testcontainers.MsSql starts a real SQL Server in Docker for the test run
public sealed class StatementTests : IAsyncLifetime
{
    private readonly MsSqlContainer _sql = new MsSqlBuilder().Build();
    private LedgerDbContext _db = null!;

    public async Task InitializeAsync()
    {
        await _sql.StartAsync();
        var options = new DbContextOptionsBuilder<LedgerDbContext>().UseSqlServer(_sql.GetConnectionString()).Options;
        _db = new LedgerDbContext(options);
        await _db.Database.MigrateAsync();                      // tables and procedures from the migrations
    }

    [Fact]
    public async Task Running_balance_is_the_sum_of_amounts_so_far()
    {
        _db.Ledger.AddRange(
            new LedgerEntry { AccountId = 7, PostedOn = new DateOnly(2026, 1, 3), Reference = "INV-1", Amount = 100m },
            new LedgerEntry { AccountId = 7, PostedOn = new DateOnly(2026, 1, 5), Reference = "PAY-1", Amount = -40m });
        await _db.SaveChangesAsync();

        var lines = await new SqlStatements(_db).ForAccountAsync(7, new DateOnly(2026, 1, 1), new DateOnly(2026, 1, 31), default);

        Assert.Equal([100m, 60m], lines.Select(l => l.RunningBalance));
    }

    public async Task DisposeAsync()
    {
        await _db.DisposeAsync();
        await _sql.DisposeAsync();
    }
}`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        The Visual FoxPro system I migrated to .NET ended up with 42 T-SQL stored procedures behind an Entity Framework Core domain layer, with a data access layer that could be tested. That is not the EF Core default, and it is not what the EF Core documentation recommends as a starting point. This article is about when a procedure belongs in an EF Core application anyway, how to call one for each kind of result, and how to keep the code around it testable.
      </p>

      <h2>When a stored procedure earns its place</h2>
      <p>
        EF Core&apos;s LINQ provider writes good SQL for most reads and writes, and a query it generates is visible in one place, in C#, with the types checked. Reach for a procedure when one of these holds:
      </p>
      <ul>
        <li><strong>Set-based money logic.</strong> A posting that touches thousands of rows runs as one statement in T-SQL and as a slow loop in C#.</li>
        <li><strong>Several statements, one unit.</strong> Insert the journal, update balances, write the audit row: one procedure, one transaction, no half-done state if the app process dies between calls.</li>
        <li><strong>Rules the database team owns.</strong> When a DBA maintains the calculation, the procedure is the contract between teams.</li>
        <li><strong>Reports.</strong> Window functions, <code>ROLLUP</code> and running totals are plainer in SQL than in LINQ.</li>
      </ul>
      <p>
        The migration had three of the four; as the sole engineer I was also the database team. If none applies, write LINQ. Microsoft&apos;s own note on the save-mapping feature says that supporting procedures does not mean recommending them.
      </p>

      <h2>Read rows: FromSql on a keyless type</h2>
      <p>
        A procedure that returns rows is read through <code>FromSql</code>. The result type can be an entity, but a report shape usually is not a table, so declare it as a keyless type and keep it out of migrations with <code>ToView(null)</code>. The columns the procedure returns must match the property names exactly.
      </p>
      <pre><code>{KEYLESS}</code></pre>
      <pre><code>{FROMSQL}</code></pre>
      <p>
        The interpolated string is not ordinary C# interpolation. EF Core turns each <code>{'{'}value{'}'}</code> into a <code>DbParameter</code>, which is why it is safe from injection and why named parameters work. <code>FromSql</code> arrived in EF Core 7; on EF Core 6 the same call is <code>FromSqlInterpolated</code>.
      </p>
      <p>
        The second query shows the limit that catches everyone once. LINQ operators after <code>FromSql</code> are translated by wrapping your SQL in a subquery, and SQL Server does not allow <code>EXECUTE</code> inside one. <code>AsAsyncEnumerable</code> ends the translation, so the filter runs in memory. If the filter needs to run in the database, it becomes a procedure parameter.
      </p>
      <p>
        The procedure itself is ordinary T-SQL. The running balance is a window function, and the date range is written so that <code>@To</code> is inclusive without a <code>BETWEEN</code> on a date that might one day become a datetime:
      </p>
      <pre><code>{PROCEDURE}</code></pre>

      <h2>Scalars and unmapped types: SqlQuery is for SELECT</h2>
      <p>
        <code>Database.SqlQuery&lt;T&gt;</code> returns a scalar, or since EF Core 8 any class with a property per column, from a SQL statement that EF Core can treat as a subquery. That makes it the right call for a <code>SELECT</code> or a table-valued function. For a procedure that returns one value, use an output parameter instead, as below; for a procedure that returns rows, the keyless type with <code>FromSql</code> above.
      </p>

      <h2>Writes: ExecuteSql</h2>
      <p>
        A procedure that changes data and returns no rows is run with <code>ExecuteSql</code>, which returns the rows-affected count. With <code>SET NOCOUNT ON</code> in the procedure, which you want for performance, that count is -1, so do not use it as a success check; raise an error inside the procedure instead and let the exception propagate.
      </p>
      <pre><code>{EXECUTE}</code></pre>

      <h2>Output parameters and facets</h2>
      <p>
        Output parameters need a <code>SqlParameter</code> built by hand, so the call switches to the raw overload with named placeholders. Read the value after the call completes.
      </p>
      <pre><code>{OUTPUT}</code></pre>
      <p>
        The same construction fixes a quieter bug. A C# <code>decimal</code> is sent as <code>decimal(18,2)</code> unless told otherwise, so a procedure declared with <code>decimal(19,4)</code> silently receives a rounded value. Set the precision and scale on the parameter:
      </p>
      <pre><code>{FACETS}</code></pre>

      <h2>Procedures and SaveChanges in one transaction</h2>
      <p>
        <code>SaveChanges</code> and a procedure call can share a transaction, because both go through the context&apos;s connection. Begin it on the <code>Database</code> facade, save, call, commit.
      </p>
      <pre><code>{TRANSACTION}</code></pre>

      <h2>Mapping SaveChanges to procedures</h2>
      <p>
        Since EF Core 7 an entity&apos;s insert, update and delete can each be routed through a procedure, so ordinary <code>Add</code> and <code>SaveChanges</code> calls end up in your T-SQL. This is the example from the EF Core 7 release notes:
      </p>
      <pre><code>{MAPPED}</code></pre>
      <p>
        The update procedure receives original values for concurrency checks and returns the row count through <code>SELECT @@ROWCOUNT</code>; the insert returns the generated key with an <code>OUTPUT INSERTED.[Id]</code> clause. You can map one operation and leave the others to EF Core. I used this where a DBA-owned procedure had to stay the only write path to a table, and nowhere else: the procedure&apos;s shape is now coupled to the model, and a mismatch shows up at runtime.
      </p>

      <h2>Keep the procedures in migrations</h2>
      <p>
        A procedure that lives only on the server is invisible to the repository and to the test database. Put the <code>CREATE OR ALTER</code> in a migration with <code>migrationBuilder.Sql</code>, and the drop in <code>Down</code>, so every environment gets the same version with the same deploy.
      </p>
      <pre><code>{MIGRATION}</code></pre>

      <h2>A data access layer you can test</h2>
      <p>
        The procedure is the logic, so an in-memory database cannot test it, and a mock of <code>DbContext</code> proves nothing. Two layers of tests instead. The business code depends on a small interface per use, so it is unit-tested with a fake that returns known lines. The implementation runs against a real SQL Server in an integration test, started by Testcontainers and migrated to the current version.
      </p>
      <pre><code>{SEAM}</code></pre>
      <pre><code>{TEST}</code></pre>
      <p>
        One such test per procedure, with the arithmetic case that matters, is what a testable data access layer meant on a system with 42 of them.
      </p>

      <h2>Mistakes I would check for first</h2>
      <ul>
        <li><strong>String concatenation into FromSqlRaw.</strong> That is SQL injection. Interpolate into <code>FromSql</code>, and when a table or column name has to vary, check it against an allow list first.</li>
        <li><strong>Where or OrderBy after a procedure call.</strong> Invalid SQL at runtime. Add <code>AsAsyncEnumerable</code> or move the clause into the procedure.</li>
        <li><strong>Tracking report rows.</strong> Keyless types are never tracked, but entity results are; add <code>AsNoTracking</code> to reads.</li>
        <li><strong>Trusting the rows-affected count</strong> from a procedure with <code>NOCOUNT ON</code>.</li>
        <li><strong>Decimal parameters without precision.</strong> Money arrives rounded to two places.</li>
        <li><strong>Procedures outside migrations.</strong> The test database and production drift apart.</li>
      </ul>

      <p>
        The procedures in the migration came after the tables had been loaded and reconciled, which is its own job: <Link href="/articles/visual-foxpro-to-sql-server-data-migration">Visual FoxPro to SQL Server: a repeatable data migration</Link> covers the staging load and control totals, and the <Link href="/articles/visual-foxpro-to-dotnet-migration-guide">migration guide</Link> has the order the whole project ran in.
      </p>
    </ArticlePage>
  );
}
