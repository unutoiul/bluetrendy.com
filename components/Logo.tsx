"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import { animate, useReducedMotion } from "motion/react";

// In both lockup images the ribbon mark ends at x=389 and the wordmark starts at x=427 (of 1320).
const markShare = 408 / 1320;
let arrivalSpun = false;

type LogoProps = {
  href?: string;
  onNavigate?: () => void;
  height?: number;
  inverse?: boolean;
  /** Spin the mark once when the site first loads (after the entrance film, if it is open). */
  spinOnArrival?: boolean;
};

export default function Logo({ height = 45, inverse = false, spinOnArrival = false, href = "/", onNavigate }: LogoProps) {
  const image = inverse ? "/brand/logo-inverse.svg" : "/brand/logo.svg";
  const width = Math.round(height * 1320 / 322);
  const HomeLink = href.startsWith("#") ? "a" : Link;
  const mark = useRef<HTMLSpanElement>(null);
  const spinning = useRef(false);
  const reduced = useReducedMotion();

  // The same turntable turn as the sculpture in the hero, on a flat mark.
  function spin() {
    const element = mark.current;
    if (!element || spinning.current || reduced) return;
    spinning.current = true;
    animate(element, { rotateY: [0, 360] }, { duration: 1.2, ease: [0.65, 0, 0.35, 1] })
      .then(() => { spinning.current = false; });
  }
  const spinOnce = useEffectEvent(spin);

  useEffect(() => {
    if (!spinOnArrival || arrivalSpun) return;
    let timer = 0;
    const start = () => {
      timer = window.setTimeout(() => {
        arrivalSpun = true;
        spinOnce();
      }, 450);
    };
    const gate = document.querySelector<HTMLDialogElement>("dialog[data-website-entrance]");
    if (gate?.open) gate.addEventListener("close", start, { once: true });
    else start();
    return () => {
      window.clearTimeout(timer);
      gate?.removeEventListener("close", start);
    };
  }, [spinOnArrival]);

  return (
    <HomeLink href={href} aria-label="BlueTrendy Intelligence home" onPointerEnter={spin} onFocus={spin}
      onClick={() => { spin(); onNavigate?.(); }}
      style={{ display: "inline-flex", flexShrink: 0 }}>
      <Box sx={{ position: "relative", width, height, perspective: `${height * 12}px` }}>
        <Box component="span" ref={mark}
          sx={{ position: "absolute", inset: 0, right: "auto", width: `${markShare * 100}%`, overflow: "hidden", display: "block" }}>
          <Box component="img" src={image} alt="" width={width} height={height}
            sx={{ display: "block", width, height, maxWidth: "none" }} />
        </Box>
        <Box component="img" src={image} alt="" width={width} height={height}
          sx={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%", clipPath: `inset(0 0 0 ${markShare * 100}%)` }} />
      </Box>
    </HomeLink>
  );
}
