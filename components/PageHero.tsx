import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { brand } from "@/theme/theme";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export default function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <Box
      sx={{
        background: `linear-gradient(160deg, ${brand.navyDark} 0%, ${brand.navy} 62%, ${brand.navyMid} 100%)`,
        color: "#fff",
        pt: { xs: 14, md: 16 },
        pb: { xs: 8, md: 10 },
      }}
    >
      <Container>
        <Stack spacing={3} sx={{ maxWidth: 720 }}>
          {eyebrow ? (
            <Typography variant="overline" sx={{ color: "secondary.light" }}>
              {eyebrow}
            </Typography>
          ) : null}
          <Typography variant="h2" component="h1">
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)", fontSize: "1.125rem" }}>
              {subtitle}
            </Typography>
          ) : null}
          {children}
        </Stack>
      </Container>
    </Box>
  );
}
