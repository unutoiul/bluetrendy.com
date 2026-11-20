"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { usePanelTilt } from "@/components/experience/PanelMotion";
import SampleBadge from "@/components/lab/SampleBadge";
import styles from "./Services.styles";

/**
 * The dark stage a service mock-up sits on. `data-seen` starts its one-off entrance the first
 * time it scrolls into view; `data-live` runs its loops only while it is on screen. The
 * screens are examples with made-up data, and the badge under the stage says so; `tone` is
 * the surface the stage sits on.
 */
export default function TiltFigure({ label, children, tone = "light" }: { label: string; children: ReactNode; tone?: "light" | "dark" }) {
  const stage = useRef<HTMLDivElement>(null);
  const tilt = usePanelTilt(2.5);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) element.setAttribute("data-seen", "");
      element.toggleAttribute("data-live", entry.isIntersecting);
    }, { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <>
    <div ref={stage} className={styles.stage} role="img" aria-label={label}>
      <motion.div className="Mock" {...tilt}>{children}</motion.div>
    </div>
    <p className={styles.sample}><SampleBadge tone={tone}>Example screen · sample data</SampleBadge></p>
  </>;
}
