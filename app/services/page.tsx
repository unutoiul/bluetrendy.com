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
    <PageHero eyebrow="IT services" title="Software, systems & digital production"
      subtitle="We build the software your business runs on, connect the tools behind it and create the websites, apps and videos your customers see."
      aside={<nav aria-label="Browse by project goal" className={styles.stackHero}>
        <a href="#ai-native-web-apps">Build a digital product <span aria-hidden="true">↘</span></a>
        <a href="#it-implementation-and-integration">Connect your systems <span aria-hidden="true">↘</span></a>
        <a href="#marketing-video-production">Produce a campaign <span aria-hidden="true">↘</span></a>
      </nav>} />
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
                <ul aria-label="Tools and technologies" className={styles.stack}>{service.stack.map(tech => <li key={tech}>{tech}</li>)}</ul>
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
