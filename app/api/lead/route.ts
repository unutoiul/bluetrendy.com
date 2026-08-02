import { NextRequest, NextResponse } from "next/server";
import { getMailTransport, isEmailConfigured } from "@/lib/email";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 200) : "";
  const email = typeof body?.email === "string" ? body.email.trim().slice(0, 200) : "";
  const company = typeof body?.company === "string" ? body.company.trim().slice(0, 200) : "";
  const projectType = typeof body?.projectType === "string" ? body.projectType.trim().slice(0, 100) : "";
  const budget = typeof body?.budget === "string" ? body.budget.trim().slice(0, 100) : "";
  const projectTimeline = typeof body?.timeline === "string" ? body.timeline.trim().slice(0, 100) : "";
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 4000) : "";

  if (!name || !email || !email.includes("@") || !message) {
    return NextResponse.json(
      { error: "Please fill in your name, email, and a short project summary." },
      { status: 400 },
    );
  }

  if (!isEmailConfigured()) {
    console.error("Lead received but email delivery is not configured:", {
      name,
      email,
      company,
      projectType,
      budget,
      timeline: projectTimeline,
      message,
    });
    return NextResponse.json(
      {
        error:
          "We couldn't submit this automatically — please email contact@bluetrendy.com directly or book a call instead.",
      },
      { status: 503 },
    );
  }

  try {
    const transport = getMailTransport();
    await transport.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.LEAD_NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `New project brief: ${name}${company ? ` (${company})` : ""}`,
      html: `
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Company:</b> ${escapeHtml(company) || "—"}</p>
        <p><b>Project type:</b> ${escapeHtml(projectType) || "—"}</p>
        <p><b>Budget:</b> ${escapeHtml(budget) || "—"}</p>
        <p><b>Timeline:</b> ${escapeHtml(projectTimeline) || "—"}</p>
        <p><b>Message:</b><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead email send failed:", error);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please email contact@bluetrendy.com directly." },
      { status: 500 },
    );
  }
}
