(() => {
  const video = document.querySelector("#picture");
  const bar = document.querySelector(".transport");
  const play = document.querySelector("#play");
  const sound = document.querySelector("#sound");
  const seek = document.querySelector("#seek");
  const status = document.querySelector("#status");
  const picture = video.closest(".intro-picture");
  if (location.protocol === "file:") {
    document.querySelector(".enter-site").href = "https://www.bluetrendy.com/#home-content";
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let playAttempt = 0;

  window.IntroTagline.bindIntroTagline(video, document.querySelector("#tagline"));

  function update() {
    const t = video.currentTime;
    picture.dataset.lockup = String(Boolean(video.error) || video.ended || (video.paused && t === 0));
    seek.value = t;
    seek.style.setProperty("--progress", (100 * t / Number(seek.max)) + "%");
    seek.setAttribute("aria-valuetext", t.toFixed(1) + " of 8 seconds");
    play.textContent = video.ended ? "Replay" : video.paused ? "Play" : "Pause";
    const silent = video.muted || video.volume === 0;
    sound.textContent = silent ? "Sound off" : "Sound on";
    sound.setAttribute("aria-label", silent ? "Turn sound on" : "Mute sound");
    sound.setAttribute("aria-pressed", String(!silent));
  }
  function tick() {
    update();
    if (!video.paused && !video.ended) frame = requestAnimationFrame(tick);
  }
  async function start(autoplay = false) {
    const attempt = ++playAttempt;
    try {
      if (video.ended) video.currentTime = 0;
      await video.play();
    } catch (error) {
      if (attempt !== playAttempt || error.name === "AbortError") return;
      if (autoplay && error.name === "NotAllowedError" && !document.hidden && !reduced.matches) {
        video.muted = true;
        await start();
      } else if (error.name !== "NotAllowedError") {
        status.textContent = "The intro could not play. Press Play to retry.";
        status.hidden = false;
      }
      update();
    }
  }
  video.addEventListener("playing", () => {
    status.hidden = true;
    cancelAnimationFrame(frame);
    tick();
  });
  for (const event of ["pause", "ended", "seeking", "seeked", "timeupdate", "volumechange"]) {
    video.addEventListener(event, update);
  }
  play.addEventListener("click", () => {
    if (video.paused) { void start(); } else { video.pause(); }
  });
  sound.addEventListener("click", () => {
    if (video.muted || video.volume === 0) {
      video.muted = false;
      if (video.volume === 0) video.volume = 1;
      if (video.ended) void start();
    } else {
      video.muted = true;
    }
  });
  seek.addEventListener("input", () => {
    video.currentTime = Number(seek.value);
    update();
  });
  function interrupt() {
    if (document.hidden || reduced.matches) {
      ++playAttempt;
      video.pause();
    }
  }
  document.addEventListener("visibilitychange", interrupt);
  reduced.addEventListener("change", interrupt);
  video.addEventListener("error", () => {
    video.hidden = true;
    picture.dataset.lockup = "true";
    bar.hidden = true;
    status.textContent = "The intro could not play.";
    status.hidden = false;
  });
  window.addEventListener("pagehide", () => { ++playAttempt; video.pause(); cancelAnimationFrame(frame); });
  video.controls = false;
  bar.hidden = false;
  update();
  if (!document.hidden && !reduced.matches) void start(true);
})();
