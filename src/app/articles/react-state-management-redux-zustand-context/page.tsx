import type { Metadata } from 'next';
import Link from 'next/link';
import ArticlePage, { articleMetadata } from '@/components/home/ArticlePage';
import { article } from '@/lib/articles';

const meta = article('react-state-management-redux-zustand-context');
export const metadata: Metadata = articleMetadata(meta);

// Illustrations of each pattern, not code from any project
const QUERY = `import { useQuery } from '@tanstack/react-query';

function Orders({ status }: { status: string }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['orders', status],          // the cache key: same key, same request
    queryFn: () => fetchOrders(status),
  });

  if (isPending) return <p>Loading</p>;
  if (isError) return <p>Could not load orders</p>;
  return <OrderTable rows={data} />;
}`;

const ZUSTAND = `import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

type Filters = {
  range: '24h' | '7d' | '30d';
  region: string;
  setRange: (range: Filters['range']) => void;
  setRegion: (region: string) => void;
};

export const useFilters = create<Filters>()((set) => ({
  range: '7d',
  region: 'all',
  setRange: (range) => set({ range }),
  setRegion: (region) => set({ region }),
}));

function RangeLabel() {
  // Re-renders only when range changes, not when region does
  const range = useFilters((state) => state.range);
  return <span>{range}</span>;
}

function RegionPicker() {
  // Several values at once: useShallow keeps the pair stable between renders
  const [region, setRegion] = useFilters(
    useShallow((state) => [state.region, state.setRegion] as const),
  );
  return <RegionSelect value={region} onChange={setRegion} />;
}`;

const REDUX = `import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

type Cart = { items: { id: string; quantity: number }[] };
const initialState: Cart = { items: [] };

const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    itemAdded: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;        // Immer turns this into an immutable update
      else state.items.push({ id: action.payload, quantity: 1 });
    },
    itemRemoved: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

export const { itemAdded, itemRemoved } = cart.actions;
export const store = configureStore({ reducer: { cart: cart.reducer } });

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();`;

const CONTEXT = `type Auth = { user: User | null; signOut: () => void };
const AuthContext = createContext<Auth | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const signOut = useCallback(() => setUser(null), []);

  // A new object on every render would re-render every consumer; memoize it
  const value = useMemo(() => ({ user, signOut }), [user, signOut]);
  return <AuthContext value={value}>{children}</AuthContext>;
}`;

const URL_STATE = `// Inside a component: the URL already is shared state.
// It survives a reload and can be sent to a colleague.
const [params, setParams] = useSearchParams();
const tab = params.get('tab') ?? 'overview';
const showTab = (next: string) => setParams({ tab: next });`;

