import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/caseStudies";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bluetrendy.com";

const staticRoutes = [
  "",
  "/services",
  "/case-studies",
  "/process",
  "/pricing",
  "/about",
  "/contact",
  "/book-a-call",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
    url: `${siteUrl}/case-studies/${cs.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...caseStudyEntries];
}
