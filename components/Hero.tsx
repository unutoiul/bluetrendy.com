"use client";

import Box from "@mui/material/Box";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import HeroVisual from "./experience/HeroVisual";
import HeroMessages from "./experience/HeroMessages";
import LinkButton from "./LinkButton";
import page from "./experience/Experience.styles";
import styles from "./Hero.styles";

export default function Hero() {
  return (
    <Box className={styles.hero}>
      <Box className={styles.copy}>
        <HeroMessages />
        <Box className={page.actions} data-arrive="2">
          <LinkButton href="/book-a-call" variant="contained" size="large" endIcon={<ArrowForwardRounded />}>Start a project</LinkButton>
          <LinkButton href="#services" variant="outlined" tone="dark" size="large">Explore services</LinkButton>
        </Box>
      </Box>
      <HeroVisual />
    </Box>
  );
}
