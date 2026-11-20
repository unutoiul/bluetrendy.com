import assert from "node:assert/strict";
import test from "node:test";
import { parseLeadSubmission, type LeadDetails } from "@/lib/lead";
import { deliverLead, EmailDeliveryError } from "@/lib/leadDelivery";
import { checkLeadRateLimit } from "@/lib/leadRateLimit";
import { getBookingConfig } from "@/lib/booking";
import { forwardLead } from "@/lib/leadWebhook";

const lead: LeadDetails = {
  name: "Alex Example",
  email: "alex@example.test",
  company: "Example Studio",
  projectType: "AI automation",
  budget: "Not sure yet",
  timeline: "Flexible",
  message: "We would like to discuss a new project.\nPlease get in touch.",
  source: "",
};
type Sender = Parameters<typeof deliverLead>[1]["send"];
const deliveryOptions = {
  from: "BlueTrendy <contact@bluetrendy.com>",
  notificationEmail: "team@example.test",
};

test("a Resend error object fails the enquiry and prevents a misleading visitor receipt", async () => {
  let calls = 0;
  const send: Sender = async () => {
    calls++;
    return { data: null, error: { name: "validation_error", statusCode: 403 } };
  };
  await assert.rejects(deliverLead(lead, { ...deliveryOptions, send }), EmailDeliveryError);
  assert.equal(calls, 1);
});

test("team and visitor messages have separate recipients and correct Reply-To addresses", async () => {
  const messages: Parameters<Sender>[0][] = [];
  const send: Sender = async (message) => {
    messages.push(message);
    return { data: { id: `email-${messages.length}` }, error: null };
  };
  assert.deepEqual(await deliverLead(lead, { ...deliveryOptions, send }), { confirmationSent: true });
  assert.equal(messages.length, 2);
  assert.equal(messages[0].to, deliveryOptions.notificationEmail);
  assert.equal(messages[0].replyTo, lead.email);
  assert.equal(messages[1].to, lead.email);
  assert.equal(messages[1].replyTo, deliveryOptions.notificationEmail);
  assert.equal(messages[0].template?.id, "bluetrendy-contact-notification");
  assert.equal(messages[1].template?.id, "bluetrendy-contact-confirmation");
  assert.ok(messages.every((message) => message.template && !message.html && !message.text));
});

test("a failed visitor confirmation preserves a successfully received team enquiry", async (t) => {
  t.mock.method(console, "error", () => {});
  let calls = 0;
  const send: Sender = async () => {
    calls++;
    return calls === 1
      ? { data: { id: "notification" }, error: null }
      : { data: null, error: { name: "validation_error", statusCode: 422 } };
  };
  assert.deepEqual(await deliverLead(lead, { ...deliveryOptions, send }), { confirmationSent: false });
  assert.equal(calls, 2);
});

test("temporary failures retry using the same idempotency key", async () => {
  const keys: string[] = [];
  const send: Sender = async (_message, options) => {
    keys.push(options.idempotencyKey);
    return keys.length === 1
      ? { data: null, error: { name: "application_error", statusCode: 503 } }
      : { data: { id: "accepted" }, error: null };
  };
  await deliverLead(lead, { ...deliveryOptions, send });
  assert.equal(keys.length, 3);
  assert.equal(keys[0], keys[1]);
  assert.notEqual(keys[1], keys[2]);
});

test("repeated submissions keep deterministic keys and different briefs get new keys", async () => {
  const keys: string[] = [];
  const send: Sender = async (_message, options) => {
    keys.push(options.idempotencyKey);
    return { data: { id: "accepted" }, error: null };
  };
  await deliverLead(lead, { ...deliveryOptions, send });
  await deliverLead(lead, { ...deliveryOptions, send });
  await deliverLead({ ...lead, message: "A different project enquiry." }, { ...deliveryOptions, send });
  assert.equal(keys[0], keys[2]);
  assert.equal(keys[1], keys[3]);
  assert.notEqual(keys[0], keys[4]);
  assert.ok(!keys.join(" ").includes(lead.email));
});

test("network exceptions exhaust bounded retries without sending a visitor receipt", async () => {
  let calls = 0;
  const send: Sender = async () => {
    calls++;
    throw new Error("Network unavailable");
  };
  await assert.rejects(deliverLead(lead, { ...deliveryOptions, send }), { code: "network_error" });
  assert.equal(calls, 3);
});

test("validation rejects malformed addresses, header injection, non-string and oversized fields", () => {
  assert.equal(parseLeadSubmission({ ...lead, name: " Alex Example " }).lead?.name, "Alex Example");
  for (const email of ["alex@", "a@b", "a@b..com", "a@@b.com", "a,b@b.com", ".a@b.com", "a..b@b.com", "a@b.com\r\nBcc:other@b.com"]) {
    assert.ok(parseLeadSubmission({ ...lead, email }).error, email);
  }
  assert.ok(parseLeadSubmission({ ...lead, name: "Alex\nBcc: somebody" }).error);
  assert.ok(parseLeadSubmission({ ...lead, message: "x".repeat(4001) }).error);
  assert.ok(parseLeadSubmission({ ...lead, company: {} }).error);
  assert.ok(parseLeadSubmission(null).error);
  assert.ok(parseLeadSubmission([]).error);
});

