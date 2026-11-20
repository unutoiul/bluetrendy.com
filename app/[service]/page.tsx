import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ArrowDownwardRounded from "@mui/icons-material/ArrowDownwardRounded";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import StraightenOutlined from "@mui/icons-material/StraightenOutlined";
import PageHero from "@/components/PageHero";
import SplitSection from "@/components/SplitSection";
import CTASection from "@/components/CTASection";
import LinkButton from "@/components/LinkButton";
import JsonLd from "@/components/JsonLd";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import HeadingMotion from "@/components/motion/HeadingMotion";
import ServiceDemo, { demoIntro } from "@/components/service/ServiceDemo";
import { neural } from "@/components/experience/neuralStyle";
import { caseStudies, founderRole } from "@/data/caseStudies";
import { getService, services } from "@/data/services";
import { absoluteUrl, breadcrumbs, organizationRef, pageMetadata } from "@/lib/seo";
import { brand } from "@/theme/theme";
import { palette, withAlpha } from "@/theme/palette";

type ServicePageProps = { params: Promise<{ service: string }> };

// One page for each of the seven services, at the site root: /ai-agents, /predictive-ai and so on.
// Any other address at this level is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map(({ slug }) => ({ service: slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = getService((await params).service);
  if (!service) return {};
  return pageMetadata({
    title: service.seoTitle,
    description: `${service.shortDescription} ${service.value}`,
    path: "/" + service.slug,
  });
}

const sectionHeading = { m: 0, fontSize: "clamp(2.1rem, 4.4vw, 3.9rem)", fontWeight: 630, letterSpacing: "-0.047em", lineHeight: 1.06 } as const;
const lightHeading = { m: 0, color: brand.ink, fontSize: "clamp(1.5rem, 2.4vw, 2rem)", fontWeight: 650, letterSpacing: "-0.045em", lineHeight: 1.15 } as const;
const eyebrow = { ...neural.label, color: brand.blue, "&::after": { content: '""', width: 34, height: "1px", background: `linear-gradient(90deg, ${brand.blue}, transparent)` } } as const;

