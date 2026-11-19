import type { CSSObject } from "@mui/material/styles";
import { palette } from "./palette";

// Site-wide styles, rendered once by SiteStyles through MUI GlobalStyles.

export const siteGlobalStyles: CSSObject[] = [
  { "html, body": { maxWidth: "100vw", overflowX: "clip" } },
  { body: { minHeight: "100vh", display: "flex", flexDirection: "column", background: `linear-gradient(180deg, ${palette.grey[25]} 0%, ${palette.grey[25]} 55%, ${palette.slate[50]} 100%)` } },
  { main: { flex: "1", scrollMarginTop: "80px" } },
  { ".skip-to-content": {
      position: "fixed",
      zIndex: "1500",
      top: "8px",
      left: "8px",
      padding: "10px 16px",
      borderRadius: "6px",
      color: palette.white,
      background: palette.navy[725],
      transform: "translateY(-170%)",
    } },
  { ".skip-to-content:focus": { transform: "none" } },
  { a: { color: "inherit" } },
  // ---------- Motion ----------
  { ":root": { "--ease-out": "cubic-bezier(0.22, 1, 0.36, 1)" } },
  { "@keyframes rise-in": { from: { opacity: "0", transform: "translateY(var(--rise, 18px))" }, to: { opacity: "1", transform: "none" } } },
  { "@keyframes line-up": { from: { transform: "translateY(110%)" }, to: { transform: "none" } } },
  { "@keyframes fade-in": { from: { opacity: "0" }, to: { opacity: "1" } } },
  { "@keyframes sculpt-in": {
      from: { opacity: "0", transform: "scale(0.92) rotate(-2deg)", filter: "blur(16px)" },
      to: { opacity: "1", transform: "none", filter: "none" },
    } },
  { "@keyframes clip-up": {
      from: { clipPath: "inset(0 0 100% 0)", transform: "translateY(26px)" },
      to: { clipPath: "inset(0)", transform: "none" },
    } },
  { "@keyframes mark-drift": {
      from: { opacity: "0", transform: "rotate(-30deg) scale(0.9)" },
      to: { opacity: "0.09", transform: "rotate(-14deg)" },
    } },
  { "@keyframes focus-ring": { from: { outlineOffset: "9px", outlineColor: "transparent" } } },
  // Page arrival: each page plays one short sequence, delayed per element with --d.
  { ".arrive": { animation: "rise-in 0.8s var(--ease-out) both", animationDelay: "var(--d, 0s)" } },
  { ".line-mask": { display: "block", overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em" } },
  { ".line-mask > span": { display: "block", animation: "line-up 1s var(--ease-out) both", animationDelay: "var(--d, 0s)" } },
  { ".sculpt-in": { animation: "sculpt-in 1.5s var(--ease-out) both", animationDelay: "var(--d, 0s)" } },
  { ".clip-up": { animation: "clip-up 1s var(--ease-out) backwards", animationDelay: "var(--d, 0s)" } },
  { ".mark-drift": { animation: "mark-drift 1.6s var(--ease-out) both" } },
  // Hold the home page arrival until the visitor leaves the entrance film.
  { "html:has(dialog[data-website-entrance][open]) :is(.arrive, .line-mask > span, .sculpt-in)": { animationPlayState: "paused" } },
  // Text links draw their underline from the left.
  { ".link-draw": {
      textDecoration: "none",
      background: "linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat",
      transition: "background-size 0.45s var(--ease-out), color 0.2s ease",
    } },
  { ".link-draw:hover, .link-draw:focus-visible": { backgroundSize: "100% 1px" } },
  // Click spark: a ring and eight rays at the pointer.
  { ".click-spark": { position: "fixed", zIndex: "2000", width: "0", height: "0", pointerEvents: "none" } },
  { ".click-spark svg": { position: "absolute", left: "-32px", top: "-32px", width: "64px", height: "64px", overflow: "visible" } },
  { ".click-spark circle": {
      fill: "none",
      stroke: palette.blue[350],
      strokeWidth: "2",
      vectorEffect: "non-scaling-stroke",
      transformBox: "fill-box",
      transformOrigin: "center",
      animation: "spark-ring 0.55s var(--ease-out) forwards",
    } },
  // Alternate cobalt and ice rays so the spark reads on light and dark sections.
  { ".click-spark g:nth-of-type(odd) line": { stroke: palette.blue[500] } },
  { ".click-spark line": {
      stroke: palette.sky[175],
      strokeWidth: "2.4",
      strokeLinecap: "round",
      animation: "spark-ray 0.5s var(--ease-out) forwards",
    } },
  { "@keyframes spark-ring": { from: { transform: "scale(0.4)", opacity: "0.95" }, to: { transform: "scale(3.4)", opacity: "0" } } },
  { "@keyframes spark-ray": { from: { transform: "translateY(0)", opacity: "1" }, to: { transform: "translateY(-11px)", opacity: "0" } } },
  { "@media (prefers-reduced-motion: reduce)": {
      ".arrive, .line-mask > span, .sculpt-in, .clip-up": { animationName: "fade-in", animationDuration: "0.4s" },
      ".mark-drift": { animation: "none" },
    } },
  { ".sr-only": {
      position: "absolute",
      width: "1px",
      height: "1px",
      overflow: "hidden",
      clipPath: "inset(50%)",
      whiteSpace: "nowrap",
    } },
  // ---------- Split text ----------
  // Words rise out of a blur, flipping up from their baseline. --i is the word's
  // position in its line; --split-delay offsets a whole line.
  { "@keyframes word-in": {
      from: { opacity: "0", transform: "translateY(0.6em) rotateX(-80deg)", filter: "blur(10px)" },
      "60%": { filter: "blur(0)" },
      to: { opacity: "1", transform: "none", filter: "none" },
    } },
  { "@keyframes word-out": { to: { opacity: "0", transform: "translateY(-0.4em) rotateX(55deg)", filter: "blur(8px)" } } },
  { ".split": { perspective: "900px" } },
  { ".split .w": { display: "inline-block", transformOrigin: "50% 100%", backfaceVisibility: "hidden" } },
  { ".split-now .w": {
      animation: "word-in 0.9s var(--ease-out) both",
      animationDelay: "calc(var(--i, 0) * 60ms + var(--split-delay, 0ms))",
    } },
  // On the home page, headings wait until they scroll into view.
  { "@media (prefers-reduced-motion: no-preference)": {
      "[data-experience] [data-arrive]:not([data-arrived]) .split-on-arrive .w": { opacity: "0" },
      "[data-experience] [data-arrived] .split-on-arrive .w": {
        animation: "word-in 0.9s var(--ease-out) both",
        animationDelay: "calc(var(--i, 0) * 60ms + var(--split-delay, 80ms))",
      },
    } },
  // Home headline carousel: the new headline flips in word by word, then a beam of
  // light writes the accent line; the previous headline dissolves upward.
  { "@keyframes word-soft-in": {
      from: { opacity: "0", transform: "translateY(0.5em)", filter: "blur(5px)" },
      to: { opacity: "1", transform: "none", filter: "none" },
    } },
  { "@keyframes fade-away": { to: { opacity: "0", filter: "blur(4px)" } } },
  // The clip reaches past the box so the accent's glow is not cut into a rectangle.
  { "@keyframes accent-write": { from: { clipPath: "inset(-40% 100% -40% -12%)" }, to: { clipPath: "inset(-40% -12% -40% -12%)" } } },
  { "@keyframes accent-beam": {
      "0%": { left: "0", opacity: "0" },
      "12%": { opacity: "1" },
      "80%": { opacity: "1" },
      "100%": { left: "100%", opacity: "0" },
    } },
  { "@keyframes accent-out": { to: { opacity: "0", transform: "translateY(-0.25em)", filter: "blur(8px)" } } },
  { ".msg[data-state=\"in\"] .w": { animation: "word-in 0.85s var(--ease-out) both", animationDelay: "calc(var(--i) * 70ms + 60ms)" } },
  { ".msg[data-state=\"out\"] .w": { animation: "word-out 0.42s cubic-bezier(0.5, 0, 0.75, 0) both", animationDelay: "calc(var(--i) * 22ms)" } },
  { ".msg-body[data-state=\"in\"] .w": { animationName: "word-soft-in", animationDuration: "0.6s", animationDelay: "calc(var(--i) * 9ms + 420ms)" } },
  { ".msg-body[data-state=\"out\"] .w": { animation: "fade-away 0.25s ease-in both" } },
  { ".msg-accent": { position: "relative", width: "fit-content" } },
  { ".msg[data-state=\"in\"] .msg-accent": { animation: "accent-write 0.95s cubic-bezier(0.65, 0, 0.35, 1) backwards", animationDelay: "var(--split-delay)" } },
  { ".msg[data-state=\"in\"] .msg-accent::after": {
      content: "\"\"",
      position: "absolute",
      top: "10%",
      bottom: "14%",
      width: "3px",
      marginLeft: "-3px",
      borderRadius: "3px",
      background: palette.cyan[25],
      boxShadow: `0 0 10px 2px ${palette.sky[150]}, 0 0 28px 6px ${palette.blue[350]}`,
      opacity: "0",
      pointerEvents: "none",
      animation: "accent-beam 0.95s cubic-bezier(0.65, 0, 0.35, 1) both",
      animationDelay: "var(--split-delay)",
    } },
  { ".msg[data-state=\"out\"] .msg-accent": { animation: "accent-out 0.4s ease-in both", animationDelay: "60ms" } },
  { ".msg[data-state=\"out\"]": { pointerEvents: "none", userSelect: "none" } },
  { "@media (prefers-reduced-motion: reduce)": {
      ".msg[data-state=\"out\"]": { visibility: "hidden" },
      ".msg .msg-accent, .msg .msg-accent::after": { animation: "none !important" },
    } },
  // ---------- Buttons ---------- Rolling label: each letter flips up and its copy rolls in from below.
  { ".roll-text": { display: "inline-flex", verticalAlign: "top" } },
  { ".roll-text-letters": { display: "inline-flex", overflow: "hidden", height: "1.3em", lineHeight: "1.3" } },
  { ".roll-text-letters > span": {
      display: "inline-block",
      whiteSpace: "pre",
      textShadow: "0 1.3em currentColor",
      transition: "transform 0.55s var(--ease-out)",
      transitionDelay: "calc(var(--i) * 16ms)",
    } },
  { ":is(a, button):is(:hover, :focus-visible) .roll-text-letters > span": { transform: "translateY(-1.3em)" } },
  // Arrows leave on one side and come back on the other.
  { "@keyframes arrow-swap": {
      "0%": { transform: "none", opacity: "1" },
      "42%": { transform: "translateX(11px)", opacity: "0" },
      "43%": { transform: "translateX(-11px)", opacity: "0" },
      "100%": { transform: "none", opacity: "1" },
    } },
  { "@keyframes arrow-swap-diagonal": {
      "0%": { transform: "none", opacity: "1" },
      "42%": { transform: "translate(9px, -9px)", opacity: "0" },
      "43%": { transform: "translate(-9px, 9px)", opacity: "0" },
      "100%": { transform: "none", opacity: "1" },
    } },
  { ".MuiButton-root:is(:hover, .Mui-focusVisible) .MuiButton-endIcon > svg[data-testid^=\"Arrow\"]": { animation: "arrow-swap 0.6s var(--ease-out)" } },
  { ".MuiButton-root:is(:hover, .Mui-focusVisible) .MuiButton-endIcon > svg[data-testid^=\"ArrowOutward\"]": { animationName: "arrow-swap-diagonal" } },
  // Registered so the border beam in Experience.module.css can animate its angle.
  { "@property --beam-angle": { syntax: "\"<angle>\"", inherits: "false", initialValue: "0deg" } },
  { "@media (prefers-reduced-motion: reduce)": {
      ".split .w": { animation: "none !important", opacity: "1 !important" },
      ".roll-text-letters > span": { transition: "none" },
      ":is(a, button):is(:hover, :focus-visible) .roll-text-letters > span": { transform: "none" },
      ".MuiButton-root .MuiButton-endIcon > svg": { animation: "none !important" },
    } },
];
