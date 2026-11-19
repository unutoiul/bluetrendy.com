import type { CSSObject } from "@mui/material/styles";

// Layout of the entrance film. public/brand/shadow-intro/entrance-layout.css keeps a copy for /intro.html.

export const entranceLayoutSheet: CSSObject[] = [
  { ".intro-stage": {
      position: "relative",
      containerType: "size",
      minHeight: "0",
      overflow: "hidden",
      display: "grid",
      placeItems: "center",
      background: "#000628",
    } },
  { ".intro-stack": { display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minWidth: "0" } },
  { ".intro-picture": {
      position: "relative",
      flex: "none",
      width: "min(169cqw, 1140px, calc(320cqh - 334px))",
      aspectRatio: "1920 / 600",
      overflow: "hidden",
      pointerEvents: "none",
      maskImage: "linear-gradient(transparent, black 5%, black 98%, transparent), linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      maskComposite: "intersect",
    } },
  { ".intro-picture video": {
      position: "absolute",
      top: "-31.6667%",
      left: "0",
      width: "100%",
      height: "auto",
      aspectRatio: "16 / 9",
      display: "block",
    } },
  { ".intro-picture video[hidden]": { display: "none" } },
  { ".intro-picture[data-lockup=\"true\"]": {
      maskImage: "none",
      background: "url(\"/brand/logo-inverse.svg\") center / min(100%, 77cqw, 480px, 138cqh) auto no-repeat",
    } },
  { ".intro-picture[data-lockup=\"true\"] video": { visibility: "hidden" } },
  { ".intro-tagline": {
      margin: "clamp(6px, 1.2cqh, 12px) 0 0",
      color: "#d4e2f3",
      font: "440 clamp(16px, 2.5cqw, 22px)/1.4 var(--font-sans, Geist), \"Segoe UI\", sans-serif",
      letterSpacing: "-.03em",
      textAlign: "center",
      whiteSpace: "nowrap",
    } },
  { ".intro-tagline span, .intro-tagline strong": { display: "inline-block" } },
  { ".intro-tagline strong": {
      color: "#8fddff",
      fontWeight: "750",
      background: "linear-gradient(108deg, #8fddff 30%, #f5fdff 50%, #8fddff 70%) 100% 50% / 320% 100%",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    } },
  { ".intro-tagline ::selection": { color: "#fff", background: "#215d8d", WebkitTextFillColor: "white" } },
  { ".intro-stack .power-me": { marginTop: "clamp(15px, 2.7cqh, 25px)" } },
  { "@container (height < 320px)": {
      ".intro-tagline": { marginTop: "2px", fontSize: "15px" },
      ".intro-stack .power-me": { minHeight: "40px", marginTop: "9px" },
    } },
  { "@media (forced-colors: active)": { ".intro-tagline strong": { WebkitTextFillColor: "currentColor" } } },
];
