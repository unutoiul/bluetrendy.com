import type { CSSObject } from "@mui/material/styles";

// The entrance film's POWER ME button. public/brand/shadow-intro/power-me.css keeps a copy for /intro.html.

export const powerMeSheet: CSSObject[] = [
  { ".power-me": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: ".65em",
      minWidth: "152px",
      minHeight: "46px",
      boxSizing: "border-box",
      padding: "0 22px",
      border: "1px solid #cbf4ff",
      borderRadius: "999px",
      background: "linear-gradient(125deg, #c6f3ff, #83d6ff 68%, #69bcff)",
      boxShadow: "0 4px 20px #087ac224",
      color: "#03172c",
      fontFamily: "inherit",
      fontSize: "12px",
      fontWeight: "720",
      letterSpacing: ".13em",
      lineHeight: "1",
      whiteSpace: "nowrap",
      textDecoration: "none",
      cursor: "pointer",
    } },
  { ".power-me > span": { font: "18px/1 \"Segoe UI Symbol\", sans-serif", letterSpacing: "normal" } },
  { ".power-me:hover": { background: "#c4f2ff", color: "#03172c" } },
  { ".power-me:focus-visible": { outline: "2px solid white", outlineOffset: "4px" } },
];
