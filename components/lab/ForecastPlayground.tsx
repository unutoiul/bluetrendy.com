"use client";

import { useId, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import TaskAltRounded from "@mui/icons-material/TaskAltRounded";
import LinkButton from "@/components/LinkButton";
import { neural } from "@/components/experience/neuralStyle";
import { trackEvent } from "@/lib/analytics";
import { palette, withAlpha } from "@/theme/palette";
import SampleBadge from "./SampleBadge";
import { lab, useGlide } from "./labStyle";

// Twelve weeks of orders for a made-up shop. Sample data: no client's figures are shown here.
const history = [412, 428, 405, 447, 462, 451, 480, 495, 478, 512, 530, 521];
const horizon = 8;
const orderValue = 48;
// How strongly demand answers a price change in this sample: 10% dearer, about 12% fewer orders.
const elasticity = 1.2;
// The likely range widens the further ahead the forecast looks.
const spread = (week: number) => 0.06 + 0.02 * week;
const low = 300, high = 1250;

const whole = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const signed = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value)}%`;

// A straight line through the history gives the trend the forecast continues.
const trend = (() => {
  const n = history.length;
  const meanX = (n - 1) / 2;
  const meanY = history.reduce((sum, value) => sum + value, 0) / n;
  const slope = history.reduce((sum, value, index) => sum + (index - meanX) * (value - meanY), 0)
    / history.reduce((sum, _, index) => sum + (index - meanX) ** 2, 0);
  return { slope, last: meanY + slope * (n - 1 - meanX) };
})();

const total = history.length + horizon;
const x = (index: number) => (index / (total - 1)) * 100;
const y = (value: number) => (1 - (Math.min(high, Math.max(low, value)) - low) / (high - low)) * 100;
const path = (points: [number, number][]) => points.map(([px, py], index) => `${index ? "L" : "M"}${px.toFixed(2)},${py.toFixed(2)}`).join(" ");

type Inputs = { price: number; push: number; capacity: number };
const fields: { key: keyof Inputs; label: string; min: number; max: number; step: number; format: (value: number) => string }[] = [
  { key: "price", label: "Price change", min: -20, max: 20, step: 1, format: signed },
  { key: "push", label: "Extra demand from marketing", min: 0, max: 40, step: 1, format: signed },
  { key: "capacity", label: "Orders you can fulfil a week", min: 400, max: 900, step: 10, format: value => whole.format(value) },
];

const legend = [
  { text: "Past orders", swatch: { height: 3, background: palette.sky[150] } },
  { text: "Forecast", swatch: { height: 0, borderTop: `3px dashed ${palette.cyan[75]}` } },
  { text: "Likely range", swatch: { height: 10, borderRadius: "3px", background: withAlpha(palette.blue[300], 0.4) } },
  { text: "Capacity", swatch: { height: 0, borderTop: `2px dashed ${palette.amber[175]}` } },
];

type ForecastPlaygroundProps = { cta?: { href: string; label: string } };

/**
 * "Predict your business": change the price, the marketing push or the capacity and watch an
 * eight-week forecast respond, drawn as a line inside its likely range. The data and the
 * model are samples, labelled as such; the point is to show a forecast as a range to plan
 * around, never as a certainty.
 */
export default function ForecastPlayground({ cta = { href: "/predictive-ai", label: "Explore predictive AI" } }: ForecastPlaygroundProps) {
  const [inputs, setInputs] = useState<Inputs>({ price: 0, push: 10, capacity: 700 });
  const used = useRef(false);
  const id = useId();

  const factor = (1 + inputs.push / 100) * (1 - (elasticity * inputs.price) / 100);
  const weeks = Array.from({ length: horizon }, (_, index) => {
    const week = index + 1;
    const expected = (trend.last + trend.slope * week) * factor;
    return { week, expected, lower: expected * (1 - spread(week)), upper: expected * (1 + spread(week)) };
  });
  const sum = (pick: (week: (typeof weeks)[number]) => number) => weeks.reduce((value, week) => value + pick(week), 0);
  const expected = sum(week => week.expected);
  const revenue = sum(week => Math.min(week.expected, inputs.capacity)) * orderValue * (1 + inputs.price / 100);
  const atRisk = weeks.filter(week => week.upper > inputs.capacity);
  const shownExpected = useGlide(expected);
  const shownRevenue = useGlide(revenue);

  const start = history.length - 1;
  const past = path(history.map((value, index) => [x(index), y(value)]));
  const line = path([[x(start), y(history[start])], ...weeks.map(week => [x(start + week.week), y(week.expected)] as [number, number])]);
  const band = path([
    [x(start), y(history[start])],
    ...weeks.map(week => [x(start + week.week), y(week.upper)] as [number, number]),
    ...[...weeks].reverse().map(week => [x(start + week.week), y(week.lower)] as [number, number]),
  ]) + " Z";

  function change(key: keyof Inputs, value: number) {
    if (!used.current) {
      used.current = true;
      trackEvent("forecast_use");
    }
    setInputs(current => ({ ...current, [key]: value }));
  }

  const verdict = atRisk.length
    ? `From week ${atRisk[0].week}, orders could pass the ${whole.format(inputs.capacity)} you can fulfil. Worth planning stock or staff now.`
    : "Across the likely range, orders stay within what you can fulfil.";

  return (
    <Box sx={{ ...neural.glassCard, backdropFilter: "blur(8px)", borderRadius: "22px", p: { xs: 2.5, sm: 3, md: 3.5 },
      "&::after": { display: "none" }, "& > *": { position: "relative", zIndex: 1 }, "&:hover, &:focus-visible, &:focus-within": {} }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
        <Box component="p" sx={{ ...neural.label, m: 0 }}>Predict your business</Box>
        <SampleBadge>Sample data · illustrative model</SampleBadge>
      </Box>

      <Box sx={{ mt: { xs: 2.5, md: 3 }, display: "grid", gap: { xs: 3, md: 4 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.45fr) minmax(0, 1fr)" } }}>
        {/* The forecast */}
        <Box sx={{ minWidth: 0 }}>
          <Box role="img" aria-label={`Weekly orders: twelve weeks of sample history and an eight-week forecast drawn inside its likely range. ${verdict}`}
            sx={{ position: "relative", height: { xs: 230, sm: 300, md: 372 }, ml: "38px", borderRadius: "12px",
              background: `linear-gradient(180deg, ${withAlpha(palette.navy[850], 0.55)}, ${withAlpha(palette.navy[850], 0.25)})`,
              border: `1px solid ${withAlpha(palette.sky[175], 0.16)}` }}>
            {[500, 750, 1000].map(value => (
              <Box key={value} sx={{ position: "absolute", left: 0, right: 0, top: `${y(value)}%`, borderTop: `1px solid ${withAlpha(palette.sky[175], 0.1)}` }}>
                <Box component="span" sx={{ position: "absolute", right: "calc(100% + 8px)", top: "-0.7em", color: palette.slate[275], fontSize: "0.72rem",
                  fontFamily: "var(--font-mono), monospace" }}>{whole.format(value)}</Box>
              </Box>
            ))}
            {/* Everything to the right of "today" is forecast. */}
            <Box sx={{ position: "absolute", top: 0, bottom: 0, left: `${x(start)}%`, right: 0, borderLeft: `1px dashed ${withAlpha(palette.sky[150], 0.45)}`,
              background: `linear-gradient(90deg, ${withAlpha(palette.blue[350], 0.1)}, transparent)`, borderRadius: "0 12px 12px 0" }} />
            <Box component="svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"
              sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible",
                "& path, & line": { vectorEffect: "non-scaling-stroke", fill: "none", strokeLinejoin: "round", strokeLinecap: "round" } }}>
              <Box component="path" d={band} sx={{ fill: `${withAlpha(palette.blue[300], 0.28)} !important`, stroke: withAlpha(palette.sky[150], 0.35), strokeWidth: 1 }} />
              <Box component="line" x1="0" x2="100" y1={y(inputs.capacity)} y2={y(inputs.capacity)}
                sx={{ stroke: palette.amber[175], strokeWidth: 1.5, strokeDasharray: "6 5" }} />
              <Box component="path" d={past} sx={{ stroke: palette.sky[150], strokeWidth: 2.4, filter: `drop-shadow(0 0 5px ${withAlpha(palette.blue[300], 0.8)})` }} />
              <Box component="path" d={line} sx={{ stroke: palette.cyan[75], strokeWidth: 2.4, strokeDasharray: "7 5" }} />
            </Box>
            {/* A warning light on each week whose likely range passes capacity. */}
            {atRisk.map(week => (
              <Box key={week.week} aria-hidden="true" sx={{ position: "absolute", left: `${x(start + week.week)}%`, top: `${y(inputs.capacity)}%`,
                width: 10, height: 10, borderRadius: "50%", translate: "-50% -50%", background: palette.amber[175],
                boxShadow: `0 0 0 3px ${withAlpha(palette.amber[175], 0.25)}, 0 0 12px ${palette.amber[175]}` }} />
            ))}
            <Box component="span" sx={{ position: "absolute", left: `${x(start)}%`, top: 8, translate: "-50% 0", px: 1, py: "2px", borderRadius: 99, fontSize: "0.7rem",
              fontWeight: 650, color: palette.navy[800], background: lab.lit }}>Today</Box>
          </Box>
          <Box aria-hidden="true" sx={{ display: "flex", justifyContent: "space-between", ml: "38px", mt: 1, color: palette.slate[275], fontSize: "0.76rem" }}>
            <span>12 weeks ago</span><span>8 weeks ahead</span>
          </Box>
          <Box component="ul" aria-label="Chart key" sx={{ listStyle: "none", m: "14px 0 0", p: 0, display: "flex", flexWrap: "wrap", gap: "6px 18px",
            color: palette.slate[125], fontSize: "0.82rem" }}>
            {legend.map(item => (
              <Box component="li" key={item.text} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box component="span" aria-hidden="true" sx={{ width: 22, ...item.swatch }} />{item.text}
              </Box>
            ))}
          </Box>
        </Box>

        {/* The assumptions, and what the forecast says */}
        <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Box component="p" sx={lab.caption}>Change the assumptions</Box>
          <Box sx={{ display: "grid", gap: 1 }}>
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

          <Box component="dl" sx={{ m: "12px 0 0", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.5 }}>
            {[["Orders, next 8 weeks", whole.format(shownExpected), `likely ${whole.format(sum(week => week.lower))} to ${whole.format(sum(week => week.upper))}`],
              ["Sample revenue", pounds.format(shownRevenue), `at ${pounds.format(orderValue)} an order`]].map(([term, value, note]) => (
              <Box key={term} sx={{ p: 1.5, borderRadius: "12px", border: `1px solid ${withAlpha(palette.sky[175], 0.2)}`, background: withAlpha(palette.navy[850], 0.45) }}>
                <Box component="dt" sx={{ color: palette.sky[150], fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>{term}</Box>
                <Box component="dd" sx={{ m: "6px 0 0" }}>
                  <Box component="span" sx={{ display: "block", color: palette.grey[25], fontSize: "1.35rem", fontWeight: 670, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{value}</Box>
                  <Box component="span" sx={{ display: "block", mt: "2px", color: palette.slate[275], fontSize: "0.78rem", lineHeight: 1.35 }}>{note}</Box>
                </Box>
              </Box>
            ))}
          </Box>

          <Box role="status" sx={{ mt: 1.5, display: "flex", gap: 1.25, alignItems: "flex-start", p: 1.5, borderRadius: "12px", fontSize: "0.92rem", lineHeight: 1.5,
            color: atRisk.length ? palette.amber[100] : palette.slate[100],
            border: `1px solid ${atRisk.length ? withAlpha(palette.amber[175], 0.5) : withAlpha(palette.sky[150], 0.35)}`,
            background: atRisk.length ? withAlpha(palette.amber[175], 0.1) : withAlpha(palette.blue[350], 0.12),
            transition: "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
            "& svg": { flex: "none", mt: "1px", fontSize: 20, color: atRisk.length ? palette.amber[175] : palette.sky[150] } }}>
            {atRisk.length ? <WarningAmberRounded aria-hidden="true" /> : <TaskAltRounded aria-hidden="true" />}{verdict}
          </Box>

          <Box sx={{ mt: "auto", pt: 2.5 }}>
            <LinkButton href={cta.href} variant="contained" endIcon={<ArrowForwardRounded />}
              onClick={() => trackEvent("service_cta_click", { location: "forecast_playground" })}>
              {cta.label}
            </LinkButton>
          </Box>
        </Box>
      </Box>

      <Box component="p" sx={{ m: "20px 0 0", color: palette.slate[275], fontSize: "0.82rem", lineHeight: 1.55 }}>
        This is a made-up shop with a simple trend model, to show how a forecast behaves. A real one is built from your own
        data and tested against what actually happened, and it still gives a range rather than a certainty.
      </Box>
    </Box>
  );
}
