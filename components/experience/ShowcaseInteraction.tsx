import type { ReactNode } from "react";
import { useState } from "react";
import ButtonBase from "@mui/material/ButtonBase";
import { motion, useReducedMotion } from "motion/react";
import { usePanelTilt } from "./PanelMotion";
import styles from "./Showcase.styles";

const MotionButton = motion.create(ButtonBase);
const spring = { type: "spring", stiffness: 390, damping: 29 } as const;

export function ShowcaseChoice({ children, className, id, expanded, controls, featured, index, onChoose }: {
  children: ReactNode; className: string; id: string; expanded: boolean; controls: string;
  featured?: boolean; index: number; onChoose: () => void;
}) {
  const reduced = useReducedMotion();
  const tilt = usePanelTilt();
  return (
    <MotionButton {...tilt} type="button" id={id} className={className} aria-expanded={expanded} data-arrive={index}
      aria-controls={expanded ? controls : undefined} data-featured={featured || undefined}
      whileHover={reduced ? undefined : { y: -4 }} whileTap={reduced ? undefined : { scale: .975 }}
      transition={spring} onClick={onChoose}>
      <span aria-hidden="true" className={styles.energy} />{children}
    </MotionButton>
  );
}

export function DetailSurface({ children, id, label }: { children: ReactNode; id: string; label: string }) {
  const reduced = useReducedMotion();
  return <motion.article className={styles.detail} id={id} aria-label={label}
    initial={reduced ? false : { opacity: .2, y: -6 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: reduced ? 0 : .22 }}>{children}</motion.article>;
}

export function ArchitectureFlow({ nodes, notes, label }: {
  nodes: readonly string[]; notes: readonly string[]; label: string;
}) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  return (
    <div className={styles.diagram}>
      <ol className={styles.nodeFlow} aria-label={label}>
        {nodes.map((node, index) => <li key={node}>
          <button type="button" aria-pressed={active === index} onClick={() => setActive(index)}>
            <motion.span aria-hidden="true" animate={{ scale: active === index && !reduced ? [1, 1.35, 1] : 1 }}
              transition={{ duration: reduced ? 0 : .35 }} />{node}
          </button>
        </li>)}
      </ol>
      <div aria-live="polite"><motion.p key={nodes[active]} initial={reduced ? false : { opacity: .4, x: 4 }}
        animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : .18 }}>{notes[active]}</motion.p></div>
    </div>
  );
}
