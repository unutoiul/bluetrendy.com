/*
 * The business problems we solve most often, each with the system we would build and the
 * number we would track to show it paid off. The home page shows them as a ledger, and the
 * Opportunity Scanner turns a visitor's answers into one of them.
 *
 * Benefits are worded as likely, and measures are what we would track: nothing here is a
 * promised result.
 */

export type ChallengeId = "leads" | "emails" | "video" | "software" | "invoices" | "bookings" | "stock" | "proposals" | "churn";

export type Challenge = {
  id: ChallengeId;
  /** The problem as a ledger heading. */
  problem: string;
  /** The same problem in the visitor's words, for the scanner. */
  label: string;
  solution: string;
  /** Slug of the service that delivers it. */
  service: string;
  measure: string;
  steps: string[];
  benefits: string[];
  /** Where a first, small project should begin. */
  priority: string;
};

export const challenges: Challenge[] = [
  {
    id: "leads", problem: "Missed sales leads", label: "We miss or lose sales leads",
    solution: "Lead-qualification and follow-up agent", service: "ai-agents", measure: "Lead-to-meeting conversion",
    steps: [
      "Every enquiry gets a reply within minutes, day or night",
      "The agent asks your qualifying questions and scores the lead",
      "Your CRM is updated and a meeting is offered",
      "Your team gets a short summary before the call",
    ],
    benefits: ["Fewer enquiries go cold while they wait", "Sales time goes to the leads most likely to buy"],
    priority: "Start with one channel, such as your website form, and measure it for a month before adding others.",
  },
  {
    id: "emails", problem: "Repetitive customer emails", label: "The same customer emails, every day",
    solution: "Customer-service AI", service: "ai-agents", measure: "Hours saved and accurate resolution",
    steps: [
      "The agent reads each message and finds the order or account",
      "It answers routine questions from your policies and documents",
      "It makes approved changes, such as a new delivery day",
      "Refunds and anything unusual go to a person",
    ],
    benefits: ["Customers get answers faster", "Your team spends its time on the cases that need a person"],
    priority: "Start with the three questions you answer most often.",
  },
  {
    id: "video", problem: "Expensive video production", label: "Video and ads cost too much",
    solution: "AI Creative Studio", service: "ai-video-production", measure: "Cost per useful creative and qualified leads",
    steps: [
      "One brief becomes a storyboard you approve",
      "We produce the film with AI-assisted generation and editing",
      "You receive several variations, sized for each channel",
      "Results show which idea to make more of",
    ],
    benefits: ["More creative ideas tested for the same budget", "A shorter path from idea to finished asset"],
    priority: "Start with one product and three variations of a single idea.",
  },
  {
    id: "software", problem: "Slow software development", label: "Our software takes too long to ship",
    solution: "AI-assisted engineering", service: "ai-websites-apps", measure: "Time and cost to first release",
    steps: [
      "We scope a first release you can measure",
      "AI speeds up design, coding and testing",
      "A senior engineer reviews every change",
      "You try a working version each week",
    ],
    benefits: ["A first release in customers’ hands sooner", "Less budget spent on avoidable development work"],
    priority: "Start with the smallest release that proves the idea with real users.",
  },
  {
    id: "invoices", problem: "Manual invoices", label: "Invoices and paperwork done by hand",
    solution: "Document AI and approval workflow", service: "agentic-automation", measure: "Processing time and exception rate",
    steps: [
      "AI reads each invoice and extracts the fields",
      "It matches the purchase order",
      "Exceptions go to a person, with the evidence attached",
      "Approved invoices update your accounting system",
    ],
    benefits: ["Less time typing figures from one system into another", "Differences are caught before anything is paid"],
    priority: "Start with the supplier documents you receive in the highest volume.",
  },
  {
    id: "bookings", problem: "Lost direct hotel bookings", label: "We lose direct bookings",
    solution: "Booking and guest communication automation", service: "agentic-automation", measure: "Direct booking revenue",
    steps: [
      "Enquiries are answered at once, in the guest’s language",
      "The agent drafts confirmations and handles routine questions",
      "Special requests are passed to operations",
      "Past guests get a timely invitation to book direct",
    ],
    benefits: ["Fewer enquiries lost to slow replies", "More stays booked without a commission"],
    priority: "Start with enquiry replies and booking confirmations.",
  },
  {
    id: "stock", problem: "Inventory errors", label: "Stock and demand keep surprising us",
    solution: "Demand forecasting", service: "predictive-ai", measure: "Forecast error and stockouts",
    steps: [
      "We bring your sales history into one place",
      "A model forecasts demand for each product, as a range",
      "Likely stockouts and overstock are flagged early",
      "Your buyers approve the suggested orders",
    ],
    benefits: ["Fewer sales lost to empty shelves", "Less cash tied up in slow stock"],
    priority: "Start with your top twenty products, where a wrong guess costs most.",
  },
  {
    id: "proposals", problem: "Slow sales proposals", label: "Proposals and quotes take too long",
    solution: "Proposal preparation agent", service: "ai-agents", measure: "Turnaround and win rate",
    steps: [
      "The agent gathers the brief, your prices and past proposals",
      "It drafts the proposal in your format",
      "A person edits and approves it",
      "The CRM records what was sent and when",
    ],
    benefits: ["Proposals go out while the buyer is still interested", "Senior people spend less time on first drafts"],
    priority: "Start with your most common type of proposal.",
  },
  {
    id: "churn", problem: "Customer churn", label: "Customers don’t come back",
    solution: "Retention scoring and follow-up", service: "ai-marketing-automation", measure: "Repeat purchases",
    steps: [
      "We score which customers are likely to leave",
      "Each group gets a relevant message, where they have agreed to hear from you",
      "Offers and timing are tested against each other",
      "Results shape the next campaign",
    ],
    benefits: ["More repeat purchases from the customers you already have", "Earlier warning when an account is at risk"],
    priority: "Start with customers who have not bought for ninety days.",
  },
];

