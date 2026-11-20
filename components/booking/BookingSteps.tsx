"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import ActionButton from "@/components/ActionButton";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import AutoModeRounded from "@mui/icons-material/AutoModeRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import EditOutlined from "@mui/icons-material/EditOutlined";
import HelpOutlineRounded from "@mui/icons-material/HelpOutlineRounded";
import LanguageRounded from "@mui/icons-material/LanguageRounded";
import SmartToyOutlined from "@mui/icons-material/SmartToyOutlined";
import InsightsOutlined from "@mui/icons-material/InsightsOutlined";
import CampaignOutlined from "@mui/icons-material/CampaignOutlined";
import ExploreOutlined from "@mui/icons-material/ExploreOutlined";
import VideocamOutlined from "@mui/icons-material/VideocamOutlined";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import BookingEmbed from "@/components/BookingEmbed";
import HeadingMotion from "@/components/motion/HeadingMotion";
import { trackEvent } from "@/lib/analytics";
import founderPhoto from "@/public/brand/founder.png";
import { palette, withAlpha } from "@/theme/palette";


const ease = [0.22, 1, 0.36, 1] as const;
const blue = palette.blue[425];
const ink = palette.navy[725];
const steps = ["Your details", "What you need", "Pick a time"];
// The seven services in a word or two each, plus a way out for visitors who can't say yet.
const needs = [
  { id: "Website or app", Icon: LanguageRounded },
  { id: "Video & creative", Icon: VideocamOutlined },
  { id: "AI agents", Icon: SmartToyOutlined },
  { id: "Automation", Icon: AutoModeRounded },
  { id: "Forecasting", Icon: InsightsOutlined },
  { id: "Marketing", Icon: CampaignOutlined },
  { id: "AI strategy", Icon: ExploreOutlined },
  { id: "Not sure yet", Icon: HelpOutlineRounded },
];
const promises = [
  "The AI opportunities worth pursuing in your business",
  "Straight answers on scope, timeline and cost",
  "Advice from the team that would build it",
  "No obligation. If we're not the right fit, we'll say so.",
];
const noteLimit = 600;
const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

const stepTitle = { m: 0, color: ink, fontSize: { xs: 22, sm: 24 }, fontWeight: 700, letterSpacing: "-0.02em", outline: "none" };

/**
 * Booking in three short steps: who you are, what you need, then a time. The details
 * from the first two steps are filled in on the calendar's booking form, so nothing is
 * asked twice. Each step slides in from the direction you are heading.
 */
