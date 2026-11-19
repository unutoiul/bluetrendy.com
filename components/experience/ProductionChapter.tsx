"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import LayersOutlined from "@mui/icons-material/LayersOutlined";
import CloudOutlined from "@mui/icons-material/CloudOutlined";
import StorageOutlined from "@mui/icons-material/StorageOutlined";
import ViewInArOutlined from "@mui/icons-material/ViewInArOutlined";
import WebAssetOutlined from "@mui/icons-material/WebAssetOutlined";
import SendRounded from "@mui/icons-material/SendRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import BoltOutlined from "@mui/icons-material/BoltOutlined";
import TrackChangesOutlined from "@mui/icons-material/TrackChangesOutlined";
import SignalCellularAltRounded from "@mui/icons-material/SignalCellularAltRounded";
import styles from "./ProductionChapter.styles";
import { ProductionPanel } from "./PanelMotion";

const samples = {
  cited: { label: "Cited", citation: "RET-14" },
  missing: { label: "Uncited", citation: "" },
} as const;
type Sample = keyof typeof samples;

function releaseChecks(sample: Sample) {
  const approvedPolicy = "RET-14";
  const response = {
    answer: "Check the opened-item return policy.",
    source: approvedPolicy,
    citation: samples[sample].citation,
    handoffAvailable: true,
  };
  return [
    { label: "Answer present", passed: Boolean(response.answer.trim()) },
    { label: "Approved source", passed: response.source === approvedPolicy },
    { label: "Source citation", passed: response.citation === response.source },
    { label: "Human handoff", passed: response.handoffAvailable },
  ];
}

