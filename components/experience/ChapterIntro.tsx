"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import HeadingMotion from "../motion/HeadingMotion";
import { neural } from "./neuralStyle";

type ChapterIntroProps = {
  id: string;
  label: string;
  title: string;
  /** Last words of the title, drawn in the blue gradient. */
  accent?: string;
  subtitle?: string;
  action?: { href: string; label: string };
};

/** Section heading in the neural style: a small label with a light trail, the title, and an optional link. */
export default function ChapterIntro({ id, label, title, accent, subtitle, action }: ChapterIntroProps) {
  return (
    <Box data-arrive="0" sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between",
      gap: "16px 32px", mb: { xs: 3.5, md: 5 } }}>
      <Box sx={{ maxWidth: 760 }}>
        <Box component="p" sx={neural.label}>{label}</Box>
        <HeadingMotion id={id} text={title} accent={accent}
          sx={{ m: 0, fontSize: "clamp(2.1rem, 4.4vw, 3.9rem)", fontWeight: 650, letterSpacing: "-0.05em", lineHeight: 1.05 }} />
        {subtitle && <Box component="p" sx={{ mt: 1.75, mb: 0, maxWidth: "56ch", color: "#c3d6ea", fontSize: { xs: "1rem", md: "1.12rem" }, lineHeight: 1.55 }}>
          {subtitle}
        </Box>}
      </Box>
      {action && <Box component={Link} href={action.href} prefetch={false} sx={neural.trailLink}>
        {action.label} <ArrowForwardRounded />
      </Box>}
    </Box>
  );
}
