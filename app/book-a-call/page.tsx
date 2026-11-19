import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import VideocamOutlined from "@mui/icons-material/VideocamOutlined";
import BookingEmbed from "@/components/BookingEmbed";
import styles from "@/components/interior/Editorial.styles";

export const metadata: Metadata = {
  title: "Book a Call",
  description: "Book a free 30-minute call with a senior engineer to talk through your project.",
};

export default function BookACallPage() {
  return (
    <Box component="section" aria-labelledby="booking-heading" sx={{ bgcolor: "#f1f6fa", pt: { xs: 3, md: 4 }, pb: 5 }}>
      <Container sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ maxWidth: 1080, mx: "auto" }}>
          <Stack className={styles.arrival} spacing={1.25} sx={{ mb: { xs: 2, md: 3 } }}>
            <Typography id="booking-heading" component="h1" sx={{ fontSize: { xs: 27, sm: 34 }, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", color: "primary.main" }}>
              Book a discovery call
            </Typography>
            <Typography variant="body1" color="text.secondary">Choose a time to discuss your project with a senior engineer.</Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", color: "text.secondary", flexWrap: "wrap", rowGap: 0.5 }}>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                <AccessTimeOutlined sx={{ fontSize: 17 }} />
                <Typography variant="body2">30 minutes</Typography>
              </Stack>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                <VideocamOutlined sx={{ fontSize: 19 }} />
                <Typography variant="body2">Google Meet</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 700 }}>Free</Typography>
            </Stack>
          </Stack>
          <BookingEmbed />
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 2 }}>
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
