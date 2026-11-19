"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { useLumaKey, useNeedsLumaKey } from "@/components/motion/useLumaKey";import { palette, withAlpha } from "@/theme/palette";


const source = "/brand/3d-bluetrendy.mp4";
const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * The 3D BlueTrendy logo film. It stays hidden until its first frame is ready, then
 * fades in with one gentle settle: no stand-in poster, no blur and no colour change on
 * the way in. It loops while on screen and pauses when not. In the banner it has no
 * frame: the film's dark studio backdrop is screened away and its edges dissolve.
 * Reduced motion and Save-Data show the film's first frame, still.
 */
export default function RibbonFilm() {
  const player = useRef<HTMLVideoElement>(null);
  const keyed = useRef<HTMLCanvasElement>(null);
  const needsKey = useNeedsLumaKey();
  useLumaKey(player, keyed, needsKey);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = player.current;
    if (!video) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let visible = false;
    function sync() {
      if (!video || !visible) { video?.pause(); return; }
      if (!video.hasAttribute("src")) video.src = source;
      // A still first frame for reduced motion or Save-Data; otherwise play while on screen.
      if (document.hidden || reduced.matches || connection?.saveData) {
        video.pause();
        return;
      }
      void video.play().catch(() => { /* Autoplay blocked: the first frame stays. */ });
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.15 });
    observer.observe(video);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, []);

  return <Box sx={{ position: "relative", flexShrink: 0, maxWidth: "100%", justifySelf: "center",
    width: { xs: "100%", sm: "min(100%, 520px)", md: "clamp(480px, 40vw, 700px)" },
    // The film reaches a little past its column toward the page margin.
    marginRight: { md: "clamp(-120px, -5vw, -32px)" } }}>
    <Box component="video" ref={player} muted loop playsInline disablePictureInPicture preload="metadata" width={1178} height={786}
      aria-label="The BlueTrendy logo in blue glass and brushed steel, turning on its plinth"
      onLoadedData={() => setReady(true)}
      sx={{ display: "block", width: "100%", height: "auto", aspectRatio: "3 / 2", objectFit: "cover",
        // Crop the empty studio margin so the B itself is larger.
        transformOrigin: "50% 58%",
        maskImage: `radial-gradient(closest-side at 50% 48%, ${palette.black} 52%, ${withAlpha(palette.black, 0.5)} 78%, transparent 100%), linear-gradient(180deg, ${palette.black} 70%, transparent 97%)`,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
        mixBlendMode: "screen",
        filter: "saturate(1.12) contrast(1.06)",
        // One settle once the first frame is in: fade up while easing into place.
        // On Safari the keyed canvas above shows the film; the video only supplies its frames.
        opacity: needsKey ? 0.01 : ready ? 1 : 0,
        scale: ready ? "1.1" : "1.04",
        transition: `opacity 1.2s ${ease}, scale 1.6s ${ease}`,
        "@media (prefers-reduced-motion: reduce)": { scale: "1.1", transition: "opacity 0.6s ease" } }} />
    {needsKey && <Box component="canvas" ref={keyed} width={1178} height={786} aria-hidden="true"
      sx={{ position: "absolute", top: 0, left: 0, width: "100%", aspectRatio: "3 / 2", objectFit: "cover", transformOrigin: "50% 58%",
        maskImage: `radial-gradient(closest-side at 50% 48%, ${palette.black} 52%, ${withAlpha(palette.black, 0.5)} 78%, transparent 100%), linear-gradient(180deg, ${palette.black} 70%, transparent 97%)`,
        WebkitMaskImage: `radial-gradient(closest-side at 50% 48%, ${palette.black} 52%, ${withAlpha(palette.black, 0.5)} 78%, transparent 100%), linear-gradient(180deg, ${palette.black} 70%, transparent 97%)`,
        maskComposite: "intersect", WebkitMaskComposite: "source-in",
        opacity: ready ? 1 : 0, scale: ready ? "1.1" : "1.04", transition: `opacity 1.2s ${ease}, scale 1.6s ${ease}` }} />}
  </Box>;
}
