import type { Metadata } from 'next';
import Link from 'next/link';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('rlhf-human-feedback-interface-react');
export const metadata: Metadata = articleMetadata(meta);

// Illustrations of the method, not code from any project.
const TYPES = `/** What the reviewer is shown */
interface ComparisonTask {
  taskId: string;
  prompt: string;
  responses: { id: string; text: string }[]; // two, in a fixed server order
  guidelineVersion: string;
}

/** What the reviewer sends back: enough to audit the judgement later */
interface ComparisonResult {
  taskId: string;
  submissionId: string;             // idempotency key, one per task attempt
  shownLeft: string;                // response id displayed on the left
  preferred: string | 'tie';        // response id, never "left" or "right"
  strength: 1 | 2 | 3;              // slightly, clearly, much better
  scores: Record<string, Record<string, number>>; // response id -> rubric item -> score
  reason: string;
  guidelineVersion: string;
  startedAt: string;
  submittedAt: string;
}`;

const ORDER = `// Decide the order once per task attempt, and record it
function useDisplayOrder(task: ComparisonTask) {
  const [order] = useState(() =>
    Math.random() < 0.5 ? task.responses : [...task.responses].reverse(),
  );
  return { left: order[0], right: order[1], shownLeft: order[0].id };
}`;

const KEYS = `// 1 picks the left response, 2 the right, 0 a tie; never while the reviewer is typing
useWindowEvent('keydown', (e) => {
  const target = e.target as HTMLElement;
  if (target.closest('input, textarea, [contenteditable="true"]')) return;
  if (e.key === '1') setPreferred(left.id);
  if (e.key === '2') setPreferred(right.id);
  if (e.key === '0') setPreferred('tie');
});`;

const DRAFT = `const draftKey = (taskId: string) => \`review-draft:\${taskId}\`;

// Save the draft as the reviewer works, so a reload or a crash costs nothing
useEffect(() => {
  const id = setTimeout(() => {
    try { localStorage.setItem(draftKey(task.taskId), JSON.stringify(draft)); } catch {}
  }, 500);
  return () => clearTimeout(id);
}, [draft, task.taskId]);

// One submission id per attempt: a retry after a timeout is the same submission
const [submissionId] = useState(() => crypto.randomUUID());

async function submit(result: ComparisonResult) {
  const res = await fetch('/api/comparisons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': submissionId },
    body: JSON.stringify(result),
  });
  if (!res.ok) throw new Error('Not saved. Your answer is still here; try again.');
  localStorage.removeItem(draftKey(result.taskId));
}`;

