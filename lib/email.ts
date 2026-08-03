import "server-only";
import { Resend } from "resend";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM && process.env.LEAD_NOTIFICATION_EMAIL);
}

let client: Resend | null = null;

export function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Email delivery is not configured.");
  }
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}
