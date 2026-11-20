import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Logo from "./Logo";
import PaymentMarks from "./PaymentMarks";
import LinkTypography from "./LinkTypography";
import { footerLinks } from "@/data/nav";
import CookieSettingsButton from "./analytics/CookieSettingsButton";
import { consentRequired } from "@/lib/analyticsConfig";
import { brand } from "@/theme/theme";
import { company, companyStatement, linkedIn } from "@/lib/seo";
import { palette } from "@/theme/palette";

const email = "contact@bluetrendy.com";
const rule = `1px solid ${palette.navy[650]}`;
const contactLink = {
  display: "inline-flex", alignItems: "center", gap: 1, minHeight: 44,
  color: "secondary.light", fontWeight: 600, fontSize: 15, textDecoration: "none", "&:hover": { color: palette.white },
} as const;

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  const id = `footer-${title.toLowerCase()}`;
  return (
    <Box component="nav" aria-labelledby={id}>
      <Typography component="h2" id={id} sx={{ m: 0, mb: { xs: 0.5, md: 1.25 }, fontSize: 14, fontWeight: 650, color: palette.slate[275] }}>
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
                color: palette.slate[100], "&:hover": { color: palette.white },
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
    <Box component="footer" sx={{ bgcolor: brand.navyDark, color: palette.white }}>
      <Container sx={{ pt: { xs: 6, md: 8 }, pb: { xs: "calc(24px + env(safe-area-inset-bottom))", md: 4 } }}>
        <Box sx={{
          display: "grid", gap: { xs: 5, md: 6 },
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 5fr) minmax(0, 7fr)" },
        }}>
          <div>
            <Box sx={{ zoom: { xs: 0.8, md: 1 } }}><Logo inverse height={45} /></Box>
            <Typography variant="body2" sx={{ mt: 2, maxWidth: 340, color: palette.slate[125], fontSize: { xs: 15, md: 14 }, lineHeight: 1.6 }}>
              We don’t just build AI. We make AI work for your business: more revenue, less work, faster delivery and smarter decisions.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: 3, mt: 1.5 }}>
              <Box component="a" href={`mailto:${email}`} className="link-draw" sx={contactLink}>
                <MailOutlineRounded aria-hidden="true" sx={{ fontSize: 19 }} />{email}
              </Box>
              <Box component="a" href={linkedIn} target="_blank" rel="noopener noreferrer" className="link-draw" sx={contactLink}
                aria-label="BlueTrendy on LinkedIn (opens in a new tab)">
                <LinkedInIcon aria-hidden="true" sx={{ fontSize: 20 }} />LinkedIn
              </Box>
            </Box>
          </div>

          {/* Two columns side by side at every width, so the links never stack into one long list. */}
          <Box sx={{
            display: "grid", gap: { xs: 3, md: 6 },
            gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "minmax(0, 15rem) minmax(0, 11rem)" },
            justifyContent: { md: "end" },
            pt: { xs: 3, md: 0 }, borderTop: { xs: rule, md: 0 },
          }}>
            <LinkColumn title="Services" links={footerLinks.services} />
            <LinkColumn title="Company" links={footerLinks.company} />
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 4, md: 7 }, pt: 3, borderTop: rule }}>
          <PaymentMarks />
          <Box sx={{
            display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { md: "center" },
            gap: { xs: 1.5, md: 3 }, mt: 2.5, color: palette.slate[200], fontSize: 14,
          }}>
            <Box component="nav" aria-label="Legal" sx={{ display: "flex", flexWrap: "wrap", columnGap: 3, order: { md: 2 } }}>
              {footerLinks.legal.map(link => (
                <LinkTypography key={link.href} href={link.href} className="link-draw"
                  sx={{ display: "inline-flex", alignItems: "center", minHeight: 44, fontSize: 14, color: palette.slate[125], "&:hover": { color: palette.white } }}>
                  {link.label}
                </LinkTypography>
              ))}
              {consentRequired && <CookieSettingsButton className="link-draw"
                sx={{ display: "inline-flex", alignItems: "center", minHeight: 44, fontSize: 14, color: palette.slate[125], "&:hover": { color: palette.white } }} />}
            </Box>
            <Box component="p" sx={{ m: 0, order: { md: 1 } }}>© {year} {company.legalName}</Box>
            <Box component="p" sx={{ m: 0, order: 3, ml: { md: "auto" } }}>
              Designed with{" "}
              <FavoriteRounded titleAccess="love" sx={{ fontSize: "1.05em", color: palette.red[275], verticalAlign: "-0.15em" }} />
              {" "}in London, UK
            </Box>
          </Box>
          {/* The company's registered details, as UK law asks of a company website. */}
          <Box component="p" sx={{ m: "14px 0 0", maxWidth: "88ch", color: palette.slate[275], fontSize: 12.5, lineHeight: 1.6 }}>
            {companyStatement}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
