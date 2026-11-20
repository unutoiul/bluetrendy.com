import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import ThemeRegistry from "@/theme/ThemeRegistry";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import Panel3D from "@/components/motion/Panel3D";
import ConsentAnalytics from "@/components/analytics/ConsentAnalytics";
import Arrival from "@/components/analytics/Arrival";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, company, contact, homeTitle, ids, profiles, siteDescription, siteName, siteUrl, tagline } from "@/lib/seo";

const geist = localFont({
  src: "../public/fonts/geist-latin.woff2",
  variable: "--font-sans",
  weight: "100 900",
  style: "normal",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  preload: false,
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteTitle = homeTitle;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | BlueTrendy",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "AI implementation",
    "AI agents",
    "agentic AI",
    "business automation",
    "predictive AI",
    "AI marketing automation",
    "AI video production",
    "AI website development",
    "mobile app development",
    "AI consultancy London",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  openGraph: {
    type: "website",
    siteName,
    locale: "en_GB",
    title: siteTitle,
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  // Let Google show large image previews and full-length snippets.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Ownership checks: the tokens from Google Search Console's and Bing Webmaster Tools' "HTML tag" methods.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION && { google: process.env.GOOGLE_SITE_VERIFICATION }),
    ...(process.env.BING_SITE_VERIFICATION && { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }),
  },
};

// Who we are, for search engines and AI assistants: the business behind every page, and the site's name.
const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": ids.organization,
      name: siteName,
      alternateName: "BlueTrendy",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo.png"), width: 1320, height: 322 },
      image: absoluteUrl("/brand/logo.png"),
      description: siteDescription,
      slogan: tagline,
      sameAs: profiles,
      email: contact.email,
      telephone: contact.telephone,
      legalName: company.legalName,
      foundingDate: company.incorporated,
      vatID: company.vat.replace(/\s/g, ""),
      identifier: { "@type": "PropertyValue", propertyID: "Companies House company number", value: company.number },
      address: {
        "@type": "PostalAddress", streetAddress: company.registeredOffice.street, addressLocality: company.registeredOffice.locality,
        postalCode: company.registeredOffice.postcode, addressCountry: company.registeredOffice.country,
      },
      areaServed: { "@type": "Country", name: "United Kingdom" },
      founder: { "@type": "Person", "@id": ids.founder, name: "Lucas Franco", jobTitle: "Founder and lead engineer" },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: contact.email,
        telephone: contact.telephone,
        areaServed: "GB",
        availableLanguage: "English",
      },
      knowsAbout: [
        "AI implementation", "AI agents", "Agentic AI", "Business automation", "Predictive AI and forecasting",
        "Marketing automation", "AI-assisted software development", "Web and mobile app development", "Video production",
      ],
    },
    {
      "@type": "WebSite",
      "@id": ids.website,
      url: siteUrl,
      name: siteName,
      alternateName: "BlueTrendy",
      description: siteDescription,
      inLanguage: "en-GB",
      publisher: { "@id": ids.organization },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${geist.variable} ${jetbrainsMono.variable}`}>
      <body>
        <JsonLd data={organization} />
        <ThemeRegistry>
          <a className="skip-to-content" href="#main-content">Skip to content</a>
          <Header />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <SiteFooter />
          <Panel3D />
          <ConsentAnalytics />
          <Arrival />
        </ThemeRegistry>
        <Analytics />
      </body>
    </html>
  );
}
