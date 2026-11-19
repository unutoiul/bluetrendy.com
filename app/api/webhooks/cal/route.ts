import { NextResponse } from "next/server";
import { getResendClient, isEmailConfigured } from "@/lib/email";
import { EmailDeliveryError } from "@/lib/leadDelivery";
import { deliverBooking, parseCalBooking, verifyCalSignature } from "@/lib/notifications";

export const runtime = "nodejs";

/**
 * Cal.com calls this when someone books a call (Settings → Developer → Webhooks, trigger
 * "Booking created", secret = CAL_WEBHOOK_SECRET). It emails the team and the person who booked.
 */
export async function POST(request: Request) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret || !isEmailConfigured()) {
    console.error("Booking emails are not configured.");
    return NextResponse.json({ error: "Booking emails are not configured." }, { status: 503 });
  }

  const body = await request.text();
  if (body.length > 200_000) return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  if (!verifyCalSignature(body, request.headers.get("x-cal-signature-256"), secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: unknown;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  // Pings and other triggers are acknowledged so Cal.com doesn't retry them.
  const booking = parseCalBooking(event);
  if (!booking) return NextResponse.json({ ok: true, ignored: true });

  try {
    const resend = getResendClient();
    const result = await deliverBooking(booking, {
      send: resend.emails.send.bind(resend.emails),
      from: process.env.EMAIL_FROM as string,
      notificationEmail: process.env.LEAD_NOTIFICATION_EMAIL as string,
    });
    // A failed confirmation asks Cal.com to retry; the team's copy won't be sent twice.
    return NextResponse.json({ ok: result.confirmationSent }, { status: result.confirmationSent ? 200 : 502 });
  } catch (error) {
    console.error("Booking notification failed:", error instanceof EmailDeliveryError ? error.code : "unknown_error");
    return NextResponse.json({ error: "Email delivery failed." }, { status: 502 });
  }
}
