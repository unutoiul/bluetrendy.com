import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BookingSteps from "@/components/booking/BookingSteps";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, pageMetadata } from "@/lib/seo";
import { palette } from "@/theme/palette";

export const metadata: Metadata = pageMetadata({
  title: "Book a Free 30-Minute Call",
  description: "Book a free 30-minute video call with our senior team to talk through your website, app, software or AI project. Pick a time that suits you.",
  path: "/book-a-call",
});

export default function BookACallPage() {
  return (
    <Box component="section" aria-labelledby="booking-heading"
      sx={{ position: "relative", isolation: "isolate", overflow: "clip", bgcolor: palette.grey[25], pt: { xs: 3, md: 5 }, pb: { xs: 6, md: 8 } }}>
      <JsonLd data={breadcrumbs([{ name: "Book a call", path: "/book-a-call" }])} />
      {/* A lattice of dots on springs that gives way under the mouse, in the light page's colours. */}
      <LivingBackground effect="springGrid" light quiet="none" seed={113} />
      <Container sx={{ position: "relative", zIndex: 1, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ maxWidth: 1180, mx: "auto" }}>
          <BookingSteps />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Need a different time?{" "}
            <Box component="a" href="mailto:contact@bluetrendy.com?subject=Discovery%20call" sx={{ color: "primary.main", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Email our team
            </Box>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
