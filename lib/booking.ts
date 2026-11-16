export type BookingConfig = {
  provider: "cal" | "calendly";
  url: string;
  calLink: string;
};

export function getBookingConfig(calUrl?: string, calendlyUrl?: string): BookingConfig | null {
  const candidate = calUrl?.trim() || calendlyUrl?.trim();
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    const path = url.pathname.split("/").filter(Boolean);
    if (
      url.protocol !== "https:" || url.username || url.password || url.port ||
      path.length < 2 || path.some((part) => /^(?:your[-_](?:handle|username)|example)$/i.test(part))
    ) return null;

    if (url.hostname === "cal.com") {
      return { provider: "cal", url: url.href, calLink: path.join("/") };
    }
    if (url.hostname === "calendly.com") {
      return { provider: "calendly", url: url.href, calLink: "" };
    }
  } catch {
    // Incomplete setup should show the contact fallback, never a broken widget.
  }
  return null;
}
