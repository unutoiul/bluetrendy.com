import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import Logo from "./Logo";
import PaymentMarks from "./PaymentMarks";
import LinkTypography from "./LinkTypography";
import { footerLinks } from "@/data/nav";
import { brand } from "@/theme/theme";

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <Stack spacing={1.25}>
      <Typography component="h2" sx={{ fontSize: 16, mb: 0.5, fontWeight: 650 }}>
        {title}
      </Typography>
      {links.map((link) => (
        <LinkTypography
          key={link.href}
          href={link.href}
          variant="body2"
          className="link-draw"
          sx={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", minHeight: 28, color: "#c5d8e8", "&:hover": { color: "#fff" } }}
        >
          {link.label}
        </LinkTypography>
      ))}
    </Stack>
  );
}

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: brand.navyDark, color: "#fff" }}>
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Logo inverse height={45} />
            <Typography variant="body2" sx={{ mt: 2, maxWidth: 320, color: "#c5d8e8" }}>
              A senior software and AI team building web platforms, mobile apps and AI workflows for businesses and public institutions.
            </Typography>
            <Typography
              component="a"
              href="mailto:contact@bluetrendy.com"
              variant="body2"
              className="link-draw"
              sx={{ display: "inline-flex", alignItems: "center", minHeight: 28, mt: 2, color: "secondary.light", fontWeight: 600, "&:hover": { color: "#fff" } }}
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

        <Divider sx={{ my: 5, borderColor: "#355069" }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          useFlexGap
          sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, flexWrap: "wrap" }}
        >
          <Typography variant="body2" sx={{ color: "#bdd2e3" }}>
            © {new Date().getFullYear()} BlueTrendy Intelligence. All rights reserved.
          </Typography>
          <PaymentMarks />
          <Typography variant="body2" sx={{ color: "#bdd2e3" }}>
            Designed with{" "}
            <FavoriteRounded titleAccess="love" sx={{ fontSize: "1.05em", color: "#ff6b8a", verticalAlign: "-0.15em" }} />
            {" "}in London, UK
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
