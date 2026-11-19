"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
      component="section"
      sx={{
        background: "linear-gradient(115deg, #071b2d 10%, #0a2d48 100%)",
        color: "#fff",
        py: { xs: 6, md: 8 },
        borderBlock: "1px solid #2e526c",
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={2.5} sx={{ alignItems: "flex-start", maxWidth: 720 }}>
          {eyebrow && <Typography variant="overline" sx={{ color: "secondary.light" }}>
            {eyebrow}
          </Typography>}
          <Typography variant="h3" component="h2">
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.78)" }}>
            {subtitle}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 0.5, width: { xs: "100%", sm: "auto" } }}>
            <Button
              component={Link}
              href={primaryHref}
              variant="contained"
              color="secondary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => trackEvent("cta_book_call_click", { location })}
              sx={{ bgcolor: "#85e7ff", color: "#06192b", "&:hover": { bgcolor: "#a2f0ff", boxShadow: "0 0 16px #37b8f34d" } }}
            >
              {primaryLabel}
            </Button>
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
