"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import ArrowDownwardRounded from "@mui/icons-material/ArrowDownwardRounded";
import TravelExploreOutlined from "@mui/icons-material/TravelExploreOutlined";
import { services } from "@/data/services";
import { serviceIcons } from "@/components/serviceIcons";
import PointerGlow from "@/components/motion/PointerGlow";
import ChapterIntro from "./ChapterIntro";
import { neural } from "./neuralStyle";
import { palette, withAlpha } from "@/theme/palette";

const card = {
  ...neural.glassCard,
  display: "flex", flexDirection: "column", minHeight: { md: 248 }, p: { xs: 2.5, md: 3 }, textDecoration: "none",
  "&:hover, &:focus-visible": { ...neural.glassCard["&:hover, &:focus-visible, &:focus-within"], transform: "translateY(-6px)" },
  "&:active": { transform: "translateY(-2px) scale(0.985)" },
  "&:hover .service-orb, &:focus-visible .service-orb": {
    transform: "scale(1.08) rotate(-4deg)", color: palette.slate[50],
    boxShadow: `0 0 0 1px ${withAlpha(palette.sky[100], 0.5)}, 0 0 28px ${withAlpha(palette.blue[300], 0.65)}, inset 0 0 14px ${withAlpha(palette.sky[175], 0.4)}`,
  },
  "&:hover .service-arrow, &:focus-visible .service-arrow": { transform: "translate(3px, -3px)", color: palette.cyan[75] },
  "&:hover .service-action, &:focus-visible .service-action": { color: palette.slate[50] },
  "&:focus-visible": { outline: `2px solid ${palette.sky[100]}`, outlineOffset: 3 },
};

const above = { position: "relative", zIndex: 1 } as const;
const number = { fontFamily: "var(--font-mono), monospace", fontSize: "0.8rem", fontWeight: 600, color: palette.sky[150], letterSpacing: "0.08em" } as const;
const title = { ...above, m: "20px 0 0", fontSize: { xs: "1.2rem", md: "1.26rem" }, fontWeight: 650, letterSpacing: "-0.03em", lineHeight: 1.25 } as const;
const text = { ...above, m: "8px 0 0", color: palette.slate[125], lineHeight: 1.55, fontSize: "0.95rem" } as const;
const action = { ...above, mt: "auto", pt: 2.25, color: palette.sky[100], fontSize: "0.9rem", fontWeight: 600, transition: "color 0.3s ease" } as const;

export default function ServicesChapter() {
  return <>
    <ChapterIntro id="services-heading" label="Our services" title="Seven ways to put" accent="AI to work"
      subtitle="Each service starts from a result your business needs. Open one to see what we build, how it works and what we measure."
      action={{ href: "/services", label: "Compare all services" }} />
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
      gap: { xs: 2, md: 2.5 } }}>
      {services.map(service => {
        const Icon = serviceIcons[service.icon];
        return <Box component={Link} key={service.slug} href={"/" + service.slug} data-panel sx={card}>
          <PointerGlow color={withAlpha(palette.blue[300], 0.2)} size={340} />
          <Box sx={{ ...above, display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box className="service-orb" sx={neural.iconOrb}><Icon aria-hidden="true" /></Box>
            <Box component="span" aria-hidden="true" sx={number}>{service.number}</Box>
            <ArrowOutwardRounded className="service-arrow" aria-hidden="true"
              sx={{ ml: "auto", alignSelf: "flex-start", fontSize: 20, color: palette.slate[275], transition: `transform 0.35s ${neural.ease}, color 0.3s ease` }} />
          </Box>
          <Box component="h3" sx={title}>{service.name}</Box>
          <Box component="p" sx={text}>{service.shortDescription}</Box>
          <Box component="span" className="service-action" sx={action}>{service.cta}</Box>
        </Box>;
      })}

      {/* The eighth card is for visitors who don't yet know which service they need. */}
      <Box component={Link} href="#opportunities" data-panel sx={{ ...card,
        background: `linear-gradient(150deg, ${withAlpha(palette.blue[350], 0.34)}, ${withAlpha(palette.navy[775], 0.9)} 70%)`,
        borderColor: withAlpha(palette.sky[150], 0.6),
        "&:hover .service-arrow, &:focus-visible .service-arrow": { transform: "translateY(3px)", color: palette.cyan[75] } }}>
        <PointerGlow color={withAlpha(palette.sky[150], 0.22)} size={340} />
        <Box sx={{ ...above, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box className="service-orb" sx={{ ...neural.iconOrb, animation: "neural-breathe 3.2s ease-in-out infinite",
            "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}><TravelExploreOutlined aria-hidden="true" /></Box>
          <ArrowDownwardRounded className="service-arrow" aria-hidden="true"
            sx={{ ml: "auto", alignSelf: "flex-start", fontSize: 20, color: palette.slate[75], transition: `transform 0.35s ${neural.ease}, color 0.3s ease` }} />
        </Box>
        <Box component="h3" sx={title}>Not sure where to start?</Box>
        <Box component="p" sx={{ ...text, color: palette.slate[100] }}>
          Tell the scanner your kind of business and your biggest challenge. It suggests a first project.
        </Box>
        <Box component="span" className="service-action" sx={action}>Scan my business</Box>
      </Box>
    </Box>
  </>;
}
