"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Box from "@mui/material/Box";
import { useInView, useReducedMotion } from "motion/react";
import type { SvgIconComponent } from "@mui/icons-material";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import LanguageOutlined from "@mui/icons-material/LanguageOutlined";
import MarkEmailReadOutlined from "@mui/icons-material/MarkEmailReadOutlined";
import ManageSearchOutlined from "@mui/icons-material/ManageSearchOutlined";
import RuleOutlined from "@mui/icons-material/RuleOutlined";
import EditCalendarOutlined from "@mui/icons-material/EditCalendarOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import PictureAsPdfOutlined from "@mui/icons-material/PictureAsPdfOutlined";
import CompareArrowsOutlined from "@mui/icons-material/CompareArrowsOutlined";
import ReportProblemOutlined from "@mui/icons-material/ReportProblemOutlined";
import HowToRegOutlined from "@mui/icons-material/HowToRegOutlined";
import HourglassTopOutlined from "@mui/icons-material/HourglassTopOutlined";
import QuestionAnswerOutlined from "@mui/icons-material/QuestionAnswerOutlined";
import PriceCheckOutlined from "@mui/icons-material/PriceCheckOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import PersonAddAltOutlined from "@mui/icons-material/PersonAddAltOutlined";
import CheckRounded from "@mui/icons-material/CheckRounded";
import TaskAltRounded from "@mui/icons-material/TaskAltRounded";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import { neural } from "./neuralStyle";

type Step = { title: string; detail: string; Icon: SvgIconComponent; person?: boolean };
type Example = {
  id: string;
  tab: string;
  TabIcon: SvgIconComponent;
  arrives: { Icon: SvgIconComponent; from: string; meta: string; subject: string; body: string; rows?: [string, string][] };
  steps: Step[];
  result: { title: string; text: string };
};

// Three everyday jobs, small enough to follow in a few seconds. One of them shows the
// agent stopping to ask a person, because that is the part beginners most need to see.
const examples: Example[] = [
  {
    id: "email", tab: "Customer email", TabIcon: MailOutlineRounded,
    arrives: {
      Icon: MailOutlineRounded, from: "Sarah Jones", meta: "Email to your support inbox",
      subject: "Can I change my delivery day?",
      body: "Hi! Could my order 4821 come on Friday instead of Wednesday? I'm away midweek. Thanks, Sarah",
    },
    steps: [
      { title: "Reads the email", detail: "Sarah wants order 4821 moved to Friday.", Icon: MarkEmailReadOutlined },
      { title: "Finds the order", detail: "Looks it up in your shop system: due Wednesday.", Icon: ManageSearchOutlined },
      { title: "Checks your rules", detail: "Changes are free up to two days before delivery. Allowed.", Icon: RuleOutlined },
      { title: "Updates the order", detail: "Sets the delivery day to Friday.", Icon: EditCalendarOutlined },
      { title: "Replies to Sarah", detail: "Sends a friendly confirmation in your company's tone.", Icon: SendOutlined },
    ],
    result: { title: "Delivery moved to Friday", text: "Sarah has her answer, the order is updated and your team can see every step in the log. Nobody had to stop what they were doing." },
  },
  {
    id: "invoice", tab: "Supplier invoice", TabIcon: ReceiptLongOutlined,
    arrives: {
      Icon: PictureAsPdfOutlined, from: "Northline Supplies", meta: "invoice-0412.pdf",
      subject: "Invoice for packaging, March",
      body: "Please find attached our invoice for the March order.",
      rows: [["Purchase order", "PO-1187"], ["Amount due", "£2,340.00"]],
    },
    steps: [
      { title: "Reads the invoice", detail: "Supplier, amount and the 12 items on it.", Icon: ReceiptLongOutlined },
      { title: "Matches the purchase order", detail: "PO-1187 was approved for £2,180.", Icon: CompareArrowsOutlined },
      { title: "Spots a difference", detail: "The invoice is £160 more than agreed.", Icon: ReportProblemOutlined },
      { title: "Asks a person", detail: "Sends both documents to Anna in finance.", Icon: HowToRegOutlined, person: true },
      { title: "Waits for approval", detail: "Nothing is paid until Anna says yes.", Icon: HourglassTopOutlined },
    ],
    result: { title: "Anna decides, the agent does the rest", text: "Invoices that match go straight into your accounts. Anything unusual waits for a person, with the evidence ready." },
  },
  {
    id: "website", tab: "Website question", TabIcon: LanguageOutlined,
    arrives: {
      Icon: QuestionAnswerOutlined, from: "Visitor on your website", meta: "Chat, 10:47 pm",
      subject: "Do you deliver to Leeds?",
      body: "Do you deliver to Leeds, and how much would 50 units cost?",
    },
    steps: [
      { title: "Understands the question", detail: "Delivery to Leeds and a price for 50 units.", Icon: QuestionAnswerOutlined },
      { title: "Checks your price list", detail: "50 units is £1,250, delivery included.", Icon: PriceCheckOutlined },
      { title: "Checks delivery areas", detail: "Leeds is covered, in 3 to 5 working days.", Icon: LocalShippingOutlined },
      { title: "Answers the visitor", detail: "Replies with the price, the timing and a link to order.", Icon: SendOutlined },
      { title: "Tells your sales team", detail: "Adds the lead to your customer list for the morning.", Icon: PersonAddAltOutlined },
    ],
    result: { title: "Answered at 10:48 pm", text: "The visitor gets a real answer straight away, even after hours, and your sales team starts the day with a warm lead." },
  },
];

