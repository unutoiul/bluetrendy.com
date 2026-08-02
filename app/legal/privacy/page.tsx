import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: to be confirmed before launch." />
      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Stack spacing={5} sx={{ maxWidth: 760 }}>
          <Stack spacing={1.5}>
            <Typography variant="h6">Who we are</Typography>
            <Typography variant="body1" color="text.secondary">
              bluetrendy ([registered company name, company number, and registered address — to be
              confirmed]) operates this website. For any privacy-related question, contact
              contact@bluetrendy.com.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="h6">What we collect</Typography>
            <Typography variant="body1" color="text.secondary">
              We collect information you provide directly — through the contact form, the discovery sprint
              checkout, or by booking a call — including your name, email address, company, and project
              details. If you use our booking calendar, our scheduling provider (Calendly) collects the
              information needed to schedule and manage that appointment under its own privacy policy.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We use privacy-conscious, cookie-free analytics (Vercel Analytics) to understand aggregate site
              usage — page views and which calls-to-action are used — without tracking you individually across
              other websites.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="h6">Payments</Typography>
            <Typography variant="body1" color="text.secondary">
              Discovery sprint payments are processed by Stripe. We do not store your card details — Stripe
              handles payment data under its own security and privacy standards (see stripe.com/privacy).
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="h6">How we use your information</Typography>
            <Typography variant="body1" color="text.secondary">
              We use the information you provide to respond to your enquiry, schedule calls, deliver paid
              engagements, and — only if you&apos;ve agreed to it — to follow up about our services. We do not
              sell your personal data.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="h6">Data retention</Typography>
            <Typography variant="body1" color="text.secondary">
              We retain enquiry and project data for as long as needed to respond to you, deliver an
              engagement, and meet our legal and accounting obligations, after which it is deleted or
              anonymized.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="h6">Your rights</Typography>
            <Typography variant="body1" color="text.secondary">
              You can request access to, correction of, or deletion of your personal data at any time by
              emailing contact@bluetrendy.com.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
