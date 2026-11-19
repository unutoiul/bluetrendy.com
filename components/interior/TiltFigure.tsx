"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { usePanelTilt } from "@/components/experience/PanelMotion";
import styles from "./Services.styles";

export default function TiltFigure({ children }: { children: ReactNode }) {
  const tilt = usePanelTilt(5);
  return <div className={styles.stage} aria-hidden="true">
    <motion.div className={styles.art} {...tilt}>{children}</motion.div>
  </div>;
}

