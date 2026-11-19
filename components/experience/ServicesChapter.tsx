"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { services } from "@/data/services";
import { ShowcaseGlyph } from "./ShowcaseGlyph";
import { ArchitectureFlow, DetailSurface, ShowcaseChoice } from "./ShowcaseInteraction";
import styles from "./Showcase.styles";

const featured = services.flatMap(service => service.preview ? [{ ...service, preview: service.preview }] : []);

export default function ServicesChapter() {
  const [selected, setSelected] = useState<number | null>(null);
  function close(index: number) {
    setSelected(null);
    document.getElementById("service-choice-" + index)?.focus({ preventScroll: true });
  }
  return (
    <>
    <div className={`${styles.sectionTools} ${styles.serviceHeading}`}>
      <h2 id="services-heading">IT services</h2>
      <Link href="/services" prefetch={false}>View all services<ArrowForwardRounded /></Link>
    </div>
    <div className={styles.serviceGrid} role="group" aria-label="Choose a service">
      {featured.map((service, index) => {
        const open = selected === index;
        const { preview } = service;
        return (
          <Fragment key={service.slug}>
            <ShowcaseChoice id={"service-choice-" + index} index={index} className={styles.serviceCard}
              featured={index === 0 && selected === null} expanded={open} controls="service-detail"
              onChoose={() => setSelected(open ? null : index)}>
              <span className={styles.cardTop}><ShowcaseGlyph kind={preview.icon} /><ArrowForwardRounded className={styles.arrow} /></span>
              <strong>{service.name}</strong><span className={styles.description}>{service.shortDescription}</span>
            </ShowcaseChoice>
            {open && <DetailSurface id="service-detail" label={service.name}>
              <button type="button" className={styles.close} onClick={() => close(index)} aria-label="Close service details"><CloseRounded /></button>
              <div className={styles.detailCopy}><h3>{preview.heading}</h3><p>{service.description}</p>
                <div className={styles.links}>
                  <Link href={"/services#" + service.slug} prefetch={false}>Service details<ArrowForwardRounded /></Link>
                  {preview.related && <Link href={"/services#" + preview.related.slug} prefetch={false}>{preview.related.label}<ArrowForwardRounded /></Link>}
                  {preview.icon === "film"
                    ? <Link href="/contact" prefetch={false}>Discuss a video brief<ArrowForwardRounded /></Link>
                    : <a href="#ai-lab">Estimate a project<ArrowForwardRounded /></a>}
                </div>
              </div>
              <ArchitectureFlow nodes={preview.steps.map(([step]) => step)} notes={preview.steps.map(([, note]) => note)} label={`${service.name} delivery steps`} />
            </DetailSurface>}
          </Fragment>
        );
      })}
    </div>
    </>
  );
}
