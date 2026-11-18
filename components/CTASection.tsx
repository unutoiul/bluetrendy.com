"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "motion/react";
import Magnetic from "./motion/Magnetic";
import PointerGlow from "./motion/PointerGlow";
import { brand } from "@/theme/theme";
import { trackEvent } from "@/lib/analytics";

type CTASectionProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  location?: string;
};

export default function CTASection({
  eyebrow,
  title = "What would you like to launch first?",
  subtitle = "Spend 30 minutes with a senior engineer. Bring your idea, your users, and the deadline you have in mind.",
  primaryLabel = "Book a call",
  primaryHref = "/book-a-call",
  secondaryLabel = "Send us a brief",
  secondaryHref = "/contact",
  location = "cta_section",
}: CTASectionProps) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const }}
      sx={{
        background: `linear-gradient(135deg, ${brand.navy} 0%, ${brand.navyDark} 100%)`,
        color: "#fff",
        py: { xs: 8, md: 10 },
        my: { xs: 8, md: 12 },
        borderRadius: { xs: 0, md: 4 },
        mx: { xs: 0, md: 3 },
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <PointerGlow color="rgba(139,214,255,0.16)" size={560} />
      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center", maxWidth: 640, mx: "auto" }}>
          {eyebrow && <Typography variant="overline" sx={{ color: "secondary.light" }}>
            {eyebrow}
          </Typography>}
          <Typography variant="h3" component="h2">
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.78)" }}>
            {subtitle}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 1 }}>
            <Magnetic>
              <Button
                component={Link}
                href={primaryHref}
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={() => trackEvent("cta_book_call_click", { location })}
                sx={{ "&:hover": { boxShadow: "0 0 0 6px rgba(139,214,255,0.12), 0 18px 40px -16px rgba(80,170,255,0.8)" } }}
              >
                {primaryLabel}
              </Button>
            </Magnetic>
            <Button
              component={Link}
              href={secondaryHref}
              variant="outlined"
              size="large"
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.4)",
                "&:hover": { borderColor: "#fff" },
              }}
            >
              {secondaryLabel}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
