export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  bullets: string[];
  stack: string[];
  preview?: {
    icon: "cube" | "web" | "phone" | "integration" | "spark" | "film";
    heading: string;
    steps: [string, string][];
    related?: { slug: string; label: string };
  };
};

export const services: Service[] = [
  {
    slug: "ai-native-web-apps",
    name: "Custom software",
    shortDescription:
      "Portals, dashboards and internal tools built around the way your team works.",
    description:
      "When a spreadsheet can no longer run the operation, we turn it into shared software. Your team gets a workspace with live data, permissions and a record of each decision.",
    preview: {
      icon: "cube", heading: "Give your team one place to work",
      steps: [
        ["Map the workflow", "We sit with the people doing the work and trace one real task from start to finish."],
        ["Build a first release", "Your team tries the core workflow with representative data while changes are still inexpensive."],
        ["Roll it out", "We test permissions, connect live data and release the tool to its first users."],
      ],
      related: { slug: "complex-mission-critical-systems", label: "Mission-critical systems" },
    },
    bullets: [
      "Real-time data pipelines and WebSocket streaming for live pricing, monitoring, and analytics",
      "AI copilots and automation embedded in internal tools and customer-facing UX",
      "GraphQL and REST APIs designed for reliability under regulated or high-stakes workloads",
      "Cloud-native deployment on AWS or Azure with CI/CD and automated testing from day one",
    ],
    stack: ["React", "Next.js", "TypeScript", "GraphQL", "Node.js", "AWS", "Azure"],
  },
  {
    slug: "websites-and-ecommerce",
    name: "Websites & e-commerce",
    shortDescription: "Company websites, booking flows and online shops your team can update.",
    description: "We design the route from a first visit to an enquiry, booking or purchase. You get a fast, accessible site and an editor your team can use for product updates and campaigns.",
    bullets: [
      "Page design, content structure and responsive layouts for desktop and mobile",
      "Product catalogues, checkout, booking calendars and enquiry forms",
      "Editable content, search metadata and measurement of key customer journeys",
    ],
    stack: ["Next.js", "CMS", "Payments", "Analytics"],
    preview: {
      icon: "web", heading: "Make the next step clear for visitors",
      steps: [
        ["Plan the journey", "We map the pages a visitor needs to compare options and decide what to do next."],
        ["Build the site", "We connect content, products, payments or bookings to the systems your team uses."],
        ["Launch & measure", "We test the journey on phones and desktops and set up measurement for completed actions."],
      ],
    },
  },
  {
    slug: "mobile-cross-platform",
    name: "Mobile apps",
    shortDescription:
      "iOS and Android apps for customers, field teams and work on the move.",
    description:
      "We design for the moments when a phone is the best tool for the job, from checking a booking to recording a site visit offline. We connect the app to your platform and prepare both store submissions.",
    preview: {
      icon: "phone", heading: "Put the workflow in someone’s hand",
      steps: [
        ["Try a prototype", "Test the main task on a phone before committing to development."],
        ["Connect the app", "We add sign-in, notifications and offline data where the task calls for them."],
        ["Release to stores", "We test on real devices and prepare the iOS and Android releases."],
      ],
    },
    bullets: [
      "React Native apps sharing core logic and data layer with the web platform",
      "Native-feeling UI and performance on iOS and Android from a single codebase",
      "Push, offline, and device-integration patterns handled from the architecture stage, not retrofitted",
    ],
    stack: ["React Native", "TypeScript", "GraphQL", "Redux"],
  },
  {
    slug: "it-implementation-and-integration",
    name: "IT implementation & integration",
    shortDescription: "System setup, data migration and integrations between the tools you rely on.",
    description: "We help teams put a new platform into daily use. That can mean connecting a CRM to finance, moving records from a legacy database, or setting up cloud deployment and access for a new application.",
    bullets: [
      "Map current systems, owners and data flows before choosing the integration approach",
      "Configure roles, connect APIs and reconcile a trial migration against source records",
      "Rehearse cutover, train the people who run the system and hand over recovery instructions",
    ],
    stack: ["APIs", "Webhooks", "SQL", "Cloud infrastructure"],
    preview: {
      icon: "integration", heading: "Make new systems work with the old ones",
      steps: [
        ["Map the systems", "We identify the source of truth for each record and the people who need access."],
        ["Connect & migrate", "We configure tools and reconcile migrated data before switching live traffic."],
        ["Train & hand over", "Your team rehearses the rollout and takes ownership with a tested recovery plan."],
      ],
      related: { slug: "legacy-modernization", label: "Legacy modernization" },
    },
  },
  {
    slug: "complex-mission-critical-systems",
    name: "Complex, Mission-Critical Systems",
    shortDescription:
      "Trading systems, geospatial platforms, and regulated data workflows — where correctness and security aren't optional.",
    description:
      "Some systems can't afford to be wrong. We bring defense, finance, and healthcare-grade engineering discipline — TDD/BDD, security clearance experience, and audited delivery processes — to platforms where a bug isn't an inconvenience, it's an incident.",
    bullets: [
      "Real-time trading, pricing, and portfolio systems built on event-driven architecture",
      "Geospatial and mission-critical platforms engineered for accuracy at scale (ArcGIS, spatial indexing, large multi-source datasets)",
      "TDD/BDD test discipline (JUnit, Cucumber) validating every business-critical workflow",
      "Delivery experience inside government and defense environments, including UK SC-cleared work",
    ],
    stack: ["Java", "Spring Boot", "Python", "ArcGIS", "PostgreSQL", "Azure", "Kubernetes"],
  },
  {
    slug: "legacy-modernization",
    name: "Legacy Modernization",
    shortDescription:
      "Migrating monoliths and aging stacks to modern, cloud-native architecture — incremental, tested, reversible.",
    description:
      "Legacy systems rarely fail because the business logic is wrong — they fail because the platform underneath can't keep up. We modernize incrementally: strangler patterns, test coverage before refactors, and cloud migration paths that don't require betting the business on a big-bang rewrite.",
    bullets: [
      "Incremental migration paths from legacy stacks (Angular.js, jQuery, on-prem systems) to modern architecture",
      "Test coverage established before refactors begin, so behavior stays provably correct",
      "Cloud migration to AWS or Azure with CI/CD pipelines replacing manual deployment",
    ],
    stack: ["Angular", "React", "Node.js", "Docker", "AWS", "Azure"],
  },
  {
    slug: "ai-automation-applied-ml",
    name: "AI & automation",
    shortDescription:
      "Document processing, internal assistants and approval flows with human review.",
    description:
      "We automate a repeatable task using your documents and business rules. Staff can see the source behind a result, correct a mistake and review uncertain cases before any action is taken.",
    preview: {
      icon: "spark", heading: "Take repetitive work out of the queue",
      steps: [
        ["Choose the task", "We pick a high-volume task and agree how to measure the time saved and the error rate."],
        ["Test real examples", "We evaluate the workflow against representative documents and known exceptions."],
        ["Add review", "Staff approve uncertain results and can trace each decision to its source."],
      ],
    },
    bullets: [
      "LLM integration for document processing, financial analysis, and internal automation",
      "Applied ML and predictive models (Amazon SageMaker and equivalents) for maintenance, forecasting, and pattern recognition",
      "AI-assisted diagnostics and image analysis in regulated healthcare and industrial contexts",
      "Vendor-neutral model selection based on task fit, latency, cost, and compliance — not a single-provider lock-in",
    ],
    stack: ["Claude", "GPT", "Python", "SageMaker", "LangChain-style orchestration", "Vector search"],
  },
  {
    slug: "marketing-video-production",
    name: "Marketing video production",
    shortDescription: "Product demos, launch films and captioned edits for web and social.",
    description: "We turn a product workflow or campaign brief into a film that shows buyers what they can do. We handle the script, storyboard, screen capture, motion graphics and final edit.",
    bullets: [
      "An audience brief, script and storyboard for approval before production",
      "Product footage, motion graphics, narration and captions matched to the campaign",
      "Website-ready exports and vertical or square edits for social channels",
    ],
    stack: ["Storyboarding", "Screen capture", "Motion graphics", "Editing & captions"],
    preview: {
      icon: "film", heading: "Show the product doing its job",
      steps: [
        ["Write the story", "We choose one buyer question and storyboard the product moments that answer it."],
        ["Produce the film", "We capture the workflow and edit footage, graphics, narration and captions together."],
        ["Adapt the cuts", "You receive the main film plus edits sized and paced for the channels in your brief."],
      ],
    },
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
