"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import { usePanelTilt } from "./PanelMotion";
import styles from "../Hero.styles";

const brainPoster = "/brand/synaptic-brain.webp";
const brainDescription = "A rotating brain made of blue nerve fibres, with pulses of light travelling along branching connections";
function playBrain(video: HTMLVideoElement) {
  if (!video.hasAttribute("src")) {
    const extension = video.canPlayType('video/webm; codecs="vp9"') ? "webm" : "mp4";
    video.src = `/brand/synaptic-brain.${extension}`;
  }
  void video.play().catch(() => { /* The play button also works when autoplay is blocked. */ });
}

function BrainLoop() {
  const player = useRef<HTMLVideoElement>(null);
  const visible = useInView(player, { amount: 0.15 });
  const preference = useRef<"auto" | "play" | "pause">("auto");
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = player.current;
    if (!video || failed) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    function sync() {
      if (!video) return;
      const wantsPlay = preference.current === "play" ||
        (preference.current === "auto" && !reduced.matches && !connection?.saveData);
      if (visible && !document.hidden && wantsPlay) playBrain(video);
      else video.pause();
    }
    function changePreference() { preference.current = "auto"; sync(); }
    sync();
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", changePreference);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", changePreference);
      video.pause();
    };
  }, [visible, failed]);

  function toggle() {
    const video = player.current;
    if (!video) return;
    preference.current = video.paused ? "play" : "pause";
    if (video.paused) playBrain(video);
    else video.pause();
  }

  if (failed) return <Image className={styles.brain} src={brainPoster} alt={brainDescription}
    width={768} height={576} unoptimized />;

  return (
    <>
      <video ref={player} className={styles.brain} poster={brainPoster} width="768" height="576"
        aria-label={brainDescription}
        muted playsInline loop preload="none" disablePictureInPicture
        onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onError={() => setFailed(true)} />
      <button type="button" className={styles.playback} onClick={toggle}
        aria-label={playing ? "Pause brain animation" : "Play brain animation"}
        title={playing ? "Pause brain animation" : "Play brain animation"}>
        {playing ? <PauseRounded /> : <PlayArrowRounded />}
      </button>
    </>
  );
}

export default function HeroVisual() {
  const tilt = usePanelTilt(3);
  return <div className={styles.art} data-arrive="1" data-view="brain">
    <motion.div {...tilt} className={styles.screen}><BrainLoop /></motion.div>
  </div>;
}
