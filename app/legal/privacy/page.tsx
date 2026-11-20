import type { Metadata } from "next";
import PolicyArticle from "@/components/interior/PolicyArticle";
import Typography from "@mui/material/Typography";
import PageHero from "@/components/PageHero";
import { getBookingConfig } from "@/lib/booking";
import { analyticsIds, consentRequired } from "@/lib/analyticsConfig";
import CookieSettingsButton from "@/components/analytics/CookieSettingsButton";
import { company, registeredOffice, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  const booking = getBookingConfig(process.env.NEXT_PUBLIC_CAL_COM_URL, process.env.NEXT_PUBLIC_CALENDLY_URL);
  const schedulingProvider = booking?.provider === "calendly" ? "Calendly" : "Cal.com";
  const tools = [analyticsIds.ga && "Google Analytics", analyticsIds.clarity && "Microsoft Clarity"].filter(Boolean).join(" and ");
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: 20 November 2026." />
      <PolicyArticle related={{ href: "/legal/terms", title: "Terms of Engagement" }}
        sections={[
          {
            id: "who-we-are", title: "Who we are",
            body: <>
              <Typography variant="body1" color="text.secondary">
                {siteName} is a trading name of {company.legalName}, a company registered in {company.jurisdiction}
                (company number {company.number}, registered office {registeredOffice}), which operates this website
                and is responsible for your personal data. For any privacy-related question, contact
                contact@bluetrendy.com.
              </Typography>
            </>,
          },
          {
            id: "what-we-collect", title: "What we collect",
            body: <>
              <Typography variant="body1" color="text.secondary">
                We collect information you provide directly — through the contact form, the AI Implementation Blueprint
                (discovery sprint) checkout, or by booking a call — including your name, email address, company, and project
                details. If you use our booking calendar, our scheduling provider ({schedulingProvider}) collects the
                information needed to schedule and manage that appointment under its own privacy policy.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Contact form messages and confirmation emails are delivered using Resend. Your contact
                details and enquiry are processed to deliver these messages and help us respond to you. When you
                send an enquiry, it also tells us which page of this site you first arrived on, the website that
                referred you and any campaign link you followed, so we know how people find us. This is noted only
                for the length of your visit, without cookies, and is sent only if you submit the form.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We use privacy-conscious, cookie-free analytics (Vercel Analytics) to understand aggregate site
                usage — page views and which calls-to-action are used — without tracking you individually across
                other websites.
              </Typography>
            </>,
          },
          ...(consentRequired ? [{
            id: "cookies", title: "Cookies and analytics",
            body: <>
              <Typography variant="body1" color="text.secondary">
                With your permission, we also use {tools} to understand how visitors use this site, so we
                can improve it.
              </Typography>
              {analyticsIds.ga && <Typography variant="body1" color="text.secondary">
                Google Analytics shows how people find the site, which pages they view and roughly where they
                are, such as their country or city. It sets cookies whose names begin with _ga.
              </Typography>}
              {analyticsIds.clarity && <Typography variant="body1" color="text.secondary">
                Microsoft Clarity records how pages are used, such as clicks, scrolling and mouse movement, and
                turns this into heatmaps and session replays. Anything typed into our forms is hidden from these
                recordings. It sets cookies named _clck and _clsk.
              </Typography>}
              <Typography variant="body1" color="text.secondary">
                These tools load only after you choose Accept on the cookie banner. You can change your choice at
                any time with{" "}
                <CookieSettingsButton sx={{ color: "secondary.main", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "0.2em" }} />,
                here or at the bottom of every page. Google and Microsoft process this data under their own
                privacy policies and may do so outside the UK.
              </Typography>
            </>,
          }] : []),
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
