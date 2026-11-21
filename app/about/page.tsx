import type { Metadata } from "next";
import Image from "next/image";
import Box from "@mui/material/Box";
import SchoolOutlined from "@mui/icons-material/SchoolOutlined";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";
import SpaOutlined from "@mui/icons-material/SpaOutlined";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import HubOutlined from "@mui/icons-material/HubOutlined";
import CloudDoneOutlined from "@mui/icons-material/CloudDoneOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WorkspacePremiumOutlined from "@mui/icons-material/WorkspacePremiumOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import PsychologyOutlined from "@mui/icons-material/PsychologyOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import RecordVoiceOverOutlined from "@mui/icons-material/RecordVoiceOverOutlined";
import RocketLaunchOutlined from "@mui/icons-material/RocketLaunchOutlined";
import StorageOutlined from "@mui/icons-material/StorageOutlined";
import ChatOutlined from "@mui/icons-material/ChatOutlined";
import CalculateOutlined from "@mui/icons-material/CalculateOutlined";
import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";
import QueryStatsOutlined from "@mui/icons-material/QueryStatsOutlined";
import SavingsOutlined from "@mui/icons-material/SavingsOutlined";
import FactCheckOutlined from "@mui/icons-material/FactCheckOutlined";
import InsightsOutlined from "@mui/icons-material/InsightsOutlined";
import PageHero from "@/components/PageHero";
import SplitSection from "@/components/SplitSection";
import CTASection from "@/components/CTASection";
import SignalTimeline from "@/components/interior/SignalTimeline";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import HeadingMotion from "@/components/motion/HeadingMotion";
import { neural } from "@/components/experience/neuralStyle";
import { caseStudies } from "@/data/caseStudies";
import { timeline, values } from "@/data/timeline";
import { proofStats } from "@/data/stats";
import founderPhoto from "@/public/brand/founder.png";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, breadcrumbs, ids, organizationRef, pageMetadata } from "@/lib/seo";
import { palette, withAlpha } from "@/theme/palette";

export const metadata: Metadata = pageMetadata({
  title: "About Us: London AI & Software Team",
  description: "A London AI and software team led by a hands-on founder with 15+ years of engineering in banking, defence, healthcare and enterprise SaaS. UK SC cleared.",
  path: "/about",
});

type Member = {
  id: string;
  name: string;
  role: string;
  /** Their personal LinkedIn profile; the link shows only when it is set. */
  linkedIn?: string;
  photo?: typeof founderPhoto;
  initials: string;
  /** Where they are based, for search engines. Defaults to London. */
  location?: string;
  credentials: { Icon: typeof SchoolOutlined; title: string; detail: string }[];
};

const team: Member[] = [
  {
    id: ids.founder,
    name: "Lucas Franco",
    role: "Software engineer, AI engineer & founder",
    linkedIn: undefined,
    photo: founderPhoto,
    initials: "LF",
    credentials: [
      { Icon: WorkspacePremiumOutlined, title: "Lead software engineer, 15+ years", detail: "Banking, defence, healthcare and enterprise SaaS" },
      { Icon: ShieldOutlined, title: "Lead engineer on NATO programmes", detail: "Classified document systems and geospatial strategy platforms" },
      { Icon: PsychologyOutlined, title: "AI in production for BCG, Bayer and A&M", detail: "Medical imaging, financial analysis and predictive maintenance" },
      { Icon: CloudDoneOutlined, title: "Cloud architect on Azure and AWS", detail: "Kubernetes, serverless, CI/CD and TDD/BDD" },
      { Icon: GroupsOutlined, title: "Hands-on team lead", detail: "Led up to 25 developers at Lloyds Bank" },
      { Icon: SchoolOutlined, title: "B.S. Economic Cybernetics, Statistics & Informatics", detail: "London School of Economics (LSE)" },
      { Icon: VerifiedUserOutlined, title: "UK SC (Security Check) cleared", detail: "Based in London, UK" },
    ],
  },
  {
    id: absoluteUrl("/about#oisin-omaolchallan"),
    name: "Oisin O’Maolchallan",
    role: "Senior full-stack and AI engineer",
    linkedIn: "https://www.linkedin.com/in/oisin-o-aba110248",
    initials: "OO",
    credentials: [
      { Icon: WorkspacePremiumOutlined, title: "Senior full-stack engineer, 10+ years", detail: "Production SaaS, AI products and real-time systems" },
      { Icon: HubOutlined, title: "Lead developer of agentic AI platforms", detail: "Orchestration, tool use, memory, approvals and audit trails" },
      { Icon: RocketLaunchOutlined, title: "Generative AI platform for 10,000+ users", detail: "Built front and back end alone, in under 3 months" },
      { Icon: RecordVoiceOverOutlined, title: "Real-time AI voice and messaging", detail: "Twilio, Deepgram, OpenAI and ElevenLabs" },
      { Icon: CloudDoneOutlined, title: "Cloud and infrastructure as code", detail: "AWS, GCP, Terraform, Terragrunt and Docker" },
      { Icon: StorageOutlined, title: "Data platforms at scale", detail: "Hundreds of millions of BigQuery rows at DPD" },
      { Icon: ChatOutlined, title: "Meta Verified Tech Provider", detail: "WhatsApp, Instagram and Facebook integrations" },
    ],
  },
  {
    id: absoluteUrl("/about#christian-kohler"),
    name: "Christian Kohler",
    role: "CFO adviser",
    linkedIn: "https://www.linkedin.com/in/christian-kohler-298b6a170/",
    initials: "CK",
    location: "Gold Coast, Australia",
    credentials: [
      { Icon: CalculateOutlined, title: "Chartered Accountant, 15+ years", detail: "Commercial finance, treasury accounting and audit" },
      { Icon: AccountBalanceOutlined, title: "Treasury accounting at the EBRD, London", detail: "P&L reporting for bonds, swaps and derivatives" },
      { Icon: QueryStatsOutlined, title: "Finance business partner at Commonwealth Bank", detail: "Budgets, forecasts and executive reporting packs" },
      { Icon: SavingsOutlined, title: "A$50m+ a year in recurring cost savings", detail: "Contributed to a customer migration at Commonwealth Bank" },
      { Icon: FactCheckOutlined, title: "Financial services audit at PwC", detail: "Bank audits in Sydney, Frankfurt, Singapore and Toronto" },
      { Icon: InsightsOutlined, title: "Business cases and reporting automation", detail: "Excel, Tableau, SAP and Oracle" },
      { Icon: SchoolOutlined, title: "Bachelor of Commerce and Bachelor of Laws", detail: "Bond University" },
    ],
  },
];

