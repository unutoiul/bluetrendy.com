"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from "motion/react";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import EventOutlined from "@mui/icons-material/EventOutlined";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import type { EffectName } from "@/components/backgrounds/effects";
import Magnetic from "@/components/motion/Magnetic";
import { caseStudies, type CaseStudy } from "@/data/caseStudies";
import { clientLogos } from "@/data/clients";
import { palette, withAlpha } from "@/theme/palette";
import styles from "./Work.styles";

// Matches the lens height and the tether column in Work.styles.
const lensHeight = 488;
const tetherWidth = 64;
const stackShown = 4;

// Each lens shows a living scene drawn from the project's own subject.
const scenes: Record<string, EffectName> = {
  "blue-bridge-asset-management": "flow", // live market data streaming in
  "bcg-bayer-medical-imaging": "ripples", // a scan sweeping outward
  "nato-nci-agency-arcgis": "globe", // a shared map of the world
  "alvarez-marsal-financial-analysis": "dotWave", // the open sea under two cruise lines
  "spx-flow-predictive-maintenance": "circuit", // sensors on a production line
  "atlassian-identity-platform": "packetMesh", // one identity passed between products
};

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

/** "Dec 2025 – Mar 2026" becomes "2025–26"; a single year stays as it is. */
function years(timeframe: string) {
  const found = [...new Set(timeframe.match(/\d{4}/g) ?? [])];
  return found.length > 1 ? `${found[0]}–${found[found.length - 1].slice(2)}` : found[0] ?? "";
}

function logoFor(study: CaseStudy) {
  return clientLogos.find(client => client.href === "/case-studies/" + study.slug && client.file)?.file ?? null;
}

const initials = (name: string) => name.split(/\s+/).map(part => part[0]).join("").slice(0, 2);

/**
 * The case study directory. Beside the list, a lens rides on a spring to the project
 * under the pointer (or nearest the middle of the screen while scrolling). It has
 * weight: it lags, tips with its own speed, lifts off the page while it travels and
 * settles with a little overshoot, and a tether stretches between it and its row.
 * Arriving at a new project, its face turns over like a card on a drum.
 */
