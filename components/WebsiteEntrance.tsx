"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import GlobalStyles from "@mui/material/GlobalStyles";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { keyframes, type SxProps, type Theme } from "@mui/material/styles";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import AutoModeRounded from "@mui/icons-material/AutoModeRounded";
import BoltRounded from "@mui/icons-material/BoltRounded";
import { bindIntroTagline } from "@/lib/introTagline";
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
  const tagline = useRef<HTMLDivElement>(null);
  const pendingSeek = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  // The browser refused to start the film with sound, so it is playing silently for now.
  const [soundBlocked, setSoundBlocked] = useState(false);
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


    if (video.error) setFailed(true);
    else if (!reduced.matches && !savesData() && !document.hidden) {
      prepareFilm(video);
      void video.play().catch((error: DOMException) => {
        if (!active || !gate.open || document.hidden || reduced.matches || error.name !== "NotAllowedError") return;
        // Browsers only allow sound once the visitor has pressed something on the page. Until then
        // the film plays silently, and their first tap starts it again from the top with sound.
        video.muted = true;
        setSoundBlocked(true);
        void video.play().catch(() => { /* Even silent autoplay is off; the first tap starts it. */ });
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

  // The beam slows down over "AI", so it needs to know where "AI" sits in the line.
  useLayoutEffect(() => {
    const line = tagline.current?.querySelector<HTMLElement>(".accent");
    const word = line?.querySelector<HTMLElement>(".ai");
    if (!line || !word) return;
    function measure() {
      const width = line!.offsetWidth;
      if (!width) return;
      line!.style.setProperty("--ai-from", `${(word!.offsetLeft / width) * 100}%`);
      line!.style.setProperty("--ai-to", `${((word!.offsetLeft + word!.offsetWidth) / width) * 100}%`);
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(line);
    return () => observer.disconnect();
  }, []);

  // While the film is silent, the visitor's first click, tap or key press anywhere starts it
  // again with sound. the enter button and the sound buttons handle their own presses.
  useEffect(() => {
    if (!soundBlocked) return;
    const gestures = ["pointerdown", "pointerup", "keydown"];
    function onGesture(event: Event) {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("[data-sound-toggle], [data-enter]")) return;
      // Not every event counts as a gesture (a lone Escape key, say); wait for one that does.
      const activation = (navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation;
      if (activation && !activation.isActive) return;
      playWithSound();
    }
    for (const type of gestures) document.addEventListener(type, onGesture, true);
    return () => { for (const type of gestures) document.removeEventListener(type, onGesture, true); };
  }, [soundBlocked]);

  /** Plays the intro from the beginning with sound, so nobody hears only its second half. */
  function playWithSound() {
    const video = player.current;
    if (!video) return;
    setSoundBlocked(false);
    video.muted = false;
    // A finished film stays on its last frame; the Replay button plays it again, now with sound.
    if (video.ended) return;
    prepareFilm(video);
    video.currentTime = 0;
    void video.play().catch(() => {
      // The browser still refused sound: keep the film going silently and wait for the next press.
      video.muted = true;
      setSoundBlocked(true);
      void video.play().catch(() => { /* The play control remains available. */ });
    });
  }

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
        <Button data-enter onClick={enter} endIcon={<ArrowForwardRounded />} sx={sx.powerMe}>
          Enter the website
        </Button>
        {/* Plays in under the button once the logo has settled; it keeps its space so nothing moves. */}
        <Box ref={tagline} data-intro-message data-state="wait" sx={sx.message}>
          <Box component="h2" sx={sx.claim}>
            <span className="accent" style={{ "--split-delay": `${claimDelay}ms` } as CSSProperties}>
              {claimBefore}<span className="ai">AI</span>{claimAfter}
            </span>
          </Box>
          <Box component="ul" aria-label="What it means for you" sx={sx.outcomes}
            style={{ "--outcomes-delay": `${outcomesDelay}ms` } as CSSProperties}>
            {outcomes.map(({ label, Icon }, index) => (
              <li key={label} className="outcome" style={{ "--i": index } as CSSProperties}>
                <Icon aria-hidden="true" />{label}
              </li>
            ))}
          </Box>
        </Box>
        <script dangerouslySetInnerHTML={{ __html: prepareEntrance }} />
        {soundBlocked && (
          <Button data-sound-toggle onClick={playWithSound} startIcon={<VolumeUpRounded />} sx={sx.soundPrompt}>
            Tap for sound
          </Button>
        )}
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
            onClick={() => {
              if (soundBlocked) playWithSound();
              else if (player.current) player.current.muted = !player.current.muted;
            }}>
            {muted ? "Sound off" : "Sound on"}
          </Button>
        </Box>
      )}
    </Box>
  );
}

