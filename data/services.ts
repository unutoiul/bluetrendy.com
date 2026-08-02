export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  bullets: string[];
  stack: string[];
};

export const services: Service[] = [
  {
    slug: "ai-native-web-apps",
    name: "AI-Native Web Applications",
    shortDescription:
      "Production web platforms with AI and automation built in from day one, not bolted on after launch.",
    description:
      "We design and build web applications on modern, typed foundations — React, Next.js, GraphQL, and event-driven backends — with AI capability treated as a core requirement, not a feature flag. That means real-time data pipelines, AI-assisted internal tooling, and automation woven into the architecture from the first sprint.",
    bullets: [
      "Real-time data pipelines and WebSocket streaming for live pricing, monitoring, and analytics",
      "AI copilots and automation embedded in internal tools and customer-facing UX",
      "GraphQL and REST APIs designed for reliability under regulated or high-stakes workloads",
      "Cloud-native deployment on AWS or Azure with CI/CD and automated testing from day one",
    ],
    stack: ["React", "Next.js", "TypeScript", "GraphQL", "Node.js", "AWS", "Azure"],
  },
  {
    slug: "mobile-cross-platform",
    name: "Mobile & Cross-Platform Apps",
    shortDescription:
      "React Native mobile experiences that share logic with your web platform, shipped without sacrificing native feel.",
    description:
      "When a product needs to live on a phone as well as a browser, we build it once with shared business logic and platform-native polish — so mobile isn't a second, slower project trailing behind the web release.",
    bullets: [
      "React Native apps sharing core logic and data layer with the web platform",
      "Native-feeling UI and performance on iOS and Android from a single codebase",
      "Push, offline, and device-integration patterns handled from the architecture stage, not retrofitted",
    ],
    stack: ["React Native", "TypeScript", "GraphQL", "Redux"],
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
    name: "AI Automation & Applied ML",
    shortDescription:
      "Embedding frontier AI models and applied ML into real business workflows — chosen for fit, not brand loyalty.",
    description:
      "We integrate large language models and applied machine learning where they actually move a business metric — document processing, financial analysis, predictive maintenance, diagnostic support — selecting the model (Claude, GPT, or another frontier model) that fits the task, cost, and compliance requirements rather than defaulting to one vendor.",
    bullets: [
      "LLM integration for document processing, financial analysis, and internal automation",
      "Applied ML and predictive models (Amazon SageMaker and equivalents) for maintenance, forecasting, and pattern recognition",
      "AI-assisted diagnostics and image analysis in regulated healthcare and industrial contexts",
      "Vendor-neutral model selection based on task fit, latency, cost, and compliance — not a single-provider lock-in",
    ],
    stack: ["Claude", "GPT", "Python", "SageMaker", "LangChain-style orchestration", "Vector search"],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
