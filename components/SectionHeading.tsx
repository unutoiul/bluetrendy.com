import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
      <Typography variant="h3" component="h2" sx={{ color: light ? "#fff" : "text.primary" }}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography
          variant="body1"
          sx={{ mt: 2, color: light ? "rgba(255,255,255,0.78)" : "text.secondary" }}
        >
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}
