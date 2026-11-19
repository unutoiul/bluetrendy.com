"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";

const key = "bluetrendy:ribbon-playback";
const source = "/brand/blue-ribbon-turntable.mp4";
let progress = { seconds: 0, finished: false, paused: false };

function remember() {
  try { sessionStorage.setItem(key, JSON.stringify(progress)); } catch { /* In-memory playback still works. */ }
}

export default function RibbonFilm({ compact = false }: { compact?: boolean }) {
  const player = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = player.current;
    if (!video) return;
    try {
      const saved = JSON.parse(sessionStorage.getItem(key) ?? "null");
      if (saved && Number.isFinite(saved.seconds) && saved.seconds >= 0)
        progress = { seconds: saved.seconds, finished: saved.finished === true, paused: saved.paused === true };
    } catch { /* Storage is optional. */ }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let visible = false;
    function savePosition() {
      if (video && video.currentTime > 0 && !progress.finished) {
        progress.seconds = video.currentTime;
        remember();
      }
    }
    function sync() {
      if (!video) return;
      setFinished(progress.finished);
      if (progress.finished || progress.paused || !visible || document.hidden || reduced.matches || connection?.saveData) {
        video.pause();
        savePosition();
      } else {
        if (!video.hasAttribute("src")) video.src = source;
        void video.play().catch(() => {});
      }
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .15 });
    observer.observe(video);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("pagehide", savePosition);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      window.removeEventListener("pagehide", savePosition);
      savePosition();
      video.pause();
    };
  }, []);

  function toggle() {
    const video = player.current;
    if (!video || progress.finished) return;
    progress.paused = !video.paused;
    remember();
    if (progress.paused) video.pause();
    else {
      if (!video.hasAttribute("src")) video.src = source;
      void video.play().catch(() => {});
    }
  }
  return <Box sx={{ position: "relative", width: compact ? { xs: 98, sm: 152 } : { xs: 155, sm: 238, md: 310 },
    maxWidth: "100%", justifySelf: "center", marginInline: { xs: 0, md: "auto" }, flexShrink: 0 }}>
    <Box component="video" ref={player} muted playsInline disablePictureInPicture preload="none" width={1080} height={720}
      poster="/brand/blue-ribbon-studio.webp" aria-label="BlueTrendy ribbon logo film"
      onLoadedMetadata={event => {
        const video = event.currentTarget;
        if (progress.seconds > 0 && progress.seconds < video.duration) video.currentTime = progress.seconds;
      }}
      onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}
      onEnded={() => { progress.finished = true; remember(); setFinished(true); setPlaying(false); }}
      sx={{ display: "block", width: "100%", height: "auto", aspectRatio: "3 / 2", borderRadius: compact ? 1.5 : 2,
        maskImage: compact ? undefined : "radial-gradient(ellipse 68% 75% at 50% 50%, black 40%, transparent 94%)" }} />
    {!finished && !failed && <Box component="button" type="button" onClick={toggle}
      aria-label={playing ? "Pause ribbon film" : "Play ribbon film"}
      sx={{ position: "absolute", right: 0, bottom: 0, display: "grid", placeItems: "center", border: 0,
        width: 34, height: 34, borderRadius: "50%", bgcolor: "#0b263c", color: "white", cursor: "pointer", "& svg": { fontSize: 18 } }}>
      {playing ? <PauseRounded /> : <PlayArrowRounded />}
    </Box>}
  </Box>;
}

