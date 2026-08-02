import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import logoIcon from "@/public/brand/icon.png";

type LogoProps = {
  height?: number;
  href?: string | null;
};

export default function Logo({ height = 34, href = "/" }: LogoProps) {
  const fontSize = Math.round(height * 0.62);

  const mark = (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: height * 0.22 + "px" }}>
      <Image
        src={logoIcon}
        alt=""
        height={height}
        width={height}
        priority
        style={{ height, width: height, display: "block", borderRadius: height * 0.22 }}
      />
      <Typography
        component="span"
        sx={{
          fontSize,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          lineHeight: 1,
          color: "primary.main",
          whiteSpace: "nowrap",
        }}
      >
        blue<Box component="span" sx={{ color: "secondary.main" }}>trendy</Box>
      </Typography>
    </Box>
  );

  if (!href) {
    return (
      <Box component="span" sx={{ display: "inline-flex", lineHeight: 0 }} aria-label="bluetrendy">
        {mark}
      </Box>
    );
  }

  return (
    <Link
      href={href}
      aria-label="bluetrendy — home"
      style={{ display: "inline-flex", lineHeight: 0, textDecoration: "none" }}
    >
      {mark}
    </Link>
  );
}