const shortStage = "@container (height < 320px)";
// A slow glow that draws the eye to "Tap for sound" without flashing.
const soundPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 ${withAlpha(palette.sky[175], 0)}; }
  50% { box-shadow: 0 0 0 6px ${withAlpha(palette.sky[175], 0.18)}; }
`;
// The message: one claim, then what it means for the visitor's business.
const claimBefore = "We make ";
const claimAfter = " work for your business.";
const outcomes = [
  { label: "More customers", Icon: GroupsRounded },
  { label: "Less manual work", Icon: AutoModeRounded },
  { label: "Faster results", Icon: BoltRounded },
];
// One sequence, in milliseconds from the cue: the beam writes the claim, the outcomes switch
// on left to right, and the enter button glows once to say "ready".
const claimDelay = 250;
// The beam starts slowly and lingers over the opening words, then races to the end of the line.
const claimWriteMs = 3400;
const claimWrite = `${claimWriteMs}ms linear`;
const outcomesDelay = claimDelay + claimWriteMs;
const outcomeStagger = 180;
const readyDelay = outcomesDelay + outcomes.length * outcomeStagger + 500;
// The home page's accent-write, with room around the line so the beam's glow fades out
// softly instead of being cut into a box.
// It moves in three speeds: quickly to "AI", very slowly across "AI", then quickly to the end.
// --ai-from and --ai-to mark where "AI" sits in the line, measured in the browser.
const write = keyframes`
  0% { clip-path: inset(-1em 100% -1em -1em); animation-timing-function: cubic-bezier(.3, .6, .6, 1); }
  18% { clip-path: inset(-1em calc(100% - var(--ai-from)) -1em -1em); animation-timing-function: cubic-bezier(.45, 0, .55, 1); }
  80% { clip-path: inset(-1em calc(100% - var(--ai-to)) -1em -1em); animation-timing-function: cubic-bezier(.5, 0, .7, .4); }
  100% { clip-path: inset(-1em -.4em -1em -1em); }
`;
const beam = keyframes`
  0% { left: 0; opacity: 0; animation-timing-function: cubic-bezier(.3, .6, .6, 1); }
  5% { opacity: 1; }
  18% { left: var(--ai-from); animation-timing-function: cubic-bezier(.45, 0, .55, 1); }
  80% { left: var(--ai-to); animation-timing-function: cubic-bezier(.5, 0, .7, .4); }
  94% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
`;
// A glint of light crossing the closing line once the beam has written it.
const glint = keyframes`from { background-position: 100% 50%; } to { background-position: 0% 50%; }`;
// Each outcome chip switches on like a light: it rises out of a blur, its rim flares, then settles.
const chipBorder = withAlpha(palette.sky[175], 0.22);
const chipInset = `inset 0 1px 0 ${withAlpha(palette.sky[175], 0.16)}`;
const powerOn = keyframes`
  0% { opacity: 0; transform: translateY(.6em) scale(.96); filter: blur(6px); border-color: ${withAlpha(palette.sky[175], 0)};
    box-shadow: ${chipInset}, 0 0 0 0 ${withAlpha(palette.blue[350], 0)}; }
  45% { opacity: 1; transform: none; filter: blur(0); border-color: ${palette.sky[150]}; color: ${palette.white};
    box-shadow: ${chipInset}, 0 0 24px 0 ${withAlpha(palette.blue[350], 0.55)}; }
  100% { opacity: 1; transform: none; filter: none; border-color: ${chipBorder}; color: ${palette.slate[50]};
    box-shadow: ${chipInset}, 0 0 0 0 ${withAlpha(palette.blue[350], 0)}; }