export default function Page() {
  return (
    <ArticlePage article={meta}>
      <p>
        I have shipped Redux Toolkit on Qatar&apos;s national event platforms and on a generative AI analytics product, and Zustand on a payments platform. None of them was the wrong pick, because each was chosen for the kind of state it held. The question &quot;Redux or Zustand?&quot; usually has a better question underneath it: who owns this state, and who needs to know when it changes?
      </p>

      <h2>Four kinds of state, not one</h2>
      <p>Most React apps hold four different kinds of state, and each has a natural home:</p>
      <ul>
        <li><strong>Server state.</strong> Data that lives in a database and is only borrowed by the browser: orders, users, search results. It goes stale, needs refetching and is shared by many screens.</li>
        <li><strong>Shared client state.</strong> Data that exists only in the browser but matters to several components: a cart, dashboard filters, a multi-step form in progress.</li>
        <li><strong>Local UI state.</strong> Whether a menu is open, what is typed in an input. One component owns it.</li>
        <li><strong>URL state.</strong> The tab, page or filter a user might bookmark or share.</li>
      </ul>
      <p>
        Most arguments about state libraries come from putting the first kind into a tool built for the second.
      </p>

      <h2>Server state belongs in a cache</h2>
      <p>
        Copying API responses into a global store means writing loading flags, error flags, refetching and invalidation by hand, for every endpoint. A server-state library does that work once. With TanStack Query, the cache key decides when two components share one request:
      </p>
      <pre><code>{QUERY}</code></pre>
      <p>
        Its own documentation is clear that it does not replace client state management. It removes the largest share of what used to sit in Redux, and what is left is usually small. If an app already uses Redux Toolkit, RTK Query does the same job inside the same store.
      </p>

      <h2>Zustand: shared state with little ceremony</h2>
      <p>
        Zustand is a store created with one function. Components subscribe to the slice they select, and re-render only when that slice changes:
      </p>
      <pre><code>{ZUSTAND}</code></pre>
      <p>
        The selector is the part to get right. A selector that builds a new array or object returns a different value every time, so the component re-renders on every store change. In Zustand 5 it can be worse: the library&apos;s migration guide warns that such a selector may cause an infinite loop, which shows up as React&apos;s &quot;Maximum update depth exceeded&quot; error. <code>useShallow</code> compares the contents instead of the reference and fixes both.
      </p>

      <h2>Redux Toolkit: when changes need a paper trail</h2>
      <p>
        Redux Toolkit costs more code than Zustand and buys structure for it. Every change is a named action passing through one reducer, so the Redux DevTools show what happened, in which order, and what the state was after each step. That pays off when many screens write to the same state, or when someone has to explain a state bug from a production report.
      </p>
      <pre><code>{REDUX}</code></pre>
      <p>
        <code>createSlice</code> writes the action creators, and Immer lets reducers look like mutations while producing immutable updates. The typed hooks at the bottom are what the Redux documentation recommends using everywhere instead of plain <code>useDispatch</code> and <code>useSelector</code>.
      </p>

      <h2>Context: for values that rarely change</h2>
      <p>
        Context is not a state manager; it is a way to pass a value down without threading props. When the value changes, React re-renders every component that reads it, and wrapping those components in <code>memo</code> does not stop it. That is exactly right for a theme, a locale or the signed-in user, and expensive for anything that changes on every keystroke.
      </p>
      <pre><code>{CONTEXT}</code></pre>
      <p>
        The <code>useMemo</code> matters. Without it, the provider passes a new object whenever it re-renders, and every consumer re-renders with it even when the user has not changed. The example uses React 19, where the context itself is the provider; on React 18 write <code>AuthContext.Provider</code>.
      </p>

      <h2>Keep shareable state in the URL</h2>
      <p>
        A selected tab or an applied filter that lives only in a store disappears on reload and cannot be sent to a colleague. Search parameters already do both:
      </p>
      <pre><code>{URL_STATE}</code></pre>
      <p>
        The example uses React Router&apos;s hook; Next.js has its own <code>useSearchParams</code> and router for the same job.
      </p>

      <h2>Choosing, in one table</h2>
      <div className="hx-prose-table" role="region" aria-label="Where each kind of React state belongs" tabIndex={0}>
        <table>
          <caption>Where each kind of state belongs</caption>
          <thead><tr><th scope="col">State</th><th scope="col">Start with</th><th scope="col">Why</th></tr></thead>
          <tbody>
            <tr><td>Data from an API</td><td>TanStack Query, or RTK Query on Redux</td><td>Caching, refetching and shared requests come built in.</td></tr>
            <tr><td>Shared client state, many writers</td><td>Redux Toolkit</td><td>Named actions and DevTools history make changes traceable.</td></tr>
            <tr><td>Shared client state, few writers</td><td>Zustand</td><td>Selector subscriptions with very little setup.</td></tr>
            <tr><td>App-wide values that rarely change</td><td>Context</td><td>No library needed; every reader updates together.</td></tr>
            <tr><td>One component&apos;s state</td><td><code>useState</code> or <code>useReducer</code></td><td>Nothing else needs to know.</td></tr>
            <tr><td>Bookmarkable view state</td><td>URL search parameters</td><td>Survives a reload and can be shared.</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Two of these in one app is normal. A server cache plus one small client store covers most products, and the rows above can be adopted one at a time.
      </p>

      <h2>Mistakes I would check for first</h2>
      <ul>
        <li><strong>API data copied into a global store.</strong> It goes stale silently. Move it to a server-state cache and delete the loading flags.</li>
        <li><strong>One large Context holding fast-changing values.</strong> Every consumer re-renders on every change. Split it, or move the fast part to a store with selectors.</li>
        <li><strong>Selectors that build new objects.</strong> Return primitives, or wrap the selector in <code>useShallow</code> in Zustand or <code>createSelector</code> in Redux.</li>
        <li><strong>Derived values stored as state.</strong> A total that is saved next to the items it sums will eventually disagree with them. Compute it in a selector.</li>
        <li><strong>Every keystroke in a global store.</strong> Keep form input local until it is submitted, unless another screen really needs it live.</li>
      </ul>

      <p>
        Large lists are their own problem regardless of where the state lives; <Link href="/articles/react-table-virtualization-20000-rows">rendering 20,000 rows without freezing the page</Link> covers that part.
      </p>
    </ArticlePage>
  );
}
