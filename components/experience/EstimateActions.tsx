"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Button from "@mui/material/Button";
import BookmarkBorderRounded from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRounded from "@mui/icons-material/BookmarkRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import DownloadOutlined from "@mui/icons-material/DownloadOutlined";
import IosShareRounded from "@mui/icons-material/IosShareRounded";
import PrintOutlined from "@mui/icons-material/PrintOutlined";
import { motion, useReducedMotion } from "motion/react";
import { audienceOptions, dataOptions, downloadOutline, estimateAssumption, formatOutline, integrationOptions, outlineFor, patternOptions } from "./ideaPlan";
import type { Scope } from "./ideaPlan";
import styles from "./IdeaLab.styles";

export type LabDraft = { stage: "idea" | "scope" | "result"; brief: string; scope: Scope };
type Action = "save" | "share" | "export";
type Estimate = { brief: string; scope: Scope; sample: boolean };
const storageKey = "bluetrendy:idea-lab:1";
const savedChange = "bluetrendy-lab-save";

function currentSave() {
  try { return localStorage.getItem(storageKey); } catch { return null; }
}
function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(savedChange, notify);
  return () => { window.removeEventListener("storage", notify); window.removeEventListener(savedChange, notify); };
}
function parseSave(raw: string | null): LabDraft | null {
  if (!raw) return null;
  try {
    const { version, draft } = JSON.parse(raw);
    const scope = draft?.scope;
    if (version !== 1 || !["idea","scope","result"].includes(draft?.stage) ||
        typeof draft.brief !== "string" || draft.brief.length > 1000 ||
        !scope || !patternOptions.some(option => option.value === scope.pattern) ||
        !audienceOptions.includes(scope.audience) || !integrationOptions.includes(scope.integrations) ||
        !dataOptions.includes(scope.data) || typeof scope.rate !== "string" || scope.rate.length > 20) return null;
    return draft;
  } catch { return null; }
}

function PrintEstimate({ brief, scope, sample }: Estimate) {
  const plan = outlineFor(scope);
  return createPortal(
    <article className={styles.printSheet} data-printed-estimate>
      <header><strong>BlueTrendy Intelligence</strong><span>AI Idea Lab</span></header>
      <h1>{sample ? "Example project estimate" : "Project estimate"}</h1>
      <p className={styles.printLead}>{plan.name} · {scope.audience}</p>
      <section><h2>Project brief</h2><p>{brief}</p></section>
      <div className={styles.printColumns}>
        <section><h2>Engineering effort</h2><strong>{plan.effort}</strong></section>
        <section><h2>Labour budget</h2><strong>{plan.budget ?? "Day rate to be agreed"}</strong>{sample && <p>Illustrative example rate</p>}</section>
      </div>
      <section><h2>Scope and architecture</h2><p>First users · {scope.audience}<br />Connected systems · {scope.integrations}<br />Data requirements · {scope.data}</p>
        <p>{plan.nodes.join(" → ")}<br />{plan.layers.join(" · ")}</p><p><b>Suggested stack</b> · {plan.stack}</p></section>
      <section><h2>First-release features</h2><p>{plan.features.join(" · ")}</p></section>
      <section><h2>Delivery roadmap</h2><ol><li><b>Discovery.</b> {plan.discovery}</li><li><b>First release.</b> {plan.slice}</li><li><b>Pilot.</b> {plan.verification}</li></ol></section>
      <section><h2>Next step</h2><p>{plan.question}</p></section>
      <footer>{estimateAssumption} BlueTrendy confirms scope, schedule and price after discovery.</footer>
    </article>, document.body,
  );
}

function sharedSummary(scope: Scope, sample: boolean) {
  const plan = outlineFor(scope);
  return [
    "BlueTrendy Intelligence · " + (sample ? "Example project estimate" : "Project estimate"),
    plan.name + " · " + plan.effort, "", plan.slice,
    "Architecture · " + plan.nodes.join(" → "), "Suggested stack · " + plan.stack,
    "", "Indicative engineering effort for one senior engineer, subject to discovery.",
  ].join("\n");
}

