"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import GlobalStyles from "@mui/material/GlobalStyles";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { keyframes, type SxProps, type Theme } from "@mui/material/styles";
import PowerSettingsNewRounded from "@mui/icons-material/PowerSettingsNewRounded";
import { bindIntroTagline } from "@/lib/introTagline";
import SplitWords, { countWords } from "@/components/motion/SplitWords";
import { palette, withAlpha } from "@/theme/palette";

const compactMedia = "(max-width: 899px), (pointer: coarse) and (max-height: 560px)";
const compactFilm = "/brand/shadow-intro/entrance-mobile.mp4";
const desktopFilm = "/brand/shadow-intro/entrance.mp4";
const filmSeconds = 8;
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
    gate.querySelector("[data-enter]").addEventListener("click", () => {
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
  const [loaded, setLoaded] = useState(false);
  const [time, setTime] = useState(0);

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

    // The intro plays with sound. Browsers only allow that once the visitor has interacted with
    // the page, so when the film has to start muted, their first click, tap or key press turns
    // the sound on. The sound button and POWER ME handle their own presses.
    const gestures = ["pointerdown", "pointerup", "keydown"];
    function waitForGesture() {
      for (const type of gestures) document.addEventListener(type, unmuteOnGesture, true);
    }
    function stopWaitingForGesture() {
      for (const type of gestures) document.removeEventListener(type, unmuteOnGesture, true);
    }
    function unmuteOnGesture(event: Event) {
      const target = event.target instanceof Element ? event.target : null;
      if (!video!.muted || target?.closest("[data-sound-toggle], [data-enter]")) {
        stopWaitingForGesture();
        return;
      }
      // Not every event counts as a gesture (a lone Escape key, say); wait for one that does.
      const activation = (navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation;
      if (activation && !activation.isActive) return;
      stopWaitingForGesture();
      const wasPlaying = !video!.paused;
      video!.muted = false;
      if (wasPlaying && video!.paused) {
        // The browser refused sound after all: stay muted and try again on the next press.
        void video!.play().catch(() => {
          video!.muted = true;
          void video!.play().catch(() => { /* The play control remains available. */ });
          waitForGesture();
        });
      }
    }

    if (video.error) setFailed(true);
    else if (!reduced.matches && !savesData() && !document.hidden) {
      prepareFilm(video);
      void video.play().catch((error: DOMException) => {
        if (!active || !gate.open || document.hidden || reduced.matches || error.name !== "NotAllowedError") return;
        video.muted = true;
        void video.play().catch(() => { /* The play control remains available. */ });
        waitForGesture();
      });
    }
    function pauseIfNeeded() {
      if (reduced.matches || document.hidden) video?.pause();
    }
    reduced.addEventListener("change", pauseIfNeeded);
    document.addEventListener("visibilitychange", pauseIfNeeded);
    return () => {
      active = false;
      stopWaitingForGesture();
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

  function seek(value: number) {
    setTime(value);
    const video = player.current;
    if (video && video.readyState >= 1) video.currentTime = value;
    else pendingSeek.current = value;
  }

  return (
    <Box
      component="dialog"
      ref={dialog}
      data-website-entrance
      aria-label="BlueTrendy Intelligence website entrance"
      onCancel={event => { event.preventDefault(); enter(); }}
      sx={sx.entrance}
    >
      <GlobalStyles styles={{ "html:has(dialog[data-website-entrance][open])": { overflow: "hidden" } }} />
      <Box sx={sx.stage}>
        <Box aria-hidden sx={[sx.picture, failed && sx.lockup, { opacity: loaded || failed ? 1 : 0 }]}>
          <video
            ref={player}
            width="1920" height="1080" preload="none" playsInline disablePictureInPicture suppressHydrationWarning
            onLoadedMetadata={event => {
              if (pendingSeek.current === null) return;
              event.currentTarget.currentTime = pendingSeek.current;
              pendingSeek.current = null;
            }}
            onLoadedData={() => setLoaded(true)}
            onPlaying={() => { setLoaded(true); setPlaying(true); setEnded(false); }}
            onPause={() => setPlaying(false)}
            onEnded={() => { setPlaying(false); setEnded(true); }}
            onSeeked={event => { setEnded(event.currentTarget.ended); setTime(event.currentTarget.currentTime); }}
            onVolumeChange={event => setMuted(event.currentTarget.muted)}
            onTimeUpdate={event => setTime(event.currentTarget.currentTime)}
            onError={() => setFailed(true)}
          />
        </Box>
        <Button data-enter onClick={enter} startIcon={<PowerSettingsNewRounded />} sx={sx.powerMe}>
          POWER ME
        </Button>
        {/* Revealed under the button as the film finishes; it keeps its space so nothing moves. */}
        <Typography ref={tagline} component="p" data-state="wait" sx={sx.tagline}>
          <SplitWords text={taglineLead} />{" "}
          <strong style={{ "--split-delay": `${countWords(taglineLead) * 70 + 170}ms` } as CSSProperties}>AI</strong>
        </Typography>
        <script dangerouslySetInnerHTML={{ __html: prepareEntrance }} />
      </Box>
      {failed ? <Typography role="status" sx={sx.notice}>The intro could not play.</Typography> : (
        <Box role="group" aria-label="Intro playback" sx={sx.controls}>
          <Button onClick={togglePlayback}>{ended ? "Replay" : playing ? "Pause" : "Play"}</Button>
          <Slider
            size="small" aria-label="Seek intro" min={0} max={filmSeconds} step={0.01} value={time}
            getAriaValueText={value => `${value.toFixed(1)} of ${filmSeconds} seconds`}
            onChange={(_, value) => seek(value as number)}
            sx={{ color: palette.sky[175] }}
          />
          <Button data-sound-toggle aria-label={muted ? "Enable intro sound" : "Mute intro sound"} aria-pressed={!muted}
            onClick={() => { if (player.current) player.current.muted = !player.current.muted; }}>
            {muted ? "Sound off" : "Sound on"}
          </Button>
        </Box>
      )}
    </Box>
  );
}

const shortStage = "@container (height < 320px)";
const taglineLead = "Your Business, powered by";
// The home page's accent-write, with room around the small "AI" so the beam's glow fades out
// softly instead of being cut into a box.
const write = keyframes`from { clip-path: inset(-1em 100% -1em -1em); } to { clip-path: inset(-1em -.4em -1em -1em); }`;
// A glint of light crossing "AI" once the beam has written it.
const glint = keyframes`from { background-position: 100% 50%; } to { background-position: 0% 50%; }`;

const sx = {
  // A full-screen modal. Before hydration, the home page marks its shell [data-entry-pending]
  // so the closed dialog already covers the page on first paint.
  entrance: {
    position: "fixed",
    inset: 0,
    width: "100%",
    height: "100dvh",
    maxWidth: "none",
    maxHeight: "none",
    m: 0,
    p: 0,
    border: 0,
    overflow: "hidden",
    gridTemplateRows: "minmax(0, 1fr) auto",
    bgcolor: palette.navy[850],
    color: palette.slate[50],
    colorScheme: "dark",
    "&[open]": { display: "grid" },
    "[data-entry-pending] > &": { display: "grid", zIndex: 1400 },
    "&::backdrop": { background: palette.navy[850] },
  },
  stage: {
    containerType: "size",
    minHeight: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  // Frames the film through the INTELLIGENCE wordmark; the tagline below is live text.
  picture: {
    position: "relative",
    flexShrink: 0,
    width: "min(169cqw, 1140px, calc(320cqh - 334px))",
    aspectRatio: "1920 / 600",
    overflow: "hidden",
    pointerEvents: "none",
    maskImage: "linear-gradient(transparent, black 5%, black 98%, transparent), linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
    maskComposite: "intersect",
    transition: "opacity 0.6s ease",
    "& video": { position: "absolute", top: "-31.6667%", left: 0, display: "block", width: "100%", height: "auto", aspectRatio: "16 / 9" },
  },
  // Shown instead of the film when it cannot play.
  lockup: {
    maskImage: "none",
    background: "url(/brand/logo-inverse.svg) center / min(100%, 77cqw, 480px, 138cqh) auto no-repeat",
    "& video": { display: "none" },
  },
  tagline: {
    mt: "clamp(12px, 2.2cqh, 20px)",
    color: palette.slate[150],
    fontSize: "clamp(16px, 2.5cqw, 22px)",
    fontWeight: 440,
    lineHeight: 1.4,
    letterSpacing: "-.03em",
    textAlign: "center",
    whiteSpace: "nowrap",
    perspective: "900px",
    "& .w, & strong": { display: "inline-block" },
    "& .w": { transformOrigin: "50% 100%", backfaceVisibility: "hidden" },
    "& strong": {
      position: "relative",
      color: palette.sky[175],
      fontWeight: 750,
      background: `linear-gradient(108deg, ${palette.sky[175]} 30%, ${palette.white} 50%, ${palette.sky[175]} 70%) 100% 50% / 320% 100%`,
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    "& ::selection": { color: palette.white, background: palette.blue[550], WebkitTextFillColor: "white" },
    // Arrives like the home page headlines (word-in and accent-beam live in globalStyles):
    // the words flip up out of a blur, then a beam of light writes "AI".
    "&[data-state='wait'] :is(.w, strong)": { opacity: 0 },
    "&[data-state='in'] .w": {
      animation: "word-in .85s var(--ease-out) both",
      animationDelay: "calc(var(--i) * 70ms + 60ms)",
    },
    "&[data-state='in'] strong": {
      animation: `${write} .95s cubic-bezier(.65, 0, .35, 1) var(--split-delay) backwards, ${glint} 1.3s ease-in-out calc(var(--split-delay) + .8s) both`,
    },
    "&[data-state='in'] strong::after": {
      content: '""',
      position: "absolute",
      top: "10%",
      bottom: "14%",
      width: "3px",
      ml: "-3px",
      borderRadius: "3px",
      background: palette.cyan[25],
      boxShadow: `0 0 6px 1px ${palette.sky[150]}, 0 0 14px 3px ${palette.blue[350]}`,
      opacity: 0,
      pointerEvents: "none",
      animation: "accent-beam .95s cubic-bezier(.65, 0, .35, 1) var(--split-delay) both",
    },
    "@media (prefers-reduced-motion: reduce)": {
      "& .w, & strong": { animation: "none !important", opacity: "1 !important" },
      "& strong::after": { display: "none" },
    },
    [shortStage]: { mt: "6px", fontSize: 15 },
    "@media (forced-colors: active)": { "& strong": { WebkitTextFillColor: "currentColor" } },
  },
  powerMe: {
    mt: "clamp(15px, 2.7cqh, 25px)",
    minWidth: 152,
    minHeight: 46,
    px: "22px",
    py: 0,
    border: `1px solid ${palette.cyan[75]}`,
    background: `linear-gradient(125deg, ${palette.slate[75]}, ${palette.sky[175]} 68%, ${palette.blue[250]})`,
    boxShadow: `0 4px 20px ${withAlpha(palette.blue[475], 0.14)}`,
    color: palette.navy[800],
    fontSize: 12,
    fontWeight: 720,
    letterSpacing: ".13em",
    lineHeight: 1,
    whiteSpace: "nowrap",
    "&:hover": { background: palette.slate[75] },
    "&.Mui-focusVisible": { outline: `2px solid ${palette.white}`, outlineOffset: 4 },
    [shortStage]: { mt: "9px", minHeight: 40 },
  },
  controls: {
    display: "flex",
    alignItems: "center",
    justifySelf: "center",
    gap: "14px",
    width: "min(340px, calc(100% - 32px))",
    pb: "max(8px, env(safe-area-inset-bottom))",
    "& .MuiButton-root": { minWidth: 66, px: 0.5, color: palette.slate[125], fontSize: 12, fontWeight: 400 },
    "& .MuiButton-root:hover": { color: palette.white, bgcolor: "transparent" },
    "@media (max-height: 360px)": { pb: 0 },
  },
  notice: { my: 1, mx: "auto", color: palette.slate[125], fontSize: 13 },
} satisfies Record<string, SxProps<Theme>>;
