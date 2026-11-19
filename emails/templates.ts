/**
 * The six BlueTrendy emails, as hosted Resend templates. Values arrive as {{{VARIABLES}}}:
 * names ending in _HTML are escaped by the site before sending, so the markup can use them as is.
 * Preview, upload and test them with `npm run emails -- preview|upload|test`.
 */
import { emailTemplates, type EmailTemplateAlias } from "../lib/emailTemplates";
import { palette } from "@/theme/palette";

const site = "https://www.bluetrendy.com";
const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const color = {
  page: palette.grey[25],
  header: palette.navy[775],
  accent: palette.blue[350],
  ink: palette.navy[725],
  body: palette.slate[525],
  muted: palette.slate[375],
  line: palette.slate[100],
  panel: palette.grey[25],
  button: palette.blue[425],
  link: palette.blue[425],
};

// ------------------------------------------------------------ building blocks

const eyebrow = (label: string) =>
  `<p style="margin:0 0 10px;font-family:${font};font-size:12px;line-height:16px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${color.accent};">${label}</p>`;

const heading = (html: string) =>
  `<h1 class="title" style="margin:0 0 16px;font-family:${font};font-size:28px;line-height:34px;font-weight:700;letter-spacing:-0.4px;color:${color.ink};">${html}</h1>`;

const paragraph = (html: string, size = 16) =>
  `<p style="margin:0 0 16px;font-family:${font};font-size:${size}px;line-height:${Math.round(size * 1.6)}px;color:${color.body};">${html}</p>`;

const subheading = (label: string) =>
  `<p style="margin:28px 0 12px;font-family:${font};font-size:13px;line-height:18px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${color.ink};">${label}</p>`;

const link = (href: string, label: string) =>
  `<a href="${href}" style="color:${color.link};text-decoration:underline;">${label}</a>`;

/** A two-column table of facts; the last row has no rule under it. */
function details(rows: [label: string, valueHtml: string][]) {
  const cells = rows.map(([label, value], index) => {
    const rule = index < rows.length - 1 ? `border-bottom:1px solid ${color.line};` : "";
    return `<tr>
      <td class="label" width="34%" valign="top" style="padding:13px 16px;${rule}font-family:${font};font-size:13px;line-height:20px;color:${color.muted};">${label}</td>
      <td valign="top" style="padding:13px 16px;${rule}font-family:${font};font-size:15px;line-height:22px;font-weight:600;color:${color.ink};word-break:break-word;">${value}</td>
    </tr>`;
  }).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;border:1px solid ${color.line};border-radius:12px;border-collapse:separate;">${cells}</table>`;
}

/** A quoted block for what the customer wrote. */
const quote = (label: string, html: string) => `
  ${subheading(label)}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr><td style="padding:16px 18px;background:${color.panel};border-left:3px solid ${color.accent};border-radius:0 10px 10px 0;font-family:${font};font-size:15px;line-height:24px;color:${color.ink};">${html}</td></tr>
  </table>`;

/** A pill button that also renders in Outlook. */
const button = (href: string, label: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px;">
    <tr><td bgcolor="${color.button}" style="border-radius:999px;background:${color.button};">
      <a href="${href}" style="display:inline-block;padding:14px 28px;font-family:${font};font-size:15px;line-height:20px;font-weight:700;color:${palette.white};text-decoration:none;border-radius:999px;">${label}&nbsp;&rarr;</a>
    </td></tr>
  </table>`;

/** Numbered next steps. */
function steps(items: string[]) {
  const rows = items.map((html, index) => `<tr>
      <td width="40" valign="top" style="padding:0 0 14px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td width="26" height="26" align="center" bgcolor="${color.panel}" style="width:26px;height:26px;border-radius:13px;background:${color.panel};font-family:${font};font-size:13px;font-weight:700;color:${color.accent};">${index + 1}</td>
        </tr></table>
      </td>
      <td valign="top" style="padding:3px 0 14px;font-family:${font};font-size:15px;line-height:22px;color:${color.body};">${html}</td>
    </tr>`).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px;">${rows}</table>`;
}

const signoff = (html: string) =>
  `<p style="margin:28px 0 0;padding-top:24px;border-top:1px solid ${color.line};font-family:${font};font-size:15px;line-height:24px;color:${color.body};">${html}</p>`;

