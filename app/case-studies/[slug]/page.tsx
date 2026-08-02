import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import LinkButton from "@/components/LinkButton";
import { caseStudies, getCaseStudy } from "@/data/caseStudies";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return {};

  return {
    title: caseStudy.client,
    description: caseStudy.summary,
  };
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="overline" sx={{ color: "secondary.light" }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: "#fff", fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <>
      <PageHero eyebrow={caseStudy.sector} title={caseStudy.title} subtitle={caseStudy.summary}>
        <Grid container spacing={4} sx={{ pt: 2 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <InfoBlock label="Client" value={caseStudy.client} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <InfoBlock label="Timeframe" value={caseStudy.timeframe} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <InfoBlock label="Location" value={caseStudy.location} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <InfoBlock label="Sector" value={caseStudy.sector} />
          </Grid>
        </Grid>
      </PageHero>

      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <LinkButton
          href="/case-studies"
          variant="text"
          color="primary"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 5 }}
        >
          All case studies
        </LinkButton>

        <Grid container spacing={{ xs: 6, md: 10 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={5} sx={{ position: { md: "sticky" }, top: 100 }}>
              <Box>
                <Typography variant="h5" component="h2">
                  The challenge
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  {caseStudy.challenge}
                </Typography>
              </Box>
              <Box>
                <Typography variant="overline" sx={{ color: "text.secondary" }}>
                  Stack
                </Typography>
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 1.5 }}>
                  {caseStudy.stack.map((tech) => (
                    <Chip key={tech} label={tech} size="small" variant="outlined" />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={6}>
              <Box>
                <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                  The approach
                </Typography>
                <Stack spacing={2.5}>
                  {caseStudy.approach.map((item) => (
                    <Stack key={item} direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                      <Box
                        sx={{
                          mt: 1,
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "secondary.main",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body1" color="text.secondary">
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Box
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  p: { xs: 3, md: 4 },
                }}
              >
                <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                  The impact
                </Typography>
                <Stack spacing={2.5}>
                  {caseStudy.impact.map((item) => (
                    <Stack key={item} direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                      <Box
                        sx={{
                          mt: 1,
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body1" color="text.secondary">
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <CTASection location="case_study_detail" />
    </>
  );
}
