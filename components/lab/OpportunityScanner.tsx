"use client";

import { Fragment, useRef, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import { keyframes } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";
import HotelOutlined from "@mui/icons-material/HotelOutlined";
import BusinessCenterOutlined from "@mui/icons-material/BusinessCenterOutlined";
import PrecisionManufacturingOutlined from "@mui/icons-material/PrecisionManufacturingOutlined";
import TerminalOutlined from "@mui/icons-material/TerminalOutlined";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import ReportProblemOutlined from "@mui/icons-material/ReportProblemOutlined";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import FlagOutlined from "@mui/icons-material/FlagOutlined";
import StraightenOutlined from "@mui/icons-material/StraightenOutlined";
import LinkButton from "@/components/LinkButton";
import { neural } from "@/components/experience/neuralStyle";
import { businessTypes, challenges, type BusinessTypeId, type ChallengeId } from "@/data/opportunities";
import { getService } from "@/data/services";
import { trackEvent } from "@/lib/analytics";
import { palette, withAlpha } from "@/theme/palette";
import { lab } from "./labStyle";

const businessIcons: Record<BusinessTypeId, SvgIconComponent> = {
  ecommerce: StorefrontOutlined, hotel: HotelOutlined, services: BusinessCenterOutlined,
  industry: PrecisionManufacturingOutlined, software: TerminalOutlined, other: CategoryOutlined,
};

// A new result is read from the top down, the way a scanner passes over a page.
const reveal = keyframes`from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 -4% 0); }`;
const beam = keyframes`
  0% { top: 0; opacity: 0; }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
`;

const heading = { m: 0, fontSize: "1.05rem", fontWeight: 650, letterSpacing: "-0.02em", color: palette.grey[25] } as const;
const stepNumber = {
  display: "grid", placeItems: "center", flex: "none", width: 26, height: 26, borderRadius: "50%",
  fontFamily: "var(--font-mono), monospace", fontSize: "0.75rem", color: palette.sky[100], border: `1px solid ${withAlpha(palette.sky[150], 0.45)}`,
} as const;

/** The route from the visitor's answers to our suggestion, drawn as three linked nodes with a spark running between them. */
function Route({ nodes }: { nodes: { Icon: SvgIconComponent; text: string; lit?: boolean }[] }) {
  return (
    <Box aria-hidden="true" sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mt: 2.5 }}>
      {nodes.map(({ Icon, text, lit }, index) => (
        <Fragment key={index}>
          {index > 0 && <Box sx={{ position: "relative", flex: { sm: "1 1 24px" }, minWidth: { sm: 20 }, width: { xs: 2, sm: "auto" }, height: { xs: 18, sm: 2 }, ml: { xs: "19px", sm: 0 },
            background: { xs: `linear-gradient(180deg, ${palette.blue[350]}, ${palette.sky[150]})`, sm: `linear-gradient(90deg, ${palette.blue[350]}, ${palette.sky[150]})` },
            "&::after": { content: '""', position: "absolute", width: 7, height: 7, borderRadius: "50%", background: palette.cyan[25],
              boxShadow: `0 0 8px 2px ${palette.sky[150]}`, top: { xs: 0, sm: "50%" }, left: { xs: "50%", sm: 0 }, translate: "-50% -50%",
              animation: { xs: `neural-current-down 2s ${neural.ease} infinite`, sm: `neural-current 2s ${neural.ease} infinite` },
              animationDelay: `${index * 0.5}s`,
              "@media (prefers-reduced-motion: reduce)": { display: "none" } } }} />}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, maxWidth: "100%", px: 1.25, py: 0.75, borderRadius: "10px", fontSize: "0.82rem", fontWeight: 600,
            lineHeight: 1.25, color: lit ? palette.navy[800] : palette.slate[100], background: lit ? lab.lit : withAlpha(palette.navy[850], 0.55),
            border: `1px solid ${lit ? "transparent" : withAlpha(palette.sky[175], 0.3)}`, "& svg": { flex: "none", fontSize: 17 } }}>
            <Icon />{text}
          </Box>
        </Fragment>
      ))}
    </Box>
  );
}

/**
 * The AI Business Opportunity Scanner. A visitor picks their kind of business and their
 * biggest challenge; the scanner answers with the system we would build first, how it would
 * work, the likely benefits and the number to measure. The answer can be sent on as the start
 * of a project brief.
 */
