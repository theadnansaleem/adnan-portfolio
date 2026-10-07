import type { Metadata } from 'next';
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
        One practical note on reading the files: Microsoft&apos;s Visual FoxPro OLE DB provider is 32-bit only, so a loader that uses it has to run as a 32-bit process. Exporting from FoxPro to delimited files is the fallback when that is awkward.
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
      <p>A few FoxPro habits need particular care when you read the old code:</p>
      <ul>
        <li><strong>Macro substitution.</strong> <code>&amp;variable</code> builds a command from a string at run time. Search for every place it is used and work out what it can expand to, because that code path is invisible to a plain reading.</li>
        <li><strong>Public variables.</strong> State shared across forms acts as hidden input to a calculation. List each one a workflow reads and turn it into an explicit parameter.</li>
        <li><strong>Global error handlers.</strong> An <code>ON ERROR</code> routine can swallow failures and carry on. The old system may have been producing wrong results quietly; decide with the business whether to reproduce or correct each case.</li>
        <li><strong>Index expressions.</strong> Indexes are often built on expressions such as <code>UPPER(name)</code>, and lookups depend on them. Carry the same behaviour over with a collation or a computed column.</li>
      </ul>

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

      <h2>Common questions</h2>
      <p>
        <strong>Is Visual FoxPro still supported?</strong> No. Version 9 was the last release, and Microsoft&apos;s extended support for it ended in January 2015. Existing applications keep running, but nothing is being fixed.
      </p>
      <p>
        <strong>Can a FoxPro application be converted automatically?</strong> Tools can translate syntax, but the result keeps the old structure: logic inside forms, shared state and row-by-row loops. For a system that will be maintained for years, rewriting workflow by workflow against tests gives a better result than a mechanical translation.
      </p>
      <p>
        <strong>How long does a migration take?</strong> It depends on the number of workflows and on how much of the knowledge is written down. Mine covered 42 workflows as a part-time engagement over two and a half years, with one engineer and no specification.
      </p>
      <p>
        <strong>Should the database move first or the application?</strong> The data model, because everything else is tested against it. Moving the tables to SQL Server early also lets old and new run against comparable data while workflows move across one at a time.
      </p>
    </ArticlePage>
  );
}
