// Pings IndexNow (Bing, Yandex, Seznam, Naver) with every URL in the sitemap.
// Google does not support IndexNow; use Search Console for Google.
// Usage: node scripts/indexnow.mjs
import { readdir } from "node:fs/promises";

const HOST = "theadnansaleem.com";
const SITEMAP = `https://${HOST}/sitemap.xml`;

const keyFile = (await readdir("public")).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("indexnow: no key file in public/");
const key = keyFile.replace(".txt", "");

const sitemap = await fetch(SITEMAP).then((r) => r.text());
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error("indexnow: sitemap had no URLs");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${keyFile}`,
    urlList,
  }),
});

console.log(`IndexNow ${res.status} ${res.statusText} for ${urlList.length} URLs`);
console.log(urlList.join("\n"));
if (!res.ok) process.exitCode = 1;
