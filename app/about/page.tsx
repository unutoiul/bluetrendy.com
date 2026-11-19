import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "@/components/interior/Editorial.styles";
import { caseStudies } from "@/data/caseStudies";
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
import SchoolOutlined from "@mui/icons-material/SchoolOutlined";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";

const credentials = [
  {
    icon: SchoolOutlined,
    label: "Education",
    primary: "B.S. Economic Cybernetics, Statistics & Informatics",
    secondary: "LSE University · London",
  },
  {
    icon: VerifiedUserOutlined,
    label: "Clearance",
    primary: "UK SC (Security Check) cleared",
    secondary: "Based in London, UK",
  },
];

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
        title="Meet the engineer behind BlueTrendy"
        subtitle="Lucas Franco has spent 15+ years building production software for banks, government agencies, healthcare teams and enterprise software companies. He leads each engagement from the first conversation through handover."
        aside={<figure className={styles.portrait}>
          <Image src={founderPhoto} alt="Lucas Franco" width={254} height={254} sizes="(max-width: 760px) 200px, 254px" />
          <figcaption><strong>Lucas Franco</strong><span>Founder & lead engineer</span></figcaption>
        </figure>}
      />

      <Container sx={{ py: { xs: 5, md: 8 } }}>
        <Grid container spacing={6} sx={{ alignItems: "flex-start" }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack
              spacing={3}
              sx={{
                alignItems: { xs: "center", md: "flex-start" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Stack
                sx={{
                  width: "100%",
                  maxWidth: { xs: 360, md: "none" },
                  bgcolor: brand.mist,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  textAlign: "left",
                }}
              >
                {credentials.map(({ icon: Icon, label, primary, secondary }, index) => (
                  <Stack
                    key={label}
                    direction="row"
                    spacing={1.75}
                    sx={{
                      p: 2.25,
                      alignItems: "flex-start",
                      borderTop: index === 0 ? "none" : "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        placeItems: "center",
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                        color: "secondary.main",
                      }}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="overline" color="text.secondary" sx={{ display: "block", lineHeight: 1.6, fontSize: "0.68rem" }}>
                        {label}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.45 }}>
                        {primary}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                        {secondary}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <Typography variant="h4" component="h2">How we work</Typography>
              <Typography variant="body1" color="text.secondary">
                The engineer you meet on the first call works on your system. Our experience includes
                regulated and security-sensitive projects for NATO, HSBC, Credit Suisse, Atlassian
                and Boston Consulting Group.
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

      <Box sx={{ bgcolor: brand.mist, py: { xs: 6, md: 9 } }}>
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

      <Container sx={{ py: { xs: 6, md: 9 } }}>
        <SectionHeading title="Selected engineering engagements" align="left" />
        <Stack spacing={0} sx={{ mt: 6 }}>
          {timeline.map((item, index) => {
            const study = caseStudies.find(entry => entry.client === item.org);
            return (
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
                  {study ? <Link href={"/case-studies/" + study.slug} style={{ textUnderlineOffset: 4 }}>{item.org}</Link> : item.org}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.role}
                </Typography>
              </Box>
            </Stack>
          );})}
        </Stack>
      </Container>

      <CTASection location="about_page" title="Talk to the engineer who will build it" subtitle="Bring the problem you’re working on. We’ll look at the technical constraints and the first release together." />
    </>
  );
}
