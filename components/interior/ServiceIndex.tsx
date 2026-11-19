"use client";

import { useEffect, useRef, useState } from "react";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import styles from "./Services.styles";

type Item = { slug: string; name: string };

export default function ServiceIndex({ items }: { items: Item[] }) {
  const [current, setCurrent] = useState(items[0]?.slug);
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const sections = items.map(item => document.getElementById(item.slug));
    let frame = 0;
    function update() {
      frame = 0;
      // A chapter counts as current once its top passes the upper third of the screen, so the
      // menu follows the heading being read rather than waiting for it to reach the very top.
      const header = window.matchMedia("(max-width: 860px)").matches ? 146 : 112;
      const inset = Math.max(header, window.innerHeight * 0.34);
      let selected = items[0].slug;
      for (const section of sections) {
        if (!section || section.getBoundingClientRect().top > inset) break;
        selected = section.id;
      }
      setCurrent(selected);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !menu.current?.contains(event.target)) menu.current?.removeAttribute("open");
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    document.addEventListener("pointerdown", dismiss);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      document.removeEventListener("pointerdown", dismiss);
    };
  }, [items]);

  // Each label carries a hidden bold copy in the same grid cell, so a row keeps its size
  // (and its line breaks) when it becomes the current one and turns bold.
  const links = items.map(item => <a key={item.slug} href={"#" + item.slug}
    aria-current={current === item.slug ? "location" : undefined}
    onClick={() => {menu.current?.removeAttribute("open");}}>
    <span className={styles.indexLabel}><span>{item.name}</span><span aria-hidden="true">{item.name}</span></span>
  </a>);
  return <nav aria-label="Service directory" className={styles.index}>
    <div className={styles.desktopIndex}><strong>Service directory</strong><div className={styles.indexList}>{links}</div></div>
    <details ref={menu} className={styles.mobileIndex} onKeyDown={event => {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    }}>
      <summary><span>Services</span><b>{items.find(item => item.slug === current)?.name}</b><KeyboardArrowDownRounded /></summary>
      <div>{links}</div>
    </details>
  </nav>;
}

