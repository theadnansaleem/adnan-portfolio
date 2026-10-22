import type { Metadata } from 'next';
import Link from 'next/link';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('visual-foxpro-to-sql-server-data-migration');
export const metadata: Metadata = articleMetadata(meta);

// Illustrations of the pattern, not code from the project
const INVENTORY = `* Run inside Visual FoxPro, pointed at a copy of the live data folder
SET DELETED OFF
CREATE CURSOR inventory ;
  (table_name C(60), records I, flagged I, code_page I, has_memo L, tags I)
LOCAL aFiles[1], nFiles, i, nFlagged
nFiles = ADIR(aFiles, "C:\\legacy\\data\\*.dbf")
FOR i = 1 TO nFiles
  USE ("C:\\legacy\\data\\" + aFiles[i, 1]) ALIAS src SHARED
  COUNT FOR DELETED() TO nFlagged
  INSERT INTO inventory VALUES ;
    (aFiles[i, 1], RECCOUNT(), nFlagged, CPDBF(), ;
     FILE(FORCEEXT(DBF(), "fpt")), TAGCOUNT())
  USE
ENDFOR
SELECT inventory
COPY TO C:\\export\\inventory.csv TYPE CSV`;

const EXPORT_CSV = `* One table per file, flagged rows left out, written in code page 1252
USE C:\\legacy\\data\\invoices
COPY TO C:\\export\\invoices.csv FOR NOT DELETED() TYPE CSV AS 1252`;

const STAGING = `CREATE SCHEMA staging;
GO
-- Same shape as the FoxPro table, loose types, plus two columns that record the source
CREATE TABLE staging.invoices (
    src_recno    int            NOT NULL,
    src_deleted  bit            NOT NULL,
    invoice_no   nvarchar(10)   NULL,
    customer     nvarchar(40)   NULL,
    inv_date     date           NULL,
    amount       decimal(12,2)  NULL,
    status       nvarchar(6)    NULL,
    notes        nvarchar(max)  NULL
);`;

const BULK_INSERT = `-- The path is read by the SQL Server service, not by your workstation
BULK INSERT staging.invoices
FROM '\\\\fileserver\\export\\invoices.csv'
WITH (
    FORMAT = 'CSV',          -- RFC 4180 quoting, SQL Server 2017 and later
    FIELDQUOTE = '"',
    FIRSTROW = 2,            -- skip the header line COPY TO writes
    CODEPAGE = '1252',       -- the code page the export was written in
    KEEPNULLS,
    TABLOCK
);`;

const LOADER = `// Build as x86: the Visual FoxPro OLE DB provider only ships as a 32-bit DLL
using var src = new OleDbConnection(@"Provider=VFPOLEDB.1;Data Source=C:\\legacy\\data\\");
using var dst = new SqlConnection(connectionString);
src.Open();
dst.Open();

using var cmd = new OleDbCommand(
    "SELECT *, RECNO() AS src_recno, DELETED() AS src_deleted FROM invoices", src);
using var reader = cmd.ExecuteReader();

using var bulk = new SqlBulkCopy(dst, SqlBulkCopyOptions.TableLock | SqlBulkCopyOptions.KeepNulls, null)
{
    DestinationTableName = "staging.invoices",
    BatchSize = 10_000,
    EnableStreaming = true,
    BulkCopyTimeout = 0,
};
for (var i = 0; i < reader.FieldCount; i++)
    bulk.ColumnMappings.Add(reader.GetName(i), reader.GetName(i));

await bulk.WriteToServerAsync(reader);`;

const TRANSFORM = `INSERT INTO dbo.Invoice (InvoiceNo, CustomerId, InvoiceDate, Amount, Status, Notes)
SELECT
    RTRIM(s.invoice_no),
    c.CustomerId,                                   -- resolved through the new key
    s.inv_date,                                     -- NULL where FoxPro had an empty date
    s.amount,
    CASE RTRIM(s.status) WHEN 'OPEN' THEN 1 WHEN 'PAID' THEN 2 WHEN 'LATE' THEN 3 END,
    NULLIF(s.notes, N'')
FROM staging.invoices AS s
JOIN dbo.Customer AS c ON c.LegacyCode = RTRIM(s.customer)
WHERE s.src_deleted = 0;`;

