import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import ServiceIndex from "@/components/interior/ServiceIndex";
import ServiceScene from "@/components/interior/ServiceScene";
import styles from "@/components/interior/Services.styles";
import { services } from "@/data/services";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, breadcrumbs, organizationRef, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Software, Websites, Apps & AI Services",
  description: "Custom software, websites and online shops, iOS and Android apps, IT integration, AI automation and marketing videos, built by a senior London team.",
  path: "/services",
});

// Every service on the page, offered by the organisation described in the layout.
const serviceList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "BlueTrendy services",
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      "@id": absoluteUrl("/services#" + service.slug),
      url: absoluteUrl("/services#" + service.slug),
      name: service.name,
      serviceType: service.name,
      description: service.shortDescription + " " + service.description,
      provider: organizationRef,
      areaServed: { "@type": "Country", name: "United Kingdom" },
    },
  })),
};

export default function ServicesPage() {
  return <>
    <JsonLd data={[serviceList, breadcrumbs([{ name: "Services", path: "/services" }])]} />
    <PageHero eyebrow="Services" title="What can we build for you?"
      subtitle="Choose a service to see what you’ll get. We build websites, apps and business software, connect IT systems and produce marketing videos." />
    <div className={styles.catalogue}>
      {/* A calmer take on the spring lattice from the case study, contact and booking pages. */}
      <LivingBackground effect="softGrid" light pinned quiet="none" seed={113} />
      <div className={styles.layout}>
        <ServiceIndex items={services.map(({ slug, name }) => ({ slug, name }))} />
        <div className={styles.chapters}>
          {services.map(service => <section className={styles.chapter} key={service.slug}
            aria-labelledby={service.slug + "-heading"} id={service.slug} data-service={service.slug} tabIndex={-1}>
            <div className={styles.cover}>
              <h2 id={service.slug + "-heading"}>{service.name}</h2>
              <p>{service.shortDescription}</p>
            </div>
            <ServiceScene slug={service.slug} />
            <div className={styles.body}>
              <div className={styles.summary}>
                <p>{service.description}</p>
                <h3 id={service.slug + "-tools"}>Tools we use</h3>
                <ul aria-labelledby={service.slug + "-tools"} className={styles.stack}>{service.stack.map(tech => <li key={tech}>{tech}</li>)}</ul>
              </div>
              <div>
                <h3>What we deliver</h3>
                <ul className={styles.deliverables}>{service.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
                <Link className={styles.briefLink} href="/book-a-call" aria-label={"Book a call about " + service.name}>
                  Book a call about this service <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </section>)}
        </div>
      </div>
    </div>
  </>;
}
