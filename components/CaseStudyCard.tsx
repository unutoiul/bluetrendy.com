import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/data/caseStudies";
import { clientLogos } from "@/data/clients";
import styles from "./interior/Work.styles";

export default function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const href = "/case-studies/" + caseStudy.slug;
  const logo = clientLogos.find(client => client.href === href && client.file)?.file;
  return <article id={caseStudy.slug}>
    <Link href={href} className={styles.card}>
      <div aria-hidden="true" className={styles.mark + (logo ? "" : " " + styles.priceMark)}>
        {logo && <Image src={"/brand/clients/" + logo} alt="" width={150} height={56} />}
      </div>
      <div><p className={styles.meta}>{caseStudy.sector}</p><h2>{caseStudy.client}</h2><p>{caseStudy.title}</p></div>
      <span className={styles.arrow} aria-hidden="true">↗</span>
    </Link>
  </article>;
}
