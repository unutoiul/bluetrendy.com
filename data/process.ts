import { discoveryPackages, formatPounds } from "./pricing";

export const processSteps = [
  {
    step: "01",
    title: "Discover",
    duration: "Free AI Opportunity Call, 30 minutes",
    description:
      "Tell us where the business feels slow or costly. We look at your systems together, find the AI opportunities worth pursuing and agree a sensible place to start.",
  },
  {
    step: "02",
    title: "Design",
    duration: "AI Implementation Blueprint, 1–2 weeks",
    description:
      "For a fixed price, we map the process and the systems to connect, then set out a delivery roadmap and a fixed-scope proposal. The written plan is yours to keep.",
  },
  {
    step: "03",
    title: "Build",
    duration: "Weekly cadence",
    description:
      "We implement and test a first release with clear acceptance criteria. You try a working version each week and speak directly with the people building it.",
  },
  {
    step: "04",
    title: "Launch & improve",
    duration: "At each milestone, then ongoing",
    description:
      "We deploy, set up monitoring and train the people who run it. Then we keep improving the system against the number we agreed to measure.",
  },
];

export type EngagementModel = {
  id: "call" | "blueprint" | "quickwin" | "managed" | "growth" | "embedded";
  name: string;
  /** Where the model sits in the journey, shown as a tag on its card. */
  tag: string;
  description: string;
  facts: { term: string; value: string }[];
  bestFor: string;
  action: { label: string; href: string };
};

// The journey a client takes, one step at a time. No step commits you to the next, and
// prices beyond the blueprint are scoped to the work, so none are quoted here.
export const engagementModels: EngagementModel[] = [
  {
    id: "call",
    name: "Free AI Opportunity Call",
    tag: "Step 1 · Start here",
    description:
      "We talk through your operating challenges, pick out the opportunities with real commercial value and agree a sensible starting point.",
    facts: [
      { term: "How you pay", value: "Free" },
      { term: "How long", value: "30 minutes" },
    ],
    bestFor: "Anyone weighing up where AI could help, before spending anything.",
    action: { label: "Book a call", href: "/book-a-call" },
  },
  {
    id: "blueprint",
    name: "AI Implementation Blueprint",
    tag: "Step 2 · A plan",
    description:
      "A bounded discovery and architecture sprint: your processes, the systems to integrate, a delivery roadmap and a fixed-scope proposal.",
    facts: [
      { term: "How you pay", value: `Fixed price, from ${formatPounds(Math.min(...discoveryPackages.map(item => item.price)))}` },
      { term: "How long", value: "1–2 weeks" },
    ],
    bestFor: "New projects, unclear scope, or testing an approach before funding a build.",
    action: { label: "See blueprint prices", href: "/pricing#discovery-sprint" },
  },
  {
    id: "quickwin",
    name: "Fixed-Scope AI Quick Win",
    tag: "Step 3 · A first result",
    description:
      "One useful agent, automation, marketing workflow or product feature, with clear acceptance criteria, a timeline and a price agreed before work starts.",
    facts: [
      { term: "How you pay", value: "By milestone" },
      { term: "How long", value: "Set in your blueprint" },
    ],
    bestFor: "A first system you can measure before committing to more.",
    action: { label: "Get a quote", href: "/contact" },
  },
  {
    id: "managed",
    name: "Managed AI Operations",
    tag: "Step 4 · Keep it running",
    description:
      "We monitor the system, improve its models and workflows, report on usage, provide support and maintain the integrations as your tools change.",
    facts: [
      { term: "How you pay", value: "Monthly" },
      { term: "How long", value: "Ongoing, reviewed with you" },
    ],
    bestFor: "Agents and automations that are already in daily use.",
    action: { label: "Discuss operations", href: "/contact" },
  },
  {
    id: "growth",
    name: "AI Growth & Creative Retainer",
    tag: "Step 5 · Keep it growing",
    description:
      "A steady supply of advertising concepts, video assets and compliant marketing sequences, with campaign testing and optimisation.",
    facts: [
      { term: "How you pay", value: "Monthly" },
      { term: "How long", value: "Ongoing, reviewed with you" },
    ],
    bestFor: "Teams that need fresh creative and campaigns every month.",
    action: { label: "Discuss a retainer", href: "/contact" },
  },
  {
    id: "embedded",
    name: "Embedded Engineering",
    tag: "Or: join your team",
    description:
      "Ongoing, senior-engineer capacity working inside your team and your existing tools — for teams that need sustained delivery, not a one-off project.",
    facts: [
      { term: "How you pay", value: "Monthly" },
      { term: "How long", value: "No fixed minimum term" },
    ],
    bestFor: "Teams scaling delivery, covering a gap, or wanting AI-fluent senior engineering long-term.",
    action: { label: "Discuss capacity", href: "/contact" },
  },
];

export const processFaqs = [
  {
    question: "How fast can you actually start?",
    answer:
      "Most AI Opportunity Calls happen within a few business days of first contact, and a paid AI Implementation Blueprint can typically start the following week once scope is agreed.",
  },
  {
    question: "How does AI actually factor into delivery?",
    answer:
      "AI models are used where they measurably speed up delivery — scaffolding, code review, test generation, and in some cases as a feature inside the product itself (document processing, predictive analysis). Every AI-assisted output is reviewed and owned by a senior engineer on our team before it ships; AI accelerates the work, it doesn't replace engineering judgment.",
  },
  {
    question: "What about security, NDAs, and IP ownership?",
    answer:
      "NDAs are standard before any confidential discussion. You retain full IP ownership of everything built for you. Engagements involving sensitive or classified data can draw on direct experience holding UK SC (Security Check) clearance for government and defense work.",
  },
  {
    question: "Do you work with in-house teams, or only end-to-end?",
    answer:
      "Both. Some engagements are fully end-to-end delivery; others are embedded work alongside an existing engineering team, picking up a specific system or gap in capacity.",
  },
];