// Each team member, for search engines, with their LinkedIn profile where we have it.
const people = team.map(member => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": member.id,
  name: member.name,
  jobTitle: member.role,
  ...(member.photo && { image: absoluteUrl("/brand/founder.png") }),
  url: absoluteUrl("/about"),
  ...(member.linkedIn && { sameAs: [member.linkedIn] }),
  worksFor: organizationRef,
  homeLocation: { "@type": "Place", name: member.location ?? "London, UK" },
}));

const valueIcons = [SpaOutlined, TrendingUpRounded, AutoAwesomeOutlined];

const engagements = timeline.map(item => {
  const study = caseStudies.find(entry => entry.client === item.org);
  return { ...item, href: study ? "/case-studies/" + study.slug : undefined };
});
const firstYear = timeline.at(-1)?.period.match(/\d{4}/)?.[0];

// The team on the blade: each member's portrait ringed in the brand's light, with their role,
// credentials and LinkedIn profile.
const ring = {
  position: "relative", width: 112, aspectRatio: "1", borderRadius: "50%", p: "4px",
  background: `conic-gradient(from 200deg, ${palette.blue[350]}, ${palette.sky[100]}, ${palette.blue[500]}, ${palette.blue[350]})`,
  boxShadow: `0 0 0 6px ${withAlpha(palette.blue[500], 0.12)}, 0 18px 40px -18px ${withAlpha(palette.blue[500], 0.8)}`,
} as const;

