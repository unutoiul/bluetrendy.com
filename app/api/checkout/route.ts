import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe";
import { findDiscoveryPackage } from "@/data/pricing";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Online checkout isn't configured yet — please book a call instead." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const brief = typeof body?.brief === "string" ? body.brief.trim().slice(0, 2000) : "";
  // The price always comes from our own package list, never from the browser.
  const sprint = findDiscoveryPackage(body?.package);

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }
  if (!sprint) {
    return NextResponse.json({ error: "Choose a discovery sprint package first." }, { status: 400 });
  }

  const stripe = getStripeClient();
  const origin = new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: sprint.price * 100,
          product_data: {
            name: `Discovery sprint — ${sprint.name}`,
            description: `${sprint.employees}. ${sprint.duration}, led by our senior team.`,
          },
        },
      }],
      customer_email: email,
      metadata: { brief, package: sprint.id, source: "pricing_page" },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);
    return NextResponse.json(
      { error: "Something went wrong starting checkout. Please try again or book a call instead." },
      { status: 500 },
    );
  }
}
