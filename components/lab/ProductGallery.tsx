"use client";

import { useId, useState } from "react";
import Box from "@mui/material/Box";
import type { SvgIconComponent } from "@mui/icons-material";
import SpaceDashboardOutlined from "@mui/icons-material/SpaceDashboardOutlined";
import LanguageOutlined from "@mui/icons-material/LanguageOutlined";
import SmartphoneOutlined from "@mui/icons-material/SmartphoneOutlined";
import TiltFigure from "@/components/interior/TiltFigure";
import { mockupFor, type MockScene } from "@/components/interior/ServiceMockups";
import { neural } from "@/components/experience/neuralStyle";
import { trackEvent } from "@/lib/analytics";
import { palette } from "@/theme/palette";
import { lab } from "./labStyle";

const views: { id: MockScene; tab: string; Icon: SvgIconComponent; text: string; tint: string }[] = [
  { id: "booking", tab: "Website & booking", Icon: LanguageOutlined, tint: palette.cyan[225],
    text: "A clinic’s website where a visitor picks a treatment, books a time and pays, with the confirmation on their phone." },
  { id: "operations", tab: "Business software", Icon: SpaceDashboardOutlined, tint: palette.blue[200],
    text: "An operations workspace: live figures, a weekly chart and an approvals queue, in place of a shared spreadsheet." },
  { id: "field", tab: "Mobile app", Icon: SmartphoneOutlined, tint: palette.violet[300],
    text: "A field inspection app that keeps working without signal and sends its reports when the phone is back online." },
];

/**
 * Three example products on one stage: a booking website, a business workspace and a mobile
 * app. Each is drawn as the screen a client would receive, with made-up data.
 */
export default function ProductGallery() {
  const [current, setCurrent] = useState<MockScene>(views[0].id);
  const id = useId();
  const view = views.find(item => item.id === current) ?? views[0];
  const { label, Scene } = mockupFor(view.id);

  function choose(next: MockScene) {
    setCurrent(next);
    trackEvent("showcase_view", { product: next });
  }

  return (
    <Box sx={{ ...neural.glassCard, backdropFilter: "blur(8px)", borderRadius: "22px", p: { xs: 2, sm: 3, md: 3.5 },
      "&::after": { display: "none" }, "& > *": { position: "relative", zIndex: 1 }, "&:hover, &:focus-visible, &:focus-within": {} }}>
      <Box component="p" sx={{ ...neural.label, m: 0 }}>Three example products</Box>
      <Box component="fieldset" sx={{ border: 0, m: "18px 0 0", p: 0, minWidth: 0 }}>
        <Box component="legend" className="sr-only">Choose a kind of product</Box>
        <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(3, minmax(0, 1fr))" } }}>
          {views.map(item => (
            <Box component="label" key={item.id} sx={lab.choice(item.id === current)}>
              <input type="radio" name={`${id}-product`} checked={item.id === current} onChange={() => choose(item.id)} />
              <item.Icon aria-hidden="true" />{item.tab}
            </Box>
          ))}
        </Box>
      </Box>
      <Box component="p" aria-live="polite" sx={{ m: "16px 0 0", maxWidth: "70ch", color: palette.slate[125], fontSize: "0.98rem", lineHeight: 1.55 }}>{view.text}</Box>
      {/* The stage takes its glow from --tint, as the chapters on the services page do. */}
      <Box key={view.id} sx={{ "--tint": view.tint, "& > div:first-of-type": { mt: 2.5 } }}>
        <TiltFigure label={label} tone="dark"><Scene /></TiltFigure>
      </Box>
    </Box>
  );
}
