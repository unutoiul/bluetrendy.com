import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getResendClient, isEmailConfigured } from "@/lib/email";
import { EmailDeliveryError } from "@/lib/leadDelivery";
import { deliverDiscovery, parseDiscoveryCheckout } from "@/lib/notifications";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Stripe calls this when a checkout completes (Developers → Webhooks, events
 * checkout.session.completed and checkout.session.async_payment_succeeded, signing secret =
 * STRIPE_WEBHOOK_SECRET). A paid discovery sprint emails the team and the customer.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !isStripeConfigured() || !isEmailConfigured()) {
    console.error("Payment emails are not configured.");
    return NextResponse.json({ error: "Payment emails are not configured." }, { status: 503 });
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripeClient().webhooks.constructEvent(body, request.headers.get("stripe-signature") ?? "", secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
    return NextResponse.json({ ok: true, ignored: true });
  }
  // Unpaid sessions (a bank transfer still pending) and other products are acknowledged and skipped.
  const purchase = parseDiscoveryCheckout(event.data.object, new Date(event.created * 1000));
  if (!purchase) return NextResponse.json({ ok: true, ignored: true });

  try {
    const resend = getResendClient();
    const result = await deliverDiscovery(purchase, {
      send: resend.emails.send.bind(resend.emails),
      from: process.env.EMAIL_FROM as string,
      notificationEmail: process.env.LEAD_NOTIFICATION_EMAIL as string,
    });
    // A failed confirmation asks Stripe to retry; the team's copy won't be sent twice.
    return NextResponse.json({ ok: result.confirmationSent }, { status: result.confirmationSent ? 200 : 502 });
  } catch (error) {
    console.error("Payment notification failed:", error instanceof EmailDeliveryError ? error.code : "unknown_error");
    return NextResponse.json({ error: "Email delivery failed." }, { status: 502 });
  }
}
