"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import { keyframes } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";
import DiamondOutlined from "@mui/icons-material/DiamondOutlined";
import ArchitectureOutlined from "@mui/icons-material/ArchitectureOutlined";
import SmartphoneOutlined from "@mui/icons-material/SmartphoneOutlined";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import LinkButton from "@/components/LinkButton";
import { neural } from "@/components/experience/neuralStyle";
import { trackEvent } from "@/lib/analytics";
import { palette, withAlpha } from "@/theme/palette";
import SampleBadge from "./SampleBadge";
import { lab } from "./labStyle";

const still = "/brand/blue-ribbon-studio.webp";

type Treatment = {
  id: "luxury" | "explainer" | "social";
  tab: string;
  Icon: SvgIconComponent;
  idea: string;
  format: string;
  length: string;
  channels: string;
  shots: [beat: string, text: string][];
  test: string;
};

// One product, three ways to tell it. The product is our own logo sculpture, so nothing here borrows a client's brand.
const treatments: Treatment[] = [
  {
    id: "luxury", tab: "Luxury commercial", Icon: DiamondOutlined,
    idea: "Slow, cinematic and quiet. The product is treated as an object of desire, with almost no words.",
    format: "Widescreen 2.39:1", length: "30 seconds", channels: "Website hero, YouTube, launch events",
    shots: [["0–8s", "A slow push-in from darkness as light finds the glass"], ["8–22s", "Macro details: the lit edge, the brushed steel"], ["22–30s", "The full form turns once; one line of type"]],
    test: "Two endings: the product alone, or the product with a price.",
  },
  {
    id: "explainer", tab: "Technical explainer", Icon: ArchitectureOutlined,
    idea: "Clear and precise. Labels and motion graphics show what the product is made of and how it works.",
    format: "Widescreen 16:9", length: "45 seconds", channels: "Product pages, sales decks, onboarding",
    shots: [["0–10s", "The whole product, then the problem it solves"], ["10–35s", "Three callouts, each drawn onto the footage"], ["35–45s", "A recap of the three points and a next step"]],
    test: "Voiceover against captions only, for viewers with the sound off.",
  },
  {
    id: "social", tab: "Short social ad", Icon: SmartphoneOutlined,
    idea: "Fast, vertical and loud. A hook in the first second, bold captions and a single clear action.",
    format: "Vertical 9:16", length: "9 seconds", channels: "Instagram, TikTok, YouTube Shorts",
    shots: [["0–1s", "A hook: one bold word over a hard zoom"], ["1–6s", "Three quick cuts on the beat, a caption on each"], ["6–9s", "The offer and one button"]],
    test: "Three different hooks on the same nine seconds.",
  },
];

const pushIn = keyframes`from { scale: 1.02; } to { scale: 1.16; }`;
const sweep = keyframes`from { translate: -140% 0; } to { translate: 240% 0; }`;
const typeIn = keyframes`from { opacity: 0; letter-spacing: 0.9em; } to { opacity: 1; letter-spacing: 0.42em; }`;
const draw = keyframes`from { opacity: 0; scale: 0.6; } to { opacity: 1; scale: 1; }`;
const punch = keyframes`
  0%, 30% { scale: 1.05; translate: 0 0; }
  34%, 63% { scale: 1.5; translate: -6% 4%; }
  67%, 100% { scale: 1.28; translate: 5% -5%; }
`;
const fill = keyframes`from { scale: 0 1; } to { scale: 1 1; }`;
const pop = keyframes`from { opacity: 0; scale: 0.7; rotate: -8deg; } to { opacity: 1; scale: 1; rotate: -4deg; }`;

const cover = { objectFit: "cover" } as const;
const stage = { position: "absolute", inset: 0, overflow: "hidden" } as const;
const noMotion = { "@media (prefers-reduced-motion: reduce)": { "&, & *, & *::before, & *::after": { animation: "none !important" } } } as const;

