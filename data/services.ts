export type ServiceIcon = "build" | "film" | "agent" | "flow" | "forecast" | "growth" | "compass";

/** The live demonstration shown on a service's own page. */
export type ServiceDemo = "products" | "creative" | "agents" | "workflows" | "forecast" | "marketing" | "savings";

/** The drawn example screen shown for a service on the services page (see ServiceMockups). */
export type ServiceScene = "booking" | "video" | "extraction" | "integration" | "forecast" | "journey" | "migration";

export type Service = {
  /** The page lives at the site root: /ai-agents, /predictive-ai and so on. */
  slug: string;
  /** The page title shown in search results. */
  seoTitle: string;
  number: string;
  name: string;
  /** A shorter name for menus and compact cards. */
  shortName: string;
  /** The page headline in two beats; the second is drawn in the brand's blue. */
  headline: [lead: string, accent: string];
  shortDescription: string;
  description: string;
  /** What the client's business gets out of it. Leads every service, ahead of any technology. */
  value: string;
  cta: string;
  listTitle: string;
  bullets: string[];
  /** A process told as a chain of steps, such as an enquiry becoming a booked meeting. */
  examples?: { label: string; steps: string[] }[];
  /** What we would track to show the work paid off. Measures, never promised results. */
  measures: string[];
  safeguards: string[];
  stack: string[];
  /** Slugs of related case studies, most relevant first. */
  caseStudies: string[];
  icon: ServiceIcon;
  demo: ServiceDemo;
  scene: ServiceScene;
};

