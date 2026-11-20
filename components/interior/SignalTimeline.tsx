import Link from "next/link";
import Box from "@mui/material/Box";
import { palette, withAlpha } from "@/theme/palette";

type Entry = { period: string; org: string; role: string; href?: string };

// A pulse of light runs down the line, like a signal along a nerve. The keyframes live in
// the list's own styles, so this stays a server component with nothing to hydrate.
const signal = {
  "0%": { top: 0, opacity: 0 },
  "8%": { opacity: 1 },
  "92%": { opacity: 1 },
  "100%": { top: "100%", opacity: 0 },
};

/** The career as a glowing signal line: each engagement is a node that lights up as it arrives. */
export default function SignalTimeline({ entries }: { entries: Entry[] }) {
  return (
    <Box component="ol" data-panel-group sx={{ position: "relative", listStyle: "none", m: 0, p: 0, pl: { xs: 4, sm: 5 }, "@keyframes signal-pulse": signal,
      "&::before": { content: '""', position: "absolute", left: { xs: 9, sm: 13 }, top: 8, bottom: 8, width: 2, borderRadius: 2,
        background: `linear-gradient(180deg, ${palette.sky[100]}, ${palette.blue[350]} 40%, ${palette.blue[550]} 80%, transparent)`, boxShadow: `0 0 12px ${withAlpha(palette.blue[300], 0.7)}` },
      "&::after": { content: '""', position: "absolute", left: { xs: 6, sm: 10 }, width: 8, height: 26, borderRadius: 8,
        background: `linear-gradient(180deg, transparent, ${palette.cyan[25]}, transparent)`, boxShadow: `0 0 14px 4px ${withAlpha(palette.sky[150], 0.8)}`,
        animation: "signal-pulse 6s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        "@media (prefers-reduced-motion: reduce)": { display: "none" } } }}>
      {entries.map(entry => (
        <Box component="li" key={entry.org + entry.period} data-panel="reveal"
          sx={{ position: "relative", py: { xs: 1.75, sm: 2.25 }, borderBottom: `1px solid ${withAlpha(palette.blue[325], 0.18)}`,
            "&:last-of-type": { borderBottom: 0 },
            "&:hover .node, &:focus-within .node": { transform: "scale(1.35)", boxShadow: `0 0 0 4px ${withAlpha(palette.sky[150], 0.18)}, 0 0 22px ${palette.blue[250]}` } }}>
          {/* Centred on the line: its centre sits 10px (14px from sm) into the list, and the list
              item starts 32px (40px) in, so the 12px node starts 28px (32px) left of the item. */}
          <Box className="node" aria-hidden="true" sx={{ position: "absolute", left: { xs: -28, sm: -32 }, top: { xs: 22, sm: 26 }, width: 12, height: 12,
            borderRadius: "50%", background: `radial-gradient(circle, ${palette.cyan[25]} 0 30%, ${palette.blue[300]} 70%)`,
            boxShadow: `0 0 0 3px ${withAlpha(palette.blue[300], 0.18)}, 0 0 14px ${palette.blue[300]}`, transition: "transform .35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow .35s ease" }} />
          <Box component="p" sx={{ m: 0, color: palette.blue[200], fontSize: ".86rem", fontWeight: 550, fontVariantNumeric: "tabular-nums" }}>{entry.period}</Box>
          <Box component="h3" sx={{ m: "4px 0 0", fontSize: { xs: "1.08rem", sm: "1.2rem" }, fontWeight: 650, letterSpacing: "-0.02em", color: palette.grey[25],
            "& a": { color: "inherit", textDecorationColor: withAlpha(palette.sky[100], 0.5), textUnderlineOffset: "4px" },
            "& a:hover": { color: palette.sky[100] } }}>
            {entry.href ? <Link href={entry.href} prefetch={false}>{entry.org}</Link> : entry.org}
          </Box>
          <Box component="p" sx={{ m: "4px 0 0", color: palette.slate[125], lineHeight: 1.55 }}>{entry.role}</Box>
        </Box>
      ))}
    </Box>
  );
}
