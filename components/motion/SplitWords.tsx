import { Fragment, type CSSProperties } from "react";

type SplitWordsProps = {
  text: string;
  /** Index of the first word, so a second run continues the stagger of the first. */
  offset?: number;
  /** Extra class for each word, e.g. a gradient that has to sit on the word itself. */
  wordClassName?: string;
};

/**
 * Wraps each word in a span carrying its position as --i, for the word animations
 * in globals.css. Put it inside an element with the `split` class plus `split-now`
 * (plays on load) or `split-on-arrive` (plays when a home page chapter scrolls in).
 */
export default function SplitWords({ text, offset = 0, wordClassName }: SplitWordsProps) {
  const words = text.split(/(\s+)/);
  let index = offset;
  return words.map((part, position) => {
    if (!part) return null;
    if (/^\s+$/.test(part)) return <Fragment key={position}>{part}</Fragment>;
    const style = { "--i": index++ } as CSSProperties;
    return <span key={position} className={wordClassName ? `w ${wordClassName}` : "w"} style={style}>{part}</span>;
  });
}

export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
