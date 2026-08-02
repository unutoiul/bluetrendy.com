import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Logo, { LOGO_HEIGHT } from "./Logo";
import LinkTypography from "./LinkTypography";
import { footerLinks } from "@/data/nav";
import { brand } from "@/theme/theme";

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <Stack spacing={1.25}>
      <Typography variant="overline" sx={{ color: "text.secondary" }}>
        {title}
      </Typography>
      {links.map((link) => (
        <LinkTypography
          key={link.href}
          href={link.href}
          variant="body2"
          sx={{ color: "text.primary", "&:hover": { color: "secondary.main" } }}
        >
          {link.label}
        </LinkTypography>
      ))}
    </Stack>
  );
}

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: brand.mist, borderTop: "1px solid", borderColor: "divider", mt: 12 }}>
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Logo height={LOGO_HEIGHT} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: 320 }}>
              An AI-first software consultancy delivering production-grade web, mobile, and mission-critical
              systems for enterprise and government clients.
            </Typography>
            <Typography
              component="a"
              href="mailto:contact@bluetrendy.com"
              variant="body2"
              sx={{ display: "inline-block", mt: 2, color: "primary.main", fontWeight: 600 }}
            >
              contact@bluetrendy.com
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <LinkColumn title="Company" links={footerLinks.company} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <LinkColumn title="Work" links={footerLinks.work} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <LinkColumn title="Legal" links={footerLinks.legal} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 5 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} BlueTrendy Intelligence. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            London, UK
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
