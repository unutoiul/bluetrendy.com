"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import PlayArrowOutlined from "@mui/icons-material/PlayArrowOutlined";
import BoltRounded from "@mui/icons-material/BoltRounded";
import LayersOutlined from "@mui/icons-material/LayersOutlined";
import MemoryOutlined from "@mui/icons-material/MemoryOutlined";
import CheckRounded from "@mui/icons-material/CheckRounded";
import { caseStudies } from "@/data/caseStudies";
import HeroVisual from "./experience/HeroVisual";
import HeroMessages from "./experience/HeroMessages";
import RollText from "./motion/RollText";
import page from "./experience/Experience.styles";
import styles from "./Hero.styles";

const benefits = [
  { label: "Live in days", detail: "Your first website or app release", Icon: BoltRounded },
  { label: "Custom-built", detail: "Around how your business works", Icon: LayersOutlined },
  { label: "AI-first by design", detail: "From the brief to production", Icon: MemoryOutlined },
];

const caseStudyYears = caseStudies.map(study => Number(study.timeframe.match(/\d{4}/)?.[0])).sort((a, b) => a - b);
const firstYear = caseStudyYears[0];
const lastYear = caseStudyYears[caseStudyYears.length - 1];
const points = Array.from({ length: lastYear - firstYear + 1 }, (_, offset) => {
  const count = caseStudyYears.filter(year => year <= firstYear + offset).length;
  return [6 + 168 * offset / (lastYear - firstYear), 67 - 59 * count / caseStudies.length];
});
const line = points.map(([x, y]) => `${x},${y}`).join(" ");

export function StudioProof() {
  return (
    <Box className={styles.proof} aria-label="BlueTrendy’s experience and delivery">
      <Link href="/case-studies" prefetch={false} className={styles.stat} data-arrive="0">
        <div><h3>Published work</h3><strong>{caseStudies.length} case studies</strong><p>Across six industries</p></div>
        <svg viewBox="0 0 180 72" aria-hidden="true" className={styles.chart}>
          <defs><linearGradient id="published-work" x2="0" y2="1"><stop stopColor="#29b7ff" stopOpacity=".62"/><stop offset="1" stopColor="#1269e7" stopOpacity="0"/></linearGradient></defs>
          <polygon points={`6,70 ${line} 174,70`} fill="url(#published-work)" />
          <polyline points={line} pathLength="1" fill="none" stroke="#6ce9ff" strokeWidth="1.9" />
          {points.map(([x, y]) => <circle key={x} cx={x} cy={y} r="2" fill="#ddfbff"/>)}
        </svg>
      </Link>
      <Link href="/about" prefetch={false} className={styles.stat} data-arrive="1">
        <div><h3>Engineering experience</h3><strong>15+ years</strong><p>Shipping production software</p></div>
        <span aria-hidden="true" className={styles.ring}><MemoryOutlined /></span>
      </Link>
      <a href="#production" className={`${styles.stat} ${styles.delivery}`} data-arrive="2">
        <div><h3>From build to launch</h3><div className={styles.bars} aria-hidden="true">
          {[1, 2, 3, 4, 5, 6, 7].map(n => <span key={n}
            style={{ height: `${n * 9 + 10}%`, "--bar-delay": `${n * 45}ms` } as CSSProperties} />)}
        </div></div>
        <ul>{["Senior-led delivery", "Integrated testing", "Cloud deployment"].map(label => <li key={label}><CheckRounded />{label}</li>)}</ul>
      </a>
    </Box>
  );
}

export default function Hero() {
  return (
    <Box className={styles.hero}>
      <Box className={styles.copy}>
        <HeroMessages />
        <Box className={page.actions} data-arrive="2">
          <span className={styles.electric}>
            <svg viewBox="0 0 280 72" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 40l17-1 8-6 14 4 12-5M251 33l12 7 10-4 7 2M23 22l16 2 11-12 22 4 22-10 29 7 15-9 19 12 24-8 14 5 27-2 16 10 18-2M23 49l16-4 15 11 23-5 15 12 20-7 23 10 20-5 18 5 14-7 22 4 17-11 18 4 17-9M59 55l4 9 14 5M175 64l7 5 16-4M217 13l10-7 17 2M44 20l-5-9-18-5" />
            </svg>
            <Button component={Link} href="/contact" className={page.primary} endIcon={<ArrowForwardRounded />}><RollText>Start a project</RollText></Button>
          </span>
          <Button href="#production" className={page.secondary} startIcon={<PlayArrowOutlined />}><RollText>See How We Work</RollText></Button>
        </Box>
      </Box>
      <HeroVisual />
      <ul className={styles.benefits}>
        {benefits.map(({ label, detail, Icon }, index) => (
          <li key={label} data-arrive={index + 2}><Icon aria-hidden="true" /><div><strong>{label}</strong><span>{detail}</span></div></li>
        ))}
      </ul>
    </Box>
  );
}