const stepTime = 1100;
const firstStep = 450;
const personTone = "#ffd27a";

function Caption({ children }: { children: ReactNode }) {
  return <Box component="p" sx={{ m: "0 0 12px", color: "#8fb3d1", fontSize: "0.78rem", fontWeight: 650, letterSpacing: "0.14em", textTransform: "uppercase" }}>
    {children}
  </Box>;
}

/**
 * A short, replayable example of an AI agent at work: something arrives, the agent goes
 * through its steps one at a time, and the result appears. It plays when it scrolls into
 * view; with reduced motion every step is shown at once.
 */
export default function AgentDemo() {
  const [current, setCurrent] = useState(0);
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(panel, { amount: 0.35 });
  const reduced = useReducedMotion();
  const example = examples[current];
  const total = example.steps.length;
  const shown = reduced ? total : progress;
  const finished = shown >= total;

  useEffect(() => {
    if (reduced || !inView) return;
    // Only ever moves forward, so leaving and coming back mid-run picks up where it was.
    const timers = example.steps.map((_, index) =>
      window.setTimeout(() => setProgress(value => Math.max(value, index + 1)), firstStep + index * stepTime));
    return () => timers.forEach(timer => window.clearTimeout(timer));
  }, [example, inView, reduced, run]);

  function show(index: number) {
    setCurrent(index);
    setProgress(0);
    setRun(value => value + 1);
  }

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next = index;
    if (event.key in keys) next = (index + keys[event.key] + examples.length) % examples.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = examples.length - 1;
    else return;
    event.preventDefault();
    tabs.current[next]?.focus();
    show(next);
  }

  return (
    <Box ref={panel} sx={{
      ...neural.glassCard, backdropFilter: "blur(8px)", borderRadius: "22px", p: { xs: 2, sm: 3, md: 3.5 },
      "&::after": { display: "none" }, "& > *": { position: "relative", zIndex: 1 },
      "&:hover, &:focus-visible, &:focus-within": {},
    }}>
      {/* Which example to watch */}
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Box component="p" sx={{ ...neural.label, m: 0 }}>Watch an agent at work</Box>
        <Box role="tablist" aria-label="Example tasks" sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 0.5, p: 0.5,
          width: { xs: "100%", sm: "auto" }, borderRadius: "14px", background: "rgba(3, 12, 30, 0.6)", border: "1px solid rgba(86, 156, 222, 0.3)" }}>
          {examples.map(({ id, tab, TabIcon }, index) => {
            const selected = index === current;
            return (
              <Box component="button" type="button" key={id} role="tab" id={`agent-tab-${id}`} aria-selected={selected}
                aria-controls="agent-example" tabIndex={selected ? 0 : -1}
                ref={(node: HTMLButtonElement | null) => { tabs.current[index] = node; }}
                onClick={() => show(index)} onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => moveFocus(event, index)}
                sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", justifyContent: "center", gap: { xs: 0.5, sm: 1 },
                  minHeight: 44, px: { xs: 1, sm: 1.75 }, py: 0.75, border: 0, borderRadius: "10px", cursor: "pointer", font: "inherit",
                  fontSize: { xs: "0.78rem", sm: "0.88rem" }, fontWeight: 600, lineHeight: 1.2, textAlign: "center",
                  color: selected ? "#04172e" : "#b9d4ea",
                  background: selected ? "linear-gradient(125deg, #c6f3ff, #83d6ff 68%, #69bcff)" : "transparent",
                  boxShadow: selected ? "0 6px 18px -8px rgba(60, 180, 255, 0.8)" : "none",
                  transition: "background-color 0.25s ease, color 0.25s ease",
                  "&:hover": selected ? {} : { color: "#eaf8ff", background: "rgba(80, 170, 255, 0.12)" },
                  "&:focus-visible": { outline: "2px solid #a8ecff", outlineOffset: 2 },
                  "& svg": { fontSize: 18 } }}>
                <TabIcon aria-hidden="true" />
                {tab}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box role="tabpanel" id="agent-example" aria-labelledby={`agent-tab-${example.id}`} sx={{ mt: { xs: 2.5, md: 3.5 } }}>
        <Box sx={{ display: "grid", gap: { xs: 3, md: 3.5 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 0.9fr) minmax(0, 1.1fr)" } }}>

          {/* What comes in */}
          <div>
            <Caption>What comes in</Caption>
            <Box sx={{ position: "relative", overflow: "hidden", borderRadius: "16px", p: 2.25,
              border: "1px solid rgba(142, 214, 255, 0.28)",
              background: "linear-gradient(170deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.03))",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 18px 40px -26px rgba(0, 0, 0, 0.9)" }}>
              {/* While the agent reads, a band of light passes down the message. */}
              {shown === 0 && !reduced && inView && <Box aria-hidden="true" key={run} sx={{ position: "absolute", left: 0, right: 0, height: "40%", top: "-40%",
                pointerEvents: "none", background: "linear-gradient(180deg, transparent, rgba(111, 220, 255, 0.16), transparent)",
                animation: `agent-read 1.4s ${neural.ease} ${firstStep}ms infinite`,
                "@keyframes agent-read": { from: { top: "-40%" }, to: { top: "100%" } } }} />}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box aria-hidden="true" sx={{ display: "grid", placeItems: "center", flex: "none", width: 40, height: 40, borderRadius: "12px", color: "#04172e",
                  background: "linear-gradient(140deg, #c6f3ff, #6cc4ff)", "& svg": { fontSize: 22 } }}>
                  <example.arrives.Icon />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ fontWeight: 650, color: "#f1f8ff", fontSize: "0.95rem" }}>{example.arrives.from}</Box>
                  <Box sx={{ color: "#8fb3d1", fontSize: "0.82rem", overflowWrap: "anywhere" }}>{example.arrives.meta}</Box>
                </Box>
              </Box>
              <Box sx={{ mt: 2, fontWeight: 650, color: "#eaf6ff", fontSize: "1rem" }}>{example.arrives.subject}</Box>
              <Box component="p" sx={{ m: "6px 0 0", color: "#c3d6ea", lineHeight: 1.55, fontSize: "0.93rem" }}>{example.arrives.body}</Box>
              {example.arrives.rows && <Box component="dl" sx={{ m: "14px 0 0", display: "grid", gap: 0.75, pt: 1.5, borderTop: "1px dashed rgba(142, 214, 255, 0.3)" }}>
                {example.arrives.rows.map(([term, value]) => (
                  <Box key={term} sx={{ display: "flex", justifyContent: "space-between", gap: 2, fontSize: "0.9rem" }}>
                    <Box component="dt" sx={{ color: "#8fb3d1" }}>{term}</Box>
                    <Box component="dd" sx={{ m: 0, color: "#f1f8ff", fontWeight: 650, fontFamily: "var(--font-mono), monospace" }}>{value}</Box>
                  </Box>
                ))}
              </Box>}
            </Box>
          </div>

          {/* What the agent does, one step at a time */}
          <div>
            <Caption>What the agent does</Caption>
            <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, position: "relative", display: "grid", gap: 0.5 }}>
              {example.steps.map(({ title, detail, Icon, person }, index) => {
                const done = index < shown;
                const active = index === shown && !finished;
                const accent = person ? personTone : "#6fdcff";
                return (
                  <Box component="li" key={`${example.id}-${title}`} sx={{ position: "relative", display: "grid", gridTemplateColumns: "40px minmax(0, 1fr)",
                    columnGap: 1.75, alignItems: "start", py: 0.75, opacity: done || active ? 1 : 0.42,
                    transition: `opacity 0.45s ${neural.ease}`,
                    // The thread between markers fills in as the agent moves on.
                    "&:not(:last-of-type)::after": { content: '""', position: "absolute", left: 19, top: 48, bottom: -6, width: 2, borderRadius: 2,
                      background: done ? "linear-gradient(180deg, #6fdcff, rgba(111, 220, 255, 0.35))" : "rgba(142, 214, 255, 0.16)",
                      transition: "background 0.45s ease" } }}>
                    <Box aria-hidden="true" sx={{ position: "relative", display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: "12px",
                      color: done ? "#04172e" : accent,
                      background: done ? (person ? `linear-gradient(140deg, #fff0c9, ${personTone})` : "linear-gradient(140deg, #c6f3ff, #6cc4ff)") : "rgba(4, 16, 36, 0.7)",
                      border: `1px solid ${active || done ? accent : "rgba(142, 214, 255, 0.3)"}`,
                      boxShadow: active ? `0 0 0 4px ${person ? "rgba(255, 210, 122, 0.16)" : "rgba(111, 220, 255, 0.14)"}, 0 0 22px ${person ? "rgba(255, 190, 80, 0.45)" : "rgba(40, 170, 255, 0.55)"}` : "none",
                      transition: `background 0.4s ease, box-shadow 0.4s ease, color 0.4s ease, border-color 0.4s ease`,
                      "& svg": { fontSize: 21 } }}>
                      {done ? <CheckRounded /> : <Icon />}
                    </Box>
                    <Box sx={{ minWidth: 0, pt: "2px" }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                        <Box component="span" sx={{ fontWeight: 650, color: "#f1f8ff", fontSize: "0.98rem" }}>{title}</Box>
                        {person && <Box component="span" sx={{ px: 1, py: "1px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em",
                          color: "#2a1a00", background: personTone }}>A person decides</Box>}
                        {active && <Box component="span" aria-hidden="true" sx={{ display: "inline-flex", gap: "3px", ml: 0.5,
                          "& i": { width: 5, height: 5, borderRadius: "2px", background: accent, animation: "agent-dot 1s ease-in-out infinite" },
                          "& i:nth-of-type(2)": { animationDelay: "0.15s" }, "& i:nth-of-type(3)": { animationDelay: "0.3s" },
                          "@keyframes agent-dot": { "0%, 100%": { opacity: 0.25, transform: "translateY(0)" }, "50%": { opacity: 1, transform: "translateY(-3px)" } } }}>
                          <i /><i /><i />
                        </Box>}
                      </Box>
                      <Box component="p" sx={{ m: "3px 0 0", color: "#b9cde2", fontSize: "0.9rem", lineHeight: 1.5 }}>{detail}</Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </div>
        </Box>

        {/* What you get */}
        <Box sx={{ mt: { xs: 3, md: 3.5 }, display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { sm: "center" }, gap: 2,
          p: { xs: 2, md: 2.5 }, borderRadius: "16px",
          border: `1px solid ${finished ? "rgba(111, 220, 255, 0.55)" : "rgba(142, 214, 255, 0.18)"}`,
          background: finished ? "linear-gradient(110deg, rgba(40, 140, 255, 0.22), rgba(111, 220, 255, 0.08))" : "rgba(4, 16, 36, 0.35)",
          transition: "background 0.5s ease, border-color 0.5s ease" }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, flex: 1, minWidth: 0 }}>
            <TaskAltRounded aria-hidden="true" sx={{ flex: "none", mt: "2px", fontSize: 26, color: finished ? "#8eeaff" : "#4f6f8f", transition: "color 0.4s ease" }} />
            <Box sx={{ minWidth: 0 }}>
              <Box component="p" sx={{ m: 0, color: "#8fb3d1", fontSize: "0.78rem", fontWeight: 650, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {finished ? "What you get" : `Working… step ${Math.min(shown + 1, total)} of ${total}`}
              </Box>
              <Box sx={{ opacity: finished ? 1 : 0.45, transition: "opacity 0.5s ease" }}>
                <Box component="p" sx={{ m: "4px 0 0", fontWeight: 650, color: "#f1f8ff", fontSize: "1.05rem" }}>{example.result.title}</Box>
                <Box component="p" sx={{ m: "4px 0 0", color: "#c3d6ea", lineHeight: 1.55, fontSize: "0.93rem" }}>{example.result.text}</Box>
              </Box>
            </Box>
          </Box>
          {!reduced && <Box component="button" type="button" onClick={() => show(current)} disabled={!finished}
            sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 0.75, flex: "none", minHeight: 44, px: 2, borderRadius: 99,
              border: "1px solid rgba(111, 220, 255, 0.45)", background: "transparent", color: "#bff3ff", font: "inherit", fontSize: "0.88rem", fontWeight: 650,
              cursor: "pointer", transition: "background-color 0.25s ease, opacity 0.25s ease",
              "&:hover:not(:disabled)": { background: "rgba(40, 140, 255, 0.16)" },
              "&:disabled": { opacity: 0.4, cursor: "default" },
              "&:focus-visible": { outline: "2px solid #a8ecff", outlineOffset: 2 },
              "& svg": { fontSize: 18 } }}>
            <ReplayRounded aria-hidden="true" /> Watch again
          </Box>}
        </Box>
      </Box>
    </Box>
  );
}
