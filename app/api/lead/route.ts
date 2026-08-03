import { NextRequest, NextResponse } from "next/server";
import { getResendClient, isEmailConfigured } from "@/lib/email";
import { leadConfirmationEmail, leadNotificationEmail } from "@/lib/emailTemplates";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 200) : "";
  const email = typeof body?.email === "string" ? body.email.trim().slice(0, 200) : "";
  const company = typeof body?.company === "string" ? body.company.trim().slice(0, 200) : "";
  const projectType = typeof body?.projectType === "string" ? body.projectType.trim().slice(0, 100) : "";
  const budget = typeof body?.budget === "string" ? body.budget.trim().slice(0, 100) : "";
  const timeline = typeof body?.timeline === "string" ? body.timeline.trim().slice(0, 100) : "";
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 4000) : "";

  if (!name || !email || !email.includes("@") || !message) {
    return NextResponse.json(
      { error: "Please fill in your name, email, and a short project summary." },
      { status: 400 },
    );
  }

  const lead = { name, email, company, projectType, budget, timeline, message };

  if (!isEmailConfigured()) {
    console.error("Lead received but email delivery is not configured:", lead);
    return NextResponse.json(
      {
        error:
          "We couldn't submit this automatically — please email contact@bluetrendy.com directly or book a call instead.",
      },
      { status: 503 },
    );
  }

  try {
    const resend = getResendClient();
    const from = process.env.EMAIL_FROM as string;

    const notification = leadNotificationEmail(lead);
    const confirmation = leadConfirmationEmail(lead);

    // Fire both sends together — a confirmation email failing shouldn't block
    // the internal notification (or vice versa) from going out.
    const results = await Promise.allSettled([
      resend.emails.send({
        from,
        to: process.env.LEAD_NOTIFICATION_EMAIL as string,
        replyTo: email,
        subject: notification.subject,
        html: notification.html,
        text: notification.text,
      }),
      resend.emails.send({
        from,
        to: email,
        replyTo: "contact@bluetrendy.com",
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
      }),
    ]);

    const [notificationResult] = results;
    if (notificationResult.status === "rejected") {
      throw notificationResult.reason;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead email send failed:", error);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please email contact@bluetrendy.com directly." },
      { status: 500 },
    );
  }
}
