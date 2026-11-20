import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import FAQAccordion from "@/components/FAQAccordion";
import CTASection from "@/components/CTASection";
import { processSteps, processFaqs } from "@/data/process";
import JumpLinks from "@/components/interior/JumpLinks";
import EngagementModels from "@/components/interior/EngagementModels";
import styles from "@/components/interior/Editorial.styles";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, faqPage, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "How We Work: Discover, Design, Build, Launch",
  description: "How BlueTrendy projects run: a free AI Opportunity Call, a fixed-price AI Implementation Blueprint, weekly builds, then launch, monitoring and improvement.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <JsonLd data={[faqPage(processFaqs), breadcrumbs([{ name: "Process", path: "/process" }])]} />
      <PageHero
        eyebrow="Process"
        title="From the first call to AI in daily use"
        aside={<JumpLinks label="Explore the delivery process" links={[
          { text: "Delivery milestones", href: "#delivery" },
          { text: "Ways to work together", href: "#engagement-models" },
          { text: "Common questions", href: "#process-questions" },
        ]} />}
        subtitle="Discover, design, build, then launch and improve. Each stage ends with something you can check, and gives you the chance to decide what comes next."
      />

      <Container className={styles.anchor} id="delivery" sx={{ py: { xs: 5, md: 9 } }}>
        <ol className={styles.roadmap} aria-label="Delivery milestones">
          {processSteps.map((step) => (
            <li key={step.step}>
              <span aria-hidden="true" className={styles.milestone}>{step.step}</span>
              <div><h2>{step.title}</h2><small>{step.duration}</small></div>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>

      <EngagementModels id="engagement-models" />

      <Container className={styles.anchor} id="process-questions" sx={{ py: { xs: 6, md: 9 } }}>
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SectionHeading eyebrow="FAQ" title="Common questions" align="left" maxWidth={400} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <FAQAccordion items={processFaqs} />
          </Grid>
        </Grid>
      </Container>

      <CTASection location="process_page" title="Talk through your first milestone" subtitle="Bring a workflow, a deadline or a system you need to replace. We’ll use the call to find the first project worth doing."
        primaryLabel="Find my AI opportunities" />
    </>
  );
}
