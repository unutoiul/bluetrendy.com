import type { ReactNode } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import LivingBackground from "./backgrounds/LivingBackground";
import HeadingMotion from "./motion/HeadingMotion";
import type { EffectName } from "./backgrounds/effects";
import { palette, withAlpha } from "@/theme/palette";

type SplitSectionProps = {
  id: string;
  title: string;
  text?: string;
  link?: { href: string; label: string };
  /** Light: white field with a pale blue blade, like Our clients. Dark: navy field with a glass blade. */
  tone?: "light" | "dark";
  /** Extra content under the copy on the blade, such as a portrait. */
  blade?: ReactNode;
  /** A living background across the section; it fades toward the blade so the copy stays clear. */
  effect?: EffectName;
  seed?: number;
  /** Keep the heading in view while a long right-hand side scrolls past. */
  pinned?: boolean;
  /** Replaces the dark tone's own background, such as a stretch of the home page's blue gradient. */
  background?: string;
  children: ReactNode;
};

const palettes = {
  light: { field: "transparent", blade: palette.slate[50], edge: "transparent", heading: palette.navy[725], text: palette.slate[525], link: palette.blue[550], linkHover: palette.navy[650] },
  dark: { field: palette.navy[850], blade: `linear-gradient(160deg, ${palette.navy[675]} 0%, ${palette.navy[775]} 70%)`, edge: `linear-gradient(180deg, ${palette.sky[100]}, ${palette.blue[350]} 60%, transparent)`,
    heading: palette.grey[25], text: palette.slate[125], link: palette.sky[100], linkHover: palette.slate[50] },
};

// The blade's slanted edge echoes the BlueTrendy mark. It runs to the left edge of the page.
const slant = "polygon(0 0, 100% 0, calc(100% - 54px) 100%, 0 100%)";
const bladeFade = `linear-gradient(180deg, ${palette.black} calc(100% - clamp(160px, 16%, 320px)), transparent)`;

/**
 * A section split in two: a slanted blade on the left carries the heading, a short
 * paragraph and one link; the right-hand side carries the evidence. On narrow screens
 * the blade becomes a full-width band above the content.
 */
export default function SplitSection({ id, title, text, link, tone = "light", blade, effect, seed, pinned, background, children }: SplitSectionProps) {
  const colors = palettes[tone];
  return (
    <Box component="section" aria-labelledby={id} sx={{ position: "relative", overflow: "clip", isolation: "isolate",
      background: background ?? (tone === "dark" ? `radial-gradient(ellipse at 90% 40%, ${withAlpha(palette.navy[600], 0.5)}, transparent 55%), linear-gradient(180deg, ${palette.navy[800]} 0%, ${palette.navy[750]} 50%, ${palette.navy[800]} 100%)` : colors.field),
      color: colors.heading, containerType: "inline-size" }}>
      {effect && <LivingBackground effect={effect} seed={seed} light={tone === "light"} />}
      <Box sx={{ position: "relative", zIndex: 1, width: "var(--page-width)", mx: "auto", display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 3fr) minmax(0, 7fr)" }, columnGap: "clamp(48px, 7vw, 112px)" }}>
        <Box sx={{ position: "relative", isolation: "isolate", display: "flex", flexDirection: "column", alignItems: "flex-start",
          justifyContent: pinned ? "flex-start" : "center", py: { xs: 4, md: "clamp(48px, 6vw, 88px)" } }}>
          <Box aria-hidden="true" sx={{ position: "absolute", zIndex: -1, background: colors.blade,
            inset: { xs: "0 calc((100% - 100cqw) / 2)", md: "0 -48px 0 -100vw" }, clipPath: { md: slant },
            boxShadow: tone === "dark" ? `inset 0 1px 0 ${withAlpha(palette.sky[175], 0.2)}` : "none",
            // The dark blade runs to the foot of the section. Fading it out there lets the section's own
            // gradient carry on into the next one, instead of the blade ending in a hard line.
            ...(tone === "dark" && { maskImage: { md: bladeFade }, WebkitMaskImage: { md: bladeFade } }) }} />
          {tone === "dark" && <Box aria-hidden="true" sx={{ display: { xs: "none", md: "block" }, position: "absolute", zIndex: -1,
            inset: "0 -50px 0 -100vw", background: colors.edge, opacity: 0.85,
            clipPath: "polygon(calc(100% - 2px) 0, 100% 0, calc(100% - 52px) 100%, calc(100% - 54px) 100%)",
            filter: `drop-shadow(0 0 8px ${palette.blue[300]})` }} />}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%",
            position: pinned ? { md: "sticky" } : undefined, top: pinned ? { md: 110 } : undefined }}>
          <HeadingMotion id={id} text={title} tone={tone} sx={{ m: 0, fontWeight: 650, letterSpacing: "-0.06em",
            // Short titles, like "Our clients", fill the blade; longer ones step down so they wrap in two or three lines.
            fontSize: title.length > 16 ? "clamp(2.2rem, 3.3vw, 3.3rem)" : "clamp(2.6rem, 4.6vw, 4.5rem)",
            lineHeight: 1.04, textWrap: "balance" }} />
          {text && <Box component="p" sx={{ m: "20px 0 0", maxWidth: "31ch", color: colors.text, fontSize: "clamp(1rem, 1.2vw, 1.125rem)",
            lineHeight: 1.55 }}>{text}</Box>}
          {link && <Box sx={{ mt: 2.25, "& a": { display: "inline-flex", alignItems: "center", gap: "9px", minHeight: 44, color: colors.link,
            fontWeight: 650, textDecoration: "none" }, "& a:hover": { color: colors.linkHover, textDecoration: "underline", textUnderlineOffset: ".25em" },
            "& svg": { transition: "transform .3s cubic-bezier(0.22, 1, 0.36, 1)" }, "& a:hover svg": { transform: "translateX(3px)" },
            "& a:focus-visible": { outline: `2px solid ${colors.link}`, outlineOffset: 3, borderRadius: "4px" } }}>
            <Link href={link.href} prefetch={false}>{link.label} <ArrowForwardRounded fontSize="small" /></Link>
          </Box>}
          {blade}
          </Box>
        </Box>
        <Box sx={{ minWidth: 0, py: { xs: 4, md: "clamp(40px, 5vw, 72px)" }, alignSelf: "center" }}>{children}</Box>
      </Box>
    </Box>
  );
}
