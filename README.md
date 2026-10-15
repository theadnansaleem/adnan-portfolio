This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Portfolio analytics

Set `NEXT_PUBLIC_GA_ID` to the portfolio's GA4 measurement ID in Vercel for Production, then deploy. Leave it unset in Preview to keep review traffic out of production reports. No Vercel custom-event plan is required. Without GA4, downloads and contact links still work.

| Event | Meaning | Parameters |
| --- | --- | --- |
| `cv_download_click` | A CV link or CV command was activated | `source`, `page_path` |
| `contact_click` | Email, booking or LinkedIn was activated | `contact_method` (`email`, `booking`, `linkedin`), `source`, `page_path` |

`source` is `link`, `fit_results`, `command_palette` or `terminal`. New custom events omit URL queries, fragments and referrers, and never include pasted job descriptions, fit scores, skills, link text or email content. The fit checker is also masked for Clarity if that existing optional integration is enabled.

Use these event names in GA4 Realtime and Reports > Engagement > Events. Clicks do not confirm a finished download, sent message or booked call. Enhanced measurement may separately record `file_download` and outbound `click`; do not add those to the custom counts as unique actions. Existing GA4 automatic page-view collection is separate from the sanitization of these custom events.

Run `npm test` with Node.js native TypeScript support for the tracking privacy and failure-handling check.
