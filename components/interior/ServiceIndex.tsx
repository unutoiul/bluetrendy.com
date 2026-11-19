"use client";

import { useEffect, useRef, useState } from "react";
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
      const inset = window.matchMedia("(max-width: 860px)").matches ? 146 : 112;
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

  const links = items.map(item => <a key={item.slug} href={"#" + item.slug}
    aria-current={current === item.slug ? "location" : undefined}
    onClick={() => {menu.current?.removeAttribute("open");}}>
    {item.name}<span aria-hidden="true">↘</span>
  </a>);
  return <nav aria-label="Service directory" className={styles.index}>
    <div className={styles.desktopIndex}><strong>Service directory</strong>{links}</div>
    <details ref={menu} className={styles.mobileIndex} onKeyDown={event => {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    }}>
      <summary><span>Services</span><b>{items.find(item => item.slug === current)?.name}</b><i aria-hidden="true">⌄</i></summary>
      <div>{links}</div>
    </details>
  </nav>;
}