export default function BookingSteps() {
  const reduce = useReducedMotion();
  const top = useRef<HTMLDivElement>(null);
  const focusNext = useRef(false);
  const firstRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [details, setDetails] = useState({ first: "", last: "", email: "" });
  const [errors, setErrors] = useState<{ first?: string; email?: string }>({});
  const [picked, setPicked] = useState<string[]>([]);
  const [needError, setNeedError] = useState(false);
  const [note, setNote] = useState("");

  function go(next: number) {
    setDirection(next > step ? 1 : -1);
    focusNext.current = true;
    setStep(next);
    const box = top.current?.getBoundingClientRect();
    if (box && box.top < 0) top.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  }

  // Move keyboard and screen reader focus to the new step's heading once it is on screen.
  const headingRef = (element: HTMLHeadingElement | null) => {
    if (element && focusNext.current) {
      focusNext.current = false;
      element.focus({ preventScroll: true });
    }
  };

  function submitDetails(event: FormEvent) {
    event.preventDefault();
    const found: typeof errors = {};
    if (!details.first.trim()) found.first = "Enter your first name";
    if (!looksLikeEmail(details.email)) found.email = details.email.trim() ? "Enter a valid email, like name@company.com" : "Enter your email";
    setErrors(found);
    if (found.first) return firstRef.current?.focus();
    if (found.email) return emailRef.current?.focus();
    trackEvent("booking_step_complete", { step: "details" });
    go(1);
  }

  function submitNeeds(event: FormEvent) {
    event.preventDefault();
    if (!picked.length) { setNeedError(true); return; }
    trackEvent("booking_step_complete", { step: "needs", needs: picked.join(", ") });
    go(2);
  }

  function toggle(id: string) {
    setNeedError(false);
    setPicked((list) => list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
  }

  const name = `${details.first.trim()} ${details.last.trim()}`.trim();
  const notes = [`Interested in: ${picked.join(", ")}.`, note.trim()].filter(Boolean).join("\n\n");

  const slide = reduce
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
      enter: (d: number) => ({ opacity: 0, x: d * 36, filter: "blur(6px)" }),
      center: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.45, ease } },
      exit: (d: number) => ({ opacity: 0, x: d * -36, filter: "blur(6px)", transition: { duration: 0.22, ease } }),
    };

  return (
    <Box ref={top} sx={{ scrollMarginTop: 96, display: "grid", gap: { xs: 4, md: 6 }, alignItems: "start",
      gridTemplateColumns: { xs: "minmax(0, 1fr)", md: step === 2 ? "minmax(0, 1fr)" : "minmax(0, 1.1fr) minmax(0, 0.9fr)" } }}>
      <Box sx={{ minWidth: 0 }}>
        <Stepper step={step} onJump={go} />
        <HeadingMotion component="h1" id="booking-heading" text="Book your" accent="AI Opportunity Call" tone="light" immediate
          sx={{ mt: { xs: 3, md: 4 }, mb: { xs: 2.5, md: 3 }, fontSize: { xs: 36, sm: 48, md: 54 }, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.045em" }} />

        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div key={step} custom={direction} variants={slide} initial="enter" animate="center" exit="exit">
            {step === 0 && (
              <Box component="form" noValidate onSubmit={submitDetails} data-clarity-mask="true">
                <StepIntro headingRef={headingRef} title="Who should we expect?"
                  text="A free 30-minute video call with the team that would build it." />
                <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                  <TextField label="First name" required autoComplete="given-name" inputRef={firstRef} value={details.first}
                    onChange={(event) => { setDetails({ ...details, first: event.target.value }); setErrors({ ...errors, first: undefined }); }}
                    error={Boolean(errors.first)} helperText={errors.first} />
                  <TextField label="Last name" autoComplete="family-name" value={details.last}
                    onChange={(event) => setDetails({ ...details, last: event.target.value })} />
                  <TextField label="Email" type="email" required autoComplete="email" inputRef={emailRef} value={details.email}
                    onChange={(event) => { setDetails({ ...details, email: event.target.value }); setErrors({ ...errors, email: undefined }); }}
                    error={Boolean(errors.email)} helperText={errors.email ?? "We'll send your calendar invite here."}
                    sx={{ gridColumn: { sm: "1 / -1" } }} />
                </Box>
                <ActionButton type="submit" variant="contained" size="large" endIcon={<ArrowForwardRounded />} sx={{ mt: 3, minWidth: 168 }}>
                  Continue
                </ActionButton>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5 }}>
                  We only use these details to arrange your call.{" "}
                  <Box component={Link} href="/legal/privacy" sx={{ color: blue, fontWeight: 600, textUnderlineOffset: 3 }}>Privacy policy</Box>
                </Typography>
              </Box>
            )}

            {step === 1 && (
              <Box component="form" noValidate onSubmit={submitNeeds} data-clarity-mask="true">
                <StepIntro headingRef={headingRef} id="needs-heading" title="What can we help with?"
                  text="Pick everything that applies, so we come to the call prepared." />
                <Box role="group" aria-labelledby="needs-heading"
                  sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, minmax(0, 1fr))" } }}>
                  {needs.map(({ id, Icon }, index) => {
                    const on = picked.includes(id);
                    return (
                      <motion.div key={id} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease, delay: 0.05 * index }}>
                        <NeedCard on={on} label={id} icon={<Icon />} onToggle={() => toggle(id)} />
                      </motion.div>
                    );
                  })}
                </Box>
                {needError && <Typography role="alert" variant="body2" color="error" sx={{ mt: 1.5 }}>Pick at least one so we can prepare.</Typography>}
                <TextField label="Anything we should know?" multiline minRows={3} value={note} fullWidth
                  onChange={(event) => setNote(event.target.value.slice(0, noteLimit))}
                  placeholder="Goals, deadlines, or a link to your current site or app"
                  helperText={`Optional. ${note.length}/${noteLimit}`} slotProps={{ htmlInput: { maxLength: noteLimit } }}
                  sx={{ mt: 3 }} />
                <Stack direction="row" spacing={1.5} sx={{ mt: 3, alignItems: "center" }}>
                  <ActionButton variant="text" startIcon={<ArrowBackRounded />} onClick={() => go(0)} sx={{ color: ink }}>Back</ActionButton>
                  <ActionButton type="submit" variant="contained" size="large" endIcon={<ArrowForwardRounded />} sx={{ minWidth: 168 }}>
                    Continue
                  </ActionButton>
                </Stack>
              </Box>
            )}

            {step === 2 && (
              <Box>
                <StepIntro headingRef={headingRef} title="Pick a time that suits you"
                  text="Times show in your timezone. Your details are already on the booking form." />
                <Summary name={name} email={details.email.trim()} picked={picked} onEdit={() => go(0)} />
                <BookingEmbed prefill={{ name, email: details.email.trim(), notes }} />
              </Box>
            )}
          </motion.div>
        </AnimatePresence>
      </Box>

      {step < 2 && <CallPanel />}
    </Box>
  );
}

