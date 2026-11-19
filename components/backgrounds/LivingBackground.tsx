"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { effects, type EffectName, type Frame } from "./effects";

type LivingBackgroundProps = {
  effect: EffectName;
  /**
   * The side that holds the copy. The effect still covers the whole section but fades
   * toward this side, so text stays easy to read.
   */
  quiet?: "left" | "right" | "top" | "none";
  /** Drawing on a white section. */
  light?: boolean;
  seed?: number;
  sx?: SxProps<Theme>;
};

const frameGap = 1000 / 40;
// Everything is drawn a little dimmer and slower than the effects' own values: calm, not busy.
const opacity = 0.7;
const pace = 0.6;

// Small deterministic generator, so a background looks the same on every visit.
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A living background drawn on canvas behind a section. It fills the section, reacts to
 * the mouse and to clicks, animates only while on screen and while the tab is visible,
 * and draws one still frame for people who prefer reduced motion.
 */
export default function LivingBackground({ effect, quiet = "left", light = false, seed = 7, sx }: LivingBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !section || !context) return;
    const draw = effects[effect](random(seed));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, last = 0, start = 0, previous = 0, visible = false;
    let pointer: Frame["pointer"] = null;
    const clicks: { x: number; y: number; at: number }[] = [];

    function render(now: number) {
      // A hidden section (display: none) has no size; effects would divide by zero.
      if (!width || !height) return;
      const time = ((now - start) / 1000) * pace;
      // A resize draws with performance.now(), and the next frame's timestamp can be a touch
      // earlier. Never step backwards: a negative step feeds energy into the springs.
      const delta = (previous ? Math.max(0, Math.min(0.1, (now - previous) / 1000)) : frameGap / 1000) * pace;
      previous = now;
      context!.clearRect(0, 0, width, height);
      context!.globalCompositeOperation = light ? "source-over" : "lighter";
      context!.globalAlpha = opacity;
      while (clicks.length && now - clicks[0].at > 2000) clicks.shift();
      draw({
        context: context!, width, height, time, delta, pointer, light, narrow: width < 700,
        bursts: clicks.map(click => ({ x: click.x, y: click.y, age: ((now - click.at) / 1000) * pace })),
      });
      // Quiet zone: fade the effect toward the copy without leaving any part of the section bare.
      if (quiet !== "none") {
        // "right" keeps the logo side clear; on narrow screens the logo sits below the copy instead.
        const narrow = width < 700;
        const fade = quiet === "left"
          ? context!.createLinearGradient(0, 0, width * (narrow ? 0.9 : 0.58), 0)
          : quiet === "right"
            ? narrow ? context!.createLinearGradient(0, height, 0, height * 0.45) : context!.createLinearGradient(width, 0, width * 0.46, 0)
            : context!.createLinearGradient(0, 0, 0, height * 0.42);
        fade.addColorStop(0, quiet === "right" ? "rgba(0, 0, 0, 0.95)" : "rgba(0, 0, 0, 0.72)");
        fade.addColorStop(1, "rgba(0, 0, 0, 0)");
        context!.globalAlpha = 1;
        context!.globalCompositeOperation = "destination-out";
        context!.fillStyle = fade;
        context!.fillRect(0, 0, width, height);
      }
      context!.globalCompositeOperation = "source-over";
      context!.globalAlpha = 1;
    }

    function resize() {
      // Layout size, not the on-screen box: a section that is mid-turn or mid-scale in 3D
      // would otherwise get a squashed canvas that stays wrong once it settles.
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = section!.clientWidth;
      height = section!.clientHeight;
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      render(reduced.matches ? start : performance.now());
    }

    function tick(now: number) {
      frame = requestAnimationFrame(tick);
      if (now - last < frameGap) return;
      last = now;
      render(now);
    }

    function update() {
      cancelAnimationFrame(frame);
      previous = 0;
      if (visible && !reduced.matches && !document.hidden) frame = requestAnimationFrame(tick);
      else render(reduced.matches ? start : performance.now());
    }

    function follow(event: PointerEvent) {
      if (event.pointerType !== "mouse" || reduced.matches) return;
      const box = section!.getBoundingClientRect();
      pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
    }
    function release() { pointer = null; }
    function press(event: PointerEvent) {
      if (reduced.matches) return;
      const box = section!.getBoundingClientRect();
      clicks.push({ x: event.clientX - box.left, y: event.clientY - box.top, at: performance.now() });
    }

    start = performance.now();
    const sizeWatcher = new ResizeObserver(resize);
    sizeWatcher.observe(section);
    const viewWatcher = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    viewWatcher.observe(section);
    section.addEventListener("pointermove", follow);
    section.addEventListener("pointerleave", release);
    section.addEventListener("pointerdown", press);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      sizeWatcher.disconnect();
      viewWatcher.disconnect();
      section.removeEventListener("pointermove", follow);
      section.removeEventListener("pointerleave", release);
      section.removeEventListener("pointerdown", press);
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
    };
  }, [effect, quiet, light, seed]);

  return (
    <Box component="canvas" ref={canvasRef} aria-hidden="true"
      sx={[{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} />
  );
}
