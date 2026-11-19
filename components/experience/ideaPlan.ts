const patterns = {
  web: {
    name: "Web product", nodes: ["Web interface", "Application API", "Product database"],
    features: ["Sign-in and access", "Guided user workflow", "Saved results"],
    layers: ["Sign-in", "Product logic", "Record service"],
    slice: "Take one high-value user task from sign-in to a saved result.",
    question: "Which task would make someone come back to the product?",
    stack: "React, TypeScript, Node.js, PostgreSQL", weeks: [3, 6],
  },
  assistant: {
    name: "Knowledge assistant", nodes: ["Question inbox", "Retrieval and model", "Source library"],
    features: ["Source-backed answers", "Knowledge search", "Escalation to a person"],
    layers: ["Retrieval", "Model & citations", "Permissions"],
    slice: "Answer one class of questions with source citations and a route to a human.",
    question: "Which trusted sources should the assistant be allowed to quote?",
    stack: "LLM API, React, Next.js, Python API, PostgreSQL, pgvector", weeks: [4, 7],
  },
  dashboard: {
    name: "Data dashboard", nodes: ["Source data", "Validated metrics", "Analyst workspace"],
    features: ["Source integration", "Metric validation", "Filterable reports"],
    layers: ["Ingestion", "Metric rules", "Query service"],
    slice: "Connect one dataset and deliver a decision-ready view of its most important metric.",
    question: "What decision should someone make after looking at this view?",
    stack: "React, TypeScript, SQL, a scheduled ingestion job", weeks: [3, 5],
  },
  workflow: {
    name: "Workflow automation", nodes: ["Incoming request", "Workflow queue", "Review and audit"],
    features: ["Request intake", "Exception review", "Decision history"],
    layers: ["Routing", "Approvals", "Audit events"],
    slice: "Automate one repeatable task with an approval step and a traceable result.",
    question: "Which exceptions should still reach a person for approval?",
    stack: "A typed API, a background worker, PostgreSQL", weeks: [3, 6],
  },
  mobile: {
    name: "Mobile app", nodes: ["Mobile interface", "Authenticated API", "Synced records"],
    features: ["Mobile sign-in", "Offline activity", "Record sync"],
    layers: ["Sign-in", "Sync queue", "Conflict handling"],
    slice: "Complete one mobile journey on a real device, including an interrupted connection.",
    question: "What should still work when a user loses their connection?",
    stack: "React Native, TypeScript, a sync API", weeks: [4, 8],
  },
  migration: {
    name: "System modernization", nodes: ["Existing system", "Compatibility layer", "Replacement service"],
    features: ["Compatibility checks", "Incremental rollout", "Release rollback"],
    layers: ["Adapter", "Contract checks", "Rollout gate"],
    slice: "Move a single working feature behind a tested boundary with a reversible cutover.",
    question: "Which existing workflow is small enough to migrate and verify first?",
    stack: "Contract tests, a service adapter, deployment automation", weeks: [5, 9],
  },
} as const;

export type Pattern = keyof typeof patterns;
export const patternOptions = Object.entries(patterns).map(([value, { name }]) => ({ value: value as Pattern, label: name }));
export const audienceOptions = ["Internal team", "Customers", "Both groups"] as const;
export const integrationOptions = ["None", "One system", "Two or more systems"] as const;
export const dataOptions = ["Standard business data", "Sensitive or regulated data"] as const;

export type Scope = {
  pattern: Pattern;
  audience: typeof audienceOptions[number];
  integrations: typeof integrationOptions[number];
  data: typeof dataOptions[number];
  rate: string;
};

export const initialScope: Scope = {
  pattern: "web", audience: "Internal team", integrations: "None", data: "Standard business data", rate: "",
};

export function suggestPattern(brief: string): Pattern {
  if (/\b(migrat\w*|legacy|moderniz\w*|modernis\w*)\b/i.test(brief)) return "migration";
  if (/\b(assistant|chatbot|copilot|questions?|knowledge base|support bot)\b/i.test(brief)) return "assistant";
  if (/\b(dashboard|analytics|insights?|reporting|metrics?)\b/i.test(brief)) return "dashboard";
  if (/\b(mobile|offline|ios|android|phone)\b/i.test(brief)) return "mobile";
  if (/\b(automat\w*|workflows?|approvals?|invoices?|routing)\b/i.test(brief)) return "workflow";
  return "web";
}

export function outlineFor(scope: Scope) {
  const pattern = patterns[scope.pattern];
  const complexData = scope.data === "Sensitive or regulated data";
  const moreRoles = scope.audience === "Both groups" ? 1 : 0;
  const systems = integrationOptions.indexOf(scope.integrations);
  const min = pattern.weeks[0] + systems + moreRoles + (complexData ? 2 : 0);
  const max = pattern.weeks[1] + systems * 2 + moreRoles * 2 + (complexData ? 4 : 0);
  const effortRange = `${min}–${max}`;
  const effort = `${effortRange} engineer-weeks`;
  const rate = Number(scope.rate);
  const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
  const budgetRange = scope.rate.trim() && Number.isFinite(rate) && rate > 0
    ? `${money.format(min * 5 * rate)}–${money.format(max * 5 * rate)}`
    : null;
  const budget = budgetRange ? `${budgetRange} at ${money.format(rate)} per day` : null;
  const discovery = systems
    ? "Get sample records, access to each connected system and a named integration owner."
    : "Walk through a real example with a first user and agree on the acceptance test.";
  const verification = complexData
    ? "Review permissions, retention and audit logs before a limited pilot with approved data."
    : "Run the acceptance test with first users, then release with monitoring and a rollback plan.";
  return { ...pattern, effort, effortRange, budget, budgetRange, discovery, verification };
}

export function formatOutline(brief: string, scope: Scope) {
  const plan = outlineFor(scope);
  return [
    "BlueTrendy Intelligence | Project outline", "", "Your idea", brief.trim(), "",
    "Scope", [plan.name, scope.audience, scope.integrations, scope.data].join(" · "), "",
    "Architecture", plan.nodes.join(" → "), plan.layers.join(" · "), plan.stack, "", "Key features", ...plan.features, "",
    "Discovery", plan.question, plan.discovery, "", "First release", plan.slice, "",
    "Pilot and launch", plan.verification, "", "Indicative engineering effort", plan.effort,
    ...(plan.budget ? ["Illustrative labour budget", plan.budget] : []), "",
    estimateAssumption, "BlueTrendy confirms scope, delivery price and schedule after a discovery sprint.",
  ].join("\n");
}

export function downloadOutline(brief: string, scope: Scope) {
  const text = formatOutline(brief, scope);
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "BlueTrendy-project-outline.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const estimateAssumption = "Assumes one senior engineer working five days per week on the first release. Vendor fees, tax and external approval time are separate.";
