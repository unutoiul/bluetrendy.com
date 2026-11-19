"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import CodeRounded from "@mui/icons-material/CodeRounded";
import WebOutlined from "@mui/icons-material/WebOutlined";
import SmartphoneOutlined from "@mui/icons-material/SmartphoneOutlined";
import HubOutlined from "@mui/icons-material/HubOutlined";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import MovieOutlined from "@mui/icons-material/MovieOutlined";
import { services } from "@/data/services";
import PointerGlow from "@/components/motion/PointerGlow";
import ChapterIntro from "./ChapterIntro";
import { neural } from "./neuralStyle";

const icons = {
  cube: CodeRounded,
  web: WebOutlined,
  phone: SmartphoneOutlined,
  integration: HubOutlined,
  spark: AutoAwesomeOutlined,
  film: MovieOutlined,
};

const featuredServices = services.flatMap(service =>
  service.preview ? [{ ...service, preview: service.preview }] : []
);

const card = {
  ...neural.glassCard,
  display: "flex", flexDirection: "column", minHeight: { md: 214 }, p: { xs: 2.5, md: 3 }, textDecoration: "none",
  "&:hover, &:focus-visible": { ...neural.glassCard["&:hover, &:focus-visible, &:focus-within"], transform: "translateY(-6px)" },
  "&:active": { transform: "translateY(-2px) scale(0.985)" },
  "&:hover .service-orb, &:focus-visible .service-orb": {
    transform: "scale(1.08) rotate(-4deg)", color: "#d6f8ff",
    boxShadow: "0 0 0 1px rgba(150, 235, 255, 0.5), 0 0 28px rgba(30, 170, 255, 0.65), inset 0 0 14px rgba(120, 210, 255, 0.4)",
  },
  "&:hover .service-arrow, &:focus-visible .service-arrow": { transform: "translate(3px, -3px)", color: "#c9f6ff" },
  "&:focus-visible": { outline: "2px solid #a8ecff", outlineOffset: 3 },
};

export default function ServicesChapter() {
  return <>
    <ChapterIntro id="services-heading" label="Our services" title="What we" accent="do"
      subtitle="Software, systems and media built around how your business works, from the first release to everyday use."
      action={{ href: "/services", label: "All IT services" }} />
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
      gap: { xs: 2, md: 2.5 } }}>
      {featuredServices.map(service => {
        const Icon = icons[service.preview.icon];
        return <Box component={Link} key={service.slug} href={"/services#" + service.slug} data-panel sx={card}>
          <PointerGlow color="rgba(70, 175, 255, 0.2)" size={340} />
          <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <Box className="service-orb" sx={neural.iconOrb}><Icon aria-hidden="true" /></Box>
            <ArrowOutwardRounded className="service-arrow" aria-hidden="true"
              sx={{ fontSize: 20, color: "#7fb4d8", transition: `transform 0.35s ${neural.ease}, color 0.3s ease` }} />
          </Box>
          <Box component="h3" sx={{ position: "relative", zIndex: 1, m: "22px 0 0", fontSize: { xs: "1.2rem", md: "1.32rem" },
            fontWeight: 650, letterSpacing: "-0.03em", lineHeight: 1.25 }}>{service.name}</Box>
          <Box component="p" sx={{ position: "relative", zIndex: 1, m: "8px 0 0", color: "#b9cde2", lineHeight: 1.6, fontSize: "0.98rem" }}>
            {service.shortDescription}
          </Box>
        </Box>;
      })}
    </Box>
  </>;
}
