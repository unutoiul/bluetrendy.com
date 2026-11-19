// The visitor's answer to the analytics cookie question, kept in this browser only.
// Google Analytics and Microsoft Clarity load only after "granted".

export type Consent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const storageKey = "bluetrendy:analytics-consent";
const settingsEvent = "bluetrendy:consent-settings";
const listeners = new Set<() => void>();

export function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(storageKey);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: Consent) {
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    // Without storage the question is asked again on the next visit.
  }
  listeners.forEach(listener => listener());
}

/** For useSyncExternalStore: re-reads when the choice changes here or in another tab. */
export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Reopens the cookie banner, for the "Cookie settings" links. */
export function openConsentSettings() {
  window.dispatchEvent(new Event(settingsEvent));
}

export function onConsentSettings(listener: () => void) {
  window.addEventListener(settingsEvent, listener);
  return () => window.removeEventListener(settingsEvent, listener);
}

/** Removes the cookies Google Analytics and Clarity set, on this host and its parent domains. */
export function clearAnalyticsCookies() {
  const parts = location.hostname.split(".");
  const domains = ["", ...parts.map((_, index) => "." + parts.slice(index).join("."))];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!/^(_ga|_gid|_gat|_clck|_clsk)/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}
