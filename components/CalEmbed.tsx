"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

const namespace = "bluetrendy-discovery";
const colors = {
  "cal-brand": "#2879DF",
  "cal-brand-emphasis": "#1F63B8",
  "cal-brand-text": "#FFFFFF",
  "cal-text": "#0B1F2B",
  "cal-text-emphasis": "#0B1F2B",
  "cal-text-subtle": "#4B6577",
  "cal-bg": "#FFFFFF",
  "cal-bg-subtle": "#F5F8FA",
  "cal-border": "#DCE5EB",
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
