"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import ContentCopyRounded from "@mui/icons-material/ContentCopyRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import { motion, useReducedMotion } from "motion/react";
import { trackEvent } from "@/lib/analytics";
import styles from "./Showcase.styles";

export default function ContactChapter() {
  const player = useRef<HTMLVideoElement>(null);
  const address = "contact@bluetrendy.com";
  const reduced = useReducedMotion();
  const resetCopy = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [copyStatus, setCopyStatus] = useState("");
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => () => clearTimeout(resetCopy.current), []);
  async function copyAddress() {
    clearTimeout(resetCopy.current);
    try {
      await navigator.clipboard.writeText(address);
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Select the address to copy it.");
    }
    resetCopy.current = setTimeout(() => setCopyStatus(""), 3500);
  }
  function toggle() {
    const el = player.current;
    if (!el) return;
    if (!el.paused) { el.pause(); return; }
    if (!el.hasAttribute("src")) el.src = "/brand/blue-ribbon-turntable.mp4";
    void el.play().catch(() => { if (el.error) setError(true); });
  }
  return (
    <>
      <Box className={styles.contactPanel} data-arrive="0">
        <Box className={styles.contactCopy}>
          <Typography component="h2">Bring your first use case.</Typography>
          <Typography component="p">In a free 30-minute discovery call, we’ll map the people, systems, and first release your project needs.</Typography>
          <Box className={styles.contactActions}>
            <Button component={Link} href="/book-a-call" prefetch={false} variant="contained" className={styles.primary} endIcon={<ArrowOutwardRounded />}
              onClick={() => trackEvent("cta_book_call_click", { location: "experience_contact" })}>Book a call</Button>
            <Button component={Link} href="/contact" prefetch={false} variant="outlined" className={styles.secondary}>Send a brief</Button>
          </Box>
        </Box>
        <Box className={styles.film}>
          <video ref={player} width="1080" height="720" playsInline muted preload="none"
            aria-label="BlueTrendy’s rotating glass and titanium logo" onPlaying={() => { setStarted(true); setPlaying(true); }}
            onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setError(true)} />
          {(!started || error) && <Image src="/brand/blue-ribbon-studio.webp" alt="" fill sizes="(max-width: 680px) 90vw, 420px"
            loading="lazy" className={styles.poster} />}
          {!error && <Button size="small" onClick={toggle} className={styles.studioControl}
            startIcon={playing ? <PauseRounded /> : <PlayArrowRounded />}>{playing ? "Pause studio film" : started ? "Play studio film" : "Watch studio film"}</Button>}
          {error && <span role="status" className={styles.filmMessage}>Studio film unavailable</span>}
        </Box>
      </Box>
      <div className={styles.contactLinks}>
        <Link href="/pricing" prefetch={false}>Engagement &amp; pricing</Link>
        <Link href="/about" prefetch={false}>Meet the studio</Link>
        <a href="#ai-lab">Plan a project in the Idea Lab</a>
        <span className={styles.email}><a href={"mailto:" + address}>{address}</a>
          <motion.button type="button" aria-label="Copy email address" onClick={copyAddress}
            whileTap={reduced ? undefined : { scale: .92 }}>
            {copyStatus === "Copied" ? <CheckRounded /> : <ContentCopyRounded />}
          </motion.button><span role="status">{copyStatus}</span>
        </span>
      </div>
    </>
  );
}
