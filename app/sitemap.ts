import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/caseStudies";
import { absoluteUrl } from "@/lib/seo";

// Every page we want in search, with the images that belong to it. Legal and checkout pages
// are left out on purpose: they are marked noindex.
const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly"; images?: string[] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly", images: ["/brand/logo.png"] },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/case-studies", priority: 0.8, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/book-a-call", priority: 0.8, changeFrequency: "monthly" },
  { path: "/process", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly", images: ["/brand/founder.png"] },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // The sitemap is built once per deploy, so this is the date the content was last published.
  const lastModified = new Date();
  return [
    ...pages.map(page => ({
      url: absoluteUrl(page.path),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      ...(page.images && { images: page.images.map(image => absoluteUrl(image)) }),
    })),
    ...caseStudies.map(study => ({
      url: absoluteUrl("/case-studies/" + study.slug),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
