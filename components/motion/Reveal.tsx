"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
};

export default function Reveal({ children, delay = 0, y = 28, once = true }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] as const }}
    >
      {children}
    </motion.div>
  );
}