function Luxury() {
  return (
    <Box sx={stage}>
      <Box sx={{ ...stage, animation: `${pushIn} 16s ease-in-out infinite alternate` }}>
        <Image src={still} alt="" fill sizes="(max-width: 900px) 100vw, 700px" style={cover} />
      </Box>
      <Box sx={{ ...stage, background: `radial-gradient(ellipse at 50% 45%, transparent 35%, ${withAlpha(palette.black, 0.72)} 100%)` }} />
      {/* A slow glint of light crossing the frame. */}
      <Box sx={{ position: "absolute", top: 0, bottom: 0, width: "35%", background: `linear-gradient(100deg, transparent, ${withAlpha(palette.white, 0.1)}, transparent)`,
        animation: `${sweep} 7s ease-in-out infinite` }} />
      {/* Letterbox bars make the frame 2.39:1. */}
      <Box sx={{ position: "absolute", insetInline: 0, top: 0, height: "12.5%", background: palette.black }} />
      <Box sx={{ position: "absolute", insetInline: 0, bottom: 0, height: "12.5%", background: palette.black }} />
      <Box sx={{ position: "absolute", insetInline: 0, bottom: "4.4%", textAlign: "center", color: palette.grey[25], textTransform: "uppercase",
        fontSize: "1.05em", fontWeight: 300, letterSpacing: "0.42em", textIndent: "0.42em", animation: `${typeIn} 2.4s ${lab.ease} 0.5s both` }}>
        Made of light
      </Box>
    </Box>
  );
}

const callouts = [
  { x: 61, y: 27, side: "right", text: "Glass ribbon, lit from inside" },
  { x: 67, y: 60, side: "right", text: "Brushed steel blade" },
  { x: 33, y: 76, side: "left", text: "Turntable plinth" },
] as const;

function Explainer() {
  return (
    <Box sx={stage}>
      <Box sx={{ ...stage, filter: "saturate(0.75) brightness(0.8)" }}>
        <Image src={still} alt="" fill sizes="(max-width: 900px) 100vw, 700px" style={cover} />
      </Box>
      {/* A drawing grid, as on a blueprint. */}
      <Box sx={{ ...stage, backgroundSize: "8% 14.2%", opacity: 0.5,
        backgroundImage: `linear-gradient(${withAlpha(palette.sky[100], 0.14)} 1px, transparent 1px), linear-gradient(90deg, ${withAlpha(palette.sky[100], 0.14)} 1px, transparent 1px)` }} />
      {callouts.map((callout, index) => (
        <Box key={callout.text} sx={{ position: "absolute", left: `${callout.x}%`, top: `${callout.y}%`, display: "flex", alignItems: "center",
          flexDirection: callout.side === "left" ? "row-reverse" : "row", translate: callout.side === "left" ? "calc(-100% + 0.45em) -50%" : "-0.45em -50%",
          transformOrigin: callout.side === "left" ? "100% 50%" : "0 50%", animation: `${draw} 0.6s ${lab.ease} ${0.5 + index * 0.6}s both` }}>
          <Box sx={{ flex: "none", width: "0.9em", height: "0.9em", borderRadius: "50%", border: `2px solid ${palette.sky[150]}`, background: withAlpha(palette.sky[150], 0.3),
            boxShadow: `0 0 10px ${palette.sky[150]}` }} />
          <Box sx={{ flex: "none", width: "2.4em", height: "1px", background: palette.sky[150] }} />
          <Box sx={{ px: "0.7em", py: "0.35em", borderRadius: "0.4em", whiteSpace: "nowrap", fontFamily: "var(--font-mono), monospace", fontSize: "0.82em", fontWeight: 600,
            color: palette.slate[50], background: withAlpha(palette.navy[850], 0.82), border: `1px solid ${withAlpha(palette.sky[150], 0.6)}` }}>{callout.text}</Box>
        </Box>
      ))}
      <Box sx={{ position: "absolute", left: "4%", bottom: "7%", display: "flex", alignItems: "center", gap: "0.7em", pl: "0.7em", pr: "1em", py: "0.5em",
        borderRadius: "0.5em", borderLeft: `3px solid ${palette.sky[150]}`, background: withAlpha(palette.navy[850], 0.85), color: palette.grey[25], fontWeight: 650 }}>
        How it’s made
        <Box component="span" sx={{ color: palette.slate[275], fontFamily: "var(--font-mono), monospace", fontSize: "0.82em", fontWeight: 500 }}>0:12 / 0:45</Box>
      </Box>
    </Box>
  );
}

