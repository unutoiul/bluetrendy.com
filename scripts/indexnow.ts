// Tells Bing, Yandex and the other IndexNow search engines about every page in the live
// sitemap, so they crawl new and changed pages within minutes instead of days.
// Run after a deploy: `npm run indexnow`. Google does not use IndexNow; it reads the
// sitemap through Search Console.
//
// The key file public/<key>.txt proves we own the site, so it must be live before this runs.

import { siteUrl } from "../lib/seo";

const key = "41da4aead659f7ada09fb01bce8752f7";

async function main() {
  const keyLocation = `${siteUrl}/${key}.txt`;
  const keyCheck = await fetch(keyLocation);
  if (!keyCheck.ok || (await keyCheck.text()).trim() !== key) {
    throw new Error(`${keyLocation} is not live yet. Deploy the site first, then run this again.`);
  }

  const sitemap = await (await fetch(`${siteUrl}/sitemap.xml`)).text();
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
    .filter(url => url.startsWith(siteUrl) && !/\.(png|jpe?g|webp|svg)$/i.test(url));
  if (urlList.length === 0) throw new Error("The sitemap lists no pages.");

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(siteUrl).host, key, keyLocation, urlList }),
  });
  // 200 means received; 202 means received and the key is still being checked.
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow answered ${response.status}: ${await response.text()}`);
  }
  console.log(`Sent ${urlList.length} pages to IndexNow (${response.status}):`);
  for (const url of urlList) console.log("  " + url);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
