export type CaseStudy = {
  slug: string;
  client: string;
  sector: string;
  timeframe: string;
  location: string;
  title: string;
  summary: string;
  challenge: string;
  approach: string[];
  impact: string[];
  stack: string[];
  featured: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "blue-bridge-asset-management",
    client: "Blue Bridge Asset Management",
    sector: "Wealth & Asset Management",
    timeframe: "Dec 2025 – Mar 2026",
    location: "London, UK",
    title: "A faster way to price and trade structured products",
    summary:
      "Private clients can now discover, price, and execute complex structured instruments in real time — a workflow that used to depend on manual issuer round-trips.",
    challenge:
      "Blue Bridge's private clients needed to discover, price, and purchase complex instruments — Autocalls, Phoenix Autocalls, and Options notes issued by major banks — but pricing and issuer coordination were manual and slow, putting the desk at a disadvantage against faster-moving competitors.",
    approach: [
      "Real-time market data pipelines integrating Bloomberg feeds, with low-latency WebSocket streaming for live bid/ask prices, yields, and product analytics",
      "Event-driven architecture using Node.js and Python microservices powering stateful pricing, product normalization, and portfolio valuation via REST APIs and async messaging",
      "Secure trade execution workflow covering order validation, issuer confirmations, transaction lifecycle events, and client portfolio updates",
      "Cloud infrastructure on Azure Kubernetes Service, App Services, Functions, Service Bus, Key Vault, and PostgreSQL, with Docker, CI/CD, and automated integration testing",
    ],
    impact: [
      "Private clients price and execute structured products in real time instead of waiting on manual issuer round-trips",
      "The desk gained a resilient, auditable execution pipeline built for regulated financial transactions",
      "Transactional notifications (SendGrid) keep clients and issuers in sync throughout the trade lifecycle",
    ],
    stack: ["Node.js", "Python", "Azure AKS", "Azure Functions", "Azure Service Bus", "PostgreSQL", "Bloomberg API", "WebSockets", "Docker"],
    featured: true,
  },
  {
    slug: "bcg-bayer-medical-imaging",
    client: "Boston Consulting Group × Bayer",
    sector: "Healthcare & Life Sciences",
    timeframe: "Jun 2024 – Sept 2025",
    location: "London, UK",
    title: "A secure way for radiologists to review scans together",
    summary:
      "A collaborative medical imaging platform where radiologists across the world securely share, discuss, and get AI-assisted analysis on complex diagnostic cases.",
    challenge:
      "Bayer needed a way for radiologists in different countries to securely upload, manipulate, and share DICOM medical imaging files, and to collaborate on complex cases without compromising patient data or diagnostic accuracy.",
    approach: [
      "Built a collaborative system where radiologists worldwide can securely share and discuss cases",
      "Delivered on Java, React, Azure Cloud, Material-UI, Nginx, PostgreSQL, Docker, and Python for a scalable, high-performance platform",
      "Integrated AI-driven tools for image analysis and pattern recognition to support diagnostic review",
      "Deployed and managed on Azure Cloud for high availability, scalability, and fault tolerance",
    ],
    impact: [
      "Radiologists across geographies review and discuss the same cases securely, in one platform",
      "AI-assisted image analysis narrows the time to insight on complex diagnostic imaging",
      "Platform runs on infrastructure built for healthcare-grade availability and fault tolerance",
    ],
    stack: ["Java", "React", "Azure", "PostgreSQL", "Python", "Docker", "Nginx", "Material UI"],
    featured: true,
  },
  {
    slug: "nato-nci-agency-arcgis",
    client: "NATO Communications and Information Agency",
    sector: "Defense & Government",
    timeframe: "Jun 2024 – May 2025",
    location: "The Hague, Netherlands",
    title: "A shared map for NATO planning teams",
    summary:
      "A layered geospatial visualization platform for NATO strategic data — engineered to stay fast and accurate at a scale where latency has real consequences.",
    challenge:
      "NCI Agency needed layered geospatial visualization of strategic data across NATO, without the latency and rendering overhead that typically comes with large, multi-source operational datasets.",
    approach: [
      "Designed and implemented a Strategy Map platform leveraging ArcGIS SDKs, REST APIs, and feature services for layered geospatial visualization",
      "Optimized ArcGIS workflows with spatial indexing, feature layer caching, and geometry services to handle large-scale datasets while minimizing latency",
      "Integrated ArcGIS with a Java/Spring Boot backend orchestrating geospatial queries and data delivery into an Angular frontend",
      "Connected ArcGIS services to Azure Data Lake pipelines for ingestion and normalization of multi-source geospatial and operational data",
      "Implemented geospatial analytics — buffering, heatmaps, proximity analysis — to support mission-critical decision-making",
      "Validated system functionality with TDD/BDD using JUnit and Cucumber, with CI/CD on Azure DevOps (AKS, Functions, Event Grid)",
    ],
    impact: [
      "Reliable, low-latency geospatial intelligence available for mission-critical strategic decisions",
      "Large-scale, multi-source datasets render and update without the overhead that typically slows ArcGIS deployments at this scale",
      "Every geospatial transformation and business workflow is covered by automated test suites",
    ],
    stack: ["ArcGIS", "Java", "Spring Boot", "Angular", "Azure Data Lake", "Azure DevOps", "JUnit", "Cucumber"],
    featured: true,
  },
  {
    slug: "alvarez-marsal-financial-analysis",
    client: "Alvarez & Marsal",
    sector: "Consulting × Travel & Leisure",
    timeframe: "Apr 2024 – Jul 2024",
    location: "London, UK",
    title: "AI-assisted financial analysis for two major cruise lines",
    summary:
      "An automated, auditable pipeline that turned manual financial report review for Royal Caribbean and Carnival Cruise into a repeatable process the consulting team could run on demand.",
    challenge:
      "A&M's engagement with Royal Caribbean and Carnival Cruise required automated processing and trend analysis across large volumes of financial data, with a reliable way to upload and map incoming reports.",
    approach: [
      "Implemented algorithms and machine learning models for automated data processing and trend analysis using Python (NumPy, Pandas)",
      "Managed SQL and NoSQL databases (PostgreSQL, MongoDB) for efficient storage and retrieval of financial data",
      "Developed the front-end UI in React.js and Redux for financial report upload and mapping",
      "Used Docker and Kubernetes for scalable, reliable deployment",
    ],
    impact: [
      "Manual financial report review became an automated, auditable pipeline the team could run repeatably across both clients",
      "Data integrity and performance held up under large financial datasets across two enterprise engagements",
    ],
    stack: ["Python", "Pandas", "NumPy", "PostgreSQL", "MongoDB", "React", "Redux", "Docker", "Kubernetes"],
    featured: true,
  },
  {
    slug: "spx-flow-predictive-maintenance",
    client: "SPX Flow",
    sector: "Industrial & Manufacturing",
    timeframe: "Jan 2023 – Oct 2023",
    location: "London, UK",
    title: "Spotting maintenance issues on the production line",
    summary:
      "A React and AWS application that watches bottle-manufacturing production lines in real time and predicts maintenance needs before a line goes down.",
    challenge:
      "SPX Flow needed to monitor and predict sensor data in real time across production lines responsible for bottle manufacturing, to keep production optimized and get ahead of unplanned downtime.",
    approach: [
      "Built a React-based application on AWS tracking live sensor data from bottle production lines",
      "Used AWS Lambda functions, DynamoDB, GraphQL with Apollo Server, and Highcharts for real-time monitoring and visualization",
      "Applied Amazon SageMaker for predictive maintenance models, streamlining part pre-ordering",
    ],
    impact: [
      "Production teams see equipment health in real time instead of reacting to breakdowns after the fact",
      "Predictive models informed part pre-ordering, shortening the time between a predicted failure and a replacement part on hand",
    ],
    stack: ["React", "AWS Lambda", "DynamoDB", "GraphQL", "Apollo Server", "Amazon SageMaker", "Highcharts"],
    featured: true,
  },
  {
    slug: "atlassian-identity-platform",
    client: "Atlassian",
    sector: "Enterprise Software (B2B SaaS)",
    timeframe: "Dec 2018 – Sept 2019",
    location: "Sydney, Australia",
    title: "One sign-in system for 10M+ Atlassian accounts",
    summary:
      "A single application to manage identity across Jira, Confluence, Slack, and Bitbucket — coordinated across multiple product teams and over 10 million client subscriptions worldwide.",
    challenge:
      "Atlassian needed one application to manage identity across its core products, integrated with enterprise identity federation, and reliable enough to serve more than 10 million clients and subscriptions worldwide.",
    approach: [
      "Built the project using React with TypeScript, GraphQL, Apollo Server, Java 8, and Node.js with AWS services",
      "Integrated with GSuite and SAML for enterprise identity federation",
      "Developed Java and Node services to handle back-end identity functionality",
      "Implemented continuous integration using Bamboo, with code review and peer programming discipline across teams",
    ],
    impact: [
      "A single, reliable identity surface for one of the world's largest software suites",
      "Coordinated delivery across multiple Atlassian product teams managing over 10 million clients and subscriptions",
    ],
    stack: ["React", "TypeScript", "GraphQL", "Java", "Node.js", "AWS", "SAML"],
    featured: true,
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
