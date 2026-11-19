"use client";

import { useEffect, type PointerEvent, type ComponentProps } from "react";
import { animate } from "motion/mini";
import { inView } from "motion";
import { motion, useReducedMotion, useSpring } from "motion/react";

const spring = { stiffness: 260, damping: 27, mass: 0.7 };

export function usePanelTilt(strength = 8) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);

  function track(event: PointerEvent<HTMLElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const panel = event.currentTarget;
    const rect = panel.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    rotateX.set((0.5 - y) * strength * 2);
    rotateY.set((x - 0.5) * strength * 2);
    panel.style.setProperty("--light-x", `${x * 100}%`);
    panel.style.setProperty("--light-y", `${y * 100}%`);
  }

  function reset(event: PointerEvent<HTMLElement>) {
    rotateX.set(0);
    rotateY.set(0);
    event.currentTarget.style.removeProperty("--light-x");
    event.currentTarget.style.removeProperty("--light-y");
  }

  return {
    "data-tilt-panel": true,
    style: reduced ? undefined : { transformPerspective: 850, rotateX, rotateY },
    onPointerMove: track,
    onPointerLeave: reset,
    onPointerCancel: reset,
  };
}

export function ProductionPanel(props: ComponentProps<typeof motion.article>) {
  const tilt = usePanelTilt(5);
  return <motion.article {...props} {...tilt} />;
}

// Independent translate leaves the pointer-driven rotations on each card free to move.
export function HomeArrivals() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-experience] [data-arrive]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const playing = new Set<ReturnType<typeof animate>>();
    const stop = inView(Array.from(elements), element => {
      if (reduced.matches) return;
      const index = Number((element as HTMLElement).dataset.arrive) || 0;
      element.setAttribute("data-arrived", "");
      const turn = element.hasAttribute("data-tilt-panel")
        ? { rotate: [`1 0.4 0 ${index % 2 ? -12 : 12}deg`, "1 0.4 0 0deg"] }
        : {};
      const arrival = animate(element, { opacity: [0.55, 1], translate: ["0 18px", "0 0"], ...turn }, {
        duration: 0.62, delay: index * 0.065, ease: [0.16, 1, 0.3, 1],
      });
      playing.add(arrival);
      void arrival.then(() => playing.delete(arrival));
    }, { amount: 0.12 });
    function finish() { for (const arrival of playing) arrival.complete(); }
    reduced.addEventListener("change", finish);
    return () => {
      stop();
      finish();
      reduced.removeEventListener("change", finish);
    };
  }, []);
  return null;
}