function Social() {
  return (
    <Box sx={stage}>
      {/* A vertical film on a wide screen: the same shot, blurred, fills the sides. */}
      <Box sx={{ ...stage, filter: "blur(18px) brightness(0.45)", scale: "1.2" }}>
        <Image src={still} alt="" fill sizes="(max-width: 900px) 100vw, 700px" style={cover} />
      </Box>
      <Box sx={{ position: "absolute", top: "4%", bottom: "4%", left: "50%", aspectRatio: "9 / 16", translate: "-50% 0", overflow: "hidden", borderRadius: "1.1em",
        boxShadow: `0 0 0 2px ${withAlpha(palette.white, 0.16)}, 0 1.5em 3em -1em ${palette.black}` }}>
        <Box sx={{ ...stage, animation: `${punch} 4.5s steps(1) infinite` }}>
          <Image src={still} alt="" fill sizes="320px" style={cover} />
        </Box>
        <Box sx={{ ...stage, background: `linear-gradient(180deg, ${withAlpha(palette.black, 0.45)}, transparent 26%, transparent 55%, ${withAlpha(palette.black, 0.8)})` }} />
        {/* Story-style progress: three cuts, one bar each. */}
        <Box sx={{ position: "absolute", top: "3%", insetInline: "5%", display: "flex", gap: "3%" }}>
          {[0, 1, 2].map(index => (
            <Box key={index} sx={{ flex: 1, height: "0.28em", borderRadius: 99, overflow: "hidden", background: withAlpha(palette.white, 0.3) }}>
              <Box sx={{ height: "100%", background: palette.white, transformOrigin: "0 50%", animation: `${fill} 1.5s linear ${index * 1.5}s both` }} />
            </Box>
          ))}
        </Box>
        <Box sx={{ position: "absolute", left: "7%", top: "12%", px: "0.6em", py: "0.15em", borderRadius: "0.35em", rotate: "-4deg", fontSize: "1.25em", fontWeight: 800,
          color: palette.navy[800], background: palette.sky[150], animation: `${pop} 0.45s ${lab.ease} 0.2s both` }}>NEW</Box>
        <Box sx={{ position: "absolute", insetInline: "7%", bottom: "19%", color: palette.white, fontSize: "1.8em", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em",
          textShadow: `0 2px 12px ${palette.black}` }}>Meet the new blue.</Box>
        <Box sx={{ position: "absolute", insetInline: "7%", bottom: "5.5%", display: "grid", placeItems: "center", height: "2.5em", borderRadius: 99, fontWeight: 700,
          color: palette.navy[800], background: palette.white }}>See it now</Box>
      </Box>
    </Box>
  );
}

const scenes = { luxury: Luxury, explainer: Explainer, social: Social };

type CreativeShowcaseProps = { cta?: { href: string; label: string } };

/**
 * The AI Creative Studio showcase: the same example product told three ways. Switching
 * between a luxury commercial, a technical explainer and a short social ad shows what a
 * creative direction changes: the frame, the pace, the type and the job the film does.
 */
