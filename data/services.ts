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
      "Dashboards with live figures for your team to act on",
      "Tools that automate routine tasks and connect to your existing systems",
      "A tested release on AWS or Azure, with access set up for the right people",
    ],
    stack: ["React", "Next.js", "TypeScript", "GraphQL", "Node.js", "AWS", "Azure"],
  },
  {
    slug: "websites-and-ecommerce",
    name: "Websites & e-commerce",
    shortDescription: "Company websites, booking flows and online shops your team can update.",
    description: "We design the route from a first visit to an enquiry, booking or purchase. You get a fast, accessible site and an editor your team can use for product updates and campaigns.",
    bullets: [
      "Pages that are easy to use on a phone or computer",
      "Product listings, payments, booking calendars or enquiry forms",
      "An editor for your team and reports on visits, bookings and sales",
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
      "One app for iPhone and Android, connected to your existing platform",
      "Sign-in, notifications and offline access where your users need them",
      "Testing on real devices and help publishing to both app stores",
    ],
    stack: ["React Native", "TypeScript", "GraphQL", "Redux"],
  },
  {
    slug: "it-implementation-and-integration",
    name: "IT setup & integration",
    shortDescription: "Connect the tools you use and move your data safely.",
    description: "We help your team start using a new system. For example, we can connect sales to finance so people enter a customer record once.",
    bullets: [
      "A map of which systems hold your data and who needs access",
      "Connected tools, with transferred records checked against the originals",
      "A practice rollout, staff training and a recovery plan",
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
    name: "Business-critical systems",
    shortDescription: "Reliable software for work where accuracy matters, from trading to medical records.",
    description: "Our engineers have built systems for banks, healthcare organisations and government teams. We test the high-risk tasks first and keep a record of how each release was checked.",
    bullets: [
      "Live pricing and portfolio tools for financial teams",
      "Mapping tools that combine information from multiple sources",
      "Automated checks for the decisions and workflows your team depends on",
    ],
    stack: ["Java", "Spring Boot", "Python", "ArcGIS", "PostgreSQL", "Azure", "Kubernetes"],
  },
  {
    slug: "legacy-modernization",
    name: "Upgrades for older software",
    shortDescription: "Update an ageing system while your team keeps working.",
    description: "We replace older software in stages. First we document what works today, then test each change with your team before moving to the next part.",
    bullets: [
      "A plan for which parts to keep, update or replace",
      "Tests that check important tasks before and after each change",
      "A move to the cloud where it helps, with a way back at each stage",
    ],
    stack: ["Angular", "React", "Node.js", "Docker", "AWS", "Azure"],
  },
  {
    slug: "ai-automation-applied-ml",
    name: "AI & automation",
    shortDescription: "Use AI to read documents, find answers and handle routine tasks.",
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
      "Document tools that extract figures or find answers in your own files",
      "Forecasts and alerts for equipment maintenance or changing demand",
      "Tests against real examples, with staff review for uncertain results",
    ],
    stack: ["Claude", "GPT", "Python", "SageMaker", "LangChain-style orchestration", "Vector search"],
  },
  {
    slug: "marketing-video-production",
    name: "Marketing videos",
    shortDescription: "Product demos, launch videos and short clips for social media.",
    description: "We turn a product workflow or campaign brief into a film that shows buyers what they can do. We handle the script, storyboard, screen capture, motion graphics and final edit.",
    bullets: [
      "A script and storyboard you can approve before filming",
      "Footage, animation, voiceover and captions for your audience",
      "Finished videos sized for your website and social channels",
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
