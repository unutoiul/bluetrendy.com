export const leadFieldLimits = {
  name: 200,
  email: 254,
  company: 200,
  projectType: 100,
  budget: 100,
  timeline: 100,
  message: 4000,
} as const;

export type LeadDetails = { -readonly [Key in keyof typeof leadFieldLimits]: string };

export function parseLeadSubmission(body: unknown):
  | { lead: LeadDetails; error?: never }
  | { error: string; lead?: never } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Please send a valid project brief." };
  }

  const values = body as Record<string, unknown>;
  const lead = {} as LeadDetails;

  for (const key of Object.keys(leadFieldLimits) as (keyof LeadDetails)[]) {
    const value = values[key] ?? "";
    if (typeof value !== "string" || value.length > leadFieldLimits[key]) {
      return { error: `Please check the ${key === "projectType" ? "project type" : key} field.` };
    }
    if (key !== "message" && /[\u0000-\u001f\u007f]/.test(value)) {
      return { error: "Please remove line breaks or special control characters from your contact details." };
    }
    lead[key] = value.trim();
  }

  if (!lead.name || !lead.message) {
    return { error: "Please fill in your name, email, and a short project summary." };
  }

  const emailPattern = /^[^\s@<>,;:"()[\]\\]+@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
  const localPart = lead.email.split("@")[0];
  if (
    !emailPattern.test(lead.email) || localPart.length > 64 ||
    localPart.startsWith(".") || localPart.endsWith(".") || localPart.includes("..")
  ) {
    return { error: "Please enter a valid email address so we can reply to you." };
  }

  return { lead };
}
