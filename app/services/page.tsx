import type { Metadata } from "next";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import LinkButton from "@/components/LinkButton";
import PageHero from "@/components/PageHero";
import HeadingMotion from "@/components/motion/HeadingMotion";
import { splitHeadline } from "@/lib/headline";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import ServiceIndex from "@/components/interior/ServiceIndex";
import ServiceScene from "@/components/interior/ServiceScene";
import CTASection from "@/components/CTASection";
import styles from "@/components/interior/Services.styles";
import { services } from "@/data/services";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, breadcrumbs, organizationRef, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI Services: Agents, Automation, Apps, Video & Forecasting",
  description: "Seven AI services from a senior London team: websites and apps, a creative and video studio, AI agents, business automation, predictive AI, marketing automation and AI implementation.",
  path: "/services",
});

// Every service, each with its own page, offered by the organisation described in the layout.
const serviceList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "BlueTrendy services",
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      "@id": absoluteUrl("/" + service.slug) + "#service",
      url: absoluteUrl("/" + service.slug),
      name: service.name,
      serviceType: service.name,
      description: service.shortDescription + " " + service.value,
      provider: organizationRef,
      areaServed: { "@type": "Country", name: "United Kingdom" },
    },
  })),
};

export default function ServicesPage() {
  return <>
    <JsonLd data={[serviceList, breadcrumbs([{ name: "Services", path: "/services" }])]} />
    <PageHero eyebrow="Services" title="Seven ways to put AI to work"
      subtitle="Each service starts from a result your business needs: more revenue, lower costs, faster delivery or better decisions. Choose one to see what you’ll get." />
    <div className={styles.catalogue}>
      {/* A calmer take on the spring lattice from the case study, contact and booking pages. */}
      <LivingBackground effect="softGrid" light pinned quiet="none" seed={113} />
      <div className={styles.layout}>
        <ServiceIndex items={services.map(({ slug, shortName }) => ({ slug, name: shortName }))} />
        <div className={styles.chapters}>
          {services.map(service => <section className={styles.chapter} key={service.slug}
            aria-labelledby={service.slug + "-heading"} id={service.slug} data-service={service.slug} tabIndex={-1}>
            <div className={styles.cover}>
              <HeadingMotion id={service.slug + "-heading"} text={splitHeadline(service.name).lead}
                accent={splitHeadline(service.name).accent} tone="light" />
              <p>{service.shortDescription}</p>
            </div>
            <ServiceScene scene={service.scene} />
            <div className={styles.body}>
              {/* The business result leads; the detail and the tools live on the service's own page. */}
              <div className={styles.summary}>
                <p className={styles.value}>{service.value}</p>
                <p>{service.description}</p>
                <h3>What we measure</h3>
                <ul className={styles.stack}>{service.measures.map(measure => <li key={measure}>{measure}</li>)}</ul>
              </div>
              <div>
                <h3>{service.listTitle}</h3>
                <ul className={styles.deliverables}>{service.bullets.slice(0, 6).map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
                <LinkButton href={"/" + service.slug} variant="contained" endIcon={<ArrowForwardRounded />}
                  aria-label={"Explore " + service.name}>
                  Explore this service
                </LinkButton>
              </div>
            </div>
          </section>)}
        </div>
      </div>
    </div>
    <CTASection location="services_page" title="Not sure which service fits?"
      subtitle="Most projects touch more than one. Book a free 30-minute AI Opportunity Call and we’ll work out where to start."
      primaryLabel="Find my AI opportunities" />
  </>;
}
