import { NextRequest, NextResponse } from "next/server";
import { getResendClient, isEmailConfigured } from "@/lib/email";
import { parseLeadSubmission } from "@/lib/lead";
import { deliverLead, EmailDeliveryError } from "@/lib/leadDelivery";
import { checkLeadRateLimit } from "@/lib/leadRateLimit";
import { forwardLead } from "@/lib/leadWebhook";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowedOrigins = new Set([
    request.nextUrl.origin,
    new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.bluetrendy.com").origin,
  ]);
  // Next.js can normalize the internal URL to localhost behind a proxy.
  // Browser Origin should also match the actual request Host (e.g. 127.0.0.1).
  let sameHost = false;
  try {
    sameHost = Boolean(origin && new URL(origin).host === request.headers.get("host"));
  } catch {
    // An invalid Origin is rejected below.
  }
  if (origin && !allowedOrigins.has(origin) && !sameHost) {
    return NextResponse.json({ error: "Please submit your enquiry through our website." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Please send a valid project brief." }, { status: 415 });
  }
  // Bound the body before parsing it, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ error: "Your project brief is empty." }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 32_768) {
      await reader.cancel();
      return NextResponse.json({ error: "Please keep your project brief under 4,000 characters." }, { status: 413 });
    }
    chunks.push(value);
  }
  let body;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return NextResponse.json({ error: "Please send a valid project brief." }, { status: 400 });
  }
  if (body && typeof body === "object" && typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true, confirmationSent: true });
  }
  const parsed = parseLeadSubmission(body);
  if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { lead } = parsed;
  if (!lead) return NextResponse.json({ error: "Please check your project brief." }, { status: 400 });

  if (!isEmailConfigured()) {
    console.error("Contact email delivery is not configured.");
    return NextResponse.json(
      {
        error:
          "We couldn't submit this automatically — please email contact@bluetrendy.com directly or book a call instead.",
      },
      { status: 503 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const limit = checkLeadRateLimit(lead.email, ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "You've sent several enquiries recently. Please wait a few minutes or email us directly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  try {
    const resend = getResendClient();
    const result = await deliverLead(lead, {
      send: resend.emails.send.bind(resend.emails),
      from: process.env.EMAIL_FROM as string,
      notificationEmail: process.env.LEAD_NOTIFICATION_EMAIL as string,
    });
    // Optional: a copy for the CRM. It runs after the team's email, and its outcome never changes the reply.
    const forwarded = await forwardLead(lead, process.env.LEAD_WEBHOOK_URL);
    if (forwarded === "failed" || forwarded === "invalid") console.error("Lead webhook:", forwarded);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Contact notification failed:", error instanceof EmailDeliveryError ? error.code : "unknown_error");
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please email contact@bluetrendy.com directly." },
      { status: 500 },
    );
  }
}
