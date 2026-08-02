import type { Metadata } from "next";
import Image from "next/image";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import { timeline, values } from "@/data/timeline";
import { brand } from "@/theme/theme";
import founderPhoto from "@/public/brand/founder.png";

export const metadata: Metadata = {
  title: "About",
  description:
    "bluetrendy is led by a hands-on senior engineer with 15+ years across banking, defense, healthcare, and enterprise SaaS — UK SC cleared, still writing production code.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Senior engineering, not a resourcing pool"
        subtitle="bluetrendy is led by a hands-on lead engineer who has spent 15+ years shipping production software inside banks, defense agencies, healthcare platforms, and enterprise SaaS companies."
      />

      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Grid container spacing={6} sx={{ alignItems: "flex-start" }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack
              spacing={3}
              sx={{
                alignItems: { xs: "center", md: "flex-start" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Box
                sx={{
                  width: 128,
                  height: 128,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid",
                  borderColor: "secondary.main",
                }}
              >
                <Image src={founderPhoto} alt="Lucas Franco, founder of bluetrendy" width={128} height={128} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </Box>
              <Box>
                <Typography variant="h6">Lucas Franco</Typography>
                <Typography variant="body2" color="text.secondary">
                  Founder & Lead Engineer, bluetrendy
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                B.S. Economic Cybernetics, Statistics & Informatics — ASE University
              </Typography>
              <Typography variant="body2" color="text.secondary">
                London, UK · UK SC (Security Check) cleared
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <Typography variant="body1" color="text.secondary">
                bluetrendy exists because most software agencies sell you a sales call, then hand your project
                to whoever&apos;s available. That&apos;s not how this works. Every engagement is led end-to-end
                by a senior engineer with direct experience delivering inside regulated, security-sensitive,
                and mission-critical environments — NATO, HSBC, Credit Suisse, Atlassian, Boston Consulting
                Group, and more.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                That background shapes how we work: TDD/BDD discipline where correctness matters, cloud-native
                architecture on AWS and Azure, and a track record of managing teams (up to 25 developers at
                once at Lloyds Bank) without stepping away from the keyboard. AI is part of the toolkit — used
                to move faster on scaffolding, testing, and automation — but engineering judgment stays human,
                senior, and accountable.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ bgcolor: brand.mist, py: { xs: 10, md: 14 } }}>
        <Container>
          <SectionHeading eyebrow="Principles" title="What we optimize for" />
          <Grid container spacing={4} sx={{ mt: 6 }}>
            {values.map((value) => (
              <Grid key={value.title} size={{ xs: 12, md: 4 }}>
                <Stack
                  spacing={1.5}
                  sx={{
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    p: 4,
                    height: "100%",
                  }}
                >
                  <Typography variant="h6" component="h3">
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <SectionHeading eyebrow="Career at a glance" title="19 enterprise & government engagements since 2011" align="left" />
        <Stack spacing={0} sx={{ mt: 6 }}>
          {timeline.map((item, index) => (
            <Stack
              key={item.org + item.period}
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 0.5, sm: 3 }}
              sx={{
                py: 2.5,
                borderTop: index === 0 ? "1px solid" : "none",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="body2"
                sx={{ width: { sm: 180 }, flexShrink: 0, fontFamily: "var(--font-mono)", color: "text.secondary" }}
              >
                {item.period}
              </Typography>
              <Box>
                <Typography variant="subtitle1" component="span" sx={{ fontWeight: 700 }}>
                  {item.org}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.role}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Container>

      <CTASection location="about_page" />
    </>
  );
}