function BriefPreview({
  sample,
  choose,
  run,
  busy,
  status,
}: {
  sample: Sample;
  choose: (sample: Sample) => void;
  run: () => void;
  busy: boolean;
  status: string;
}) {
  return (
    <div className={styles.brief}>
      <div className={styles.prompt}>
        {status || "Build an assistant that answers policy questions and cites the source."}
        <i aria-hidden />
      </div>
      <div className={styles.demoControls}>
        <select
          aria-label="Sample response"
          value={sample}
          disabled={busy}
          onChange={(event) => choose(event.target.value as Sample)}
        >
          {Object.entries(samples).map(([key, option]) => (
            <option key={key} value={key}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="button" disabled={busy} onClick={run}>
          Run demo <SendRounded />
        </button>
      </div>
      <span role="status" className={styles.visuallyHidden}>
        {status}
      </span>
    </div>
  );
}

function ArchitecturePreview() {
  return (
    <div className={styles.architecture}>
      <span className={styles.archTop}>
        <WebAssetOutlined /> Agent app
      </span>
      <span className={styles.archLeft}>
        <StorageOutlined />
        Data
      </span>
      <b className={styles.chip}>AI</b>
      <span className={styles.archRight}>
        <ViewInArOutlined />
        Model
      </span>
      <span className={styles.archBottom}>
        <CloudOutlined /> Cloud
      </span>
    </div>
  );
}

function Sparkline({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 130 42" preserveAspectRatio="none" aria-hidden="true">
      {filled && (
        <path
          d="M0 38 L12 32 L24 34 L38 23 L48 27 L61 17 L73 22 L85 13 L94 15 L109 6 L118 9 L130 2 V42 H0Z"
          fill="#11b8ff"
          opacity=".2"
        />
      )}
      <path
        d="M0 38 L12 32 L24 34 L38 23 L48 27 L61 17 L73 22 L85 13 L94 15 L109 6 L118 9 L130 2"
        fill="none"
        stroke="#76eaff"
        strokeWidth="1.8"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="109" cy="6" r="2.1" fill="#c5ffff" />
    </svg>
  );
}

function BuildPreview() {
  return (
    <div className={styles.build}>
      <div className={styles.editorBar}>
        <i />
        <i />
        <i />
        <span>answer.ts</span>
      </div>
      <code>
        <span>
          <em>const</em> source = <b>search</b>(ask);
        </span>
        <span>
          <em>return</em> <b>answer</b>({"{"}
        </span>
        <span> source,</span>
        <span>
          {" "}
          cite: <em>true</em>
        </span>
        <span>{"}"});</span>
      </code>
      <div className={styles.dashboard}>
        <span className={styles.miniNav}>
          <i />
          <i />
          <i />
        </span>
        <Sparkline />
        <i className={styles.ring} />
      </div>
    </div>
  );
}

function TestPreview({ checks, checked }: { checks: ReturnType<typeof releaseChecks>; checked: boolean }) {
  const passed = checks.filter((check) => check.passed).length;
  return (
    <div className={styles.tests}>
      {checks.map((test) => (
        <div key={test.label} data-failed={(checked && !test.passed) || undefined}>
          {checked && !test.passed ? <CloseRounded /> : <CheckRounded />}
          <span>{test.label}</span>
        </div>
      ))}
      <strong data-failed={(checked && passed < checks.length) || undefined}>
        <CheckCircleOutlineRounded /> {checked ? `${passed} / ${checks.length} passed` : "Acceptance suite"}
      </strong>
    </div>
  );
}

function LaunchPreview({ blocked, live, running }: { blocked: boolean; live: boolean; running: boolean }) {
  return (
    <div className={styles.launch} data-blocked={blocked || undefined} data-running={running || undefined}>
      <div>
        <CloudOutlined /> Sample rollout
      </div>
      <i className={styles.meter} />
      <strong>
        {blocked ? <CloseRounded /> : <CheckCircleOutlineRounded />}{" "}
        {blocked ? "Pilot held" : live ? "Pilot released" : running ? "Preparing pilot" : "Pilot preview"}
      </strong>
      <div className={styles.chart}>
        <small>
          <i /> Monitoring
        </small>
        <Sparkline filled />
      </div>
    </div>
  );
}

const stages = [
  {
    label: "Idea / Prompt",
    summary: "Turn a business need into a clear, testable brief.",
    checklist: ["Define the outcome", "Gather source material", "Shape the first release"],
    title: "Define one useful answer.",
    action:
      "A support agent needs to answer a policy question and show the customer the passage that supports it.",
    deliverable: "A one-page brief naming the user, the question, and the source of truth.",
    gate: "The support lead agrees what a correct answer looks like and when to hand a question to a person.",
  },
  {
    label: "AI Architecture",
    summary: "Connect the right models, data, and permissions.",
    checklist: ["Select models and tools", "Map system boundaries", "Design access controls"],
    title: "Trace the path from source to answer.",
    action:
      "Map who can see each policy, how the assistant finds the right passage, and how its answer links back to that source.",
    deliverable: "A system diagram, data boundaries, and a record of the model choices.",
    gate: "A restricted policy stays restricted when someone searches for it.",
  },
  {
    label: "Design & Build",
    summary: "Build a working product with the people who use it.",
    checklist: ["Build a working slice", "Review code and UX", "Test with first users"],
    title: "Put a working slice in front of the team.",
    action:
      "Ship search, cited answers, and feedback together so a support agent can try the complete workflow.",
    deliverable: "A working staging build with a reviewable change set.",
    gate: "An agent can complete a real task in staging and report an unclear answer.",
  },
  {
    label: "Testing & QA",
    summary: "Check quality, security, and reliability before release.",
    checklist: ["Verify source citations", "Exercise edge cases", "Review release risks"],
    title: "Test the difficult questions.",
    action:
      "Exercise missing sources, conflicting policies, and access restrictions alongside straightforward questions.",
    deliverable: "A repeatable evaluation set and a record of issues found during review.",
    gate: "Answers cite the right policy or ask for help when the evidence is missing.",
  },
  {
    label: "Production Launch",
    summary: "Release with monitoring, clear ownership, and a rollback plan.",
    checklist: ["Pilot a live release", "Watch errors and alerts", "Hand over the runbook"],
    title: "Release with a way back.",
    action:
      "Roll out to a pilot group, watch errors and unanswered questions, and give the support lead a route to report issues.",
    deliverable: "A release runbook, monitoring, and handover instructions.",
    gate: "The team knows who owns incidents and can restore the previous release.",
  },
] as const;

const benefits = [
  { label: "Faster delivery", text: "Put a working release in users’ hands.", Icon: BoltOutlined },
  { label: "Higher quality", text: "Review and test each increment.", Icon: LayersOutlined },
  { label: "Greater reliability", text: "Catch issues early in a live pilot.", Icon: TrackChangesOutlined },
  { label: "Built to scale", text: "Extend a proven first release.", Icon: SignalCellularAltRounded },
] as const;

export default function ProductionChapter() {
  const [selected, setSelected] = useState(0);
  const [sample, setSample] = useState<Sample>("cited");
  const [step, setStep] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  const active = stages[selected];
  const checks = releaseChecks(sample);
  const blocked = step === 3 && checks.some((check) => !check.passed);
  const live = step === 5;
  const running = step !== null && !blocked && !live;
  const messages = [
    "Brief ready. The support answer must cite an approved policy.",
    "Retrieving policy RET-14 from the approved source library.",
    "Building the sample answer and its source link.",
    "Checking the answer, policy, citation, and handoff.",
    "Checks passed. Releasing the sample to the pilot.",
    "Demo complete. All four checks passed and the pilot is ready.",
  ];
  const status = blocked
    ? "Pilot held. The answer is missing its citation. Try the cited answer."
    : step === null
      ? ""
      : messages[step];

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setStep((current) => (current === null ? null : current + 1)),
      reduced ? 0 : 800,
    );
    return () => window.clearTimeout(timer);
  }, [running, reduced, step]);

  function chooseSample(next: Sample) {
    setSample(next);
    setStep(null);
  }

  function openStage(index: number) {
    // The modal announces its title as soon as it opens.
    flushSync(() => setSelected(index));
    dialog.current?.showModal();
  }
  const instruments = [
    <BriefPreview
      key="brief"
      sample={sample}
      choose={chooseSample}
      busy={running}
      run={() => setStep(reduced ? (checks.every((check) => check.passed) ? 5 : 3) : 0)}
      status={status}
    />,
    <ArchitecturePreview key="architecture" />,
    <BuildPreview key="build" />,
    <TestPreview key="tests" checks={checks} checked={step !== null && step >= 3} />,
    <LaunchPreview key="launch" blocked={blocked} live={live} running={running} />,
  ];
  return (
    <div className={styles.pipeline}>
      <div className={styles.cards} role="group" aria-label="Choose a production stage">
        {stages.map(({ label, summary, checklist }, index) => (
          <ProductionPanel
            key={label}
            className={styles.card}
            data-arrive={index}
            data-current={step === index || undefined}
            data-complete={(step !== null && step > index) || undefined}
            data-blocked={(blocked && index === 3) || undefined}
          >
            <div className={styles.cardHead}>
              <span
                aria-hidden
                className={styles.stageIcon}
                style={{ backgroundPositionX: `${index * 25}%` }}
              />
              <h3>
                <button aria-haspopup="dialog" onClick={() => openStage(index)}>
                  {label}
                  <ArrowOutwardRounded className={styles.openIcon} />
                </button>
              </h3>
              <p>{summary}</p>
            </div>
            <div
              className={styles.instrument}
              role={index === 0 ? "group" : "img"}
              aria-label={
                index === 0 ? "Try the sample release" : `${label} example for a support knowledge assistant`
              }
            >
              {instruments[index]}
            </div>
            <ul className={styles.checklist}>
              {checklist.map((item) => (
                <li key={item}>
                  <CheckRounded />
                  {item}
                </li>
              ))}
            </ul>
            {index < stages.length - 1 && (
              <span className={styles.connector} aria-hidden>
                <ArrowForwardRounded />
                {running && step === index && !reduced && (
                  <motion.i
                    className={styles.signal}
                    aria-hidden
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: [0.7, 1.65], opacity: [0.85, 0] }}
                    transition={{ duration: 0.76, ease: "easeOut" }}
                  />
                )}
              </span>
            )}
          </ProductionPanel>
        ))}
      </div>
      <div className={styles.benefits}>
        {benefits.map(({ label, text, Icon }) => (
          <div key={label} data-arrive={1}>
            <Icon />
            <span>
              <strong>{label}</strong>
              <small>{text}</small>
            </span>
          </div>
        ))}
      </div>
      <dialog
        className={styles.dialog}
        ref={dialog}
        aria-labelledby="production-stage-title"
        onClick={(event) => {
          if (event.target === dialog.current) {
            const bounds = dialog.current.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            )
              dialog.current.close();
          }
        }}
      >
        <div className={styles.dialogTop}>
          <span>{active.label} · Support knowledge search</span>
          <button onClick={() => dialog.current?.close()} aria-label="Close stage details">
            <CloseRounded />
          </button>
        </div>
        <motion.div
          key={selected}
          initial={reduced ? false : { opacity: 0.6, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduced ? 0 : 0.22 }}
        >
          <h3 id="production-stage-title">{active.title}</h3>
          <p>{active.action}</p>
          <dl>
            <div>
              <dt>What you receive</dt>
              <dd>{active.deliverable}</dd>
            </div>
            <div>
              <dt>Ready to advance when</dt>
              <dd>{active.gate}</dd>
            </div>
          </dl>
        </motion.div>
        <nav aria-label="Explore production stages" className={styles.stageNavigation}>
          <button
            type="button"
            disabled={selected === 0}
            onClick={() => setSelected(selected - 1)}
            aria-label="Previous production stage"
          >
            ←
          </button>
          <span aria-live="polite">
            Stage {selected + 1} of {stages.length}
          </span>
          <button
            type="button"
            disabled={selected === stages.length - 1}
            onClick={() => setSelected(selected + 1)}
            aria-label="Next production stage"
          >
            →
          </button>
        </nav>
        <Link href="/process" prefetch={false}>
          See how engagements work <ArrowForwardRounded />
        </Link>
      </dialog>
    </div>
  );
}
