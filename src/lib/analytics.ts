export type PortfolioAction = 'cv' | 'email' | 'booking' | 'linkedin';
type ActionSource = 'link' | 'fit_results' | 'command_palette' | 'terminal';

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, parameters: Record<string, string>) => void;
  }
}

export function trackPortfolioAction(action: PortfolioAction, source: ActionSource) {
  if (typeof window === 'undefined') return;
  try {
    window.gtag?.('event', action === 'cv' ? 'cv_download_click' : 'contact_click', {
      source,
      ...(action === 'cv' ? {} : { contact_method: action }),
      page_path: window.location.pathname,
      page_location: window.location.origin + window.location.pathname,
      page_referrer: '',
    });
  } catch {
    // Blocked analytics must never interrupt a download or contact action.
  }
}
