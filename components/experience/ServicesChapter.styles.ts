import type { CSSObject } from "@mui/material/styles";

const styles = {
  layout: "ServicesChapter__layout",
  heading: "ServicesChapter__heading",
  grid: "ServicesChapter__grid",
  service: "ServicesChapter__service",
  icon: "ServicesChapter__icon",
  title: "ServicesChapter__title",
};

export default styles;

export const servicesChapterSheet: CSSObject[] = [
  { ".ServicesChapter__layout": {
      display: "grid",
      gridTemplateColumns: "minmax(180px, .7fr) minmax(0, 2fr)",
      gap: "clamp(32px, 6vw, 100px)",
      alignItems: "start",
    } },
  { ".ServicesChapter__heading h2": {
      margin: "0 0 20px",
      fontSize: "clamp(2rem, 3.6vw, 3.5rem)",
      fontWeight: 600,
      letterSpacing: "-.055em",
      lineHeight: 1.08,
    } },
  { ".ServicesChapter__heading > a": {
      color: "#a6d8f4", display: "inline-flex", gap: "8px", alignItems: "center",
      minHeight: "44px", fontSize: ".94rem", textDecoration: "underline", textUnderlineOffset: "5px",
    } },
  { ".ServicesChapter__heading > a svg": { width: "16px" } },
  { ".ServicesChapter__grid": {
      display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: "40px clamp(24px, 4vw, 64px)",
    } },
  { ".ServicesChapter__service": {
      display: "block", color: "#eef5ff", textDecoration: "none", minWidth: 0,
      borderRadius: "4px",
    } },
  { ".ServicesChapter__icon": { width: "26px", height: "26px", color: "#8fd7f2", marginBottom: "12px" } },
  { ".ServicesChapter__title": {
      display: "flex", gap: "12px", alignItems: "baseline", justifyContent: "space-between",
    } },
  { ".ServicesChapter__title h3": {
      fontSize: "clamp(1.15rem, 1.6vw, 1.5rem)", letterSpacing: "-.03em",
      fontWeight: 600, lineHeight: 1.25, margin: 0,
      textDecorationThickness: "1px", textUnderlineOffset: "5px",
    } },
  { ".ServicesChapter__title > svg": { width: "17px", height: "17px", flexShrink: 0, color: "#8baac0", transition: "transform .2s ease" } },
  { ".ServicesChapter__service p": {
      margin: "10px 0 0", maxWidth: "35ch", color: "#b4c7d7", lineHeight: 1.6,
      fontSize: "1rem",
    } },
  { ".ServicesChapter__service:hover h3, .ServicesChapter__service:focus-visible h3": { color: "#a8dff7", textDecorationLine: "underline" } },
  { ".ServicesChapter__service:hover .ServicesChapter__title > svg": { transform: "translate(2px, -2px)" } },
  { ".ServicesChapter__layout :is(a,button):focus-visible": { outline: "2px solid #a8dff7", outlineOffset: "7px" } },
  { "@media (max-width: 850px)": {
      ".ServicesChapter__layout": { gridTemplateColumns: "1fr", gap: "28px" },
      ".ServicesChapter__heading": { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "10px 24px" },
      ".ServicesChapter__heading h2": { margin: 0 },
    } },
  { "@media (max-width: 520px)": {
      ".ServicesChapter__grid": { gridTemplateColumns: "1fr", gap: "32px" },
      ".ServicesChapter__service p": { maxWidth: "none" },
      ".ServicesChapter__icon": { marginBottom: "8px" },
    } },
  { "@media (prefers-reduced-motion: reduce)": {
      ".ServicesChapter__title > svg": { transition: "none" },
      ".ServicesChapter__service:hover .ServicesChapter__title > svg": { transform: "none" },
    } },
];