export default function CreativeShowcase({ cta = { href: "/book-a-call", label: "Create my campaign" } }: CreativeShowcaseProps) {
  const [current, setCurrent] = useState<Treatment["id"]>("luxury");
  const id = useId();
  const treatment = treatments.find(item => item.id === current) ?? treatments[0];
  const Scene = scenes[treatment.id];

  function choose(next: Treatment["id"]) {
    setCurrent(next);
    trackEvent("showcase_view", { treatment: next });
  }

  return (
    <Box sx={{ ...neural.glassCard, backdropFilter: "blur(8px)", borderRadius: "22px", p: { xs: 2.5, sm: 3, md: 3.5 },
      "&::after": { display: "none" }, "& > *": { position: "relative", zIndex: 1 }, "&:hover, &:focus-visible, &:focus-within": {} }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
        <Box component="p" sx={{ ...neural.label, m: 0 }}>One product, three films</Box>
        <SampleBadge>Concept frames · our own logo as the product</SampleBadge>
      </Box>

      <Box component="fieldset" sx={{ border: 0, m: "20px 0 0", p: 0, minWidth: 0 }}>
        <Box component="legend" className="sr-only">Choose a creative direction</Box>
        <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(3, minmax(0, 1fr))" } }}>
          {treatments.map(item => (
            <Box component="label" key={item.id} sx={lab.choice(item.id === current)}>
              <input type="radio" name={`${id}-treatment`} checked={item.id === current} onChange={() => choose(item.id)} />
              <item.Icon aria-hidden="true" />{item.tab}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: { xs: 2.5, md: 3 }, display: "grid", gap: { xs: 3, md: 4 }, alignItems: "start",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.35fr) minmax(0, 1fr)" } }}>
        {/* The frame. Its type scales with its width, so the composition holds on a phone. */}
        <Box role="img" aria-label={`Concept frame for a ${treatment.tab.toLowerCase()} of the BlueTrendy logo sculpture. ${treatment.idea}`}
          sx={{ position: "relative", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: "16px", containerType: "inline-size", background: palette.navy[850],
            boxShadow: `0 0 0 1px ${withAlpha(palette.sky[150], 0.3)}, 0 30px 60px -34px ${palette.black}` }}>
          <Box key={treatment.id} sx={{ ...stage, fontSize: "clamp(8px, 2.05cqi, 15px)", animation: `${draw} 0.5s ${lab.ease} both`, transformOrigin: "50% 50%", ...noMotion }}>
            <Scene />
          </Box>
        </Box>

        <Box aria-live="polite" sx={{ minWidth: 0 }}>
          <Box component="h3" sx={{ m: 0, color: palette.grey[25], fontSize: "1.3rem", fontWeight: 650, letterSpacing: "-0.03em" }}>{treatment.tab}</Box>
          <Box component="p" sx={{ m: "8px 0 0", color: palette.slate[125], lineHeight: 1.55, fontSize: "0.97rem" }}>{treatment.idea}</Box>

          <Box component="dl" sx={{ m: "18px 0 0", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.25 }}>
            {[["Frame", treatment.format], ["Length", treatment.length]].map(([term, value]) => (
              <Box key={term} sx={{ p: 1.25, borderRadius: "12px", border: `1px solid ${withAlpha(palette.sky[175], 0.2)}`, background: withAlpha(palette.navy[850], 0.45) }}>
                <Box component="dt" sx={{ color: palette.sky[150], fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>{term}</Box>
                <Box component="dd" sx={{ m: "4px 0 0", color: palette.grey[25], fontSize: "0.93rem", fontWeight: 600 }}>{value}</Box>
              </Box>
            ))}
          </Box>

          <Box component="h4" sx={{ ...lab.caption, m: "20px 0 10px" }}>Shot plan</Box>
          <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1 }}>
            {treatment.shots.map(([beat, text]) => (
              <Box component="li" key={beat} sx={{ display: "grid", gridTemplateColumns: "58px minmax(0, 1fr)", gap: 1.25, color: palette.slate[100], fontSize: "0.92rem", lineHeight: 1.45 }}>
                <Box component="span" sx={{ color: palette.sky[150], fontFamily: "var(--font-mono), monospace", fontSize: "0.8rem", pt: "2px" }}>{beat}</Box>{text}
              </Box>
            ))}
          </Box>

          <Box component="p" sx={{ m: "18px 0 0", color: palette.slate[125], fontSize: "0.92rem", lineHeight: 1.5 }}>
            <Box component="strong" sx={{ color: palette.grey[25], fontWeight: 650 }}>Made for: </Box>{treatment.channels}.{" "}
            <Box component="strong" sx={{ color: palette.grey[25], fontWeight: 650 }}>What we’d test: </Box>{treatment.test}
          </Box>

          <Box sx={{ mt: 2.5 }}>
            <LinkButton href={cta.href} variant="contained" endIcon={<ArrowForwardRounded />}
              onClick={() => trackEvent("service_cta_click", { location: "creative_showcase" })}>
              {cta.label}
            </LinkButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
