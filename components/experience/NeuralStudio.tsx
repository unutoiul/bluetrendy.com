"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AutorenewRounded from "@mui/icons-material/AutorenewRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import { animate, motion, useInView, useMotionValue, useReducedMotion } from "motion/react";
import GlobalStyles from "@mui/material/GlobalStyles";
import styles, { neuralStudioSheet } from "./NeuralStudio.styles";

const effects = [
  { id: "pulse", name: "Node Pulse", detail: "Highlights a connection as information moves through it." },
  { id: "ripple", name: "Ripple Expand", detail: "Expands from the point where a visitor makes a selection." },
  { id: "sweep", name: "Energy Sweep", detail: "Traces progress across a panel as its content becomes ready." },
  { id: "edge", name: "Edge Energize", detail: "Lights the outline of a card when it becomes active." },
] as const;

type Effect = typeof effects[number]["id"];

function Diagram({ effect }: { effect: Effect }) {
  return (
    <svg viewBox="0 0 144 68" aria-hidden="true" className={styles.diagram}>
      {effect === "pulse" && <g>
        <path d="M39 48 72 20l33 28M39 48h66" className={styles.dimLine} />
        <circle cx="39" cy="48" r="3" className={styles.node} />
        <circle cx="105" cy="48" r="3" className={styles.node} />
        <circle cx="72" cy="20" r="4" className={styles.node} />
        <circle cx="72" cy="20" r="9" className={styles.pulse} />
      </g>}
      {effect === "ripple" && <g>
        <ellipse cx="72" cy="34" rx="40" ry="19" className={styles.dimLine}/>
        <ellipse cx="72" cy="34" rx="29" ry="13" className={styles.ripple}/>
        <ellipse cx="72" cy="34" rx="17" ry="7" className={styles.ripple}/>
      </g>}
      {effect === "sweep" && <g>
        <path d="M27 51 107 18m-75 40 83-36M27 43l66-29" className={styles.dimLine}/>
        <path d="M27 51 107 18" pathLength="100" className={styles.sweep}/>
        <circle cx="107" cy="18" r="3" className={styles.node} />
      </g>}
      {effect === "edge" && <g>
        <rect x="37" y="12" width="70" height="44" rx="11" className={styles.dimLine} />
        <rect x="37" y="12" width="70" height="44" rx="11" pathLength="100" className={styles.trace} />
      </g>}
    </svg>
  );
}

const layers = [-8, -6, -4, -2, 0, 2, 4, 6, 8];

export default function NeuralStudio() {
  const [preview, setPreview] = useState<{ effect: Effect; play: number }>({ effect: "pulse", play: 0 });
  const [confirmed, setConfirmed] = useState(false);
  const [turning, setTurning] = useState(false);
  const section = useRef<HTMLDivElement>(null);
  const isVisible = useInView(section, { once: true, amount: 0.26 });
  const reduced = useReducedMotion();
  const rotation = useMotionValue(-16);
  const spin = useRef<ReturnType<typeof animate> | null>(null);
  const hasTurned = useRef(false);

  useEffect(() => {
    if (!isVisible || reduced || hasTurned.current) return;
    hasTurned.current = true;
    spin.current = animate(rotation, 344, { duration: 2.1, ease: [0.34, 0, 0.22, 1] });
    return () => spin.current?.stop();
  }, [isVisible, reduced, rotation]);

  function spinLogo() {
    spin.current?.stop();
    if (reduced) {
      rotation.set(rotation.get() + 45);
      return;
    }
    setTurning(true);
    const motion = animate(rotation, rotation.get() + 360, { duration: 1.5, ease: [0.34, 0, 0.22, 1] });
    spin.current = motion;
    void motion.then(() => { if (spin.current === motion) setTurning(false); });
  }

  function stopSpin() {
    spin.current?.stop();
    spin.current = null;
    setTurning(false);
  }

  return (
    <Box className={styles.layout} ref={section}>
      <GlobalStyles styles={neuralStudioSheet} />
      <div className={styles.sculpture} data-arrive="0">
        <motion.div className={styles.stage} aria-hidden="true" onPanStart={stopSpin}
          onPan={(_, info) => rotation.set(rotation.get() + info.delta.x * 1.12)}>
          <div className={styles.floor} />
          <div className={styles.perspective}>
            <motion.div className={styles.ribbon} style={{ rotateY: rotation }}>
              {layers.map(depth => (
                <span key={depth} data-face={Math.abs(depth) === 8 || undefined}
                  style={{ transform: `translateZ(${depth}px)${depth === -8 ? " rotateY(180deg) scaleX(-1)" : ""}` }} />
              ))}
            </motion.div>
          </div>
        </motion.div>
        <div className={styles.stageControls}>
          <div><h3>BlueTrendy in 3D</h3><p>Drag the ribbon to see it from any angle.</p></div>
          <Button variant="outlined" startIcon={<AutorenewRounded />} onClick={turning ? stopSpin : spinLogo}>
            {turning ? "Stop spin" : "Spin logo"}
          </Button>
        </div>
      </div>
      <div className={styles.effectPanel} data-arrive="1">
        <h3>Motion system</h3>
        <div className={styles.tiles}>
          {effects.map(effect => {
            const active = preview.effect === effect.id;
            return (
              <motion.button type="button" className={styles.tile} key={effect.id} aria-pressed={active}
                whileHover={reduced ? undefined : { y: -3 }} whileTap={reduced ? undefined : { scale: .96 }}
                onClick={() => { setConfirmed(false); setPreview(current => ({ effect: effect.id, play: current.play + 1 })); }}>
                <Diagram key={active ? preview.play : "still"} effect={effect.id} />
                <span>{effect.name}</span>
              </motion.button>
            );
          })}
        </div>
        <p className={styles.effectDescription} aria-live="polite">
          {effects.find(effect => effect.id === preview.effect)?.detail}
        </p>
        <div className={styles.ctaDemo}>
          <div><h3>Electric button states</h3><p>Try focus, press, and confirmation.</p></div>
          <motion.button type="button" className={styles.demoButton} data-confirmed={confirmed || undefined}
            whileHover={reduced ? undefined : { y: -2 }} whileTap={reduced ? undefined : { scale: .94 }}
            onClick={() => {
              setConfirmed(true);
              setPreview(current => ({ ...current, play: current.play + 1 }));
            }}>
            {confirmed ? "Run preview again" : "Run preview"}
            {confirmed ? <CheckRounded /> : <ArrowForwardRounded />}
          </motion.button>
          <span className={styles.status} role="status">{confirmed ? "Preview played." : ""}</span>
        </div>
      </div>
    </Box>
  );
}
