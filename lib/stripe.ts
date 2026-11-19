import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

// Discovery sprint prices live in data/pricing.ts and are sent with each checkout, so only the key is needed.
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}
