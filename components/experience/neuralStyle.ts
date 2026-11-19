import type { CSSObject, SxProps, Theme } from "@mui/material/styles";

type Style = SxProps<Theme>;

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Animations for the neural chapters. These sections render on the server, where MUI's
 * keyframes() helper is unavailable, so HomeStyles injects them through GlobalStyles.
 */
export const neuralKeyframes: CSSObject[] = [
  { "@keyframes neural-breathe": {
      "0%, 100%": { boxShadow: "0 0 0 1px rgba(111, 220, 255, 0.25), 0 0 14px rgba(20, 150, 255, 0.35)" },
      "50%": { boxShadow: "0 0 0 1px rgba(111, 220, 255, 0.5), 0 0 24px rgba(20, 160, 255, 0.6)" },
    } },
  { "@keyframes neural-sweep": { from: { transform: "translateX(-130%)" }, to: { transform: "translateX(130%)" } } },
  // A spark of current runs along a connector, across on wide screens and down on narrow ones.
  { "@keyframes neural-current": {
      "0%": { left: 0, opacity: 0 }, "15%": { opacity: 1 }, "85%": { opacity: 1 }, "100%": { left: "100%", opacity: 0 },
    } },
  { "@keyframes neural-current-down": {
      "0%": { top: 0, opacity: 0 }, "15%": { opacity: 1 }, "85%": { opacity: 1 }, "100%": { top: "100%", opacity: 0 },
    } },
];

/** Shared pieces of the neural look used by the home page chapters. */
export const neural = {
  ease,

  /** A small uppercase label with a light trail after it. */
  label: {
    display: "flex", alignItems: "center", gap: "12px", m: "0 0 12px",
    color: "#7fe3ff", fontSize: "0.76rem", fontWeight: 650, letterSpacing: "0.16em", textTransform: "uppercase",
    "&::after": { content: '""', width: 34, height: "1px", background: "linear-gradient(90deg, #6fdcff, transparent)",
      boxShadow: "0 0 8px #13a9ff" },
  } satisfies Style,

  /** Gradient text for the closing words of a heading. */
  accentText: {
    background: "linear-gradient(100deg, #d2f8ff 0%, #6fd6ff 45%, #3d95ff 100%)",
    backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "#76e0ff",
    filter: "drop-shadow(0 0 22px rgba(53, 182, 255, 0.28))",
    "@media (forced-colors: active)": { WebkitTextFillColor: "currentColor" },
  } satisfies Style,

  /** A text link whose arrow slides ahead of it. */
  trailLink: {
    display: "inline-flex", alignItems: "center", gap: "8px", minHeight: 44, color: "#9fe8ff", fontWeight: 600,
    fontSize: "0.95rem", textDecoration: "none", whiteSpace: "nowrap",
    "& svg": { fontSize: 18, transition: `transform 0.35s ${ease}` },
    "&:hover": { color: "#d8f8ff", textShadow: "0 0 12px rgba(41, 160, 255, 0.8)" },
    "&:hover svg": { transform: "translateX(4px)" },
    "&:focus-visible": { outline: "2px solid #a8ecff", outlineOffset: 4, borderRadius: "4px" },
  } satisfies Style,

  /** A glass panel with a lit top edge; it lifts and glows on hover or keyboard focus. */
  glassCard: {
    position: "relative", isolation: "isolate", overflow: "hidden", borderRadius: "16px", color: "#eef6ff",
    background: "linear-gradient(160deg, rgba(20, 56, 104, 0.74), rgba(6, 20, 44, 0.9) 62%)",
    border: "1px solid rgba(86, 156, 222, 0.4)",
    boxShadow: "inset 0 1px 0 rgba(150, 215, 255, 0.18), inset 0 0 26px rgba(39, 122, 208, 0.14), 0 20px 44px -28px rgba(0, 0, 0, 0.95)",
    backdropFilter: "blur(6px)",
    transition: `transform 0.45s ${ease}, border-color 0.3s ease, box-shadow 0.45s ${ease}`,
    "&::before": {
      content: '""', position: "absolute", top: 0, left: "14%", right: "14%", height: "1px", zIndex: 2,
      background: "linear-gradient(90deg, transparent, #8eeaff, transparent)", opacity: 0.45,
      transition: `left 0.5s ${ease}, right 0.5s ${ease}, opacity 0.3s ease`,
    },
    "&::after": {
      content: '""', position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      background: "linear-gradient(105deg, transparent 30%, rgba(150, 230, 255, 0.13) 48%, transparent 64%)",
      transform: "translateX(-130%)",
    },
    "&:hover, &:focus-visible, &:focus-within": {
      borderColor: "#6fdcff",
      boxShadow: "inset 0 1px 0 rgba(180, 238, 255, 0.45), inset 0 0 30px rgba(39, 150, 255, 0.24), 0 0 0 1px rgba(111, 220, 255, 0.3), 0 0 28px rgba(20, 150, 255, 0.45), 0 26px 52px -26px rgba(0, 60, 160, 0.95)",
    },
    "&:hover::before, &:focus-visible::before, &:focus-within::before": { left: 0, right: 0, opacity: 1 },
    "&:hover::after, &:focus-visible::after": { animation: `neural-sweep 1.1s ${ease}` },
    "@media (prefers-reduced-motion: reduce)": { transition: "border-color 0.3s ease, box-shadow 0.3s ease", "&:hover::after": { animation: "none" } },
  } satisfies Style,

  /** A round, glowing holder for an icon. */
  iconOrb: {
    display: "grid", placeItems: "center", flex: "none", width: 50, height: 50, borderRadius: "14px", color: "#8eeaff",
    background: "radial-gradient(circle at 50% 30%, rgba(60, 170, 255, 0.35), rgba(8, 30, 62, 0.9) 70%)",
    border: "1px solid rgba(111, 220, 255, 0.38)",
    boxShadow: "0 0 0 1px rgba(111, 220, 255, 0.12), 0 0 18px rgba(20, 150, 255, 0.3), inset 0 0 12px rgba(80, 190, 255, 0.25)",
    transition: `transform 0.45s ${ease}, box-shadow 0.35s ease, color 0.3s ease`,
    "& svg": { fontSize: 26, filter: "drop-shadow(0 0 6px rgba(34, 181, 255, 0.9))" },
  } satisfies Style,

  /** Section backgrounds: deep navy with pools of blue light. */
  sectionTone: (glowAt: string) => ({
    position: "relative", overflow: "hidden", isolation: "isolate", color: "#eef6ff",
    background: `radial-gradient(ellipse at ${glowAt}, rgba(13, 64, 140, 0.75) 0%, transparent 52%), radial-gradient(ellipse at 0% 100%, rgba(7, 42, 85, 0.8) 0%, transparent 45%), linear-gradient(180deg, #050f22, #061833)`,
    borderTop: "1px solid #1d4472",
  }) satisfies Style,
};
