import type { CSSObject, SxProps, Theme } from "@mui/material/styles";
import { palette, withAlpha } from "@/theme/palette";

type Style = SxProps<Theme>;

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

// The home page's blues, top to bottom: from the header's navy, up to a bright blue at the
// services, and back down to the footer's navy.
const homeBlues = { header: palette.navy[800], hero: palette.navy[725], services: palette.navy[600], agents: palette.navy[675], footer: palette.navy[775] };
export type HomeBlue = keyof typeof homeBlues;

/**
 * Animations for the neural chapters. These sections render on the server, where MUI's
 * keyframes() helper is unavailable, so HomeStyles injects them through GlobalStyles.
 */
export const neuralKeyframes: CSSObject[] = [
  { "@keyframes neural-breathe": {
      "0%, 100%": { boxShadow: `0 0 0 1px ${withAlpha(palette.sky[150], 0.25)}, 0 0 14px ${withAlpha(palette.blue[350], 0.35)}` },
      "50%": { boxShadow: `0 0 0 1px ${withAlpha(palette.sky[150], 0.5)}, 0 0 24px ${withAlpha(palette.blue[300], 0.6)}` },
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
    color: palette.sky[150], fontSize: "0.76rem", fontWeight: 650, letterSpacing: "0.16em", textTransform: "uppercase",
    "&::after": { content: '""', width: 34, height: "1px", background: `linear-gradient(90deg, ${palette.sky[150]}, transparent)`,
      boxShadow: `0 0 8px ${palette.blue[300]}` },
  } satisfies Style,

  /** Gradient text for the closing words of a heading. */
  accentText: {
    background: `linear-gradient(100deg, ${palette.cyan[75]} 0%, ${palette.sky[150]} 45%, ${palette.blue[350]} 100%)`,
    backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: palette.sky[150],
    filter: `drop-shadow(0 0 22px ${withAlpha(palette.blue[250], 0.28)})`,
    "@media (forced-colors: active)": { WebkitTextFillColor: "currentColor" },
  } satisfies Style,

  /** A text link whose arrow slides ahead of it. */
  trailLink: {
    display: "inline-flex", alignItems: "center", gap: "8px", minHeight: 44, color: palette.sky[100], fontWeight: 600,
    fontSize: "0.95rem", textDecoration: "none", whiteSpace: "nowrap",
    "& svg": { fontSize: 18, transition: `transform 0.35s ${ease}` },
    "&:hover": { color: palette.slate[50], textShadow: `0 0 12px ${withAlpha(palette.blue[300], 0.8)}` },
    "&:hover svg": { transform: "translateX(4px)" },
    "&:focus-visible": { outline: `2px solid ${palette.sky[100]}`, outlineOffset: 4, borderRadius: "4px" },
  } satisfies Style,

  /** A glass panel with a lit top edge; it lifts and glows on hover or keyboard focus. */
  glassCard: {
    position: "relative", isolation: "isolate", overflow: "hidden", borderRadius: "16px", color: palette.grey[25],
    background: `linear-gradient(160deg, ${withAlpha(palette.navy[675], 0.74)}, ${withAlpha(palette.navy[800], 0.9)} 62%)`,
    border: `1px solid ${withAlpha(palette.blue[325], 0.4)}`,
    boxShadow: `inset 0 1px 0 ${withAlpha(palette.sky[175], 0.18)}, inset 0 0 26px ${withAlpha(palette.blue[425], 0.14)}, 0 20px 44px -28px ${withAlpha(palette.black, 0.95)}`,
    backdropFilter: "blur(6px)",
    transition: `transform 0.45s ${ease}, border-color 0.3s ease, box-shadow 0.45s ${ease}`,
    "&::before": {
      content: '""', position: "absolute", top: 0, left: "14%", right: "14%", height: "1px", zIndex: 2,
      background: `linear-gradient(90deg, transparent, ${palette.sky[100]}, transparent)`, opacity: 0.45,
      transition: `left 0.5s ${ease}, right 0.5s ${ease}, opacity 0.3s ease`,
    },
    "&::after": {
      content: '""', position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      background: `linear-gradient(105deg, transparent 30%, ${withAlpha(palette.sky[100], 0.13)} 48%, transparent 64%)`,
      transform: "translateX(-130%)",
    },
    "&:hover, &:focus-visible, &:focus-within": {
      borderColor: palette.sky[150],
      boxShadow: `inset 0 1px 0 ${withAlpha(palette.slate[75], 0.45)}, inset 0 0 30px ${withAlpha(palette.blue[350], 0.24)}, 0 0 0 1px ${withAlpha(palette.sky[150], 0.3)}, 0 0 28px ${withAlpha(palette.blue[350], 0.45)}, 0 26px 52px -26px ${withAlpha(palette.navy[600], 0.95)}`,
    },
    "&:hover::before, &:focus-visible::before, &:focus-within::before": { left: 0, right: 0, opacity: 1 },
    "&:hover::after, &:focus-visible::after": { animation: `neural-sweep 1.1s ${ease}` },
    "@media (prefers-reduced-motion: reduce)": { transition: "border-color 0.3s ease, box-shadow 0.3s ease", "&:hover::after": { animation: "none" } },
  } satisfies Style,

  /** A round, glowing holder for an icon. */
  iconOrb: {
    display: "grid", placeItems: "center", flex: "none", width: 50, height: 50, borderRadius: "14px", color: palette.sky[100],
    background: `radial-gradient(circle at 50% 30%, ${withAlpha(palette.blue[300], 0.35)}, ${withAlpha(palette.navy[775], 0.9)} 70%)`,
    border: `1px solid ${withAlpha(palette.sky[150], 0.38)}`,
    boxShadow: `0 0 0 1px ${withAlpha(palette.sky[150], 0.12)}, 0 0 18px ${withAlpha(palette.blue[350], 0.3)}, inset 0 0 12px ${withAlpha(palette.blue[250], 0.25)}`,
    transition: `transform 0.45s ${ease}, box-shadow 0.35s ease, color 0.3s ease`,
    "& svg": { fontSize: 26, filter: `drop-shadow(0 0 6px ${withAlpha(palette.blue[250], 0.9)})` },
  } satisfies Style,

  /**
   * The home page background, one smooth gradient through the blues. Each dark section runs
   * from one stop to the next, so the colour carries on unbroken across section edges. A
   * sideways layer, darker on the left where the copy sits, adds depth in the middle and
   * fades out toward the top and bottom, so each edge is a single flat colour that meets
   * its neighbour (or the header and footer) without a seam.
   */
  blueFlow: (from: HomeBlue, to: HomeBlue) => [
    `linear-gradient(180deg, ${homeBlues[from]}, transparent 20%, transparent 80%, ${homeBlues[to]})`,
    `linear-gradient(90deg, ${withAlpha(palette.navy[850], 0.4)}, ${withAlpha(palette.navy[850], 0)} 45%, ${withAlpha(palette.blue[350], 0.08)})`,
    `linear-gradient(180deg, ${homeBlues[from]}, ${homeBlues[to]})`,
  ].join(", "),

  /** A dark section on the running blue gradient, from one stop of the blues to another. */
  sectionTone: (from: HomeBlue, to: HomeBlue) => ({
    position: "relative", overflow: "hidden", isolation: "isolate", color: palette.grey[25],
    background: neural.blueFlow(from, to),
  }) satisfies Style,
};
