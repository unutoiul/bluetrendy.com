import type { CSSProperties, ReactNode } from "react";
import Box from "@mui/material/Box";
import SplitWords, { countWords } from "./motion/SplitWords";
import RibbonFilm from "./interior/RibbonFilm";
import PageBackdrop from "./interior/PageBackdrop";
import styles from "./interior/Editorial.styles";
import { palette } from "@/theme/palette";
import { splitHeadline } from "@/lib/headline";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  /** The headline's closing words, drawn in blue. Left out, the title is split at a natural pause. */
  accent?: string;
  subtitle?: string;
  aside?: ReactNode;
  children?: ReactNode;
};

/**
 * The banner at the top of every inner page. Its headline arrives the way the home page
 * headline does (the split-text and accent-beam rules in globalStyles): the words flip up out
 * of a blur, a beam of light writes the closing line, and the subtitle drifts in after them.
 */
export default function PageHero({ eyebrow, title, accent: closing, subtitle, aside, children }: PageHeroProps) {
  const { lead, accent } = closing ? { lead: title, accent: closing } : splitHeadline(title);
  return <Box component="section" className={styles.hero} sx={{ overflow: "clip", isolation: "isolate" }}>
    <PageBackdrop />
    <Box className={styles.heroGrid + " " + styles.heroSplit} sx={{ position: "relative" }}>
      <div className={styles.heroCopy}>
        {eyebrow && <p className={styles.context}>{eyebrow}</p>}
        <Box component="h1" className="split msg" data-state="in"
          sx={{ "& .msg-accent": { display: "block", color: palette.blue[200] } }}>
          <SplitWords text={lead} />
          {accent && <>
            {" "}
            <span className="msg-accent" style={{ "--split-delay": `${countWords(lead) * 70 + 170}ms` } as CSSProperties}>{accent}</span>
          </>}
        </Box>
        {subtitle && <p className="split msg msg-body" data-state="in"><SplitWords text={subtitle} /></p>}
        {aside && <div className={styles.heroTools}>{aside}</div>}
      </div>
      <div className={styles.heroAside}><RibbonFilm /></div>
      {children && <div className={styles.heroAfter}>{children}</div>}
    </Box>
  </Box>;
}
