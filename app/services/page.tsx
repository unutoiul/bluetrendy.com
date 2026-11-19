import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ServiceIndex from "@/components/interior/ServiceIndex";
import ServiceScene from "@/components/interior/ServiceScene";
import styles from "@/components/interior/Services.styles";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "IT Services & Digital Production",
  description: "Custom software, websites, mobile apps, IT implementation, systems integration, AI automation and marketing video production from BlueTrendy.",
};

export default function ServicesPage() {
  return <>
    <PageHero eyebrow="IT services" title="What can we build for you?"
      subtitle="Choose a service to see what you’ll get. We build websites, apps and business software, connect IT systems and produce marketing videos." />
    <div className={styles.catalogue}>
      <div className={styles.layout}>
        <ServiceIndex items={services.map(({ slug, name }) => ({ slug, name }))} />
        <div className={styles.chapters}>
          {services.map(service => <section className={styles.chapter} key={service.slug}
            aria-labelledby={service.slug + "-heading"} id={service.slug} data-service={service.slug} tabIndex={-1}>
            <div className={styles.cover}>
              <div className={styles.coverCopy}><h2 id={service.slug + "-heading"}>{service.name}</h2><p>{service.shortDescription}</p></div>
              <ServiceScene slug={service.slug} />
            </div>
            <div className={styles.body}>
              <p>{service.description}</p>
              <h3>What we deliver</h3>
              <ul className={styles.deliverables}>{service.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
              <div className={styles.meta}>
                <details><summary>Tools we use</summary>
                  <ul aria-label="Tools and technologies" className={styles.stack}>{service.stack.map(tech => <li key={tech}>{tech}</li>)}</ul>
                </details>
                <Link className={styles.briefLink} href={"/contact?service=" + service.slug + "#project-brief"} aria-label={"Start a project brief for " + service.name}>
                  Start a project brief <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </section>)}
        </div>
      </div>
    </div>
  </>;
}
