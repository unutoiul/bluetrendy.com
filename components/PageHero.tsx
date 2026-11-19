import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import HeadingMotion from "./motion/HeadingMotion";
import RibbonFilm from "./interior/RibbonFilm";
import PageBackdrop from "./interior/PageBackdrop";
import styles from "./interior/Editorial.styles";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  aside?: ReactNode;
  children?: ReactNode;
};

export default function PageHero({ eyebrow, title, subtitle, aside, children }: PageHeroProps) {
  return <Box component="section" className={styles.hero} sx={{ overflow: "clip", isolation: "isolate" }}>
    <PageBackdrop />
    <Box className={styles.heroGrid + " " + styles.heroSplit} sx={{ position: "relative", zIndex: 1 }}>
      <div className={styles.heroCopy}>
        {eyebrow && <p className={styles.context}>{eyebrow}</p>}
        <HeadingMotion component="h1" text={title} immediate />
        {subtitle && <p>{subtitle}</p>}
        {aside && <div className={styles.heroTools}>{aside}</div>}
      </div>
      <div className={styles.heroAside}><RibbonFilm /></div>
      {children && <div className={styles.heroAfter}>{children}</div>}
    </Box>
  </Box>;
}
