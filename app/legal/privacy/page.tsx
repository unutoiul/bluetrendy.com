import type { Metadata } from "next";
import PolicyArticle from "@/components/interior/PolicyArticle";
import Typography from "@mui/material/Typography";
import PageHero from "@/components/PageHero";
import { getBookingConfig } from "@/lib/booking";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  const booking = getBookingConfig(process.env.NEXT_PUBLIC_CAL_COM_URL, process.env.NEXT_PUBLIC_CALENDLY_URL);
  const schedulingProvider = booking?.provider === "calendly" ? "Calendly" : "Cal.com";
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: to be confirmed before launch." />
      <PolicyArticle related={{ href: "/legal/terms", title: "Terms of Engagement" }}
        sections={[
          {
            id: "who-we-are", title: "Who we are",
            body: <>
              <Typography variant="body1" color="text.secondary">
                bluetrendy ([registered company name, company number, and registered address — to be
                confirmed]) operates this website. For any privacy-related question, contact
                contact@bluetrendy.com.
              </Typography>
            </>,
          },
          {
            id: "what-we-collect", title: "What we collect",
            body: <>
              <Typography variant="body1" color="text.secondary">
                We collect information you provide directly — through the contact form, the discovery sprint
                checkout, or by booking a call — including your name, email address, company, and project
                details. If you use our booking calendar, our scheduling provider ({schedulingProvider}) collects the
                information needed to schedule and manage that appointment under its own privacy policy.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Contact form messages and confirmation emails are delivered using Resend. Your contact
                details and enquiry are processed to deliver these messages and help us respond to you.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We use privacy-conscious, cookie-free analytics (Vercel Analytics) to understand aggregate site
                usage — page views and which calls-to-action are used — without tracking you individually across
                other websites.
              </Typography>
            </>,
          },
          {
            id: "payments", title: "Payments",
            body: <>
              <Typography variant="body1" color="text.secondary">
                Discovery sprint payments are processed by Stripe. We do not store your card details — Stripe
                handles payment data under its own security and privacy standards (see stripe.com/privacy).
              </Typography>
            </>,
          },
          {
            id: "how-we-use-your-information", title: "How we use your information",
            body: <>
              <Typography variant="body1" color="text.secondary">
                We use the information you provide to respond to your enquiry, schedule calls, deliver paid
                engagements, and — only if you&apos;ve agreed to it — to follow up about our services. We do not
                sell your personal data.
              </Typography>
            </>,
          },
          {
            id: "data-retention", title: "Data retention",
            body: <>
              <Typography variant="body1" color="text.secondary">
                We retain enquiry and project data for as long as needed to respond to you, deliver an
                engagement, and meet our legal and accounting obligations, after which it is deleted or
                anonymized.
              </Typography>
            </>,
          },
          {
            id: "your-rights", title: "Your rights",
            body: <>
              <Typography variant="body1" color="text.secondary">
                You can request access to, correction of, or deletion of your personal data at any time by
                emailing contact@bluetrendy.com.
              </Typography>
            </>,
          },
        ]} />
    </>
  );
}
