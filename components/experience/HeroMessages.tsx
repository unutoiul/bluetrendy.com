"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import { useInView } from "motion/react";
import SplitWords, { countWords } from "../motion/SplitWords";
import styles from "../Hero.styles";

// The first headline is the promise; the rest are the four outcomes and the studio, one each.
const messages = [
  {
    topic: "AI for your business", lead: "Build faster. Sell smarter.", accent: "Run your business with AI.",
    body: "We turn artificial intelligence into real business advantages. We don’t just recommend AI tools: we design, build, integrate and operate them around your business.",
  },
  {
    topic: "Grow revenue", lead: "Turn more leads", accent: "into paying customers.",
    body: "Capture every enquiry, follow up on time and personalise your marketing. AI agents and automated sequences keep the pipeline moving while your team sells.",
  },
  {
    topic: "Reduce costs", lead: "Let AI handle the routine.", accent: "You keep the decisions.",
    body: "Automate repetitive admin, document handling, support and reporting. Your team keeps the final say on every decision that needs judgment.",
  },
  {
    topic: "Launch faster", lead: "Your next website or app,", accent: "built at AI speed.",
    body: "Websites, apps and digital products delivered sooner with AI-assisted engineering. A senior engineer reviews every release before it ships.",
  },
  {
    topic: "Better decisions", lead: "Don’t just analyse yesterday.", accent: "Prepare for tomorrow.",
    body: "Forecast demand, analyse trends and spot risks early. Every forecast shows its range, because no model knows the future for certain.",
  },
  {
    topic: "Creative studio", lead: "Turn your ideas into videos", accent: "people want to watch.",
    body: "Campaign concepts, product films and social cuts, made in several variations, so you can test which idea brings in customers.",
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
    <div ref={region} role="region" aria-label="What BlueTrendy does for your business">
      <div className={styles.messageBar}>
        <span className={styles.discipline}>AI implementation · Software engineering · Business automation</span>
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
