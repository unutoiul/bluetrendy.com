import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import PageHero from "@/components/PageHero";
import LeadForm from "@/components/LeadForm";
import HeadingMotion from "@/components/motion/HeadingMotion";
import LinkButton from "@/components/LinkButton";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import { services } from "@/data/services";
import styles from "@/components/interior/Editorial.styles";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, pageMetadata } from "@/lib/seo";
import { palette } from "@/theme/palette";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: "Tell us about your website, app, software or AI project and hear back within one business day. Email contact@bluetrendy.com or call +44 7815 627 527.",
  path: "/contact",
});

const details = [
  { icon: EmailIcon, label: "contact@bluetrendy.com", href: "mailto:contact@bluetrendy.com" },
  { icon: PhoneIcon, label: "+44 (0) 7815 627 527", href: "tel:+447815627527" },
  { icon: PlaceIcon, label: "London, UK", href: null },
];

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string | string[] }> }) {
  const { service } = await searchParams;
  const selected = services.find(item => item.slug === service)?.name ?? "";
  return <>
    <JsonLd data={breadcrumbs([{ name: "Contact", path: "/contact" }])} />
    <PageHero eyebrow="Contact" title="Tell us what you’re building"
      subtitle="Send a project brief and our team will reply within one business day." />
    <Box sx={{ position: "relative", isolation: "isolate", overflow: "clip", bgcolor: palette.grey[25] }}>
      {/* The same lattice of dots on springs as the booking page, giving way under the mouse. */}
      <LivingBackground effect="springGrid" light quiet="none" seed={113} />
      <Container sx={{ position: "relative", zIndex: 1, py: { xs: 4, md: 7 } }}>
        <Grid container spacing={{ xs: 4, md: 7 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <section className={styles.brief + " " + styles.anchor} id="project-brief" aria-labelledby="brief-heading">
              <HeadingMotion id="brief-heading" text="Your" accent="project brief" tone="light" />
              <LeadForm key={selected} projectTypes={[...services.map(item => item.name), "Other"]} initialProjectType={selected} />
            </section>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2.5} sx={{ position: { md: "sticky" }, top: 106 }}>
              <Typography variant="h5" component="h2">Talk to our team</Typography>
              <Stack>
                {details.map(({ icon: Icon, label, href }) => {
                  const content = <><Icon fontSize="small" /><span>{label}</span></>;
                  const sx = { display: "flex", alignItems: "center", gap: 1.5, minHeight: 44, color: "primary.main", textUnderlineOffset: 4 };
                  return href ? <Box key={label} component="a" href={href} sx={sx}>{content}</Box> : <Box key={label} sx={sx}>{content}</Box>;
                })}
              </Stack>
              <Box sx={{ pt: 2.5 }}>
                <Typography variant="body1" sx={{ mb: 1.5 }}>Prefer to talk it through? Book a free 30-minute discovery call.</Typography>
                <LinkButton href="/book-a-call" variant="outlined">Book a call</LinkButton>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>;
}
