import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import FAQAccordion from "@/components/FAQAccordion";
import CTASection from "@/components/CTASection";
import { processSteps, engagementModels, processFaqs } from "@/data/process";
import { brand } from "@/theme/theme";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How bluetrendy engagements work: discovery call, paid discovery sprint, weekly build cadence, and a clean handover — with fixed-scope, embedded, and project-based models.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="A process built for accountability, not billable hours"
        subtitle="Every engagement starts with a fixed-scope discovery sprint, runs on a weekly demo cadence, and gives you direct access to the engineer writing your code."
      />

      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Stack spacing={7}>
          {processSteps.map((step) => (
            <Grid container spacing={4} key={step.step} sx={{ alignItems: "flex-start" }}>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Typography
                  sx={{
                    fontFamily: "var(--font-mono)",
                    color: "secondary.main",
                    fontWeight: 600,
                    fontSize: "2rem",
                  }}
                >
                  {step.step}
                </Typography>
                <Typography variant="overline" sx={{ color: "text.secondary" }}>
                  {step.duration}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 9 }}>
                <Typography variant="h5" component="h2">
                  {step.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 640 }}>
                  {step.description}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Stack>
      </Container>

      <Box sx={{ bgcolor: brand.mist, py: { xs: 10, md: 14 } }}>
        <Container>
          <SectionHeading
            eyebrow="Engagement models"
            title="Three ways to work together"
            subtitle="Every engagement starts with discovery — from there, the model depends on how well-defined your scope is and how long you need us."
          />
          <Grid container spacing={3} sx={{ mt: 6 }}>
            {engagementModels.map((model) => (
              <Grid key={model.name} size={{ xs: 12, md: 4 }}>
                <Stack
                  spacing={2}
                  sx={{
                    height: "100%",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    p: 4,
                  }}
                >
                  <Typography variant="h6" component="h3">
                    {model.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                    {model.description}
                  </Typography>
                  <Box sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                    <Typography variant="overline" sx={{ color: "text.secondary" }}>
                      Best for
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {model.bestFor}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionHeading eyebrow="FAQ" title="Common questions" align="left" maxWidth={400} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <FAQAccordion items={processFaqs} />
          </Grid>
        </Grid>
      </Container>

      <CTASection location="process_page" />
    </>
  );
}
