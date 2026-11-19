import { createHmac, timingSafeEqual } from "node:crypto";
import type Stripe from "stripe";
import { emailTemplates } from "@/lib/emailTemplates";
import { EmailDeliveryError, escapeHtml, sendWithRetry, type EmailSender } from "@/lib/leadDelivery";
import { findDiscoveryPackage } from "@/data/pricing";

export type DeliveryOptions = { send: EmailSender; from: string; notificationEmail: string };

const siteUrl = (path: string) => new URL(path, process.env.NEXT_PUBLIC_SITE_URL || "https://www.bluetrendy.com").href;
const text = (value: unknown, max = 2000) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const firstName = (name: string) => name.split(/\s+/)[0] || name;
const multiline = (value: string) => escapeHtml(value).replace(/\r?\n/g, "<br />");

/** Sends the team's notification, then the customer's copy; a failed copy never hides a received notification. */
async function deliverPair(
  options: DeliveryOptions,
  key: string,
  customerEmail: string,
  notification: { id: string; variables: Record<string, string> },
  confirmation: { id: string; variables: Record<string, string> },
) {
  await sendWithRetry(options.send, {
    from: options.from,
    to: options.notificationEmail,
    replyTo: customerEmail,
    template: notification,
    tags: [{ name: "type", value: notification.id.replace("bluetrendy-", "") }],
  }, `${key}/notification`);
  try {
    await sendWithRetry(options.send, {
      from: options.from,
      to: customerEmail,
      replyTo: options.notificationEmail,
      template: confirmation,
      tags: [{ name: "type", value: confirmation.id.replace("bluetrendy-", "") }],
    }, `${key}/confirmation`);
    return { confirmationSent: true };
  } catch (error) {
    console.error(`${confirmation.id} failed:`, error instanceof EmailDeliveryError ? error.code : "unknown_error");
    return { confirmationSent: false };
  }
}

// ---------------------------------------------------------------- Cal.com bookings

export type Booking = {
  uid: string;
  name: string;
  email: string;
  start: Date;
  end: Date;
  attendeeTimeZone: string;
  organizerTimeZone: string;
  meetingUrl: string | null;
  notes: string;
};

