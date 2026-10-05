# Changelog

Versions follow [Semantic Versioning](https://semver.org): major for a redesign or
removed pages, minor for new pages or features, patch for fixes and copy changes.
The version lives in `package.json` and in git tags (`v2.0.0`); it is not shown on the site.

Release with `npm version patch`, `npm version minor` or `npm version major`.
That bumps `package.json`, commits, and tags in one step.

## 2.6.1 - 2026-10-05

### Changed
- Header: Case studies, Articles and About are in the top menu on the home page, and Articles on every other page.
- The phone menu lists the pages as well as the home page sections, and opens below 1240px so the link row never crowds.

### Fixed
- The arrow before the email, GitHub and CV links in the phone menu no longer shows as an empty box.

## 2.6.0 - 2026-10-05

### Added
- Three more articles: Core Web Vitals in a React app, role-based access control with data redaction in ASP.NET Core, and a React dashboard on a WebSocket feed.

## 2.5.0 - 2026-10-05

### Added
- `/articles`: three write-ups (Module Federation micro frontends, rendering 20,000 rows in React, migrating Visual FoxPro to .NET), each linked to its case study.

## 2.4.0 - 2026-10-05

### Added
- `/frontend-developer` and `/dotnet-developer`: role pages that list the CV bullets, skills and case studies matching each role.

### Changed
- The site description now says "full-stack developer" as well as "software engineer".

### Fixed
- Home page H1 no longer reads as one run-on phrase to crawlers.
- Impact headings carry their figure ("~40% faster release cycle"); arrow glyphs are out of heading text.
- Added a skip link, `twitter:site`, a visible "Updated" date in the home footer, and FAQ structured data on `/about`.
- The wordmark's accessible name now matches its visible text.
- Alt text on project screenshots and certificate previews; each hero portrait is described while it shows.
- `/llms.txt`: a plain-text map of the site built from the same data as the pages.
- Two more quick answers on `/about` (stack and availability).
- Faster first paint: the Arabic and handwriting fonts are no longer preloaded on pages that do not use them.

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
