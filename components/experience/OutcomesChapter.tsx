"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import { keyframes } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import SavingsOutlined from "@mui/icons-material/SavingsOutlined";
import RocketLaunchOutlined from "@mui/icons-material/RocketLaunchOutlined";
import InsightsOutlined from "@mui/icons-material/InsightsOutlined";
import PointerGlow from "@/components/motion/PointerGlow";
import ChapterIntro from "./ChapterIntro";
import { neural } from "./neuralStyle";
import { palette, withAlpha } from "@/theme/palette";

type Outcome = {
  title: string;
  text: string;
  Icon: SvgIconComponent;
  link: { href: string; label: string };
  /** The shape of the result, as points on a 120 × 40 chart. */
  trend: string;
  /** For a forecast: the part of the line that has not happened yet. */
  ahead?: string;
};

// The four results every service is sold on. Each card's line draws the direction the number should move.
const outcomes: Outcome[] = [
  { title: "Grow revenue", Icon: TrendingUpRounded, trend: "0,34 20,30 40,31 60,22 80,18 100,9 120,4",
    text: "Capture every enquiry, follow up on time, personalise your marketing and convert more of the interest you already have.",
    link: { href: "/ai-marketing-automation", label: "Sales & marketing automation" } },
  { title: "Reduce costs", Icon: SavingsOutlined, trend: "0,6 20,9 40,8 60,18 80,23 100,31 120,35",
    text: "Automate repetitive administration, document handling, support and reporting, so people work on what needs them.",
    link: { href: "/agentic-automation", label: "Business automation" } },
  { title: "Launch faster", Icon: RocketLaunchOutlined, trend: "0,35 20,34 40,30 60,13 80,7 100,5 120,4",
    text: "Use AI-assisted engineering to deliver websites, apps and digital products sooner, with senior engineers reviewing the work.",
    link: { href: "/ai-websites-apps", label: "Websites & apps" } },
  { title: "Make better decisions", Icon: InsightsOutlined, trend: "0,27 20,22 40,25 60,17", ahead: "60,17 80,13 100,10 120,5",
    text: "Forecast demand, analyse trends and spot business risks early, with the uncertainty shown rather than hidden.",
    link: { href: "/predictive-ai", label: "Predictive AI" } },
];

const above = { position: "relative", zIndex: 1 } as const;
const drawLine = keyframes`from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; }`;

export default function OutcomesChapter() {
  return <>
    <ChapterIntro id="outcomes-heading" label="Business outcomes" title="What AI should do" accent="for your business"
      subtitle="More customers. Less repetitive work. Faster innovation. Better decisions. Every project we take on starts from one of these four." />
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: { xs: 2, md: 2.5 },
      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" } }}>
      {outcomes.map(({ title, text, Icon, link, trend, ahead }, index) => (
        <Box component="li" key={title} data-panel sx={{ ...neural.glassCard, display: "flex", flexDirection: "column", p: { xs: 2.5, md: 3 },
          "&:hover": { ...neural.glassCard["&:hover, &:focus-visible, &:focus-within"], transform: "translateY(-6px)" },
          "&:hover .outcome-orb": { transform: "scale(1.08) rotate(-4deg)", color: palette.slate[50] },
          // The line redraws itself, left to right, whenever the card is pointed at.
          "@media (prefers-reduced-motion: no-preference)": {
            "&:hover .outcome-line": { animation: `${drawLine} 1.1s ${neural.ease} both` },
          } }}>
          <PointerGlow color={withAlpha(palette.blue[300], 0.2)} size={320} />
          <Box sx={{ ...above, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Box className="outcome-orb" sx={neural.iconOrb}><Icon aria-hidden="true" /></Box>
            <Box component="svg" viewBox="0 0 120 40" aria-hidden="true" sx={{ width: 104, height: 36, overflow: "visible", fill: "none", strokeLinecap: "round", strokeLinejoin: "round",
              filter: `drop-shadow(0 0 6px ${withAlpha(palette.blue[300], 0.75)})` }}>
              <polyline className="outcome-line" points={trend} pathLength={1} strokeDasharray="1" stroke={palette.sky[150]} strokeWidth="2.4" />
              {ahead && <polyline points={ahead} stroke={palette.cyan[75]} strokeWidth="2.4" strokeDasharray="5 5" />}
              <circle cx="120" cy={(ahead ?? trend).split(" ").at(-1)?.split(",")[1]} r="3.4" fill={palette.cyan[25]} />
            </Box>
          </Box>
          <Box component="span" aria-hidden="true" sx={{ ...above, mt: 2.5, fontFamily: "var(--font-mono), monospace", fontSize: "0.78rem", fontWeight: 600,
            color: palette.sky[150], letterSpacing: "0.08em" }}>{String(index + 1).padStart(2, "0")}</Box>
          <Box component="h3" sx={{ ...above, ...neural.accentText, m: "4px 0 0", fontSize: { xs: "1.5rem", md: "1.62rem" }, fontWeight: 670, letterSpacing: "-0.04em", lineHeight: 1.12 }}>
            {title}
          </Box>
          <Box component="p" sx={{ ...above, m: "10px 0 0", color: palette.slate[125], lineHeight: 1.58, fontSize: "0.96rem" }}>{text}</Box>
          <Box sx={{ ...above, mt: "auto", pt: 2 }}>
            <Box component={Link} href={link.href} prefetch={false} sx={{ ...neural.trailLink, fontSize: "0.9rem", whiteSpace: "normal" }}>
              {link.label} <ArrowForwardRounded aria-hidden="true" />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  </>;
}
