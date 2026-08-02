import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CheckIcon from "@mui/icons-material/Check";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import FAQAccordion from "@/components/FAQAccordion";
import DiscoveryCheckoutForm from "@/components/DiscoveryCheckoutForm";
import LinkButton from "@/components/LinkButton";
import LinkTypography from "@/components/LinkTypography";
import { pricingFaqs } from "@/data/pricing";

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
        title="Start with a fixed-price discovery sprint"
        subtitle="No open-ended estimates. You get a concrete architecture plan and delivery price before committing to a full build."
      />

      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack
              spacing={3}
              sx={{
                bgcolor: "background.paper",
                border: "2px solid",
                borderColor: "secondary.main",
                borderRadius: 3,
                p: { xs: 3, md: 4 },
                position: "relative",
              }}
            >
              <Chip
                label="Recommended starting point"
                size="small"
                color="secondary"
                sx={{ alignSelf: "flex-start", fontWeight: 700 }}
              />
              <Box>
                <Typography variant="h5" component="h2">
                  Paid Discovery Sprint
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
              <Box sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                <DiscoveryCheckoutForm />
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  alignItems: { sm: "center" },
                  justifyContent: "space-between",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  p: { xs: 3, md: 4 },
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
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  p: { xs: 3, md: 4 },
                }}
              >
                <Box>
                  <Typography variant="h6" component="h3">
                    Embedded Engineering
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
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  p: { xs: 3, md: 4 },
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

      <Container sx={{ pb: { xs: 10, md: 14 } }}>
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
