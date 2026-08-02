import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import logoLockup from "@/public/brand/logo.png";

// Intrinsic 698x242 — keep the lockup's aspect ratio when scaling by height.
const ASPECT = logoLockup.width / logoLockup.height;

/** Standard lockup size, shared by the header and footer so the two stay identical. */
export const LOGO_HEIGHT = 100;

/** Rendered width for a given height — used to size the header badge. */
export const logoWidth = (height: number) => Math.round(height * ASPECT);

type LogoProps = {
  height?: number;
  href?: string | null;
};

export default function Logo({ height = LOGO_HEIGHT, href = "/" }: LogoProps) {
  const width = logoWidth(height);

  const mark = (
    <Image
      src={logoLockup}
      alt="BlueTrendy Intelligence"
      height={height}
      width={width}
      priority
      quality={100}
      style={{ height, width, display: "block" }}
    />
  );

  if (!href) {
    return (
      <Box component="span" sx={{ display: "inline-flex", lineHeight: 0 }}>
        {mark}
      </Box>
    );
  }

  return (
    <Link
      href={href}
      aria-label="BlueTrendy Intelligence — home"
      style={{ display: "inline-flex", lineHeight: 0, textDecoration: "none" }}
    >
      {mark}
    </Link>
  );
}
