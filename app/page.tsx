import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Hero from "@/components/Hero";
import HomeAboutSection from "@/components/HomeAboutSection";
import SectionHeading from "@/components/SectionHeading";
import TrustStrip from "@/components/TrustStrip";
import ServiceCard from "@/components/ServiceCard";
import CaseStudyCard from "@/components/CaseStudyCard";
import CTASection from "@/components/CTASection";
import LinkButton from "@/components/LinkButton";
import Reveal from "@/components/motion/Reveal";
import { RevealGroup, RevealItem } from "@/components/motion/RevealGroup";
import { services } from "@/data/services";
import { caseStudies } from "@/data/caseStudies";
import { brand } from "@/theme/theme";

const processSteps = [
  {
    step: "01",
    title: "Discovery call",
    description: "A senior engineer — not a salesperson — walks through your problem, constraints, and goals.",
  },
  {
    step: "02",
    title: "Paid discovery sprint",
    description: "A scoped, fixed-price engagement that ends with an architecture plan and delivery estimate.",
  },
  {
    step: "03",
    title: "Build in the open",
    description: "Weekly demos, real staging environments, and direct access to the engineer writing your code.",
  },
  {
    step: "04",
    title: "Ship & hand over",
    description: "Production deployment, documentation, and a clean handover — or an ongoing partnership.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <Container sx={{ py: { xs: 8, md: 10 } }}>
        <TrustStrip />
      </Container>

      <HomeAboutSection />

      <Box sx={{ bgcolor: brand.mist, py: { xs: 10, md: 14 } }}>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What we build"
              title="Five ways we put AI to work on real engineering problems"
              subtitle="Every engagement is production software first — AI is how we deliver it faster and cheaper, not a demo bolted on top."
            />
          </Reveal>
          <RevealGroup>
            <Grid container spacing={3} sx={{ mt: 6 }}>
              {services.map((service) => (
                <Grid key={service.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                  <RevealItem>
                    <ServiceCard service={service} />
                  </RevealItem>
                </Grid>
              ))}
            </Grid>
          </RevealGroup>
          <Stack sx={{ alignItems: "center", mt: 6 }}>
            <LinkButton href="/services" variant="text" color="primary" endIcon={<ArrowForwardIcon />}>
              See the full services breakdown
            </LinkButton>
          </Stack>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Reveal>
          <SectionHeading
            eyebrow="Proof, not promises"
            title="Six engagements. Six different domains that don't tolerate bugs."
            subtitle="Trading platforms, medical imaging, NATO geospatial intelligence, predictive maintenance, and identity infrastructure serving 10M+ accounts."
          />
        </Reveal>
        <RevealGroup>
          <Grid container spacing={3} sx={{ mt: 6 }}>
            {caseStudies.slice(0, 3).map((cs) => (
              <Grid key={cs.slug} size={{ xs: 12, md: 4 }}>
                <RevealItem>
                  <CaseStudyCard caseStudy={cs} />
                </RevealItem>
              </Grid>
            ))}
          </Grid>
        </RevealGroup>
        <Stack sx={{ alignItems: "center", mt: 6 }}>
          <LinkButton href="/case-studies" variant="text" color="primary" endIcon={<ArrowForwardIcon />}>
            View all case studies
          </LinkButton>
        </Stack>
      </Container>

      <Box sx={{ bgcolor: brand.mist, py: { xs: 10, md: 14 } }}>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How we work"
              title="A process built for accountability, not billable hours"
              subtitle="You get a fixed-scope discovery sprint before any long-term commitment, weekly visibility, and direct access to the person writing the code."
            />
          </Reveal>
          <RevealGroup>
            <Grid container spacing={4} sx={{ mt: 6 }}>
              {processSteps.map((step) => (
                <Grid key={step.step} size={{ xs: 12, sm: 6, md: 3 }}>
                  <RevealItem>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-mono)",
                        color: "secondary.main",
                        fontWeight: 600,
                        fontSize: "1.5rem",
                      }}
                    >
                      {step.step}
                    </Typography>
                    <Typography variant="h6" component="h3" sx={{ mt: 1.5 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {step.description}
                    </Typography>
                  </RevealItem>
                </Grid>
              ))}
            </Grid>
          </RevealGroup>
          <Stack sx={{ alignItems: "center", mt: 6 }}>
            <LinkButton href="/process" variant="text" color="primary" endIcon={<ArrowForwardIcon />}>
              See the full engagement process
            </LinkButton>
          </Stack>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Reveal>
          <Grid container spacing={6} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="overline" sx={{ color: "secondary.main" }}>
                Vendor-neutral by design
              </Typography>
              <Typography variant="h3" component="h2" sx={{ mt: 1.5 }}>
                We choose the AI model that fits the task — not the one we&apos;re locked into.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body1" color="text.secondary">
                Claude, GPT, and other frontier models each have different strengths in cost, latency,
                context handling, and compliance posture. We evaluate the task — document processing,
                financial analysis, diagnostic support, predictive maintenance — and select the model that
                fits, with the flexibility to swap providers as the landscape moves. Your architecture
                shouldn&apos;t be hostage to one vendor&apos;s roadmap.
              </Typography>
            </Grid>
          </Grid>
        </Reveal>
      </Container>

      <CTASection />
    </>
  );
}
