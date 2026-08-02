"use client";

import Box from "@mui/material/Box";
import { brand } from "@/theme/theme";
import { cloudTexture, TEXTURE_SIZE } from "./cloudTexture";

// A white body over a navy under-copy offset down and right. The offset shadow
// is what stops these reading as flat smoke — it gives each puff a lit top.
//
// Three softness grades stand in for depth of field. Softness is baked into the
// texture rather than applied as a CSS blur: blurring an element that is also
// scaling forces a re-rasterise on every frame, which is exactly the thing to
// avoid on six full-bleed layers.
const GRADES = [
  { seed: 3, softness: 5 },
  { seed: 11, softness: 9 },
  { seed: 27, softness: 15 },
];

const CLOUD_BODY = GRADES.map((g) => cloudTexture({ seed: g.seed, bias: -0.38, softness: g.softness }));
const CLOUD_SHADOW = GRADES.map((g) =>
  cloudTexture({ seed: g.seed, rgb: [0.02, 0.11, 0.17], bias: -0.3, softness: g.softness + 3 }),
);

/* ------------------------------------------------------------------ *
 * Fly-through layers
 *
 * Each cloud starts small and near the centre, then accelerates outward and
 * past the camera. Negative delays spread them through the cycle so the sky
 * is already mid-flight on first paint rather than starting empty.
 * ------------------------------------------------------------------ */

type Cloud = {
  /** Direction it drifts past the viewer, as a share of the hero box. */
  tx: number;
  ty: number;
  /** Peak opacity — the near, fast ones stay faint so text keeps contrast. */
  peak: number;
  duration: number;
  /** Negative, so the layer is already in flight at load. */
  delay: number;
  /** Softness grade: 0 is crisp and near, 2 is hazy and far. */
  texture: number;
  /** Which slice of the noise this cloud shows, for shape variety. */
  posX: number;
  posY: number;
  scale: number;
};

const clouds: Cloud[] = [
  { tx: -34, ty: -20, peak: 0.55, duration: 34, delay: -2, texture: 0, posX: 12, posY: 20, scale: 1.5 },
  { tx: 28, ty: -26, peak: 0.42, duration: 41, delay: -9, texture: 1, posX: 62, posY: 8, scale: 1.7 },
  { tx: -30, ty: 24, peak: 0.46, duration: 38, delay: -17, texture: 0, posX: 30, posY: 68, scale: 1.4 },
  { tx: 36, ty: 18, peak: 0.36, duration: 46, delay: -24, texture: 2, posX: 78, posY: 52, scale: 1.9 },
  { tx: -8, ty: -34, peak: 0.4, duration: 30, delay: -13, texture: 1, posX: 45, posY: 34, scale: 1.3 },
  { tx: 14, ty: 30, peak: 0.32, duration: 52, delay: -33, texture: 2, posX: 5, posY: 82, scale: 2.1 },
  { tx: -18, ty: 34, peak: 0.38, duration: 44, delay: -29, texture: 1, posX: 88, posY: 78, scale: 1.6 },
  { tx: 40, ty: -12, peak: 0.3, duration: 58, delay: -41, texture: 2, posX: 20, posY: 46, scale: 2.2 },
];

/* ------------------------------------------------------------------ *
 * Starfield — the sky above the cloud deck
 * ------------------------------------------------------------------ */

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const round = (n: number) => Math.round(n * 100) / 100;

type Star = { top: number; left: number; size: number; duration: number; delay: number };

function makeStars(count: number, seedOffset: number, sizeRange: [number, number]): Star[] {
  return Array.from({ length: count }).map((_, i) => {
    const s = i + seedOffset;
    return {
      top: round(seededRandom(s * 3.1) * 100),
      left: round(seededRandom(s * 7.7) * 100),
      size: round(sizeRange[0] + seededRandom(s * 5.3) * (sizeRange[1] - sizeRange[0])),
      duration: round(2.5 + seededRandom(s * 11.1) * 4),
      delay: round(seededRandom(s * 2.9) * 6),
    };
  });
}

const starLayers = [
  { stars: makeStars(32, 0, [0.6, 1.3]), opacity: 0.4, pan: "skyPanFar 78s" },
  { stars: makeStars(18, 100, [1, 1.9]), opacity: 0.62, pan: "skyPanMid 56s" },
  { stars: makeStars(9, 200, [1.5, 2.6]), opacity: 0.85, pan: "skyPanNear 38s" },
];

