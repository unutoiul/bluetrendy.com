"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export const revealItemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export function RevealGroup({ children }: { children: ReactNode }) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={container}>
      {children}
    </motion.div>
  );
}

export function RevealItem({ children }: { children: ReactNode }) {
  return <motion.div variants={revealItemVariants}>{children}</motion.div>;
}
