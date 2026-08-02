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

// Idle shimmer: one pass roughly every 9s. The sweep lives in the back half of
// the cycle so that restarting the animation (which happens when the hover
// sweep hands back) leaves a long quiet gap instead of a second flash.
const IDLE_CYCLE = "9s";
const HOVER_SWEEP = "900ms";

// Parked positions sit outside the clipped box, so the band is only ever
// visible while it is crossing.
const OFF_LEFT = "translateX(-160%) skewX(-14deg)";
const OFF_RIGHT = "translateX(340%) skewX(-14deg)";

type LogoProps = {
  height?: number;
  href?: string | null;
};

export default function Logo({ height = LOGO_HEIGHT, href = "/" }: LogoProps) {
  const width = logoWidth(height);

  const mark = (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        lineHeight: 0,
        transition: "transform 350ms cubic-bezier(0.2, 0.7, 0.3, 1)",
        "@keyframes btLogoIdleSheen": {
          "0%, 62%": { transform: OFF_LEFT },
          "76%, 100%": { transform: OFF_RIGHT },
        },
        "@keyframes btLogoHoverSheen": {
          "0%": { transform: OFF_LEFT },
          "100%": { transform: OFF_RIGHT },
        },
        "&:hover": { transform: "scale(1.03)" },
        "&:hover .bt-logo-sheen::after": {
          animation: `btLogoHoverSheen ${HOVER_SWEEP} cubic-bezier(0.35, 0, 0.25, 1)`,
        },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&:hover": { transform: "none" },
          "& .bt-logo-sheen::after, &:hover .bt-logo-sheen::after": { animation: "none" },
        },
      }}
    >
      <Image
        src={logoLockup}
        alt="BlueTrendy Intelligence"
        height={height}
        width={width}
        priority
        quality={100}
        style={{ height, width, display: "block" }}
      />

      {/* Light band, clipped to the lockup's own pixels so it rides the mark and
          wordmark rather than sweeping a rectangle across the transparent gaps. */}
      <Box
        aria-hidden
        className="bt-logo-sheen"
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          maskImage: `url(${logoLockup.src})`,
          WebkitMaskImage: `url(${logoLockup.src})`,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "-25%",
            bottom: "-25%",
            width: "38%",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
            transform: OFF_LEFT,
            animation: `btLogoIdleSheen ${IDLE_CYCLE} linear infinite`,
          },
        }}
      />
    </Box>
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
