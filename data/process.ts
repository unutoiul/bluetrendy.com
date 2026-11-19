import { discoveryPackages, formatPounds } from "./pricing";

export const processSteps = [
  {
    step: "01",
    title: "Discovery call",
    duration: "30–45 minutes",
    description:
      "Tell us what you need, who will use it and when you need it. Together you decide whether a planning sprint makes sense.",
  },
  {
    step: "02",
    title: "Paid discovery sprint",
    duration: "1–2 weeks",
    description:
      "For a fixed price, we map out how the system will work, estimate the build and test the riskiest idea if needed. The written plan is yours to keep.",
  },
  {
    step: "03",
    title: "Build in the open",
    duration: "Ongoing, weekly cadence",
    description:
      "Try a working version each week. You can see the list of upcoming changes and speak directly with the people building it by Slack or email.",
  },
  {
    step: "04",
    title: "Ship & hand over",
    duration: "At each milestone",
    description:
      "We launch the release, set up monitoring and give the people running it a guide to everyday tasks and recovery.",
  },
];

export type EngagementModel = {
  id: "discovery" | "fixed" | "embedded";
  name: string;
  /** Where the model sits in the journey, shown as a tag on its card. */
  tag: string;
  description: string;
  facts: { term: string; value: string }[];
  bestFor: string;
  action: { label: string; href: string };
};

export const engagementModels: EngagementModel[] = [
  {
    id: "discovery",
    name: "Paid Discovery Sprint",
    tag: "Start here",
    description:
      "The entry point for most engagements. A fixed-price, time-boxed sprint that ends with an architecture plan, risk assessment, and delivery estimate — before you commit to a full build.",
    facts: [
      { term: "How you pay", value: `Fixed price, from ${formatPounds(Math.min(...discoveryPackages.map(item => item.price)))}` },
      { term: "How long", value: "1–2 weeks" },
    ],
    bestFor: "New projects, unclear scope, or validating an approach before funding a full build.",
    action: { label: "See sprint prices", href: "/pricing#discovery-sprint" },
  },
  {
    id: "fixed",
    name: "Fixed-Scope Project",
    tag: "Then: a set build",
    description:
      "A defined deliverable, timeline, and price, agreed after discovery. Weekly demos and milestone-based payment keep the engagement accountable end to end.",
    facts: [
      { term: "How you pay", value: "By milestone" },
      { term: "How long", value: "Set in your discovery plan" },
    ],
    bestFor: "Well-scoped builds — a platform, a migration, an integration — with a clear definition of done.",
    action: { label: "Get a quote", href: "/contact" },
  },
  {
    id: "embedded",
    name: "Embedded Engineering",
    tag: "Or: ongoing work",
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
      "Most discovery calls happen within a few business days of first contact, and a paid discovery sprint can typically start the following week once scope is agreed.",
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
