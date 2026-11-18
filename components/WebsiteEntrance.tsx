"use client";

import { useLayoutEffect, useRef, useState } from "react";
import "@/public/brand/shadow-intro/power-me.css";
import "@/public/brand/shadow-intro/entrance-layout.css";
import styles from "./WebsiteEntrance.module.css";

const mediaPath = "/brand/shadow-intro";
const entryKey = "bluetrendy:entered";
let enteredThisVisit = false;

function rememberEntry() {
  enteredThisVisit = true;
  try { sessionStorage.setItem(entryKey, "1"); } catch { /* Storage is optional. */ }
}

export default function WebsiteEntrance() {
  const dialog = useRef<HTMLDialogElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [time, setTime] = useState(0);

  useLayoutEffect(() => {
    if (location.hash === "#home-content") rememberEntry();
    if (location.hash || enteredThisVisit) return;
    try { if (sessionStorage.getItem(entryKey) === "1") return; } catch { /* Private browsing. */ }

    const gate = dialog.current;
    const video = player.current;
    if (!gate || !video) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let active = true;
    gate.showModal();
    video.poster = mediaPath + "/entrance-poster.jpg";
    video.src = mediaPath + "/entrance.mp4";
    if (!reduced.matches && !document.hidden) {
      void video.play().catch((error: DOMException) => {
        if (!active || !gate.open || document.hidden || reduced.matches || error.name !== "NotAllowedError") return;
        video.muted = true;
        void video.play().catch(() => { /* The play control remains available. */ });
      });
    }
    function pauseIfNeeded() {
      if (reduced.matches || document.hidden) video?.pause();
    }
    reduced.addEventListener("change", pauseIfNeeded);
    document.addEventListener("visibilitychange", pauseIfNeeded);
    return () => {
      active = false;
      reduced.removeEventListener("change", pauseIfNeeded);
      document.removeEventListener("visibilitychange", pauseIfNeeded);
      video.pause();
      gate.close();
    };
  }, []);

  function enter() {
    rememberEntry();
    player.current?.pause();
    dialog.current?.close();
    document.getElementById("home-content")?.focus({ preventScroll: true });
  }

  function togglePlayback() {
    const video = player.current;
    if (!video) return;
    if (!video.paused) { video.pause(); return; }
    if (video.ended) video.currentTime = 0;
    void video.play().catch(() => { if (video.error) setFailed(true); });
  }

  return (
    <dialog
      ref={dialog}
      data-website-entrance
      className={styles.entrance}
      aria-label="BlueTrendy Intelligence website entrance"
      onCancel={event => { event.preventDefault(); enter(); }}
    >
      <div className={styles.layout}>
        <div className="intro-stage">
          <div className="intro-stack">
            <div className="intro-picture" aria-hidden="true" data-lockup={failed || (!playing && (ended || time === 0))}>
              <video
                ref={player}
                width="1920" height="1080" preload="none" playsInline disablePictureInPicture
                onPlaying={() => { setPlaying(true); setEnded(false); }}
                onPause={() => setPlaying(false)}
                onEnded={() => { setPlaying(false); setEnded(true); }}
                onSeeked={event => { setEnded(event.currentTarget.ended); setTime(event.currentTarget.currentTime); }}
                onVolumeChange={event => setMuted(event.currentTarget.muted)}
                onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
                onError={() => setFailed(true)}
                hidden={failed}
              />
            </div>
            <button type="button" className="power-me" onClick={enter}>
              <span aria-hidden="true">⏻</span> POWER ME
            </button>
          </div>
        </div>
        {failed ? <p className={styles.notice} role="status">The intro could not play.</p> : (
          <div className={styles.controls} role="group" aria-label="Intro playback">
            <button type="button" onClick={togglePlayback}>{ended ? "Replay" : playing ? "Pause" : "Play"}</button>
            <input type="range" aria-label="Seek intro" aria-valuetext={`${time.toFixed(1)} of 8 seconds`}
              min={0} max={8} step={0.01} value={time}
              onChange={event => { if (player.current) player.current.currentTime = event.currentTarget.valueAsNumber; }}
            />
            <button type="button" aria-label={muted ? "Enable intro sound" : "Mute intro sound"}
              aria-pressed={!muted} onClick={() => { if (player.current) player.current.muted = !player.current.muted; }}>
              {muted ? "Sound off" : "Sound on"}
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
