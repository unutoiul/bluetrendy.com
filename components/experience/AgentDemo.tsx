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
import CheckRounded from "@mui/icons-material/CheckRounded";
import TaskAltRounded from "@mui/icons-material/TaskAltRounded";
import ReplayRounded from "@mui/icons-material/ReplayRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import FactCheckOutlined from "@mui/icons-material/FactCheckOutlined";
import ContactsOutlined from "@mui/icons-material/ContactsOutlined";
import EditNoteOutlined from "@mui/icons-material/EditNoteOutlined";
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined";
import InsightsOutlined from "@mui/icons-material/InsightsOutlined";
import HotelOutlined from "@mui/icons-material/HotelOutlined";
import TranslateOutlined from "@mui/icons-material/TranslateOutlined";
import RoomServiceOutlined from "@mui/icons-material/RoomServiceOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import ScheduleSendOutlined from "@mui/icons-material/ScheduleSendOutlined";
import CampaignOutlined from "@mui/icons-material/CampaignOutlined";
import QueryStatsOutlined from "@mui/icons-material/QueryStatsOutlined";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import StraightenOutlined from "@mui/icons-material/StraightenOutlined";
import Link from "next/link";
import { neural } from "./neuralStyle";
import ActionButton from "@/components/ActionButton";
import SampleBadge from "@/components/lab/SampleBadge";
import { trackEvent } from "@/lib/analytics";
import { palette, withAlpha } from "@/theme/palette";

type Step = { title: string; detail: string; Icon: SvgIconComponent; person?: boolean };
export type ScenarioId = "sales" | "service" | "finance" | "hotel" | "marketing" | "forecast";
type Example = {
  id: ScenarioId;
  tab: string;
  TabIcon: SvgIconComponent;
  arrives: { Icon: SvgIconComponent; from: string; meta: string; subject: string; body: string; rows?: [string, string][] };
  steps: Step[];
  result: { title: string; text: string };
  /** The number we would track to show the workflow paid off. */
  measure: string;
};

