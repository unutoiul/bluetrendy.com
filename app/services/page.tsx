import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "AI Services",
  description:
    "AI-native web apps, mobile, mission-critical systems, legacy modernization, and applied AI automation — delivered by senior engineers.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="AI Services"
        title="Web, mobile, and AI engineering"
        subtitle="Choose the work closest to your brief. Each service covers what we build, how we test it, and the technology behind it."
      />

      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Stack spacing={10}>
          {services.map((service, index) => (
            <Box
              key={service.slug}
              id={service.slug}
              sx={{ scrollMarginTop: 100 }}
            >
              <Grid container spacing={{ xs: 4, md: 8 }} direction={index % 2 === 1 ? "row-reverse" : "row"}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-mono)",
                      color: "secondary.main",
                      fontWeight: 600,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Typography>
                  <Typography variant="h4" component="h2" sx={{ mt: 1.5 }}>
                    {service.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    {service.description}
                  </Typography>
                  <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 3 }}>
                    {service.stack.map((tech) => (
                      <Chip key={tech} label={tech} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack
                    spacing={2}
                    sx={{
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 3,
                      p: { xs: 3, md: 4 },
                    }}
                  >
                    {service.bullets.map((bullet) => (
                      <Stack key={bullet} direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
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
                          {bullet}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Stack>
      </Container>

      <CTASection location="services_page" />
    </>
  );
}