const members = (
  <Box component="ul" aria-label="Team members" sx={{ listStyle: "none", m: "28px 0 0", p: 0, width: "100%", display: "grid", gap: 4.5 }}>
    {team.map(member => (
      <Box component="li" key={member.name} id={member.id.split("#")[1]}>
        <Box sx={ring}>
          {member.photo
            ? <Image src={member.photo} alt={member.name} width={112} height={112} sizes="112px"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }} />
            : <Box aria-hidden="true" sx={{ width: "100%", height: "100%", borderRadius: "50%", display: "grid", placeItems: "center",
                background: `linear-gradient(150deg, ${palette.navy[675]}, ${palette.navy[775]})`,
                color: palette.sky[100], fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.04em" }}>{member.initials}</Box>}
        </Box>
        <Box component="h3" sx={{ m: "18px 0 0", fontSize: "1.3rem", fontWeight: 700, color: palette.navy[725], letterSpacing: "-0.02em" }}>{member.name}</Box>
        <Box component="p" sx={{ m: "4px 0 0", color: palette.blue[500], fontWeight: 600, fontSize: ".95rem" }}>{member.role}</Box>
        <Box component="ul" sx={{ listStyle: "none", m: "18px 0 0", p: 0, display: "grid", gap: 1.5 }}>
          {member.credentials.map(({ Icon, title, detail }) => (
            <Box component="li" key={title} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Box sx={{ display: "grid", placeItems: "center", flex: "none", width: 34, height: 34, borderRadius: "10px", bgcolor: palette.white,
                color: palette.blue[500], boxShadow: `0 6px 16px -10px ${withAlpha(palette.blue[500], 0.9)}`, "& svg": { fontSize: 19 } }}><Icon aria-hidden="true" /></Box>
              <Box>
                <Box component="p" sx={{ m: 0, fontWeight: 650, color: palette.navy[725], lineHeight: 1.35, fontSize: ".95rem" }}>{title}</Box>
                <Box component="p" sx={{ m: "2px 0 0", color: palette.slate[525], fontSize: ".88rem" }}>{detail}</Box>
              </Box>
            </Box>
          ))}
        </Box>
        {member.linkedIn && (
          <Box component="a" href={member.linkedIn} target="_blank" rel="noopener noreferrer" className="link-draw"
            aria-label={`${member.name} on LinkedIn (opens in a new tab)`}
            sx={{ mt: 2, display: "inline-flex", alignItems: "center", gap: 1, minHeight: 44, color: palette.blue[550], fontWeight: 600, fontSize: ".95rem",
              "& svg": { fontSize: 20, color: palette.blue[500] }, "&:hover": { color: palette.navy[650] } }}>
            <LinkedInIcon aria-hidden="true" />LinkedIn
          </Box>
        )}
      </Box>
    ))}
  </Box>
);

const expertise = [
  { title: "AI agents and LLM products", detail: "Tool calling, memory, retrieval, guardrails, evaluations and audit logs, with OpenAI, Gemini and local models." },
  { title: "Secure, regulated systems", detail: "NATO classified-document and geospatial platforms, banking and medical imaging, built test-first with TDD/BDD." },
  { title: "Cloud and infrastructure", detail: "Azure, AWS and GCP with Kubernetes, serverless, Terraform, Docker and CI/CD pipelines." },
  { title: "Real-time and data platforms", detail: "Live market data over WebSockets, voice AI on Twilio, and BigQuery and Pub/Sub pipelines at scale." },
  { title: "Full-stack products", detail: "React, Next.js, Angular, TypeScript, Node.js, Java and Python, from MVP to enterprise." },
  { title: "Mobile, messaging and integrations", detail: "React Native and Flutter apps, Stripe, Shopify, Bloomberg, WhatsApp and Google APIs." },
];

const paragraph = { m: 0, color: palette.navy[625], fontSize: { xs: "1.05rem", md: "1.15rem" }, lineHeight: 1.7, maxWidth: "62ch" } as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[...people, breadcrumbs([{ name: "About", path: "/about" }])]} />
      <PageHero
        eyebrow="About"
        title="Meet the team behind BlueTrendy"
        subtitle="BlueTrendy is a London AI and software team, founded in 2014. We build production software for banks, government agencies, healthcare teams and enterprise software companies. The people who plan your project are the people who build it."
      />

      <SplitSection id="team-heading" title="Our team" effect="dotField" seed={131}
        text="Small and senior by design. Our engineers write the code, from the first call to handover." blade={members}>
        <Box sx={{ display: "grid", gap: 2.5 }}>
          <Box component="p" sx={paragraph}>
            The people you meet on the first call work on your system. Between us we bring more than 25 years of
            production engineering for banks, defence agencies, healthcare companies, global consultancies and
            fast-growing startups.
          </Box>
          <Box component="p" sx={paragraph}>
            Our founder, Lucas Franco, has spent over 15 years as a lead engineer on regulated and security-sensitive
            work: NATO strategy maps and classified-document systems, a DICOM medical imaging platform for Bayer with
            Boston Consulting Group, AI-driven financial analysis with Alvarez &amp; Marsal, and a structured-products
            trading platform running on live Bloomberg data. Clients also include HSBC, Credit Suisse and Atlassian.
          </Box>
          <Box component="p" sx={paragraph}>
            Oisin O’Maolchallan leads our agentic AI work. He has built multi-client AI agent platforms with governed tool
            use, memory, approvals and audit trails, real-time AI voice systems, and a generative AI media platform that
            grew to more than 10,000 users. Before that he built cloud and data platforms at DPD, Telus and Pictet Group,
            and he automates client infrastructure end to end with Terraform.
          </Box>
          <Box component="p" sx={paragraph}>
            Christian Kohler is our CFO adviser. He is a Chartered Accountant with more than 15 years in commercial finance,
            treasury accounting and financial services audit: treasury P&amp;L reporting at the European Bank for Reconstruction
            and Development in London, budgeting, forecasting and executive reporting at Commonwealth Bank of Australia, and
            bank audits at PwC. He brings a finance view to our work, from the business case for a project to measuring what
            it saves.
          </Box>
          <Box component="p" sx={paragraph}>
            That background shapes how we work: TDD/BDD discipline where correctness matters, cloud-native architecture on
            AWS and Azure, and a track record of managing teams (up to 25 developers at once at Lloyds Bank) without stepping
            away from the keyboard. AI is part of the toolkit, used to move faster on scaffolding, testing and automation,
            but engineering judgment stays human, senior and accountable.
          </Box>
        </Box>
        <Box sx={{ m: "36px 0 0", display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, gap: 2 }}>
          {proofStats.slice(0, 3).map(stat => (
            <Box key={stat.label} data-panel sx={{ p: 2.5, borderRadius: "14px", background: `linear-gradient(160deg, ${palette.navy[675]}, ${palette.navy[775]})`,
              border: `1px solid ${withAlpha(palette.sky[150], 0.35)}`, boxShadow: `0 18px 36px -22px ${withAlpha(palette.navy[675], 0.9)}, inset 0 1px 0 ${withAlpha(palette.sky[175], 0.25)}` }}>
              <Box component="p" sx={{ m: 0, ...neural.accentText, fontSize: "clamp(2rem, 3.2vw, 2.6rem)", fontWeight: 680, letterSpacing: "-0.05em", lineHeight: 1 }}>
                {stat.value}
              </Box>
              <Box component="p" sx={{ m: "10px 0 0", color: palette.slate[125], fontSize: ".92rem", lineHeight: 1.45 }}>{stat.label}</Box>
            </Box>
          ))}
        </Box>
        {/* What the engineering team covers, so a visitor can match it to their own project. */}
        <Box component="h3" sx={{ m: "44px 0 0", fontSize: "1.35rem", fontWeight: 700, color: palette.navy[725], letterSpacing: "-0.025em" }}>
          What we bring together
        </Box>
        <Box component="ul" sx={{ listStyle: "none", m: "18px 0 0", p: 0, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
          {expertise.map(({ title, detail }) => (
            <Box component="li" key={title} sx={{ p: 2.25, borderRadius: "14px", bgcolor: palette.white, border: `1px solid ${withAlpha(palette.blue[500], 0.14)}`,
              boxShadow: `0 14px 30px -24px ${withAlpha(palette.blue[500], 0.8)}` }}>
              <Box component="p" sx={{ m: 0, fontWeight: 650, color: palette.navy[725], fontSize: "1rem", lineHeight: 1.35 }}>{title}</Box>
              <Box component="p" sx={{ m: "6px 0 0", color: palette.slate[525], fontSize: ".92rem", lineHeight: 1.55 }}>{detail}</Box>
            </Box>
          ))}
        </Box>
      </SplitSection>

      <Box component="section" aria-labelledby="principles-heading" sx={{ ...neural.sectionTone("header", "services"), py: { xs: 7, md: 10 } }}>
        <LivingBackground effect="dotWave" quiet="top" seed={97} />
        <Box sx={{ position: "relative", zIndex: 1, width: "var(--page-width)", mx: "auto" }}>
          <HeadingMotion id="principles-heading" text="What we" accent="optimize for"
            sx={{ m: 0, maxWidth: "18ch", fontSize: "clamp(2.2rem, 4.2vw, 3.6rem)", fontWeight: 650, letterSpacing: "-0.05em", lineHeight: 1.05 }} />
          <Box data-panel-group sx={{ mt: { xs: 4, md: 5 }, display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: 2.5 }}>
            {values.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length];
              return (
                <Box key={value.title} data-panel sx={{ ...neural.glassCard, p: { xs: 3, md: 3.5 }, minHeight: { md: 220 } }}>
                  <Box sx={{ ...neural.iconOrb, position: "relative", zIndex: 1 }}><Icon aria-hidden="true" /></Box>
                  <Box component="h3" sx={{ position: "relative", zIndex: 1, m: "22px 0 0", fontSize: "1.45rem", fontWeight: 650, letterSpacing: "-0.03em" }}>
                    {value.title}
                  </Box>
                  <Box component="p" sx={{ position: "relative", zIndex: 1, m: "10px 0 0", color: palette.slate[125], lineHeight: 1.6 }}>{value.description}</Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      <SplitSection id="career-heading" tone="dark" pinned title={`Selected engagements since ${firstYear}`}
        text="Banks, defence agencies, healthcare platforms and software companies. Every engagement shipped to production, and many are still in active development."
        link={{ href: "/case-studies", label: "Read the case studies" }}
        effect="constellation" seed={101} background={neural.blueFlow("services", "header")}>
        <SignalTimeline entries={engagements} />
      </SplitSection>

      <CTASection location="about_page" title="Talk to the people who will build it" subtitle="Bring the problem you’re working on. We’ll look at the technical constraints and the first release together." />
    </>
  );
}
