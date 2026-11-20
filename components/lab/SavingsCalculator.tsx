"use client";

import { useId, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import LinkButton from "@/components/LinkButton";
import { neural } from "@/components/experience/neuralStyle";
import { trackEvent } from "@/lib/analytics";
import { palette, withAlpha } from "@/theme/palette";
import SampleBadge from "./SampleBadge";
import { lab, useGlide } from "./labStyle";

type Inputs = { tasks: number; minutes: number; cost: number; share: number };

// Starting assumptions for common tasks. They are examples to adjust, not measured results.
const presets: { id: string; label: string; inputs: Inputs }[] = [
  { id: "emails", label: "Customer emails", inputs: { tasks: 300, minutes: 6, cost: 18, share: 50 } },
  { id: "invoices", label: "Supplier invoices", inputs: { tasks: 120, minutes: 8, cost: 20, share: 60 } },
  { id: "leads", label: "Lead follow-up", inputs: { tasks: 80, minutes: 10, cost: 24, share: 50 } },
  { id: "proposals", label: "Sales proposals", inputs: { tasks: 10, minutes: 90, cost: 35, share: 40 } },
  { id: "reports", label: "Weekly reports", inputs: { tasks: 15, minutes: 60, cost: 28, share: 60 } },
];

const workingWeeks = 48;
const hoursInDay = 7.5;
const whole = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const hours = (value: number) => (value < 10 ? value.toFixed(1).replace(/\.0$/, "") : whole.format(value));

const fields: { key: keyof Inputs; label: string; min: number; max: number; step: number; format: (value: number) => string }[] = [
  { key: "tasks", label: "Tasks each week", min: 5, max: 1000, step: 5, format: value => whole.format(value) },
  { key: "minutes", label: "Minutes for each task", min: 1, max: 120, step: 1, format: value => `${value} min` },
  { key: "cost", label: "Staff cost for an hour", min: 12, max: 80, step: 1, format: value => pounds.format(value) },
  { key: "share", label: "Share AI could handle", min: 10, max: 90, step: 5, format: value => `${value}%` },
];

/**
 * A savings calculator: how much time a repetitive task takes today, and how much of it
 * automation might give back. It multiplies the visitor's own assumptions and says so; the
 * result is an illustration to test in a pilot, never a promised saving.
 */
export default function SavingsCalculator() {
  const [preset, setPreset] = useState<string | null>(presets[0].id);
  const [inputs, setInputs] = useState<Inputs>(presets[0].inputs);
  const used = useRef(false);
  const id = useId();

  const today = (inputs.tasks * inputs.minutes) / 60;
  const saved = today * (inputs.share / 100);
  const yearly = saved * workingWeeks;
  const shownSaved = useGlide(saved);
  const shownYearly = useGlide(yearly);
  const shownValue = useGlide(yearly * inputs.cost);

  function touch() {
    if (used.current) return;
    used.current = true;
    trackEvent("calculator_use");
  }

  function choosePreset(next: (typeof presets)[number]) {
    touch();
    setPreset(next.id);
    setInputs(next.inputs);
  }

  function change(key: keyof Inputs, value: number) {
    touch();
    setPreset(null);
    setInputs(current => ({ ...current, [key]: value }));
  }

  return (
    <Box sx={{ ...neural.glassCard, borderRadius: "22px", p: { xs: 2.5, sm: 3, md: 3.5 },
      background: `linear-gradient(160deg, ${palette.navy[675]}, ${palette.navy[800]} 62%)`,
      "&::after": { display: "none" }, "& > *": { position: "relative", zIndex: 1 }, "&:hover, &:focus-visible, &:focus-within": {} }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
        <Box component="p" sx={{ ...neural.label, m: 0 }}>Savings calculator</Box>
        <SampleBadge>Illustrative estimate · your assumptions</SampleBadge>
      </Box>

      <Box component="fieldset" sx={{ border: 0, m: "20px 0 0", p: 0, minWidth: 0 }}>
        <Box component="legend" sx={{ ...lab.caption, p: 0 }}>Start from a common task</Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {presets.map(item => (
            <Box component="label" key={item.id} sx={lab.choice(item.id === preset, true)}>
              <input type="radio" name={`${id}-preset`} checked={item.id === preset} onChange={() => choosePreset(item)} />
              {item.label}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: { xs: 3, md: 3.5 }, display: "grid", gap: { xs: 3, md: 4 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) minmax(0, 1fr)" } }}>
        {/* The assumptions */}
        <Box sx={{ display: "grid", gap: 1.5, alignContent: "start" }}>
          {fields.map(field => (
            <div key={field.key}>
              <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
                <Box component="span" id={`${id}-${field.key}`} sx={{ color: palette.slate[100], fontSize: "0.93rem", fontWeight: 550 }}>{field.label}</Box>
                <Box component="output" sx={{ color: palette.grey[25], fontFamily: "var(--font-mono), monospace", fontSize: "0.95rem", fontWeight: 600 }}>
                  {field.format(inputs[field.key])}
                </Box>
              </Box>
              <Slider aria-labelledby={`${id}-${field.key}`} min={field.min} max={field.max} step={field.step} value={inputs[field.key]}
                getAriaValueText={field.format} onChange={(_, value) => change(field.key, value as number)} sx={lab.slider("dark")} />
            </div>
          ))}
        </Box>

        {/* What they add up to */}
        <Box sx={{ display: "flex", flexDirection: "column", p: { xs: 2, md: 2.5 }, borderRadius: "16px", border: `1px solid ${withAlpha(palette.sky[150], 0.4)}`,
          background: `linear-gradient(150deg, ${withAlpha(palette.blue[350], 0.2)}, ${withAlpha(palette.navy[850], 0.55)})` }}>
          <Box component="p" sx={{ ...lab.caption, m: 0 }}>Time given back each week</Box>
          {/* The settled figures for screen readers; the numbers on screen glide between values. */}
          <Box className="sr-only" role="status">
            About {hours(saved)} hours a week, {whole.format(yearly)} hours a year, worth {pounds.format(yearly * inputs.cost)} at your staff cost.
          </Box>
          <Box component="p" sx={{ m: "6px 0 0", display: "flex", alignItems: "baseline", gap: 1.25 }}>
            <Box component="span" sx={{ ...neural.accentText, fontSize: "clamp(2.6rem, 5vw, 3.6rem)", fontWeight: 690, letterSpacing: "-0.05em", lineHeight: 1,
              fontVariantNumeric: "tabular-nums" }}>{hours(shownSaved)}</Box>
            <Box component="span" sx={{ color: palette.slate[100], fontSize: "1.05rem", fontWeight: 600 }}>hours</Box>
          </Box>

          {/* Today's hours beside what is left once the routine share is automated. */}
          <Box sx={{ mt: 2.5, display: "grid", gap: 1 }}>
            {[{ label: "By hand today", value: today, tone: withAlpha(palette.slate[275], 0.55) },
              { label: "With automation", value: today - saved, tone: `linear-gradient(90deg, ${palette.blue[425]}, ${palette.sky[150]})` }].map(bar => (
              <div key={bar.label}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, color: palette.slate[125], fontSize: "0.82rem" }}>
                  <span>{bar.label}</span>
                  <Box component="span" sx={{ fontFamily: "var(--font-mono), monospace", color: palette.slate[100] }}>{hours(bar.value)} h</Box>
                </Box>
                <Box sx={{ mt: 0.5, height: 8, borderRadius: 99, background: withAlpha(palette.navy[850], 0.7), overflow: "hidden" }}>
                  <Box sx={{ height: "100%", borderRadius: 99, background: bar.tone, width: `${today ? Math.max(2, (bar.value / today) * 100) : 0}%`,
                    transition: `width 0.5s ${lab.ease}`, "@media (prefers-reduced-motion: reduce)": { transition: "none" } }} />
                </Box>
              </div>
            ))}
          </Box>

          <Box component="dl" sx={{ m: "20px 0 0", pt: 2, display: "grid", gap: 1.25, borderTop: `1px solid ${withAlpha(palette.sky[175], 0.22)}` }}>
            {[["Over a year", `${whole.format(shownYearly)} hours`, `about ${whole.format(yearly / hoursInDay)} working days`],
              ["Value of that time", pounds.format(shownValue), "at your staff cost"]].map(([term, value, note]) => (
              <Box key={term} sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
                <Box component="dt" sx={{ color: palette.slate[125], fontSize: "0.9rem" }}>{term}</Box>
                <Box component="dd" sx={{ m: 0, textAlign: "right" }}>
                  <Box component="span" sx={{ display: "block", color: palette.grey[25], fontSize: "1.2rem", fontWeight: 660, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{value}</Box>
                  <Box component="span" sx={{ display: "block", color: palette.slate[275], fontSize: "0.78rem" }}>{note}</Box>
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: "auto", pt: 2.5 }}>
            <LinkButton href="/book-a-call" variant="contained" endIcon={<ArrowForwardRounded />}
              onClick={() => trackEvent("cta_book_call_click", { location: "savings_calculator" })}>
              Check these numbers with us
            </LinkButton>
          </Box>
        </Box>
      </Box>

      <Box component="p" sx={{ m: "20px 0 0", color: palette.slate[275], fontSize: "0.82rem", lineHeight: 1.55 }}>
        The sum is tasks × minutes × the share AI could handle, over {workingWeeks} working weeks. It multiplies your own
        assumptions and is not a quote or a promised saving. We test the share on a small pilot before you rely on it.
      </Box>
    </Box>
  );
}
