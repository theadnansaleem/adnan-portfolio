import type { Metadata } from 'next';
import Link from 'next/link';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('visual-foxpro-forms-to-blazor');
export const metadata: Metadata = articleMetadata(meta);

// Illustrations of the method, not code from any project.
const INVENTORY = `* In Visual FoxPro: a form is a table, one row per object, with its code in METHODS
USE invoice.scx ALIAS scx
SELECT parent, objname, baseclass, methods ;
    FROM scx WHERE NOT EMPTY(methods) ;
    INTO CURSOR formcode
BROWSE   && every event handler on the form, with the object it belongs to`;

const FOXPRO = `* Form.Load: open the table with optimistic table buffering
SET MULTILOCKS ON
USE invoices
=CURSORSETPROP("Buffering", 5, "invoices")

* txtDueDate.Valid: the business rule lives in the control
IF THIS.Value < ThisForm.txtIssued.Value
    MESSAGEBOX("The due date cannot be before the invoice date.")
    RETURN .F.   && focus stays in the field
ENDIF

* cmdSave.Click: commit the buffer, or show why not and undo
IF NOT TABLEUPDATE(.T., .F., "invoices")
    =AERROR(laErr)
    MESSAGEBOX(laErr[2])
    =TABLEREVERT(.T., "invoices")
ENDIF`;

const DOMAIN = `public sealed class Invoice
{
    public int InvoiceId { get; private set; }
    public DateOnly IssuedOn { get; private set; }
    public DateOnly DueOn { get; private set; }
    public decimal Amount { get; private set; }
    public bool Posted { get; private set; }
    [Timestamp] public byte[] RowVersion { get; private set; } = [];

    // Was the Valid code of txtDueDate and txtAmount on the FoxPro form
    public void Reschedule(DateOnly dueOn, decimal amount)
    {
        if (Posted) throw new DomainException("A posted invoice cannot be changed.");
        if (dueOn < IssuedOn) throw new DomainException("The due date cannot be before the invoice date.");
        DueOn = dueOn;
        Amount = amount;
    }
}

// Shape only: what the screen can check without asking the database
public sealed class InvoiceForm
{
    public DateOnly DueOn { get; set; }

    [Range(0.01, 9_999_999.99, ErrorMessage = "Enter an amount above zero.")]
    public decimal Amount { get; set; }

    public static InvoiceForm From(Invoice i) => new() { DueOn = i.DueOn, Amount = i.Amount };
}`;

const PAGE = `@page "/invoices/{Id:int}"
@rendermode InteractiveServer
@inject IDbContextFactory<AppDb> DbFactory

<h1>Invoice @Id</h1>

<EditForm Model="form" OnValidSubmit="SaveAsync">
    <DataAnnotationsValidator />
    <label>Due date <InputDate @bind-Value="form.DueOn" /></label>
    <label>Amount <InputNumber @bind-Value="form.Amount" /></label>
    <ValidationMessage For="() => form.Amount" />
    <button type="submit" disabled="@saving">Save</button>
    <button type="button" @onclick="RevertAsync" disabled="@saving">Revert</button>
</EditForm>

@if (message is not null)
{
    <p role="status">@message</p>
}

@code {
    [Parameter] public int Id { get; set; }
    private InvoiceForm form = new();
    private byte[] version = [];
    private bool saving;
    private string? message;

    protected override Task OnParametersSetAsync() => RevertAsync();

    // TABLEREVERT: throw the edits away and read the row again
    private async Task RevertAsync()
    {
        await using var db = await DbFactory.CreateDbContextAsync();
        var invoice = await db.Invoices.AsNoTracking().SingleAsync(i => i.InvoiceId == Id);
        form = InvoiceForm.From(invoice);
        version = invoice.RowVersion;
        message = null;
    }

    // TABLEUPDATE: one short-lived context per save, checked against the version the user loaded
    private async Task SaveAsync()
    {
        if (saving) return;
        saving = true;
        try
        {
            await using var db = await DbFactory.CreateDbContextAsync();
            var invoice = await db.Invoices.SingleAsync(i => i.InvoiceId == Id);
            db.Entry(invoice).Property(i => i.RowVersion).OriginalValue = version;
            invoice.Reschedule(form.DueOn, form.Amount);
            await db.SaveChangesAsync();
            version = invoice.RowVersion;
            message = "Saved.";
        }
        catch (DbUpdateConcurrencyException)
        {
            message = "Someone else changed this invoice while you were editing it. Revert to see their version.";
        }
        catch (DomainException ex)
        {
            message = ex.Message;
        }
        finally
        {
            saving = false;
        }
    }
}`;

