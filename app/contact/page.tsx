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
import LinkButton from "@/components/LinkButton";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us about your project — new build, modernization, or AI automation — and hear back within one business day.",
};

const contactDetails = [
  { icon: EmailIcon, label: "contact@bluetrendy.com", href: "mailto:contact@bluetrendy.com" },
  { icon: PhoneIcon, label: "+44 (0) 7815 627 527", href: "tel:+447815627527" },
  { icon: PlaceIcon, label: "London, UK", href: null },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you're building"
        subtitle="Share a few details about your project and we'll reply within one business day — or skip straight to a call if you'd rather talk it through."
      />

      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={4}>
              <Stack spacing={2}>
                {contactDetails.map((detail) => {
                  const Icon = detail.icon;
                  const content = (
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Icon sx={{ color: "secondary.main" }} />
                      <Typography variant="body1">{detail.label}</Typography>
                    </Stack>
                  );
                  return detail.href ? (
                    <Box key={detail.label} component="a" href={detail.href} sx={{ "&:hover": { color: "secondary.main" } }}>
                      {content}
                    </Box>
                  ) : (
                    <Box key={detail.label}>{content}</Box>
                  );
                })}
              </Stack>

              <Box
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  p: 3,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Prefer to talk first?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                  Skip the form and grab a slot directly on the calendar.
                </Typography>
                <LinkButton href="/book-a-call" variant="contained" color="primary" fullWidth>
                  Book a Call
                </LinkButton>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <LeadForm />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
