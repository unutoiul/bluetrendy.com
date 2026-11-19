import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CaseStudyCard from "@/components/CaseStudyCard";
import JumpLinks from "@/components/interior/JumpLinks";
import { caseStudies } from "@/data/caseStudies";
import editorial from "@/components/interior/Editorial.styles";
import styles from "@/components/interior/Work.styles";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Six production engagements spanning financial services, healthcare, defence, travel, manufacturing and enterprise software.",
};

export default function CaseStudiesPage() {
  return <>
    <PageHero eyebrow="Case studies" title="Software at work in six industries"
      subtitle="Inside the trading desks, reading rooms and production lines where teams use our software. Explore the engineering decisions and outcomes for each client."
      aside={<JumpLinks label="Jump to a project by industry" columns={2}
        links={caseStudies.map(study => ({ text: study.sector, href: "#" + study.slug }))} />} />
    <div className={editorial.width + " " + styles.directory}>{caseStudies.map(study => <CaseStudyCard key={study.slug} caseStudy={study} />)}</div>
  </>;
}
