import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageHero from "@/components/PageHero";
import LinkButton from "@/components/LinkButton";

export const metadata: Metadata = {
  title: "Checkout cancelled",
  robots: { index: false, follow: false },
};

export default function CheckoutCancelPage() {
  return (
    <>
      <PageHero eyebrow="AI Implementation Blueprint" title="Checkout cancelled" subtitle="No payment was taken." />
      <Container sx={{ py: { xs: 4, md: 7 } }}>
        <Stack spacing={3} sx={{ maxWidth: 560 }}>
          <Typography variant="body1" color="text.secondary">
            Changed your mind about the details, or just want to talk it through first? A free AI Opportunity Call
            is a good next step either way.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <LinkButton href="/pricing" variant="contained" color="primary" size="large">
              Back to pricing
            </LinkButton>
            <LinkButton href="/book-a-call" variant="text" color="primary" size="large">
              Book a free call instead
            </LinkButton>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
