import styles from "./Editorial.styles";

export default function JumpLinks({ label, links, columns = 1 }: { label: string; links: { href: string; text: string }[]; columns?: 1 | 2 }) {
  return <nav className={styles.jumpList + (columns === 2 ? " " + styles.twoColumns : "")} aria-label={label}>
    {links.map(link => <a key={link.href} href={link.href}>
      <span>{link.text}</span><span aria-hidden="true">↘</span>
    </a>)}
  </nav>;
}

