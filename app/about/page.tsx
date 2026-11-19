import type { Metadata } from "next";
import Image from "next/image";
import Box from "@mui/material/Box";
import SchoolOutlined from "@mui/icons-material/SchoolOutlined";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";
import SpaOutlined from "@mui/icons-material/SpaOutlined";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
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
  title: "About Us: London Software & AI Team",
  description: "A London software and AI team led by a hands-on founder with 15+ years in banking, defence, healthcare and enterprise SaaS. UK SC cleared.",
  path: "/about",
});

const founder = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": ids.founder,
  name: "Lucas Franco",
  jobTitle: "Founder and lead engineer",
  image: absoluteUrl("/brand/founder.png"),
  url: absoluteUrl("/about"),
  worksFor: organizationRef,
  homeLocation: { "@type": "Place", name: "London, UK" },
};

const credentials = [
  { Icon: SchoolOutlined, title: "B.S. Economic Cybernetics, Statistics & Informatics", detail: "LSE University, London" },
  { Icon: VerifiedUserOutlined, title: "UK SC (Security Check) cleared", detail: "Based in London, UK" },
];

const valueIcons = [SpaOutlined, TrendingUpRounded, AutoAwesomeOutlined];

const engagements = timeline.map(item => {
  const study = caseStudies.find(entry => entry.client === item.org);
  return { ...item, href: study ? "/case-studies/" + study.slug : undefined };
});
const firstYear = timeline.at(-1)?.period.match(/\d{4}/)?.[0];

// The team on the blade: each member's portrait ringed in the brand's light, with their role and credentials.
const portrait = (
  <Box sx={{ mt: 3.5, width: "100%" }}>
    <Box sx={{ position: "relative", width: 150, aspectRatio: "1", borderRadius: "50%", p: "4px",
      background: `conic-gradient(from 200deg, ${palette.blue[350]}, ${palette.sky[100]}, ${palette.blue[500]}, ${palette.blue[350]})`,
      boxShadow: `0 0 0 6px ${withAlpha(palette.blue[500], 0.12)}, 0 18px 40px -18px ${withAlpha(palette.blue[500], 0.8)}` }}>
      <Image src={founderPhoto} alt="Lucas Franco" width={150} height={150} sizes="150px"
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }} />
    </Box>
    <Box component="h3" sx={{ m: "20px 0 0", fontSize: "1.3rem", fontWeight: 700, color: palette.navy[725], letterSpacing: "-0.02em" }}>Lucas Franco</Box>
    <Box component="p" sx={{ m: "4px 0 0", color: palette.blue[500], fontWeight: 600, fontSize: ".95rem" }}>Founder and lead engineer</Box>
    <Box component="ul" sx={{ listStyle: "none", m: "24px 0 0", p: 0, display: "grid", gap: 1.5 }}>
      {credentials.map(({ Icon, title, detail }) => (
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
  </Box>
);

const paragraph = { m: 0, color: palette.navy[625], fontSize: { xs: "1.05rem", md: "1.15rem" }, lineHeight: 1.7, maxWidth: "62ch" } as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[founder, breadcrumbs([{ name: "About", path: "/about" }])]} />
      <PageHero
        eyebrow="About"
        title="Meet the team behind BlueTrendy"
        subtitle="We’re a London software and AI team building production software for banks, government agencies, healthcare teams and enterprise software companies. The people who plan your project are the people who build it."
      />

      <SplitSection id="team-heading" title="Our team" effect="dotField" seed={131}
        text="Small and senior by design. Everyone on the team writes code, from the first call to handover." blade={portrait}>
        <Box sx={{ display: "grid", gap: 2.5 }}>
          <Box component="p" sx={paragraph}>
            The people you meet on the first call work on your system. Our experience includes regulated and
            security-sensitive projects for NATO, HSBC, Credit Suisse, Atlassian and Boston Consulting Group.
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
      </SplitSection>

      <Box component="section" aria-labelledby="principles-heading" sx={{ ...neural.sectionTone("header", "services"), py: { xs: 7, md: 10 } }}>
        <LivingBackground effect="dotWave" quiet="top" seed={97} />
        <Box sx={{ position: "relative", zIndex: 1, width: "min(100% - 48px, 1200px)", mx: "auto" }}>
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
        text="Banks, defence agencies, healthcare platforms and software companies. Each engagement shipped to production."
        link={{ href: "/case-studies", label: "Read the case studies" }}
        effect="constellation" seed={101} background={neural.blueFlow("services", "header")}>
        <SignalTimeline entries={engagements} />
      </SplitSection>

      <CTASection location="about_page" title="Talk to the people who will build it" subtitle="Bring the problem you’re working on. We’ll look at the technical constraints and the first release together." />
    </>
  );
}
