"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import { useInView } from "motion/react";
import SplitWords, { countWords } from "../motion/SplitWords";
import styles from "../Hero.styles";

const messages = [
  {
    topic: "Custom software", lead: "Custom software,", accent: "delivered 10x faster.",
    body: "We’re an IT company that builds software around your business. AI speeds up coding and testing. Our senior team takes your project from brief to launch.",
  },
  {
    topic: "Websites", lead: "Your next website,", accent: "ready for business.",
    body: "Give customers a place to book, enquire or buy. We design the pages, connect checkout and give your team the tools to publish its own updates.",
  },
  {
    topic: "Mobile apps", lead: "One mobile app,", accent: "iOS and Android.",
    body: "Let customers book on the go or give field teams a way to work offline. We build the app, connect it to your systems and take it through store submission.",
  },
  {
    topic: "IT implementation", lead: "Your systems,", accent: "working together.",
    body: "Connect sales, operations and finance. We configure the tools, migrate your records and rehearse the rollout with the people who will use them.",
  },
  {
    topic: "AI automation", lead: "Let AI handle", accent: "the routine work.",
    body: "Turn incoming documents into usable records, route approvals and flag exceptions. Your team keeps the final say on decisions that need judgment.",
  },
  {
    topic: "Marketing video", lead: "Show your product", accent: "in motion.",
    body: "Give buyers a clear look at what your product does. We script and edit demos, launch films and captioned social cuts for the channels you use.",
  },
] as const;

const readingTime = 8500;

// "in" plays the arrival, "out" lets the previous headline dissolve, "idle" stays hidden.
const layerState = (index: number, active: number, previous: number) =>
  index === active ? "in" : index === previous ? "out" : "idle";

type Shown = { active: number; previous: number };
const moveTo = (shown: Shown, index: number): Shown =>
  index === shown.active ? shown : { active: index, previous: shown.active };

export default function HeroMessages() {
  const [{ active, previous }, setShown] = useState<Shown>({ active: 0, previous: -1 });
  const [paused, setPaused] = useState(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const region = useRef<HTMLDivElement>(null);
  const visible = useInView(region, { amount: 0.5 });
  const playing = visible && !paused && !reduced;

  useEffect(() => {
    if (!visible || paused || reduced) return;
    let timer: number;
    function schedule() {
      window.clearTimeout(timer);
      if (!document.hidden) {
        timer = window.setTimeout(() => setShown(shown => moveTo(shown, (shown.active + 1) % messages.length)), readingTime);
      }
    }
    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [active, paused, reduced, visible]);

  return (
    <div ref={region} role="region" aria-label="BlueTrendy service highlights">
      <div className={styles.messageBar}>
        <span className={styles.discipline}>IT &amp; digital production</span>
        <div className={styles.messageControls} role="group" aria-label="Choose a headline"
          data-playing={playing} style={{ "--reading-time": `${readingTime}ms` } as CSSProperties}>
          {messages.map((message, index) => (
            <button type="button" key={message.topic} className={styles.messageDot}
              aria-label={`Show ${message.topic} headline`} title={message.topic} aria-pressed={active === index}
              onClick={() => { setShown(shown => moveTo(shown, index)); setPaused(true); }}><span /></button>
          ))}
          {!reduced && <button type="button" className={styles.messageToggle}
            aria-label={paused ? "Play headlines" : "Pause headlines"} title={paused ? "Play headlines" : "Pause headlines"}
            onClick={() => setPaused(value => !value)}>{paused ? <PlayArrowRounded /> : <PauseRounded />}</button>}
        </div>
      </div>
      <h1 id="hero-heading" className={styles.title}>
        {messages.map((message, index) => (
          <span key={message.topic} className={`${styles.messageLayer} split msg`}
            data-state={layerState(index, active, previous)} aria-hidden={index !== active}>
            <SplitWords text={message.lead} />{" "}
            <span className={`${styles.accent} msg-accent`}
              style={{ "--split-delay": `${countWords(message.lead) * 70 + 170}ms` } as CSSProperties}>{message.accent}</span>
          </span>
        ))}
      </h1>
      <p className={styles.body} aria-live={paused || reduced ? "polite" : "off"}>
        {messages.map((message, index) => (
          <span key={message.topic} className={`${styles.messageLayer} split msg msg-body`}
            data-state={layerState(index, active, previous)} aria-hidden={index !== active}>
            <SplitWords text={message.body} />
          </span>
        ))}
      </p>
    </div>
  );
}
