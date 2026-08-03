import { brand } from "@/theme/theme";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shell(bodyHtml: string) {
  return `<!doctype html>
<html>
  <body style="margin:0; padding:0; background-color:${brand.mist}; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${brand.mist}; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid ${brand.border};">
            <tr>
              <td style="background:linear-gradient(135deg, ${brand.navyDark}, ${brand.navy}); padding:24px 32px;">
                <span style="color:#ffffff; font-size:18px; font-weight:700; letter-spacing:-0.01em;">bluetrendy</span>
                <span style="color:${brand.blueLight}; font-size:11px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; margin-left:8px; vertical-align:middle;">Intelligence</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px; background-color:${brand.mist}; border-top:1px solid ${brand.border};">
                <p style="margin:0; font-size:12px; color:${brand.slate};">
                  BlueTrendy Intelligence — London, UK<br/>
                  <a href="mailto:contact@bluetrendy.com" style="color:${brand.slate};">contact@bluetrendy.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 0; font-size:13px; color:${brand.slate}; vertical-align:top; white-space:nowrap; padding-right:16px;">${label}</td>
    <td style="padding:6px 0; font-size:14px; color:${brand.ink}; font-weight:600;">${value}</td>
  </tr>`;
}

export type LeadDetails = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
};

/** Sent to the team's inbox the moment a lead comes in through /contact. */
export function leadNotificationEmail(lead: LeadDetails) {
  const safe = {
    name: escapeHtml(lead.name),
    email: escapeHtml(lead.email),
    company: escapeHtml(lead.company) || "—",
    projectType: escapeHtml(lead.projectType) || "—",
    budget: escapeHtml(lead.budget) || "—",
    timeline: escapeHtml(lead.timeline) || "—",
    message: escapeHtml(lead.message).replace(/\n/g, "<br/>"),
  };

  const subject = `New project brief: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`;

  const html = shell(`
    <p style="margin:0 0 20px; font-size:12px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:${brand.blue};">New lead</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${row("Name", safe.name)}
      ${row("Email", `<a href="mailto:${safe.email}" style="color:${brand.blue}; text-decoration:none;">${safe.email}</a>`)}
      ${row("Company", safe.company)}
      ${row("Project type", safe.projectType)}
      ${row("Budget", safe.budget)}
      ${row("Timeline", safe.timeline)}
    </table>
    <p style="margin:0 0 8px; font-size:13px; color:${brand.slate};">Message</p>
    <div style="padding:16px; background-color:${brand.mist}; border-radius:8px; font-size:14px; line-height:1.6; color:${brand.ink};">
      ${safe.message}
    </div>
  `);

  const text = `New project brief: ${lead.name}${lead.company ? ` (${lead.company})` : ""}

Name: ${lead.name}
Email: ${lead.email}
Company: ${lead.company || "—"}
Project type: ${lead.projectType || "—"}
Budget: ${lead.budget || "—"}
Timeline: ${lead.timeline || "—"}

Message:
${lead.message}`;

  return { subject, html, text };
}

/** Sent to the person who submitted the form, confirming receipt. */
export function leadConfirmationEmail(lead: Pick<LeadDetails, "name">) {
  const safeName = escapeHtml(lead.name);
  const subject = "We've got your brief — bluetrendy";

  const html = shell(`
    <p style="margin:0 0 16px; font-size:18px; font-weight:700; color:${brand.ink};">Thanks, ${safeName}.</p>
    <p style="margin:0 0 16px; font-size:14px; line-height:1.7; color:${brand.slate};">
      We've received your project brief and a member of our team will reply within one business day.
    </p>
    <p style="margin:0 0 24px; font-size:14px; line-height:1.7; color:${brand.slate};">
      If it's more convenient, you can also grab a slot directly on our calendar and skip the wait.
    </p>
    <a href="https://www.bluetrendy.com/book-a-call" style="display:inline-block; padding:12px 24px; background-color:${brand.navy}; color:#ffffff; font-size:14px; font-weight:600; text-decoration:none; border-radius:999px;">
      Book a call
    </a>
  `);

  const text = `Thanks, ${lead.name}.

We've received your project brief and a member of our team will reply within one business day.

If it's more convenient, you can also grab a slot directly on our calendar: https://www.bluetrendy.com/book-a-call`;

  return { subject, html, text };
}
