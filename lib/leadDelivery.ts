import { createHash } from "node:crypto";
import type { CreateEmailOptions } from "resend";
import type { LeadDetails } from "@/lib/lead";
import { emailTemplates } from "@/lib/emailTemplates";

export function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function notificationVariables(lead: LeadDetails) {
  const fields = {
    CONTACT_NAME: lead.name,
    CONTACT_EMAIL: lead.email,
    CONTACT_COMPANY: lead.company || "Not specified",
    CONTACT_PROJECT_TYPE: lead.projectType || "Not specified",
    CONTACT_BUDGET: lead.budget || "Not specified",
    CONTACT_TIMELINE: lead.timeline || "Not specified",
    CONTACT_MESSAGE: lead.message,
  };
  const variables: Record<string, string> = { CONTACT_EMAIL_URI: encodeURIComponent(lead.email) };
  for (const [key, value] of Object.entries(fields)) {
    variables[key] = value;
    variables[`${key}_HTML`] = escapeHtml(value);
  }
  variables.CONTACT_MESSAGE_HTML = variables.CONTACT_MESSAGE_HTML.replace(/\r?\n/g, "<br />");
  return variables;
}

/** Template values for the team's enquiry notification and the visitor's confirmation. */
export function contactVariables(lead: LeadDetails) {
  return {
    notification: notificationVariables(lead),
    confirmation: {
      CONTACT_NAME: lead.name,
      CONTACT_NAME_HTML: escapeHtml(lead.name),
      BOOKING_URL: new URL("/book-a-call", process.env.NEXT_PUBLIC_SITE_URL || "https://www.bluetrendy.com").href,
    },
  };
}

export type EmailSender = (
  email: CreateEmailOptions,
  options: { idempotencyKey: string },
) => Promise<{
  data: { id: string } | null;
  error: { name: string; statusCode?: number | null } | null;
}>;

export class EmailDeliveryError extends Error {
  constructor(public readonly code: string, public readonly statusCode?: number | null) {
    super("Email delivery failed.");
    this.name = "EmailDeliveryError";
  }
}

export async function sendWithRetry(send: EmailSender, payload: CreateEmailOptions, key: string) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { data, error } = await send(payload, { idempotencyKey: key });
      if (!error && data?.id) return;
      throw new EmailDeliveryError(error?.name ?? "missing_email_id", error?.statusCode);
    } catch (error) {
      const retryable = !(error instanceof EmailDeliveryError) ||
        error.statusCode === 429 || (error.statusCode != null && error.statusCode >= 500);
      if (!retryable || attempt === 2) {
        throw error instanceof EmailDeliveryError ? error : new EmailDeliveryError("network_error");
      }
      await new Promise((resolve) => setTimeout(resolve, 400 * 2 ** attempt));
    }
  }
}

export async function deliverLead(
  lead: LeadDetails,
  options: { send: EmailSender; from: string; notificationEmail: string },
) {
  // Resend retains these keys for 24h, protecting retries from duplicate emails.
  const submission = createHash("sha256").update(JSON.stringify(lead)).digest("hex");
  await sendWithRetry(options.send, {
    from: options.from,
    to: options.notificationEmail,
    replyTo: lead.email,
    template: {
      id: emailTemplates.contactNotification,
      variables: contactVariables(lead).notification,
    },
    tags: [{ name: "type", value: "contact-notification" }],
  }, `lead/hosted-v1/${submission}/notification`);

  // A receipt should only go out once the team's notification is accepted.
  try {
    await sendWithRetry(options.send, {
      from: options.from,
      to: lead.email,
      replyTo: options.notificationEmail,
      template: {
        id: emailTemplates.contactConfirmation,
        variables: contactVariables(lead).confirmation,
      },
      tags: [{ name: "type", value: "contact-confirmation" }],
    }, `lead/hosted-v1/${submission}/confirmation`);
    return { confirmationSent: true };
  } catch (error) {
    console.error("Contact confirmation failed:", error instanceof EmailDeliveryError ? error.code : "unknown_error");
    return { confirmationSent: false };
  }
}
