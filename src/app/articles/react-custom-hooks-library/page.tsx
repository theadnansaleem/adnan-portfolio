import type { Metadata } from 'next';
import Link from 'next/link';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('react-custom-hooks-library');
export const metadata: Metadata = articleMetadata(meta);

// Illustrations of the method, not code from any project.
const DEBOUNCE = `import { useEffect, useState } from 'react';

/** The value, once it has stopped changing for \`delay\` milliseconds. */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}`;

const MEDIA = `import { useCallback, useSyncExternalStore } from 'react';

/** Whether a media query matches, kept in sync with the browser. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue, // what the server renders, before the browser can answer
  );
}`;

const LISTENER = `import { useEffect, useEffectEvent } from 'react';

/** Listen to a window event with the latest handler, without re-subscribing on every render. */
export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
) {
  const onEvent = useEffectEvent(handler);
  useEffect(() => {
    const listener = (event: WindowEventMap[K]) => onEvent(event);
    window.addEventListener(type, listener);
    return () => window.removeEventListener(type, listener);
  }, [type]);
}

// In a component: the handler reads current state, and the listener is added once
useWindowEvent('keydown', (e) => {
  if (e.key === 'Escape' && open) setOpen(false);
});`;

const TEST = `import { act, renderHook } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

afterEach(() => vi.useRealTimers());

test('returns the last value once typing stops', () => {
  vi.useFakeTimers();
  const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
    initialProps: { value: 'a' },
  });

  rerender({ value: 'ab' });
  rerender({ value: 'abc' });
  expect(result.current).toBe('a'); // nothing yet: still typing

  act(() => vi.advanceTimersByTime(300));
  expect(result.current).toBe('abc'); // one update, with the final value
});`;

