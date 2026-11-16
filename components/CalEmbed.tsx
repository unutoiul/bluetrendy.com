"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

const namespace = "bluetrendy-discovery";
const colors = {
  "cal-brand": "#0B4563",
  "cal-brand-emphasis": "#071E2C",
  "cal-brand-text": "#FFFFFF",
  "cal-text": "#0B1F2B",
  "cal-text-emphasis": "#0B1F2B",
  "cal-text-subtle": "#4B6577",
  "cal-bg": "#FFFFFF",
  "cal-bg-subtle": "#F5F8FA",
  "cal-border": "#DCE5EB",
  "radius": "10px",
};

export default function CalEmbed({ calLink }: { calLink: string }) {
  useEffect(() => {
    let active = true;
    getCalApi({ namespace }).then((cal) => {
      if (!active) return;
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
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
      style={{ width: "100%", minHeight: 720, overflow: "auto" }}
      config={{ layout: "month_view", theme: "light" }}
    />
  );
}
