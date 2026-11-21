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
// Christian Kohler's icons, for when his entry below is switched back on.
// import CalculateOutlined from "@mui/icons-material/CalculateOutlined";
// import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";
// import QueryStatsOutlined from "@mui/icons-material/QueryStatsOutlined";
// import SavingsOutlined from "@mui/icons-material/SavingsOutlined";
// import FactCheckOutlined from "@mui/icons-material/FactCheckOutlined";
// import InsightsOutlined from "@mui/icons-material/InsightsOutlined";
import PublicOutlined from "@mui/icons-material/PublicOutlined";
import TranslateOutlined from "@mui/icons-material/TranslateOutlined";
import WorkHistoryOutlined from "@mui/icons-material/WorkHistoryOutlined";
import DnsOutlined from "@mui/icons-material/DnsOutlined";
import BusinessCenterOutlined from "@mui/icons-material/BusinessCenterOutlined";
import MovieCreationOutlined from "@mui/icons-material/MovieCreationOutlined";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";
import AnalyticsOutlined from "@mui/icons-material/AnalyticsOutlined";
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
import founderPhoto from "@/public/brand/founder.webp";
import alexandruPhoto from "@/public/brand/alexandru.webp";
import mohammedPhoto from "@/public/brand/mohammed-ali.webp";
import oisinPhoto from "@/public/brand/oisin.webp";
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
  /** Their portrait, and its public path so search engines get a stable image URL. */
  photo?: { image: typeof founderPhoto; path: string };
  initials: string;
  /** Where they are based, for search engines. Defaults to London. */
  location?: string;
  /** A short paragraph about them, read beside their portrait. */
  bio: string;
  credentials: { Icon: typeof SchoolOutlined; title: string; detail: string }[];
};

