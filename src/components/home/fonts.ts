import { IBM_Plex_Sans_Arabic, Instrument_Sans, Instrument_Serif } from 'next/font/google';

const sans = Instrument_Sans({ subsets: ['latin'], variable: '--hx-sans', display: 'swap' });
const serif = Instrument_Serif({ weight: '400', style: ['normal', 'italic'], subsets: ['latin'], variable: '--hx-serif', display: 'swap' });
const arabic = IBM_Plex_Sans_Arabic({ weight: ['400', '500', '700'], subsets: ['arabic'], variable: '--hx-arabic', display: 'swap' });

/** Class that exposes --hx-sans and --hx-serif to everything styled by home.css. */
export const hxFonts = `${sans.variable} ${serif.variable}`;
/** Adds --hx-arabic; only the Arabic page loads this font. */
export const hxArabic = arabic.variable;