function StepIntro({ headingRef, id, title, text }: { headingRef: (element: HTMLHeadingElement | null) => void; id?: string; title: string; text: string }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography component="h2" id={id} ref={headingRef} tabIndex={-1} sx={stepTitle}>{title}</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.75 }}>{text}</Typography>
    </Box>
  );
}

/** The three steps along the top. A finished step can be clicked to go back to it. */
function Stepper({ step, onJump }: { step: number; onJump: (step: number) => void }) {
  const reduce = useReducedMotion();
  return (
    <Box component="ol" aria-label="Booking steps" sx={{ display: "flex", alignItems: "center", m: 0, p: 0, listStyle: "none" }}>
      {steps.map((label, index) => {
        const state = index < step ? "done" : index === step ? "current" : "next";
        return (
          <Box component="li" key={label} aria-current={state === "current" ? "step" : undefined}
            sx={{ display: "flex", alignItems: "center", flex: "0 1 auto", minWidth: 0 }}>
            {index > 0 && (
              <Box aria-hidden="true" sx={{ position: "relative", flexShrink: 1, width: { xs: 36, sm: 72, md: 96 }, minWidth: 14, height: 2, mx: { xs: 1, sm: 1.5 },
                borderRadius: 2, overflow: "hidden", bgcolor: palette.slate[150] }}>
                <Box component={motion.span} initial={false} animate={{ scaleX: index <= step ? 1 : 0 }}
                  transition={{ duration: reduce ? 0 : 0.6, ease }}
                  sx={{ position: "absolute", inset: 0, transformOrigin: "0 50%", background: `linear-gradient(90deg, ${blue}, ${palette.blue[250]})` }} />
              </Box>
            )}
            <ButtonBase disabled={state !== "done"} onClick={() => onJump(index)}
              sx={{ gap: 1, minHeight: 44, px: 0.5, borderRadius: "999px", flexShrink: 0, color: state === "next" ? palette.slate[375] : ink,
                fontSize: 15, fontWeight: state === "current" ? 700 : 600,
                "&.Mui-focusVisible": { outline: `2px solid ${blue}`, outlineOffset: 2 },
                "&:hover .step-dot": state === "done" ? { bgcolor: palette.slate[100] } : {} }}>
              <Box component={motion.span} className="step-dot" initial={false}
                animate={state === "current" && !reduce
                  ? { boxShadow: [`0 0 0 0px ${withAlpha(palette.blue[425], 0.35)}`, `0 0 0 7px ${withAlpha(palette.blue[425], 0)}`] }
                  : { boxShadow: `0 0 0 0px ${withAlpha(palette.blue[425], 0)}` }}
                transition={state === "current" && !reduce ? { duration: 1.8, repeat: Infinity, ease: "easeOut" } : { duration: 0.2 }}
                sx={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: "50%", fontSize: 13, fontWeight: 700,
                  transition: "background-color .3s ease, border-color .3s ease, color .3s ease",
                  ...(state === "current" && { bgcolor: blue, color: palette.white, border: `1px solid ${blue}` }),
                  ...(state === "done" && { bgcolor: palette.slate[50], color: blue, border: `1px solid ${blue}` }),
                  ...(state === "next" && { bgcolor: withAlpha(palette.white, 0.8), color: palette.slate[375], border: `1px solid ${palette.slate[125]}` }),
                  "& svg": { fontSize: 17 } }}>
                {state === "done" ? <CheckRounded /> : index + 1}
              </Box>
              <Box component="span" sx={{ display: { xs: state === "current" ? "inline" : "none", sm: "inline" }, whiteSpace: "nowrap" }}>
                {label}
                {state === "done" && <Box component="span" sx={visuallyHidden}> (done, go back)</Box>}
              </Box>
            </ButtonBase>
          </Box>
        );
      })}
    </Box>
  );
}

