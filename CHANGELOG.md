# Changelog

Versions follow [Semantic Versioning](https://semver.org): major for a redesign or
removed pages, minor for new pages or features, patch for fixes and copy changes.
The version lives in `package.json` and in git tags (`v2.0.0`); it is not shown on the site.

Release with `npm version patch`, `npm version minor` or `npm version major`.
That bumps `package.json`, commits, and tags in one step.

## 2.13.0 - 2026-10-06

### Added
- A soft highlight follows the pointer across every card, on all pages.
- A reading progress bar along the top of every page outside the home page.
- Rows in lists and quick answers arrive one after another, the figures on `/hire` count up, and buttons press in when clicked.

## 2.12.1 - 2026-10-06

### Fixed
- `/hire`: the job description box of the fit check was invisible, and so were the clocks on `/about`. Since 2.10.0 the scroll animation hid components shared with the home page and never revealed them.

## 2.12.0 - 2026-10-06

### Added
- Experience cards show project previews for the role (Hayya, Qatar Events Platform, Road to Qatar, Volopa, Codex), each linking to its case study, and a link to the case study for the other roles.
- Supreme Committee and TechSurge logos on their cards.

### Fixed
- Experience cards are as tall as their own content and sit centred, so short roles no longer leave a large empty area and long roles are not cut off. On shorter screens the stack tags are dropped from the pinned card, and on very short screens the roles are listed in full.

## 2.11.0 - 2026-10-06

### Added
- Company marks on the experience cards: the Volopa and Turing logos, and initials for the other roles, each animating in with its card.

### Fixed
- The experience card no longer cuts off its last bullet and tags on tall roles: the card is taller, the type scales with screen height, and it scrolls as a last resort.
- Page titles on 15 pages were longer than Google shows; all are now 65 characters or fewer, and the title suffix is "Adnan Saleem".
- Five page descriptions trimmed to 160 characters or fewer.
- Each article now links to the other articles, and each case study links to the article written about it. Articles were reachable from one page only.

## 2.10.0 - 2026-10-06

### Added
- Every page outside the home page now animates as you scroll: sections and cards rise in, and headline figures count up.
- The pipeline diagrams light each step as the dot reaches it, the harness terminal types its lines in, cards lift on hover and tool logos turn.
- Quick answers on `/ai-engineer` and `/azure-developer`, also published as FAQ structured data for search and AI assistants.

### Fixed
- The tool card styles no longer share a class name with the header buttons.

## 2.9.0 - 2026-10-05

### Added
- `/ai-engineer`: three headline numbers, an animated six-step pipeline, a terminal view of the harness, and dates on the timeline.
- `/azure-developer`: service cards and a commit-to-production flow.
- Home page: two cards that lead to the AI and Azure pages.

## 2.8.0 - 2026-10-05

### Added
- `/ai-engineer`: the AI models and tools I work with, my agent harness, and my LLM evaluation and integration work.
- `/azure-developer`: Azure experience, services and the platforms it was used on.
- Microsoft Azure services in the skills list.

## 2.7.0 - 2026-10-05

### Changed
- The colour theme follows the visitor's system setting by default. A choice made with the toggle still wins, and toggling back to the system's theme hands control back to the system.
- The browser bar colour and native controls match the active theme.

## 2.6.1 - 2026-10-05

### Changed
- Header: Case studies, Articles and About are in the top menu on the home page, and Articles on every other page.
- The phone menu lists the pages as well as the home page sections, and opens below 1240px so the link row never crowds.

- Hover feedback on links across the site: list rows ease right and show an arrow, case study cards respond, and text links, quick answers and footer links change smoothly.
- Article and case study rows are clickable across their full width.

### Fixed
- The arrow before the email, GitHub and CV links in the phone menu no longer shows as an empty box.
- No stray rule above the first row of the article list and the role page lists.

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
