import type { LeadDetails } from "@/lib/lead";

/**
 * Sends a copy of an enquiry to a CRM or an automation tool (HubSpot, Pipedrive, Zapier,
 * Make and the like) as JSON. It is off unless LEAD_WEBHOOK_URL is set. The email to the team
 * is the record of the enquiry; this is a convenience on top, so a slow or failing CRM never
 * loses a lead or delays the visitor.
 */
export async function forwardLead(lead: LeadDetails, url: string | undefined, send: typeof fetch = fetch) {
  if (!url) return "off" as const;
  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return "invalid" as const;
  }
  if (target.protocol !== "https:") return "invalid" as const;
  try {
    const response = await send(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString(), site: "bluetrendy.com" }),
      signal: AbortSignal.timeout(4000),
    });
    return response.ok ? "sent" as const : "failed" as const;
  } catch {
    return "failed" as const;
  }
}