export default function EstimateActions({ estimate, draft, onRestore }: {
  estimate: Estimate; draft: LabDraft; onRestore: (draft: LabDraft) => void;
}) {
  const raw = useSyncExternalStore(subscribe, currentSave, () => null);
  const saved = parseSave(raw);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const text = useRef<HTMLTextAreaElement>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [notice, setNotice] = useState("");
  const [copyText, setCopyText] = useState(false);
  const reduced = useReducedMotion();
  const summary = sharedSummary(estimate.scope, estimate.sample);
  const selectedDraft: LabDraft = draft.brief.trim() ? draft : { stage: "scope", brief: estimate.brief, scope: estimate.scope };
  const sameSave = saved && JSON.stringify(saved) === JSON.stringify(selectedDraft);

  useEffect(() => {
    if (action && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [action]);

  function open(next: Action, button: HTMLButtonElement) {
    trigger.current = button;
    setNotice("");
    setCopyText(false);
    setAction(next);
  }
  function close() {
    dialog.current?.close();
    setAction(null);
    trigger.current?.focus({ preventScroll: true });
  }
  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, draft: selectedDraft }));
      window.dispatchEvent(new Event(savedChange));
      setNotice("Saved on this device.");
    } catch { setNotice("This browser could not save the estimate. Export a copy to keep it."); }
  }
  function remove() {
    try {
      localStorage.removeItem(storageKey);
      window.dispatchEvent(new Event(savedChange));
      setNotice("Saved estimate removed.");
    } catch { setNotice("Storage is unavailable. You can clear this site’s data in browser settings."); }
  }
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice("Copied to clipboard.");
    } catch {
      setCopyText(true);
      setNotice("Select and copy the text below.");
      requestAnimationFrame(() => { text.current?.focus(); text.current?.select(); });
    }
  }
  async function share() {
    if (typeof navigator.share !== "function") { await copy(summary); return; }
    try {
      await navigator.share({ title: "BlueTrendy project estimate", text: summary });
      setNotice("Summary shared.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      await copy(summary);
    }
  }
  return (
    <div className={styles.tools}>
      <Button className={styles.download} startIcon={sameSave ? <BookmarkRounded /> : <BookmarkBorderRounded />}
        onClick={e => open("save", e.currentTarget)} aria-haspopup="dialog" title="Save or restore an estimate on this device">{sameSave ? "Saved" : "Save"}</Button>
      <Button className={styles.download} startIcon={<IosShareRounded />} onClick={e => open("share", e.currentTarget)} aria-haspopup="dialog">Share</Button>
      <Button className={styles.download} startIcon={<DownloadOutlined />} onClick={e => open("export", e.currentTarget)} aria-haspopup="dialog">Export PDF</Button>
      {action && createPortal(<dialog ref={dialog} className={styles.actionDialog} aria-labelledby="lab-action-title" onCancel={e => { e.preventDefault(); close(); }}>
        <motion.div initial={reduced ? false : { opacity: .8, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{duration:.18}}>
          <header><h3 id="lab-action-title">{action === "save" ? "Save on this device" : action === "share" ? "Share a project summary" : "Export your estimate"}</h3>
            <Button onClick={close} aria-label="Close estimate options"><CloseRounded /></Button>
          </header>
          {action === "save" && <>
            <p>Save the written brief, scope and day rate in this browser. You can reopen or remove the saved estimate here.</p>
            {saved && <p className={styles.savedEntry}><BookmarkRounded />Saved estimate · {outlineFor(saved.scope).name}</p>}
            <div className={styles.dialogActions}>
              <Button className={styles.dialogMain} onClick={save}>{saved && !sameSave ? "Replace saved estimate" : "Save estimate"}</Button>
              {saved && <><Button onClick={() => { onRestore(saved); close(); }}>Open saved estimate</Button><Button onClick={remove}>Remove saved estimate</Button></>}
            </div>
          </>}
          {action === "share" && <>
            <p>Share the estimate below. Your written brief and budget stay private.</p>
            <textarea ref={text} readOnly value={summary} aria-label="Summary to share" />
            <div className={styles.dialogActions}>
              <Button className={styles.dialogMain} onClick={share}>{typeof navigator.share === "function" ? "Share summary" : "Copy summary"}</Button>
              {typeof navigator.share === "function" && <Button onClick={() => copy(summary)}>Copy summary</Button>}
            </div>
          </>}
          {action === "export" && <>
            <p>The report includes your brief, architecture, stages and estimate. Choose <b>Save as PDF</b> as the destination in the print dialog.</p>
            <div className={styles.dialogActions}>
              <Button className={styles.dialogMain} startIcon={<PrintOutlined />} onClick={() => {
                if (typeof window.print === "function") window.print();
                else setNotice("Printing is unavailable. Download the text outline below.");
              }}>Print / Save as PDF</Button>
              <Button onClick={() => downloadOutline(estimate.brief, estimate.scope)}>{estimate.sample ? "Download example" : "Download outline"}</Button>
              <Button onClick={() => copy(formatOutline(estimate.brief, estimate.scope))}>Copy full outline</Button>
            </div>
            {copyText && <textarea ref={text} readOnly aria-label="Full outline to copy" value={formatOutline(estimate.brief, estimate.scope)} />}
            <PrintEstimate {...estimate} />
          </>}
          <p className={styles.actionNotice} role="status">{notice}</p>
        </motion.div>
      </dialog>, document.body)}
    </div>
  );
}
