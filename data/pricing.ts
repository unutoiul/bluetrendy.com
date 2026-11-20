export type DiscoveryPackageId = "small" | "growing" | "established";

export type DiscoveryPackage = {
  id: DiscoveryPackageId;
  name: string;
  /** Company size the package is priced for. */
  employees: string;
  /** The corner index on the card, like a playing card's rank. */
  rank: string;
  /** Fixed price in whole pounds; checkout charges exactly this. */
  price: number;
  duration: string;
  summary: string;
  includes: string[];
};

/**
 * The AI Implementation Blueprint (our paid discovery sprint), priced by company size. The
 * checkout route charges from this list, and the payment emails quote what each one includes.
 */
export const discoveryPackages: DiscoveryPackage[] = [
  {
    id: "small",
    name: "Small business",
    employees: "1–10 employees",
    rank: "S",
    price: 450,
    duration: "About 1 week",
    summary: "For founders and small teams planning one product or workflow.",
    includes: [
      "60-minute deep-dive with our senior team",
      "Written plan and technology recommendation",
      "Delivery roadmap for the first release",
      "Estimate and price for the first release",
    ],
  },
  {
    id: "growing",
    name: "Growing company",
    employees: "11–50 employees",
    rank: "M",
    price: 650,
    duration: "1–2 weeks",
    summary: "For teams replacing spreadsheets or connecting the tools they already use.",
    includes: [
      "90-minute deep-dive with our senior team",
      "Architecture plan and technology recommendation",
      "Delivery roadmap for the build",
      "Risk assessment and estimate for the full build",
      "Review of up to two systems you need to connect",
    ],
  },
  {
    id: "established",
    name: "Established business",
    employees: "51+ employees",
    rank: "L",
    price: 850,
    duration: "About 2 weeks",
    summary: "For organisations with several teams, systems and people to sign off.",
    includes: [
      "Two workshops with your team and stakeholders",
      "Architecture plan covering integrations and security",
      "Risk assessment, full-build estimate and phased delivery roadmap",
      "Review of the systems and data the project depends on",
    ],
  },
];

export const defaultDiscoveryPackage: DiscoveryPackageId = "growing";

export function findDiscoveryPackage(id: unknown) {
  return discoveryPackages.find(item => item.id === id);
}

export const formatPounds = (amount: number) => `£${amount.toLocaleString("en-GB")}`;

/** What every blueprint comes with, whatever the company size. */
export const discoveryEssentials = [
  "Led by our senior team from start to finish",
  "A written plan that is yours to keep, whether or not you build with us",
  "Fee credited toward your project if you continue within 60 days",
];

export const pricingFaqs = [
  {
    question: "Which package should I choose?",
    answer:
      "Pick the one that matches the number of people in your company. If you sit between two sizes, choose the closer one and say so in your brief; we confirm the fit on the kickoff call before any work starts.",
  },
  {
    question: "What is the AI Implementation Blueprint?",
    answer:
      "It is our paid discovery sprint: a short, fixed-price piece of work with our senior team that maps your process and systems, and ends with a written plan, an estimate and a fixed price for the build.",
  },
  {
    question: "What happens after the blueprint?",
    answer:
      "You get an architecture plan, a risk assessment, and a fixed delivery estimate for the full build. There's no obligation to continue with us — the deliverable is yours either way.",
  },
  {
    question: "Is the blueprint fee credited toward the full project?",
    answer:
      "Yes — if you move forward with a fixed-scope project or embedded engagement within 60 days, the blueprint fee is credited against it.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Card payment via Stripe for the blueprint. Fixed-scope projects, managed operations, retainers and embedded engagements are invoiced, typically on a milestone or monthly basis.",
  },
  {
    question: "How are the later steps priced?",
    answer:
      "A quick win is quoted as a fixed scope from your blueprint. Managed AI operations and the growth and creative retainer are monthly, sized to the systems and campaigns involved. We scope each one to your requirements rather than publish a single price.",
  },
  {
    question: "Do you require a minimum retainer for embedded engineering?",
    answer:
      "Embedded engagements are typically monthly, with scope and capacity agreed upfront after discovery — there's no fixed minimum term, but shorter engagements suit fixed-scope projects better.",
  },
];
