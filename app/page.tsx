import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Hero from "@/components/Hero";
import WebsiteEntrance from "@/components/WebsiteEntrance";
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
    description: "Talk through the people who will use the product, the problem it solves, and your timeline.",
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
      <WebsiteEntrance />
      <Hero />

      <Container sx={{ py: { xs: 3, md: 4 } }}>
        <TrustStrip />
      </Container>

      <Box sx={{ bgcolor: brand.mist, py: { xs: 10, md: 14 } }}>
        <Container>
          <Reveal>
            <SectionHeading
              title="What can we build for you?"
              subtitle="Start with a customer-facing product, a workflow your team repeats, or a system you need to modernize."
              align="left"
            />
          </Reveal>
          <RevealGroup>
            <Box sx={{ mt: 4, borderTop: "1px solid", borderColor: "divider" }}>
              {services.map((service) => (
                <RevealItem key={service.slug}><ServiceCard service={service} /></RevealItem>
              ))}
            </Box>
          </RevealGroup>
          <Stack sx={{ alignItems: "center", mt: 6 }}>
            <LinkButton href="/services" variant="text" color="primary" endIcon={<ArrowForwardIcon />}>
              Explore all services
            </LinkButton>
          </Stack>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Reveal>
          <SectionHeading
            title="Inside the work"
            subtitle="See how a trading desk prices complex products, how radiologists review scans together, and how analysts work with geographic data."
            align="left"
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

      <Box sx={{ bgcolor: brand.mist, py: { xs: 8, md: 11 } }}>
        <Container>
          <Reveal>
            <SectionHeading
              title="From the first call to launch"
              subtitle="Agree on scope and cost, try the software as we build it, then take ownership of the code."
              align="left"
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

      <HomeAboutSection />
      <Container sx={{ pt: { xs: 2, md: 4 }, pb: { xs: 5, md: 7 } }}>
        <Reveal>
          <Grid container spacing={6} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="overline" sx={{ color: "secondary.main" }}>
                Applied AI
              </Typography>
              <Typography variant="h3" component="h2" sx={{ mt: 1.5 }}>
                The right model for your workflow.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body1" color="text.secondary">
                A document review tool and a live trading desk have different budgets, response times, and
                privacy requirements. We compare models on your actual task and design the integration
                so you can change providers as your needs evolve.
              </Typography>
            </Grid>
          </Grid>
        </Reveal>
      </Container>

      <CTASection />
    </>
  );
}