// Six everyday jobs across a business, each small enough to follow in a few seconds. Most
// stop to ask a person at some point, because that is the part newcomers most need to see.
// Every name, message and figure is made up for the demonstration.
const allExamples: Example[] = [
  {
    id: "sales", tab: "Sales", TabIcon: TrendingUpRounded,
    arrives: {
      Icon: LanguageOutlined, from: "Website enquiry form", meta: "Tuesday, 9:12 pm",
      subject: "Booking system for 40 staff?",
      body: "We’re a 40-person firm and want to replace our booking system this quarter. Could someone call me? Priya, Operations Director",
    },
    steps: [
      { title: "Qualifies the lead", detail: "40 staff, a decision-maker, buying this quarter. A strong fit.", Icon: FactCheckOutlined },
      { title: "Updates your CRM", detail: "Creates the contact and the opportunity, with the enquiry attached.", Icon: ContactsOutlined },
      { title: "Drafts a personal reply", detail: "Answers Priya’s question and offers two times for a call.", Icon: EditNoteOutlined },
      { title: "Checks with a person", detail: "A deal this size goes to Tom in sales, who approves the reply.", Icon: HowToRegOutlined, person: true },
      { title: "Schedules the follow-up", detail: "Priya picks Thursday at 10:00. It goes in the sales calendar.", Icon: EventAvailableOutlined },
      { title: "Reports the result", detail: "Adds the lead and its source to this week’s pipeline report.", Icon: InsightsOutlined },
    ],
    result: { title: "From enquiry to booked call, the same evening", text: "The lead is qualified, recorded and booked while the interest is fresh. Your team starts the morning with the meeting already in the diary." },
    measure: "Lead-to-meeting conversion",
  },
  {
    id: "service", tab: "Service", TabIcon: MailOutlineRounded,
    arrives: {
      Icon: MailOutlineRounded, from: "Sarah Jones", meta: "Email to your support inbox",
      subject: "Can I change my delivery day?",
      body: "Hi! Could my order 4821 come on Friday instead of Wednesday? I’m away midweek. Thanks, Sarah",
    },
    steps: [
      { title: "Reads the email", detail: "Sarah wants order 4821 moved to Friday.", Icon: MarkEmailReadOutlined },
      { title: "Finds the order", detail: "Looks it up in your shop system: due Wednesday.", Icon: ManageSearchOutlined },
      { title: "Checks your rules", detail: "Changes are free up to two days before delivery. Allowed.", Icon: RuleOutlined },
      { title: "Updates the order", detail: "Sets the delivery day to Friday.", Icon: EditCalendarOutlined },
      { title: "Replies to Sarah", detail: "Sends a friendly confirmation in your company’s tone.", Icon: SendOutlined },
    ],
    result: { title: "Delivery moved to Friday", text: "Sarah has her answer, the order is updated and your team can see every step in the log. Nobody had to stop what they were doing." },
    measure: "Hours saved and accurate resolution",
  },
  {
    id: "finance", tab: "Finance", TabIcon: ReceiptLongOutlined,
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
    measure: "Processing time and exception rate",
  },
  {
    id: "hotel", tab: "Hotel", TabIcon: HotelOutlined,
    arrives: {
      Icon: HotelOutlined, from: "Your booking engine", meta: "New reservation, 2 nights",
      subject: "Deluxe double, 14 to 16 June",
      body: "Guest note: arriving around 11 pm, celebrating an anniversary. Is a late check-in possible?",
      rows: [["Guest", "M. Laurent"], ["Booked", "Direct, £420.00"]],
    },
    steps: [
      { title: "Drafts the confirmation", detail: "Dates, room and rate, written in French for this guest.", Icon: TranslateOutlined },
      { title: "Answers the question", detail: "Late check-in is fine: reception is open until midnight.", Icon: QuestionAnswerOutlined },
      { title: "Tells housekeeping", detail: "Room ready by 3 pm, anniversary noted on the booking.", Icon: RoomServiceOutlined },
      { title: "Asks the duty manager", detail: "A complimentary upgrade is a manager’s decision.", Icon: HowToRegOutlined, person: true },
      { title: "Sends the confirmation", detail: "With directions and a link to manage the booking.", Icon: SendOutlined },
    ],
    result: { title: "Confirmed, answered and coordinated", text: "The guest has a personal confirmation, operations know what to prepare, and the manager made the one decision that needed a person." },
    measure: "Direct booking revenue",
  },
  {
    id: "marketing", tab: "Marketing", TabIcon: CampaignOutlined,
    arrives: {
      Icon: ShoppingCartOutlined, from: "Your online shop", meta: "Basket left 2 hours ago",
      subject: "Two items, not checked out",
      body: "Jamie added two items and left at the delivery step.",
      rows: [["Basket value", "£86.00"], ["Marketing consent", "Yes, by email"]],
    },
    steps: [
      { title: "Checks consent", detail: "Jamie agreed to marketing emails, so a follow-up is allowed.", Icon: VerifiedUserOutlined },
      { title: "Picks the segment", detail: "A returning customer, on a second order this year.", Icon: GroupsOutlined },
      { title: "Writes the reminder", detail: "The two items, the delivery options and a link back to the basket.", Icon: EditNoteOutlined },
      { title: "Sends at a good time", detail: "Tonight at 7 pm, with a working unsubscribe link.", Icon: ScheduleSendOutlined },
      { title: "Records the result", detail: "Opened, clicked or bought, for the A/B test report.", Icon: InsightsOutlined },
    ],
    result: { title: "A reminder that respects consent", text: "Follow-up goes out on time, only to people who agreed to it, and each send shows the next campaign what works." },
    measure: "Orders recovered and repeat purchases",
  },
  {
    id: "forecast", tab: "Forecast", TabIcon: QueryStatsOutlined,
    arrives: {
      Icon: QueryStatsOutlined, from: "Your sales system", meta: "Weekly export, Monday 6:00 am",
      subject: "Last week’s sales, 214 products",
      body: "Sales, stock levels and open purchase orders for every product.",
      rows: [["Fast seller", "Oat bars, 12-pack"], ["Stock left", "About 9 days"]],
    },
    steps: [
      { title: "Updates the forecast", detail: "Demand for the next four weeks, as a range for each product.", Icon: InsightsOutlined },
      { title: "Spots a risk", detail: "Oat bars are likely to run out in 9 to 12 days.", Icon: ReportProblemOutlined },
      { title: "Drafts a purchase order", detail: "600 units from the usual supplier, to arrive within a week.", Icon: ReceiptLongOutlined },
      { title: "Asks the buyer", detail: "Sam approves, changes or rejects the order.", Icon: HowToRegOutlined, person: true },
      { title: "Checks its own accuracy", detail: "Compares last week’s forecast with what really sold.", Icon: RuleOutlined },
    ],
    result: { title: "A warning with nine days to act", text: "Buyers see likely shortages early, with an order ready to approve. The forecast is checked against real sales every week." },
    measure: "Forecast error and stockouts",
  },
];

