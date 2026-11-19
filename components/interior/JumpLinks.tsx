"use client";

import { useId, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Collapse from "@mui/material/Collapse";
import useMediaQuery from "@mui/material/useMediaQuery";
import { keyframes, type SxProps, type Theme } from "@mui/material/styles";
import ArrowDownwardRounded from "@mui/icons-material/ArrowDownwardRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import { easeOut } from "@/theme/theme";
import { palette, withAlpha } from "@/theme/palette";

type JumpLink = { href: string; text: string };

/**
 * A hero shortcut menu drawn as a line with stops: the toggle's node feeds a rail,
 * and each link is a stop on it. Opening sends one pulse of current down the line.
 */
export default function JumpLinks({ label, links }: { label: string; links: JumpLink[] }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <Box data-open={open} sx={sx.root}>
      <ButtonBase aria-expanded={open} aria-controls={listId} onClick={() => setOpen(value => !value)} sx={sx.toggle}>
        <Box component="span" aria-hidden sx={sx.node} />
        {label}
        <ExpandMoreRounded aria-hidden sx={sx.chevron} />
      </ButtonBase>
      <Collapse in={open} timeout={reducedMotion ? 0 : 380}>
        <Box component="nav" id={listId} aria-label={label} sx={sx.rail}>
          {links.map(link => {
            const Arrow = link.href.startsWith("#") ? ArrowDownwardRounded : ArrowForwardRounded;
            return (
              <Box key={link.href} component={Link} href={link.href} sx={sx.stop}>
                <Box component="span" aria-hidden sx={sx.dot} />
                <Box component="span" sx={{ flex: 1 }}>{link.text}</Box>
                <Arrow aria-hidden sx={sx.arrow} />
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
}

// The node, rail and stops share one centre line, 22px in from the left.
const line = 22;
const stopHeight = 44;
const cyan = palette.sky[150];
// Travels from the toggle to the last stop (pulse is 34px tall, so its centre sits 17px below its top).
const current = keyframes({
  "0%": { top: "-24px", opacity: 0 },
  "15%, 80%": { opacity: 1 },
  "100%": { top: `calc(100% - ${stopHeight / 2 + 17}px)`, opacity: 0 },
});

const sx = {
  // On wider screens the menu is as wide as its toggle, so the arrows line up under the chevron.
  root: {
    display: { xs: "grid", sm: "inline-grid" },
    maxWidth: "100%",
  },
  toggle: {
    minHeight: 44,
    gap: 1.5,
    pl: "7px",
    pr: 1.5,
    justifyContent: "flex-start",
    border: `1px solid ${palette.navy[650]}`,
    borderRadius: 999,
    bgcolor: withAlpha(palette.navy[775], 0.72),
    backdropFilter: "blur(8px)",
    color: palette.slate[50],
    fontSize: ".95rem",
    fontWeight: 600,
    transition: `border-color .25s ease, background-color .25s ease, box-shadow .4s ${easeOut}`,
    "&:hover": { borderColor: palette.blue[325], bgcolor: withAlpha(palette.navy[725], 0.85) },
    "[data-open=true] > &": {
      borderColor: palette.sky[150],
      boxShadow: `0 0 0 3px ${withAlpha(palette.sky[150], 0.12)}, 0 10px 30px -14px ${withAlpha(palette.blue[300], 0.8)}`,
    },
  },
  // A ring with a lit core; it brightens while the menu is open.
  node: {
    flex: "none",
    display: "grid",
    placeItems: "center",
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: `1px solid ${palette.blue[400]}`,
    background: `radial-gradient(circle, ${withAlpha(palette.sky[150], 0.22)}, transparent 70%)`,
    transition: "border-color .25s ease",
    "&::after": {
      content: '""',
      width: 8,
      height: 8,
      borderRadius: "50%",
      bgcolor: palette.sky[150],
      boxShadow: `0 0 8px ${cyan}`,
      transition: `transform .35s ${easeOut}, background-color .25s ease`,
    },
    "[data-open=true] &": { borderColor: palette.sky[150] },
    "[data-open=true] &::after": { bgcolor: palette.cyan[75], transform: "scale(1.25)" },
  },
  chevron: {
    ml: "auto",
    fontSize: 20,
    color: palette.sky[175],
    transition: `transform .35s ${easeOut}`,
    "[data-open=true] &": { transform: "rotate(180deg)" },
  },
  rail: {
    position: "relative",
    display: "grid",
    pt: 0.5,
    // The line itself, from the toggle down to the centre of the last stop.
    "&::before": {
      content: '""',
      position: "absolute",
      left: line - 1,
      top: 0,
      bottom: stopHeight / 2,
      width: 2,
      borderRadius: 1,
      background: `linear-gradient(${cyan}, ${palette.blue[550]})`,
    },
    // One pulse of current runs down the line each time the menu opens.
    "&::after": {
      content: '""',
      position: "absolute",
      left: line - 2,
      top: -24,
      width: 4,
      height: 34,
      borderRadius: 2,
      background: `linear-gradient(transparent, ${palette.cyan[25]}, transparent)`,
      boxShadow: `0 0 12px ${cyan}`,
      opacity: 0,
    },
    "[data-open=true] &::after": { animation: `${current} 1.1s ease-in .12s` },
    "@media (prefers-reduced-motion: reduce)": { "&::after": { display: "none" } },
  },
  stop: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    minHeight: stopHeight,
    pr: 1.5,
    borderRadius: "10px",
    color: palette.slate[100],
    fontSize: ".95rem",
    fontWeight: 550,
    lineHeight: 1.3,
    textDecoration: "none",
    transition: "background-color .2s ease, color .2s ease",
    "&:hover, &:focus-visible": {
      bgcolor: withAlpha(palette.sky[150], 0.07),
      color: palette.slate[75],
    },
  },
  // A hollow station on the line that lights up when its link is hovered or focused.
  dot: {
    flex: "none",
    position: "relative",
    zIndex: 1,
    width: 10,
    height: 10,
    ml: `${line - 5}px`,
    mr: "9px",
    borderRadius: "50%",
    border: `2px solid ${palette.blue[400]}`,
    bgcolor: palette.navy[775],
    transition: `background-color .2s ease, border-color .2s ease, box-shadow .3s ${easeOut}, transform .3s ${easeOut}`,
    "a:hover > &, a:focus-visible > &": {
      borderColor: palette.slate[75],
      bgcolor: cyan,
      transform: "scale(1.2)",
      boxShadow: `0 0 0 4px ${withAlpha(palette.sky[150], 0.16)}, 0 0 12px ${palette.sky[150]}`,
    },
  },
  arrow: {
    flex: "none",
    fontSize: 18,
    color: palette.sky[150],
    opacity: 0.6,
    transition: `transform .3s ${easeOut}, opacity .2s ease`,
    "a:hover > &, a:focus-visible > &": { opacity: 1, transform: "translateX(3px)" },
    "a[href^='#']:hover > &, a[href^='#']:focus-visible > &": { transform: "translateY(2px)" },
  },
} satisfies Record<string, SxProps<Theme>>;
