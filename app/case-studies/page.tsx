import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CaseStudyIndex from "@/components/interior/CaseStudyIndex";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import editorial from "@/components/interior/Editorial.styles";
import styles from "@/components/interior/Work.styles";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Six production engagements spanning financial services, healthcare, defence, travel, manufacturing and enterprise software.",
};

export default function CaseStudiesPage() {
  return <>
    <PageHero eyebrow="Case studies" title="Software at work in six industries"
      subtitle="Inside the trading desks, reading rooms and production lines where teams use our software. Explore the engineering decisions and outcomes for each client." />
    <section className={styles.directory} aria-label="All case studies">
      {/* The same lattice of dots on springs as the booking and contact pages. */}
      <LivingBackground effect="springGrid" light quiet="none" seed={113} />
      <div className={editorial.width}><CaseStudyIndex /></div>
    </section>
  </>;
}
