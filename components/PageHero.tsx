import type { ReactNode } from "react";
import SplitWords from "./motion/SplitWords";
import RibbonFilm from "./interior/RibbonFilm";
import styles from "./interior/Editorial.styles";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  aside?: ReactNode;
  children?: ReactNode;
};

export default function PageHero({ eyebrow, title, subtitle, aside, children }: PageHeroProps) {
  return <section className={styles.hero}>
    <div className={styles.heroGrid + " " + styles.heroSplit}>
      <div className={styles.heroCopy}>
        {eyebrow && <p className={styles.context}>{eyebrow}</p>}
        <h1 className="split split-now"><SplitWords text={title} /></h1>
        {subtitle && <p>{subtitle}</p>}
        {aside && <div className={styles.heroTools}>{aside}</div>}
      </div>
      <div className={styles.heroAside}><RibbonFilm /></div>
      {children && <div className={styles.heroAfter}>{children}</div>}
    </div>
  </section>;
}
