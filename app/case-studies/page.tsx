import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CaseStudyIndex from "@/components/interior/CaseStudyIndex";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import editorial from "@/components/interior/Editorial.styles";
import styles from "@/components/interior/Work.styles";
import JsonLd from "@/components/JsonLd";
import { caseStudies } from "@/data/caseStudies";
import { absoluteUrl, breadcrumbs, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Case Studies: Finance, Healthcare & Defence Software",
  description: "Six production software projects in finance, healthcare, defence, travel, manufacturing and enterprise software, with the engineering decisions and results.",
  path: "/case-studies",
});

const studyList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "BlueTrendy case studies",
  itemListElement: caseStudies.map((study, index) => ({
    "@type": "ListItem", position: index + 1, name: study.client, url: absoluteUrl("/case-studies/" + study.slug),
  })),
};

export default function CaseStudiesPage() {
  return <>
    <JsonLd data={[studyList, breadcrumbs([{ name: "Case studies", path: "/case-studies" }])]} />
    <PageHero eyebrow="Case studies" title="Software at work in six industries"
      subtitle="Inside the trading desks, reading rooms and production lines where teams use our software. Explore the engineering decisions and outcomes for each client." />
    <section className={styles.directory} aria-label="All case studies">
      {/* The same lattice of dots on springs as the booking and contact pages. */}
      <LivingBackground effect="springGrid" light quiet="none" seed={113} />
      <div className={editorial.width}><CaseStudyIndex /></div>
    </section>
  </>;
}
