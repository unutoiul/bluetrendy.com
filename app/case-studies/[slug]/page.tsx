import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import PageHero from "@/components/PageHero";
import { caseStudies, getCaseStudy } from "@/data/caseStudies";
import styles from "@/components/interior/Work.styles";
import editorial from "@/components/interior/Editorial.styles";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, breadcrumbs, organizationRef, pageMetadata } from "@/lib/seo";

type CaseStudyPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  return pageMetadata({
    title: `${study.client} Case Study`,
    description: `${study.title}. ${study.summary}`,
    path: "/case-studies/" + study.slug,
    type: "article",
  });
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();
  const next = caseStudies[(caseStudies.indexOf(study) + 1) % caseStudies.length];
  const path = "/case-studies/" + study.slug;
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    name: `${study.client} case study`,
    description: study.summary,
    about: study.sector,
    keywords: study.stack.join(", "),
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    image: absoluteUrl("/opengraph-image"),
    author: organizationRef,
    publisher: organizationRef,
    inLanguage: "en-GB",
  };

  return <>
    <JsonLd data={[article, breadcrumbs([{ name: "Case studies", path: "/case-studies" }, { name: study.client, path }])]} />
    <PageHero eyebrow={study.sector} title={study.title} subtitle={study.summary}
      aside={<dl className={styles.facts}>
        <div><dt>Client</dt><dd>{study.client}</dd></div>
        <div><dt>Location</dt><dd>{study.location}</dd></div>
        <div><dt>Timeframe</dt><dd>{study.timeframe}</dd></div>
        <div><dt>Industry</dt><dd>{study.sector}</dd></div>
      </dl>} />
    <div className={editorial.width + " " + styles.readGrid}>
      <aside>
        <Link href="/case-studies">← All case studies</Link>
        <nav aria-label="In this case study">
          <a href="#challenge">The challenge</a><a href="#approach">The approach</a>
          <a href="#impact">The impact</a><a href="#technology">Technology</a>
        </nav>
      </aside>
      <div className={styles.story}>
        <section id="challenge"><h2>The challenge</h2><p>{study.challenge}</p></section>
        <section id="approach"><h2>The approach</h2><ul>{study.approach.map(point => <li key={point}>{point}</li>)}</ul></section>
        <section id="impact" className={styles.impact}><h2>The impact</h2><ul>{study.impact.map(point => <li key={point}>{point}</li>)}</ul></section>
        <section id="technology"><h2>Technology</h2><Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>{study.stack.map(tech => <Chip key={tech} label={tech} size="small" sx={{ bgcolor: "#edf3f7", color: "#3c5768" }} />)}</Stack></section>
        <nav aria-label="Next case study" className={editorial.nextProject}>
          <small>Next case study</small><Link href={"/case-studies/" + next.slug}>{next.client} <span aria-hidden="true">↗</span></Link>
        </nav>
      </div>
    </div>
  </>;
}
