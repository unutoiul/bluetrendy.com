"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import { keyframes } from "@mui/material/styles";

type Entry = { period: string; org: string; role: string; href?: string };

// A pulse of light runs down the line, like a signal along a nerve.
const signal = keyframes`
  0% { top: 0; opacity: 0; }
  8% { opacity: 1; }
  92% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
`;

/** The career as a glowing signal line: each engagement is a node that lights up as it arrives. */
export default function SignalTimeline({ entries }: { entries: Entry[] }) {
  return (
    <Box component="ol" data-panel-group sx={{ position: "relative", listStyle: "none", m: 0, p: 0, pl: { xs: 4, sm: 5 },
      "&::before": { content: '""', position: "absolute", left: { xs: 9, sm: 13 }, top: 8, bottom: 8, width: 2, borderRadius: 2,
        background: "linear-gradient(180deg, #8eeaff, #2f7dff 40%, #1d4ea0 80%, transparent)", boxShadow: "0 0 12px rgba(47, 168, 255, 0.7)" },
      "&::after": { content: '""', position: "absolute", left: { xs: 6, sm: 10 }, width: 8, height: 26, borderRadius: 8,
        background: "linear-gradient(180deg, transparent, #e4fbff, transparent)", boxShadow: "0 0 14px 4px rgba(79, 210, 255, 0.8)",
        animation: `${signal} 6s cubic-bezier(0.45, 0, 0.55, 1) infinite`,
        "@media (prefers-reduced-motion: reduce)": { display: "none" } } }}>
      {entries.map(entry => (
        <Box component="li" key={entry.org + entry.period} data-panel="reveal"
          sx={{ position: "relative", py: { xs: 1.75, sm: 2.25 }, borderBottom: "1px solid rgba(86, 156, 222, 0.18)",
            "&:last-of-type": { borderBottom: 0 },
            "&:hover .node, &:focus-within .node": { transform: "scale(1.35)", boxShadow: "0 0 0 4px rgba(111, 220, 255, 0.18), 0 0 22px #3fb8ff" } }}>
          <Box className="node" aria-hidden="true" sx={{ position: "absolute", left: { xs: -29, sm: -36 }, top: { xs: 22, sm: 26 }, width: 12, height: 12,
            borderRadius: "50%", background: "radial-gradient(circle, #e6fbff 0 30%, #3fa8ff 70%)",
            boxShadow: "0 0 0 3px rgba(63, 168, 255, 0.18), 0 0 14px #2f9dff", transition: "transform .35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow .35s ease" }} />
          <Box component="p" sx={{ m: 0, color: "#8fb8d8", fontSize: ".86rem", fontWeight: 550, fontVariantNumeric: "tabular-nums" }}>{entry.period}</Box>
          <Box component="h3" sx={{ m: "4px 0 0", fontSize: { xs: "1.08rem", sm: "1.2rem" }, fontWeight: 650, letterSpacing: "-0.02em", color: "#f1f8ff",
            "& a": { color: "inherit", textDecorationColor: "rgba(142, 234, 255, 0.5)", textUnderlineOffset: "4px" },
            "& a:hover": { color: "#9fe8ff" } }}>
            {entry.href ? <Link href={entry.href} prefetch={false}>{entry.org}</Link> : entry.org}
          </Box>
          <Box component="p" sx={{ m: "4px 0 0", color: "#b9cde2", lineHeight: 1.55 }}>{entry.role}</Box>
        </Box>
      ))}
    </Box>
  );
}