const README = `## useDebouncedValue(value, delay = 300)

Returns \`value\` once it has stopped changing for \`delay\` ms.
Use it for: search boxes, filters, anything that triggers a request per keystroke.
Not for: rate-limiting clicks (disable the button instead).

const query = useDebouncedValue(input, 300);
const results = useSearch(query);`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        On a cybersecurity platform at Primary Target, I built an internal custom hooks library and component system that standardized patterns across the frontend team, and it improved delivery velocity by approximately 30%. This is how I would build one again, with the React 19 APIs that make several of the old hand-written hooks unnecessary.
      </p>

      <h2>What earns a place in the library</h2>
      <p>
        A shared hook has a cost: everyone has to learn it, and every change to it reaches every screen. So the bar is higher than &quot;someone wrote this twice&quot;. I would add a hook when all three hold.
      </p>
      <ul>
        <li><strong>It has been written at least three times</strong> in the codebase, in slightly different ways.</li>
        <li><strong>The hand-written versions have a bug in common</strong>: a missing cleanup, a stale closure, a listener added on every render, a request whose answer arrives after a newer one.</li>
        <li><strong>It does one job</strong> and its name says what it returns.</li>
      </ul>
      <p>
        Equally useful is the list of what stays out. Data fetching is the main one: a cache library such as TanStack Query already solves request deduplication, races and refetching, and a home-made <code>useFetch</code> solves them worse. The same goes for global state, which belongs in a store, as I argue in <Link href="/articles/react-state-management-redux-zustand-context">where React state belongs</Link>. A hook that wraps one other hook and renames it is not worth an import either.
      </p>

      <h2>Start with the hooks people get wrong</h2>
      <p>
        The first hooks in the library should be the ones whose hand-written versions are subtly broken. A debounced value is the usual first: written inline, it often forgets to clear the timer, and the result is a request for every keystroke anyway.
      </p>
      <pre><code>{DEBOUNCE}</code></pre>
      <p>
        Small, but every copy that is replaced by this one is a copy that cannot drift.
      </p>

      <h2>Browser state: useSyncExternalStore</h2>
      <p>
        Media queries, online status, the visibility of the tab, values in <code>localStorage</code>: anything the browser owns is an external store, and React has had a hook for reading one since React 18. The common hand-written version, a <code>useState</code> plus a <code>useEffect</code> that subscribes, renders once with the wrong value and can tear during concurrent rendering. <code>useSyncExternalStore</code> does neither, and its third argument says what the server should render.
      </p>
      <pre><code>{MEDIA}</code></pre>
      <p>
        <code>subscribe</code> is wrapped in <code>useCallback</code> because React re-subscribes whenever that function changes identity. Without it, the listener is removed and added again on every render.
      </p>

      <h2>Event handlers that see current state: useEffectEvent</h2>
      <p>
        The other classic bug is the stale closure: an effect that adds a listener captures the state from the render it ran in. The usual fixes were to list the state as a dependency, re-adding the listener on every change, or to keep the handler in a ref. React 19.2 made <code>useEffectEvent</code> stable, and it is the built-in answer: a function that always sees the latest props and state, and that does not belong in the dependency list.
      </p>
      <pre><code>{LISTENER}</code></pre>
      <p>
        This is one of the hooks that lets a library shrink. A <code>useLatest</code> or <code>useEventCallback</code> written with refs can be retired once the codebase is on React 19.2.
      </p>

      <h2>Rules every hook follows</h2>
      <ul>
        <li><strong>The name starts with use.</strong> The <code>eslint-plugin-react-hooks</code> rules only check functions named that way, and they are the cheapest reviewer the library has.</li>
        <li><strong>Everything it starts, it stops.</strong> Timers, listeners, subscriptions and sockets are cleaned up in the effect that created them. The <Link href="/articles/real-time-dashboard-react-websocket">real-time dashboard article</Link> has a WebSocket hook that follows the same rule.</li>
        <li><strong>Return values are stable.</strong> A function a hook returns should keep its identity between renders, or every effect that depends on it re-runs.</li>
        <li><strong>No hidden global state.</strong> Two components using the same hook get two independent copies, unless the hook is explicitly reading a shared store.</li>
        <li><strong>SSR is decided, not discovered.</strong> If the hook touches <code>window</code>, it says what the server renders.</li>
      </ul>

      <h2>Test hooks without a screen</h2>
      <p>
        <code>renderHook</code> from React Testing Library mounts a hook on its own, and fake timers make time-based hooks deterministic. Each hook gets a test for the behaviour people actually depend on, here that a burst of changes produces one update with the final value.
      </p>
      <pre><code>{TEST}</code></pre>

      <h2>Make it easy to find</h2>
      <p>
        A hook nobody knows about gets written again. Each one gets a short entry next to its code: what it returns, when to use it, when not to, and a two-line example. The &quot;not for&quot; line does more work than the rest; it stops the hook being stretched into something it was not designed to do.
      </p>
      <pre><code>{README}</code></pre>
      <p>
        Two habits keep the library healthy. In code review, a hand-written version of something the library already has gets a link to the library rather than a comment on the bug. And a hook is deprecated, with its replacement named, for a release before it is deleted.
      </p>

      <h2>How to tell it is working</h2>
      <ul>
        <li><strong>The copies go away.</strong> Search the codebase for <code>setTimeout</code> inside effects, or <code>matchMedia</code> outside the library. The count should fall release by release.</li>
        <li><strong>Review comments change.</strong> Fewer comments about cleanup and stale state, because those bugs no longer get written by hand.</li>
        <li><strong>New screens start faster.</strong> A feature that used to begin by copying a hook from another screen, and fixing it, begins with an import.</li>
      </ul>

      <h2>Mistakes I would check for first</h2>
      <ul>
        <li><strong>A useFetch hook.</strong> Use a query cache. Requests need deduplication, cancellation and race handling, and those are solved problems.</li>
        <li><strong>Hooks with options for everything.</strong> Five boolean parameters mean five hooks pretending to be one. Split them.</li>
        <li><strong>useState plus useEffect for browser state.</strong> Use <code>useSyncExternalStore</code>.</li>
        <li><strong>Refs to dodge the dependency list.</strong> On React 19.2, <code>useEffectEvent</code> says what you mean.</li>
        <li><strong>No tests, because the hooks are small.</strong> Small and shared is exactly when a bug reaches every screen at once.</li>
      </ul>

      <p>
        The platform this library was written for is the <Link href="/work/codex-vehicle-cybersecurity-platform">vehicle cybersecurity case study</Link>.
      </p>
    </ArticlePage>
  );
}
