"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";import { palette } from "@/theme/palette";


const namespace = "bluetrendy-discovery";
const colors = {
  "cal-brand": palette.blue[425],
  "cal-brand-emphasis": palette.blue[475],
  "cal-brand-text": palette.white,
  "cal-text": palette.navy[800],
  "cal-text-emphasis": palette.navy[800],
  "cal-text-subtle": palette.slate[525],
  "cal-bg": palette.white,
  "cal-bg-subtle": palette.grey[25],
  "cal-border": palette.slate[150],
  "cal-border-booker-width": "0px",
  "radius": "10px",
};
const embedConfig = { layout: "month_view", theme: "light" } as const;

export type BookingPrefill = { name: string; email: string; notes: string };

export default function CalEmbed({ calLink, prefill }: { calLink: string; prefill?: BookingPrefill }) {
  useEffect(() => {
    let active = true;
    getCalApi({ namespace }).then((cal) => {
      if (!active) return;
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: true,
        layout: "month_view",
        cssVarsPerTheme: { light: colors, dark: colors },
      });
    }).catch(() => {
      // The booking page link remains available if a browser blocks the embed.
    });
    return () => { active = false; };
  }, []);

  return (
    <Cal
      namespace={namespace}
      calLink={calLink}
      style={{ width: "100%", minHeight: 420 }}
      // The details from the earlier booking steps are already filled in on the booking form.
      config={prefill ? { ...embedConfig, ...prefill } : embedConfig}
    />
  );
}
