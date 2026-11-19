import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import FlagOutlined from "@mui/icons-material/FlagOutlined";
import GroupAddOutlined from "@mui/icons-material/GroupAddOutlined";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import FAQAccordion from "@/components/FAQAccordion";
import LinkButton from "@/components/LinkButton";
import DiscoverySprint from "@/components/pricing/DiscoverySprint";
import { discoveryPackages, formatPounds, pricingFaqs } from "@/data/pricing";
import { neural } from "@/components/experience/neuralStyle";
import { brand } from "@/theme/theme";
import styles from "@/components/interior/Editorial.styles";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, breadcrumbs, faqPage, organizationRef, pageMetadata } from "@/lib/seo";

const lowest = formatPounds(Math.min(...discoveryPackages.map(item => item.price)));

export const metadata: Metadata = pageMetadata({
  title: `Pricing: Discovery Sprints from ${lowest}`,
  description: `Start with a fixed-price discovery sprint from ${lowest}, priced by company size. Move into a fixed-scope project or embedded engineering once the plan is clear.`,
  path: "/pricing",
});

const discoverySprint = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Discovery sprint",
  serviceType: "Software project planning and estimate",
  description: "A fixed-price planning sprint with our senior team: a technical plan, an estimate and a price for the build.",
  url: absoluteUrl("/pricing"),
  provider: organizationRef,
  areaServed: { "@type": "Country", name: "United Kingdom" },
  offers: discoveryPackages.map(item => ({
    "@type": "Offer",
    name: `${item.name} (${item.employees})`,
    price: item.price,
    priceCurrency: "GBP",
    url: absoluteUrl("/pricing"),
    availability: "https://schema.org/InStock",
  })),
};

const nextSteps = [
  {
    title: "Fixed-scope project", Icon: FlagOutlined, href: "/contact", action: "Get a quote",
    text: "A defined deliverable, timeline and price, agreed from your discovery plan. You see a working demo every week.",
    details: [
      { term: "How you pay", value: "By milestone, as each part is delivered" },
      { term: "Best for", value: "A platform, a migration or an integration with a clear finish line" },
    ],
  },
  {
    title: "An engineer on your team", Icon: GroupAddOutlined, href: "/contact", action: "Discuss capacity",
    text: "A senior engineer from our team working inside your team and your tools, for steady delivery rather than a one-off project.",
    details: [
      { term: "How you pay", value: "Monthly, with capacity agreed up front" },
      { term: "Best for", value: "Teams scaling delivery or covering a gap in skills" },
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={[discoverySprint, faqPage(pricingFaqs), breadcrumbs([{ name: "Pricing", path: "/pricing" }])]} />
      <PageHero
        eyebrow="Engagement & Pricing"
        title="Plan your project before you build"
        subtitle={`Start with a fixed-price planning sprint from ${lowest}, priced by the size of your company. You’ll get a technical plan, an estimate and a price for the build.`}
      />

      <DiscoverySprint />

      <Box component="section" className={styles.anchor} id="ongoing-work" aria-labelledby="ongoing-heading" sx={{ py: { xs: 7, md: 11 } }}>
        <Container>
          <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: "flex-start" }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box component="p" sx={{ ...neural.label, color: brand.blue, "&::after": { content: '""', width: 34, height: "1px", background: `linear-gradient(90deg, ${brand.blue}, transparent)` } }}>
                After discovery
              </Box>
              <Box component="h2" id="ongoing-heading" sx={{ m: 0, color: brand.ink, fontSize: "clamp(2rem, 3.6vw, 3.1rem)", fontWeight: 650,
                letterSpacing: "-0.05em", lineHeight: 1.05 }}>
                Then choose how we build it
              </Box>
              <Box component="p" sx={{ m: "18px 0 0", color: brand.slate, lineHeight: 1.6, maxWidth: "38ch" }}>
                Your plan is yours either way. If you build with us within 60 days, the sprint fee comes off the price.
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 3, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" } }}>
                {nextSteps.map(({ title, Icon, href, action, text, details }) => (
                  <Box component="li" key={title} data-panel sx={{ display: "flex", flexDirection: "column", p: { xs: 3, md: 3.5 }, borderRadius: "20px",
                    background: "linear-gradient(170deg, #ffffff, #f4f8fd)", border: `1px solid ${brand.border}`,
                    boxShadow: "0 1px 0 #fff inset, 0 18px 40px -30px rgba(12, 41, 66, 0.45)",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": { borderColor: "#8fc2ee", boxShadow: "0 1px 0 #fff inset, 0 24px 48px -28px rgba(22, 95, 204, 0.45)" } }}>
                    <Box aria-hidden="true" sx={{ display: "grid", placeItems: "center", width: 48, height: 48, borderRadius: "14px", color: brand.blue,
                      background: "linear-gradient(160deg, #e5f1fc, #d3e7fa)", border: "1px solid #bfdaf3", "& svg": { fontSize: 24 } }}>
                      <Icon />
                    </Box>
                    <Box component="h3" sx={{ m: "20px 0 0", color: brand.ink, fontSize: "1.3rem", fontWeight: 650, letterSpacing: "-0.03em" }}>{title}</Box>
                    <Box component="p" sx={{ m: "10px 0 0", color: brand.slate, lineHeight: 1.6, fontSize: "0.98rem" }}>{text}</Box>
                    <Box component="dl" sx={{ m: "20px 0 0", display: "grid", gap: 1.5, pt: 2, borderTop: `1px solid ${brand.border}` }}>
                      {details.map(({ term, value }) => (
                        <div key={term}>
                          <Box component="dt" sx={{ color: brand.slate, fontSize: "0.75rem", fontWeight: 650, letterSpacing: "0.12em", textTransform: "uppercase" }}>{term}</Box>
                          <Box component="dd" sx={{ m: "4px 0 0", color: brand.ink, fontSize: "0.95rem", lineHeight: 1.5 }}>{value}</Box>
                        </div>
                      ))}
                    </Box>
                    <Box sx={{ mt: "auto", pt: 3 }}>
                      <LinkButton href={href} variant="outlined" color="primary" endIcon={<ArrowForwardRounded />}>{action}</LinkButton>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 3, display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { sm: "center" }, justifyContent: "space-between",
                gap: 2.5, p: { xs: 3, md: 3.5 }, borderRadius: "20px", color: "#eef6ff",
                background: neural.blueFlow("hero", "services"), border: "1px solid rgba(86, 156, 222, 0.4)" }}>
                <div>
                  <Box component="h3" sx={{ m: 0, fontSize: "1.2rem", fontWeight: 650, letterSpacing: "-0.02em" }}>Not sure which fits?</Box>
                  <Box component="p" sx={{ m: "6px 0 0", color: "#c3d6ea", lineHeight: 1.55 }}>
                    A discovery call is free and usually makes the right choice obvious.
                  </Box>
                </div>
                <LinkButton href="/book-a-call" variant="contained" endIcon={<ArrowForwardRounded />} sx={{ flexShrink: 0 }}>Book a free call</LinkButton>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container className={styles.anchor} id="pricing-questions" sx={{ pb: { xs: 6, md: 9 } }}>
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionHeading eyebrow="FAQ" title="Pricing questions" align="left" maxWidth={400} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <FAQAccordion items={pricingFaqs} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