const CONTROLS = `-- Run after every rehearsal; the FoxPro side comes from CALCULATE on the same copy
CREATE TABLE audit.ControlTotals (
    run_id       int           NOT NULL,
    table_name   sysname       NOT NULL,
    stage        varchar(10)   NOT NULL,   -- 'foxpro', 'staging' or 'final'
    row_count    bigint        NOT NULL,
    amount_sum   decimal(19,4) NULL
);

INSERT INTO audit.ControlTotals
SELECT @run, 'invoices', 'staging', COUNT(*), SUM(amount) FROM staging.invoices WHERE src_deleted = 0
UNION ALL
SELECT @run, 'invoices', 'final',   COUNT(*), SUM(Amount) FROM dbo.Invoice;

-- Any row here is a stop
SELECT st.table_name, st.row_count AS staging_rows, fi.row_count AS final_rows,
       st.amount_sum AS staging_sum, fi.amount_sum AS final_sum
FROM audit.ControlTotals AS st
JOIN audit.ControlTotals AS fi
  ON fi.run_id = st.run_id AND fi.table_name = st.table_name AND fi.stage = 'final'
WHERE st.run_id = @run AND st.stage = 'staging'
  AND (st.row_count <> fi.row_count OR st.amount_sum <> fi.amount_sum);`;