export default async function ServicePage({ params }: ServicePageProps) {
  const service = getService((await params).service);
  if (!service) notFound();
  const path = "/" + service.slug;
  const intro = demoIntro[service.demo];
  const proof = service.caseStudies.flatMap(slug => caseStudies.filter(study => study.slug === slug));
  const others = services.filter(item => item.slug !== service.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl(path) + "#service",
    url: absoluteUrl(path),
    name: service.name,
    serviceType: service.name,
    description: `${service.description} ${service.value}`,
    provider: organizationRef,
    areaServed: { "@type": "Country", name: "United Kingdom" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.listTitle,
      itemListElement: service.bullets.map(bullet => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: bullet } })),
    },
  };

  return <>
    <JsonLd data={[schema, breadcrumbs([{ name: "Services", path: "/services" }, { name: service.name, path }])]} />
    <PageHero eyebrow={`${service.number} · ${service.name}`} title={service.headline[0]} accent={service.headline[1]} subtitle={service.description}
      aside={<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}>
        <LinkButton href="/book-a-call" variant="contained" size="large" endIcon={<ArrowForwardRounded />}>{service.cta}</LinkButton>
        <LinkButton href="#demo" variant="outlined" tone="dark" size="large" endIcon={<ArrowDownwardRounded />}>See it work</LinkButton>
      </Box>} />

    {/* The business result first, then what is delivered and how it is measured. */}
    <SplitSection id="value-heading" title={service.listTitle} text={service.value} effect="dotField" seed={31}
      link={{ href: "#demo", label: "See it work" }}>
      <Box component="ul" data-panel-group sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.5,
        gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" } }}>
        {service.bullets.map(bullet => (
          <Box component="li" key={bullet} data-panel="reveal" sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", p: 2, borderRadius: "14px",
            background: `linear-gradient(170deg, ${palette.white}, ${palette.grey[25]})`, border: `1px solid ${palette.slate[150]}`,
            boxShadow: `0 18px 40px -32px ${withAlpha(palette.navy[750], 0.5)}`, color: palette.navy[725], fontWeight: 600, lineHeight: 1.4,
            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            "&:hover": { borderColor: palette.blue[200], boxShadow: `0 22px 44px -28px ${withAlpha(palette.blue[500], 0.5)}` } }}>
            <CheckCircleRounded aria-hidden="true" sx={{ flex: "none", mt: "1px", fontSize: 22, color: palette.blue[500] }} />{bullet}
          </Box>
        ))}
      </Box>

      <Box component="h3" sx={{ ...lightHeading, mt: { xs: 5, md: 6 } }}>
        What we measure, <Box component="span" sx={{ color: palette.blue[500] }}>so you can see it paid off</Box>
      </Box>
      <Box component="ul" data-panel-group sx={{ listStyle: "none", m: "20px 0 0", p: 0, display: "grid", gap: 2,
        gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(3, minmax(0, 1fr))" } }}>
        {service.measures.map(measure => (
          <Box component="li" key={measure} data-panel sx={{ p: 2.5, borderRadius: "14px", background: `linear-gradient(160deg, ${palette.navy[675]}, ${palette.navy[775]})`,
            border: `1px solid ${withAlpha(palette.sky[150], 0.35)}`, boxShadow: `0 18px 36px -22px ${withAlpha(palette.navy[675], 0.9)}, inset 0 1px 0 ${withAlpha(palette.sky[175], 0.25)}` }}>
            <StraightenOutlined aria-hidden="true" sx={{ fontSize: 24, color: palette.sky[150] }} />
            <Box component="p" sx={{ m: "10px 0 0", color: palette.grey[25], fontSize: "1.05rem", fontWeight: 620, letterSpacing: "-0.02em", lineHeight: 1.35 }}>{measure}</Box>
          </Box>
        ))}
      </Box>
      <Box component="p" sx={{ m: "14px 0 0", color: palette.slate[525], fontSize: "0.88rem", lineHeight: 1.55, maxWidth: "70ch" }}>
        These are the figures we agree to track with you. They are measures, not promised results: the numbers come from your own project.
      </Box>
    </SplitSection>

    {/* The work itself, shown rather than described. */}
    <Box component="section" id="demo" aria-labelledby="demo-heading" sx={{ ...neural.sectionTone("header", "services"), scrollMarginTop: 80 }}>
      <LivingBackground effect="streaks" quiet="top" seed={73} />
      <Box sx={{ position: "relative", zIndex: 1, width: "var(--page-width)", mx: "auto", py: { xs: 7, md: 11 } }}>
        <Box component="p" sx={neural.label}>See it work</Box>
        <HeadingMotion id="demo-heading" text={intro.title} accent={intro.accent} sx={sectionHeading} />
        <Box component="p" sx={{ m: "18px 0 0", maxWidth: "58ch", color: palette.slate[125], fontSize: "clamp(1rem, 1.25vw, 1.12rem)", lineHeight: 1.6 }}>{intro.text}</Box>
        <Box sx={{ mt: { xs: 4, md: 6 } }}><ServiceDemo service={service} /></Box>

        {service.examples && <>
          <Box component="h3" sx={{ m: { xs: "44px 0 0", md: "64px 0 0" }, color: palette.grey[25], fontSize: "clamp(1.4rem, 2.3vw, 1.95rem)", fontWeight: 650,
            letterSpacing: "-0.04em", lineHeight: 1.15 }}>Three workflows, step by step</Box>
          <Box component="ul" data-panel-group sx={{ listStyle: "none", m: "20px 0 0", p: 0, display: "grid", gap: 2 }}>
            {service.examples.map(example => (
              <Box component="li" key={example.label} data-panel="reveal" sx={{ ...neural.glassCard, display: "grid", gap: { xs: 1.5, md: 3 }, alignItems: "center", p: { xs: 2.5, md: 3 },
                gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "150px minmax(0, 1fr)" }, "& > *": { position: "relative", zIndex: 1 } }}>
                <Box component="h4" sx={{ ...neural.accentText, m: 0, fontSize: "1.35rem", fontWeight: 660, letterSpacing: "-0.03em" }}>{example.label}</Box>
                <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 8px" }}>
                  {example.steps.map((step, index) => (
                    <Box component="li" key={step} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {index > 0 && <ArrowForwardRounded aria-hidden="true" sx={{ fontSize: 18, color: palette.sky[150] }} />}
                      <Box component="span" sx={{ px: 1.5, py: 0.75, borderRadius: "10px", color: palette.slate[75], fontSize: "0.92rem", fontWeight: 550, lineHeight: 1.3,
                        border: `1px solid ${withAlpha(palette.sky[175], 0.28)}`, background: withAlpha(palette.navy[850], 0.5) }}>{step}</Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </>}
      </Box>
    </Box>

    {/* Client work that shows the kind of system behind the service. */}
    {proof.length > 0 && <SplitSection id="proof-heading" tone="dark" pinned title="Related client work"
      text="Projects we delivered for these clients. They show the kind of system behind this service."
      link={{ href: "/case-studies", label: "All case studies" }} effect="constellation" seed={101} background={neural.blueFlow("services", "header")}>
      <Box component="ul" data-panel-group sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 2,
        "& a": { ...neural.glassCard, display: "block", p: { xs: 2.5, md: 3 }, textDecoration: "none" },
        "& a:hover .proof-arrow": { transform: "translate(3px, -3px)", color: palette.cyan[75] },
        "& a:focus-visible": { outline: `2px solid ${palette.sky[100]}`, outlineOffset: 3 } }}>
        {proof.map(study => (
          <li key={study.slug} data-panel="reveal">
            <Link href={"/case-studies/" + study.slug} prefetch={false}>
              <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
                <Box component="span" sx={{ color: palette.sky[150], fontSize: "0.76rem", fontWeight: 650, letterSpacing: "0.14em", textTransform: "uppercase" }}>{study.sector}</Box>
                <ArrowOutwardRounded className="proof-arrow" aria-hidden="true"
                  sx={{ flex: "none", fontSize: 20, color: palette.slate[275], transition: `transform 0.35s ${neural.ease}, color 0.3s ease` }} />
              </Box>
              <Box component="h3" sx={{ position: "relative", zIndex: 1, m: "10px 0 0", color: palette.grey[25], fontSize: { xs: "1.25rem", md: "1.4rem" }, fontWeight: 650,
                letterSpacing: "-0.03em", lineHeight: 1.25 }}>{study.title}</Box>
              <Box component="p" sx={{ position: "relative", zIndex: 1, m: "8px 0 0", color: palette.slate[125], lineHeight: 1.6, fontSize: "0.96rem" }}>{study.summary}</Box>
              <Box component="p" sx={{ position: "relative", zIndex: 1, m: "14px 0 0", color: palette.slate[275], fontSize: "0.86rem" }}>
                {study.client} · {study.timeframe} · Led by Lucas Franco, {founderRole(study)}
              </Box>
            </Link>
          </li>
        ))}
      </Box>
    </SplitSection>}

    {/* How it is kept safe, then the tools: the technology comes after the benefits, the demo and the proof. */}
    <Container sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ display: "grid", gap: { xs: 6, md: 10 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" } }}>
        <div>
          <Box component="p" sx={eyebrow}>Safeguards</Box>
          <HeadingMotion text="Built to be trusted" accent="with real work" tone="light"
            sx={{ m: 0, fontSize: "clamp(2rem, 3.6vw, 3.1rem)", fontWeight: 650, letterSpacing: "-0.05em", lineHeight: 1.05 }} />
          <Box component="ul" sx={{ listStyle: "none", m: "28px 0 0", p: 0, display: "grid", gap: 2 }}>
            {service.safeguards.map(item => (
              <Box component="li" key={item} sx={{ display: "flex", gap: 1.75, alignItems: "flex-start", color: brand.ink, fontSize: "1.03rem", lineHeight: 1.5 }}>
                <Box aria-hidden="true" sx={{ display: "grid", placeItems: "center", flex: "none", width: 40, height: 40, borderRadius: "12px", color: brand.blue,
                  background: `linear-gradient(160deg, ${palette.slate[50]}, ${palette.slate[100]})`, border: `1px solid ${palette.slate[125]}`, "& svg": { fontSize: 21 } }}>
                  <ShieldOutlined />
                </Box>
                <Box component="span" sx={{ pt: "7px" }}>{item}</Box>
              </Box>
            ))}
          </Box>
        </div>
        <div>
          <Box component="h2" sx={lightHeading}>Tools we use</Box>
          <Box component="p" sx={{ m: "10px 0 0", color: brand.slate, lineHeight: 1.6 }}>
            We choose the tools for the job once we understand it. These are the ones we reach for most often.
          </Box>
          <Box component="ul" sx={{ listStyle: "none", m: "16px 0 0", p: 0, display: "flex", flexWrap: "wrap", gap: 1,
            "& li": { px: 1.25, py: 0.5, borderRadius: "8px", background: palette.white, border: `1px solid ${brand.border}`, color: brand.slate,
              fontFamily: "var(--font-mono), monospace", fontSize: "0.78rem", fontWeight: 500 } }}>
            {service.stack.map(tool => <li key={tool}>{tool}</li>)}
          </Box>

          <Box component="h2" sx={{ ...lightHeading, mt: { xs: 5, md: 6 } }}>More ways to put AI to work</Box>
          <Box component="ul" sx={{ listStyle: "none", m: "14px 0 0", p: 0, display: "grid", gap: "2px",
            "& a": { display: "flex", alignItems: "center", gap: 1.5, minHeight: 44, px: 1.5, mx: -1.5, borderRadius: "10px", color: brand.ink, fontWeight: 600,
              textDecoration: "none", transition: "background-color 0.25s ease, color 0.25s ease" },
            "& a:hover": { backgroundColor: palette.slate[50], color: palette.blue[550] },
            "& a svg": { ml: "auto", fontSize: 18, color: palette.blue[425], transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)" },
            "& a:hover svg": { transform: "translateX(4px)" } }}>
            {others.map(item => (
              <li key={item.slug}>
                <Link href={"/" + item.slug} prefetch={false}>
                  <Box component="span" aria-hidden="true" sx={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.78rem", color: palette.blue[500] }}>{item.number}</Box>
                  {item.shortName}<ArrowForwardRounded aria-hidden="true" />
                </Link>
              </li>
            ))}
          </Box>
        </div>
      </Box>
    </Container>

    <CTASection location={"service_" + service.slug} title="Start with a free AI Opportunity Call"
      subtitle="Thirty minutes with the people who would build it. Bring the problem; leave with a first step and the number it should move."
      primaryLabel={service.cta} secondaryLabel="Send us a brief" secondaryHref={`/contact?service=${service.slug}#project-brief`} />
  </>;
}
