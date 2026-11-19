"use client";

import { track } from "@vercel/analytics";

export type AnalyticsEvent =
  | "chapter_view"
  | "cta_book_call_click"
  | "cta_start_project_click"
  | "lead_form_submit"
  | "lead_form_success"
  | "lead_form_error"
  | "checkout_start"
  | "checkout_success"
  | "checkout_error";

export function trackEvent(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  try {
    track(event, props);
  } catch {
    // analytics must never break the UI
  }
}
