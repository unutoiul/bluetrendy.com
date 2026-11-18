import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import ThemeRegistry from "@/theme/ThemeRegistry";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClickSpark from "@/components/motion/ClickSpark";
import "./globals.css";

const geist = localFont({
  src: "../public/fonts/geist-latin.woff2",
  variable: "--font-sans",
  weight: "100 900",
  style: "normal",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bluetrendy.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BlueTrendy Intelligence — AI-first custom software consultancy",
    template: "%s — BlueTrendy Intelligence",
  },
  description:
    "BlueTrendy Intelligence designs and ships production-grade web, mobile, and mission-critical software for enterprise and government clients — combining senior engineering with frontier AI to deliver faster, at lower cost.",
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
    title: "BlueTrendy Intelligence — AI-first custom software consultancy",
    description:
      "Production-grade web, mobile, and mission-critical software for enterprise and government clients — delivered faster with senior engineering and frontier AI.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "BlueTrendy Intelligence — AI-first custom software consultancy",
    description:
      "Production-grade web, mobile, and mission-critical software for enterprise and government clients — delivered faster with senior engineering and frontier AI.",
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
          <Footer />
          <ClickSpark />
        </ThemeRegistry>
        <Analytics />
      </body>
    </html>
  );
}