const ORPHANS = `-- Find what a foreign key would reject before you add it
SELECT s.src_recno, s.customer
FROM staging.invoices AS s
LEFT JOIN dbo.Customer AS c ON c.LegacyCode = RTRIM(s.customer)
WHERE s.src_deleted = 0 AND c.CustomerId IS NULL;

-- Then add the key with the default check against existing rows
ALTER TABLE dbo.Invoice WITH CHECK
    ADD CONSTRAINT FK_Invoice_Customer
    FOREIGN KEY (CustomerId) REFERENCES dbo.Customer (CustomerId);`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        This is the data chapter of my <Link href="/articles/visual-foxpro-to-dotnet-migration-guide">Visual FoxPro to .NET migration guide</Link>. Over a two-and-a-half-year engagement I migrated 42 financial workflows from a legacy Visual FoxPro system to C# and .NET Core as the sole engineer, with the data model rebuilt on Entity Framework Core and 42 T-SQL stored procedures against SQL Server. The tables moved before anything else, because every workflow was tested against them. What follows is the load I would build again: inventory, a type mapping, a staging schema, a repeatable transform with control totals, and the four places FoxPro data bites.
      </p>

      <h2>What a FoxPro database actually is</h2>
      <p>
        A Visual FoxPro table is a set of files that have to travel together. The <code>.dbf</code> holds the header and the fixed-width rows. The <code>.fpt</code> beside it holds Memo, General and Blob values, which the row only points at. The <code>.cdx</code> with the same name is the structural index, where the index expressions live. A database container, the <code>.dbc</code>, is itself a table that lists the member tables, their long names, relations and any stored procedures; tables without one are free tables.
      </p>
      <p>
        Two bytes in the <code>.dbf</code> header matter for the migration. Byte 28 holds flags that say whether the table has a structural <code>.cdx</code> and whether it has a memo file. Byte 29 is the code page mark. And every data record starts with one byte that is a space for a live row and an asterisk for a row flagged as deleted. Those three facts explain most of what goes wrong later.
      </p>
      <p>
        Take the inventory inside FoxPro, against a copy of the data folder, before any loader is written. It gives you the row count to reconcile against, the number of flagged rows that will otherwise come back from the dead, the code page per table, whether a memo file is expected, and how many index tags you have to read expressions out of:
      </p>
      <pre><code>{INVENTORY}</code></pre>
      <p>
        <code>SET DELETED OFF</code> comes first so that <code>COUNT</code> sees the flagged rows. Keep the output file. The row count per table is the first control total, and the <code>.fpt</code> column tells you which tables cannot be exported through a text file.
      </p>

      <h2>Map every FoxPro type to a SQL Server type</h2>
      <p>
        FoxPro has two string types, four numeric types, three binary types and an OLE type, and most of them allow nulls only if the field was created with that flag set. Fields without the flag cannot be null, so FoxPro uses an empty value instead: a blank string, zero, <code>.F.</code>, or an empty date. The mapping has to decide, for each column, whether that empty value is data or the absence of data.
      </p>
      <div className="hx-prose-table" role="region" aria-label="Visual FoxPro to SQL Server type mapping" tabIndex={0}>
        <table>
          <caption>Visual FoxPro field types and the SQL Server type to load them into</caption>
          <thead><tr><th scope="col">FoxPro field</th><th scope="col">What it holds</th><th scope="col">SQL Server type</th><th scope="col">Empty value and nullability</th></tr></thead>
          <tbody>
            <tr><td>Character(n)</td><td>Text, fixed width, up to 254 bytes, padded with spaces</td><td><code>nvarchar(n)</code></td><td>Empty is all spaces. Trim on the way in, then decide if a blank string should become NULL.</td></tr>
            <tr><td>Character (Binary)</td><td>Text that FoxPro never translates between code pages</td><td><code>varbinary(n)</code>, or <code>nvarchar(n)</code> once you know the encoding</td><td>Usually passwords or keys. Do not run it through code page conversion.</td></tr>
            <tr><td>Varchar(n)</td><td>Text up to 254 bytes, length stored, no padding</td><td><code>nvarchar(n)</code></td><td>Empty is a zero-length string. Nullable only if the field flag was set.</td></tr>
            <tr><td>Numeric(w,d)</td><td>Decimal with a width up to 20 characters, including sign and point</td><td><code>decimal(w,d)</code></td><td>Empty is zero. A FoxPro width always fits the same precision in SQL Server, with room to spare.</td></tr>
            <tr><td>Float(w,d)</td><td>Same storage as Numeric, kept for compatibility</td><td><code>decimal(w,d)</code></td><td>Treat exactly as Numeric. It is not a floating-point type.</td></tr>
            <tr><td>Double</td><td>8-byte IEEE floating point</td><td><code>float(53)</code></td><td>Empty is zero. If it holds money, it should never have been a Double; convert to <code>decimal</code> and reconcile totals.</td></tr>
            <tr><td>Integer</td><td>4-byte signed integer</td><td><code>int</code></td><td>Empty is zero. Nullable only if flagged.</td></tr>
            <tr><td>Integer (AutoInc)</td><td>Integer that FoxPro assigns, read-only</td><td><code>int IDENTITY</code>, or <code>int</code> with the old values kept</td><td>Keep the old numbers if anything printed refers to them; load with <code>KeepIdentity</code> and reseed.</td></tr>
            <tr><td>Currency</td><td>8 bytes, four decimal places, about ±922 trillion</td><td><code>decimal(19,4)</code></td><td>Empty is zero. SQL Server&apos;s <code>money</code> has the same shape, but Microsoft advises <code>decimal</code> for values used in calculations.</td></tr>
            <tr><td>Date</td><td>Year, month, day, from 0001 to 9999</td><td><code>date</code></td><td>FoxPro allows an empty date that is not null. Make the column nullable and load empty as NULL, unless the business says empty means something.</td></tr>
            <tr><td>DateTime</td><td>Date plus time to the second</td><td><code>datetime2(0)</code></td><td>Same empty rule as Date. FoxPro stores whole seconds, so precision 0 loses nothing.</td></tr>
            <tr><td>Logical</td><td><code>.T.</code> or <code>.F.</code>, 1 byte</td><td><code>bit NOT NULL</code></td><td>Empty is <code>.F.</code>. Only make it nullable if the field was flagged and the code tests for <code>ISNULL()</code>.</td></tr>
            <tr><td>Memo</td><td>Text of any length, stored in the <code>.fpt</code></td><td><code>nvarchar(max)</code></td><td>Empty is no contents. Text exports drop memo fields, so these tables need the OLE DB path.</td></tr>
            <tr><td>Memo (Binary)</td><td>Memo with no code page translation</td><td><code>varbinary(max)</code></td><td>Often scripts or serialized objects. Load the bytes untouched and decode later if needed.</td></tr>
            <tr><td>General</td><td>Reference to an OLE object such as an embedded worksheet</td><td><code>varbinary(max)</code>, usually dropped</td><td>The bytes are an OLE container, not the document. Decide with the business whether anyone still opens them.</td></tr>
            <tr><td>Blob</td><td>Binary of any length, stored in the <code>.fpt</code></td><td><code>varbinary(max)</code></td><td>No code page translation on either side. Empty is zero bytes.</td></tr>
            <tr><td>Varbinary(n)</td><td>Binary up to 255 bytes, length stored, no zero padding</td><td><code>varbinary(n)</code></td><td>Same empty rule as Blob.</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Three rows deserve a second look. Numeric widths count characters: a <code>Numeric(12,2)</code> field is twelve characters wide including the decimal point and any minus sign, so <code>decimal(12,2)</code> holds everything it could contain. Currency is exact to four places, and <code>decimal(19,4)</code> keeps that without inviting the rounding behaviour of <code>money</code>. And an empty date is the trap that bites every time: it compares equal to <code>CTOD(&apos;&apos;)</code>, it is not null, and the old code probably tested for it with <code>EMPTY()</code>. If you load it as a real date you get 1900 or 1899 placeholders scattered through reports.
      </p>

      <h2>Read the tables: the OLE DB provider or a text export</h2>
      <p>
        There are two reliable ways to get rows out, and the choice is mostly about memo fields and about what machine the loader runs on.
      </p>
      <p>
        The Visual FoxPro OLE DB provider, <code>VFPOLEDB</code>, lets a .NET process query the tables with FoxPro SQL. It returns Character fields as strings, Numeric and Currency as <code>decimal</code>, Date and DateTime as <code>DateTime</code>, Logical as <code>bool</code>, and Memo as string, so most of the type mapping is done for you. It respects <code>SET DELETED</code> and supports <code>DELETED()</code> and <code>RECNO()</code> in a query, which is what the staging load below relies on. The constraint is that it only ships as a 32-bit DLL, so the process that loads it has to be built for x86 and run on Windows. That rules out running it inside a 64-bit SQL Server as a linked server or in the 64-bit import wizard.
      </p>
      <p>
        The fallback is to export from inside FoxPro. <code>COPY TO</code> with <code>TYPE CSV</code> writes a comma-separated file with the field names on the first line, and <code>AS nCodePage</code> converts the text to a named code page while writing it. Two things to know before relying on it: memo fields are not copied to any file that is not a FoxPro table, so a table with a memo column needs the OLE DB path or a separate memo export, and dates come out as text in the current <code>SET DATE</code> format, so set it to <code>YMD</code> with <code>SET CENTURY ON</code> first.
      </p>
      <pre><code>{EXPORT_CSV}</code></pre>
      <p>
        <code>FOR NOT DELETED()</code> leaves the flagged rows out explicitly rather than depending on the <code>SET DELETED</code> setting, which defaults to off. Whichever path you use, read from a copy of the data folder, taken while the old application is closed. FoxPro writes the row count into the header only when a table closes, and a table read mid-session can disagree with itself.
      </p>

      <h2>Load into staging tables first</h2>
      <p>
        Do not load the FoxPro rows straight into the new schema. Load them into a staging schema that mirrors the old tables one for one, with loose types, every column nullable, and two extra columns that record where each row came from. Then every rehearsal starts from the same raw copy, every transform can be re-run without re-reading the files, and a question about a specific invoice can be answered by looking at the row as FoxPro had it.
      </p>
      <pre><code>{STAGING}</code></pre>
      <p>
        From a CSV export, <code>BULK INSERT</code> loads the file in one statement. The path is opened by the SQL Server service account on the server, so the file has to be on the server or on a share it can reach:
      </p>
      <pre><code>{BULK_INSERT}</code></pre>
      <p>
        <code>FORMAT = &apos;CSV&apos;</code> is what makes quoted fields with embedded commas parse correctly; without it <code>BULK INSERT</code> splits on the delimiter and nothing else. <code>FIRSTROW = 2</code> skips the header line, but note that it skips by counting row terminators and does not look at what the row contains. <code>CODEPAGE</code> tells SQL Server how to read bytes above 127 in character columns, so it must match the <code>AS</code> clause of the export. <code>KEEPNULLS</code> keeps empty columns null instead of applying defaults, and <code>TABLOCK</code> takes one table lock for the duration, which is what you want for a load into an empty staging table.
      </p>
      <p>
        From C#, <code>SqlBulkCopy</code> does the same job and can stream straight from the OLE DB reader, so memo fields and the deleted flag come through without a file in between:
      </p>
      <pre><code>{LOADER}</code></pre>
      <p>
        The query carries <code>RECNO()</code> and <code>DELETED()</code> into staging as columns, so the record number and the flag survive the load. <code>SqlBulkCopy</code> maps columns by position when no mappings are given, which breaks silently the first time someone reorders a staging table; naming every mapping costs one loop and removes that failure. <code>EnableStreaming</code> keeps the reader&apos;s rows from being buffered in memory, and <code>BulkCopyTimeout = 0</code> removes the default 30-second limit that a large table will otherwise hit.
      </p>

      <h2>Transform staging into the new schema in T-SQL</h2>
      <p>
        With the raw rows in staging, the move into the redesigned schema is a set of <code>INSERT ... SELECT</code> statements, one per target table, in dependency order: lookups first, then parents, then children. Each statement is where a FoxPro convention becomes a SQL Server one: trailing spaces trimmed, codes resolved to keys, empty dates turned into NULL, status strings turned into a reference table.
      </p>
      <pre><code>{TRANSFORM}</code></pre>
      <p>
        Keep the transform in a script under version control, with no manual steps between the load and the end. The target of the exercise is a single command that drops the new schema, reloads staging, runs every transform, and prints the control totals. If a step needs a person, it will be done differently on cutover night than it was in rehearsal.
      </p>
      <p>
        Control totals are what make the rehearsal mean something. For each table, record the row count and the sum of every money column at three points: in FoxPro, from <code>CALCULATE CNT(), SUM(amount)</code> on the same copy; in staging, excluding flagged rows; and in the final table. The three must agree, and the comparison should be a query that returns rows only when they do not:
      </p>
      <pre><code>{CONTROLS}</code></pre>
      <p>
        A sum that differs by a few cents usually means a Double column that held money, or a transform that rounded. A row count that differs usually means flagged rows, orphaned children dropped by a join, or a <code>WHERE</code> that was tighter than the FoxPro filter. Both are cheap to find on rehearsal three and expensive to find in a month-end report.
      </p>

      <h2>Deleted rows</h2>
      <p>
        FoxPro&apos;s <code>DELETE</code> only sets the flag byte at the start of the record. The row stays in the file, keeps its record number, and comes back if anyone runs <code>RECALL</code>. It leaves the file only when the table is packed, which needs exclusive use, so production tables are often never packed. <code>SET DELETED</code> decides whether commands with a scope see those rows, and its default is off, which means the rows are visible unless something hides them.
      </p>
      <p>
        The load should neither trust that setting nor silently drop the rows. Carry the flag into staging, as the loader above does, count the flagged rows per table, and compare the count with the inventory. Then load only unflagged rows into the final schema. If the business wants the flagged rows kept, which happens when deletion was used as a soft archive, they belong in a separate history table with the flag made explicit, not in the live table with a hidden marker.
      </p>
      <p>
        One more check: a child row can be live while its parent is flagged. FoxPro would show the child with no parent in a <code>SET DELETED ON</code> session; a foreign key will not allow it. Decide which rows go, and record the decision.
      </p>

      <h2>Code pages to Unicode</h2>
      <p>
        Every FoxPro table is marked with the code page it was written in, and <code>CPDBF()</code> reports it for an open table. The common values are 1252 for Windows ANSI, 437 and 850 for tables that started life under MS-DOS, and 1250 or 1251 for Central European and Cyrillic systems. Inside one application you can find both 1252 and 437, because old tables were created by old tools.
      </p>
      <p>
        SQL Server stores <code>nvarchar</code> as Unicode, so the conversion happens once, at load time, and has to be told the source encoding. Through the OLE DB provider, Character and Memo fields arrive already translated to the current Windows code page as .NET strings, so the conversion is handled for you; Character (Binary) and Memo (Binary) fields arrive as bytes with no translation, which is what you want for them. Through a text export, use <code>AS 1252</code> on the <code>COPY TO</code> to write a known code page, and <code>CODEPAGE = &apos;1252&apos;</code> on the <code>BULK INSERT</code> so SQL Server reads it the same way. A load that leaves either side out produces the classic symptom: names with accents turn into two wrong characters each.
      </p>
      <p>
        Verify with data, not with faith. Before the load, list rows whose character fields contain any byte above 127; after the load, select the same rows by record number and look at them. Names, addresses and anything typed by people in a non-English region are where it shows.
      </p>

      <h2>Index expressions, SET EXACT and collations</h2>
      <p>
        A FoxPro index is built on an expression, not on a column, and <code>INDEX ON UPPER(name)</code> is the most common one. Lookups with <code>SEEK</code> go through that index, so the application&apos;s notion of equality is case-insensitive even though the data is not. In SQL Server the same behaviour comes from a case-insensitive collation on the column, with <code>_CI</code> in its name, which is also what the default server collation gives you. Where the expression does more than fold case, such as <code>SUBSTR(city, 1, 5) + SUBSTR(company, 1, 6)</code>, a persisted computed column with an index on it reproduces the lookup exactly.
      </p>
      <p>
        Read every tag out of every <code>.cdx</code> before deciding the new indexes. The expressions document which columns were searched, which comparisons were case-insensitive, and sometimes a rule that appears nowhere else, such as an index filtered with <code>FOR</code> on an active flag.
      </p>
      <p>
        <code>SET EXACT</code> is the other equality rule. With the default, off, a comparison with <code>=</code> runs only to the end of the right-hand string, so <code>&quot;SMITH JONES&quot; = &quot;SMITH&quot;</code> is true, and so is a <code>SEEK</code> for <code>&quot;SM&quot;</code> on an index of names. SQL Server has no equivalent: <code>=</code> ignores trailing spaces but never prefixes. Any lookup that relied on the FoxPro behaviour becomes <code>LIKE &apos;SM%&apos;</code> in T-SQL or <code>StartsWith</code> in C#, and the ones that relied on it by accident become bugs that the control totals will not catch, because they live in the workflows rather than in the data. Search the old code for <code>SEEK</code> and for <code>=</code> against partial values; the <code>==</code> operator was the exact comparison and can be translated directly.
      </p>

      <h2>Keys and constraints on the way in</h2>
      <p>
        FoxPro tables often have no enforced keys. A candidate index tag stops duplicates on one table, but references between tables are conventions in the code. Loading into SQL Server is the moment to make them real, and the order is: add the primary keys to the final tables before the transform, find the rows a foreign key would reject, decide what to do with them, then add the foreign key with the default check against existing data.
      </p>
      <pre><code>{ORPHANS}</code></pre>
      <p>
        Do not add the constraint <code>WITH NOCHECK</code> to make the load pass. Microsoft&apos;s documentation says plainly that it is not recommended: the existing violations stay, later updates to those rows fail, and the query optimizer ignores a constraint it cannot trust. Orphans are a business question, and the usual answers are a placeholder parent row for genuinely unknown references, or exclusion with a list of what was excluded.
      </p>
      <p>
        Surrogate keys are cheap to add here and expensive later. Give every table an <code>int IDENTITY</code> key, keep the old natural key in a <code>LegacyCode</code> column so reports and people can still find things by it, and resolve child references through the new key in the transform, as the invoice example does.
      </p>

      <h2>A rehearsal checklist</h2>
      <ul>
        <li>The inventory has been taken on a fresh copy, and every <code>.dbf</code> has its <code>.fpt</code> and <code>.cdx</code> beside it where the header says they exist.</li>
        <li>Every column has a row in the type mapping, including a decision on what its empty value means.</li>
        <li>The load runs from one command, with no manual step, and has run end to end at least three times on a full copy.</li>
        <li>Row counts and money sums agree between FoxPro, staging and the final schema, and the comparison query returns no rows.</li>
        <li>Flagged rows are counted per table and the count matches the inventory.</li>
        <li>Rows with accented characters have been checked by eye after the load.</li>
        <li>Every index expression has been read and either reproduced or consciously dropped.</li>
        <li>Every foreign key was added with the default check, and the orphan list from the last rehearsal has an owner.</li>
        <li>The elapsed time of the full load is known, so cutover can be scheduled with a margin.</li>
      </ul>
      <p>
        The wider sequence, from inventory of the workflows to retirement of the old system, is in the <Link href="/articles/visual-foxpro-to-dotnet-migration-guide">migration guide</Link>, and the project this came from is the <Link href="/work/visual-foxpro-to-dotnet-migration">Visual FoxPro to .NET case study</Link>.
      </p>

    </ArticlePage>
  );
}
