"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";

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
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const paused = useRef(false);

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
      if (paused.current || document.hidden || reduced.matches || connection?.saveData) {
        video.pause();
        return;
      }
      void video.play().catch(() => { /* The play button works when autoplay is blocked. */ });
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

  function toggle() {
    const video = player.current;
    if (!video) return;
    paused.current = !video.paused;
    if (paused.current) video.pause();
    else void video.play().catch(() => {});
  }

  return <Box sx={{ position: "relative", flexShrink: 0, maxWidth: "100%", justifySelf: "center",
    width: { xs: "100%", sm: "min(100%, 520px)", md: "clamp(480px, 40vw, 700px)" },
    // The film reaches a little past its column toward the page margin.
    marginRight: { md: "clamp(-120px, -5vw, -32px)" } }}>
    <Box component="video" ref={player} muted loop playsInline disablePictureInPicture preload="metadata" width={1178} height={786}
      aria-label="The BlueTrendy logo in blue glass and brushed steel, turning on its plinth"
      onLoadedData={() => setReady(true)}
      onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}
      sx={{ display: "block", width: "100%", height: "auto", aspectRatio: "3 / 2", objectFit: "cover",
        // Crop the empty studio margin so the B itself is larger.
        transformOrigin: "50% 58%",
        maskImage: "radial-gradient(ellipse 58% 56% at 50% 52%, #000 58%, rgba(0, 0, 0, 0.55) 78%, transparent 100%)",
        mixBlendMode: "screen",
        filter: "saturate(1.12) contrast(1.06)",
        // One settle once the first frame is in: fade up while easing into place.
        opacity: ready ? 1 : 0,
        scale: ready ? "1.1" : "1.04",
        transition: `opacity 1.2s ${ease}, scale 1.6s ${ease}`,
        "@media (prefers-reduced-motion: reduce)": { scale: "1.1", transition: "opacity 0.6s ease" } }} />
    {!failed && ready && <Box component="button" type="button" onClick={toggle}
      aria-label={playing ? "Pause logo film" : "Play logo film"}
      sx={{ position: "absolute", right: "20%", bottom: "16%", zIndex: 1, display: "grid", placeItems: "center",
        width: 44, height: 44, borderRadius: "50%", cursor: "pointer", color: "#e4f6ff",
        border: "1px solid rgba(111, 220, 255, 0.4)", background: "rgba(6, 22, 43, 0.72)", backdropFilter: "blur(6px)",
        transition: "border-color .25s ease, box-shadow .3s ease",
        "&:hover": { borderColor: "#7fe3ff", boxShadow: "0 0 16px rgba(40, 170, 255, 0.55)" },
        "&:focus-visible": { outline: "2px solid #a8ecff", outlineOffset: 3 },
        "& svg": { fontSize: 20 } }}>
      {playing ? <PauseRounded /> : <PlayArrowRounded />}
    </Box>}
  </Box>;
}