export const services: Service[] = [
  {
    slug: "ai-websites-apps",
    seoTitle: "AI Website & App Development",
    number: "01",
    name: "AI-powered websites & apps",
    shortName: "Websites & apps",
    headline: ["Your next digital product,", "built at AI speed."],
    shortDescription: "Websites, online shops, SaaS platforms and mobile apps, built faster with AI-assisted engineering.",
    description:
      "We combine senior engineering with AI-assisted design, coding, testing and deployment. You get a professional website, online shop, SaaS platform or mobile app sooner, and an engineer still reviews every release.",
    value: "Launch sooner, cut avoidable development work and get a product designed to attract and convert customers.",
    cta: "Build my website or app",
    listTitle: "What we build",
    bullets: [
      "Business websites and online shops",
      "Online booking and payments",
      "SaaS platforms and internal dashboards",
      "iOS and Android apps",
      "AI-powered search and recommendations",
      "Integrations with your CRM, analytics and operations systems",
    ],
    measures: ["Time and cost to the first release", "Bookings, enquiries or sales completed", "Page speed and accessibility scores"],
    safeguards: [
      "A senior engineer reviews AI-assisted code before it ships",
      "Automated tests cover the journeys your customers depend on",
      "You own the code, the content and the accounts",
    ],
    stack: ["React", "Next.js", "TypeScript", "React Native", "Node.js", "GraphQL", "AWS", "Azure"],
    caseStudies: ["atlassian-identity-platform", "blue-bridge-asset-management", "bcg-bayer-medical-imaging"],
    icon: "build",
    demo: "products",
    scene: "booking",
  },
  {
    slug: "ai-video-production",
    seoTitle: "AI Video Production & Creative Studio",
    number: "02",
    name: "AI creative & video studio",
    shortName: "Creative & video studio",
    headline: ["Turn your ideas into videos", "people want to watch."],
    shortDescription: "Campaign concepts, product films and social videos, with variations ready to test.",
    description:
      "A creative studio for whole campaigns, not only single videos. We bring product and advertising ideas to life with creative direction, storyboards, AI-assisted generation, motion design, sound and professional editing.",
    value: "Produce and test more high-quality marketing assets, at a lower cost for each creative iteration.",
    cta: "Create my next campaign",
    listTitle: "What we create",
    bullets: [
      "Cinematic product commercials",
      "Launch films",
      "Videos for Instagram, Facebook, TikTok and YouTube",
      "Animated explainers and product demos",
      "Multilingual voiceovers and captions",
      "Several variations of one idea, ready to test",
    ],
    measures: ["Cost per useful creative", "Qualified leads from each campaign", "Which variation performs best"],
    safeguards: [
      "You approve the script and storyboard before production",
      "An editor checks and finishes every AI-generated shot",
      "We use music, voices and footage you have the right to publish",
    ],
    stack: ["Creative direction", "Storyboarding", "AI-assisted generation", "Motion graphics", "Sound design", "Editing & captions"],
    caseStudies: [],
    icon: "film",
    demo: "creative",
    scene: "video",
  },
  {
    slug: "ai-agents",
    seoTitle: "Custom AI Agents for Business",
    number: "03",
    name: "Custom AI agents & managed agents",
    shortName: "AI agents",
    headline: ["Digital workers", "built for your business."],
    shortDescription: "Digital workers that carry out approved tasks inside your business systems.",
    description:
      "We design, build and manage AI agents that do approved work inside your business systems. They don’t stop at answering a question: they update the record, send the reply and hand anything unusual to a person.",
    value: "Faster customer service, less repetitive work and more capacity, without growing headcount at the same rate.",
    cta: "Build my AI agent",
    listTitle: "What an agent can do",
    bullets: [
      "Reply to customer-service and support requests",
      "Qualify leads and book meetings",
      "Search internal documents and answer with sources",
      "Draft quotations and proposals",
      "Keep the CRM up to date",
      "Watch queues and flag what is stuck",
      "Route refunds, payments and unusual actions for approval",
    ],
    measures: ["Hours saved each week", "Requests resolved accurately", "Response time to customers"],
    safeguards: [
      "Agents act only inside the permissions you approve",
      "Refunds, payments and unusual actions wait for a person",
      "Every step is logged, so you can see what the agent did and why",
    ],
    stack: ["Claude", "GPT", "Python", "TypeScript", "Vector search", "CRM and helpdesk APIs"],
    caseStudies: ["alvarez-marsal-financial-analysis"],
    icon: "agent",
    demo: "agents",
    scene: "extraction",
  },
  {
    slug: "agentic-automation",
    seoTitle: "Agentic AI & Business Automation",
    number: "04",
    name: "Agentic AI & business automation",
    shortName: "Business automation",
    headline: ["Connect your systems.", "Automate your workflows."],
    shortDescription: "Connected systems where AI completes multi-step work, with approvals and audit logs.",
    description:
      "We connect your tools so AI can complete coordinated, multi-step processes from start to finish, with audit logs, permissions and human review where it matters.",
    value: "Less administration, fewer delays between teams and more consistent operations.",
    cta: "Automate my business",
    listTitle: "Workflows we automate",
    bullets: [
      "Sales: from enquiry to a qualified, booked follow-up",
      "Finance: from invoice to an approved accounting entry",
      "Hospitality: from booking to a confirmed, coordinated stay",
      "Document handling and data entry between systems",
      "Approval routing with a full audit log",
      "Reports written from live data",
    ],
    examples: [
      { label: "Sales", steps: ["A website enquiry arrives", "AI qualifies the lead", "The CRM is updated", "A personal reply is drafted", "A follow-up is scheduled", "The result is reported"] },
      { label: "Finance", steps: ["An invoice arrives", "AI extracts the fields", "It matches the purchase order", "Exceptions are flagged", "A person approves", "The accounts are updated"] },
      { label: "Hospitality", steps: ["A guest books a room", "AI drafts the confirmation", "It answers routine questions", "Requests go to operations"] },
    ],
    measures: ["Processing time for each item", "Exception rate", "Lead-to-meeting conversion"],
    safeguards: [
      "Each workflow has permissions for what it may read and change",
      "An audit log records every step",
      "People review the steps that carry risk",
    ],
    stack: ["APIs & webhooks", "Python", "Node.js", "SQL", "Claude", "GPT", "Cloud queues & functions"],
    caseStudies: ["alvarez-marsal-financial-analysis", "blue-bridge-asset-management"],
    icon: "flow",
    demo: "workflows",
    scene: "integration",
  },
  {
    slug: "predictive-ai",
    seoTitle: "Predictive AI & Business Forecasting",
    number: "05",
    name: "Predictive AI & business intelligence",
    shortName: "Predictive AI",
    headline: ["Don’t just analyse yesterday.", "Prepare for tomorrow."],
    shortDescription: "Forecasts, risk alerts and dashboards built from your own business data.",
    description:
      "We use your historical data, statistical forecasting and machine learning to estimate what is likely to happen next, watch for emerging risks and guide decisions. Every forecast is tested against real results and shows how certain it is.",
    value: "Better decisions and earlier warning signals, without pretending AI can know the future for certain.",
    cta: "Explore predictive AI",
    listTitle: "What we forecast",
    bullets: [
      "Sales and revenue",
      "Product demand and inventory",
      "Customer churn and retention",
      "Equipment maintenance",
      "Cash flow and capacity",
      "Anomalies and business risk alerts",
    ],
    measures: ["Forecast error against actual results", "Stockouts and overstock", "Repeat purchases after retention work"],
    safeguards: [
      "Forecasts are tested on data the model has not seen",
      "Results are shown as a range, not a single number",
      "Models are checked again as your business changes",
    ],
    stack: ["Python", "Pandas", "NumPy", "Amazon SageMaker", "SQL", "Dashboards"],
    caseStudies: ["spx-flow-predictive-maintenance", "alvarez-marsal-financial-analysis"],
    icon: "forecast",
    demo: "forecast",
    scene: "forecast",
  },
  {
    slug: "ai-marketing-automation",
    seoTitle: "AI Sales & Marketing Automation",
    number: "06",
    name: "AI sales & marketing automation",
    shortName: "Sales & marketing automation",
    headline: ["Turn more leads", "into paying customers."],
    shortDescription: "Email, CRM and lead capture connected into follow-up that runs on time, every time.",
    description:
      "We connect email, CRM, lead capture and analytics into marketing workflows that follow up on time, every time, and show you what is working.",
    value: "More consistent follow-up, stronger customer relationships and more chances to grow revenue.",
    cta: "Grow my business with AI",
    listTitle: "What we automate",
    bullets: [
      "Welcome and onboarding email sequences",
      "Lead nurturing in your CRM",
      "Customer segmentation and lead scoring",
      "Abandoned-checkout follow-up",
      "Appointment reminders",
      "Customer reactivation and repeat-purchase campaigns",
      "Campaign reports and A/B tests",
      "AI-assisted content and advertising workflows",
    ],
    measures: ["Lead-to-meeting conversion", "Repeat purchases", "Orders recovered from abandoned checkouts"],
    safeguards: [
      "Consent is checked before any message is sent",
      "Every email carries a working unsubscribe link",
      "Personal data is open only to the people and tools that need it",
    ],
    stack: ["Email platforms", "CRM", "Lead capture forms", "Analytics", "Claude", "GPT"],
    caseStudies: [],
    icon: "growth",
    demo: "marketing",
    scene: "journey",
  },
  {
    slug: "ai-implementation",
    seoTitle: "AI Implementation & Consulting",
    number: "07",
    name: "AI implementation & transformation",
    shortName: "AI implementation",
    headline: ["From AI ideas", "to working business systems."],
    shortDescription: "Audits, roadmaps, pilots and rollout: from AI ideas to systems in daily use.",
    description:
      "We find the AI opportunities worth pursuing, choose the technology, design the integrations, build a pilot, train your team and watch over the system in production.",
    value: "Move beyond disconnected AI experiments to improvements you can measure.",
    cta: "Plan my AI implementation",
    listTitle: "What we deliver",
    bullets: [
      "AI opportunity audits",
      "Value and ROI assessments",
      "Implementation roadmaps",
      "Proofs of concept and pilots",
      "Model selection",
      "API, CRM and data integration",
      "Security and access controls",
      "Evaluation, deployment and ongoing improvement",
    ],
    measures: ["Delivery time for the first pilot", "Cost of the process before and after", "A KPI you choose: conversion, forecast error or hours saved"],
    safeguards: [
      "A security and access review before any system is connected",
      "A pilot with clear acceptance criteria before a wider rollout",
      "Training and a handover guide for the people who run it",
    ],
    stack: ["Claude", "GPT", "Python", "AWS", "Azure", "APIs", "SQL"],
    caseStudies: ["spx-flow-predictive-maintenance", "alvarez-marsal-financial-analysis", "nato-nci-agency-arcgis"],
    icon: "compass",
    demo: "savings",
    scene: "migration",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
