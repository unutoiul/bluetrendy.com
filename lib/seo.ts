import type { Metadata } from "next";

// One place for what search engines and social networks are told about the site.

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bluetrendy.com").replace(/\/+$/, "");
export const siteName = "BlueTrendy Intelligence";
export const tagline = "We don’t just build AI. We make AI work for your business.";
/** The four outcomes every page comes back to. */
export const promise = "More revenue. Less work. Faster delivery. Smarter decisions.";
export const homeTitle = "BlueTrendy Intelligence | AI Implementation, Automation & Software";
export const siteDescription =
  "AI implementation, automation and software from a senior London team: AI agents, websites and apps, video, forecasting and marketing automation. Book a free call.";

export const contact = {
  email: "contact@bluetrendy.com",
  telephone: "+447815627527",
  locality: "London",
  country: "GB",
};

/**
 * The company behind the site, as registered at Companies House and HMRC. BlueTrendy
 * Intelligence is its trading name. Shown in the footer and the legal pages, and given to
 * search engines in the layout's structured data.
 */
export const company = {
  legalName: "BlueTrendy Development Ltd",
  number: "08847487",
  jurisdiction: "England and Wales",
  incorporated: "2014-01-16",
  vat: "GB 203 0818 54",
  registeredOffice: { street: "Flat 2, 839 Fulham Road", locality: "London", postcode: "SW6 5HQ", country: "GB" },
};
export const registeredOffice = `${company.registeredOffice.street}, ${company.registeredOffice.locality} ${company.registeredOffice.postcode}`;
/** One sentence naming the company, for the footer and the legal pages. */
export const companyStatement = `${siteName} is a trading name of ${company.legalName}, registered in ${company.jurisdiction}, company number ${company.number}. Registered office: ${registeredOffice}. VAT number ${company.vat}.`;

/** The business's profiles elsewhere, so search engines know they are the same company. */
export const linkedIn = "https://www.linkedin.com/company/bluetrendy";
export const profiles = [linkedIn];
/** The public Trustpilot page where clients read and leave reviews (business.trustpilot.com is only the owner's dashboard). */
export const trustpilot = "https://www.trustpilot.com/review/bluetrendy.com";

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
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: `${siteName}. ${tagline}` };
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
