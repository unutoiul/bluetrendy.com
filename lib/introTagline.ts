import { animate } from "motion/mini";

// The offline player uses this same module, bundled with esbuild as the IIFE IntroTagline.
// The HyperFrames title lands just after the ribbons lock together.
const revealStart = 5.13;
const revealDuration = 0.58;

export function bindIntroTagline(video: HTMLVideoElement, line: HTMLElement) {
  const accent = line.querySelector("strong")!;
  const dialog = line.closest("dialog");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let mode = "";
  let buffering = false;
  let frame = 0;
  let animations: ReturnType<typeof animate>[] = [];

  function stop() {
    cancelAnimationFrame(frame);
    for (const animation of animations) animation.cancel();
    animations = [];
  }

  function followFilm() {
    const fraction = Math.min(1, Math.max(0, (video.currentTime - revealStart) / revealDuration));
    const progress = reduced.matches ? Number(fraction > 0) : 1 - (1 - fraction) ** 3;
    line.style.opacity = String(progress);
    line.style.transform = `translateY(${(1 - progress) * 4}px)`;
    if (fraction < 1) frame = requestAnimationFrame(followFilm);
  }

  function sync() {
    const hidden = document.hidden || (dialog && !dialog.open);
    const idle = video.paused || video.ended || video.error || buffering;
    const next = hidden ? "hidden" : !idle ? "film" : reduced.matches ? "still" : "idle";
    if (mode === next && next !== "film") return;
    stop();
    mode = next;
    if (mode === "film") {
      followFilm();
      return;
    }
    line.style.removeProperty("opacity");
    line.style.removeProperty("transform");
    if (mode === "idle") {
      animations = [
        animate(line, { opacity: [0.82, 1], transform: ["translateY(3px)", "translateY(0)"] },
          { duration: 0.48, ease: "easeOut" }),
        animate(accent, { backgroundPosition: ["100% 50%", "0% 50%"] },
          { duration: 1.1, ease: "easeInOut" }),
      ];
    }
  }

  function onMediaChange(event: Event) {
    if (event.type === "waiting") buffering = true;
    if (event.type === "playing" || event.type === "pause") buffering = false;
    sync();
  }
  const events = ["playing", "pause", "ended", "waiting", "seeking", "seeked", "error"];
  for (const event of events) video.addEventListener(event, onMediaChange);
  document.addEventListener("visibilitychange", sync);
  reduced.addEventListener("change", sync);
  dialog?.addEventListener("close", sync);
  window.addEventListener("pageshow", sync);
  sync();

  return () => {
    stop();
    for (const event of events) video.removeEventListener(event, onMediaChange);
    document.removeEventListener("visibilitychange", sync);
    reduced.removeEventListener("change", sync);
    dialog?.removeEventListener("close", sync);
    window.removeEventListener("pageshow", sync);
  };
}
