/*
 * Where an enquiry came from: the first page of the visit, the site that referred it and any
 * campaign tags on the address. It is held in memory for the visit only (no cookie and no
 * browser storage) and leaves the browser only if the visitor sends an enquiry.
 */

type Arrival = { landing: string; referrer: string; campaign: string };

const campaignTags = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
// Letters, digits and a little punctuation: enough for a campaign name, and nothing that could carry markup.
const tidy = (value: string) => value.replace(/[^\w .+\-/]/g, "").slice(0, 60);

let arrival: Arrival | null = null;

/** Notes how the visit began. Later calls keep the first answer, so navigating around the site doesn't overwrite it. */
export function rememberArrival() {
  if (arrival || typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const campaign = campaignTags.flatMap(tag => {
    const value = tidy(params.get(tag) ?? "");
    return value ? [`${tag.slice(4)} ${value}`] : [];
  }).join(", ");
  let referrer = "";
  try {
    const host = document.referrer ? new URL(document.referrer).host : "";
    if (host && host !== window.location.host) referrer = tidy(host);
  } catch {
    // An unreadable referrer is treated as none.
  }
  arrival = { landing: tidy(window.location.pathname), referrer, campaign };
}

/** One line for the team's notification: which form was used and how the visitor found the site. */
export function leadSource(form: string) {
  rememberArrival();
  return [
    `Form: ${form}`,
    arrival?.landing && `First page: ${arrival.landing}`,
    arrival?.referrer && `Came from: ${arrival.referrer}`,
    arrival?.campaign && `Campaign: ${arrival.campaign}`,
  ].filter(Boolean).join(" · ").slice(0, 300);
}
