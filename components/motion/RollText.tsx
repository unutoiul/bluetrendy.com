import type { CSSProperties } from "react";

/**
 * A button label whose letters roll upward on hover or keyboard focus, each a
 * moment after the last. Screen readers get the plain label.
 */
export default function RollText({ children }: { children: string }) {
  return (
    <span className="roll-text">
      <span className="sr-only">{children}</span>
      <span className="roll-text-letters" aria-hidden="true">
        {Array.from(children).map((letter, index) => (
          <span key={index} style={{ "--i": index } as CSSProperties}>{letter}</span>
        ))}
      </span>
    </span>
  );
}
