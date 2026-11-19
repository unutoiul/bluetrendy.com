"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { usePanelTilt } from "./PanelMotion";
import { useLumaKey, useNeedsLumaKey } from "@/components/motion/useLumaKey";
import styles from "../Hero.styles";

const brainPoster = "/brand/synaptic-brain.webp";
const brainDescription = "A rotating brain made of blue nerve fibres, with pulses of light travelling along branching connections";
function playBrain(video: HTMLVideoElement) {
  if (!video.hasAttribute("src")) {
    // The WebM has a transparent background. Safari (and every iOS browser) plays WebM but
    // drops the transparency, so it gets the MP4, whose black background the hero's
    // screen blend removes.
    const keepsAlpha = !navigator.vendor.startsWith("Apple") && video.canPlayType('video/webm; codecs="vp9"');
    const extension = keepsAlpha ? "webm" : "mp4";
    video.src = `/brand/synaptic-brain.${extension}`;
  }
  void video.play().catch(() => { /* Autoplay blocked: the still frame stays. */ });
}

function BrainLoop() {
  const player = useRef<HTMLVideoElement>(null);
  const keyed = useRef<HTMLCanvasElement>(null);
  const needsKey = useNeedsLumaKey();
  useLumaKey(player, keyed, needsKey);
  const visible = useInView(player, { amount: 0.15 });
  const [failed, setFailed] = useState(false);

  // Plays while on screen; reduced motion and Save-Data keep it still.
  useEffect(() => {
    const video = player.current;
    if (!video || failed) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    function sync() {
      if (!video) return;
      if (visible && !document.hidden && !reduced.matches && !connection?.saveData) playBrain(video);
      else video.pause();
    }
    sync();
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      video.pause();
    };
  }, [visible, failed]);

  if (failed) return <Image className={styles.brain} src={brainPoster} alt={brainDescription}
    width={768} height={576} unoptimized />;

  return (
    <>
      {/* On Safari the keyed canvas shows the film; the video underneath only supplies its frames. */}
      <video ref={player} className={styles.brain} poster={brainPoster} width="768" height="576"
        style={needsKey ? { opacity: 0.01 } : undefined}
        aria-label={brainDescription}
        muted playsInline loop preload="none" disablePictureInPicture
        onError={() => setFailed(true)} />
      {needsKey && <canvas ref={keyed} className={styles.brain} width={768} height={576} aria-hidden="true" />}
    </>
  );
}

export default function HeroVisual() {
  const tilt = usePanelTilt(3);
  return <div className={styles.art} data-arrive="1" data-view="brain">
    <motion.div {...tilt} className={styles.screen}><BrainLoop /></motion.div>
  </div>;
}
