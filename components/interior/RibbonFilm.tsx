"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { keyframes } from "@mui/material/styles";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.94); filter: blur(10px); }
  to { opacity: 1; transform: none; filter: none; }
`;
const fadeInStill = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const source = "/brand/3d-bluetrendy.mp4";
const poster = "/brand/blue-ribbon-studio.webp";

/**
 * The 3D BlueTrendy logo film. It loops while it is on screen and pauses when it is
 * not. In the banner it has no frame: the film's dark studio backdrop is screened away
 * and its edges dissolve, so the logo stands in the banner's own light. Reduced motion
 * and Save-Data show the still poster instead.
 */
export default function RibbonFilm({ compact = false }: { compact?: boolean }) {
  const player = useRef<HTMLVideoElement>(null);
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
      if (!video) return;
      if (paused.current || !visible || document.hidden || reduced.matches || connection?.saveData) {
        video.pause();
        return;
      }
      if (!video.hasAttribute("src")) video.src = source;
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
    else {
      if (!video.hasAttribute("src")) video.src = source;
      void video.play().catch(() => {});
    }
  }

  return <Box sx={{ position: "relative", flexShrink: 0, maxWidth: "100%", justifySelf: "center",
    width: compact ? { xs: 120, sm: 180 } : { xs: "min(100%, 420px)", md: "clamp(460px, 40vw, 660px)" },
    // In the banner the film reaches past its column toward the edge of the page.
    marginRight: compact ? 0 : { md: "clamp(-120px, -6vw, -40px)" } }}>
    <Box component="video" ref={player} muted loop playsInline disablePictureInPicture preload="none" width={1178} height={786}
      poster={poster} aria-label="The BlueTrendy logo in blue glass and brushed steel, turning on its plinth"
      onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}
      sx={[{ display: "block", width: "100%", height: "auto", aspectRatio: "3 / 2", objectFit: "cover" },
        compact
          ? { borderRadius: 1.5 }
          : {
              maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000 48%, rgba(0, 0, 0, 0.55) 72%, transparent 100%)",
              mixBlendMode: "screen",
              filter: "saturate(1.12) contrast(1.06)",
              animation: `${fadeIn} 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both`,
              "@media (prefers-reduced-motion: reduce)": { animationName: `${fadeInStill}`, animationDuration: "0.6s" },
            }]} />
    {!failed && <Box component="button" type="button" onClick={toggle}
      aria-label={playing ? "Pause logo film" : "Play logo film"}
      sx={{ position: "absolute", right: compact ? 0 : "14%", bottom: compact ? 0 : "12%", display: "grid", placeItems: "center",
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
