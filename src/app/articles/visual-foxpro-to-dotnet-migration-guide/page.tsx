import type { Metadata } from 'next';
import Link from 'next/link';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('visual-foxpro-to-dotnet-migration-guide');
export const metadata: Metadata = articleMetadata(meta);

// Illustrations of the pattern, not code from the project
const FOXPRO_LOOP = `SELECT invoices
SCAN FOR status = "OPEN" AND due_date < DATE()
  REPLACE status WITH "LATE", fee WITH ROUND(amount * 0.015, 2)
ENDSCAN`;

const SQL_SET = `UPDATE invoices
SET status = 'LATE',
    fee = ROUND(amount * 0.015, 2)
WHERE status = 'OPEN'
  AND due_date < CAST(GETDATE() AS date);`;

const EF_UPDATE = `var today = DateTime.Today;
await db.Invoices
    .Where(i => i.Status == "OPEN" && i.DueDate < today)
    .ExecuteUpdateAsync(set => set
        .SetProperty(i => i.Status, "LATE")
        .SetProperty(i => i.Fee, i => Math.Round(i.Amount * 0.015m, 2)));`;

const DBF_READ = `// Windows only: System.Data.OleDb, process built for x86
using var conn = new OleDbConnection(
    @"Provider=VFPOLEDB.1;Data Source=C:\\legacy\\data\\");
conn.Open();
using var cmd = new OleDbCommand(
    "SELECT * FROM invoices WHERE NOT DELETED()", conn);
using var reader = cmd.ExecuteReader();
while (reader.Read())
{
    // Character fields come padded with spaces
    var customer = ((string)reader["customer"]).TrimEnd();
    // map each field into the new schema here
}`;

