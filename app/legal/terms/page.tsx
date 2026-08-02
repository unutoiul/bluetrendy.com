import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Terms of Engagement",
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Engagement" subtitle="Last updated: to be confirmed before launch." />
      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Stack spacing={5} sx={{ maxWidth: 760 }}>
          <Stack spacing={1.5}>
            <Typography variant="h6">Discovery sprint</Typography>
            <Typography variant="body1" color="text.secondary">
              Payment for a discovery sprint via this website secures a scoped, fixed-price engagement as
              described on the pricing page. Deliverables and timeline are confirmed by email after payment.
              If you move forward with a fixed-scope project or embedded engagement within 60 days of your
              discovery sprint, its fee is credited against that engagement.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="h6">Fixed-scope and embedded engagements</Typography>
            <Typography variant="body1" color="text.secondary">
              Fixed-scope projects and embedded engineering engagements are governed by a separate written
              agreement (statement of work or contract) signed before work begins, which takes precedence over
              this page for that engagement.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="h6">Intellectual property</Typography>
            <Typography variant="body1" color="text.secondary">
              Unless otherwise agreed in writing, you own the intellectual property in the code and
              deliverables created specifically for your engagement upon full payment. Pre-existing tools,
              libraries, and internal frameworks we bring to an engagement remain ours, licensed to you for
              use as part of the deliverable.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="h6">Confidentiality</Typography>
            <Typography variant="body1" color="text.secondary">
              We treat information shared during discovery calls and engagements as confidential, and sign
              NDAs on request before any detailed technical or business discussion.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="h6">Refunds</Typography>
            <Typography variant="body1" color="text.secondary">
              Discovery sprint payments are refundable if cancelled more than 48 hours before the scheduled
              kickoff call. Cancellations within 48 hours are non-refundable, as the session time has been
              reserved.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="h6">Contact</Typography>
            <Typography variant="body1" color="text.secondary">
              Questions about these terms: contact@bluetrendy.com.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
