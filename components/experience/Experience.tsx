import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Hero, { StudioProof } from "@/components/Hero";
import ServicesChapter from "./ServicesChapter";
import ProductionChapter from "./ProductionChapter";
import TrustStrip from "@/components/TrustStrip";
import IdeaLab from "./IdeaLab";
import { HomeArrivals } from "./PanelMotion";
import SplitWords from "../motion/SplitWords";
import styles from "./Experience.styles";

export default function Experience() {
  return (
    <Box id="home-content" data-experience tabIndex={-1} className={styles.experience}>
      <HomeArrivals />
      <Box className={styles.opening}>
        <Box component="section" id="discover" aria-labelledby="hero-heading" className={styles.frontScene}>
          <Hero />
        </Box>
        <Box component="section" id="services" aria-labelledby="services-heading" className={styles.servicesScene}>
          <ServicesChapter />
          <StudioProof />
        </Box>
      </Box>
      <Box component="section" id="production" aria-labelledby="production-heading" className={styles.production}>
        <Box className={styles.scene}>
          <Box data-arrive="0" className={styles.chapterHeading}>
            <Typography component="h2" id="production-heading" className="split split-on-arrive">
              <SplitWords text="From Prompt to" /> <SplitWords text="Production" offset={3} wordClassName={styles.accentWord} />
            </Typography>
            <Typography component="p">Build faster with AI and engineering discipline. Turn ideas into reliable software that’s ready for production.</Typography>
          </Box>
          <ProductionChapter />
        </Box>
      </Box>
      <Box component="section" id="clients" aria-labelledby="clients-heading" className={styles.clients}>
        <Box id="work" className={styles.scene}>
          <TrustStrip />
        </Box>
      </Box>
      <Box component="section" id="ai-lab" aria-labelledby="lab-heading" className={styles.lab}>
        <Box className={styles.scene}>
          <Box data-arrive="0" className={`${styles.chapterHeading} ${styles.labHeading}`}>
            <Typography component="h2" id="lab-heading" className="split split-on-arrive">
              <SplitWords text="AI Idea Lab" />{" "}
              <span className={styles.accentLine}><SplitWords text="Intelligent Project Estimator" offset={3} wordClassName={styles.accentWord} /></span>
            </Typography>
            <Typography component="p">Turn an idea into a plan with a recommended stack, a proposed architecture, and an indicative estimate.</Typography>
          </Box>
          <IdeaLab />
        </Box>
      </Box>
      <Box component="footer" className={styles.end}>
        <Box className={styles.endInner} data-arrive="0">
          <a href="#discover" className={styles.backToTop}>Back to top ↑</a>
          <nav aria-label="Footer navigation">
            <a href="#services">Services</a>
            <a href="#production">Production</a>
            <Link href="/#clients">Clients</Link>
            <a href="#ai-lab">AI Idea Lab</a>
            <Link href="/about" prefetch={false}>About</Link>
            <Link href="/contact" prefetch={false}>Contact</Link>
          </nav>
          <nav aria-label="Legal">
            <Link href="/legal/privacy" prefetch={false}>Privacy</Link>
            <Link href="/legal/terms" prefetch={false}>Terms</Link>
          </nav>
        </Box>
      </Box>
    </Box>
  );
}
