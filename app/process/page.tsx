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
import JumpLinks from "@/components/interior/JumpLinks";
import styles from "@/components/interior/Editorial.styles";

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
        title="From the first call to handover"
        aside={<JumpLinks label="Explore the delivery process" links={[
          { text: "Delivery milestones", href: "#delivery" },
          { text: "Ways to work together", href: "#engagement-models" },
          { text: "Common questions", href: "#process-questions" },
        ]} />}
        subtitle="Meet the team, agree on a plan and try the work as we build it. Each stage gives you a chance to ask questions and decide what comes next."
      />

      <Container className={styles.anchor} id="delivery" sx={{ py: { xs: 5, md: 9 } }}>
        <ol className={styles.roadmap} aria-label="Delivery milestones">
          {processSteps.map((step) => (
            <li key={step.step}>
              <span aria-hidden="true" className={styles.milestone}>{step.step}</span>
              <div><h2>{step.title}</h2><small>{step.duration}</small></div>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>

      <Box className={styles.anchor} id="engagement-models" sx={{ bgcolor: brand.mist, py: { xs: 6, md: 9 } }}>
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
                    py: 1,
                    pr: { xs: 0, md: 4 },
                  }}
                >
                  <Typography variant="h6" component="h3">
                    {model.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                    {model.description}
                  </Typography>
                  <Box sx={{ pt: 1 }}>
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

      <Container className={styles.anchor} id="process-questions" sx={{ py: { xs: 6, md: 9 } }}>
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionHeading eyebrow="FAQ" title="Common questions" align="left" maxWidth={400} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <FAQAccordion items={processFaqs} />
          </Grid>
        </Grid>
      </Container>

      <CTASection location="process_page" title="Talk through your first milestone" subtitle="Bring a workflow, a deadline or a system you need to replace. We’ll use the call to work out what belongs in discovery." />
    </>
  );
}
