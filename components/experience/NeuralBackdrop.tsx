"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

/** Where the constellation gathers and whether a wave of dots runs along the bottom. */
export type BackdropLayout = {
  /** Rectangles, in 0–1 section coordinates, that hold most of the nodes. */
  clusters: { x: number; y: number; w: number; h: number; nodes: number }[];
  /** Nodes scattered across the whole section. */
  scatter?: number;
  /** Height of the dotted wave as a share of the section; 0 hides it. */
  wave?: number;
  seed?: number;
};

type Node = { x: number; y: number; r: number; phase: number; driftX: number; driftY: number };
type Signal = { from: number; to: number; start: number; duration: number };

const linkDistance = 150;
const pointerReach = 190;
const frameGap = 1000 / 40;

// Small deterministic generator, so a layout looks the same on every visit.
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

function placeNodes(layout: BackdropLayout) {
  const next = random(layout.seed ?? 7);
  const nodes: Node[] = [];
  const add = (x: number, y: number) => nodes.push({
    x, y, r: 0.9 + next() * 1.9, phase: next() * Math.PI * 2,
    driftX: (next() - 0.5) * 0.012, driftY: (next() - 0.5) * 0.012,
  });
  for (const zone of layout.clusters) {
    for (let i = 0; i < zone.nodes; i++) add(zone.x + next() * zone.w, zone.y + next() * zone.h);
  }
  for (let i = 0; i < (layout.scatter ?? 0); i++) add(next(), next());
  return nodes;
}

/**
 * A neural constellation drawn on canvas behind a section: glowing nodes, links that
 * fade with distance, signals that travel along the links, nodes that light up near
 * the pointer, and an optional wave of dots. It only animates while on screen, and
 * draws a single still frame for people who prefer reduced motion.
 */