const TESTS = `public class InvoiceRules
{
    // One test per Valid or When handler found in the .scx inventory
    [Fact]
    public void Due_date_before_issue_date_is_refused()
    {
        var invoice = Invoices.Open(issuedOn: new(2026, 3, 1), dueOn: new(2026, 3, 31), amount: 100m);
        var ex = Assert.Throws<DomainException>(() => invoice.Reschedule(new(2026, 2, 28), 100m));
        Assert.Equal("The due date cannot be before the invoice date.", ex.Message);
    }

    [Fact]
    public void Posted_invoice_cannot_be_changed()
    {
        var invoice = Invoices.Posted();
        Assert.Throws<DomainException>(() => invoice.Reschedule(invoice.DueOn, invoice.Amount));
    }
}`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        I migrated 42 financial workflows off Visual FoxPro to C# and .NET Core as the only engineer on the project, with Angular and Blazor on the front end. The data and the reports get most of the attention in a migration like that, and I have written up both. This one is about the part users touch every day: the forms. A FoxPro form is not only a screen. It holds business rules in its event code, and it decides when an edit reaches the table. Both have to land somewhere deliberate in the new system.
      </p>

      <h2>The .scx is a table too</h2>
      <p>
        Microsoft&apos;s Visual FoxPro reference lists the form file, <code>.scx</code>, among the file types that are stored as tables, and says you can browse them like any other table. Each row is one object on the form: the form itself, a text box, a grid column, a button. The <code>METHODS</code> memo holds that object&apos;s event code. So the first step is the same as for reports: query the file instead of clicking through the designer.
      </p>
      <pre><code>{INVENTORY}</code></pre>
      <p>
        Read every row of that cursor and sort the code into three piles. Business rules (a due date cannot precede the invoice date). Screen behaviour (disable a field, move focus, show a total). Data handling (open a table, set buffering, commit, revert). Only the first pile is the expensive one to get wrong, and it is the pile that must not end up in the new screen.
      </p>

      <h2>Map the events, not the controls</h2>
      <p>
        Rebuilding a form control by control produces a FoxPro form in HTML. Map what each event was for instead. These are the equivalents I would start from; they are not one to one, and the table says where they differ.
      </p>
      <div className="hx-prose-table" role="region" aria-label="Visual FoxPro form events and their Blazor equivalents" tabIndex={0}>
        <table>
          <caption>FoxPro form events and where the code goes in Blazor</caption>
          <thead><tr><th scope="col">FoxPro</th><th scope="col">What it was for</th><th scope="col">In Blazor and .NET</th></tr></thead>
          <tbody>
            <tr><td><code>Load</code></td><td>Open tables before any control exists</td><td><code>OnInitializedAsync</code> or <code>OnParametersSetAsync</code>, reading through a service or a short-lived <code>DbContext</code></td></tr>
            <tr><td><code>Init</code></td><td>Set up controls; controls run theirs before the form&apos;s</td><td>Component state set in the same methods; there is no control tree to prepare</td></tr>
            <tr><td><code>Valid</code></td><td>Check a value; returning <code>.F.</code> keeps focus in the control</td><td>The rule goes to the domain model; the form shows the message. Do not trap focus on the web.</td></tr>
            <tr><td><code>When</code></td><td>Decide whether a control may receive focus</td><td>A <code>disabled</code> or <code>readonly</code> attribute computed from state</td></tr>
            <tr><td><code>InteractiveChange</code></td><td>React to each edit</td><td><code>@bind:after</code>, used sparingly</td></tr>
            <tr><td><code>Click</code></td><td>Run a command</td><td><code>@onclick</code>, or the form&apos;s submit handler for Save</td></tr>
            <tr><td><code>Destroy</code>, <code>Unload</code></td><td>Close tables, release objects</td><td><code>IAsyncDisposable</code> on the component, if anything is held at all</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        A typical FoxPro invoice screen, reduced to the three handlers that matter:
      </p>
      <pre><code>{FOXPRO}</code></pre>

      <h2>Validation: rules in the domain, messages in the form</h2>
      <p>
        The <code>Valid</code> handler is where FoxPro applications kept many of their rules, because it was the convenient place. The trouble is that the rule then only runs when someone types into that control. An import, a batch job or a second screen editing the same field skips it. In the new system the rule moves into the entity or domain service, where every path that changes an invoice goes through it, as in <Link href="/articles/ddd-cqrs-blazor-server-entity-framework-core">DDD and CQRS without the ceremony</Link>.
      </p>
      <pre><code>{DOMAIN}</code></pre>
      <p>
        The form keeps only checks about shape: required, a number above zero, a date that parses. Those run in the browser through <code>DataAnnotationsValidator</code> and give instant feedback. Anything that needs other data, such as the invoice date or whether the invoice is posted, is decided by the domain on save, and its message is shown in the form.
      </p>

      <h2>Buffering becomes a unit of work</h2>
      <p>
        With optimistic table buffering (<code>CURSORSETPROP(&quot;Buffering&quot;, 5)</code>), FoxPro keeps edits in a buffer until <code>TABLEUPDATE()</code> commits them or <code>TABLEREVERT()</code> throws them away, and the update fails if another user changed the record in the meantime. That is exactly the behaviour users rely on: edit freely, then Save or Revert. EF Core gives the same three parts.
      </p>
      <ul>
        <li><strong>The buffer</strong> is the form model. Nothing touches the database while the user edits.</li>
        <li><strong>TABLEUPDATE</strong> is a short-lived <code>DbContext</code> from <code>IDbContextFactory</code>, used for one save. Microsoft&apos;s Blazor guidance is a context per operation, not one per circuit.</li>
        <li><strong>The conflict check</strong> is a <code>rowversion</code> column. The page keeps the version it loaded and hands it back as the original value, so <code>SaveChanges</code> throws <code>DbUpdateConcurrencyException</code> if someone else saved first.</li>
      </ul>
      <pre><code>{PAGE}</code></pre>
      <p>
        The conflict message says what happened and what to do. A FoxPro application often showed the raw error from <code>AERROR()</code>, or forced the update with <code>lForce</code>. Forcing is the one behaviour I would not carry over without asking the people who use the screen, because it means the last person to press Save silently wins.
      </p>

      <h2>Grids that edited the table directly</h2>
      <p>
        A FoxPro grid bound to a buffered table lets users edit rows in place, and data-entry staff can be very fast with it. In a web application in-place editing is expensive to build well: keyboard movement between cells, validation per cell, conflicts per row. I would show the list read-only with <code>QuickGrid</code>, as in <Link href="/articles/visual-foxpro-reports-to-blazor-dotnet">the reports article</Link>, and edit one row in a form like the one above. Then watch the people who used the grid. If they really did enter dozens of rows at a sitting, that one screen earns an editable grid; most screens do not.
      </p>

      <h2>Keyboard habits are requirements</h2>
      <p>
        Long-time users of a FoxPro screen work it from the keyboard, and those habits are part of the specification even though no code mentions them. Write them down before the new screen exists. Two that catch people out: in FoxPro, Enter in a text box usually moves to the next field, while in an HTML form it submits; and the tab order of the old form was set deliberately, so match it. Put focus in the first field on load, keep Save reachable without the mouse, and keep the field labels the users already know, even when the column names differ.
      </p>

      <h2>Prove the rules moved</h2>
      <p>
        The inventory from the <code>.scx</code> is the checklist. Every <code>Valid</code> and <code>When</code> handler that carried a business rule gets a test against the domain model, named in the users&apos; words. The tests run without a browser and without a database, which makes them cheap enough to cover every rule.
      </p>
      <pre><code>{TESTS}</code></pre>
      <p>
        Then run the old and new screens side by side on the same records for a week, the same way the <Link href="/articles/visual-foxpro-to-dotnet-migration-guide">migration guide</Link> moves one workflow at a time, and retire the FoxPro form when the people who use it stop opening it.
      </p>

      <h2>Mistakes I would check for first</h2>
      <ul>
        <li><strong>Copying Valid code into the component.</strong> The rule then runs on one screen only. Put it in the domain.</li>
        <li><strong>One DbContext for the life of the page.</strong> On Blazor Server that is one context per circuit, shared by every event. Create one per save.</li>
        <li><strong>No concurrency token.</strong> Two users editing the same invoice is the case table buffering handled for you. Without a <code>rowversion</code>, the second save wins silently.</li>
        <li><strong>Trapping focus until a field is valid.</strong> It worked in FoxPro; on the web it fights screen readers and the browser. Show the message and let the user move on.</li>
        <li><strong>Rebuilding every screen as it was.</strong> Ask what each form is used for now. Some exist only because the old tables needed them.</li>
      </ul>

      <p>
        The tables behind these screens came across as described in <Link href="/articles/visual-foxpro-to-sql-server-data-migration">Visual FoxPro to SQL Server: a repeatable data migration</Link>. Everything on the FoxPro side, including how I work on these projects, is on the <Link href="/visual-foxpro-migration">Visual FoxPro migration page</Link>, and the engagement itself is the <Link href="/work/visual-foxpro-to-dotnet-migration">FoxPro to .NET case study</Link>.
      </p>
    </ArticlePage>
  );
}
