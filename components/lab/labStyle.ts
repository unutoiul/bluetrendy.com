import { useEffect, useRef, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { SxProps, Theme } from "@mui/material/styles";
import { palette, withAlpha } from "@/theme/palette";

type Style = SxProps<Theme>;

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
const lit = `linear-gradient(125deg, ${palette.slate[75]}, ${palette.sky[175]} 68%, ${palette.blue[250]})`;

/**
 * Shared pieces of the interactive demonstrations (the scanner, the calculator, the forecast
 * and the creative showcase), so they read as one family beside the agent demo.
 */
export const lab = {
  ease,
  lit,

  /** A small uppercase caption above a group of controls or results. */
  caption: {
    m: "0 0 12px", color: palette.slate[275], fontSize: "0.78rem", fontWeight: 650, letterSpacing: "0.14em", textTransform: "uppercase",
  } satisfies Style,

  /**
   * One option in a set, drawn as a glass pill on a dark surface. It wraps a hidden radio
   * button, so the keyboard, screen readers and forms treat the set as real radio buttons.
   */
  choice: (selected: boolean, compact = false): Style => ({
    position: "relative", display: "flex", alignItems: "center", gap: 1.25, borderRadius: "12px",
    minHeight: compact ? 40 : 46, px: compact ? 1.5 : 1.75, py: compact ? 0.5 : 1, fontSize: compact ? "0.88rem" : "0.93rem",
    cursor: "pointer", fontWeight: 600, lineHeight: 1.25, userSelect: "none",
    color: selected ? palette.navy[800] : palette.slate[100],
    background: selected ? lit : withAlpha(palette.navy[850], 0.45),
    border: `1px solid ${selected ? "transparent" : withAlpha(palette.sky[175], 0.25)}`,
    boxShadow: selected ? `0 10px 24px -12px ${withAlpha(palette.blue[250], 0.9)}` : "none",
    transition: `background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.3s ${ease}`,
    "& svg": { flex: "none", fontSize: 20 },
    "&:hover": selected ? {} : { color: palette.grey[25], borderColor: palette.sky[150], background: withAlpha(palette.blue[300], 0.12) },
    "&:active": { transform: "scale(0.98)" },
    "&:has(input:focus-visible)": { outline: `2px solid ${palette.sky[100]}`, outlineOffset: 3 },
    "& input": { position: "absolute", inset: 0, width: "100%", height: "100%", m: 0, opacity: 0, cursor: "pointer" },
    "@media (prefers-reduced-motion: reduce)": { transition: "none" },
  }),

  /** MUI's Slider in the brand's colours, for a dark or a light surface. */
  slider: (tone: "dark" | "light"): Style => ({
    height: 6, py: "14px", color: tone === "dark" ? palette.sky[150] : palette.blue[425],
    "& .MuiSlider-rail": { opacity: 1, backgroundColor: tone === "dark" ? withAlpha(palette.sky[175], 0.2) : palette.slate[150] },
    "& .MuiSlider-track": { border: 0, background: `linear-gradient(90deg, ${palette.blue[425]}, ${palette.sky[150]})` },
    "& .MuiSlider-thumb": {
      width: 22, height: 22, backgroundColor: palette.white, border: `2px solid ${palette.blue[425]}`,
      boxShadow: `0 4px 12px -4px ${withAlpha(palette.blue[425], 0.8)}`,
      transition: `box-shadow 0.3s ${ease}`,
      "&::before": { boxShadow: "none" },
      "&:hover, &.Mui-focusVisible": { boxShadow: `0 0 0 8px ${withAlpha(palette.blue[300], 0.22)}` },
      "&.Mui-active": { boxShadow: `0 0 0 12px ${withAlpha(palette.blue[300], 0.28)}` },
    },
  }),

  /** The marker on anything that is a demonstration rather than a result. */
  sample: (tone: "dark" | "light"): Style => ({
    display: "inline-flex", alignItems: "center", gap: 0.75, px: 1.25, py: "5px", borderRadius: 99, fontSize: "0.74rem", fontWeight: 650,
    letterSpacing: "0.04em", lineHeight: 1.3,
    "& svg": { fontSize: 15 },
    ...(tone === "dark"
      ? { color: palette.amber[100], background: withAlpha(palette.amber[175], 0.12), border: `1px solid ${withAlpha(palette.amber[175], 0.4)}` }
      : { color: palette.amber[475], background: palette.amber[50], border: `1px solid ${withAlpha(palette.amber[300], 0.35)}` }),
  }),
};

/**
 * A number that glides to each new value instead of jumping, like a meter settling.
 * With reduced motion it changes at once.
 */
export function useGlide(target: number, duration = 500) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [value, setValue] = useState(target);
  const shown = useRef(target);

  useEffect(() => {
    if (reduced) return;
    const from = shown.current;
    const started = performance.now();
    let frame = 0;
    function step(now: number) {
      const progress = Math.min(1, (now - started) / duration);
      // Ease out: quick at first, then settling.
      shown.current = from + (target - from) * (1 - Math.pow(1 - progress, 3));
      setValue(shown.current);
      if (progress < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, reduced]);

  return reduced ? target : value;
}
