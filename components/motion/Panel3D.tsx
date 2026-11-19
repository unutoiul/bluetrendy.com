"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Panels across the site: anything marked data-panel, plus the existing card styles.
const panels = "[data-panel], .Work__card, .TrustStrip__wall li";
const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
const tiltLimit = 7;

/**
 * Gives panels depth. Each one swings up out of the page as it scrolls into view, one
 * after another within its group, then leans toward the mouse while it is under the
 * pointer. Panels already on screen when the page opens are left as they are, so
 * nothing flashes; reduced motion keeps a plain fade and no tilt.
 *
 * Everything runs through the Web Animations API and pointer-time inline styles, so the
 * server-rendered markup is never changed before React hydrates it.
 */
export default function Panel3D() {
  const path = usePathname();

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const seen = new WeakSet<Element>();
    const holds = new Map<Element, Animation>();
    const queue = new Map<Element, number>();
    const cleanups: (() => void)[] = [];

    function reveal(element: HTMLElement) {
      holds.get(element)?.cancel();
      holds.delete(element);
      // Stagger panels that share a group and arrive together.
      const group = element.parentElement?.closest("ul, ol, [data-panel-group]") ?? element.parentElement ?? document.body;
      const order = queue.get(group) ?? 0;
      queue.set(group, order + 1);
      window.setTimeout(() => queue.set(group, Math.max(0, (queue.get(group) ?? 1) - 1)), 900);
      const side = order % 2 ? -1 : 1;
      element.animate(reduced
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            { opacity: 0, transform: `perspective(1100px) translate3d(0, 56px, -140px) rotateX(28deg) rotateY(${side * 9}deg) scale(0.92)` },
            { opacity: 1, offset: 0.55 },
            { opacity: 1, transform: "perspective(1100px) translate3d(0, 0, 0) rotateX(0) rotateY(0) scale(1)" },
          ], { duration: reduced ? 400 : 1000, delay: order * 120, easing: ease, fill: "backwards" });
    }

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        reveal(entry.target as HTMLElement);
      }
    }, { rootMargin: "0px 0px -6% 0px" });

    function setup(element: HTMLElement) {
      if (seen.has(element)) return;
      seen.add(element);
      // Panels below the fold are held invisible until their turn, so a quick scroll never shows them early.
      if (element.getBoundingClientRect().top > window.innerHeight) {
        holds.set(element, element.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 1, fill: "forwards" }));
        observer.observe(element);
      }
      // data-panel="reveal" asks for the entrance only, without the tilt.
      if (!finePointer || reduced || element.dataset.panel === "reveal") return;
      function enter() {
        const parent = element.parentElement;
        if (parent && !parent.style.perspective) parent.style.perspective = "1200px";
      }
      function lean(event: PointerEvent) {
        const box = element.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        const angle = Math.min(1, Math.hypot(x, y) * 2) * tiltLimit;
        element.style.transition = "rotate 0.12s linear";
        element.style.rotate = `${-y} ${x} 0 ${angle}deg`;
      }
      function settle() {
        element.style.transition = `rotate 0.7s ${ease}`;
        element.style.rotate = "1 0 0 0deg";
      }
      element.addEventListener("pointerenter", enter);
      element.addEventListener("pointermove", lean);
      element.addEventListener("pointerleave", settle);
      cleanups.push(() => {
        element.removeEventListener("pointerenter", enter);
        element.removeEventListener("pointermove", lean);
        element.removeEventListener("pointerleave", settle);
      });
    }

    function scan() {
      document.querySelectorAll<HTMLElement>(panels).forEach(setup);
    }

    // Some sections (such as the client wall) render after the page loads, so keep watching.
    let pending = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(scan);
    });
    scan();
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(pending);
      mutations.disconnect();
      observer.disconnect();
      holds.forEach(hold => hold.cancel());
      cleanups.forEach(cleanup => cleanup());
    };
  }, [path]);

  return null;
}
