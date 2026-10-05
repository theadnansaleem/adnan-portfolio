import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import RolePage, { roleMetadata } from '@/components/home/RolePage';
import { roles } from '@/lib/roles';

export const metadata: Metadata = roleMetadata(roles.ai);

// [figure, label, where it comes from]
const NUMBERS = [
  ['100,000+', 'people used the interfaces', 'Evaluation and training interfaces for large language models, built at Turing in 2020 and 2021.'],
  ['3', 'national platforms with GPT', 'Azure OpenAI integrations across the APIs and data contracts of Qatar\'s government event platforms.'],
  ['6', 'model families in daily use', 'Claude, Codex, Gemini, Kimi, DeepSeek and Groq, run through a harness I built myself.'],
];

// [logo file in /public/ai, name, maker, what it is for me]
const TOOLS = [
  ['claude', 'Claude', 'Anthropic', 'My main coding agent. Claude Code runs inside my own harness for planning, implementation and review.'],
  ['codex', 'Codex', 'OpenAI', 'A second reviewer. It makes an independent pass over a finished change before it ships.'],
  ['gemini', 'Gemini', 'Google', 'A second opinion from a different model family, read-only, on the same change.'],
  ['kimi', 'Kimi', 'Moonshot AI', 'Long-context models from Moonshot AI.'],
  ['deepseek', 'DeepSeek', 'DeepSeek', 'Reasoning and coding models from DeepSeek.'],
  ['groq', 'Groq', 'Groq', 'Very fast inference for open models.'],
];

// [step, what happens, logos of the models on that step]
const FLOW: [string, string, string[]][] = [
  ['Ticket', 'I write what has to change and why.', []],
  ['Investigate', 'The agent reads the code and the callers before it proposes anything.', ['claude']],
  ['Implement', 'The smallest correct change, on its own branch.', ['claude']],
  ['Verify', 'Type checks, lint, the build and a browser check all run.', []],
  ['Review', 'A second agent attacks the finished change, with outside opinions.', ['codex', 'gemini']],
  ['Approve', 'I read it and approve it. Merges and deploys stay with me.', []],
];

const HARNESS = [
  ['Guard hooks', 'Destructive git and cloud commands are blocked before they run, so an agent cannot force push, delete a branch or change infrastructure.'],
  ['Agents with separate jobs', 'One agent implements a ticket, another attacks the finished change as a reviewer, and nothing ships without my approval.'],
  ['Memory per project', 'Every repository keeps its own notes and decisions. One client\'s context is never used for another.'],
  ['Evidence before done', 'Type checks, lint, the build and a browser check run before a change is called finished.'],
];

export default function AiEngineerPage() {
  return (
    <RolePage role={roles.ai}>
      <ul className="hx-grid-3">
        {NUMBERS.map(([figure, label, note]) => (
          <li key={label} className="hx-card">
            <h3><strong>{figure}</strong> {label}</h3>
            <p>{note}</p>
          </li>
        ))}
      </ul>

      <section className="hx-lab is-stacked">
        <div>
          <p className="hx-cap"><b>AI</b> Models and tools</p>
          <h2>What I work with every day</h2>
          <p>Six model families, each used where it is strongest.</p>
        </div>
        <ul className="hx-grid-3 hx-tools">
          {TOOLS.map(([file, name, maker, note]) => (
            <li key={file} className="hx-card">
              <Image src={`/ai/${file}.svg`} alt="" width={48} height={48} unoptimized />
              <h3>{name}</h3>
              <p>{note}</p>
              <p className="hx-cap">{maker}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="hx-lab is-stacked">
        <div>
          <p className="hx-cap"><b>AI</b> The pipeline</p>
          <h2>How a change ships</h2>
          <p>Every change takes the same six steps. The agents do the typing; the checks and the approval do not move.</p>
        </div>
        <ol className="hx-flow hx-card">
          {FLOW.map(([step, note, logos]) => (
            <li key={step}>
              <strong>{step}</strong>
              <span>{note}</span>
              {logos.length > 0 && (
                <span className="hx-flow-logos">
                  {logos.map((file) => <Image key={file} src={`/ai/${file}.svg`} alt={file} width={24} height={24} unoptimized />)}
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="hx-lab">
        <div>
          <p className="hx-cap"><b>AI</b> My harness</p>
          <h2>Agents I built, rules I set</h2>
          <p>I built my own harness and agents and use them for my daily work. Speed comes from the agents; accuracy comes from the checks around them.</p>
        </div>
        <div className="hx-stack">
          <div className="hx-term" role="img" aria-label="Terminal: a force push is blocked by a guard hook, then type check, lint and build pass.">
            <div className="hx-term-bar" aria-hidden="true"><i /><i /><i /><span>harness</span></div>
            <div className="hx-term-log is-static" aria-hidden="true">
              <div className="is-cmd">$ git push --force origin main</div>
              <div>✗ blocked by git-guard: force push is not the agent&apos;s to run</div>
              <div className="is-cmd">$ npx tsc --noEmit &amp;&amp; npm run lint &amp;&amp; npm run build</div>
              <div>✓ types   ✓ lint   ✓ build</div>
              <div className="is-cmd">$ review --adversarial</div>
              <div>✓ diff read hunk by hunk, ready for approval</div>
            </div>
          </div>
          <div className="hx-facts hx-card">
            <ol>
              {HARNESS.map(([title, note]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{note}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="hx-lab">
        <div>
          <p className="hx-cap"><b>AI</b> Since 2020</p>
          <h2>Training and evaluating models early</h2>
        </div>
        <div className="hx-facts hx-card">
          <ol>
            <li>
              <span className="hx-cap">2020 to 2021</span>
              <strong>Turing</strong>
              <span>Built the evaluation and training interfaces people used to give feedback and label data for large language models of the GPT-3 generation, used by 100,000+ people and deployed on AWS. ChatGPT launched about a year after this work ended. Details in the <Link href="/work/ai-evaluation-training-interfaces">case study</Link>.</span>
            </li>
            <li>
              <span className="hx-cap">LLaMA 2 and early LLaMA 3</span>
              <strong>Meta LLaMA</strong>
              <span>Training, fine-tuning, alignment and evaluation tooling, with human feedback collection interfaces for ML researchers.</span>
            </li>
            <li>
              <span className="hx-cap">2025 to 2026</span>
              <strong>Azure OpenAI in production</strong>
              <span>GPT integrations across the APIs and data contracts of three national platforms in Qatar.</span>
            </li>
          </ol>
        </div>
      </section>
    </RolePage>
  );
}