/** Cal.com signs the raw body with the webhook secret: hex HMAC-SHA256 in `x-cal-signature-256`. */
export function verifyCalSignature(body: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest();
  const given = Buffer.from(signature.trim(), "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Reads a Cal.com BOOKING_CREATED webhook; anything else, or a booking without a usable attendee, is null. */
export function parseCalBooking(event: unknown): Booking | null {
  if (!event || typeof event !== "object") return null;
  const { triggerEvent, payload } = event as { triggerEvent?: unknown; payload?: Record<string, unknown> };
  if (triggerEvent !== "BOOKING_CREATED" || !payload || typeof payload !== "object") return null;
  const attendee = (Array.isArray(payload.attendees) ? payload.attendees[0] : null) as Record<string, unknown> | null;
  const organizer = (payload.organizer ?? {}) as Record<string, unknown>;
  const responses = (payload.responses ?? {}) as Record<string, { value?: unknown } | undefined>;
  const email = text(attendee?.email, 254);
  const uid = text(payload.uid, 200);
  const start = new Date(text(payload.startTime, 40));
  const end = new Date(text(payload.endTime, 40));
  if (!uid || !isEmail(email) || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const videoCall = (payload.videoCallData ?? {}) as { url?: unknown };
  const metadata = (payload.metadata ?? {}) as { videoCallUrl?: unknown };
  const meetingUrl = [videoCall.url, metadata.videoCallUrl, payload.location]
    .map(value => text(value, 500)).find(value => value.startsWith("https://")) ?? null;
  return {
    uid,
    name: text(attendee?.name, 120) || email,
    email,
    start,
    end,
    attendeeTimeZone: text(attendee?.timeZone, 64) || "Europe/London",
    organizerTimeZone: text(organizer.timeZone, 64) || "Europe/London",
    meetingUrl,
    notes: text(payload.additionalNotes) || text(responses.notes?.value) || text(payload.description),
  };
}

/** "Tuesday, 1 December 2026 at 09:30 (New York time)": a city reads better than "GMT-5". */
function formatWhen(date: Date, timeZone: string): string {
  try {
    const when = new Intl.DateTimeFormat("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone,
    }).format(date);
    const city = timeZone.includes("/") ? timeZone.split("/").pop()!.replace(/_/g, " ") : timeZone;
    return `${when} (${city} time)`;
  } catch {
    return formatWhen(date, "Europe/London");
  }
}

function meetingLabel(url: string | null) {
  if (!url) return "Details in your calendar invite";
  const host = new URL(url).hostname;
  if (host.endsWith("meet.google.com")) return "Google Meet";
  if (host.endsWith("zoom.us")) return "Zoom";
  if (host.endsWith("teams.microsoft.com") || host.endsWith("teams.live.com")) return "Microsoft Teams";
  if (host.endsWith("cal.com") || host.endsWith("cal.video")) return "Cal Video";
  return "Video call";
}

export function bookingVariables(booking: Booking) {
  const manageUrl = `https://cal.com/booking/${encodeURIComponent(booking.uid)}`;
  const minutes = Math.max(1, Math.round((booking.end.getTime() - booking.start.getTime()) / 60_000));
  const shared = {
    BOOKING_DURATION_HTML: `${minutes} minutes`,
    BOOKING_MEETING_LABEL_HTML: escapeHtml(meetingLabel(booking.meetingUrl)),
    BOOKING_MEETING_URL_HTML: escapeHtml(booking.meetingUrl ?? manageUrl),
    BOOKING_MANAGE_URL_HTML: escapeHtml(manageUrl),
  };
  const teamWhen = formatWhen(booking.start, booking.organizerTimeZone);
  const guestWhen = formatWhen(booking.start, booking.attendeeTimeZone);
  return {
    notification: {
      ...shared,
      BOOKING_NAME: booking.name,
      BOOKING_WHEN: teamWhen,
      BOOKING_NAME_HTML: escapeHtml(booking.name),
      BOOKING_WHEN_HTML: escapeHtml(teamWhen),
      BOOKING_TIMEZONE_HTML: escapeHtml(booking.attendeeTimeZone.replace(/_/g, " ")),
      BOOKING_EMAIL_HTML: escapeHtml(booking.email),
      BOOKING_EMAIL_URI: encodeURIComponent(booking.email),
      BOOKING_NOTES_HTML: booking.notes ? multiline(booking.notes) : "No notes added.",
    },
    confirmation: {
      ...shared,
      BOOKING_WHEN: guestWhen,
      BOOKING_WHEN_HTML: escapeHtml(guestWhen),
      FIRST_NAME_HTML: escapeHtml(firstName(booking.name)),
      BOOKING_ACTION_LABEL_HTML: booking.meetingUrl ? "Join the call" : "View your booking",
    },
  };
}

export function deliverBooking(booking: Booking, options: DeliveryOptions) {
  const variables = bookingVariables(booking);
  return deliverPair(options, `booking/v1/${booking.uid}`, booking.email,
    { id: emailTemplates.bookingNotification, variables: variables.notification },
    { id: emailTemplates.bookingConfirmation, variables: variables.confirmation });
}

// ---------------------------------------------------------------- Stripe discovery sprints

export type DiscoveryPurchase = {
  sessionId: string;
  reference: string;
  name: string;
  email: string;
  packageName: string;
  employees: string;
  duration: string;
  includes: string[];
  amount: string;
  paidAt: Date;
  brief: string;
  paymentUrl: string;
};

/** A paid discovery sprint from a Checkout Session our pricing page created; anything else is null. */
export function parseDiscoveryCheckout(session: Stripe.Checkout.Session, paidAt: Date): DiscoveryPurchase | null {
  if (session.mode !== "payment" || session.payment_status !== "paid" || session.metadata?.source !== "pricing_page") return null;
  const sprint = findDiscoveryPackage(session.metadata?.package);
  const email = text(session.customer_details?.email ?? session.customer_email, 254);
  if (!sprint || !isEmail(email) || session.amount_total == null) return null;
  const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  return {
    sessionId: session.id,
    reference: session.id.slice(-10).toUpperCase(),
    name: text(session.customer_details?.name, 120) || email.split("@")[0],
    email,
    packageName: sprint.name,
    employees: sprint.employees,
    duration: sprint.duration,
    includes: sprint.includes,
    amount: new Intl.NumberFormat("en-GB", { style: "currency", currency: (session.currency ?? "gbp").toUpperCase() })
      .format(session.amount_total / 100),
    paidAt,
    brief: text(session.metadata?.brief),
    paymentUrl: paymentIntent ? `https://dashboard.stripe.com/payments/${paymentIntent}` : "https://dashboard.stripe.com/payments",
  };
}

export function discoveryVariables(purchase: DiscoveryPurchase) {
  const paidAt = formatWhen(purchase.paidAt, "Europe/London");
  const shared = {
    PACKAGE_NAME: purchase.packageName,
    PACKAGE_NAME_HTML: escapeHtml(purchase.packageName),
    AMOUNT_HTML: escapeHtml(purchase.amount),
    PAID_AT_HTML: escapeHtml(paidAt),
  };
  return {
    notification: {
      ...shared,
      AMOUNT: purchase.amount,
      CUSTOMER_NAME_HTML: escapeHtml(purchase.name),
      CUSTOMER_EMAIL_HTML: escapeHtml(purchase.email),
      CUSTOMER_EMAIL_URI: encodeURIComponent(purchase.email),
      PACKAGE_SIZE_HTML: escapeHtml(purchase.employees),
      BRIEF_HTML: purchase.brief ? multiline(purchase.brief) : "No brief added at checkout.",
      PAYMENT_URL_HTML: escapeHtml(purchase.paymentUrl),
    },
    confirmation: {
      ...shared,
      FIRST_NAME_HTML: escapeHtml(firstName(purchase.name)),
      DURATION_HTML: escapeHtml(purchase.duration.replace(/^About /, "about ")),
      REFERENCE_HTML: escapeHtml(purchase.reference),
      INCLUDES_HTML: purchase.includes.map(item => `<li style="margin:0 0 6px;">${escapeHtml(item)}</li>`).join(""),
      KICKOFF_URL_HTML: escapeHtml(siteUrl("/book-a-call")),
    },
  };
}

export function deliverDiscovery(purchase: DiscoveryPurchase, options: DeliveryOptions) {
  const variables = discoveryVariables(purchase);
  return deliverPair(options, `discovery/v1/${purchase.sessionId}`, purchase.email,
    { id: emailTemplates.discoveryNotification, variables: variables.notification },
    { id: emailTemplates.discoveryConfirmation, variables: variables.confirmation });
}
