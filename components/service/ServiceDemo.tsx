import AgentDemo from "@/components/experience/AgentDemo";
import CreativeShowcase from "@/components/lab/CreativeShowcase";
import ForecastPlayground from "@/components/lab/ForecastPlayground";
import ProductGallery from "@/components/lab/ProductGallery";
import SavingsCalculator from "@/components/lab/SavingsCalculator";
import type { Service, ServiceDemo as DemoKind } from "@/data/services";

/** The heading above each kind of demonstration. */
export const demoIntro: Record<DemoKind, { title: string; accent: string; text: string }> = {
  products: { title: "The kind of product", accent: "you would receive",
    text: "Three example screens: a booking website, a business workspace and a field app. Switch between them." },
  creative: { title: "One product,", accent: "three films",
    text: "The same example product told as a luxury commercial, a technical explainer and a short social ad." },
  agents: { title: "Watch an agent", accent: "do the work",
    text: "Pick a job. The agent works through it one step at a time, and stops where a person should decide." },
  workflows: { title: "Watch a workflow", accent: "run end to end",
    text: "Three processes, from the first trigger to the final record, with the approval points in view." },
  forecast: { title: "Change the assumptions,", accent: "watch the forecast",
    text: "Move the price, the marketing push or your capacity. The forecast answers as a range, not a single number." },
  marketing: { title: "Follow-up that", accent: "runs on time",
    text: "Watch a basket reminder and a sales enquiry handled from trigger to report, with consent checked first." },
  savings: { title: "Put your own numbers", accent: "to the test",
    text: "Every implementation starts with a value assessment. Try a simple one with a task from your own business." },
};

/** The live demonstration for a service: the part of the page that shows the work instead of describing it. */
export default function ServiceDemo({ service }: { service: Service }) {
  const cta = { href: "/book-a-call", label: service.cta };
  switch (service.demo) {
    case "products": return <ProductGallery />;
    case "creative": return <CreativeShowcase cta={cta} />;
    case "agents": return <AgentDemo scenarios={["service", "sales", "finance"]} label="Watch an agent at work" cta={cta} />;
    case "workflows": return <AgentDemo scenarios={["sales", "finance", "hotel"]} label="Watch a workflow run" cta={cta} />;
    case "marketing": return <AgentDemo scenarios={["marketing", "sales"]} label="Watch a follow-up run" cta={cta} />;
    case "forecast": return <ForecastPlayground cta={{ href: "/book-a-call", label: "Forecast my business" }} />;
    case "savings": return <SavingsCalculator />;
  }
}