const visuallyHidden = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" } as const;

function NeedCard({ on, label, icon, onToggle }: { on: boolean; label: string; icon: ReactNode; onToggle: () => void }) {
  return (
    <ButtonBase type="button" aria-pressed={on} onClick={onToggle}
      sx={{ position: "relative", width: "100%", minHeight: 96, p: 2, borderRadius: "14px", display: "flex", flexDirection: "column",
        alignItems: "flex-start", justifyContent: "space-between", gap: 1.5, textAlign: "left", color: ink, fontSize: 15, fontWeight: 650,
        border: `1px solid ${on ? blue : palette.slate[150]}`, bgcolor: on ? withAlpha(palette.slate[50], 0.95) : withAlpha(palette.white, 0.86),
        backdropFilter: "blur(4px)",
        boxShadow: on ? `0 0 0 3px ${withAlpha(palette.blue[425], 0.14)}, 0 14px 28px -20px ${withAlpha(palette.blue[425], 0.9)}` : `0 1px 0 ${withAlpha(palette.navy[725], 0.04)}`,
        transition: "border-color .25s ease, background-color .25s ease, box-shadow .35s ease, transform .35s cubic-bezier(0.22, 1, 0.36, 1)",
        "&:hover": { borderColor: on ? blue : palette.blue[200], transform: "translateY(-2px)" },
        "&.Mui-focusVisible": { outline: `2px solid ${blue}`, outlineOffset: 2 },
        "@media (prefers-reduced-motion: reduce)": { "&:hover": { transform: "none" } } }}>
      <Box component="span" sx={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: "10px",
        bgcolor: on ? blue : palette.slate[50], color: on ? palette.white : blue, transition: "background-color .25s ease, color .25s ease", "& svg": { fontSize: 21 } }}>
        {icon}
      </Box>
      {label}
      <Box component={motion.span} aria-hidden="true" initial={false} animate={{ scale: on ? 1 : 0.4, opacity: on ? 1 : 0 }}
        transition={{ duration: 0.3, ease }}
        sx={{ position: "absolute", top: 10, right: 10, display: "grid", placeItems: "center", width: 22, height: 22, borderRadius: "50%",
          bgcolor: blue, color: palette.white, "& svg": { fontSize: 15 } }}>
        <CheckRounded />
      </Box>
    </ButtonBase>
  );
}

/** Step three's recap of what the visitor told us, with a way back to change it. */
function Summary({ name, email, picked, onEdit }: { name: string; email: string; picked: string[]; onEdit: () => void }) {
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 2.5, p: { xs: 2, sm: 2.5 }, borderRadius: "16px",
      bgcolor: withAlpha(palette.white, 0.88), border: `1px solid ${palette.slate[150]}`, backdropFilter: "blur(4px)" }}>
      <Box aria-hidden="true" sx={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
        background: `linear-gradient(135deg, ${blue}, ${palette.blue[250]})`, color: palette.white, fontWeight: 700 }}>{initials}</Box>
      <Box sx={{ minWidth: 0, flex: "1 1 200px" }}>
        <Typography sx={{ fontWeight: 700, color: ink }}>{name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>{email}</Typography>
      </Box>
      <Stack direction="row" sx={{ gap: 0.75, flexWrap: "wrap", flex: "2 1 220px" }}>
        {picked.map((item) => (
          <Box key={item} component="span" sx={{ px: 1.25, py: 0.5, borderRadius: "999px", fontSize: 13, fontWeight: 600,
            color: blue, bgcolor: palette.slate[50], border: `1px solid ${palette.slate[125]}` }}>{item}</Box>
        ))}
      </Stack>
      <ActionButton variant="text" size="small" startIcon={<EditOutlined />} onClick={onEdit} sx={{ color: ink, minHeight: 44 }}>Edit</ActionButton>
    </Box>
  );
}

