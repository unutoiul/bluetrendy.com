This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Contact email

Copy `.env.example` to `.env.local` and configure these server-only values:

- `RESEND_API_KEY`: a Resend key allowed to send from your verified domain.
- `EMAIL_FROM`: `BlueTrendy Intelligence <contact@bluetrendy.com>`.
- `LEAD_NOTIFICATION_EMAIL`: the inbox that should receive project enquiries.

Submitting `/contact` sends a branded project brief to the team and then a branded
confirmation to the visitor. The team can reply directly to the visitor; visitors
can reply to the team or book a free discovery call from their confirmation.
The HTML and plain-text designs are hosted and published in Resend:

- [Team notification](https://resend.com/templates/0d88b826-a174-4217-a25d-e4faa83bdf81)
  uses the alias `bluetrendy-contact-notification`.
- [Visitor confirmation](https://resend.com/templates/61efaa0b-7656-4702-a146-16c13b91b5cf)
  uses the alias `bluetrendy-contact-confirmation`.

Edit the templates in Resend and publish changes there. The website sends the
template alias and enquiry variables; there is no local email template file to
keep in sync. `lib/leadDelivery.ts` handles delivery and safely prepares the values
for HTML, plain text, and reply links. The visitor receipt receives only the name
and booking link, keeping the submitted project message in the team's notification.

Resend API errors are checked explicitly. Temporary failures are retried twice;
matching submissions use the same Resend idempotency keys for 24 hours. A failed
team notification shows an error instead of claiming receipt. If only the visitor
confirmation fails, the form still acknowledges that the team received the brief.
Honeypot filtering, field/body limits, origin checks, and a bounded per-instance
rate limit protect the endpoint. The rate limit is best effort across serverless
instances; deployment-level rate limiting can provide a shared limit.

Keep the key in ignored `.env.local` during development and in your hosting
provider's secret environment settings in production. Never prefix it with
`NEXT_PUBLIC_`. Restart the local server after changing environment values.

## Services, demonstrations and where enquiries come from

The seven services live in `data/services.ts`. Each one gets its own page at the site
root (`/ai-agents`, `/predictive-ai` and so on) from `app/[service]/page.tsx`, a card on
the home page, a chapter on `/services` and an entry in the header menu, the footer and
the sitemap. Add or reword a service there and every one of those follows.

The interactive demonstrations are in `components/lab/` (the Opportunity Scanner, the
savings calculator, the forecast and the creative showcase) and
`components/experience/AgentDemo.tsx`. Everything they show is sample data, and each one
carries a `SampleBadge` saying so. The scanner and the home page ledger share
`data/opportunities.ts`.

Every enquiry tells the team how the visitor found the site: the form used, the first
page of the visit, the referring website and any `utm_` campaign tags
(`lib/attribution.ts`). It is kept in memory for the visit only, with no cookie, and is
added to the foot of the message in the team's notification email.

To route enquiries into a CRM, set `LEAD_WEBHOOK_URL` to an `https` webhook (HubSpot,
Pipedrive, Zapier, Make and similar). Each enquiry is then also sent there as JSON
(`lib/leadWebhook.ts`). It is off when the variable is empty, and a failing webhook never
blocks the email or the visitor. Name the CRM in the privacy policy before switching it on.

## Free meeting booking

The free 30-minute [BlueTrendy discovery call](https://cal.com/bluetrendy/discovery-call)
is configured in the `bluetrendy` Cal.com account. It uses the account's working
hours and connected calendars, with Google Meet as the meeting location.

Set `NEXT_PUBLIC_CAL_COM_URL=https://cal.com/bluetrendy/discovery-call` in local and
hosting environments. Manage working hours, calendar connections, questions, and
cancellation settings in Cal.com. Slots are shown in the visitor's timezone.
Rebuild the site after changing the public event URL.

The official Cal.com React embed handles scheduling. Cal.com manages calendar
invitations, confirmation messages, cancellations, and rescheduling. Contact-form
email is sent separately through Resend. No Cal.com API key is required for the embed.
An optional `NEXT_PUBLIC_CALENDLY_URL` supports an existing Calendly event instead;
Cal.com takes priority. Missing, invalid, and example URLs show a useful contact
fallback. The Cal.com API key is used for account setup only and is not required
by the website.

Run `npm test` for contact delivery, validation, and booking configuration checks,
and `npm run build` to validate the production app. Tests use mocked delivery and
do not email real recipients.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
