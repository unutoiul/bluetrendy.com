// Tracking IDs for Google Analytics 4 and Microsoft Clarity on bluetrendy.com. They are public
// (the live page source shows them), so they live here. Environment variables can override
// them, and every ID is checked so nothing else ends up in the inline scripts.

const gaId = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-11XTHMWZE5").trim();
const clarityId = (process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "zfz7p4n2lf").trim();

export const analyticsIds = {
  ga: /^G-[A-Z0-9]+$/.test(gaId) ? gaId : undefined,
  clarity: /^[a-z0-9]+$/i.test(clarityId) ? clarityId : undefined,
};

/** True when at least one tool needs the visitor's consent. */
export const consentRequired = Boolean(analyticsIds.ga || analyticsIds.clarity);

/**
 * The scripts load only on the live site, so local development and Vercel preview
 * deployments never reach the reports. The cookie banner still appears everywhere.
 */
export const trackingLive = process.env.NODE_ENV === "production"
  && (process.env.NEXT_PUBLIC_VERCEL_ENV ?? "production") === "production";