`;
const powerMeShadow = `0 4px 20px ${withAlpha(palette.blue[475], 0.14)}`;
// A single ring of light leaving the enter button once the message is complete.
const ready = keyframes`
  from { box-shadow: ${powerMeShadow}, 0 0 0 0 ${withAlpha(palette.sky[175], 0.6)}; }
  to { box-shadow: ${powerMeShadow}, 0 0 0 16px ${withAlpha(palette.sky[175], 0)}; }
`;

const sx = {
  // A full-screen modal. Before hydration, the home page marks its shell [data-entry-pending]
  // so the closed dialog already covers the page on first paint. Its background is the film's
  // own, so the film's edges disappear into it instead of showing as a box.
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
    bgcolor: palette.navy[900],
    color: palette.slate[50],
    colorScheme: "dark",
    "&[open]": { display: "grid" },
    "[data-entry-pending] > &": { display: "grid", zIndex: 1400 },
    "&::backdrop": { background: palette.navy[900] },
  },
  stage: {
    position: "relative",
    containerType: "size",
    minHeight: 0,
    // Room at the bottom for "Tap for sound", so it never covers the enter button.
    pb: "56px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  // Frames the film through the INTELLIGENCE wordmark; the message below is live text. On short
  // screens the film gives up height first, so the message and the enter button always fit.
  picture: {
    position: "relative",
    flexShrink: 0,
    width: "min(169cqw, 1140px, calc(243cqh - 220px))",
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
  // The claim and its outcomes. The claim arrives like the home page headline accents (the
  // accent-beam keyframes live in globalStyles); the state comes from bindIntroTagline.
  message: {
    flexShrink: 0,
    mt: "clamp(14px, 3cqh, 30px)",
    px: "16px",
    textAlign: "center",
    "& ::selection": { color: palette.white, background: palette.blue[550], WebkitTextFillColor: "white" },
    "&[data-state='wait'] :is(.accent, .outcome)": { opacity: 0 },
    "&[data-state='in'] .accent": {
      animation: `${write} ${claimWrite} var(--split-delay) backwards`,
    },
    "&[data-state='in'] .ai": { animation: `${glint} 1.4s ease-in-out calc(var(--split-delay) + ${claimWriteMs}ms) both` },
    "&[data-state='in'] .accent::after": {
      content: '""',
      position: "absolute",
      top: "8%",
      bottom: "12%",
      width: "3px",
      ml: "-3px",
      borderRadius: "3px",
      background: palette.cyan[25],
      boxShadow: `0 0 10px 2px ${palette.sky[150]}, 0 0 28px 6px ${palette.blue[350]}`,
      opacity: 0,
      pointerEvents: "none",
      animation: `${beam} ${claimWrite} var(--split-delay) both`,
    },
    "&[data-state='in'] .outcome": {
      animation: `${powerOn} 1s var(--ease-out) both`,
      animationDelay: `calc(var(--outcomes-delay) + var(--i) * ${outcomeStagger}ms)`,
    },
    "@media (prefers-reduced-motion: reduce)": {
      "& :is(.accent, .ai, .outcome)": { animation: "none !important", opacity: "1 !important" },
      "& .accent::after": { display: "none" },
    },
  },
  // In sentence case, like every headline on the site: large and in light, written by the beam.
  claim: {
    m: 0,
    "& .accent": {
      "--ai-from": "22%",
      "--ai-to": "31%",
      position: "relative",
      display: "block",
      width: "fit-content",
      maxWidth: "100%",
      mx: "auto",
      color: palette.white,
      fontSize: "clamp(18px, min(2.6cqw, 3.6cqh), 28px)",
      fontWeight: 680,
      lineHeight: 1.15,
      letterSpacing: "-.03em",
      textWrap: "balance",
      filter: `drop-shadow(0 0 24px ${withAlpha(palette.blue[250], 0.22)})`,
    },
    // White line, blue "AI", with a glint of light crossing it once the beam has passed.
    "& .ai": {
      color: palette.sky[150],
      background: `linear-gradient(108deg, ${palette.sky[150]} 30%, ${palette.white} 50%, ${palette.sky[150]} 70%) 100% 50% / 320% 100%`,
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    [shortStage]: { "& .accent": { fontSize: 16 } },
    "@media (forced-colors: active)": { "& .ai": { WebkitTextFillColor: "currentColor" } },
  },
  // What the visitor gets, as three glass chips in a row; on phones the third wraps, centred.
  outcomes: {
    listStyle: "none",
    m: 0,
    p: 0,
    mt: "clamp(10px, 2.2cqh, 20px)",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    "& .outcome": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      minHeight: "clamp(32px, 5cqh, 40px)",
      pl: "12px",
      pr: "16px",
      border: `1px solid ${chipBorder}`,
      borderRadius: "999px",
      background: `linear-gradient(180deg, ${withAlpha(palette.blue[350], 0.12)}, ${withAlpha(palette.navy[750], 0.45)})`,
      boxShadow: chipInset,
      backdropFilter: "blur(6px)",
      color: palette.slate[50],
      fontSize: "clamp(13px, min(1.6cqw, 2.3cqh), 15px)",
      fontWeight: 560,
      lineHeight: 1,
      letterSpacing: "-.01em",
      whiteSpace: "nowrap",
    },
    "& .outcome svg": { fontSize: "1.25em", color: palette.sky[175] },
    "@container (width < 640px)": { gap: "8px", "& .outcome": { pl: "10px", pr: "13px", gap: "6px" } },
    "@container (width < 360px)": { "& .outcome": { fontSize: 12, pl: "8px", pr: "10px" } },
    [shortStage]: { mt: "8px", "& .outcome": { minHeight: 28, fontSize: 12 } },
  },
  powerMe: {
    flexShrink: 0,
    mt: "clamp(12px, 2.6cqh, 26px)",
    minWidth: 152,
    minHeight: 46,
    px: "22px",
    py: 0,
    border: `1px solid ${palette.cyan[75]}`,
    background: `linear-gradient(125deg, ${palette.slate[75]}, ${palette.sky[175]} 68%, ${palette.blue[250]})`,
    boxShadow: powerMeShadow,
    color: palette.navy[800],
    fontSize: 14,
    fontWeight: 680,
    letterSpacing: "-.005em",
    lineHeight: 1,
    whiteSpace: "nowrap",
    "&:hover": { background: palette.slate[75] },
    "&.Mui-focusVisible": { outline: `2px solid ${palette.white}`, outlineOffset: 4 },
    "@media (prefers-reduced-motion: no-preference)": {
      "&:has(~ [data-intro-message][data-state='in'])": { animation: `${ready} 1.4s ease-out ${readyDelay}ms both` },
    },
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
  // Shown while the browser keeps the film silent; any tap on the page does the same.
  soundPrompt: {
    position: "absolute",
    bottom: "clamp(8px, 2.4cqh, 22px)",
    left: "50%",
    translate: "-50% 0",
    minHeight: 40,
    px: "16px",
    border: `1px solid ${withAlpha(palette.sky[175], 0.55)}`,
    borderRadius: 999,
    bgcolor: withAlpha(palette.navy[800], 0.72),
    backdropFilter: "blur(8px)",
    color: palette.slate[50],
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: "nowrap",
    "&:hover": { bgcolor: withAlpha(palette.navy[700], 0.85), borderColor: palette.sky[175] },
    "& .MuiButton-startIcon svg": { color: palette.sky[175] },
    "@media (prefers-reduced-motion: no-preference)": { animation: `${soundPulse} 2.4s ease-in-out infinite` },
  },
} satisfies Record<string, SxProps<Theme>>;