const ROUNDING = `Math.Round(2.345m, 2);                                // 2.34: half goes to the even digit
Math.Round(2.345m, 2, MidpointRounding.AwayFromZero);  // 2.35: what FoxPro and T-SQL do`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        Over a two-and-a-half-year engagement I migrated 42 financial workflows from a legacy Visual FoxPro system to C# and .NET Core, as the sole engineer. The old system carried two decades of business logic and had no written specification. The domain layer was rebuilt on Entity Framework Core with 42 T-SQL stored procedures against SQL Server, the FoxPro reports were replaced with reporting workflows in a Blazor application, and the old system was retired. This is the order of work I would recommend to anyone facing the same kind of migration.
      </p>

      <h2>Why these migrations are hard</h2>
      <p>
        Visual FoxPro mixes data, logic and screens in one place. A form can hold validation, calculations and direct table updates, so there is no layer to lift out. Microsoft ended support for it years ago, which means the people who understand the system are often the only documentation left. The risk is not the new code. The risk is losing a rule that nobody remembers is there.
      </p>

      <h2>1. Inventory the workflows, not the files</h2>
      <p>
        Start from what the business does: each task a user completes from start to finish, such as posting a payment or closing a period. List them, name an owner for each, and note which screens, tables and reports each one touches. That list becomes the plan and the definition of done. In my case there were 42.
      </p>

      <h2>2. Treat the old code as the specification</h2>
      <p>
        When there is no written spec, the running system is the spec, including its oddities. For each workflow, read the FoxPro code and write down the rules in plain language, then confirm them with someone who uses the system. Record real inputs and the outputs they produce. Those pairs become the tests that the new system must pass.
      </p>

      <h2>3. Move the data model deliberately</h2>
      <p>
        FoxPro tables are loosely typed, often without enforced keys. Moving to SQL Server is the moment to add what was missing: primary and foreign keys, proper date and decimal types, and constraints for rules that used to live only in forms. Do not copy the old structure column for column. Redesign it, and write a repeatable script that loads the legacy data into the new shape, so the load can be rehearsed many times before the real cutover.
      </p>
      <p>Each FoxPro field type needs a decision, and a few of them hide surprises:</p>
      <ul>
        <li><strong>Character.</strong> Fixed width and padded with spaces. Trim on the way in and store as <code>nvarchar</code>. FoxPro also compares strings by prefix unless <code>SET EXACT</code> is on, so <code>&quot;OPEN&quot;</code> can match longer values. Find out which comparisons relied on that.</li>
        <li><strong>Numeric and Currency.</strong> Map to <code>decimal</code> with an explicit precision. Currency keeps four decimal places, so <code>decimal(19,4)</code> preserves it.</li>
        <li><strong>Date and DateTime.</strong> FoxPro allows an empty date, which is not the same as null. Decide what an empty date means for each column before loading, and make the column nullable where the answer is &quot;unknown&quot;.</li>
        <li><strong>Logical.</strong> Becomes <code>bit</code>. Check whether nulls were used as a third state.</li>
        <li><strong>Memo.</strong> Long text held in a separate <code>.fpt</code> file beside the table. Copy both files together, and store the text as <code>nvarchar(max)</code>.</li>
        <li><strong>Deleted rows.</strong> Deleting a record only flags it; the row stays in the file until the table is packed. Filter flagged rows out during the load, or they come back from the dead.</li>
        <li><strong>Code pages.</strong> Each table records the code page it was written in. Convert to Unicode while loading, and check names and addresses with accented characters afterwards.</li>
      </ul>
      <p>
        One practical note on reading the files: Microsoft&apos;s Visual FoxPro OLE DB provider is 32-bit only, so a loader that uses it has to run as a 32-bit process. Exporting from FoxPro to delimited files is the fallback when that is awkward. A minimal loader in C# looks like this:
      </p>
      <pre><code>{DBF_READ}</code></pre>
      <p>
        <code>NOT DELETED()</code> leaves out rows that were flagged for deletion but never packed. Run the loader into staging tables first, then transform into the new schema in T-SQL, so each rehearsal starts from the same raw copy.
      </p>
      <p>
        The full type mapping, the staging load with <code>BULK INSERT</code> and <code>SqlBulkCopy</code>, control totals and the rehearsal checklist are in the companion article, <Link href="/articles/visual-foxpro-to-sql-server-data-migration">Visual FoxPro to SQL Server: a repeatable data migration</Link>.
      </p>

      <h2>4. Put the rules in a domain layer</h2>
      <p>
        Business rules that were scattered across forms belong in one place in the new system: a domain layer in C# that knows nothing about screens or the database. That is what makes the rules testable, and it is what stops the new system from turning into the old one. Entity Framework Core handles ordinary reads and writes. For heavy set-based work, such as period-end calculations over many rows, a stored procedure is often the clearer and faster tool.
      </p>
      <p>
        Much FoxPro logic is written as a loop over a table that changes one row at a time. In SQL Server the same rule is usually one statement. A loop like this:
      </p>
      <pre><code>{FOXPRO_LOOP}</code></pre>
      <p>becomes a single set-based update:</p>
      <pre><code>{SQL_SET}</code></pre>
      <p>
        From C#, Entity Framework Core 7 and later can express the same rule without loading a single row. <code>ExecuteUpdateAsync</code> sends one <code>UPDATE</code> to SQL Server:
      </p>
      <pre><code>{EF_UPDATE}</code></pre>
      <p>
        The <code>Math.Round</code> call inside the query never runs in .NET. EF Core translates it to T-SQL <code>ROUND</code>, so it rounds a half away from zero, the way FoxPro did. The same call on a value in memory rounds differently, which the rounding trap below explains.
      </p>
      <p>A few FoxPro habits need particular care when you read the old code:</p>
      <ul>
        <li><strong>Macro substitution.</strong> <code>&amp;variable</code> builds a command from a string at run time. Search for every place it is used and work out what it can expand to, because that code path is invisible to a plain reading.</li>
        <li><strong>Public variables.</strong> State shared across forms acts as hidden input to a calculation. List each one a workflow reads and turn it into an explicit parameter.</li>
        <li><strong>Global error handlers.</strong> An <code>ON ERROR</code> routine can swallow failures and carry on. The old system may have been producing wrong results quietly; decide with the business whether to reproduce or correct each case.</li>
        <li><strong>Index expressions.</strong> Indexes are often built on expressions such as <code>UPPER(name)</code>, and lookups depend on them. Carry the same behaviour over with a collation or a computed column.</li>
      </ul>

      <h2>Converting FoxPro code to C#: common equivalents</h2>
      <p>
        Most FoxPro functions have a direct C# counterpart. The differences that cause bugs are small: where counting starts, what happens on bad input, and what &quot;empty&quot; means.
      </p>
      <div className="hx-prose-table" role="region" aria-label="Visual FoxPro to C# equivalents" tabIndex={0}>
        <table>
          <caption>Visual FoxPro functions and commands with their C# equivalents</caption>
          <thead><tr><th scope="col">Visual FoxPro</th><th scope="col">C#</th><th scope="col">Watch for</th></tr></thead>
          <tbody>
            <tr><td><code>SCAN ... ENDSCAN</code></td><td><code>foreach</code>, or a set-based update</td><td>A loop that writes one row at a time is usually one SQL statement.</td></tr>
            <tr><td><code>LOCATE FOR</code>, <code>SEEK</code></td><td><code>FirstOrDefault(predicate)</code></td><td>FoxPro moves a record pointer; C# returns the row or null.</td></tr>
            <tr><td><code>IIF(cond, a, b)</code></td><td><code>cond ? a : b</code></td><td>None.</td></tr>
            <tr><td><code>NVL(x, y)</code></td><td><code>x ?? y</code></td><td>None.</td></tr>
            <tr><td><code>EMPTY(x)</code></td><td>Depends on the type</td><td>True for blank strings, zero, empty dates and <code>.F.</code>. Decide per field, often <code>string.IsNullOrWhiteSpace</code> or <code>== 0</code>.</td></tr>
            <tr><td><code>ALLTRIM(s)</code></td><td><code>s.Trim()</code></td><td>Character fields are padded, so most reads need it.</td></tr>
            <tr><td><code>SUBSTR(s, start, n)</code></td><td><code>s.Substring(start - 1, n)</code></td><td>FoxPro counts from 1, C# from 0.</td></tr>
            <tr><td><code>AT(find, s)</code></td><td><code>s.IndexOf(find) + 1</code></td><td>FoxPro returns 0 when not found, C# returns -1.</td></tr>
            <tr><td><code>VAL(s)</code></td><td><code>decimal.TryParse</code></td><td><code>VAL(&quot;12abc&quot;)</code> returns 12; parsing in C# fails instead.</td></tr>
            <tr><td><code>BETWEEN(x, a, b)</code></td><td><code>x &gt;= a &amp;&amp; x &lt;= b</code></td><td>Both ends are included.</td></tr>
            <tr><td><code>INLIST(x, a, b, c)</code></td><td><code>new[] {'{'} a, b, c {'}'}.Contains(x)</code></td><td>None.</td></tr>
            <tr><td><code>DATE()</code></td><td><code>DateTime.Today</code></td><td>Returns midnight as a <code>DateTime</code>; use <code>DateOnly</code> where only the date matters.</td></tr>
            <tr><td><code>GOMONTH(d, n)</code></td><td><code>d.AddMonths(n)</code></td><td>Both clamp to the end of a shorter month.</td></tr>
            <tr><td><code>DIMENSION a[10]</code></td><td><code>new T[10]</code> or <code>List&lt;T&gt;</code></td><td>FoxPro arrays start at 1.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>The rounding trap</h2>
      <p>
        If totals in the new system differ from the old by a cent, check rounding first. FoxPro and T-SQL round a half away from zero. In .NET, <code>Math.Round</code> rounds a half to the nearest even digit unless told otherwise:
      </p>
      <pre><code>{ROUNDING}</code></pre>
      <p>
        Pick one rule, state it in the domain layer, and use it everywhere money is rounded. Decide also where rounding happens: per line or on the total. The two give different answers and the old system will have chosen one.
      </p>

      <h2>5. Keep data access testable</h2>
      <p>
        Hide the database behind a narrow interface, so domain logic can be tested without one and the stored procedures can be tested against a real one. Financial systems reward this more than most: when a number is questioned, you want a test that reproduces it.
      </p>

      <h2>6. Leave reports until the data is right</h2>
      <p>
        Reports are where users notice differences first, and they depend on everything underneath. Rebuild them after the workflows that feed them, and compare old and new output line by line on the same data. A report that matches is the most convincing evidence that a workflow was migrated correctly.
      </p>
      <p>
        FoxPro reports live in <code>.frx</code> files that hold the layout, the grouping and the expressions for each field, so a report can contain calculations that appear nowhere else in the code. Open each one and list its expressions before rebuilding it.
      </p>

      <h2>7. Migrate one workflow at a time, then retire</h2>
      <p>
        A single big cutover concentrates all the risk in one weekend. Moving one workflow at a time keeps each step small enough to verify and to reverse. Where you can, run old and new side by side for a period and compare results. Retire the old system only when the inventory from step one is fully ticked off.
      </p>

      <h2>A cutover checklist</h2>
      <ul>
        <li>The data load has run end to end at least three times on a full copy, with row counts and control totals compared each time.</li>
        <li>Every workflow in the inventory has passing tests built from real inputs and outputs.</li>
        <li>Each report has been compared with its old version on the same data.</li>
        <li>Users have worked a full period in the new system while the old one was still available.</li>
        <li>There is a written way back: how to return to the old system, and until what date that is possible.</li>
        <li>The old system is kept read-only for a while after retirement, for questions about history.</li>
      </ul>

      <h2>What I would tell someone starting</h2>
      <ul>
        <li>Budget more time for understanding than for coding. The rewrite is the easy half.</li>
        <li>Keep a written log of every rule you find and every decision you make. It becomes the specification the old system never had.</li>
        <li>Do not improve behaviour while migrating it. Match first, then change, so a difference always means a bug.</li>
      </ul>

    </ArticlePage>
  );
}
