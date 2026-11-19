"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Footer = dynamic(() => import("./Footer"));

export default function SiteFooter() {
  return usePathname() === "/" ? null : <Footer />;
}
