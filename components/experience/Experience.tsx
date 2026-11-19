import Box from "@mui/material/Box";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import ServicesChapter from "./ServicesChapter";
import ProcessChapter from "./ProcessChapter";
import AgentsChapter from "./AgentsChapter";
import { HomeArrivals } from "./PanelMotion";
import { neural, type HomeBlue } from "./neuralStyle";
import styles from "./Experience.styles";

// Content sits above the background canvas.
const above = { position: "relative", zIndex: 1 } as const;

// A dark chapter on the home page's running blue gradient.
const blueSection = (from: HomeBlue, to: HomeBlue) =>
  ({ position: "relative", overflow: "hidden", isolation: "isolate", color: "#eef6ff", background: neural.blueFlow(from, to) }) as const;

// Each chapter has its own living background, and each one answers the mouse:
// synapses fire in the hero, ribbons of light bend in "What we do", ripples run through
// the client wall, packets flow to the pointer in "AI agents", and streaks of light part
// around it in "How we work".
export default function Experience() {
  return <Box id="home-content" data-experience tabIndex={-1} className={styles.experience}>
    <HomeArrivals />
    <Box className={styles.opening}>
      <LivingBackground effect="synapses" quiet="right" seed={5} />
      {/* No z-index here: it would make a stacking context, and Safari then blends the brain
          video against an empty layer instead of this background, leaving a black box.
          Coming after the canvas in the markup already keeps the hero on top. */}
      <Box component="section" id="discover" aria-labelledby="hero-heading" className={styles.frontScene} sx={{ position: "relative" }}><Hero /></Box>
    </Box>
    <Box component="section" id="services" aria-labelledby="services-heading" sx={blueSection("hero", "services")}>
      <LivingBackground effect="ribbons" seed={11} />
      <Box className={styles.scene} sx={{ ...above, pb: "clamp(80px, 9vw, 140px) !important" }}><ServicesChapter /></Box>
    </Box>
    <Box component="section" id="clients" aria-labelledby="clients-heading"
      sx={{ position: "relative", isolation: "isolate", bgcolor: "#fff", color: "#102c47", containerType: "inline-size", overflow: "clip" }}>
      <LivingBackground effect="dotField" light seed={17} />
      <Box id="work" className={styles.frontScene} sx={{ ...above, scrollMarginTop: 76 }}><TrustStrip /></Box>
    </Box>
    <Box id="ai-agents" sx={{ scrollMarginTop: 76 }}><AgentsChapter /></Box>
    <Box component="section" id="production" aria-labelledby="production-heading" sx={blueSection("agents", "footer")}>
      <LivingBackground effect="streaks" quiet="top" seed={41} />
      <Box className={styles.scene} sx={{ ...above, pb: "clamp(80px, 9vw, 140px) !important" }}><ProcessChapter /></Box>
    </Box>
  </Box>;
}
