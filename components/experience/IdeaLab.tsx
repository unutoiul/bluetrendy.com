"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import AccountTreeOutlined from "@mui/icons-material/AccountTreeOutlined";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import CalendarTodayOutlined from "@mui/icons-material/CalendarTodayOutlined";
import CheckRounded from "@mui/icons-material/CheckRounded";
import ChecklistRounded from "@mui/icons-material/ChecklistRounded";
import CodeRounded from "@mui/icons-material/CodeRounded";
import DataObjectRounded from "@mui/icons-material/DataObjectRounded";
import FlagOutlined from "@mui/icons-material/FlagOutlined";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import HubOutlined from "@mui/icons-material/HubOutlined";
import InsightsOutlined from "@mui/icons-material/InsightsOutlined";
import LayersOutlined from "@mui/icons-material/LayersOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";
import RocketLaunchOutlined from "@mui/icons-material/RocketLaunchOutlined";
import SavingsOutlined from "@mui/icons-material/SavingsOutlined";
import StorageOutlined from "@mui/icons-material/StorageOutlined";
import ViewInArOutlined from "@mui/icons-material/ViewInArOutlined";
import {
  audienceOptions, dataOptions, estimateAssumption, initialScope,
  integrationOptions, outlineFor, patternOptions, suggestPattern,
} from "./ideaPlan";
import type { Pattern, Scope } from "./ideaPlan";
import EstimateActions from "./EstimateActions";
import RollText from "../motion/RollText";
import type { LabDraft } from "./EstimateActions";
import styles from "./IdeaLab.styles";

const examples = [
  { label: "Support assistant", brief: "Build an assistant that helps support agents answer product questions using our help articles and cites the source.", Icon: ForumOutlined },
  { label: "Operations dashboard", brief: "Give our operations team a dashboard showing which orders are delayed, why they are blocked and who can resolve them.", Icon: InsightsOutlined },
  { label: "Approval workflow", brief: "Automate invoice approvals so our finance team can review exceptions and trace every decision.", Icon: AccountTreeOutlined },
] as const;

