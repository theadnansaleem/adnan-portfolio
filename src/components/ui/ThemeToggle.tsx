/**
 * The active theme lives on <html data-theme>, so toggling needs no React
 * state: CSS shows the matching icon (.theme-sun / .theme-moon in globals.css)
 * and the choice is remembered for the next visit. With nothing remembered,
 * the inline script in layout.tsx follows the system setting.
 */
export function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try {
    // Toggling back to what the system asks for hands control back to the system
    const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    if (next === system) localStorage.removeItem('theme');
    else localStorage.setItem('theme', next);
  } catch {
    // Private mode / blocked storage — the swap still applies for this session.
  }
}
