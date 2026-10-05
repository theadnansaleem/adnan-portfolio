# Changelog

Versions follow [Semantic Versioning](https://semver.org): major for a redesign or
removed pages, minor for new pages or features, patch for fixes and copy changes.
The version lives in `package.json` and in git tags (`v2.0.0`); it is not shown on the site.

Release with `npm version patch`, `npm version minor` or `npm version major`.
That bumps `package.json`, commits, and tags in one step.

## Unreleased

### Fixed
- Home page H1 no longer reads as one run-on phrase to crawlers.
- Impact headings carry their figure ("~40% faster release cycle"); arrow glyphs are out of heading text.
- Added a skip link, `twitter:site`, a visible "Updated" date in the home footer, and FAQ structured data on `/about`.
- The wordmark's accessible name now matches its visible text.

## 2.3.1 - 2026-10-04

### Changed
- The Qatar Events Platform and Volopa screenshots are blurred: the originals were logged-in views with names and figures.
- Arabic page: clearer wording for front end, back end and migrated workflows.

## 2.3.0 - 2026-10-04

### Added
- `/about`: a scrapbook of sixteen photos, each with a handwritten note and an animated arrow.
- Home page hero: six portraits that swap in place every few seconds, with dots to pick one.

### Changed
- The home page photo row shows the new photos.

### Removed
- The older gallery photos and the photo wall with its viewer.

## 2.2.0 - 2026-10-04

### Removed
- Three photos from the home page row and the `/about` wall.

## 2.1.1 - 2026-10-04

### Fixed
- The recruiter pop-out on the home page no longer covers the certificate list and the footer links.
- Light theme: the "Failed" and "Review" status colours on `/lab` now meet the 4.5:1 contrast minimum.

## 2.1.0 - 2026-10-04

### Added
- `/about`: photo wall with a full-size viewer, quick answers, the route so far, team clocks, a contact card download and a share button.
- Breadcrumb and page structured data on `/about`, `/hire`, `/lab` and `/ar`; language alternates on the home page and in the sitemap.
- Footer links to every top-level page.

## 2.0.0 - 2026-10-04

### Added
- New home page: cutout portrait with cursor reveal, impact numbers, horizontal work rail with quick looks, pinned experience reel, photo row, terminal, command palette.
- `/hire`: recruiter summary with a job-description fit check.
- `/lab`: virtualized 20,000-row table and a simulated real-time feed.
- `/ar`: Arabic page, right to left, with a language toggle in the header.
- Two case studies: evaluation and training interfaces, reusable component libraries.
- Page-change curtain, certificate previews, LinkedIn card, Calendly booking link.

### Changed
- Case study hub and detail pages rebuilt in the new design.

### Removed
- Old sections, navbar, footer, loader, custom cursor and music player, with their media.
- framer-motion, gsap, three and the react-three packages.

## 1.0.0

The original scrolling portfolio with case study pages, Open Graph cards, sitemap and IndexNow.
