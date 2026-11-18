import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PointerGlow from "./motion/PointerGlow";

type PageHeroProps = { eyebrow?: string; title: string; subtitle?: string; children?: ReactNode };

export default function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <Box component="section" sx={{ position: "relative", isolation: "isolate", overflow: "hidden", color: "#fff",
      bgcolor: "primary.main", backgroundImage: "radial-gradient(ellipse at 100% 0%, #1c5682, transparent 65%)", py: { xs: 6, md: 9 } }}>
      <PointerGlow color="rgba(139,214,255,0.13)" size={520} />
      <Box aria-hidden className="mark-drift" sx={{ pointerEvents: "none", position: "absolute", zIndex: -1, right: "-4%", top: "-30%",
        width: "35%", height: "160%", transform: "rotate(-14deg)", opacity: 0.09,
        background: "url(/brand/icon.png) center / contain no-repeat", display: { xs: "none", md: "block" } }} />
      <Container sx={{ position: "relative" }}>
        <Stack spacing={{ xs: 2, md: 2.5 }} sx={{ maxWidth: 820 }}>
          {eyebrow && <Typography className="arrive" sx={{ fontSize: 15, fontWeight: 650, color: "#9dddff", "--d": "0.05s" }}>{eyebrow}</Typography>}
          <Typography variant="h2" component="h1" className="clip-up"
            sx={{ fontSize: { xs: "clamp(2.25rem, 7vw, 3.4rem)", md: "3.65rem" }, textWrap: "balance", "--d": "0.1s" }}>{title}</Typography>
          {subtitle && <Typography className="arrive" sx={{ color: "#dce9f2", fontSize: { xs: 16, md: 18 }, maxWidth: "64ch", "--d": "0.35s" }}>{subtitle}</Typography>}
          {children && <Box className="arrive" sx={{ "--d": "0.5s" }}>{children}</Box>}
        </Stack>
      </Container>
    </Box>
  );
}
