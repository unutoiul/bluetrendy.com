"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { palette, withAlpha } from "@/theme/palette";

type Item = { id: string; title: string };

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * The contents of a policy page. On wide screens it is a sticky numbered list beside the
 * text, with a line that fills as you read; on phones it is a row of chips under the header.
 * The section you are reading is highlighted in both.
 */
export default function PolicyContents({ items, label }: { items: Item[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const chips = useRef<HTMLDivElement>(null);

  // The section being read is the last one whose heading has passed the top third of the
  // screen; above the first section, that is the first. Checked at most once a frame.
  useEffect(() => {
    const sections = items.map(item => document.getElementById(item.id)).filter((el): el is HTMLElement => Boolean(el));
    let frame = 0;
    function update() {
      frame = 0;
      const line = window.innerHeight * 0.33;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section;
        else break;
      }
      if (current) setActive(current.id);
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  // On phones, keep the active chip in view without moving the page.
  useEffect(() => {
    const row = chips.current;
    const chip = row?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: chip.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  const index = Math.max(0, items.findIndex(item => item.id === active));

  return (
    <>
      <Box component="nav" aria-label={label} sx={{ display: { xs: "none", md: "block" }, position: "sticky", top: 108 }}>
        <Box component="p" sx={{ m: "0 0 14px", color: palette.slate[475], fontSize: ".74rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>
          On this page
        </Box>
        <Box component="ol" sx={{ position: "relative", listStyle: "none", m: 0, p: 0, pl: "18px",
          // The rail, and the part of it you have already read.
          "&::before, &::after": { content: '""', position: "absolute", left: 0, top: 6, width: 2, borderRadius: 2 },
          "&::before": { bottom: 6, background: withAlpha(palette.blue[325], 0.18) },
          "&::after": { height: `calc((100% - 12px) * ${(index + 1) / items.length})`,
            background: `linear-gradient(180deg, ${palette.sky[150]}, ${palette.blue[450]})`, boxShadow: `0 0 10px ${withAlpha(palette.blue[350], 0.5)}`,
            transition: `height .5s ${ease}` },
        }}>
          {items.map((item, i) => {
            const current = item.id === active;
            return (
              <li key={item.id}>
                <Box component="a" href={"#" + item.id} aria-current={current ? "location" : undefined}
                  sx={{ display: "grid", gridTemplateColumns: "26px minmax(0, 1fr)", alignItems: "baseline", py: "7px",
                    color: current ? palette.navy[725] : palette.slate[525], fontSize: ".92rem", fontWeight: current ? 650 : 520,
                    lineHeight: 1.35, textDecoration: "none", transition: "color .25s ease",
                    "&:hover": { color: palette.blue[550] },
                    "&:focus-visible": { outline: `2px solid ${palette.blue[450]}`, outlineOffset: 3, borderRadius: "4px" } }}>
                  <Box component="span" sx={{ fontFamily: "var(--font-mono), monospace", fontSize: ".72rem",
                    color: current ? palette.blue[450] : palette.slate[375] }}>{String(i + 1).padStart(2, "0")}</Box>
                  {item.title}
                </Box>
              </li>
            );
          })}
        </Box>
      </Box>

      <Box ref={chips} component="nav" aria-label={label}
        sx={{ display: { xs: "flex", md: "none" }, gap: 1, overflowX: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" },
          position: "sticky", top: 64, zIndex: 2, mx: "calc((100vw - 100%) / -2)", px: "calc((100vw - 100%) / 2)", py: 1.25,
          background: withAlpha(palette.grey[25], 0.92), backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${withAlpha(palette.blue[325], 0.16)}` }}>
        {items.map((item, i) => {
          const current = item.id === active;
          return (
            <Box key={item.id} component="a" href={"#" + item.id} data-id={item.id} aria-current={current ? "location" : undefined}
              sx={{ flex: "none", display: "inline-flex", alignItems: "center", gap: "6px", minHeight: 36, px: 1.5, borderRadius: 999,
                fontSize: ".85rem", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap",
                color: current ? palette.white : palette.navy[725],
                background: current ? `linear-gradient(135deg, ${palette.blue[450]}, ${palette.blue[550]})` : palette.white,
                border: `1px solid ${current ? "transparent" : withAlpha(palette.blue[325], 0.28)}`,
                transition: "background-color .25s ease, color .25s ease" }}>
              <Box component="span" sx={{ fontFamily: "var(--font-mono), monospace", fontSize: ".7rem", opacity: 0.7 }}>{String(i + 1).padStart(2, "0")}</Box>
              {item.title}
            </Box>
          );
        })}
      </Box>
    </>
  );
}
