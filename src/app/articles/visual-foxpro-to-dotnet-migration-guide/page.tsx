import type { Metadata } from 'next';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('visual-foxpro-to-dotnet-migration-guide');
export const metadata: Metadata = articleMetadata(meta);

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

      <h2>4. Put the rules in a domain layer</h2>
      <p>
        Business rules that were scattered across forms belong in one place in the new system: a domain layer in C# that knows nothing about screens or the database. That is what makes the rules testable, and it is what stops the new system from turning into the old one. Entity Framework Core handles ordinary reads and writes. For heavy set-based work, such as period-end calculations over many rows, a stored procedure is often the clearer and faster tool.
      </p>

      <h2>5. Keep data access testable</h2>
      <p>
        Hide the database behind a narrow interface, so domain logic can be tested without one and the stored procedures can be tested against a real one. Financial systems reward this more than most: when a number is questioned, you want a test that reproduces it.
      </p>

      <h2>6. Leave reports until the data is right</h2>
      <p>
        Reports are where users notice differences first, and they depend on everything underneath. Rebuild them after the workflows that feed them, and compare old and new output line by line on the same data. A report that matches is the most convincing evidence that a workflow was migrated correctly.
      </p>

      <h2>7. Migrate one workflow at a time, then retire</h2>
      <p>
        A single big cutover concentrates all the risk in one weekend. Moving one workflow at a time keeps each step small enough to verify and to reverse. Where you can, run old and new side by side for a period and compare results. Retire the old system only when the inventory from step one is fully ticked off.
      </p>

      <h2>What I would tell someone starting</h2>
      <ul>
        <li>Budget more time for understanding than for coding. The rewrite is the easy half.</li>
        <li>Keep a written log of every rule you find and every decision you make. It becomes the specification the old system never had.</li>
        <li>Do not improve behaviour while migrating it. Match first, then change, so a difference always means a bug.</li>
      </ul>
    </ArticlePage>
  );
}
