/* The same paused HyperFrames timeline drives the edit, the HTML player and the homepage. */
(() => {
  const timeline = gsap.timeline({ paused: true });
  timeline
    .fromTo("#name", { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: .52, ease: "power1.inOut" }, 4.79)
    .fromTo("#descriptor", { opacity: 0, y: 7 },
      { opacity: 1, y: 0, duration: .46, ease: "power1.inOut" }, 4.98)
    .fromTo("#business", { yPercent: 101, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: .49, ease: "power3.out" }, 5.13)
    .fromTo("#powered", { x: -16, yPercent: 91, opacity: 0 },
      { x: 0, yPercent: 0, opacity: 1, duration: .55, ease: "power3.out" }, 5.34)
    .fromTo("#ai", { x: 13, opacity: 0, backgroundPosition: "100% 50%" },
      { x: 0, opacity: 1, duration: .38, ease: "power2.out" }, 5.56)
    .to("#ai", { backgroundPosition: "0% 50%", duration: .53, ease: "sine.inOut" }, 5.62);
  window.__timelines = window.__timelines || {};
  window.__timelines.film = timeline;
})();