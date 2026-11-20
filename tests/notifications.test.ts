import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import type Stripe from "stripe";
import { templates, templateVariables } from "../emails/templates";
import { emailTemplates } from "@/lib/emailTemplates";
import { contactVariables, deliverLead } from "@/lib/leadDelivery";
import {
  bookingVariables, deliverBooking, discoveryVariables, parseCalBooking, parseDiscoveryCheckout, verifyCalSignature,
} from "@/lib/notifications";

type Sender = Parameters<typeof deliverLead>[1]["send"];
const options = { from: "BlueTrendy <contact@bluetrendy.com>", notificationEmail: "team@example.test" };

const calEvent = {
  triggerEvent: "BOOKING_CREATED",
  payload: {
    uid: "bk_123",
    title: "Discovery call between BlueTrendy and Sam",
    startTime: "2026-12-01T14:30:00.000Z",
    endTime: "2026-12-01T15:00:00.000Z",
    organizer: { name: "BlueTrendy", email: "team@example.test", timeZone: "Europe/London" },
    attendees: [{ name: "Sam <b>Lee</b>", email: "sam@example.test", timeZone: "America/New_York" }],
    videoCallData: { url: "https://meet.google.com/abc-defg-hij" },
    responses: { notes: { value: "Line one\nLine <two>" } },
  },
};

const paidSession = {
  id: "cs_live_a1b2c3d4e5f6g7h8i9j0",
  mode: "payment",
  payment_status: "paid",
  amount_total: 65000,
  currency: "gbp",
  customer_email: "sam@example.test",
  customer_details: { name: "Sam Lee", email: "sam@example.test" },
  payment_intent: "pi_123",
  metadata: { source: "pricing_page", package: "growing", brief: "A booking portal." },
} as unknown as Stripe.Checkout.Session;

test("every template only uses variables the site sends", () => {
  const booking = parseCalBooking(calEvent)!;
  const purchase = parseDiscoveryCheckout(paidSession, new Date("2026-11-19T10:00:00Z"))!;
  const contact = contactVariables({ name: "Sam", email: "sam@example.test", company: "", projectType: "", budget: "", timeline: "", message: "Hi", source: "" });
  const sent: Record<string, Record<string, string>> = {
    [emailTemplates.contactNotification]: contact.notification,
    [emailTemplates.contactConfirmation]: contact.confirmation,
    [emailTemplates.bookingNotification]: bookingVariables(booking).notification,
    [emailTemplates.bookingConfirmation]: bookingVariables(booking).confirmation,
    [emailTemplates.discoveryNotification]: discoveryVariables(purchase).notification,
    [emailTemplates.discoveryConfirmation]: discoveryVariables(purchase).confirmation,
  };
  assert.equal(templates.length, 6);
  for (const template of templates) {
    const missing = templateVariables(template).filter(key => !(key in sent[template.alias]));
    assert.deepEqual(missing, [], template.alias);
  }
});

test("Cal.com signatures are checked against the raw body", () => {
  const body = JSON.stringify(calEvent);
  const signature = createHmac("sha256", "secret").update(body).digest("hex");
  assert.equal(verifyCalSignature(body, signature, "secret"), true);
  assert.equal(verifyCalSignature(body + " ", signature, "secret"), false);
  assert.equal(verifyCalSignature(body, signature, "other-secret"), false);
  assert.equal(verifyCalSignature(body, null, "secret"), false);
  assert.equal(verifyCalSignature(body, "not-hex", "secret"), false);
});

test("a booking is read from Cal.com and shown in each person's own time zone", () => {
  const booking = parseCalBooking(calEvent);
  assert.ok(booking);
  assert.equal(booking.email, "sam@example.test");
  assert.equal(booking.meetingUrl, "https://meet.google.com/abc-defg-hij");
  const { notification, confirmation } = bookingVariables(booking);
  assert.match(notification.BOOKING_WHEN, /1 December 2026 at 14:30 \(London time\)$/);
  assert.match(confirmation.BOOKING_WHEN, /1 December 2026 at 09:30 \(New York time\)$/);
  assert.equal(notification.BOOKING_DURATION_HTML, "30 minutes");
  assert.equal(notification.BOOKING_MEETING_LABEL_HTML, "Google Meet");
  assert.equal(confirmation.BOOKING_ACTION_LABEL_HTML, "Join the call");
});

test("anything a customer typed is escaped before it reaches an email body", () => {
  const { notification, confirmation } = bookingVariables(parseCalBooking(calEvent)!);
  assert.equal(notification.BOOKING_NAME_HTML, "Sam &lt;b&gt;Lee&lt;/b&gt;");
  assert.equal(notification.BOOKING_NOTES_HTML, "Line one<br />Line &lt;two&gt;");
  assert.equal(confirmation.FIRST_NAME_HTML, "Sam");
});

test("pings, other triggers and bookings without an attendee email are ignored", () => {
  assert.equal(parseCalBooking({ triggerEvent: "PING", payload: {} }), null);
  assert.equal(parseCalBooking({ ...calEvent, triggerEvent: "BOOKING_CANCELLED" }), null);
  assert.equal(parseCalBooking({ ...calEvent, payload: { ...calEvent.payload, attendees: [] } }), null);
  assert.equal(parseCalBooking("nonsense"), null);
});

test("only paid discovery sprints from the pricing page become purchases", () => {
  const purchase = parseDiscoveryCheckout(paidSession, new Date("2026-11-19T10:00:00Z"));
  assert.ok(purchase);
  assert.equal(purchase.amount, "£650.00");
  assert.equal(purchase.packageName, "Growing company");
  assert.equal(purchase.paymentUrl, "https://dashboard.stripe.com/payments/pi_123");
  assert.equal(parseDiscoveryCheckout({ ...paidSession, payment_status: "unpaid" }, new Date()), null);
  assert.equal(parseDiscoveryCheckout({ ...paidSession, metadata: { source: "elsewhere" } }, new Date()), null);
  assert.equal(parseDiscoveryCheckout({ ...paidSession, metadata: { source: "pricing_page", package: "huge" } }, new Date()), null);
});

test("the team hears first, the customer gets their own copy, and replies go to the other side", async () => {
  const messages: Parameters<Sender>[0][] = [];
  const keys: string[] = [];
  const send: Sender = async (message, sendOptions) => {
    messages.push(message);
    keys.push(sendOptions.idempotencyKey);
    return { data: { id: `email-${messages.length}` }, error: null };
  };
  assert.deepEqual(await deliverBooking(parseCalBooking(calEvent)!, { ...options, send }), { confirmationSent: true });
  assert.equal(messages[0].to, options.notificationEmail);
  assert.equal(messages[0].replyTo, "sam@example.test");
  assert.equal(messages[0].template?.id, emailTemplates.bookingNotification);
  assert.equal(messages[1].to, "sam@example.test");
  assert.equal(messages[1].replyTo, options.notificationEmail);
  assert.equal(messages[1].template?.id, emailTemplates.bookingConfirmation);
  assert.deepEqual(keys, ["booking/v1/bk_123/notification", "booking/v1/bk_123/confirmation"]);
});

test("if the team's notification fails, the customer is not told it worked", async () => {
  let calls = 0;
  const send: Sender = async () => {
    calls++;
    return { data: null, error: { name: "validation_error", statusCode: 422 } };
  };
  await assert.rejects(deliverBooking(parseCalBooking(calEvent)!, { ...options, send }));
  assert.equal(calls, 1);
});
