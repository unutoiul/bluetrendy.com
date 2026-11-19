"use client";

import { usePathname } from "next/navigation";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import type { EffectName } from "@/components/backgrounds/effects";

// Every page banner gets its own living background, behind the 3D logo film.
const scenes: [prefix: string, effect: EffectName, seed: number][] = [
  ["/services", "circuit", 61],
  ["/case-studies", "globe", 67],
  ["/process", "flow", 71],
  ["/pricing", "horizonGrid", 83],
  ["/about", "orbit", 73],
  ["/contact", "ripples", 79],
];

export default function PageBackdrop() {
  const path = usePathname();
  const [, effect, seed] = scenes.find(([prefix]) => path === prefix || path.startsWith(prefix + "/")) ?? ["", "constellation", 89];
  // The animation lives under the headline; it fades out before it reaches the logo film.
  return <LivingBackground effect={effect} seed={seed} quiet="right" />;
}