const stepTime = 1100;
const firstStep = 450;
const personTone = palette.amber[175];

function Caption({ children }: { children: ReactNode }) {
  return <Box component="p" sx={{ m: "0 0 12px", color: palette.slate[275], fontSize: "0.78rem", fontWeight: 650, letterSpacing: "0.14em", textTransform: "uppercase" }}>
    {children}
  </Box>;
}

/**
 * A short, replayable example of an AI agent at work: something arrives, the agent goes
 * through its steps one at a time, and the result appears. It plays when it scrolls into
 * view; with reduced motion every step is shown at once.
 */
type AgentDemoProps = {
  /** Which examples to offer, in order. All six when left out. */
  scenarios?: ScenarioId[];
  label?: string;
  /** Where "build one like this" leads. */
  cta?: { href: string; label: string };
};

export default function AgentDemo({ scenarios, label = "Watch AI run a business", cta = { href: "/ai-agents", label: "Build an agent like this" } }: AgentDemoProps) {
  const examples = scenarios ? scenarios.flatMap(id => allExamples.filter(example => example.id === id)) : allExamples;
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
    if (index !== current) trackEvent("demo_scenario_view", { scenario: examples[index].id });
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
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
        <Box component="p" sx={{ ...neural.label, m: 0 }}>{label}</Box>
        <SampleBadge />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Box role="tablist" aria-label="Example tasks" sx={{ display: "grid", gap: 0.5, p: 0.5,
          gridTemplateColumns: { xs: `repeat(${Math.min(3, examples.length)}, minmax(0, 1fr))`, sm: `repeat(${examples.length}, minmax(0, 1fr))` },
          borderRadius: "14px", background: withAlpha(palette.navy[850], 0.6), border: `1px solid ${withAlpha(palette.blue[325], 0.3)}` }}>
          {examples.map(({ id, tab, TabIcon }, index) => {
            const selected = index === current;
            return (
              <Box component="button" type="button" key={id} role="tab" id={`agent-tab-${id}`} aria-selected={selected}
                aria-controls="agent-example" tabIndex={selected ? 0 : -1}
                ref={(node: HTMLButtonElement | null) => { tabs.current[index] = node; }}
                onClick={() => show(index)} onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => moveFocus(event, index)}
                sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, alignItems: "center", justifyContent: "center", gap: { xs: 0.5, lg: 0.75 },
                  minHeight: 44, px: { xs: 0.75, lg: 1 }, py: 0.75, border: 0, borderRadius: "10px", cursor: "pointer", font: "inherit",
                  fontSize: { xs: "0.78rem", lg: "0.86rem" }, fontWeight: 600, lineHeight: 1.2, textAlign: "center",
                  color: selected ? palette.navy[800] : palette.slate[125],
                  background: selected ? `linear-gradient(125deg, ${palette.slate[75]}, ${palette.sky[175]} 68%, ${palette.blue[250]})` : "transparent",
                  boxShadow: selected ? `0 6px 18px -8px ${withAlpha(palette.blue[250], 0.8)}` : "none",
                  transition: "background-color 0.25s ease, color 0.25s ease",
                  "&:hover": selected ? {} : { color: palette.grey[25], background: withAlpha(palette.blue[300], 0.12) },
                  "&:focus-visible": { outline: `2px solid ${palette.sky[100]}`, outlineOffset: 2 },
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
              border: `1px solid ${withAlpha(palette.sky[175], 0.28)}`,
              background: `linear-gradient(170deg, ${withAlpha(palette.white, 0.09)}, ${withAlpha(palette.white, 0.03)})`,
              boxShadow: `inset 0 1px 0 ${withAlpha(palette.white, 0.12)}, 0 18px 40px -26px ${withAlpha(palette.black, 0.9)}` }}>
              {/* While the agent reads, a band of light passes down the message. */}
              {shown === 0 && !reduced && inView && <Box aria-hidden="true" key={run} sx={{ position: "absolute", left: 0, right: 0, height: "40%", top: "-40%",
                pointerEvents: "none", background: `linear-gradient(180deg, transparent, ${withAlpha(palette.sky[150], 0.16)}, transparent)`,
                animation: `agent-read 1.4s ${neural.ease} ${firstStep}ms infinite`,
                "@keyframes agent-read": { from: { top: "-40%" }, to: { top: "100%" } } }} />}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box aria-hidden="true" sx={{ display: "grid", placeItems: "center", flex: "none", width: 40, height: 40, borderRadius: "12px", color: palette.navy[800],
                  background: `linear-gradient(140deg, ${palette.slate[75]}, ${palette.blue[200]})`, "& svg": { fontSize: 22 } }}>
                  <example.arrives.Icon />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ fontWeight: 650, color: palette.grey[25], fontSize: "0.95rem" }}>{example.arrives.from}</Box>
                  <Box sx={{ color: palette.slate[275], fontSize: "0.82rem", overflowWrap: "anywhere" }}>{example.arrives.meta}</Box>
                </Box>
              </Box>
              <Box sx={{ mt: 2, fontWeight: 650, color: palette.grey[25], fontSize: "1rem" }}>{example.arrives.subject}</Box>
              <Box component="p" sx={{ m: "6px 0 0", color: palette.slate[125], lineHeight: 1.55, fontSize: "0.93rem" }}>{example.arrives.body}</Box>
              {example.arrives.rows && <Box component="dl" sx={{ m: "14px 0 0", display: "grid", gap: 0.75, pt: 1.5, borderTop: `1px dashed ${withAlpha(palette.sky[175], 0.3)}` }}>
                {example.arrives.rows.map(([term, value]) => (
                  <Box key={term} sx={{ display: "flex", justifyContent: "space-between", gap: 2, fontSize: "0.9rem" }}>
                    <Box component="dt" sx={{ color: palette.slate[275] }}>{term}</Box>
                    <Box component="dd" sx={{ m: 0, color: palette.grey[25], fontWeight: 650, fontFamily: "var(--font-mono), monospace" }}>{value}</Box>
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
                const accent = person ? personTone : palette.sky[150];
                return (
                  <Box component="li" key={`${example.id}-${title}`} sx={{ position: "relative", display: "grid", gridTemplateColumns: "40px minmax(0, 1fr)",
                    columnGap: 1.75, alignItems: "start", py: 0.75, opacity: done || active ? 1 : 0.42,
                    transition: `opacity 0.45s ${neural.ease}`,
                    // The thread between markers fills in as the agent moves on.
                    "&:not(:last-of-type)::after": { content: '""', position: "absolute", left: 19, top: 48, bottom: -6, width: 2, borderRadius: 2,
                      background: done ? `linear-gradient(180deg, ${palette.sky[150]}, ${withAlpha(palette.sky[150], 0.35)})` : withAlpha(palette.sky[175], 0.16),
                      transition: "background 0.45s ease" } }}>
                    <Box aria-hidden="true" sx={{ position: "relative", display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: "12px",
                      color: done ? palette.navy[800] : accent,
                      background: done ? (person ? `linear-gradient(140deg, ${palette.amber[100]}, ${personTone})` : `linear-gradient(140deg, ${palette.slate[75]}, ${palette.blue[200]})`) : withAlpha(palette.navy[850], 0.7),
                      border: `1px solid ${active || done ? accent : withAlpha(palette.sky[175], 0.3)}`,
                      boxShadow: active ? `0 0 0 4px ${person ? withAlpha(palette.amber[175], 0.16) : withAlpha(palette.sky[150], 0.14)}, 0 0 22px ${person ? withAlpha(palette.amber[175], 0.45) : withAlpha(palette.blue[300], 0.55)}` : "none",
                      transition: `background 0.4s ease, box-shadow 0.4s ease, color 0.4s ease, border-color 0.4s ease`,
                      "& svg": { fontSize: 21 } }}>
                      {done ? <CheckRounded /> : <Icon />}
                    </Box>
                    <Box sx={{ minWidth: 0, pt: "2px" }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                        <Box component="span" sx={{ fontWeight: 650, color: palette.grey[25], fontSize: "0.98rem" }}>{title}</Box>
                        {person && <Box component="span" sx={{ px: 1, py: "1px", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em",
                          color: palette.amber[775], background: personTone }}>A person decides</Box>}
                        {active && <Box component="span" aria-hidden="true" sx={{ display: "inline-flex", gap: "3px", ml: 0.5,
                          "& i": { width: 5, height: 5, borderRadius: "2px", background: accent, animation: "agent-dot 1s ease-in-out infinite" },
                          "& i:nth-of-type(2)": { animationDelay: "0.15s" }, "& i:nth-of-type(3)": { animationDelay: "0.3s" },
                          "@keyframes agent-dot": { "0%, 100%": { opacity: 0.25, transform: "translateY(0)" }, "50%": { opacity: 1, transform: "translateY(-3px)" } } }}>
                          <i /><i /><i />
                        </Box>}
                      </Box>
                      <Box component="p" sx={{ m: "3px 0 0", color: palette.slate[125], fontSize: "0.9rem", lineHeight: 1.5 }}>{detail}</Box>
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
          border: `1px solid ${finished ? withAlpha(palette.sky[150], 0.55) : withAlpha(palette.sky[175], 0.18)}`,
          background: finished ? `linear-gradient(110deg, ${withAlpha(palette.blue[350], 0.22)}, ${withAlpha(palette.sky[150], 0.08)})` : withAlpha(palette.navy[850], 0.35),
          transition: "background 0.5s ease, border-color 0.5s ease" }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, flex: 1, minWidth: 0 }}>
            <TaskAltRounded aria-hidden="true" sx={{ flex: "none", mt: "2px", fontSize: 26, color: finished ? palette.sky[100] : palette.slate[475], transition: "color 0.4s ease" }} />
            <Box sx={{ minWidth: 0 }}>
              <Box component="p" sx={{ m: 0, color: palette.slate[275], fontSize: "0.78rem", fontWeight: 650, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {finished ? "What you get" : `Working… step ${Math.min(shown + 1, total)} of ${total}`}
              </Box>
              <Box sx={{ opacity: finished ? 1 : 0.45, transition: "opacity 0.5s ease" }}>
                <Box component="p" sx={{ m: "4px 0 0", fontWeight: 650, color: palette.grey[25], fontSize: "1.05rem" }}>{example.result.title}</Box>
                <Box component="p" sx={{ m: "4px 0 0", color: palette.slate[125], lineHeight: 1.55, fontSize: "0.93rem" }}>{example.result.text}</Box>
                <Box component="p" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, m: "10px 0 0", px: 1.25, py: "4px", borderRadius: 99,
                  color: palette.slate[75], fontSize: "0.82rem", fontWeight: 600, border: `1px solid ${withAlpha(palette.sky[150], 0.4)}`, background: withAlpha(palette.blue[350], 0.1),
                  "& svg": { fontSize: 16, color: palette.sky[150] } }}>
                  <StraightenOutlined aria-hidden="true" />What we’d measure: {example.measure}
                </Box>
              </Box>
            </Box>
          </Box>
          {!reduced && <ActionButton variant="outlined" tone="dark" startIcon={<ReplayRounded aria-hidden="true" />}
            onClick={() => show(current)} disabled={!finished} sx={{ flex: "none" }}>
            Watch again
          </ActionButton>}
        </Box>

        <Box sx={{ mt: 2.5, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px 20px" }}>
          <Box component="p" sx={{ m: 0, color: palette.slate[275], fontSize: "0.84rem", lineHeight: 1.5, maxWidth: "52ch" }}>
            The names, messages and figures are made up to show how an agent works. Yours would follow your own rules and systems.
          </Box>
          <Box component={Link} href={cta.href} prefetch={false} sx={neural.trailLink}
            onClick={() => trackEvent("service_cta_click", { location: "agent_demo", scenario: example.id })}>
            {cta.label} <ArrowForwardRounded aria-hidden="true" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
