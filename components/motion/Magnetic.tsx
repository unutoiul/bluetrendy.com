"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type MagneticProps = {
  children: ReactNode;
  /** Share of the pointer's offset from the centre that the child follows. */
  strength?: number;
  /** Largest shift in pixels. */
  max?: number;
};

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

/** Pulls its child toward a mouse pointer and springs back when the pointer leaves. */
export default function Magnetic({ children, strength = 0.3, max = 10 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const spring = { stiffness: 260, damping: 17, mass: 0.6 };
  const x = useSpring(pullX, spring);
  const y = useSpring(pullY, spring);

  function follow(event: PointerEvent) {
    const box = ref.current?.getBoundingClientRect();
    if (!box || reduced || event.pointerType !== "mouse") return;
    pullX.set(clamp((event.clientX - box.left - box.width / 2) * strength, max));
    pullY.set(clamp((event.clientY - box.top - box.height / 2) * strength, max));
  }

  function release() {
    pullX.set(0);
    pullY.set(0);
  }

  return (
    <motion.span ref={ref} onPointerMove={follow} onPointerLeave={release}
      style={{ x, y, display: "inline-flex", position: "relative", isolation: "isolate" }}>
      {/* Catches the pointer a little before it reaches the child. */}
      <span aria-hidden="true" style={{ position: "absolute", inset: -14, zIndex: -1 }} />
      {children}
    </motion.span>
  );
}
