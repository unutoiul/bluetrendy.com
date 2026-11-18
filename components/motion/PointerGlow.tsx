"use client";

import { useEffect, useRef } from "react";

type PointerGlowProps = {
  color?: string;
  size?: number;
};

/**
 * A soft light that follows the mouse across its parent. The parent needs
 * `position: relative` (or another positioning context) and `overflow: hidden`.
 */
export default function PointerGlow({ color = "rgba(22,95,204,0.12)", size = 420 }: PointerGlowProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const glow = ref.current;
    const surface = glow?.parentElement;
    if (!glow || !surface || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    function move(event: PointerEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = surface!.getBoundingClientRect();
        glow!.style.setProperty("--glow-x", `${event.clientX - box.left}px`);
        glow!.style.setProperty("--glow-y", `${event.clientY - box.top}px`);
        glow!.style.opacity = "1";
      });
    }
    function leave() {
      cancelAnimationFrame(frame);
      glow!.style.opacity = "0";
    }
    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <span ref={ref} aria-hidden="true" style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0, transition: "opacity 0.4s ease",
      background: `radial-gradient(${size}px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${color}, transparent 60%)`,
    }} />
  );
}