export type BusinessTypeId = "ecommerce" | "hotel" | "services" | "industry" | "software" | "other";

export type BusinessType = {
  id: BusinessTypeId;
  label: string;
  /** How the type reads in a sentence: "Common for online shops". */
  plural: string;
  /** The challenges this kind of business meets most, most common first. */
  common: ChallengeId[];
  /** A concrete example of a challenge in this kind of business. */
  examples: Partial<Record<ChallengeId, string>>;
};

export const businessTypes: BusinessType[] = [
  {
    id: "ecommerce", label: "Online shop", plural: "online shops", common: ["emails", "stock", "churn", "video"],
    examples: {
      emails: "“Where is my order?” answered from your shop system, with the delivery day changed on request.",
      stock: "A weekly demand forecast for each product, with reorder suggestions your buyer approves.",
      churn: "A win-back email for shoppers who have not ordered in ninety days.",
      video: "One product film cut into square, vertical and widescreen ads to test against each other.",
      leads: "Trade and wholesale enquiries answered at once and passed to the right account manager.",
    },
  },
  {
    id: "hotel", label: "Hotel or resort", plural: "hotels and resorts", common: ["bookings", "emails", "video", "churn"],
    examples: {
      bookings: "A late-night availability question answered at once, with a link to book direct.",
      emails: "Check-in times, parking and late arrivals answered from your own guest information.",
      video: "One seasonal film cut into short social ads for each room type.",
      churn: "Past guests invited back ahead of the same season next year.",
    },
  },
  {
    id: "services", label: "Professional services", plural: "professional services firms", common: ["proposals", "leads", "invoices", "emails"],
    examples: {
      proposals: "A first-draft proposal built from the discovery notes and your rate card.",
      leads: "Website enquiries qualified and booked into a partner’s calendar.",
      invoices: "Supplier invoices matched to engagements and routed to a partner for approval.",
      emails: "Routine client questions answered from your engagement documents, with the source shown.",
    },
  },
  { id: "industry", label: "Manufacturing & logistics", plural: "manufacturers and logistics firms", common: ["stock", "invoices", "software"], examples: {
      stock: "Demand and spare-part forecasts that give planners earlier warning of a shortage.",
    } },
  { id: "software", label: "Software & SaaS", plural: "software companies", common: ["software", "leads", "churn"], examples: {
      churn: "Accounts scored for churn risk each week, so customer success knows who to call first.",
    } },
  { id: "other", label: "Something else", plural: "businesses like yours", common: ["leads", "emails", "invoices"], examples: {} },
];

export const findChallenge = (id: unknown) => challenges.find(item => item.id === id);
export const findBusinessType = (id: unknown) => businessTypes.find(item => item.id === id);

/** The scanner's result as the opening lines of a project brief, for the contact form. */
export function planSummary(businessId: unknown, challengeId: unknown) {
  const business = findBusinessType(businessId);
  const challenge = findChallenge(challengeId);
  if (!business || !challenge) return "";
  return [
    `Business: ${business.label}`,
    `Biggest challenge: ${challenge.problem}`,
    `Suggested first step: ${challenge.solution}`,
    "",
    "",
  ].join("\n");
}
