"use client";

import Box from "@mui/material/Box";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import HeroVisual from "./experience/HeroVisual";
import HeroMessages from "./experience/HeroMessages";
import LinkButton from "./LinkButton";
import page from "./experience/Experience.styles";
import styles from "./Hero.styles";
import { trackEvent } from "@/lib/analytics";

export default function Hero() {
  return (
    <Box className={styles.hero}>
      <Box className={styles.copy}>
        <HeroMessages />
        <Box className={page.actions} data-arrive="2">
          <LinkButton href="/book-a-call" variant="contained" size="large" endIcon={<ArrowForwardRounded />}
            onClick={() => trackEvent("cta_book_call_click", { location: "hero" })}>Discover your AI opportunities</LinkButton>
          <LinkButton href="#services" variant="outlined" tone="dark" size="large">Explore our solutions</LinkButton>
        </Box>
      </Box>
      <HeroVisual />
    </Box>
  );
}