export default function AnimatedSky() {
  return (
    <Box
      aria-hidden
      className="bt-sky"
      sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      {/* Moonlit colour wash for depth behind everything. */}
      <Box
        sx={{
          position: "absolute",
          inset: "-25%",
          filter: "blur(60px)",
          opacity: 0.5,
          backgroundImage: `radial-gradient(40% 55% at 22% 28%, ${brand.blueLight}55 0%, transparent 70%),
                            radial-gradient(45% 50% at 78% 62%, ${brand.blue}55 0%, transparent 72%),
                            radial-gradient(50% 45% at 50% 95%, #8FD0F033 0%, transparent 70%)`,
          animation: "skyAurora 34s ease-in-out infinite alternate",
        }}
      />

      {/* Stars sit behind the clouds so the deck passes in front of them. */}
      {starLayers.map((layer, li) => (
        <Box
          key={`stars-${li}`}
          sx={{
            position: "absolute",
            inset: "-8%",
            opacity: layer.opacity,
            animation: `${layer.pan} ease-in-out infinite`,
          }}
        >
          {layer.stars.map((star, i) => (
            <Box
              key={i}
              component="span"
              sx={{
                position: "absolute",
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                borderRadius: "50%",
                backgroundColor: "#fff",
                boxShadow: "0 0 4px rgba(255,255,255,0.85)",
                animation: `skyTwinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              }}
            />
          ))}
        </Box>
      ))}

      {/* A distant deck so the horizon is never bare between passes. */}
      <Box
        sx={{
          position: "absolute",
          inset: "-10%",
          opacity: 0.16,
          backgroundImage: `${CLOUD_BODY[1]}, ${CLOUD_SHADOW[1]}`,
          backgroundPosition: "0% 70%, 6px calc(70% + 12px)",
          backgroundSize: "170% auto, 170% auto",
          backgroundRepeat: "repeat-x",
          animation: "skyDeckDrift 120s linear infinite",
        }}
      />

      {/* The fly-through itself. */}
      {clouds.map((c, i) => (
        <Box
          key={`cloud-${i}`}
          className="bt-cloud"
          sx={{
            position: "absolute",
            inset: "-30%",
            backgroundImage: `${CLOUD_BODY[c.texture]}, ${CLOUD_SHADOW[c.texture]}`,
            backgroundPosition: `${c.posX}% ${c.posY}%, calc(${c.posX}% + 7px) calc(${c.posY}% + 13px)`,
            backgroundSize: `${TEXTURE_SIZE}px ${TEXTURE_SIZE}px, ${TEXTURE_SIZE}px ${TEXTURE_SIZE}px`,
            backgroundRepeat: "no-repeat",
            willChange: "transform, opacity",
            "--tx": `${c.tx}%`,
            "--ty": `${c.ty}%`,
            // Strings, not numbers — these are unitless and must not be given a px suffix.
            "--peak": `${c.peak}`,
            "--from-scale": `${round(c.scale * 0.32)}`,
            "--to-scale": `${round(c.scale * 2.9)}`,
            animation: `skyFlyThrough ${c.duration}s cubic-bezier(0.42, 0, 0.86, 0.62) ${c.delay}s infinite`,
          }}
        />
      ))}

      {/* Keeps the headline side readable no matter what drifts behind it. A
          faint wash carries across the whole width rather than fading to
          nothing, so clouds on the quiet side still sit inside the night sky
          instead of reading as a cutout pasted over it. */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(100deg, ${brand.navyDark}b8 0%, ${brand.navyDark}5c 40%, ${brand.navyDark}26 100%)`,
        }}
      />

      <style>{`
        @keyframes skyFlyThrough {
          0% {
            transform: translate3d(0, 0, 0) scale(var(--from-scale));
            opacity: 0;
          }
          22%, 62% { opacity: var(--peak); }
          100% {
            transform: translate3d(var(--tx), var(--ty), 0) scale(var(--to-scale));
            opacity: 0;
          }
        }
        @keyframes skyDeckDrift {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-35%, 0, 0); }
        }
        @keyframes skyAurora {
          from { transform: translate3d(-2%, -1%, 0) scale(1); }
          to   { transform: translate3d(3%, 2%, 0) scale(1.12); }
        }
        @keyframes skyTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.45); }
        }
        @keyframes skyPanFar {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(40px, 18px, 0); }
        }
        @keyframes skyPanMid {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(-62px, 26px, 0); }
        }
        @keyframes skyPanNear {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(88px, -34px, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bt-sky, .bt-sky * { animation: none !important; }
          /* Without this the clouds would freeze at their un-animated defaults —
             six opaque layers stacked into a white sheet. Park them mid-flight
             instead, so the hero is a still cloudscape. */
          .bt-sky .bt-cloud {
            opacity: 0.13 !important;
            transform: scale(1.5) !important;
          }
        }
      `}</style>
    </Box>
  );
}
