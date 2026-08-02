"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import { motion } from "motion/react";
import { brand } from "@/theme/theme";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

type Star = {
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
};

function round(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function makeStars(count: number, seedOffset: number, sizeRange: [number, number]): Star[] {
  return Array.from({ length: count }).map((_, i) => {
    const s = i + seedOffset;
    return {
      top: round(seededRandom(s * 3.1) * 100, 3),
      left: round(seededRandom(s * 7.7) * 100, 3),
      size: round(sizeRange[0] + seededRandom(s * 5.3) * (sizeRange[1] - sizeRange[0]), 2),
      duration: round(2 + seededRandom(s * 11.1) * 4, 2),
      delay: round(seededRandom(s * 2.9) * 5, 2),
    };
  });
}

type Layer = {
  stars: Star[];
  panX: number;
  panY: number;
  panDuration: number;
  opacity: number;
};

export default function AnimatedSky() {
  const layers = useMemo<Layer[]>(
    () => [
      { stars: makeStars(45, 0, [0.6, 1.4]), panX: 40, panY: 18, panDuration: 70, opacity: 0.5 },
      { stars: makeStars(28, 100, [1, 2]), panX: 65, panY: 30, panDuration: 48, opacity: 0.75 },
      { stars: makeStars(14, 200, [1.6, 3]), panX: 95, panY: 45, panDuration: 30, opacity: 1 },
    ],
    [],
  );

  return (
    <Box aria-hidden sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Slow-rotating nebula glow for depth */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: "-30%",
          opacity: 0.4,
          backgroundImage: `radial-gradient(ellipse at 25% 30%, ${brand.blueLight}55 0%, transparent 45%),
                             radial-gradient(ellipse at 75% 65%, ${brand.blue}44 0%, transparent 50%),
                             radial-gradient(ellipse at 45% 90%, ${brand.blueLight}33 0%, transparent 55%)`,
          filter: "blur(30px)",
        }}
      />

      {/* Parallax starfield — each depth layer drifts at its own speed, like moving through space */}
      {layers.map((layer, li) => (
        <motion.div
          key={li}
          animate={{ x: [0, layer.panX, 0, -layer.panX, 0], y: [0, layer.panY, 0, -layer.panY, 0] }}
          transition={{ duration: layer.panDuration, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", inset: "-10%", opacity: layer.opacity }}
        >
          {layer.stars.map((star, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: star.duration, repeat: Infinity, ease: "easeInOut", delay: star.delay }}
              style={{
                position: "absolute",
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                boxShadow: "0 0 4px rgba(255,255,255,0.85)",
              }}
            />
          ))}
        </motion.div>
      ))}

      {/* Shooting stars streaking across */}
      {[
        { top: 12, left: 8, delay: 2, duration: 1.8 },
        { top: 30, left: 52, delay: 9, duration: 1.5 },
        { top: 8, left: 68, delay: 16, duration: 1.7 },
      ].map((s, i) => (
        <motion.div
          key={`shoot-${i}`}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: 260, y: 150, opacity: [0, 1, 0] }}
          transition={{ duration: s.duration, repeat: Infinity, repeatDelay: 9, delay: s.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: "2px",
            height: "2px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            boxShadow:
              "0 0 6px 1px rgba(255,255,255,0.95), -110px 1px 16px -3px rgba(255,255,255,0.55)",
          }}
        />
      ))}
    </Box>
  );
}