export default function NeuralBackdrop({ layout, sx }: { layout: BackdropLayout; sx?: SxProps<Theme> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layoutKey = JSON.stringify(layout);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !section || !context) return;
    const settings: BackdropLayout = JSON.parse(layoutKey);
    const nodes = placeNodes(settings);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const pick = random((settings.seed ?? 7) * 31);
    const signals: Signal[] = [];
    let width = 0, height = 0, frame = 0, last = 0, visible = false;
    let pointer: { x: number; y: number } | null = null;
    let links: [number, number, number][] = [];

    function resize() {
      const box = section!.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = box.width;
      height = box.height;
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(performance.now());
    }

    function position(node: Node, time: number) {
      const t = time / 1000;
      return {
        x: (node.x + Math.sin(t * 0.25 + node.phase) * node.driftX) * width,
        y: (node.y + Math.cos(t * 0.21 + node.phase) * node.driftY) * height,
      };
    }

    function glow(x: number, y: number, radius: number, alpha: number) {
      const halo = context!.createRadialGradient(x, y, 0, x, y, radius * 7);
      halo.addColorStop(0, `rgba(120, 215, 255, ${0.55 * alpha})`);
      halo.addColorStop(1, "rgba(30, 120, 255, 0)");
      context!.fillStyle = halo;
      context!.beginPath();
      context!.arc(x, y, radius * 7, 0, Math.PI * 2);
      context!.fill();
      context!.fillStyle = `rgba(225, 248, 255, ${0.95 * alpha})`;
      context!.beginPath();
      context!.arc(x, y, radius, 0, Math.PI * 2);
      context!.fill();
    }

    function drawWave(time: number) {
      const share = settings.wave ?? 0;
      if (!share) return;
      const t = time / 1000;
      const top = height * (1 - share);
      const columns = Math.max(60, Math.round(width / 14));
      const rows = 20;
      for (let row = 0; row < rows; row++) {
        const depth = row / (rows - 1);
        const scale = 0.35 + depth * 0.65;
        for (let column = 0; column <= columns; column++) {
          const u = column / columns;
          const lift = Math.sin(u * 7.5 + t * 0.55 + depth * 2.6) * 0.45 + Math.sin(u * 15 - t * 0.35 + depth * 5) * 0.2;
          const x = width * (0.5 + (u - 0.5) * (0.8 + depth * 0.45));
          const y = top + share * height * (0.2 + depth * 0.75) - lift * 26 * scale;
          const crest = Math.max(0, lift);
          const alpha = (0.1 + depth * 0.45) * (0.55 + crest * 0.9);
          const size = 0.6 + scale * 1.3;
          context!.fillStyle = crest > 0.45 ? `rgba(190, 240, 255, ${alpha})` : `rgba(60, 160, 255, ${alpha})`;
          context!.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
    }

    function draw(time: number) {
      context!.clearRect(0, 0, width, height);
      context!.globalCompositeOperation = "lighter";
      drawWave(time);
      const points = nodes.map(node => position(node, time));
      links = [];
      for (let a = 0; a < points.length; a++) {
        for (let b = a + 1; b < points.length; b++) {
          const distance = Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y);
          if (distance < linkDistance) links.push([a, b, distance]);
        }
      }
      context!.lineWidth = 1;
      for (const [a, b, distance] of links) {
        context!.strokeStyle = `rgba(70, 160, 255, ${0.42 * (1 - distance / linkDistance)})`;
        context!.beginPath();
        context!.moveTo(points[a].x, points[a].y);
        context!.lineTo(points[b].x, points[b].y);
        context!.stroke();
      }
      if (pointer) {
        for (const point of points) {
          const distance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
          if (distance > pointerReach) continue;
          context!.strokeStyle = `rgba(130, 225, 255, ${0.5 * (1 - distance / pointerReach)})`;
          context!.beginPath();
          context!.moveTo(pointer.x, pointer.y);
          context!.lineTo(point.x, point.y);
          context!.stroke();
        }
      }
      const t = time / 1000;
      nodes.forEach((node, index) => {
        const point = points[index];
        const near = pointer ? Math.max(0, 1 - Math.hypot(point.x - pointer.x, point.y - pointer.y) / pointerReach) : 0;
        const pulse = 0.6 + Math.sin(t * 1.6 + node.phase) * 0.25;
        glow(point.x, point.y, node.r * (1 + near * 0.8), Math.min(1, pulse + near));
      });
      // Signals travel along existing links, like current through the network.
      for (let i = signals.length - 1; i >= 0; i--) {
        const signal = signals[i];
        const progress = (time - signal.start) / signal.duration;
        if (progress >= 1 || !points[signal.from] || !points[signal.to]) { signals.splice(i, 1); continue; }
        const from = points[signal.from], to = points[signal.to];
        glow(from.x + (to.x - from.x) * progress, from.y + (to.y - from.y) * progress, 1.6, Math.sin(progress * Math.PI));
      }
      context!.globalCompositeOperation = "source-over";
    }

    function tick(time: number) {
      frame = requestAnimationFrame(tick);
      if (time - last < frameGap) return;
      last = time;
      if (links.length && signals.length < 6 && pick() < 0.08) {
        const [from, to] = links[Math.floor(pick() * links.length)];
        signals.push(pick() < 0.5 ? { from, to, start: time, duration: 900 + pick() * 900 }
          : { from: to, to: from, start: time, duration: 900 + pick() * 900 });
      }
      draw(time);
    }

    function update() {
      cancelAnimationFrame(frame);
      if (visible && !reduced.matches && !document.hidden) frame = requestAnimationFrame(tick);
      else draw(reduced.matches ? 0 : performance.now());
    }

    function follow(event: PointerEvent) {
      if (event.pointerType !== "mouse" || reduced.matches) return;
      const box = section!.getBoundingClientRect();
      pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
    }
    function release() { pointer = null; }

    const sizeWatcher = new ResizeObserver(resize);
    sizeWatcher.observe(section);
    const viewWatcher = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    viewWatcher.observe(section);
    section.addEventListener("pointermove", follow);
    section.addEventListener("pointerleave", release);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      sizeWatcher.disconnect();
      viewWatcher.disconnect();
      section.removeEventListener("pointermove", follow);
      section.removeEventListener("pointerleave", release);
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
    };
  }, [layoutKey]);

  return (
    <Box component="canvas" ref={canvasRef} aria-hidden="true"
      sx={[{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" },
        ...(Array.isArray(sx) ? sx : [sx])]} />
  );
}
