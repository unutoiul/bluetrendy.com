import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import ThemeRegistry from "@/theme/ThemeRegistry";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bluetrendy.com";
const siteTitle = "BlueTrendy Intelligence — IT services & digital production";
const siteDescription = "BlueTrendy builds custom software, websites and mobile apps, implements and integrates IT systems, automates workflows with AI and produces marketing videos.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s — BlueTrendy Intelligence",
  },
  description: siteDescription,
  keywords: [
    "AI software consultancy",
    "custom software development",
    "enterprise software agency",
    "AI automation development",
    "Next.js development agency",
    "legacy system modernization",
  ],
  authors: [{ name: "BlueTrendy Intelligence" }],
  openGraph: {
    type: "website",
    siteName: "BlueTrendy Intelligence",
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ThemeRegistry>
          <a className="skip-to-content" href="#main-content">Skip to content</a>
          <Header />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <SiteFooter />
        </ThemeRegistry>
        <Analytics />
      </body>
    </html>
  );
}
