import Box from "@mui/material/Box";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import CTASection from "@/components/CTASection";
import OutcomesChapter from "./OutcomesChapter";
import ServicesChapter from "./ServicesChapter";
import OpportunityChapter from "./OpportunityChapter";
import AdvantageChapter from "./AdvantageChapter";
import ProcessChapter from "./ProcessChapter";
import AgentsChapter from "./AgentsChapter";
import { HomeArrivals } from "./PanelMotion";
import { neural } from "./neuralStyle";
import styles from "./Experience.styles";
import { palette } from "@/theme/palette";

// Content sits above the background canvas.
const above = { position: "relative", zIndex: 1 } as const;

// The page tells one story from the top down: the promise, the four outcomes, the seven
// services, the clients behind them, AI at work, the visitor's own opportunity, the
// numbers, how we deliver, and the call.
//
// Each chapter has its own living background, and each one answers the mouse: synapses fire
// in the hero, ribbons of light bend behind the outcomes and services, ripples run through
// the client wall, packets flow to the pointer in "Watch AI run a business", a
// constellation gathers behind the scanner, and streaks of light part in "How we work".
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
    <Box component="section" id="services" aria-labelledby="services-heading" sx={neural.sectionTone("hero", "services")}>
      <LivingBackground effect="ribbons" seed={11} />
      <Box className={styles.scene} sx={{ ...above, pb: "clamp(80px, 9vw, 140px) !important" }}>
        <Box id="outcomes" sx={{ scrollMarginTop: 96, mb: { xs: 7, md: 11 } }}><OutcomesChapter /></Box>
        <ServicesChapter />
      </Box>
    </Box>
    <Box component="section" id="clients" aria-labelledby="clients-heading"
      sx={{ position: "relative", isolation: "isolate", bgcolor: palette.white, color: palette.navy[725], containerType: "inline-size", overflow: "clip" }}>
      <LivingBackground effect="dotField" light seed={17} />
      <Box id="work" className={styles.frontScene} sx={{ ...above, scrollMarginTop: 76 }}><TrustStrip /></Box>
    </Box>
    <Box id="ai-agents" sx={{ scrollMarginTop: 76 }}><AgentsChapter /></Box>
    <Box component="section" id="opportunities" aria-labelledby="opportunities-heading" sx={neural.sectionTone("agents", "services")}>
      <LivingBackground effect="constellation" quiet="top" seed={37} />
      <Box className={styles.scene} sx={{ ...above, pb: "clamp(72px, 8vw, 120px) !important" }}><OpportunityChapter /></Box>
    </Box>
    <Box id="advantage" sx={{ scrollMarginTop: 76 }}><AdvantageChapter /></Box>
    <Box component="section" id="production" aria-labelledby="production-heading" sx={neural.sectionTone("services", "footer")}>
      <LivingBackground effect="streaks" quiet="top" seed={41} />
      <Box className={styles.scene} sx={{ ...above, pb: "clamp(80px, 9vw, 140px) !important" }}><ProcessChapter /></Box>
    </Box>
    <CTASection location="home_closing" title="Ready to put AI to work?"
      subtitle="You don’t need another presentation about what AI might do. You need a practical plan for what it can do for your business. Book a free 30-minute AI Opportunity Call."
      primaryLabel="Find my AI opportunities" secondaryLabel="Send us a brief" />
  </Box>;
}