/** Every email: logo on navy, a white card, and a footer saying why it was sent. */
function layout({ title, preheader, body, footer }: { title: string; preheader: string; body: string; footer: string }) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${title}</title>
<style>
  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
  a { color: ${color.link}; }
  @media (max-width: 620px) {
    .container { width: 100% !important; }
    .px { padding-left: 24px !important; padding-right: 24px !important; }
    .title { font-size: 24px !important; line-height: 30px !important; }
    .label { width: 38% !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${color.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${preheader}&#8202;&zwnj;&#8202;&zwnj;&#8202;&zwnj;&#8202;&zwnj;&#8202;&zwnj;&#8202;&zwnj;&#8202;&zwnj;&#8202;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${color.page}" style="background:${color.page};">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
      <tr><td class="px" bgcolor="${color.header}" style="padding:28px 40px;background:${color.header};border-radius:16px 16px 0 0;">
        <a href="${site}" style="text-decoration:none;"><img src="${site}/brand/logo-inverse.png" width="184" height="45" alt="BlueTrendy Intelligence" style="display:block;width:184px;height:auto;border:0;outline:none;color:${palette.white};font-family:${font};font-size:20px;font-weight:700;" /></a>
      </td></tr>
      <tr><td height="4" bgcolor="${color.accent}" style="height:4px;background:${color.accent};font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td class="px" bgcolor="${palette.white}" style="padding:40px 40px 36px;background:${palette.white};">
        ${body}
      </td></tr>
      <tr><td class="px" bgcolor="${palette.white}" style="padding:22px 40px;background:${palette.white};border-top:1px solid ${color.line};border-radius:0 0 16px 16px;font-family:${font};font-size:12px;line-height:19px;color:${color.muted};">
        ${footer}
      </td></tr>
    </table>
    <p style="margin:18px 0 0;font-family:${font};font-size:12px;line-height:18px;color:${color.muted};">BlueTrendy Intelligence &middot; London, UK &middot; <a href="${site}" style="color:${color.muted};">bluetrendy.com</a></p>
  </td></tr>
</table>
</body>
</html>`;
}

const teamFooter = (source: string) => `Sent automatically by bluetrendy.com when ${source}. Reply to this email to answer the customer directly.`;
const customerFooter = (reason: string) =>
  `You're receiving this because you ${reason} on ${link(site, "bluetrendy.com")}. Questions? Reply to this email or write to ${link("mailto:contact@bluetrendy.com", "contact@bluetrendy.com")}.`;

// ------------------------------------------------------------ the templates

export type TemplateDefinition = { alias: EmailTemplateAlias; name: string; subject: string; html: string };

export const templates: TemplateDefinition[] = [
  {
    alias: emailTemplates.contactNotification,
    name: "BlueTrendy · Contact notification",
    subject: "New project enquiry: {{{CONTACT_NAME}}}",
    html: layout({
      title: "New project enquiry",
      preheader: "{{{CONTACT_NAME_HTML}}} sent a project enquiry from the website.",
      body: [
        eyebrow("New enquiry &middot; Contact form"),
        heading("{{{CONTACT_NAME_HTML}}} wants to talk about a project"),
        details([
          ["Name", "{{{CONTACT_NAME_HTML}}}"],
          ["Email", link("mailto:{{{CONTACT_EMAIL_URI}}}", "{{{CONTACT_EMAIL_HTML}}}")],
          ["Company", "{{{CONTACT_COMPANY_HTML}}}"],
          ["Project type", "{{{CONTACT_PROJECT_TYPE_HTML}}}"],
          ["Budget", "{{{CONTACT_BUDGET_HTML}}}"],
          ["Timeline", "{{{CONTACT_TIMELINE_HTML}}}"],
        ]),
        quote("Their message", "{{{CONTACT_MESSAGE_HTML}}}"),
        button("mailto:{{{CONTACT_EMAIL_URI}}}?subject=Re%3A%20your%20project%20enquiry", "Reply to {{{CONTACT_NAME_HTML}}}"),
        paragraph("They've been sent a confirmation saying we'll reply within one business day.", 14),
      ].join(""),
      footer: teamFooter("someone sends the contact form"),
    }),
  },
  {
    alias: emailTemplates.contactConfirmation,
    name: "BlueTrendy · Contact confirmation",
    subject: "We've received your enquiry | BlueTrendy",
    html: layout({
      title: "We've received your enquiry",
      preheader: "Your project enquiry is with our team. We'll reply within one business day.",
      body: [
        eyebrow("Enquiry received"),
        heading("Thanks, {{{CONTACT_NAME_HTML}}}. Your brief is with us."),
        paragraph("A senior engineer will read your project brief and reply within one business day, usually sooner."),
        subheading("What happens next"),
        steps([
          "We read your brief and look at what you're trying to achieve.",
          "We reply with questions, ideas, or a suggested next step.",
          "If it's a good fit, we set up a short call to plan the work.",
        ]),
        paragraph("Prefer to talk it through now? Pick a time for a free call."),
        button("{{{BOOKING_URL}}}", "Book a free call"),
        paragraph("30 minutes &middot; Free &middot; With a senior engineer", 13),
        signoff(`Something to add? Just reply to this email.<br /><strong style=\"color:${palette.navy[725]};\">The BlueTrendy team</strong>`),
      ].join(""),
      footer: customerFooter("sent us a project enquiry"),
    }),
  },
  {
    alias: emailTemplates.bookingNotification,
    name: "BlueTrendy · Booking notification",
    subject: "New call booked: {{{BOOKING_NAME}}}, {{{BOOKING_WHEN}}}",
    html: layout({
      title: "New call booked",
      preheader: "{{{BOOKING_NAME_HTML}}} booked a call for {{{BOOKING_WHEN_HTML}}}.",
      body: [
        eyebrow("New booking &middot; Cal.com"),
        heading("{{{BOOKING_NAME_HTML}}} booked a call"),
        details([
          ["When", "{{{BOOKING_WHEN_HTML}}}"],
          ["Length", "{{{BOOKING_DURATION_HTML}}}"],
          ["Where", link("{{{BOOKING_MEETING_URL_HTML}}}", "{{{BOOKING_MEETING_LABEL_HTML}}}")],
          ["Email", link("mailto:{{{BOOKING_EMAIL_URI}}}", "{{{BOOKING_EMAIL_HTML}}}")],
          ["Their time zone", "{{{BOOKING_TIMEZONE_HTML}}}"],
        ]),
        quote("Their notes", "{{{BOOKING_NOTES_HTML}}}"),
        button("{{{BOOKING_MEETING_URL_HTML}}}", "Join the call"),
        paragraph(`${link("{{{BOOKING_MANAGE_URL_HTML}}}", "View the booking in Cal.com")} to reschedule or cancel.`, 14),
      ].join(""),
      footer: teamFooter("someone books a call"),
    }),
  },
  {
    alias: emailTemplates.bookingConfirmation,
    name: "BlueTrendy · Booking confirmation",
    subject: "Your call with BlueTrendy is booked: {{{BOOKING_WHEN}}}",
    html: layout({
      title: "Your call is booked",
      preheader: "See you on {{{BOOKING_WHEN_HTML}}}. Your meeting link is inside.",
      body: [
        eyebrow("Call confirmed"),
        heading("You're booked in, {{{FIRST_NAME_HTML}}}."),
        paragraph("Thanks for booking a call. You'll speak with a senior engineer who'll help you work out the best next step for your project."),
        details([
          ["When", "{{{BOOKING_WHEN_HTML}}}"],
          ["Length", "{{{BOOKING_DURATION_HTML}}}"],
          ["Where", link("{{{BOOKING_MEETING_URL_HTML}}}", "{{{BOOKING_MEETING_LABEL_HTML}}}")],
        ]),
        button("{{{BOOKING_MEETING_URL_HTML}}}", "{{{BOOKING_ACTION_LABEL_HTML}}}"),
        subheading("To get the most from the call"),
        steps([
          "Think about what you'd like the project to change for your business.",
          "Have links or screenshots of any systems you use today ready to share.",
          "Invite anyone else who should be part of the decision.",
        ]),
        paragraph(`Need a different time? ${link("{{{BOOKING_MANAGE_URL_HTML}}}", "Reschedule or cancel")} whenever you need to. Your calendar invite comes separately from Cal.com.`, 14),
        signoff(`Talk soon,<br /><strong style=\"color:${palette.navy[725]};\">The BlueTrendy team</strong>`),
      ].join(""),
      footer: customerFooter("booked a call with us"),
    }),
  },
  {
    alias: emailTemplates.discoveryNotification,
    name: "BlueTrendy · Discovery sprint payment notification",
    subject: "Payment received: {{{PACKAGE_NAME}}} discovery sprint ({{{AMOUNT}}})",
    html: layout({
      title: "Discovery sprint payment received",
      preheader: "{{{CUSTOMER_NAME_HTML}}} paid {{{AMOUNT_HTML}}} for a {{{PACKAGE_NAME_HTML}}} discovery sprint.",
      body: [
        eyebrow("New payment &middot; Stripe"),
        heading("{{{CUSTOMER_NAME_HTML}}} paid for a discovery sprint"),
        `<p style="margin:0 0 20px;font-family:${font};font-size:36px;line-height:42px;font-weight:700;letter-spacing:-0.6px;color:${color.ink};">{{{AMOUNT_HTML}}}</p>`,
        details([
          ["Package", "{{{PACKAGE_NAME_HTML}}}"],
          ["Company size", "{{{PACKAGE_SIZE_HTML}}}"],
          ["Paid", "{{{PAID_AT_HTML}}}"],
          ["Email", link("mailto:{{{CUSTOMER_EMAIL_URI}}}", "{{{CUSTOMER_EMAIL_HTML}}}")],
        ]),
        quote("Their brief", "{{{BRIEF_HTML}}}"),
        button("mailto:{{{CUSTOMER_EMAIL_URI}}}?subject=Your%20BlueTrendy%20discovery%20sprint", "Email {{{CUSTOMER_NAME_HTML}}}"),
        paragraph(`${link("{{{PAYMENT_URL_HTML}}}", "View the payment in Stripe")}. They've been asked to book their kickoff call.`, 14),
      ].join(""),
      footer: teamFooter("a discovery sprint is paid for"),
    }),
  },
  {
    alias: emailTemplates.discoveryConfirmation,
    name: "BlueTrendy · Discovery sprint confirmation",
    subject: "You're booked in: {{{PACKAGE_NAME}}} discovery sprint",
    html: layout({
      title: "Your discovery sprint is booked",
      preheader: "Payment received. Next, pick a time for your kickoff call.",
      body: [
        eyebrow("Payment confirmed"),
        heading("Thank you, {{{FIRST_NAME_HTML}}}. Your discovery sprint is booked."),
        paragraph("We've received your payment. Over {{{DURATION_HTML}}} we'll turn your idea into a clear plan, with an estimate and price for the first release."),
        details([
          ["Package", "{{{PACKAGE_NAME_HTML}}} discovery sprint"],
          ["Amount paid", "{{{AMOUNT_HTML}}}"],
          ["Date", "{{{PAID_AT_HTML}}}"],
          ["Reference", "{{{REFERENCE_HTML}}}"],
        ]),
        subheading("What's included"),
        `<ul style="margin:0 0 8px;padding:0 0 0 20px;font-family:${font};font-size:15px;line-height:22px;color:${color.body};">{{{INCLUDES_HTML}}}</ul>`,
        subheading("What happens next"),
        steps([
          "Pick a time for your kickoff call.",
          "We read your brief and prepare questions before we meet.",
          "We run the sprint and send your written plan and estimate.",
        ]),
        button("{{{KICKOFF_URL_HTML}}}", "Book your kickoff call"),
        paragraph("If you go ahead with the full project within 60 days, the sprint fee is credited against it.", 14),
        signoff(`We're looking forward to it.<br /><strong style=\"color:${palette.navy[725]};\">The BlueTrendy team</strong>`),
      ].join(""),
      footer: customerFooter("paid for a discovery sprint"),
    }),
  },
];

/** Every {{{VARIABLE}}} a template uses, in its subject or its body. */
export const templateVariables = (template: TemplateDefinition) =>
  [...new Set([...`${template.subject}\n${template.html}`.matchAll(/\{\{\{\s*([A-Z0-9_]+)\s*\}\}\}/g)].map(match => match[1]))].sort();
