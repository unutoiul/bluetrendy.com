"use client";

import InputAdornment from "@mui/material/InputAdornment";
import { AnimatePresence, motion } from "motion/react";
import { palette } from "@/theme/palette";

/** A check that pops in at the end of a text field once its value looks complete. */
export default function FieldCheck({ show }: { show: boolean }) {
  return (
    <InputAdornment position="end" sx={{ width: 22, ml: 0.5, pointerEvents: "none" }}>
      <AnimatePresence>
        {show && (
          <motion.svg key="check" viewBox="0 0 24 24" width={22} height={22} aria-hidden="true"
            initial={{ scale: 0.3, opacity: 0, rotate: -40 }} animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.3, opacity: 0 }} transition={{ type: "spring", stiffness: 520, damping: 22 }}>
            <circle cx="12" cy="12" r="11" fill={palette.blue[500]} />
            <motion.path d="M7 12.4l3.3 3.3L17.2 8.8" fill="none" stroke={palette.white} strokeWidth={2.3}
              strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1, duration: 0.32 }} />
          </motion.svg>
        )}
      </AnimatePresence>
    </InputAdornment>
  );
}
