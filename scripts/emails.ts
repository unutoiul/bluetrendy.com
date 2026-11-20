/**
 * The site's Resend templates, from emails/templates.ts.
 *
 *   npm run emails -- preview   writes output/email-previews/*.html filled with sample data
 *   npm run emails -- upload    creates or updates each template in Resend and publishes it
 *   npm run emails -- test      sends all six emails, through the site's own delivery code,
 *                               to LEAD_NOTIFICATION_EMAIL, then reports Resend's delivery status
 *
 * upload and test read RESEND_API_KEY, EMAIL_FROM and LEAD_NOTIFICATION_EMAIL from .env.local.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Resend } from "resend";
import { templates, templateVariables } from "../emails/templates";
import { emailTemplates, type EmailTemplateAlias } from "../lib/emailTemplates";
import { contactVariables, deliverLead } from "../lib/leadDelivery";
import { bookingVariables, deliverBooking, deliverDiscovery, discoveryVariables, type Booking, type DiscoveryPurchase } from "../lib/notifications";
import { findDiscoveryPackage } from "../data/pricing";
import type { LeadDetails } from "../lib/lead";

const run = Date.now().toString(36);

function samples(customerEmail: string) {
  const lead: LeadDetails = {
    name: "Alex Morgan",
    email: customerEmail,
    company: "Northwind Clinics",
    projectType: "AI-powered websites & apps",
    budget: "£25k–£50k",
    timeline: "Next 3 months",
    message: `We run four clinics and book patients across two systems.\nWe'd like one booking portal that syncs with our calendar. (test ${run})`,
    source: "Form: Contact · First page: /ai-websites-apps · Came from: google.com",
  };
  const start = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  start.setUTCHours(14, 30, 0, 0);
  const booking: Booking = {
    uid: `test-${run}`,
    name: "Alex Morgan",
    email: customerEmail,
    start,
    end: new Date(start.getTime() + 30 * 60 * 1000),
    attendeeTimeZone: "Europe/London",
    organizerTimeZone: "Europe/London",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    notes: "We'd like to talk about replacing our booking spreadsheet.",
  };
  const sprint = findDiscoveryPackage("growing")!;
  const purchase: DiscoveryPurchase = {
    sessionId: `cs_test_${run}`,
    reference: `TEST${run}`.slice(-10).toUpperCase(),
    name: "Alex Morgan",
    email: customerEmail,
    packageName: sprint.name,
    employees: sprint.employees,
    duration: sprint.duration,
    includes: sprint.includes,
    amount: `£${sprint.price.toFixed(2)}`,
    paidAt: new Date(),
    brief: "A patient booking portal for four clinics, connected to Google Calendar.",
    paymentUrl: "https://dashboard.stripe.com/payments",
  };
  const contact = contactVariables(lead);
  const bookingVars = bookingVariables(booking);
  const discovery = discoveryVariables(purchase);
  const variables: Record<EmailTemplateAlias, Record<string, string>> = {
    [emailTemplates.contactNotification]: contact.notification,
    [emailTemplates.contactConfirmation]: contact.confirmation,
    [emailTemplates.bookingNotification]: bookingVars.notification,
    [emailTemplates.bookingConfirmation]: bookingVars.confirmation,
    [emailTemplates.discoveryNotification]: discovery.notification,
    [emailTemplates.discoveryConfirmation]: discovery.confirmation,
  };
  return { lead, booking, purchase, variables };
}

const fill = (source: string, variables: Record<string, string>) =>
  source.replace(/\{\{\{\s*([A-Z0-9_]+)\s*\}\}\}/g, (_, key: string) => variables[key] ?? `[missing ${key}]`);

function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is missing from .env.local`);
  return value;
}

function preview() {
  const { variables } = samples("alex@example.com");
  const dir = path.join("output", "email-previews");
  mkdirSync(dir, { recursive: true });
  const links = templates.map(template => {
    writeFileSync(path.join(dir, `${template.alias}.html`), fill(template.html, variables[template.alias]));
    return `<li><a href="${template.alias}.html">${template.name}</a><br><small>${fill(template.subject, variables[template.alias])}</small></li>`;
  });
  writeFileSync(path.join(dir, "index.html"), `<!doctype html><meta charset="utf-8"><title>Email previews</title><body style="font-family:system-ui;padding:24px"><h1>Email previews</h1><ul>${links.join("")}</ul>`);
  console.log(`Wrote ${templates.length} previews to ${dir}`);
}

async function upload(resend: Resend) {
  const { variables } = samples("alex@example.com");
  for (const template of templates) {
    const sent = Object.keys(variables[template.alias]).sort();
    const missing = templateVariables(template).filter(key => !sent.includes(key));
    if (missing.length) throw new Error(`${template.alias} uses variables the site never sends: ${missing.join(", ")}`);
    const fields = {
      name: template.name,
      subject: template.subject,
      from: env("EMAIL_FROM"),
      html: template.html,
      variables: sent.map(key => ({ key, type: "string" as const })),
    };
    // An alias that already exists is updated in place, so the live site never points at a missing template.
    const existing = await resend.templates.get(template.alias);
    let id = existing.data?.id;
    if (id) {
      const { error } = await resend.templates.update(id, fields);
      if (error) throw new Error(`Updating ${template.alias} failed: ${error.message}`);
    } else {
      const { data, error } = await resend.templates.create({ ...fields, alias: template.alias });
      if (error || !data) throw new Error(`Creating ${template.alias} failed: ${error?.message}`);
      id = data.id;
    }
    const { error } = await resend.templates.publish(id);
    if (error) throw new Error(`Publishing ${template.alias} failed: ${error.message}`);
    console.log(`${existing.data ? "updated" : "created"} and published  ${template.alias}  (${id})`);
  }
}

async function test(resend: Resend) {
  const inbox = env("LEAD_NOTIFICATION_EMAIL");
  const { lead, booking, purchase } = samples(inbox);
  const ids: string[] = [];
  const send: Parameters<typeof deliverLead>[1]["send"] = async (payload, options) => {
    const result = await resend.emails.send(payload, options);
    if (result.data?.id) ids.push(result.data.id);
    return result;
  };
  const options = { send, from: env("EMAIL_FROM"), notificationEmail: inbox };
  console.log("contact   ", await deliverLead(lead, options));
  console.log("booking   ", await deliverBooking(booking, options));
  console.log("discovery ", await deliverDiscovery(purchase, options));

  // Give Resend a moment to hand the messages over, then report what happened to each.
  for (let attempt = 0; attempt < 6; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const statuses = await Promise.all(ids.map(async id => {
      const { data } = await resend.emails.get(id);
      return { id, subject: data?.subject, status: data?.last_event };
    }));
    if (attempt === 5 || statuses.every(email => email.status !== "queued" && email.status !== "sent")) {
      for (const email of statuses) console.log(`${String(email.status).padEnd(10)} ${email.subject}`);
      return;
    }
  }
}

async function main() {
  const command = process.argv[2];
  if (command === "preview") return preview();
  if (existsSync(".env.local")) process.loadEnvFile(".env.local");
  const resend = new Resend(env("RESEND_API_KEY"));
  if (command === "upload") return upload(resend);
  if (command === "test") return test(resend);
  console.log("Usage: npm run emails -- preview | upload | test");
  process.exitCode = 1;
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
