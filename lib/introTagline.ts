// "Your Business, powered by AI" writes itself in under POWER ME as the 8 second film
// finishes, the way the home page headlines arrive: the words flip up out of a blur, then a
// beam of light writes "AI". The animation itself lives in the tagline styles in
// WebsiteEntrance; this only decides when the line waits and when it plays.
const revealStart = 6.9;

export function bindIntroTagline(video: HTMLVideoElement, line: HTMLElement) {
  const dialog = line.closest("dialog");
  let frame = 0;

  function show(state: "wait" | "in") {
    if (line.dataset.state !== state) line.dataset.state = state;
  }

  function sync() {
    cancelAnimationFrame(frame);
    if (document.hidden || (dialog && !dialog.open)) return;
    // When the film is not running (autoplay blocked, reduced motion, a pause, the end),
    // the line shows at once. While it runs, the line waits for its cue.
    if (video.paused || video.ended || video.error || video.currentTime >= revealStart) {
      show("in");
      return;
    }
    show("wait");
    frame = requestAnimationFrame(sync);
  }

  const events = ["play", "pause", "ended", "seeking", "seeked", "error"];
  for (const event of events) video.addEventListener(event, sync);
  document.addEventListener("visibilitychange", sync);
  dialog?.addEventListener("close", sync);
  window.addEventListener("pageshow", sync);
  // The entrance starts the film right after binding, so look one frame later.
  frame = requestAnimationFrame(sync);

  return () => {
    cancelAnimationFrame(frame);
    for (const event of events) video.removeEventListener(event, sync);
    document.removeEventListener("visibilitychange", sync);
    dialog?.removeEventListener("close", sync);
    window.removeEventListener("pageshow", sync);
  };
}
