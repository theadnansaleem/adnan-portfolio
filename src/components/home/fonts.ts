import { Caveat, IBM_Plex_Sans_Arabic, Instrument_Sans, Instrument_Serif } from 'next/font/google';

const sans = Instrument_Sans({ subsets: ['latin'], variable: '--hx-sans', display: 'swap' });
const serif = Instrument_Serif({ weight: '400', style: ['normal', 'italic'], subsets: ['latin'], variable: '--hx-serif', display: 'swap' });
// Not preloaded: each is used on one page only, and preloading put 150 KB of them in front of every page's first paint
const arabic = IBM_Plex_Sans_Arabic({ weight: ['400', '500', '700'], subsets: ['arabic'], variable: '--hx-arabic', display: 'swap', preload: false });
const hand = Caveat({ weight: ['600'], subsets: ['latin'], variable: '--hx-hand', display: 'swap', preload: false });

/** Class that exposes --hx-sans and --hx-serif to everything styled by home.css. */
export const hxFonts = `${sans.variable} ${serif.variable}`;
/** Adds --hx-arabic; only the Arabic page uses this font. */
export const hxArabic = arabic.variable;
/** Adds --hx-hand, the handwriting used for the scrapbook notes; only the about page uses it. */
export const hxHand = hand.variable;
