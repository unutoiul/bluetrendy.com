import type { CSSObject } from "@mui/material/styles";

// Class names used in the markup. Each is prefixed so it stays unique across the site.
const styles = {
  controls: "WebsiteEntrance__controls",
  entrance: "WebsiteEntrance__entrance",
  layout: "WebsiteEntrance__layout",
  notice: "WebsiteEntrance__notice",
} as const;

export default styles;

export const websiteEntranceSheet: CSSObject[] = [
  { ".WebsiteEntrance__entrance": {
      position: "fixed",
      inset: "0",
      boxSizing: "border-box",
      width: "100%",
      height: ["100%", "100dvh"],
      maxWidth: "none",
      maxHeight: "none",
      margin: "0",
      padding: "0",
      overflow: "hidden",
      border: "0",
      background: "#000628",
      color: "#eaf3ff",
      colorScheme: "dark",
      fontFamily: "var(--font-sans), \"Segoe UI\", sans-serif",
    } },
  { ".WebsiteEntrance__entrance::backdrop": { background: "#000628" } },
  { "[data-entry-pending] > .WebsiteEntrance__entrance:not([open])": { display: "block", zIndex: "1400" } },
  { "html:has(.WebsiteEntrance__entrance[open])": { overflow: "hidden" } },
  { ".WebsiteEntrance__layout": { height: "100%", display: "grid", gridTemplateRows: "minmax(0, 1fr) auto" } },
  { ".WebsiteEntrance__controls": {
      display: "flex",
      alignItems: "center",
      justifySelf: "center",
      gap: "14px",
      width: "min(340px, calc(100% - 32px))",
      padding: "0 0 max(8px, env(safe-area-inset-bottom))",
    } },
  { ".WebsiteEntrance__controls button": {
      minWidth: "66px",
      minHeight: "44px",
      border: "0",
      background: "transparent",
      color: "#bdd3e4",
      font: "inherit",
      fontSize: "12px",
      cursor: "pointer",
    } },
  { ".WebsiteEntrance__controls button:hover": { color: "white" } },
  { ".WebsiteEntrance__controls input": { flex: "1", minWidth: "0", height: "20px", accentColor: "#8edfff", cursor: "pointer" } },
  { ".WebsiteEntrance__controls :focus-visible": { outline: "2px solid #84dfff", outlineOffset: "2px" } },
  { ".WebsiteEntrance__notice": { margin: "8px auto", color: "#bdd3e4", fontSize: "13px" } },
  { "@media (max-height: 360px)": { ".WebsiteEntrance__controls": { paddingBottom: "0" } } },
];