let visitDraft: LabDraft | undefined;
const sampleScope: Scope = { ...initialScope, pattern: "assistant", rate: "500" };
const layerIcons = [HubOutlined, LayersOutlined, ChecklistRounded];
function ReactIcon() {
  return <SvgIcon viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1.4">
    {[0,60,120].map(angle => <ellipse key={angle} cx="12" cy="12" rx="10.4" ry="4.1" transform={`rotate(${angle} 12 12)`} />)}
  </g><circle cx="12" cy="12" r="1.85" /></SvgIcon>;
}
function NextIcon() {
  return <SvgIcon viewBox="0 0 24 24"><g stroke="currentColor" strokeWidth="1.55" fill="none">
    <circle cx="12" cy="12" r="9.8" /><path d="M8 16V8l8 11M15.5 7.5V14" /></g></SvgIcon>;
}
function technologyIcon(technology: string) {
  if (technology === "React" || technology === "React Native") return ReactIcon;
  if (technology === "Next.js") return NextIcon;
  if (/python/i.test(technology)) return DataObjectRounded;
  if (/vector/i.test(technology)) return AccountTreeOutlined;
  if (/llm/i.test(technology)) return AutoAwesomeOutlined;
  if (/postgres|sql|database/i.test(technology)) return StorageOutlined;
  if (/model|llm|api|worker|ingestion/i.test(technology)) return HubOutlined;
  if (/typescript|node|python|adapter/i.test(technology)) return DataObjectRounded;
  return CodeRounded;
}

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: readonly string[]; onChange: (value: string) => void;
}) {
  return (
    <label>{label}
      <select value={value} onChange={event => onChange(event.target.value)}>
        {options.map(option => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function EstimateBoard({ scope, sample, brief, draft, onRestore }: {
  scope: Scope; sample: boolean; brief: string; draft: LabDraft; onRestore: (draft: LabDraft) => void;
}) {
  const plan = outlineFor(scope);
  const diagram = useAnimationControls();
  const reduced = useReducedMotion();
  const previous = useRef(scope.pattern);
  useEffect(() => {
    if (previous.current !== scope.pattern && !reduced) {
      void diagram.start({ opacity: [.64, 1], y: [3, 0], transition: { duration: .26, ease: "easeOut" } });
    }
    previous.current = scope.pattern;
  }, [diagram, reduced, scope.pattern]);
  return (
    <section className={styles.board} data-arrive="1" aria-labelledby="lab-board-heading">
      <header className={styles.boardHead}>
        <ViewInArOutlined aria-hidden="true" className={styles.boardMark} />
        <div><h3 id="lab-board-heading">{sample ? "Example project estimate" : "Your project estimate"}</h3>
          <p>{plan.name} <span aria-hidden="true">·</span> {sample ? "Sample brief" : scope.audience}</p></div>
        <EstimateActions estimate={{ brief, scope, sample }} draft={draft} onRestore={onRestore} />
      </header>
      <div className={styles.modules}>
        <section className={styles.tile}>
          <h4><LayersOutlined />Recommended stack</h4>
          <ul className={styles.stack}>
            {plan.stack.split(", ").map(technology => {
              const Icon = technologyIcon(technology);
              return <li key={technology}><Icon />{technology.replace(/^a /i, "")}</li>;
            })}
          </ul>
        </section>
        <section className={styles.tile}>
          <h4><AccountTreeOutlined />Proposed architecture</h4>
          <motion.ol className={styles.system} aria-label="System architecture" initial={false} animate={diagram}>
            <li><PersonOutlineRounded /><span>{plan.nodes[0]}</span></li>
            <li className={styles.systemLayers} aria-label={plan.nodes[1]}>
              {plan.layers.map((layer, index) => {
                const Icon = layerIcons[index];
                return <span key={layer}><Icon />{layer}</span>;
              })}
            </li>
            <li><StorageOutlined /><span>{plan.nodes[2]}</span></li>
          </motion.ol>
        </section>
        <section className={styles.tile}>
          <h4><ChecklistRounded />Key features</h4>
          <ul className={styles.features}>{plan.features.map(feature => <li key={feature}><CheckRounded />{feature}</li>)}</ul>
        </section>
        <section className={styles.tile}>
          <h4><FlagOutlined />Delivery roadmap</h4>
          <ol className={styles.roadmap}>
            <li><b>Discovery</b><small>Agree the scope</small></li>
            <li><b>First release</b><small>Build and test</small></li>
            <li><b>Pilot</b><small>Verify and launch</small></li>
          </ol>
        </section>
      </div>
      <div className={styles.metrics}>
        <section className={styles.tile}><h4><CalendarTodayOutlined />Engineering effort</h4>
          <strong>{plan.effortRange}</strong><p>Engineer-weeks</p>
        </section>
        <section className={styles.tile}><h4><SavingsOutlined />Labour budget</h4>
          {plan.budgetRange
            ? <><strong className={styles.budget}>{plan.budgetRange}</strong><p>{sample ? "Sample rate" : "Day rate"} · £{Number(scope.rate).toLocaleString("en-GB")}/day</p></>
            : <><b>Set a day rate</b><p>Optional during scoping</p></>}
        </section>
        <section className={styles.tile}><h4><FlagOutlined />Suggested next steps</h4>
          <ul className={styles.nextSteps}>{["Confirm first users", scope.integrations === "None" ? "Review source data" : "Map integrations", "Agree the pilot scope"].map(step => <li key={step}><CheckRounded />{step}</li>)}</ul>
        </section>
      </div>
      <div className={styles.boardFoot}>
        <RocketLaunchOutlined className={styles.rocket} />
        <div><b>Ready to build your first release?</b><p>Discuss this outline with a senior engineer.</p></div>
        <Button component={Link} href="/book-a-call" prefetch={false} endIcon={<ArrowForwardRounded />}><RollText>Book a discovery call</RollText></Button>
      </div>
    </section>
  );
}

export default function IdeaLab() {
  const [draft, setDraft] = useState<LabDraft>(() => visitDraft ?? { stage: "idea", brief: "", scope: initialScope });
  const { stage, brief, scope } = draft;
  const [error, setError] = useState("");
  const ideaInput = useRef<HTMLTextAreaElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStage = useRef(stage);
  const plan = outlineFor(scope);

  useEffect(() => { visitDraft = draft; }, [draft]);
  useEffect(() => {
    if (previousStage.current !== stage) {
      heading.current?.focus();
      previousStage.current = stage;
    }
  }, [stage]);

  function go(next: LabDraft["stage"]) {
    setDraft(current => ({ ...current, stage: next }));
    setError("");
  }
  function updateScope<K extends keyof Scope>(key: K, value: Scope[K]) {
    setDraft(current => ({ ...current, scope: { ...current.scope, [key]: value } }));
  }
  function setBrief(value: string) {
    setDraft(current => ({ ...current, brief: value }));
    setError("");
  }
  function explore(event: FormEvent) {
    event.preventDefault();
    if (brief.trim().length < 12) {
      setError("Add a short sentence about the task you want to improve.");
      ideaInput.current?.focus();
      return;
    }
    setDraft(current => ({
      ...current, stage: "scope", brief: current.brief.trim(),
      scope: { ...current.scope, pattern: suggestPattern(current.brief) },
    }));
    setError("");
  }
  const sample = stage === "idea";
  const chosenExample = examples.find(example => example.brief === brief) ?? examples[0];
  return (
    <Box data-lab className={styles.lab}>
      <section className={styles.composer} data-arrive="0" aria-labelledby="lab-form-heading">
        <div className={styles.formHead}><AutoAwesomeOutlined aria-hidden="true" />
          <h3 id="lab-form-heading" ref={heading} tabIndex={-1}>{sample ? "Share your idea" : stage === "scope" ? "Scope your first release" : "Your project outline"}</h3>
        </div>
        {stage === "idea" && (
          <form noValidate onSubmit={explore} className={styles.form}>
            <label htmlFor="lab-idea">Describe what you want to build and who will use it.</label>
            <div className={styles.inputFrame}>
              <textarea id="lab-idea" ref={ideaInput} value={brief} maxLength={1000} rows={4} onChange={event => setBrief(event.target.value)}
                aria-describedby={error ? "lab-error" : "lab-local"} aria-invalid={Boolean(error)}
                placeholder="Build a support assistant that answers product questions from our help centre and flags cases for the team…" />
              <span aria-hidden="true">{brief.length} / 1,000</span>
            </div>
            {error && <p id="lab-error" role="alert" className={styles.error}>{error}</p>}
            <div className={styles.samples}><p>Or try a sample idea</p>
              <div>{examples.map(({ label, brief: value, Icon }) => (
                <Button key={label} type="button" aria-pressed={brief === value} startIcon={<Icon />}
                  onClick={() => { setBrief(value); ideaInput.current?.focus(); }}>{label}</Button>
              ))}</div>
            </div>
            <Button className={styles.generate} type="submit" startIcon={<AutoAwesomeOutlined />} endIcon={<ArrowForwardRounded />}><RollText>Generate project estimate</RollText></Button>
            <p className={styles.local} id="lab-local"><LockOutlined />This rules-based planner runs in your browser.</p>
          </form>
        )}
        {stage === "scope" && (
          <form className={styles.scopeForm} onSubmit={event => { event.preventDefault(); go("result"); }}>
            <label>Project type<select value={scope.pattern} onChange={e => updateScope("pattern", e.target.value as Pattern)}>
              {patternOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select></label>
            <div className={styles.scopeFields}>
              <SelectField label="First users" value={scope.audience} options={audienceOptions} onChange={v => updateScope("audience", v as Scope["audience"])} />
              <SelectField label="Connected systems" value={scope.integrations} options={integrationOptions} onChange={v => updateScope("integrations", v as Scope["integrations"])} />
              <SelectField label="Data requirements" value={scope.data} options={dataOptions} onChange={v => updateScope("data", v as Scope["data"])} />
              <label>Day rate in GBP (optional)<input type="number" inputMode="numeric" min="1" max="100000" step="1" value={scope.rate}
                onChange={e => updateScope("rate", e.target.value)} placeholder="Your rate" /></label>
            </div>
            <Button className={styles.generate} type="submit" endIcon={<ArrowForwardRounded />}><RollText>Create project outline</RollText></Button>
            <Button className={styles.textAction} onClick={() => go("idea")}>Edit idea</Button>
          </form>
        )}
        {stage === "result" && (
          <div className={styles.result}>
            <p>Indicative engineering effort</p><strong>{plan.effort}</strong>
            {plan.budget && <p>Illustrative labour budget · {plan.budget}</p>}
            <p>{estimateAssumption}</p>
            <details><summary>Review your brief and architecture</summary><p>{brief}</p><p>{plan.nodes.join(" → ")}</p>
              <p>{plan.question}</p><p>{plan.discovery}</p><p>{plan.slice}</p><p>{plan.verification}</p></details>
            <p>BlueTrendy confirms scope, schedule and price after a <Link href="/pricing" prefetch={false}>discovery sprint</Link>.</p>
            <Button className={styles.generate} onClick={() => go("scope")}>Refine scope</Button>
          </div>
        )}
      </section>
      <EstimateBoard sample={sample} scope={sample ? { ...sampleScope, pattern: suggestPattern(chosenExample.brief) } : scope}
        brief={sample ? chosenExample.brief : brief} draft={draft} onRestore={saved => { setDraft(saved); setError(""); }} />
    </Box>
  );
}
