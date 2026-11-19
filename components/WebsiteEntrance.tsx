"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { bindIntroTagline } from "@/lib/introTagline";
import styles from "./WebsiteEntrance.styles";

const mediaPath = "/brand/shadow-intro";
const compactMedia = "(max-width: 899px), (pointer: coarse) and (max-height: 560px)";
const compactFilm = mediaPath + "/entrance-mobile.mp4";
const desktopFilm = mediaPath + "/entrance.mp4";
const entryKey = "bluetrendy:entered";
let enteredThisVisit = false;

// Start buffering on the eventual player while React loads. Opening the dialog
// and starting playback remain under the hydrated controls.
const prepareEntrance = `{
  const gate = document.currentScript.closest("dialog");
  const shell = gate.closest("[data-entry-pending]");
  if (shell) {
    const video = gate.querySelector("video");
    if (!document.hidden && !navigator.connection?.saveData && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.preload = "auto";
      video.src = matchMedia(${JSON.stringify(compactMedia)}).matches
        ? ${JSON.stringify(compactFilm)} : ${JSON.stringify(desktopFilm)};
    }
    gate.querySelector(".power-me").addEventListener("click", () => {
      if (gate.open || !shell.hasAttribute("data-entry-pending")) return;
      shell.removeAttribute("data-entry-pending");
      if (video.hasAttribute("src")) { video.removeAttribute("src"); video.load(); }
      try { sessionStorage.setItem(${JSON.stringify(entryKey)}, "1"); } catch {}
      location.hash = "home-content";
      document.getElementById("home-content")?.focus({ preventScroll: true });
    }, { once: true });
  }
}`;

function savesData() {
  return (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
}

function prepareFilm(video: HTMLVideoElement) {
  if (video.hasAttribute("src")) return;
  video.src = savesData() || matchMedia(compactMedia).matches ? compactFilm : desktopFilm;
}

function rememberEntry() {
  enteredThisVisit = true;
  try { sessionStorage.setItem(entryKey, "1"); } catch { /* Storage is optional. */ }
}

export default function WebsiteEntrance() {
  const dialog = useRef<HTMLDialogElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const tagline = useRef<HTMLParagraphElement>(null);
  const pendingSeek = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [time, setTime] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    const shell = dialog.current?.closest<HTMLElement>("[data-studio-home]");
    if (location.hash === "#home-content") rememberEntry();
    try { enteredThisVisit ||= sessionStorage.getItem(entryKey) === "1"; } catch { /* Private browsing. */ }
    if (location.hash || enteredThisVisit) {
      shell?.removeAttribute("data-entry-pending");
      return;
    }

    const gate = dialog.current;
    const video = player.current;
    if (!gate || !video) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let active = true;
    gate.showModal();
    shell?.removeAttribute("data-entry-pending");
    const unbindTagline = tagline.current ? bindIntroTagline(video, tagline.current) : null;
    if (video.error) setFailed(true);
    else if (!reduced.matches && !savesData() && !document.hidden) {
      prepareFilm(video);
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
      unbindTagline?.();
      reduced.removeEventListener("change", pauseIfNeeded);
      document.removeEventListener("visibilitychange", pauseIfNeeded);
      video.pause();
      gate.close();
    };
  }, []);

  function enter() {
    rememberEntry();
    const video = player.current;
    if (video) {
      video.pause();
      if (video.hasAttribute("src")) {
        video.removeAttribute("src");
        video.load();
      }
    }
    dialog.current?.close();
    document.getElementById("home-content")?.focus({ preventScroll: true });
  }

  function togglePlayback() {
    const video = player.current;
    if (!video) return;
    if (!video.paused) { video.pause(); return; }
    prepareFilm(video);
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
            <div className="intro-picture" aria-hidden="true" data-lockup={failed}
              style={{ opacity: loaded || failed ? 1 : 0, transition: "opacity 0.6s ease" }}>
              <video
                ref={player}
                width="1920" height="1080" preload="none" playsInline disablePictureInPicture suppressHydrationWarning
                onLoadedMetadata={event => {
                  if (pendingSeek.current !== null) {
                    event.currentTarget.currentTime = pendingSeek.current;
                    pendingSeek.current = null;
                  }
                }}
                onLoadedData={() => setLoaded(true)}
                onPlaying={() => { setLoaded(true); setPlaying(true); setEnded(false); }}
                onPause={() => setPlaying(false)}
                onEnded={() => { setPlaying(false); setEnded(true); }}
                onSeeked={event => { setEnded(event.currentTarget.ended); setTime(event.currentTarget.currentTime); }}
                onVolumeChange={event => setMuted(event.currentTarget.muted)}
                onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
                onError={() => setFailed(true)}
                hidden={failed}
              />
            </div>
            <p className="intro-tagline" ref={tagline}><span>Your Business, powered by</span>{" "}<strong>AI</strong></p>
            <button type="button" className="power-me" onClick={enter}>
              <span aria-hidden="true">⏻</span> POWER ME
            </button>
            <script dangerouslySetInnerHTML={{ __html: prepareEntrance }} />
          </div>
        </div>
        {failed ? <p className={styles.notice} role="status">The intro could not play.</p> : (
          <div className={styles.controls} role="group" aria-label="Intro playback">
            <button type="button" onClick={togglePlayback}>{ended ? "Replay" : playing ? "Pause" : "Play"}</button>
            <input type="range" aria-label="Seek intro" aria-valuetext={`${time.toFixed(1)} of 8 seconds`}
              min={0} max={8} step={0.01} value={time}
              onChange={event => {
                const value = event.currentTarget.valueAsNumber;
                setTime(value);
                if (player.current && player.current.readyState >= 1) player.current.currentTime = value;
                else pendingSeek.current = value;
              }}
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
