import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./Work.styles";
import editorial from "./Editorial.styles";

type PolicySection = { id: string; title: string; body: ReactNode };
export default function PolicyArticle({ sections, related }: { sections: PolicySection[]; related: { href: string; title: string } }) {
  return <div className={editorial.width + " " + styles.readGrid}>
    <aside><nav aria-label="Policy contents">{sections.map(section => <a key={section.id} href={"#" + section.id}>{section.title}</a>)}</nav></aside>
    <article className={styles.story}>{sections.map(section => <section id={section.id} key={section.id}>
      <h2>{section.title}</h2>{section.body}
    </section>)}<div className={editorial.nextProject}><Link href={related.href}>{related.title}</Link></div></article>
  </div>;
}

