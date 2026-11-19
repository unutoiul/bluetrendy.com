import type { Metadata } from "next";
import PolicyArticle from "@/components/interior/PolicyArticle";
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
      <PolicyArticle related={{ href: "/legal/privacy", title: "Privacy Policy" }}
        sections={[
          {
            id: "discovery-sprint", title: "Discovery sprint",
            body: <>
              <Typography variant="body1" color="text.secondary">
                Payment for a discovery sprint via this website secures a scoped, fixed-price engagement as
                described on the pricing page. Deliverables and timeline are confirmed by email after payment.
                If you move forward with a fixed-scope project or embedded engagement within 60 days of your
                discovery sprint, its fee is credited against that engagement.
              </Typography>
            </>,
          },
          {
            id: "fixed-scope-and-embedded-engagements", title: "Fixed-scope and embedded engagements",
            body: <>
              <Typography variant="body1" color="text.secondary">
                Fixed-scope projects and embedded engineering engagements are governed by a separate written
                agreement (statement of work or contract) signed before work begins, which takes precedence over
                this page for that engagement.
              </Typography>
            </>,
          },
          {
            id: "intellectual-property", title: "Intellectual property",
            body: <>
              <Typography variant="body1" color="text.secondary">
                Unless otherwise agreed in writing, you own the intellectual property in the code and
                deliverables created specifically for your engagement upon full payment. Pre-existing tools,
                libraries, and internal frameworks we bring to an engagement remain ours, licensed to you for
                use as part of the deliverable.
              </Typography>
            </>,
          },
          {
            id: "confidentiality", title: "Confidentiality",
            body: <>
              <Typography variant="body1" color="text.secondary">
                We treat information shared during discovery calls and engagements as confidential, and sign
                NDAs on request before any detailed technical or business discussion.
              </Typography>
            </>,
          },
          {
            id: "refunds", title: "Refunds",
            body: <>
              <Typography variant="body1" color="text.secondary">
                Discovery sprint payments are refundable if cancelled more than 48 hours before the scheduled
                kickoff call. Cancellations within 48 hours are non-refundable, as the session time has been
                reserved.
              </Typography>
            </>,
          },
          {
            id: "contact", title: "Contact",
            body: <>
              <Typography variant="body1" color="text.secondary">
                Questions about these terms: contact@bluetrendy.com.
              </Typography>
            </>,
          },
        ]} />
    </>
  );
}