const SERVER = `// Node: store the first result for a submission id, return it again for any retry
app.post('/api/comparisons', async (req, res) => {
  const key = req.get('Idempotency-Key');
  if (!key) return res.status(400).json({ error: 'Idempotency-Key header required' });
  const saved = await db.query(
    \`INSERT INTO comparison_results (submission_id, reviewer_id, task_id, body)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (submission_id) DO NOTHING
     RETURNING submission_id\`,
    [key, req.user.id, req.body.taskId, req.body],
  );
  res.status(saved.rowCount ? 201 : 200).json({ submissionId: key });
});`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        At Turing I built full-stack LLM evaluation and training interfaces and dashboards used by more than 100,000 people, with React, Angular, TypeScript and Node.js, supporting human feedback (RLHF) and data-labeling workflows. A review screen like that looks like a simple form: a prompt, two answers, pick the better one. The engineering is in the details that decide whether the data is any good, and whether reviewers can do the hundredth task as carefully as the first. This is how I would build one.
      </p>

      <h2>What a reviewer actually does</h2>
      <p>
        Most human-feedback work comes in three shapes. Pairwise comparison: two responses to the same prompt, and the reviewer says which is better and by how much. Rubric scoring: one response rated against named criteria such as correctness, instruction following and safety. Rewriting: the reviewer edits a response into the one the model should have given. Comparisons are the core of preference data for RLHF, and a good comparison screen usually includes a small rubric as well, because &quot;A is better&quot; with no reason is hard to audit.
      </p>

      <h2>Store the judgement, not the click</h2>
      <p>
        The record that leaves the screen is the product, so design it first. It needs enough context to be checked months later by someone who never saw the screen.
      </p>
      <pre><code>{TYPES}</code></pre>
      <p>
        Three fields are easy to leave out and expensive to miss. <code>preferred</code> is a response id, never &quot;left&quot;: positions change, ids do not. <code>shownLeft</code> records what the reviewer actually saw. And <code>guidelineVersion</code>, because guidelines change during a project, and results gathered under the old wording may have to be filtered or re-reviewed.
      </p>

      <h2>Randomise the order, then measure it</h2>
      <p>
        If the model&apos;s answer is always on the left, any habit a reviewer has about the left side becomes a preference for that model. So each task attempt gets its own random order, decided once, so it does not flip on a re-render.
      </p>
      <pre><code>{ORDER}</code></pre>
      <p>
        Because <code>shownLeft</code> is stored, the bias can be measured: over a reviewer&apos;s results, how often does the left response win? Far from half, over enough tasks, is a reason to look at that reviewer&apos;s work, and the same number across all reviewers is a check on the screen itself.
      </p>

      <h2>Keyboard first</h2>
      <p>
        Reviewers who do this for hours use the keyboard. Number keys choose, a shortcut submits, and the shortcuts must never fire while the reviewer is typing a reason, or a &quot;2&quot; typed in a sentence changes the answer.
      </p>
      <pre><code>{KEYS}</code></pre>
      <p>
        <code>useWindowEvent</code> is the listener hook from <Link href="/articles/react-custom-hooks-library">the hooks library article</Link>. Make the choice visible too: a selected state that does not depend on colour alone, and the shortcut printed on each button, so it is discoverable without a manual.
      </p>

      <h2>Never lose a reviewer&apos;s work</h2>
      <p>
        A reviewer who loses ten minutes of careful work to a reload rushes the next task. Two things prevent it. The draft is saved locally as they work and restored when the task opens again. And the submit carries an idempotency key, generated once per attempt, so a retry after a timeout cannot record the same judgement twice and skew the counts.
      </p>
      <pre><code>{DRAFT}</code></pre>
      <p>
        The server keeps the first result for a key and answers any retry with the same response:
      </p>
      <pre><code>{SERVER}</code></pre>

      <h2>Render model output safely and readably</h2>
      <p>
        Responses are Markdown with code blocks, tables and sometimes HTML, written by a model that may have been prompted to produce something hostile. Render the Markdown, never raw HTML: <code>react-markdown</code> ignores HTML by default, and that default should stay. Code blocks need a monospace font, horizontal scrolling instead of wrapping, and the language shown. Long responses need both panels to scroll independently, with the prompt pinned, so the reviewer can compare paragraph by paragraph. For rewriting tasks, show a diff of the edit against the original; it is the fastest way for a second reviewer to see what changed.
      </p>

      <h2>Guidelines on the screen, not in a PDF</h2>
      <p>
        Reviewers apply guidelines they can see. Put the rubric definitions next to the scores, as short text with an example for each level, and link the full document. When the guidelines change, bump the version, show the change on the next task, and record the version in every result.
      </p>

      <h2>Quality checks built into the flow</h2>
      <ul>
        <li><strong>Known-answer tasks.</strong> A small share of tasks have an agreed answer. They are mixed in unmarked and scored per reviewer.</li>
        <li><strong>Overlap.</strong> Some tasks go to more than one reviewer, so agreement can be measured per task type, not only per person.</li>
        <li><strong>Time on task.</strong> Recorded, not shown as a countdown. Results far faster than the reading time of both responses are worth a look.</li>
        <li><strong>A required reason</strong> for strong preferences and ties, short enough that it does not become a chore.</li>
      </ul>
      <p>
        The dashboards that sit on top of this data have the same problems as any live dashboard, and the <Link href="/articles/real-time-dashboard-react-websocket">real-time dashboard article</Link> covers them.
      </p>

      <h2>Mistakes I would check for first</h2>
      <ul>
        <li><strong>Storing &quot;left&quot; or &quot;right&quot;.</strong> Store the response id and the order shown.</li>
        <li><strong>A fixed order.</strong> Randomise per attempt, record it, measure it.</li>
        <li><strong>Shortcuts that fire in text fields.</strong> Ignore key events whose target is an input.</li>
        <li><strong>Submit without an idempotency key.</strong> Retries create duplicate judgements, and duplicates bias the dataset.</li>
        <li><strong>Rendering model HTML.</strong> Model output is untrusted input. Render Markdown with HTML off.</li>
        <li><strong>Guidelines without a version.</strong> Results from before and after a change cannot be told apart.</li>
      </ul>

      <p>
        The engagement this comes from is the <Link href="/work/ai-evaluation-training-interfaces">LLM evaluation interfaces case study</Link>. For the other side of the AI work, grounding a model in your own documents, see <Link href="/articles/rag-azure-openai-azure-ai-search-dotnet">RAG in .NET with Azure OpenAI and Azure AI Search</Link>.
      </p>
    </ArticlePage>
  );
}
