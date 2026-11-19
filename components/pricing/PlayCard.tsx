"use client";

import type { ChangeEvent } from "react";
import Box from "@mui/material/Box";
import { motion, useReducedMotion } from "motion/react";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import ApartmentRounded from "@mui/icons-material/ApartmentRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import { usePanelTilt } from "@/components/experience/PanelMotion";
import { neural } from "@/components/experience/neuralStyle";
import { formatPounds, type DiscoveryPackage } from "@/data/pricing";
import { palette, withAlpha } from "@/theme/palette";

const suits = { small: PersonOutlineRounded, growing: GroupsOutlined, established: ApartmentRounded };
const ease = neural.ease;

// A hand of three: the outer cards lean away from the middle one, pivoting on their bottom edge.
const fan = ["-3deg", "0deg", "3deg"];
const drop = ["14px", "0px", "14px"];

const hidden = { position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" } as const;

type PlayCardProps = {
  item: DiscoveryPackage;
  index: number;
  selected: boolean;
  /** False while the card lies face down, waiting to be dealt. */
  faceUp: boolean;
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** The rank and suit in a card's corner; the bottom one is the same, turned upside down. */
function Corner({ item, flipped = false }: { item: DiscoveryPackage; flipped?: boolean }) {
  const Suit = suits[item.id];
  return (
    <Box className="play-corner" aria-hidden="true" sx={{ position: "absolute", zIndex: 1, display: "grid", justifyItems: "center", gap: "2px",
      ...(flipped ? { right: 16, bottom: 14, rotate: "180deg" } : { left: 16, top: 14 }),
      color: palette.sky[100], fontFamily: "var(--font-mono), monospace", fontWeight: 700, fontSize: "1.35rem", lineHeight: 1,
      "& svg": { fontSize: 18, filter: `drop-shadow(0 0 5px ${withAlpha(palette.blue[250], 0.8)})` } }}>
      {item.rank}
      <Suit />
    </Box>
  );
}

/**
 * One discovery package as a playing card. It is a radio button underneath, so the three
 * cards work as one group with the keyboard. On wide screens the cards fan out like a hand;
 * the one under the pointer or chosen straightens, lifts and leans toward the mouse.
 */
export default function PlayCard({ item, index, selected, faceUp, onSelect }: PlayCardProps) {
  const reduced = useReducedMotion();
  const tilt = usePanelTilt(7);
  const Suit = suits[item.id];
  const label = `sprint-${item.id}`;

  return (
    <Box component="label" htmlFor={label} sx={{
      position: "relative", display: "block", cursor: "pointer", WebkitTapHighlightColor: "transparent",
      transformOrigin: "50% 100%",
      transition: `rotate 0.6s ${ease}, translate 0.6s ${ease}`,
      rotate: { md: selected ? "0deg" : fan[index] }, translate: { md: selected ? "0 -10px" : `0 ${drop[index]}` },
      zIndex: selected ? 2 : 1,
      "@media (hover: hover)": { "&:hover": { rotate: "0deg", translate: { xs: "0 -4px", md: "0 -14px" }, zIndex: 3 } },
      "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      // The radio is hidden, so the card shows its keyboard focus.
      "&:has(input:focus-visible) .play-face": { outline: `2px solid ${palette.sky[100]}`, outlineOffset: 4 },
    }}>
      {/* Named by the card's title, size and price rather than everything printed on it. */}
      <Box component="input" type="radio" name="discovery-package" id={label} value={item.id}
        aria-labelledby={`${label}-name ${label}-size ${label}-price`} aria-describedby={`${label}-includes`}
        checked={selected} onChange={onSelect} sx={hidden} />
      <motion.div {...tilt} style={{ ...tilt.style, transformStyle: "preserve-3d" }}>
        <motion.div
          initial={false}
          animate={{ rotateY: faceUp || reduced ? 0 : 180, y: faceUp || reduced ? 0 : 24 }}
          // Cards are turned face down out of sight, so that is instant; turning face up is the deal.
          transition={faceUp ? { duration: 0.9, delay: index * 0.14, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
          style={{ display: "grid", transformStyle: "preserve-3d", transformPerspective: 1100 }}>

          {/* Face */}
          <Box className="play-face" sx={{
            ...neural.glassCard, backdropFilter: "none",
            gridArea: "1 / 1", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
            // The bottom padding leaves room for the upside-down corner under the button.
            px: { xs: 3, md: 3.5 }, pt: 5, pb: 7.5, borderRadius: "22px",
            ...(selected && {
              borderColor: palette.sky[150],
              boxShadow: `inset 0 1px 0 ${withAlpha(palette.slate[75], 0.45)}, inset 0 0 34px ${withAlpha(palette.blue[350], 0.26)}, 0 0 0 1px ${withAlpha(palette.sky[150], 0.35)}, 0 0 34px ${withAlpha(palette.blue[350], 0.45)}, 0 30px 60px -30px ${withAlpha(palette.navy[600], 0.95)}`,
              "&::before": { ...neural.glassCard["&::before"], left: 0, right: 0, opacity: 1 },
            }),
            "label:hover &": neural.glassCard["&:hover, &:focus-visible, &:focus-within"],
            "label:hover &::before": { left: 0, right: 0, opacity: 1 },
            "label:hover &::after": { animation: `neural-sweep 1.1s ${ease}` },
            // Light that follows the pointer across the face, like a sheen on a printed card.
            "& .play-sheen": { position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0, transition: "opacity 0.35s ease",
              background: `radial-gradient(420px circle at var(--light-x, 50%) var(--light-y, 0%), ${withAlpha(palette.sky[175], 0.16)}, transparent 55%)` },
            "label:hover & .play-sheen": { opacity: 1 },
            "& > :not(.play-sheen, .play-corner)": { position: "relative", zIndex: 1 },
          }}>
            <span className="play-sheen" aria-hidden="true" />
            <Corner item={item} />
            <Corner item={item} flipped />

            <Box className="play-orb" sx={{ ...neural.iconOrb, width: 64, height: 64, borderRadius: "50%",
              "& svg": { fontSize: 32, filter: `drop-shadow(0 0 7px ${withAlpha(palette.blue[250], 0.95)})` },
              ...(selected && { color: palette.slate[50], boxShadow: `0 0 0 1px ${withAlpha(palette.sky[100], 0.5)}, 0 0 30px ${withAlpha(palette.blue[300], 0.7)}, inset 0 0 14px ${withAlpha(palette.sky[175], 0.4)}` }) }}>
              <Suit aria-hidden="true" />
            </Box>
            <Box component="h4" id={`${label}-name`} sx={{ m: "18px 0 0", fontSize: "1.35rem", fontWeight: 650, letterSpacing: "-0.03em", color: palette.grey[25] }}>
              {item.name}
            </Box>
            <Box component="span" id={`${label}-size`} sx={{ mt: 1, px: 1.5, py: 0.5, borderRadius: 99, fontSize: "0.82rem", fontWeight: 600, color: palette.slate[75],
              border: `1px solid ${withAlpha(palette.sky[150], 0.35)}`, background: withAlpha(palette.blue[350], 0.12) }}>
              {item.employees}
            </Box>

            <Box id={`${label}-price`} sx={{ mt: 3, display: "flex", alignItems: "baseline", gap: 1 }}>
              <Box component="span" sx={{ ...neural.accentText, fontSize: { xs: "2.6rem", md: "3rem" }, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
                {formatPounds(item.price)}
              </Box>
              <Box component="span" sx={{ color: palette.slate[200], fontSize: "0.9rem" }}>fixed</Box>
            </Box>
            <Box component="p" sx={{ m: "6px 0 0", color: palette.slate[200], fontSize: "0.88rem" }}>{item.duration}</Box>
            <Box component="p" sx={{ m: "14px 0 0", maxWidth: "30ch", color: palette.slate[125], fontSize: "0.95rem", lineHeight: 1.5 }}>{item.summary}</Box>

            <Box aria-hidden="true" sx={{ alignSelf: "stretch", height: "1px", my: 2.5,
              background: `linear-gradient(90deg, transparent, ${withAlpha(palette.sky[150], 0.45)}, transparent)` }} />

            <Box component="ul" id={`${label}-includes`} sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.25, textAlign: "left", alignSelf: "stretch" }}>
              {item.includes.map(line => (
                <Box component="li" key={line} sx={{ display: "flex", gap: 1.25, alignItems: "flex-start", color: palette.slate[150], fontSize: "0.92rem", lineHeight: 1.45 }}>
                  <CheckRounded aria-hidden="true" sx={{ fontSize: 18, mt: "2px", color: palette.sky[150], flex: "none" }} />
                  {line}
                </Box>
              ))}
            </Box>

            <Box component="span" aria-hidden="true" sx={{ mt: "auto", pt: 3, display: "flex", width: "100%" }}>
              <Box component="span" sx={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 1,
                minHeight: 44, borderRadius: 99, fontWeight: 650, fontSize: "0.95rem", transition: `background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease`,
                ...(selected
                  ? { background: palette.blue[425], color: palette.grey[25], border: `1px solid ${palette.blue[425]}`, boxShadow: `0 10px 26px -14px ${withAlpha(palette.blue[425], 0.9)}` }
                  : { color: palette.slate[75], border: `1px solid ${withAlpha(palette.sky[150], 0.45)}`, "label:hover &": { background: withAlpha(palette.blue[350], 0.16) } }),
                "& svg": { fontSize: 18 } }}>
                {selected ? <><CheckRounded /> Selected</> : "Choose this sprint"}
              </Box>
            </Box>
          </Box>

          {/* Back, seen while the card waits to be dealt */}
          <Box aria-hidden="true" sx={{
            gridArea: "1 / 1", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)",
            borderRadius: "22px", border: `1px solid ${withAlpha(palette.blue[325], 0.5)}`, display: "grid", placeItems: "center",
            background: `repeating-linear-gradient(45deg, ${withAlpha(palette.sky[150], 0.07)} 0 2px, transparent 2px 14px), repeating-linear-gradient(-45deg, ${withAlpha(palette.sky[150], 0.07)} 0 2px, transparent 2px 14px), radial-gradient(circle at 50% 45%, ${palette.navy[600]}, ${palette.navy[775]} 70%)`,
            boxShadow: `inset 0 0 0 10px ${withAlpha(palette.navy[850], 0.65)}, inset 0 0 0 11px ${withAlpha(palette.sky[150], 0.3)}`,
          }}>
            <Box component="img" src="/brand/ribbon-mark.svg" alt="" sx={{ width: "38%", filter: `drop-shadow(0 0 18px ${withAlpha(palette.blue[300], 0.6)})` }} />
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
}
