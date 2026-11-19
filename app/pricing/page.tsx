import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import FAQAccordion from "@/components/FAQAccordion";
import DiscoveryCheckoutForm from "@/components/DiscoveryCheckoutForm";
import LinkButton from "@/components/LinkButton";
import LinkTypography from "@/components/LinkTypography";
import { pricingFaqs } from "@/data/pricing";
import JumpLinks from "@/components/interior/JumpLinks";
import styles from "@/components/interior/Editorial.styles";

export const metadata: Metadata = {
  title: "Engagement & Pricing",
  description:
    "Start with a fixed-price, paid discovery sprint. Move into a fixed-scope project or embedded engineering engagement once the plan is clear.",
};

const discoveryIncludes = [
  "60–90 minute technical deep-dive with a senior engineer",
  "Written architecture plan and technology recommendation",
  "Risk assessment and delivery estimate for the full build",
  "Fee credited toward your project if you continue with us",
];

const priceDisplay = process.env.NEXT_PUBLIC_DISCOVERY_PRICE_DISPLAY ?? "Fixed price — shown at checkout";

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Engagement & Pricing"
        title="Plan your project before you build"
        aside={<JumpLinks label="Explore engagement options" links={[
          { text: "Discovery sprint & price", href: "#discovery-sprint" },
          { text: "Project & embedded work", href: "#ongoing-work" },
          { text: "Pricing questions", href: "#pricing-questions" },
        ]} />}
        subtitle="Start with a paid planning sprint. You’ll get a technical plan, an estimate and a price for the build."
      />

      <Container sx={{ py: { xs: 5, md: 8 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }} className={styles.anchor} id="discovery-sprint">
            <Stack
              spacing={3}
              sx={{
                bgcolor: "#eff6fa",
                borderRadius: 3,
                p: { xs: 3, md: 4 },
                position: "relative",
              }}
            >
              <Box>
                <Typography variant="h5" component="h2">
                    Paid discovery sprint
                </Typography>
                <Typography
                  sx={{ mt: 1, fontFamily: "var(--font-mono)", color: "primary.main", fontWeight: 600 }}
                >
                  {priceDisplay}
                </Typography>
              </Box>
              <Stack spacing={1.5}>
                {discoveryIncludes.map((item) => (
                  <Stack key={item} direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                    <CheckIcon sx={{ color: "secondary.main", fontSize: 20, mt: 0.2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Box sx={{ pt: 1 }}>
                <DiscoveryCheckoutForm />
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }} className={styles.anchor} id="ongoing-work">
            <Stack spacing={3}>
              <Typography variant="h5" component="h2">After discovery</Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  alignItems: { sm: "center" },
                  justifyContent: "space-between",
                  py: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" component="h3">
                    Fixed-Scope Project
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 420 }}>
                    A defined deliverable, timeline, and price agreed after discovery. Milestone-based
                    payment, weekly demos.
                  </Typography>
                </Box>
                <LinkButton href="/contact" variant="outlined" color="primary" sx={{ flexShrink: 0 }}>
                  Get a quote
                </LinkButton>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  alignItems: { sm: "center" },
                  justifyContent: "space-between",
                  py: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" component="h3">
                    An engineer on your team
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 420 }}>
                    Ongoing senior-engineer capacity working inside your team, billed monthly. For sustained
                    delivery, not a one-off project.
                  </Typography>
                </Box>
                <LinkButton href="/contact" variant="outlined" color="primary" sx={{ flexShrink: 0 }}>
                  Discuss capacity
                </LinkButton>
              </Stack>

              <Box
                sx={{
                  bgcolor: "background.paper",
                  py: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Not sure which fits? A discovery call costs nothing and usually makes the right model
                  obvious.{" "}
                  <LinkTypography href="/book-a-call" sx={{ fontWeight: 700, color: "primary.main" }}>
                    Book a free call →
                  </LinkTypography>
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

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
