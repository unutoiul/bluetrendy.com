import type { Metadata } from "next";

// One place for what search engines and social networks are told about the site.

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bluetrendy.com").replace(/\/+$/, "");
export const siteName = "BlueTrendy Intelligence";
export const tagline = "Your Business, powered by AI";
export const homeTitle = "BlueTrendy Intelligence | AI Agents, Software & Apps, London";
export const siteDescription =
  "London software and AI team building AI agents, custom software, websites and mobile apps. Senior engineers, a first release in days. Book a free call.";

export const contact = {
  email: "contact@bluetrendy.com",
  telephone: "+447815627527",
  locality: "London",
  country: "GB",
};

/** The business's profiles elsewhere, so search engines know they are the same company. */
export const profiles = ["https://www.linkedin.com/company/bluetrendy"];

/** Stable ids, so every page's structured data points at the same organisation and website. */
export const ids = {
  organization: `${siteUrl}/#organization`,
  website: `${siteUrl}/#website`,
  founder: `${siteUrl}/about#founder`,
};

/** The organisation, named in full, for structured data on any page. */
export const organizationRef = { "@type": "Organization", "@id": ids.organization, name: siteName, url: siteUrl };

export const absoluteUrl = (path = "/") => new URL(path, siteUrl + "/").href;

type PageSeo = {
  /** The page's own title. The layout adds " | BlueTrendy"; pass `absolute` to skip that. */
  title: string;
  absolute?: boolean;
  description: string;
  /** Path from the site root, such as "/services". */
  path: string;
  type?: "website" | "article";
};

/**
 * Title, description, canonical URL and the share card for one page. Child segments replace
 * the layout's `openGraph` and `twitter` objects wholesale, so each page sets its own.
 */
export function pageMetadata({ title, absolute = false, description, path, type = "website" }: PageSeo): Metadata {
  const fullTitle = absolute ? title : `${title} | BlueTrendy`;
  const snippet = clip(description);
  // A page's own openGraph replaces the layout's, file-based share image included, so name it here.
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: `${siteName}. Custom software, delivered 10x faster.` };
  return {
    title: absolute ? { absolute: title } : title,
    description: snippet,
    alternates: { canonical: path },
    openGraph: { type, url: path, siteName, locale: "en_GB", title: fullTitle, description: snippet, images: [image] },
    twitter: { card: "summary_large_image", title: fullTitle, description: snippet, images: [image] },
  };
}

/** Google shows about 155–160 characters of a description; cut longer ones at a word. */
function clip(text: string, limit = 158) {
  if (text.length <= limit) return text;
  return text.slice(0, text.lastIndexOf(" ", limit - 1)).replace(/[,;:.\s]+$/, "") + "…";
}

/** Questions and answers shown on the page, so assistants and search can quote them. */
export function faqPage(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(item => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

type Crumb = { name: string; path: string };

/** A breadcrumb trail from the home page, for the result's URL line in Google. */
export function breadcrumbs(trail: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