export default function CaseStudyIndex() {
  const reduced = useReducedMotion();
  const router = useRouter();
  const frame = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const engaged = useRef(false);
  const placed = useRef(false);
  const current = useRef(0);
  const followScroll = useRef<() => void>(() => {});
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const targetY = useMotionValue(0);
  const lensY = useSpring(targetY, { stiffness: 120, damping: 16, mass: 1 });
  const anchorTarget = useMotionValue(0);
  const anchorY = useSpring(anchorTarget, { stiffness: 420, damping: 38 });
  const speed = useVelocity(lensY);
  // Moving down, the leading edge is pushed back; moving up, the opposite.
  const rotateX = useTransform(speed, value => clamp(-value * 0.012, -12, 12));
  const lift = useTransform(speed, value => Math.min(1, Math.abs(value) / 1600));
  const scale = useTransform(lift, value => 1 + value * 0.035);
  const boxShadow = useTransform(lift, value =>
    `0 ${34 + value * 40}px ${70 + value * 60}px -38px ${withAlpha(palette.navy[800], 0.82 + value * 0.14)}`);
  const tetherEnd = useTransform(() => clamp(anchorY.get(), lensY.get() + 56, lensY.get() + lensHeight - 56));
  const tether = useTransform(() => {
    const start = anchorY.get(), end = tetherEnd.get();
    return `M0 ${start} C${tetherWidth * 0.6} ${start} ${tetherWidth * 0.4} ${end} ${tetherWidth} ${end}`;
  });

  /** Sends the lens toward a row; a pointer inside the row pulls it a little further. */
  const place = useCallback((index: number, pointerY?: number) => {
    const box = frame.current?.getBoundingClientRect();
    const row = rows.current[index]?.getBoundingClientRect();
    if (!box || !row) return;
    const center = row.top - box.top + row.height / 2;
    const pull = pointerY === undefined ? 0 : (pointerY - row.top - row.height / 2) * 0.4;
    const top = clamp(center + pull - lensHeight / 2, 0, Math.max(0, box.height - lensHeight));
    targetY.set(top);
    anchorTarget.set(center);
    if (!placed.current || reduced) {
      placed.current = true;
      lensY.jump(top);
      anchorY.jump(center);
    }
    if (index !== current.current) {
      setDirection(index > current.current ? 1 : -1);
      current.current = index;
      setActive(index);
    }
  }, [anchorTarget, anchorY, lensY, reduced, targetY]);

  // While nobody is pointing at the list, the lens follows the row nearest the middle of the screen.
  useEffect(() => {
    let pending = 0;
    function nearest() {
      pending = 0;
      if (engaged.current) return;
      const middle = window.innerHeight * 0.45;
      let best = 0, bestDistance = Infinity;
      rows.current.forEach((row, index) => {
        if (!row) return;
        const box = row.getBoundingClientRect();
        const distance = Math.abs(box.top + box.height / 2 - middle);
        if (distance < bestDistance) { best = index; bestDistance = distance; }
      });
      place(best);
    }
    const schedule = () => { if (!pending) pending = requestAnimationFrame(nearest); };
    followScroll.current = schedule;
    nearest();
    const sizes = new ResizeObserver(schedule);
    if (frame.current) sizes.observe(frame.current);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(pending);
      sizes.disconnect();
      window.removeEventListener("scroll", schedule);
    };
  }, [place]);

  function track(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;
    engaged.current = true;
    const row = (event.target as Element).closest<HTMLElement>("[data-row]");
    if (row) place(Number(row.dataset.row), event.clientY);
  }

  function release() {
    engaged.current = false;
    followScroll.current();
  }

  function focusRow(index: number) {
    engaged.current = true;
    place(index);
  }

  function blurList(event: FocusEvent) {
    if (!event.currentTarget.contains(event.relatedTarget)) release();
  }

  const study = caseStudies[active];
  const logo = logoFor(study);
  const flip = reduced
    ? { enter: { opacity: 0 }, center: { opacity: 1, transition: { duration: 0.2 } }, exit: { opacity: 0, transition: { duration: 0.2 } } }
    : {
      enter: (d: number) => ({ rotateX: d * -72, opacity: 0 }),
      center: { rotateX: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 210, damping: 23 } },
      exit: (d: number) => ({ rotateX: d * 72, opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const } }),
    };

  return (
    <div ref={frame} className={styles.frame} onPointerMove={track} onPointerLeave={release}>
      <ol className={styles.list} aria-label="Case studies, newest first" onBlur={blurList}>
        {caseStudies.map((item, index) => {
          const mark = logoFor(item);
          return (
            <li key={item.slug} id={item.slug} data-row={index} ref={element => { rows.current[index] = element; }}>
              <Link href={"/case-studies/" + item.slug} className={styles.row} data-active={index === active}
                onFocus={() => focusRow(index)}>
                <span className={styles.year}>{years(item.timeframe)}</span>
                <span className={styles.rowMark} aria-hidden="true">
                  {mark ? <Image src={"/brand/clients/" + mark} alt="" width={120} height={48} /> : initials(item.client)}
                </span>
                <span className={styles.rowText}>
                  <span className={styles.meta}>{item.sector}</span>
                  <h2>{item.client}</h2>
                  <span className={styles.title}>{item.title}</span>
                </span>
                <span className={styles.go} aria-hidden="true">
                  <Magnetic strength={0.35} max={8}><ArrowOutwardRounded /></Magnetic>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <svg className={styles.tether} aria-hidden="true">
        <motion.path d={tether} />
        <motion.circle cx={0} cy={anchorY} r={3.5} />
        <motion.circle cx={tetherWidth} cy={tetherEnd} r={3.5} />
      </svg>

      <div className={styles.rail} aria-hidden="true">
        <motion.div className={styles.lens} style={{ y: lensY, rotateX, scale, boxShadow }}
          onClick={() => router.push("/case-studies/" + study.slug)}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div key={study.slug} className={styles.face} custom={direction} variants={flip}
              initial="enter" animate="center" exit="exit">
              <div className={styles.scene}>
                <LivingBackground effect={scenes[study.slug] ?? "constellation"} quiet="none" seed={31 + active * 7} />
                <span className={styles.badge}>
                  {logo ? <Image src={"/brand/clients/" + logo} alt="" width={132} height={28} /> : <strong>{study.client}</strong>}
                </span>
              </div>
              <div className={styles.lensBody}>
                <p className={styles.where}>
                  <span><PlaceOutlined />{study.location}</span>
                  <span><EventOutlined />{study.timeframe}</span>
                </p>
                <p className={styles.summary}>{study.summary}</p>
                <ul className={styles.stack}>
                  {study.stack.slice(0, stackShown).map(tool => <li key={tool}>{tool}</li>)}
                  {study.stack.length > stackShown && <li>+{study.stack.length - stackShown} more</li>}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
