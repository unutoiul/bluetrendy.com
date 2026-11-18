"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { proofStats } from "@/data/stats";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

function StatNumber({ value }: { value: string }) {
  // Memoized so the effect below doesn't see a "new" match array (and restart
  // the tween from 0) on every onUpdate-triggered re-render.
  const match = useMemo(() => value.match(/^(\d+)(.*)$/), [value]);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(match ? "0" : value);

  useEffect(() => {
    if (!match || !inView || reduced) return;
    const target = parseInt(match[1], 10);
    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, match, reduced]);

  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden>{reduced || !inView ? value : display + (match?.[2] ?? "")}</span>
    </span>
  );
}

export default function StatStrip({ compact = false }: { compact?: boolean }) {
  return (
    <Grid
      container
      spacing={{ xs: 4, md: compact ? 4 : 3 }}
      component={motion.div}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={container}
    >
      {proofStats.map((stat) => (
        <Grid key={stat.label} size={compact ? 6 : { xs: 6, md: 3 }}>
          <Box component={motion.div} variants={item}>
            <Typography
              sx={{
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                fontSize: compact ? { xs: "1.75rem", md: "2rem" } : { xs: "2rem", md: "2.5rem" },
                color: "primary.main",
                lineHeight: 1,
              }}
            >
              <StatNumber value={stat.value} />
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {stat.label}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