test("hosted template variables escape user input and confirmation excludes the submitted message", async () => {
  const malicious = { ...lead, name: '<img src=x onerror="alert(1)">', message: '<script>alert("unsafe")</script>\nsecond line' };
  const messages: Parameters<Sender>[0][] = [];
  const send: Sender = async (message) => {
    messages.push(message);
    return { data: { id: "accepted" }, error: null };
  };
  await deliverLead(malicious, { ...deliveryOptions, send });
  const notification = messages[0].template?.variables;
  const confirmation = messages[1].template?.variables;
  assert.ok(String(notification?.CONTACT_MESSAGE_HTML).includes("&lt;script&gt;"));
  assert.ok(String(notification?.CONTACT_MESSAGE_HTML).includes("<br />second line"));
  assert.ok(!String(notification?.CONTACT_MESSAGE_HTML).includes("<script>"));
  assert.equal(notification?.CONTACT_MESSAGE, malicious.message);
  assert.ok(!String(confirmation?.CONTACT_NAME_HTML).includes('<img src=x'));
  assert.ok(!JSON.stringify(confirmation).includes("unsafe"));
  assert.ok(String(confirmation?.BOOKING_URL).endsWith("/book-a-call"));
  assert.deepEqual(Object.keys(confirmation ?? {}).sort(), ["BOOKING_URL", "CONTACT_NAME", "CONTACT_NAME_HTML"]);
  await deliverLead({ ...lead, email: "alex?subject=Injected@example.test" }, { ...deliveryOptions, send });
  assert.equal(messages[2].template?.variables?.CONTACT_EMAIL_URI, "alex%3Fsubject%3DInjected%40example.test");
});

test("the enquiry's source rides at the foot of the team's message and never reaches the visitor", async () => {
  const messages: Parameters<Sender>[0][] = [];
  const send: Sender = async (message) => {
    messages.push(message);
    return { data: { id: "accepted" }, error: null };
  };
  await deliverLead({ ...lead, source: "Form: Contact · First page: /ai-agents · Campaign: source <b>ads</b>" }, { ...deliveryOptions, send });
  const notification = messages[0].template?.variables;
  assert.ok(String(notification?.CONTACT_MESSAGE).endsWith("How they found us\nForm: Contact · First page: /ai-agents · Campaign: source <b>ads</b>"));
  assert.ok(String(notification?.CONTACT_MESSAGE_HTML).includes("First page: /ai-agents"));
  assert.ok(!String(notification?.CONTACT_MESSAGE_HTML).includes("<b>"));
  assert.ok(!JSON.stringify(messages[1].template?.variables).includes("ai-agents"));
  assert.equal(parseLeadSubmission({ ...lead, source: undefined }).lead?.source, "");
  assert.ok(parseLeadSubmission({ ...lead, source: "x".repeat(301) }).error);
  assert.ok(parseLeadSubmission({ ...lead, source: "Form: Contact\nBcc: somebody" }).error);
});

test("the CRM webhook is off by default, insists on https and never throws", async () => {
  const calls: { url: string; body: string }[] = [];
  const ok = (async (url: URL | RequestInfo, init?: RequestInit) => {
    calls.push({ url: String(url), body: String(init?.body) });
    return new Response(null, { status: 204 });
  }) as typeof fetch;
  assert.equal(await forwardLead(lead, undefined, ok), "off");
  assert.equal(await forwardLead(lead, "http://crm.example.test/hook", ok), "invalid");
  assert.equal(await forwardLead(lead, "not a url", ok), "invalid");
  assert.equal(calls.length, 0);
  assert.equal(await forwardLead(lead, "https://crm.example.test/hook", ok), "sent");
  assert.equal(calls[0].url, "https://crm.example.test/hook");
  assert.equal(JSON.parse(calls[0].body).email, lead.email);
  const down = (async () => { throw new Error("offline"); }) as typeof fetch;
  assert.equal(await forwardLead(lead, "https://crm.example.test/hook", down), "failed");
  const refused = (async () => new Response(null, { status: 500 })) as typeof fetch;
  assert.equal(await forwardLead(lead, "https://crm.example.test/hook", refused), "failed");
});

test("rate limits cover an address and shared IP and expire after ten minutes", () => {
  const now = Date.now();
  for (let i = 0; i < 5; i++) assert.equal(checkLeadRateLimit("limit@example.test", "192.0.2.1", now).allowed, true);
  assert.equal(checkLeadRateLimit("LIMIT@example.test", "192.0.2.2", now).allowed, false);
  assert.equal(checkLeadRateLimit("another@example.test", "192.0.2.1", now).allowed, false);
  assert.equal(checkLeadRateLimit("limit@example.test", "192.0.2.1", now + 600_001).allowed, true);
});

test("booking accepts a real Cal.com event, takes priority, and preserves Calendly compatibility", () => {
  assert.equal(getBookingConfig("https://cal.com/example-studio/discovery-call")?.provider, "cal");
  assert.equal(getBookingConfig("https://cal.com/bluetrendy/discovery-call")?.calLink, "bluetrendy/discovery-call");
  assert.equal(getBookingConfig("https://cal.com/bluetrendy/discovery-call", "https://calendly.com/studio/call")?.provider, "cal");
  assert.equal(getBookingConfig(undefined, "https://calendly.com/studio/call")?.provider, "calendly");
  for (const url of [undefined, "", "invalid", "http://cal.com/studio/call", "https://cal.com/your-handle/discovery-call", "https://cal.com/username", "https://cal.com.evil.test/studio/call", "https://user:pass@cal.com/studio/call"]) {
    assert.equal(getBookingConfig(url), null, url);
  }
});
