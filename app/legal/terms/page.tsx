import type { Metadata } from "next";
import Link from "next/link";
import RequestQuoteOutlined from "@mui/icons-material/RequestQuoteOutlined";
import SavingsOutlined from "@mui/icons-material/SavingsOutlined";
import KeyOutlined from "@mui/icons-material/KeyOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined";
import PsychologyOutlined from "@mui/icons-material/PsychologyOutlined";
import PolicyArticle from "@/components/interior/PolicyArticle";
import PageHero from "@/components/PageHero";
import { discoveryPackages, formatPounds } from "@/data/pricing";
import { companyStatement } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Engagement",
  robots: { index: false, follow: true },
};

const prices = discoveryPackages.map(item => item.price);
const priceRange = `${formatPounds(Math.min(...prices))}–${formatPounds(Math.max(...prices))}`;

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Engagement"
        subtitle="How we work together, in plain English. Last updated 20 November 2026." />
      <PolicyArticle
        related={{ href: "/legal/privacy", title: "Privacy Policy" }}
        highlights={{
          title: "The short version,", accent: "before the detail",
          intro: "The points people ask about most. The sections below explain each one in full.",
          items: [
            { Icon: RequestQuoteOutlined, title: "A fixed price, agreed upfront", detail: `The AI Implementation Blueprint costs ${priceRange}, set by the size of your company. No hourly billing, no surprises.` },
            { Icon: SavingsOutlined, title: "Your blueprint fee comes back", detail: "Build with us within 60 days and the full fee is credited against your project." },
            { Icon: KeyOutlined, title: "You own what we build for you", detail: "The code and deliverables made for your project are yours once they are paid for." },
            { Icon: ShieldOutlined, title: "Your information stays confidential", detail: "We sign an NDA before any detailed discussion if you ask, and never share what you tell us." },
            { Icon: PsychologyOutlined, title: "AI speeds us up; people sign off", detail: "We use AI tools to work faster. Senior engineers review everything we deliver." },
            { Icon: EventAvailableOutlined, title: "Change of plan? Cancel for free", detail: "Cancel more than 48 hours before your kickoff call and we refund you in full." },
          ],
        }}
        footnote={companyStatement}
        sections={[
          {
            id: "about", title: "About these terms",
            summary: "These terms cover the blueprint you can buy on this website. Bigger projects get their own written agreement.",
            body: <>
              <p>
                These terms apply when you buy an AI Implementation Blueprint through this website, and to the conversations
                we have before any other work is agreed. &ldquo;We&rdquo;, &ldquo;us&rdquo; and &ldquo;BlueTrendy&rdquo; mean BlueTrendy
                Development Ltd; &ldquo;you&rdquo; means the business buying from us.
              </p>
              <p>
                Our services are for businesses. By placing an order you confirm that you are buying on behalf of a business and
                are allowed to agree to these terms for it.
              </p>
            </>,
          },
          {
            id: "blueprint", title: "The AI Implementation Blueprint",
            summary: "A short, fixed-price piece of work with our senior team that ends in a written plan and a price for your build.",
            body: <>
              <p>
                The blueprint is our paid discovery sprint. We learn how your business works, look at the systems and data involved,
                and give you a written plan: what to build first, how, the risks, and what it will cost. What each package includes
                is listed on the <Link href="/pricing">pricing page</Link>.
              </p>
              <ul>
                <li><strong>Price.</strong> {discoveryPackages.map(item => `${item.name} ${formatPounds(item.price)}`).join(", ")}. It is a fixed price, paid upfront by card through Stripe.</li>
                <li><strong>Scope and timing.</strong> After payment we confirm by email what you will receive and when, and book your kickoff call.</li>
                <li><strong>The plan is yours.</strong> You keep the written plan whether or not you build with us, and you can share it with anyone.</li>
                <li><strong>Fee credit.</strong> If you go ahead with a fixed-scope project or an embedded engagement within 60 days of your blueprint, its full fee is credited against that work.</li>
              </ul>
            </>,
          },
          {
            id: "cancellations", title: "Cancellations and refunds",
            summary: "Cancel more than 48 hours before your kickoff call for a full refund.",
            body: <>
              <p>
                You can cancel a blueprint for a full refund up to 48 hours before the scheduled kickoff call. Within 48 hours of the
                call the payment is not refundable, because the time has been set aside for you, but we are happy to move the call
                to another date instead.
              </p>
              <p>
                If we ever need to move your kickoff call, we will offer you a new date; if none suits you, we will refund you in full.
              </p>
            </>,
          },
          {
            id: "projects", title: "Projects and ongoing work",
            summary: "Builds, embedded engineering and monthly services each run under their own signed agreement.",
            body: <>
              <p>
                Fixed-scope projects, embedded engineering, managed AI operations and retainers are each agreed in a separate
                written agreement, such as a statement of work, signed before the work begins. That agreement sets out the scope,
                price, milestones and payment terms, and where it differs from this page, the agreement wins.
              </p>
              <p>
                This work is invoiced, usually by milestone or monthly. If the scope needs to change along the way, we agree the
                change and any effect on cost or timing with you in writing before we act on it.
              </p>
            </>,
          },
          {
            id: "ai", title: "How we use AI",
            summary: "We use AI to work faster, never to replace judgement. Your confidential information is not used to train AI models.",
            body: <>
              <p>
                AI tools help us write, test and document software more quickly. Everything we deliver is reviewed and approved by
                a senior engineer, who is accountable for it.
              </p>
              <ul>
                <li>We only use AI services under business terms that do not use your information to train their models.</li>
                <li>
                  The AI systems we build for you work on probability, so they can occasionally be wrong. We design them with checks
                  and a person approving the decisions that matter, and you stay responsible for how their output is used in your business.
                </li>
                <li>
                  Many AI systems rely on outside providers, such as the companies behind the AI models they use. Their own terms
                  and usage charges apply, and we explain both before you commit.
                </li>
              </ul>
            </>,
          },
          {
            id: "working-together", title: "Working together",
            summary: "Good projects depend on both sides. We bring senior people; you bring access, answers and a decision-maker.",
            body: <>
              <p>To keep work on time, we ask you to:</p>
              <ul>
                <li>give us the access, information and people we need, when we need them;</li>
                <li>name one person who can make decisions and sign off work;</li>
                <li>make sure you have the right to share any data or material you give us, and that it may be used for the project.</li>
              </ul>
              <p>If something on your side is delayed, we will tell you early and agree a new plan together.</p>
            </>,
          },
          {
            id: "intellectual-property", title: "Intellectual property",
            summary: "Once paid for, the code and deliverables made for you are yours.",
            body: <>
              <p>
                Unless we agree otherwise in writing, you own the intellectual property in the code and deliverables created
                specifically for your engagement once they are paid for in full.
              </p>
              <p>
                Tools, libraries and frameworks we already had, or build for general use, remain ours. We give you a permanent
                licence to use them as part of what we delivered. Open-source components stay under their own licences, and we
                tell you which ones we use. We do not name you as a client or show your project publicly without your permission.
              </p>
            </>,
          },
          {
            id: "confidentiality", title: "Confidentiality and security",
            summary: "What you share with us stays private. NDAs are standard, before any detailed discussion.",
            body: <>
              <p>
                We treat everything you share in calls and engagements as confidential, and only the people working on your project
                can see it. We sign an NDA on request before any detailed technical or business discussion.
              </p>
              <p>
                Our team has delivered for banks, healthcare platforms and defence organisations, including work requiring UK SC
                (Security Check) clearance, and handles your systems and data to the same standard.
              </p>
            </>,
          },
          {
            id: "data-protection", title: "Data protection",
            summary: "We handle personal data under UK data protection law and will sign a data processing agreement where needed.",
            body: <>
              <p>
                How we handle personal data from this website is explained in our <Link href="/legal/privacy">Privacy Policy</Link>.
                If our work means processing personal data on your behalf, we do so only on your instructions and will sign a data
                processing agreement with you before we start.
              </p>
            </>,
          },
          {
            id: "liability", title: "Responsibility and liability",
            summary: "We stand behind our work. If something goes wrong, our liability is capped at what you paid for that piece of work.",
            body: <>
              <p>
                We carry out our work with reasonable skill and care. If we fall short, tell us and we will put it right.
              </p>
              <p>
                Unless a signed agreement says otherwise, our total liability for a piece of work is limited to the fees you paid for
                it, and we are not liable for indirect losses such as lost profits or lost data. Nothing in these terms limits
                liability that cannot be limited by law, including for death or personal injury caused by negligence, or for fraud.
              </p>
            </>,
          },
          {
            id: "changes", title: "Changes and governing law",
            summary: "If these terms change, the date at the top changes too. English law applies.",
            body: <>
              <p>
                We may update these terms from time to time. Changes do not affect a blueprint you have already paid for or an
                agreement already signed.
              </p>
              <p>These terms are governed by the law of England and Wales, and its courts have jurisdiction over any dispute.</p>
            </>,
          },
        ]} />
    </>
  );
}