/** The dark panel beside the form: what the call is, what you get, and who you'll talk to. */
function CallPanel() {
  const reduce = useReducedMotion();
  const facts = [
    { label: "Google Meet", Icon: VideocamOutlined },
    { label: "30 min", Icon: AccessTimeOutlined },
    { label: "Free", Icon: null },
  ];
  return (
    <Box component="aside" aria-labelledby="call-panel-heading"
      sx={{ position: { xs: "relative", md: "sticky" }, top: { md: 104 }, overflow: "hidden", isolation: "isolate",
        p: { xs: 3, sm: 4 }, borderRadius: "22px", color: palette.grey[25],
        background: `radial-gradient(ellipse at 88% 0%, ${withAlpha(palette.blue[425], 0.5)}, transparent 58%), radial-gradient(ellipse at 0% 100%, ${withAlpha(palette.navy[600], 0.45)}, transparent 60%), linear-gradient(165deg, ${palette.navy[725]} 0%, ${palette.navy[800]} 72%)`,
        border: `1px solid ${withAlpha(palette.sky[150], 0.2)}`, boxShadow: `0 34px 70px -40px ${withAlpha(palette.navy[800], 0.95)}`,
        "&::before": { content: '""', position: "absolute", top: 0, left: "12%", right: "12%", height: "1px",
          background: `linear-gradient(90deg, transparent, ${palette.sky[100]}, transparent)`, opacity: 0.7 } }}>
      <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
        {facts.map(({ label, Icon }) => (
          <Box key={label} component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 1.5, py: 0.75, borderRadius: "999px",
            fontSize: 13, fontWeight: 600, bgcolor: withAlpha(palette.white, 0.07), border: `1px solid ${withAlpha(palette.sky[100], 0.24)}`,
            color: Icon ? palette.slate[100] : palette.sky[100], "& svg": { fontSize: 17, color: palette.sky[100] } }}>
            {Icon && <Icon />}{label}
          </Box>
        ))}
      </Stack>
      <Typography component="h2" id="call-panel-heading" sx={{ mt: 3.5, mb: 2.5, fontSize: { xs: 22, sm: 25 }, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.2,
        background: `linear-gradient(180deg, ${palette.white} 30%, ${palette.slate[100]} 100%)`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        What you&apos;ll get from this call
      </Typography>
      <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 2 }}>
        {promises.map((item, index) => (
          <Box component={motion.li} key={item} initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.25 + index * 0.09 }}
            sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", color: palette.slate[150], lineHeight: 1.5 }}>
            <Box component="span" aria-hidden="true" sx={{ display: "grid", placeItems: "center", flexShrink: 0, width: 24, height: 24, mt: "1px",
              borderRadius: "50%", color: palette.sky[100], bgcolor: withAlpha(palette.blue[300], 0.16), border: `1px solid ${withAlpha(palette.sky[150], 0.4)}`,
              boxShadow: `0 0 12px ${withAlpha(palette.blue[350], 0.35)}`, "& svg": { fontSize: 15 } }}>
              <CheckRounded />
            </Box>
            {item}
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3.5, pt: 3, borderTop: `1px solid ${withAlpha(palette.sky[100], 0.16)}` }}>
        <Box sx={{ position: "relative", width: 56, height: 56, flexShrink: 0, borderRadius: "50%", overflow: "hidden",
          boxShadow: `0 0 0 2px ${withAlpha(palette.sky[100], 0.55)}, 0 0 22px ${withAlpha(palette.blue[300], 0.45)}` }}>
          <Image src={founderPhoto} alt="" fill sizes="56px" style={{ objectFit: "cover" }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, color: palette.white }}>You&apos;ll meet our team</Typography>
          <Typography variant="body2" sx={{ color: palette.blue[200] }}>Usually Lucas Franco, founder and lead engineer</Typography>
        </Box>
      </Box>
    </Box>
  );
}
