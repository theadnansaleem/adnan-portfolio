# theadnansaleem.com

Source for [theadnansaleem.com](https://theadnansaleem.com), the portfolio of M. Adnan Saleem, senior full-stack software engineer: React, Next.js, Angular and TypeScript over .NET and Node.js.

The site is statically generated with the Next.js App Router. Every page is built from a few typed data files that mirror the CV, so a case study or a role page cannot claim something the CV does not.

## What is on it

| Path | What it is |
| --- | --- |
| `/` | Summary, impact, selected work, experience, stack, an in-page terminal and contact |
| `/work`, `/work/<slug>` | Case studies of production work, each built from CV bullets |
| `/articles`, `/articles/<slug>` | Technical articles written from that work, grouped by topic, with an RSS feed at `/feed.xml` |
| `/lab` | Live demos: table virtualization, a real-time dashboard, tiered data redaction, error boundaries and Core Web Vitals |
| `/hire` | Facts for recruiters, and a fit check that compares a pasted job description with the CV without leaving the browser |
| `/frontend-developer`, `/dotnet-developer`, `/ai-engineer`, `/azure-developer`, `/visual-foxpro-migration` | The CV bullets, skills, case studies and articles that belong to one role |
| `/about`, `/certifications`, `/ar` | Background, credentials with issuer links, and an Arabic version |

A command palette (Cmd+K or Ctrl+K) searches every page, case study and article.

## How it is put together

- `src/lib/data.ts` mirrors the CV: profile, jobs, projects, skills, education and certifications. Content changes go into the CV first, then here.
- `src/lib/case-studies.ts` builds each case study from those CV bullets. `pick()` throws at build time if a bullet it relies on has been reworded, so a case study cannot drift from the CV unnoticed.
- `src/lib/roles.ts` defines each role page as a pattern over the CV bullets, plus the case studies and articles that go with it.
- `src/lib/articles.ts` holds the article metadata: topic, tags and quick answers. The body of each article is `src/app/articles/<slug>/page.tsx`.
- `src/components/home/` holds the shared page frame, the article and role page templates, and the lab demos.

## Search and sharing

- JSON-LD on every page: `Person` and `WebSite` site-wide, `ProfilePage` on the home page, `TechArticle` on articles, and `BreadcrumbList` and `FAQPage` where they apply.
- `sitemap.xml`, `robots.txt`, `feed.xml` and `llms.txt` are generated from the same data files.
- Share images are rendered at build time with `next/og`: one for the site, one per case study and one per article.
- `npm run indexnow` submits the sitemap URLs to IndexNow after a deploy.

## Run it

Node.js 20.9 or later.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build, every page prerendered
npm run lint
npx tsc --noEmit
npm test           # needs Node.js 22.18 or later, which runs the TypeScript it imports
```

## Stack

Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4 with CSS variables for the light and dark themes. Lenis handles smooth scrolling. Deployed on Vercel.

## Releases

Versions follow [Semantic Versioning](https://semver.org), and every release is described in [CHANGELOG.md](CHANGELOG.md).

## Portfolio analytics

Set `NEXT_PUBLIC_GA_ID` to the portfolio's GA4 measurement ID in Vercel for Production, then deploy. Leave it unset in Preview to keep review traffic out of production reports. No Vercel custom-event plan is required. Without GA4, downloads and contact links still work.

| Event | Meaning | Parameters |
| --- | --- | --- |
| `cv_download_click` | A CV link or CV command was activated | `source`, `page_path` |
| `contact_click` | Email, booking or LinkedIn was activated | `contact_method` (`email`, `booking`, `linkedin`), `source`, `page_path` |

`source` is `link`, `fit_results`, `command_palette` or `terminal`. New custom events omit URL queries, fragments and referrers, and never include pasted job descriptions, fit scores, skills, link text or email content. The fit checker is also masked for Clarity if that existing optional integration is enabled.

Use these event names in GA4 Realtime and Reports > Engagement > Events. Clicks do not confirm a finished download, sent message or booked call. Enhanced measurement may separately record `file_download` and outbound `click`; do not add those to the custom counts as unique actions. Existing GA4 automatic page-view collection is separate from the sanitization of these custom events.

Run `npm test` with Node.js native TypeScript support for the tracking privacy and failure-handling check.
