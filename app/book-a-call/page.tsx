import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import PageHero from "@/components/PageHero";
import BookingEmbed from "@/components/BookingEmbed";

export const metadata: Metadata = {
  title: "Book a Call",
  description: "Book a free 30-minute call with a senior engineer to talk through your project.",
};

const expectations = [
  "30 minutes with a senior engineer",
  "We'll ask about your problem, constraints, and existing systems",
  "You'll leave with a clear next step — discovery sprint, project quote, or a straight 'not a fit'",
  "No pressure, no obligation",
];

export default function BookACallPage() {
  return (
    <>
      <PageHero
        eyebrow="Book a Call"
        title="Talk through your project with a senior engineer"
        subtitle="Free, no-obligation call. Pick a time below."
      />

      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2.5}>
              <Typography variant="h6">What to expect</Typography>
              {expectations.map((item) => (
                <Stack key={item} direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                  <CheckIcon sx={{ color: "secondary.main", fontSize: 20, mt: 0.2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <BookingEmbed />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
