/**
 * Aliases of the hosted Resend templates the site sends. Their designs live in
 * emails/templates.ts; `npm run emails -- upload` publishes them to Resend.
 */
export const emailTemplates = {
  contactNotification: "bluetrendy-contact-notification",
  contactConfirmation: "bluetrendy-contact-confirmation",
  bookingNotification: "bluetrendy-booking-notification",
  bookingConfirmation: "bluetrendy-booking-confirmation",
  discoveryNotification: "bluetrendy-discovery-notification",
  discoveryConfirmation: "bluetrendy-discovery-confirmation",
} as const;

export type EmailTemplateAlias = (typeof emailTemplates)[keyof typeof emailTemplates];
