import assert from 'node:assert/strict';
import { test } from 'node:test';
import { trackPortfolioAction } from '../src/lib/analytics.ts';

test('tracks allowlisted actions without URL secrets and never blocks navigation', () => {
  assert.doesNotThrow(() => trackPortfolioAction('cv', 'link'));
  const calls = [];
  globalThis.window = {
    location: {
      origin: 'https://theadnansaleem.com',
      pathname: '/hire',
      search: '?job_description=private-details',
      hash: '#private-details',
    },
  };

  try {
    assert.doesNotThrow(() => trackPortfolioAction('email', 'fit_results'));
    window.gtag = (...args) => calls.push(args);
    for (const action of ['cv', 'email', 'booking', 'linkedin']) {
      trackPortfolioAction(action, 'fit_results');
    }
    assert.deepEqual(calls, ['cv', 'email', 'booking', 'linkedin'].map((action) => [
      'event', action === 'cv' ? 'cv_download_click' : 'contact_click', {
        source: 'fit_results',
        ...(action === 'cv' ? {} : { contact_method: action }),
        page_path: '/hire',
        page_location: 'https://theadnansaleem.com/hire',
        page_referrer: '',
      },
    ]));
    assert.equal(JSON.stringify(calls).includes('private-details'), false);
    window.gtag = () => { throw new Error('Analytics blocked'); };
    assert.doesNotThrow(() => trackPortfolioAction('booking', 'link'));
  } finally {
    delete globalThis.window;
  }
});
