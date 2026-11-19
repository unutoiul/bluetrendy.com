import type { Metadata } from "next";
import WebsiteEntrance from "@/components/WebsiteEntrance";
import { homeTitle, pageMetadata, siteDescription } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: homeTitle, absolute: true, description: siteDescription, path: "/" });
import Experience from "@/components/experience/Experience";
import HomeStyles from "@/components/experience/HomeStyles";

// Choose the intro before the first paint on a fresh visit, so the page never flashes behind it.
const prepareHome = `{
  const shell = document.currentScript.parentElement;
  if (!location.hash) {
    let entered = false;
    try { entered = sessionStorage.getItem("bluetrendy:entered") === "1"; } catch {}
    if (!entered) shell.dataset.entryPending = "";
  }
}`;

export default function HomePage() {
  return (
    <div data-studio-home suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: prepareHome }} />
      <HomeStyles />
      <WebsiteEntrance />
      <Experience />
    </div>
  );
}
