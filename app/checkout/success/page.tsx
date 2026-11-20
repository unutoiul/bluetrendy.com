import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageHero from "@/components/PageHero";
import LinkButton from "@/components/LinkButton";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Booking confirmed",
  robots: { index: false, follow: false },
};

type CheckoutSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  let email: string | null = null;

  if (sessionId && isStripeConfigured()) {
    try {
      const stripe = getStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      email = session.customer_details?.email ?? session.customer_email ?? null;
    } catch {
      email = null;
    }
  }

  return (
    <>
      <PageHero
        eyebrow="AI Implementation Blueprint"
        title="Payment received — you're booked in."
        subtitle={
          email
            ? `A confirmation has been sent to ${email}. Next, pick a time for your kickoff call.`
            : "Next, pick a time for your kickoff call."
        }
      />
      <Container sx={{ py: { xs: 4, md: 7 } }}>
        <Stack spacing={3} sx={{ maxWidth: 560 }}>
          <Typography variant="body1" color="text.secondary">
            We&apos;ll follow up by email within one business day if you haven&apos;t already scheduled a time.
            In the meantime, grab a slot that works for you and we&apos;ll come prepared with your project
            brief.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <LinkButton href="/book-a-call" variant="contained" color="primary" size="large">
              Schedule your kickoff call
            </LinkButton>
            <LinkButton href="/" variant="text" color="primary" size="large">
              Back to homepage
            </LinkButton>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
