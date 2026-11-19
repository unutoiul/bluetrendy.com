"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import { useInView, useReducedMotion } from "motion/react";
import CheckRounded from "@mui/icons-material/CheckRounded";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import DiscoveryCheckoutForm from "@/components/DiscoveryCheckoutForm";
import { neural } from "@/components/experience/neuralStyle";
import PlayCard from "./PlayCard";
import {
  defaultDiscoveryPackage, discoveryEssentials, discoveryPackages, findDiscoveryPackage, formatPounds,
  type DiscoveryPackageId,
} from "@/data/pricing";
import { palette, withAlpha } from "@/theme/palette";

const hidden = { position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" } as const;

const steps = ["Choose your company size", "Add your details", "Pay, then pick a kickoff time"];

/** A numbered step heading, so the page reads as one short journey. */
function Step({ number, children, id }: { number: number; children: ReactNode; id?: string }) {
  return (
    <Box component="h3" id={id} sx={{ display: "flex", alignItems: "center", gap: 1.5, m: 0, fontSize: { xs: "1.1rem", md: "1.2rem" },
      fontWeight: 650, letterSpacing: "-0.02em", color: palette.grey[25] }}>
      <Box component="span" aria-hidden="true" sx={{ display: "grid", placeItems: "center", flex: "none", width: 32, height: 32, borderRadius: "50%",
        fontFamily: "var(--font-mono), monospace", fontSize: "0.85rem", color: palette.slate[75],
        background: `radial-gradient(circle, ${palette.navy[600]}, ${palette.navy[775]} 75%)`, border: `1px solid ${palette.sky[150]}`,
        boxShadow: `0 0 14px ${withAlpha(palette.blue[350], 0.45)}` }}>{number}</Box>
      <Box component="span" sx={hidden}>{`Step ${number}: `}</Box>
      {children}
    </Box>
  );
}

/**
 * The discovery sprint offer: three packages priced by company size, dealt as playing
 * cards, then a short checkout for the chosen one.
 */
export default function DiscoverySprint() {
  const [chosen, setChosen] = useState<DiscoveryPackageId>(defaultDiscoveryPackage);
  const sprint = findDiscoveryPackage(chosen) ?? discoveryPackages[1];

  // The cards wait face down below the fold and are dealt as the deck scrolls into view.
  // Cards already on screen when the page opens stay face up, so nothing flashes.
  const deck = useRef<HTMLDivElement>(null);
  const inView = useInView(deck, { once: true, amount: 0.25 });
  const reduced = useReducedMotion();
  const [waiting, setWaiting] = useState(false);
  useEffect(() => {
    const box = deck.current?.getBoundingClientRect();
    if (!reduced && box && box.top > window.innerHeight) setWaiting(true);
  }, [reduced]);
  const faceUp = !waiting || inView;

  return (
    <Box component="section" id="discovery-sprint" aria-labelledby="discovery-heading" sx={{
      position: "relative", overflow: "clip", isolation: "isolate", color: palette.grey[25], scrollMarginTop: 76,
      background: neural.blueFlow("header", "agents"),
    }}>
      <LivingBackground effect="streaks" quiet="top" seed={23} />
      <Box sx={{ position: "relative", zIndex: 1, width: "min(100% - 48px, 1152px)", mx: "auto", py: { xs: 7, md: 11 } }}>

        <Box sx={{ display: "grid", gap: { xs: 3, md: 6 }, gridTemplateColumns: { md: "minmax(0, 1.25fr) minmax(0, 1fr)" }, alignItems: "end" }}>
          <div>
            <Box component="p" sx={neural.label}>Discovery sprint</Box>
            <Box component="h2" id="discovery-heading" sx={{ m: 0, fontSize: "clamp(2.1rem, 4.4vw, 3.9rem)", fontWeight: 630,
              letterSpacing: "-0.047em", lineHeight: 1.06 }}>
              A plan priced for <Box component="span" sx={neural.accentText}>your size</Box>
            </Box>
            <Box component="p" sx={{ m: "18px 0 0", maxWidth: "52ch", color: palette.slate[125], fontSize: "clamp(1rem, 1.25vw, 1.12rem)", lineHeight: 1.6 }}>
              Smaller companies have fewer systems and people to plan around, so their sprint costs less.
              Every sprint ends with a written plan, a build estimate and a fixed price.
            </Box>
          </div>
          {/* The whole journey at a glance; on phones step 1 follows straight after, so it is left out. */}
          <Box component="ol" aria-label="How booking works" sx={{ listStyle: "none", m: 0, p: 0, display: { xs: "none", md: "grid" }, gap: 1.25,
            justifySelf: { md: "end" } }}>
            {steps.map((step, index) => (
              <Box component="li" key={step} sx={{ display: "flex", alignItems: "center", gap: 1.5, color: palette.slate[125], fontSize: "0.95rem" }}>
                <Box component="span" aria-hidden="true" sx={{ display: "grid", placeItems: "center", width: 26, height: 26, borderRadius: "50%",
                  fontFamily: "var(--font-mono), monospace", fontSize: "0.75rem", color: palette.sky[100], border: `1px solid ${withAlpha(palette.sky[150], 0.45)}` }}>
                  {index + 1}
                </Box>
                {step}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 6, md: 8 } }}>
          <Step number={1} id="sprint-size-heading">Choose your company size</Step>
          <Box component="fieldset" aria-labelledby="sprint-size-heading" sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
            <Box ref={deck} sx={{ mt: { xs: 3, md: 5 }, display: "grid", gap: { xs: 2.5, md: 3.5 },
              gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" }, alignItems: "stretch",
              "& > label > div, & > label > div > div": { height: "100%" } }}>
              {discoveryPackages.map((item, index) => (
                <PlayCard key={item.id} item={item} index={index} faceUp={faceUp}
                  selected={item.id === chosen} onSelect={() => setChosen(item.id)} />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Step 2: details and payment for the chosen card */}
        <Box sx={{ ...neural.glassCard, backdropFilter: "blur(8px)", mt: { xs: 6, md: 9 }, p: { xs: 3, md: 5 }, borderRadius: "22px",
          display: "grid", gap: { xs: 4, md: 6 }, gridTemplateColumns: { md: "minmax(0, 1fr) minmax(0, 1.15fr)" },
          "&::after": { display: "none" }, "& > *": { position: "relative", zIndex: 1 } }}>
          <div>
            <Step number={2}>Add your details</Step>
            <Box aria-live="polite" sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2, p: 2, borderRadius: "16px",
              border: `1px solid ${withAlpha(palette.sky[150], 0.3)}`, background: withAlpha(palette.navy[850], 0.45) }}>
              <Box aria-hidden="true" sx={{ display: "grid", placeItems: "center", flex: "none", width: 48, height: 64, borderRadius: "8px",
                fontFamily: "var(--font-mono), monospace", fontWeight: 700, fontSize: "1.3rem", color: palette.sky[100],
                border: `1px solid ${withAlpha(palette.sky[150], 0.5)}`, background: `linear-gradient(160deg, ${withAlpha(palette.navy[675], 0.9)}, ${withAlpha(palette.navy[800], 0.95)})`,
                boxShadow: `0 0 16px ${withAlpha(palette.blue[350], 0.3)}` }}>{sprint.rank}</Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Box sx={{ fontWeight: 650, color: palette.grey[25] }}>{sprint.name}</Box>
                <Box sx={{ color: palette.slate[200], fontSize: "0.9rem" }}>{sprint.employees} · {sprint.duration}</Box>
              </Box>
              <Box sx={{ ...neural.accentText, fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.04em" }}>{formatPounds(sprint.price)}</Box>
            </Box>
            <Box component="p" sx={{ m: "28px 0 12px", color: palette.sky[150], fontSize: "0.76rem", fontWeight: 650, letterSpacing: "0.16em",
              textTransform: "uppercase" }}>Every sprint includes</Box>
            <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.25 }}>
              {discoveryEssentials.map(line => (
                <Box component="li" key={line} sx={{ display: "flex", gap: 1.25, alignItems: "flex-start", color: palette.slate[150], fontSize: "0.95rem", lineHeight: 1.5 }}>
                  <CheckRounded aria-hidden="true" sx={{ fontSize: 18, mt: "3px", color: palette.sky[150], flex: "none" }} />
                  {line}
                </Box>
              ))}
            </Box>
          </div>
          <Box sx={{ alignSelf: "center" }}>
            <DiscoveryCheckoutForm sprint={sprint} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
