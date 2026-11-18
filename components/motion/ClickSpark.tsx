"use client";

import { useEffect } from "react";

const clickable = [
  "a[href]", "button:not(:disabled)", "[role='button']", "[role='option']", "[role='menuitem']",
  "summary", "label", "input[type='checkbox']", "input[type='radio']",
].join(", ");

const rays = Array.from({ length: 8 }, (_, index) =>
  `<g transform="rotate(${index * 45})"><line x1="0" y1="-9" x2="0" y2="-15"/></g>`).join("");

/** Draws a small brand-blue spark wherever someone clicks a link or control. */
export default function ClickSpark() {
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");

    function spark(event: PointerEvent) {
      if (reduced.matches || event.button !== 0 || !(event.target instanceof Element)) return;
      if (!event.target.closest(clickable)) return;
      const host = document.createElement("span");
      host.className = "click-spark";
      host.setAttribute("aria-hidden", "true");
      host.style.left = `${event.clientX}px`;
      host.style.top = `${event.clientY}px`;
      host.innerHTML = `<svg viewBox="-32 -32 64 64"><circle r="6"/>${rays}</svg>`;
      document.body.append(host);
      window.setTimeout(() => host.remove(), 650);
    }

    document.addEventListener("pointerdown", spark, { passive: true });
    return () => document.removeEventListener("pointerdown", spark);
  }, []);

  return null;
}