export default function OpportunityScanner() {
  const [businessId, setBusinessId] = useState<BusinessTypeId>("ecommerce");
  const [challengeId, setChallengeId] = useState<ChallengeId>("emails");
  const business = businessTypes.find(item => item.id === businessId) ?? businessTypes[0];
  const challenge = challenges.find(item => item.id === challengeId) ?? challenges[0];
  const service = getService(challenge.service);
  const example = business.examples[challenge.id];
  const BusinessIcon = businessIcons[business.id];
  const result = useRef<HTMLDivElement>(null);

  function chooseBusiness(id: BusinessTypeId) {
    const next = businessTypes.find(item => item.id === id);
    if (!next) return;
    setBusinessId(id);
    // Lead with the challenge this kind of business meets most.
    setChallengeId(next.common[0]);
    trackEvent("scanner_result", { business: id, challenge: next.common[0] });
  }

  function chooseChallenge(id: ChallengeId) {
    setChallengeId(id);
    trackEvent("scanner_result", { business: businessId, challenge: id });
    // On a phone the answer sits below the questions, so bring it into view.
    if (window.matchMedia("(max-width: 899.95px)").matches) {
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      result.current?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    }
  }

  return (
    <Box sx={{ display: "grid", gap: { xs: 3, md: 4 }, alignItems: "start", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 5fr) minmax(0, 7fr)" } }}>
      {/* The two questions */}
      <Box sx={{ display: "grid", gap: { xs: 3.5, md: 4.5 } }}>
        <Box component="fieldset" sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
          <Box component="legend" sx={{ ...heading, display: "flex", alignItems: "center", gap: 1.5, p: 0, mb: 2 }}>
            <Box component="span" aria-hidden="true" sx={stepNumber}>1</Box>What kind of business do you run?
          </Box>
          <Box sx={{ display: "grid", gap: 1.25, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            {businessTypes.map(item => {
              const Icon = businessIcons[item.id];
              const selected = item.id === businessId;
              return (
                <Box component="label" key={item.id} sx={lab.choice(selected)}>
                  <input type="radio" name="scanner-business" value={item.id} checked={selected} onChange={() => chooseBusiness(item.id)} />
                  <Icon aria-hidden="true" />{item.label}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box component="fieldset" sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
          <Box component="legend" sx={{ ...heading, display: "flex", alignItems: "center", gap: 1.5, p: 0, mb: 2 }}>
            <Box component="span" aria-hidden="true" sx={stepNumber}>2</Box>What is your biggest challenge?
          </Box>
          <Box sx={{ display: "grid", gap: 1.25 }}>
            {challenges.map(item => {
              const selected = item.id === challengeId;
              const common = business.common.includes(item.id);
              return (
                <Box component="label" key={item.id} sx={lab.choice(selected)}>
                  <input type="radio" name="scanner-challenge" value={item.id} checked={selected} onChange={() => chooseChallenge(item.id)} />
                  <Box component="span" sx={{ flex: 1, minWidth: 0 }}>{item.label}</Box>
                  {/* A lit dot marks the challenges this kind of business meets most. */}
                  {common && <Box component="span" title={`Common for ${business.plural}`} sx={{ flex: "none", width: 8, height: 8, borderRadius: "50%",
                    background: selected ? palette.navy[650] : palette.sky[150], boxShadow: selected ? "none" : `0 0 8px ${palette.blue[300]}` }}>
                    <Box component="span" className="sr-only">(common for {business.plural})</Box>
                  </Box>}
                </Box>
              );
            })}
          </Box>
          <Box component="p" sx={{ display: "flex", alignItems: "center", gap: 1, m: "14px 0 0", color: palette.slate[275], fontSize: "0.84rem" }}>
            <Box component="span" aria-hidden="true" sx={{ width: 8, height: 8, borderRadius: "50%", background: palette.sky[150], boxShadow: `0 0 8px ${palette.blue[300]}` }} />
            Common for {business.plural}
          </Box>
        </Box>
      </Box>

      {/* The answer */}
      <Box ref={result} role="region" aria-label="Your suggested first AI project" sx={{
        scrollMarginTop: 88,
        ...neural.glassCard, backdropFilter: "blur(8px)", borderRadius: "22px", position: { xs: "relative", md: "sticky" }, top: { md: 104 },
        borderColor: withAlpha(palette.sky[150], 0.55),
        boxShadow: `inset 0 1px 0 ${withAlpha(palette.slate[75], 0.4)}, inset 0 0 30px ${withAlpha(palette.blue[350], 0.18)}, 0 0 34px -8px ${withAlpha(palette.blue[350], 0.5)}, 0 26px 52px -30px ${withAlpha(palette.black, 0.9)}`,
        "&::before": { ...neural.glassCard["&::before"], left: 0, right: 0, opacity: 1 },
        "&::after": { display: "none" }, "&:hover, &:focus-visible, &:focus-within": {},
      }}>
        {/* Screen readers hear the new suggestion, not the whole card again. */}
        <Box className="sr-only" role="status">Suggested first project: {challenge.solution}</Box>
        <Box key={`${business.id}-${challenge.id}`} sx={{ position: "relative", zIndex: 1, p: { xs: 2.5, sm: 3, md: 3.5 },
          animation: `${reveal} 0.75s ${neural.ease} both`,
          "&::after": { content: '""', position: "absolute", left: 0, right: 0, top: 0, height: 2, pointerEvents: "none", opacity: 0,
            background: `linear-gradient(90deg, transparent, ${palette.cyan[25]}, transparent)`, boxShadow: `0 0 14px 3px ${palette.sky[150]}, 0 0 40px 10px ${withAlpha(palette.blue[350], 0.5)}`,
            animation: `${beam} 0.75s ${neural.ease} both` },
          "@media (prefers-reduced-motion: reduce)": { animation: "none", "&::after": { display: "none" } } }}>
          <Box component="p" sx={{ ...neural.label, m: 0 }}>Your first AI opportunity</Box>
          <Box component="h3" sx={{ ...neural.accentText, m: "10px 0 0", fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)", fontWeight: 660, letterSpacing: "-0.04em", lineHeight: 1.12 }}>
            {challenge.solution}
          </Box>
          <Route nodes={[
            { Icon: BusinessIcon, text: business.label },
            { Icon: ReportProblemOutlined, text: challenge.problem },
            { Icon: AutoAwesomeOutlined, text: service?.shortName ?? "First project", lit: true },
          ]} />

          <Box component="h4" sx={{ ...lab.caption, m: "28px 0 12px" }}>How it would work</Box>
          <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.25 }}>
            {challenge.steps.map((step, index) => (
              <Box component="li" key={step} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", color: palette.slate[100], fontSize: "0.96rem", lineHeight: 1.5 }}>
                <Box component="span" aria-hidden="true" sx={{ ...stepNumber, width: 24, height: 24, mt: "1px", fontSize: "0.72rem" }}>{index + 1}</Box>
                {step}
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 3, display: "grid", gap: 2, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" } }}>
            <Box sx={{ p: 2, borderRadius: "14px", border: `1px solid ${withAlpha(palette.sky[175], 0.2)}`, background: withAlpha(palette.navy[850], 0.45) }}>
              <Box component="h4" sx={{ ...lab.caption, m: "0 0 10px" }}>Likely benefits</Box>
              <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1 }}>
                {challenge.benefits.map(benefit => (
                  <Box component="li" key={benefit} sx={{ display: "flex", gap: 1, alignItems: "flex-start", color: palette.slate[100], fontSize: "0.92rem", lineHeight: 1.45 }}>
                    <CheckRounded aria-hidden="true" sx={{ flex: "none", mt: "2px", fontSize: 18, color: palette.sky[150] }} />{benefit}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ display: "grid", gap: 1.5, alignContent: "start", p: 2, borderRadius: "14px", border: `1px solid ${withAlpha(palette.sky[175], 0.2)}`, background: withAlpha(palette.navy[850], 0.45) }}>
              <div>
                <Box component="h4" sx={{ ...lab.caption, display: "flex", alignItems: "center", gap: 0.75, m: "0 0 6px", "& svg": { fontSize: 16 } }}>
                  <StraightenOutlined aria-hidden="true" />What we’d measure
                </Box>
                <Box component="p" sx={{ m: 0, color: palette.grey[25], fontWeight: 600, fontSize: "0.95rem", lineHeight: 1.4 }}>{challenge.measure}</Box>
              </div>
              <div>
                <Box component="h4" sx={{ ...lab.caption, display: "flex", alignItems: "center", gap: 0.75, m: "0 0 6px", "& svg": { fontSize: 16 } }}>
                  <FlagOutlined aria-hidden="true" />Where to start
                </Box>
                <Box component="p" sx={{ m: 0, color: palette.slate[100], fontSize: "0.92rem", lineHeight: 1.45 }}>{challenge.priority}</Box>
              </div>
            </Box>
          </Box>

          {example && <Box component="p" sx={{ m: "18px 0 0", pl: 1.75, borderLeft: `2px solid ${palette.sky[150]}`, color: palette.slate[125], fontSize: "0.93rem", lineHeight: 1.55 }}>
            <Box component="strong" sx={{ color: palette.grey[25], fontWeight: 650 }}>For {business.plural}: </Box>{example}
          </Box>}

          <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 20px" }}>
            <LinkButton href={`/contact?service=${challenge.service}&business=${business.id}&challenge=${challenge.id}#project-brief`}
              variant="contained" size="large" endIcon={<ArrowForwardRounded />}
              onClick={() => trackEvent("scanner_cta_click", { business: business.id, challenge: challenge.id })}>
              Request my AI plan
            </LinkButton>
            {service && <Box component={Link} href={"/" + service.slug} prefetch={false} sx={neural.trailLink}>
              About {service.shortName} <ArrowForwardRounded aria-hidden="true" />
            </Box>}
          </Box>
          <Box component="p" sx={{ m: "16px 0 0", color: palette.slate[275], fontSize: "0.82rem", lineHeight: 1.5 }}>
            A starting suggestion, not a quote. We check the fit with you on a free call before any work begins.
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
