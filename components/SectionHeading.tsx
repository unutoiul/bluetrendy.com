import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { palette, withAlpha } from "@/theme/palette";
import HeadingMotion from "./motion/HeadingMotion";
import { splitHeadline } from "@/lib/headline";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  maxWidth?: number;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  maxWidth = 640,
}: SectionHeadingProps) {
  const heading = splitHeadline(title);
  return (
    <Box
      sx={{
        maxWidth: align === "center" ? maxWidth : "none",
        mx: align === "center" ? "auto" : 0,
        textAlign: align,
      }}
    >
      {eyebrow ? (
        <Typography
          variant="overline"
          sx={{ color: light ? "secondary.light" : "secondary.main", display: "block", mb: 1.5 }}
        >
          {eyebrow}
        </Typography>
      ) : null}
      <HeadingMotion text={heading.lead} accent={heading.accent}
        tone={light ? "dark" : "light"} sx={{ typography: "h3", m: 0 }} />
      {subtitle ? (
        <Typography
          variant="body1"
          sx={{ mt: 2, color: light ? withAlpha(palette.white, 0.78) : "text.secondary" }}
        >
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}
