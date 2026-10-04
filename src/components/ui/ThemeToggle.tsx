/**
 * The active theme lives on <html data-theme>, so toggling needs no React
 * state: CSS shows the matching icon (.theme-sun / .theme-moon in globals.css)
 * and the choice is remembered for the next visit.
 */
export function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    // Private mode / blocked storage — the swap still applies for this session.
  }
}
