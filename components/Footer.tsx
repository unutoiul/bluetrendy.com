import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import Logo from "./Logo";
import PaymentMarks from "./PaymentMarks";
import LinkTypography from "./LinkTypography";
import { footerLinks } from "@/data/nav";
import CookieSettingsButton from "./analytics/CookieSettingsButton";
import { consentRequired } from "@/lib/analyticsConfig";
import { brand } from "@/theme/theme";

const email = "contact@bluetrendy.com";
const rule = "1px solid #284763";

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  const id = `footer-${title.toLowerCase()}`;
  return (
    <Box component="nav" aria-labelledby={id}>
      <Typography component="h2" id={id} sx={{ m: 0, mb: { xs: 0.5, md: 1.25 }, fontSize: 14, fontWeight: 650, color: "#8fb0cc" }}>
        {title}
      </Typography>
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
        {links.map(link => (
          <li key={link.href}>
            <LinkTypography href={link.href} className="link-draw"
              sx={{
                display: "inline-flex", alignItems: "center",
                // Full-height touch targets on phones; a tighter list on desktop.
                minHeight: { xs: 44, md: 34 }, fontSize: { xs: 16, md: 15 },
                color: "#dbe8f4", "&:hover": { color: "#fff" },
              }}>
              {link.label}
            </LinkTypography>
          </li>
        ))}
      </Box>
    </Box>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <Box component="footer" sx={{ bgcolor: brand.navyDark, color: "#fff" }}>
      <Container sx={{ pt: { xs: 6, md: 8 }, pb: { xs: "calc(24px + env(safe-area-inset-bottom))", md: 4 } }}>
        <Box sx={{
          display: "grid", gap: { xs: 5, md: 6 },
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 5fr) minmax(0, 7fr)" },
        }}>
          <div>
            <Box sx={{ zoom: { xs: 0.8, md: 1 } }}><Logo inverse height={45} /></Box>
            <Typography variant="body2" sx={{ mt: 2, maxWidth: 340, color: "#c5d8e8", fontSize: { xs: 15, md: 14 }, lineHeight: 1.6 }}>
              A senior software and AI team building web platforms, mobile apps and AI workflows for businesses and public institutions.
            </Typography>
            <Box component="a" href={`mailto:${email}`} className="link-draw"
              sx={{
                display: "inline-flex", alignItems: "center", gap: 1, minHeight: 44, mt: 1.5,
                color: "secondary.light", fontWeight: 600, fontSize: 15, textDecoration: "none", "&:hover": { color: "#fff" },
              }}>
              <MailOutlineRounded aria-hidden="true" sx={{ fontSize: 19 }} />{email}
            </Box>
          </div>

          {/* Two columns side by side at every width, so the links never stack into one long list. */}
          <Box sx={{
            display: "grid", gap: { xs: 3, md: 6 },
            gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(2, minmax(0, 12rem))" },
            justifyContent: { md: "end" },
            pt: { xs: 3, md: 0 }, borderTop: { xs: rule, md: 0 },
          }}>
            <LinkColumn title="Company" links={footerLinks.company} />
            <LinkColumn title="Work" links={footerLinks.work} />
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 4, md: 7 }, pt: 3, borderTop: rule }}>
          <PaymentMarks />
          <Box sx={{
            display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { md: "center" },
            gap: { xs: 1.5, md: 3 }, mt: 2.5, color: "#a9c0d4", fontSize: 14,
          }}>
            <Box component="nav" aria-label="Legal" sx={{ display: "flex", flexWrap: "wrap", columnGap: 3, order: { md: 2 } }}>
              {footerLinks.legal.map(link => (
                <LinkTypography key={link.href} href={link.href} className="link-draw"
                  sx={{ display: "inline-flex", alignItems: "center", minHeight: 44, fontSize: 14, color: "#cfe0ef", "&:hover": { color: "#fff" } }}>
                  {link.label}
                </LinkTypography>
              ))}
              {consentRequired && <CookieSettingsButton className="link-draw"
                sx={{ display: "inline-flex", alignItems: "center", minHeight: 44, fontSize: 14, color: "#cfe0ef", "&:hover": { color: "#fff" } }} />}
            </Box>
            <Box component="p" sx={{ m: 0, order: { md: 1 } }}>© {year} BlueTrendy Intelligence</Box>
            <Box component="p" sx={{ m: 0, order: 3, ml: { md: "auto" } }}>
              Designed with{" "}
              <FavoriteRounded titleAccess="love" sx={{ fontSize: "1.05em", color: "#ff6b8a", verticalAlign: "-0.15em" }} />
              {" "}in London, UK
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
