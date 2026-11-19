import Box from "@mui/material/Box";
import Link from "next/link";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import ServicesChapter from "./ServicesChapter";
import { HomeArrivals } from "./PanelMotion";
import styles from "./Experience.styles";

const steps = [
  ["Tell us what you need", "We talk through the problem, who will use the solution and what to build first."],
  ["Try a working version", "You see the work as it takes shape and give feedback before launch."],
  ["Launch with support", "We test the release, help your team get started and hand over the tools to run it."],
];

export default function Experience() {
  return <Box id="home-content" data-experience tabIndex={-1} className={styles.experience}>
    <HomeArrivals />
    <Box className={styles.opening}>
      <Box component="section" id="discover" aria-labelledby="hero-heading" className={styles.frontScene}><Hero /></Box>
    </Box>
    <Box component="section" id="services" aria-labelledby="services-heading" className={styles.servicesScene}>
      <Box className={styles.scene}><ServicesChapter /></Box>
    </Box>
    <Box component="section" id="clients" aria-labelledby="clients-heading" className={styles.clients}>
      <Box id="work" className={styles.scene}><TrustStrip /></Box>
    </Box>
    <Box component="section" id="production" aria-labelledby="production-heading" className={styles.production}>
      <Box className={styles.scene}>
        <Box className={styles.chapterHeading}><h2 id="production-heading">How we work</h2></Box>
        <Box component="ol" sx={{ listStyle: "decimal-leading-zero", m: 0, pl: 3.5, display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: { xs: 3, md: 6 } }}>
          {steps.map(([title, text], index) => <Box component="li" key={title} data-arrive={index}
            sx={{ pl: 0.5, "&::marker": { color: "#8bc8e8", fontSize: ".85rem" } }}>
            <Box component="h3" sx={{ m: 0, fontSize: "1.25rem", color: "#eef5ff", fontWeight: 600 }}>{title}</Box>
            <Box component="p" sx={{ mt: 1, mb: 0, color: "#b4c7d7", lineHeight: 1.65 }}>{text}</Box>
          </Box>)}
        </Box>
        <Box sx={{ mt: 4, "& a": { color: "#a6d8f4", textUnderlineOffset: 4 } }}>
          <Link href="/process">See our delivery process</Link>
        </Box>
      </Box>
    </Box>
  </Box>;
}
