"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LinkButton from "./LinkButton";
import { trackEvent } from "@/lib/analytics";import { palette, withAlpha } from "@/theme/palette";


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
  subtitle = "Spend 30 minutes with our team. Bring your idea, your users, and the deadline you have in mind.",
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
        background: `linear-gradient(180deg, ${palette.navy[800]} 0%, ${palette.navy[725]} 55%, ${palette.navy[775]} 100%)`,
        color: palette.white,
        py: { xs: 6, md: 8 },
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
          <Typography variant="body1" sx={{ color: withAlpha(palette.white, 0.78) }}>
            {subtitle}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 0.5, width: { xs: "100%", sm: "auto" } }}>
            <LinkButton href={primaryHref} variant="contained" size="large" endIcon={<ArrowForwardIcon />}
              onClick={() => trackEvent("cta_book_call_click", { location })}>
              {primaryLabel}
            </LinkButton>
            <LinkButton href={secondaryHref} variant="outlined" tone="dark" size="large">
              {secondaryLabel}
            </LinkButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
