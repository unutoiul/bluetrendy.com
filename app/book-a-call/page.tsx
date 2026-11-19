import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BookingSteps from "@/components/booking/BookingSteps";
import LivingBackground from "@/components/backgrounds/LivingBackground";

export const metadata: Metadata = {
  title: "Book a Call",
  description: "Book a free 30-minute call with a senior engineer to talk through your project.",
};

export default function BookACallPage() {
  return (
    <Box component="section" aria-labelledby="booking-heading"
      sx={{ position: "relative", isolation: "isolate", overflow: "clip", bgcolor: "#f1f6fa", pt: { xs: 3, md: 5 }, pb: { xs: 6, md: 8 } }}>
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