const team: Member[] = [
  {
    id: ids.founder,
    name: "Lucas Franco",
    role: "Software engineer, AI engineer & founder",
    linkedIn: "https://www.linkedin.com/in/lucas-franco-b27a194/",
    photo: { image: founderPhoto, path: "/brand/founder.webp" },
    initials: "LF",
    bio: "Lucas has spent over 15 years as a lead engineer on regulated and security-sensitive work: NATO strategy maps and "
      + "classified-document systems, a DICOM medical imaging platform for Bayer with Boston Consulting Group, AI-driven financial "
      + "analysis with Alvarez & Marsal, and a structured-products trading platform running on live Bloomberg data. Clients also "
      + "include HSBC, Credit Suisse and Atlassian.",
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
    id: absoluteUrl("/about#mohammed-ali"),
    name: "Mohammed Ali",
    role: "Strategic partner, media and investment",
    linkedIn: "https://www.linkedin.com/in/mohammed-ali-92973739/",
    photo: { image: mohammedPhoto, path: "/brand/mohammed-ali.webp" },
    initials: "MA",
    location: "Dubai, United Arab Emirates",
    bio: "Mohammed is the founder of Creative International Consultants in Dubai, which raises funding for film and television "
      + "and runs fashion events. He has also been an executive producer at Evolutionary Films in London since 2015, where the "
      + "studio is making Minibots, an animated feature with Kling AI as its exclusive technology partner. He founded and ran "
      + "Argan Oil SL in Spain and Morocco from 2013 to 2024, and he brings financial and business analysis to every project.",
    credentials: [
      { Icon: BusinessCenterOutlined, title: "Founder of Creative International Consultants", detail: "Film and TV fundraising and fashion events, Dubai, since 2019" },
      { Icon: MovieCreationOutlined, title: "Executive producer at Evolutionary Films", detail: "London film studio, since 2015" },
      { Icon: AutoAwesomeOutlined, title: "AI animation with Kling AI", detail: "Minibots, an animated feature from Evolutionary Films" },
      { Icon: StorefrontOutlined, title: "Founder and CEO of Argan Oil SL", detail: "Spain and Morocco, 2013 to 2024" },
      { Icon: AnalyticsOutlined, title: "Financial and business analysis", detail: "Funding, accounting and the business side of projects" },
      { Icon: TranslateOutlined, title: "Works in English and Arabic", detail: "Based in Dubai, United Arab Emirates" },
    ],
  },
  {
    id: absoluteUrl("/about#oisin-omaolchallan"),
    name: "Oisin O’Maolchallan",
    role: "Senior full-stack and AI engineer",
    linkedIn: "https://www.linkedin.com/in/oisin-o-aba110248",
    photo: { image: oisinPhoto, path: "/brand/oisin.webp" },
    initials: "OO",
    bio: "Oisin leads our agentic AI work. He has built multi-client AI agent platforms with governed tool use, memory, "
      + "approvals and audit trails, real-time AI voice systems, and a generative AI media platform that grew to more than "
      + "10,000 users. Before that he built cloud and data platforms at DPD, Telus and Pictet Group, and he automates client "
      + "infrastructure end to end with Terraform.",
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
  /* Hidden for now. To show Christian again, remove this comment and the one around his icon imports above.
  {
    id: absoluteUrl("/about#christian-kohler"),
    name: "Christian Kohler",
    role: "CFO adviser",
    linkedIn: "https://www.linkedin.com/in/christian-kohler-298b6a170/",
    initials: "CK",
    location: "Gold Coast, Australia",
    bio: "Christian is a Chartered Accountant with more than 15 years in commercial finance, treasury accounting and financial "
      + "services audit: treasury P&L reporting at the European Bank for Reconstruction and Development in London, budgeting, "
      + "forecasting and executive reporting at Commonwealth Bank of Australia, and bank audits at PwC. He brings a finance view "
      + "to our work, from the business case for a project to measuring what it saves.",
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
  */
  {
    id: absoluteUrl("/about#alexandru-ivan"),
    name: "Alexandru Ivan",
    role: "Secure infrastructure partner",
    linkedIn: "https://www.linkedin.com/in/alexandru-i-6446442b/",
    photo: { image: alexandruPhoto, path: "/brand/alexandru.webp" },
    initials: "AI",
    location: "La Spezia, Italy",
    bio: "Alexandru has more than 16 years in IT operations, most of them for NATO. He is a senior technician and system "
      + "administrator at the NATO Communications and Information Agency (NCI Agency) in La Spezia, Italy, after system "
      + "administration and IT operations roles for NATO in Mons, Belgium and in Germany. Before that he ran IT and telecoms "
      + "sites in Kabul, Afghanistan for Thales and KBR, and worked for the EU agency eu-LISA in Strasbourg. He works "
      + "professionally in English, French and Italian.",
    credentials: [
      { Icon: ShieldOutlined, title: "Senior technician at NATO’s NCI Agency", detail: "System administrator in La Spezia, Italy, since 2024" },
      { Icon: WorkHistoryOutlined, title: "16+ years of IT for NATO and the EU", detail: "NCI Agency, eu-LISA, Thales, KBR and Leonardo" },
      { Icon: DnsOutlined, title: "System administration and IT operations for NATO", detail: "In Mons, Belgium, and in Germany, 2015 to 2024" },
      { Icon: PublicOutlined, title: "IT and telecoms sites in Kabul, Afghanistan", detail: "For Thales and KBR, 2009 to 2014" },
      { Icon: TranslateOutlined, title: "Works in English, French and Italian", detail: "Plus some Spanish" },
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
  ...(member.photo && { image: absoluteUrl(member.photo.path) }),
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

const paragraph = { m: 0, color: palette.navy[625], fontSize: { xs: "1.05rem", md: "1.15rem" }, lineHeight: 1.7, maxWidth: "62ch" } as const;

// The same two columns as the split sections, so the team lines up with the sections around it:
// each person on the left, what they do on the right.
const columns = { xs: "minmax(0, 1fr)", md: "minmax(0, 3fr) minmax(0, 7fr)" } as const;
const columnGap = "clamp(48px, 7vw, 112px)";
const rule = `1px solid ${withAlpha(palette.blue[500], 0.16)}`;

// Each portrait ringed in the brand's light.
const ring = {
  position: "relative", flex: "none", width: { xs: 92, md: 136 }, aspectRatio: "1", borderRadius: "50%", p: "4px",
  background: `conic-gradient(from 200deg, ${palette.blue[350]}, ${palette.sky[100]}, ${palette.blue[500]}, ${palette.blue[350]})`,
  boxShadow: `0 0 0 6px ${withAlpha(palette.blue[500], 0.12)}, 0 18px 40px -18px ${withAlpha(palette.blue[500], 0.8)}`,
} as const;

function TeamMember({ member }: { member: Member }) {
  return (
    <Box component="li" id={member.id.split("#")[1]} sx={{ display: "grid", gridTemplateColumns: columns, columnGap, rowGap: 3,
      alignItems: "start", py: { xs: 4.5, md: 7 }, borderTop: rule }}>
      {/* Who they are. On wide screens it stays in view while their details scroll past. */}
      <Box sx={{ position: { md: "sticky" }, top: { md: 112 }, display: "flex", flexDirection: { xs: "row", md: "column" },
        alignItems: { xs: "center", md: "flex-start" }, gap: { xs: 2.5, md: 0 } }}>
        {/* The portrait opens their LinkedIn profile too. The LinkedIn link below is the one keyboards and
            screen readers use, so this one stays out of the tab order instead of announcing the same link twice. */}
        <Box {...(member.linkedIn && { component: "a", href: member.linkedIn, target: "_blank", rel: "noopener noreferrer",
          tabIndex: -1, "aria-hidden": true, title: `${member.name} on LinkedIn` })}
          sx={{ ...ring, display: "block", ...(member.linkedIn && {
            transition: "transform .3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow .3s",
            "&:hover": { transform: "scale(1.04)", boxShadow: `0 0 0 6px ${withAlpha(palette.blue[500], 0.22)}, 0 22px 44px -18px ${withAlpha(palette.blue[500], 0.9)}` },
            "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } },
          }) }}>
          {member.photo
            ? <Image src={member.photo.image} alt={member.name} width={136} height={136} sizes="(min-width: 900px) 136px, 92px"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }} />
            : <Box aria-hidden="true" sx={{ width: "100%", height: "100%", borderRadius: "50%", display: "grid", placeItems: "center",
                background: `linear-gradient(150deg, ${palette.navy[675]}, ${palette.navy[775]})`,
                color: palette.sky[100], fontSize: { xs: "1.7rem", md: "2.4rem" }, fontWeight: 700, letterSpacing: "-0.04em" }}>{member.initials}</Box>}
        </Box>
        <Box sx={{ mt: { md: 2.75 } }}>
          <Box component="h3" sx={{ m: 0, fontSize: { xs: "1.3rem", md: "1.55rem" }, fontWeight: 700, color: palette.navy[725],
            letterSpacing: "-0.025em", lineHeight: 1.2 }}>{member.name}</Box>
          <Box component="p" sx={{ m: "6px 0 0", color: palette.blue[500], fontWeight: 600, fontSize: ".98rem", lineHeight: 1.4 }}>{member.role}</Box>
          {member.linkedIn && (
            <Box component="a" href={member.linkedIn} target="_blank" rel="noopener noreferrer" className="link-draw"
              aria-label={`${member.name} on LinkedIn (opens in a new tab)`}
              sx={{ mt: { xs: 0.5, md: 1.25 }, display: "inline-flex", alignItems: "center", gap: 1, minHeight: 44, color: palette.blue[550],
                fontWeight: 600, fontSize: ".95rem", "& svg": { fontSize: 20, color: palette.blue[500] }, "&:hover": { color: palette.navy[650] } }}>
              <LinkedInIcon aria-hidden="true" />LinkedIn
            </Box>
          )}
        </Box>
      </Box>

      {/* What they do: a short paragraph, then the highlights in two columns. */}
      <Box sx={{ minWidth: 0 }}>
        <Box component="p" sx={paragraph}>{member.bio}</Box>
        <Box component="ul" sx={{ listStyle: "none", m: "28px 0 0", p: 0, display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" }, columnGap: 3.5, rowGap: 2.25 }}>
          {member.credentials.map(({ Icon, title, detail }) => (
            <Box component="li" key={title} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Box sx={{ display: "grid", placeItems: "center", flex: "none", width: 34, height: 34, borderRadius: "10px", bgcolor: palette.white,
                color: palette.blue[500], boxShadow: `0 6px 16px -10px ${withAlpha(palette.blue[500], 0.9)}`, "& svg": { fontSize: 19 } }}><Icon aria-hidden="true" /></Box>
              <Box>
                <Box component="p" sx={{ m: 0, fontWeight: 650, color: palette.navy[725], lineHeight: 1.35, fontSize: ".95rem" }}>{title}</Box>
                <Box component="p" sx={{ m: "2px 0 0", color: palette.slate[525], fontSize: ".88rem", lineHeight: 1.45 }}>{detail}</Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

const expertise = [
  { title: "AI agents and LLM products", detail: "Tool calling, memory, retrieval, guardrails, evaluations and audit logs, with OpenAI, Gemini and local models." },
  { title: "Secure, regulated systems", detail: "NATO classified-document and geospatial platforms, banking and medical imaging, built test-first with TDD/BDD." },
  { title: "Cloud and infrastructure", detail: "Azure, AWS and GCP with Kubernetes, serverless, Terraform, Docker and CI/CD pipelines." },
  { title: "Real-time and data platforms", detail: "Live market data over WebSockets, voice AI on Twilio, and BigQuery and Pub/Sub pipelines at scale." },
  { title: "Full-stack products", detail: "React, Next.js, Angular, TypeScript, Node.js, Java and Python, from MVP to enterprise." },
  { title: "Mobile, messaging and integrations", detail: "React Native and Flutter apps, Stripe, Shopify, Bloomberg, WhatsApp and Google APIs." },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[...people, breadcrumbs([{ name: "About", path: "/about" }])]} />
      <PageHero
        eyebrow="About"
        title="Meet the team behind BlueTrendy"
        subtitle="BlueTrendy is a London AI and software team, founded in 2014. We build production software for banks, government agencies, healthcare teams and enterprise software companies. The people who plan your project are the people who build it."
      />

      <Box component="section" aria-labelledby="team-heading" sx={{ position: "relative", isolation: "isolate", overflow: "clip",
        bgcolor: palette.grey[25], pb: { xs: 5, md: 8 } }}>
        {/* The booking page's lattice of dots on springs, which gives way under the mouse. The section is
            tall, so the canvas covers only the screen and stays put while the team scrolls past. */}
        <LivingBackground effect="springGrid" light quiet="none" pinned seed={113} />
        <Box sx={{ position: "relative", zIndex: 1, width: "var(--page-width)", mx: "auto" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: columns, columnGap, rowGap: 2.5, alignItems: "end",
            pt: { xs: 5, md: "clamp(56px, 7vw, 96px)" }, pb: { xs: 4, md: 6 } }}>
            <Box>
              <HeadingMotion id="team-heading" text="Our team" tone="light" sx={{ m: 0, fontWeight: 650, letterSpacing: "-0.06em",
                fontSize: "clamp(2.6rem, 4.6vw, 4.5rem)", lineHeight: 1.04 }} />
              <Box component="p" sx={{ m: "16px 0 0", maxWidth: "31ch", color: palette.slate[525], fontSize: "clamp(1rem, 1.2vw, 1.125rem)", lineHeight: 1.55 }}>
                Small and senior by design. Our engineers write the code, from the first call to handover.
              </Box>
            </Box>
            <Box component="p" sx={paragraph}>
              The people you meet on the first call work on your system. Between us we bring more than 25 years of
              production engineering for banks, defence agencies, healthcare companies, global consultancies and
              fast-growing startups.
            </Box>
          </Box>
          <Box component="ul" aria-label="Team members" sx={{ listStyle: "none", m: 0, p: 0, borderBottom: rule }}>
            {team.map(member => <TeamMember key={member.name} member={member} />)}
          </Box>
        </Box>
      </Box>

      <SplitSection id="expertise-heading" title="What we bring together" effect="springGrid" seed={127} pinned
        text="What our engineers cover, so you can match it to your own project.">
        <Box component="p" sx={paragraph}>
          Our background shapes how we work: TDD/BDD discipline where correctness matters, cloud-native architecture on
          AWS and Azure, and a track record of managing teams (up to 25 developers at once at Lloyds Bank) without stepping
          away from the keyboard. AI is part of the toolkit, used to move faster on scaffolding, testing and automation,
          but engineering judgment stays human, senior and accountable.
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
        <Box component="ul" sx={{ listStyle: "none", m: "28px 0 0", p: 0, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
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
