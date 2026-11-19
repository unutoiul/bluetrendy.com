"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import Box from "@mui/material/Box";
import { keyframes, type SxProps, type Theme } from "@mui/material/styles";
import { palette, withAlpha } from "@/theme/palette";

type HeadingMotionProps = {
  component?: "h1" | "h2";
  id?: string;
  text: string;
  /** Closing words drawn in the brand's blue gradient. */
  accent?: string;
  /** Dark sections get white-to-ice type; light sections get ink-to-blue. */
  tone?: "dark" | "light";
  /** Play on page load instead of waiting to scroll into view (for banner headlines). */
  immediate?: boolean;
  sx?: SxProps<Theme>;
};

// Each word rises out of a soft blur, tipping up from its baseline.
const rise = keyframes`
  from { opacity: 0; transform: translateY(0.42em) rotateX(-58deg); filter: blur(8px); }
  60% { filter: blur(0); }
  to { opacity: 1; transform: none; filter: none; }
`;
// Then a band of light passes across the words, one after another.
const sweep = keyframes`
  from { background-position: 135% 0, 0 0; }
  to { background-position: -35% 0, 0 0; }
`;

const palettes = {
  dark: { fill: `linear-gradient(180deg, ${palette.white} 30%, ${palette.slate[100]} 100%)`, shine: withAlpha(palette.white, 0.95),
    accent: `linear-gradient(100deg, ${palette.slate[50]} 0%, ${palette.sky[150]} 45%, ${palette.blue[350]} 100%)` },
  light: { fill: `linear-gradient(180deg, ${palette.navy[725]} 30%, ${palette.blue[550]} 100%)`, shine: withAlpha(palette.blue[250], 0.95),
    accent: `linear-gradient(100deg, ${palette.blue[450]} 0%, ${palette.blue[325]} 60%, ${palette.blue[500]} 100%)` },
};

const words = (text: string) => text.split(/\s+/).filter(Boolean);

/**
 * A large heading whose words rise into place one by one, then catch a passing band of
 * light. Its type is a soft vertical gradient (white to ice on dark sections, ink to blue
 * on light ones) that stays easy to read. Below the fold it waits until it scrolls into
 * view; reduced motion shows it still.
 */
export default function HeadingMotion({ component = "h2", id, text, accent, tone = "dark", immediate = false, sx }: HeadingMotionProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  // Headlines that play on load are marked shown in the server HTML, so they animate from first paint.
  const [state, setState] = useState<"shown" | "waiting" | "idle">(immediate ? "shown" : "idle");
  const colors = palettes[tone];

  useEffect(() => {
    if (immediate) return;
    const heading = ref.current;
    if (!heading) return;
    // Headings already on screen stay visible; the rest wait for their turn.
    if (heading.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setState("waiting");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setState("shown");
    }, { rootMargin: "0px 0px -12% 0px" });
    observer.observe(heading);
    return () => observer.disconnect();
  }, [immediate]);

  const lead = words(text);
  const tail = accent ? words(accent) : [];
  const word = (value: string, index: number, isAccent: boolean) => (
    <Fragment key={index}>
      {index > 0 && " "}
      <span className={isAccent ? "word accent" : "word"} style={{ "--i": index } as CSSProperties}>{value}</span>
    </Fragment>
  );

  return (
    <Box component={component} id={id} ref={ref} data-motion={state}
      sx={[{
        perspective: "900px",
        "& .word": {
          display: "inline-block",
          transformOrigin: "50% 100%",
          backgroundImage: `linear-gradient(100deg, transparent 42%, ${colors.shine} 50%, transparent 58%), ${colors.fill}`,
          backgroundSize: "260% 100%, 100% 100%",
          backgroundPosition: "135% 0, 0 0",
          backgroundRepeat: "no-repeat",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: tone === "dark" ? palette.grey[25] : palette.navy[725],
          // Keep descenders inside the painted box.
          paddingBottom: "0.08em",
        },
        "& .accent": {
          backgroundImage: `linear-gradient(100deg, transparent 42%, ${colors.shine} 50%, transparent 58%), ${colors.accent}`,
          filter: tone === "dark" ? `drop-shadow(0 0 18px ${withAlpha(palette.blue[250], 0.25)})` : "none",
        },
        "&[data-motion='waiting'] .word": { opacity: 0 },
        "&[data-motion='shown'] .word": {
          animation: `${rise} 0.9s cubic-bezier(0.22, 1, 0.36, 1) both, ${sweep} 1.5s cubic-bezier(0.45, 0, 0.25, 1) both`,
          animationDelay: "calc(var(--i) * 75ms), calc(var(--i) * 75ms + 550ms)",
        },
        "@media (prefers-reduced-motion: reduce)": {
          "&[data-motion] .word": { animation: "none !important", opacity: "1 !important" },
        },
        "@media (forced-colors: active)": { "& .word": { WebkitTextFillColor: "currentColor", backgroundImage: "none" } },
      }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      {lead.map((value, index) => word(value, index, false))}
      {tail.map((value, index) => word(value, lead.length + index, true))}
    </Box>
  );
}
