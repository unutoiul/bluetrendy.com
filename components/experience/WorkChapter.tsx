"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import ShowChartRounded from "@mui/icons-material/ShowChartRounded";
import MedicalServicesOutlined from "@mui/icons-material/MedicalServicesOutlined";
import LayersOutlined from "@mui/icons-material/LayersOutlined";
import HubOutlined from "@mui/icons-material/HubOutlined";
import { ArchitectureFlow, DetailSurface, ShowcaseChoice } from "./ShowcaseInteraction";
import styles from "./Showcase.styles";

const projects = [
  {
    label: "Blue Bridge", art: "pricing", detail: "Wealth management", Icon: ShowChartRounded, slug: "blue-bridge-asset-management",
    client: "Blue Bridge Asset Management", title: "A live structured-products desk",
    story: [
      "Pricing a structured product meant waiting for an issuer to respond. The desk coordinated quotes and execution by hand.",
      "Bloomberg market data feeds event-driven pricing services. A secure execution workflow validates each order and records issuer confirmation.",
      "Private clients can price and execute structured products in real time. The desk can trace an order through the transaction lifecycle.",
    ],
    nodes: ["Market data", "Pricing services", "Trade execution"],    notes: ["Bloomberg feeds stream current bid, ask, and yield data.", "Event-driven services normalize instruments and calculate valuations.", "Each order is validated and its issuer confirmation recorded."],
  },
  {
    label: "BCG × Bayer", art: "imaging", detail: "Medical imaging", Icon: MedicalServicesOutlined, slug: "bcg-bayer-medical-imaging",
    client: "Boston Consulting Group × Bayer", title: "A shared reading room for radiologists",
    story: [
      "Radiologists in different countries needed to upload, inspect, and discuss complex imaging cases while protecting patient data.",
      "A React workspace and Java services support DICOM image sharing on Azure. AI-assisted image analysis helps reviewers identify patterns.",
      "Radiologists across different locations can securely review the same scans, compare findings, and discuss a diagnostic case together.",
    ],
    nodes: ["DICOM studies", "Secure workspace", "Clinical review"],    notes: ["Radiologists upload imaging studies in DICOM format.", "A React workspace and Java services support secure sharing on Azure.", "Specialists compare findings and discuss a case with AI-assisted analysis."],
  },
  {
    label: "NATO NCI Agency", art: "geospatial", detail: "Geospatial analysis", Icon: LayersOutlined, slug: "nato-nci-agency-arcgis",
    client: "NATO Communications and Information Agency", title: "A map across multiple data sources",
    story: [
      "Analysts needed a consistent map of layered geographic data. Rendering large datasets together introduced delays.",
      "Azure data pipelines normalize incoming datasets. Spatial indexes and cached ArcGIS layers keep map queries responsive.",
      "Analysts can view and update multiple layers reliably. Automated tests check the geographic transformations used throughout the platform.",
    ],
    nodes: ["Source datasets", "Indexed layers", "Interactive map"],    notes: ["Azure Data Lake pipelines ingest and normalize source data.", "ArcGIS feature layers use spatial indexing and caching.", "The map combines geographic layers for viewing and analysis."],
  },
] as const;

const perspectives = ["Before", "Architecture", "Outcome"] as const;

export default function WorkChapter() {
  const [selected, setSelected] = useState<number | null>(null);
  const [perspective, setPerspective] = useState(0);
  const reduced = useReducedMotion();
  function toggle(index: number) {
    setPerspective(0);
    setSelected(selected === index ? null : index);
  }
  return (
    <>
      <div className={styles.sectionTools}>
        <Link href="/case-studies" prefetch={false}>View all case studies<ArrowForwardRounded /></Link>
      </div>
      <div className={styles.workGrid} role="group" aria-label="Choose a case study">
        {projects.map((project, index) => {
          const open = selected === index;
          return (
            <Fragment key={project.slug}>
              <ShowcaseChoice id={"case-choice-" + index} index={index} className={styles.workCard}
                expanded={open} controls="case-detail" onChoose={() => toggle(index)}>
                <span aria-hidden="true" className={styles.art}><Image src={`/brand/case-${project.art}.webp`} alt="" fill unoptimized loading="lazy" /></span>
                <span className={styles.sector}><project.Icon />{project.detail}</span>
                <span className={styles.workBottom}><span><strong>{project.title}</strong><small>{project.client}</small></span><i><ArrowForwardRounded /></i></span>
              </ShowcaseChoice>
              {open && <DetailSurface id="case-detail" label={project.client}>
                <button type="button" className={styles.close} aria-label="Close case study details" onClick={() => {
                  setSelected(null);
                  document.getElementById("case-choice-" + index)?.focus({ preventScroll: true });
                }}><CloseRounded /></button>
                <div className={styles.detailCopy}><h3>{project.label}</h3>
                  <div role="group" aria-label="Case study perspective" className={styles.tabs}>
                    {perspectives.map((name, i) => <button key={name} type="button" aria-pressed={perspective === i} onClick={() => setPerspective(i)}>{name}</button>)}
                  </div>
                  <div aria-live="polite"><motion.p key={perspective} className={styles.workStory}
                    initial={reduced ? false : { opacity: .4, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .18 }}>
                    {project.story[perspective]}
                  </motion.p></div>
                  <div className={styles.links}><Link href={"/case-studies/" + project.slug} prefetch={false}>Read the case study<ArrowForwardRounded /></Link></div>
                </div>
                <div><span className={styles.technicalTitle}><HubOutlined />System architecture</span>
                  <ArchitectureFlow nodes={project.nodes} notes={project.notes} label="System overview" />
                </div>
              </DetailSurface>}
            </Fragment>
          );
        })}
      </div>
    </>
  );
}
