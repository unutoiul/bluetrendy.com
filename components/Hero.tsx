"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import HeroVisual from "./experience/HeroVisual";
import HeroMessages from "./experience/HeroMessages";
import RollText from "./motion/RollText";
import page from "./experience/Experience.styles";
import styles from "./Hero.styles";

export default function Hero() {
  return (
    <Box className={styles.hero}>
      <Box className={styles.copy}>
        <HeroMessages />
        <Box className={page.actions} data-arrive="2">
          <Button component={Link} href="/book-a-call" className={page.primary} endIcon={<ArrowForwardRounded />}><RollText>Start a project</RollText></Button>
          <Button href="#services" className={page.secondary}><RollText>Explore services</RollText></Button>
        </Box>
      </Box>
      <HeroVisual />
    </Box>
  );
}
