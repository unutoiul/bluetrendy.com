import type { CSSProperties, ReactNode } from "react";
import Box from "@mui/material/Box";
import SplitWords, { countWords } from "./motion/SplitWords";
import RibbonFilm from "./interior/RibbonFilm";
import PageBackdrop from "./interior/PageBackdrop";
import styles from "./interior/Editorial.styles";
import { palette } from "@/theme/palette";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  aside?: ReactNode;
  children?: ReactNode;
};

// Words a headline's second line can start with, so it breaks at a natural pause.
const breakBefore = new Set(["to", "for", "in", "on", "of", "at", "and", "with", "behind", "before", "you’re", "you're", "your"]);

/** Splits a headline into its lead and the closing words, like the two lines of the home page headline. */
function splitHeadline(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return { lead: title, accent: "" };
  const middle = words.length / 2;
  let best = 0;
  words.forEach((word, index) => {
    if (index === 0) return;
    const natural = breakBefore.has(word.toLowerCase()) || /^[—–-]$/.test(words[index - 1]);
    if (natural && (!best || Math.abs(index - middle) < Math.abs(best - middle))) best = index;
  });
  const at = best || Math.ceil(middle);
  return { lead: words.slice(0, at).join(" "), accent: words.slice(at).join(" ") };
}

/**
 * The banner at the top of every inner page. Its headline arrives the way the home page
 * headline does (the split-text and accent-beam rules in globalStyles): the words flip up out
 * of a blur, a beam of light writes the closing line, and the subtitle drifts in after them.
 */
export default function PageHero({ eyebrow, title, subtitle, aside, children }: PageHeroProps) {
  const { lead, accent } = splitHeadline(title);
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
