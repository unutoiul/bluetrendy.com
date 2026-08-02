import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import ThemeRegistry from "@/theme/ThemeRegistry";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ThemeRegistry>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeRegistry>
        <Analytics />
      </body>
    </html>
  );
}
