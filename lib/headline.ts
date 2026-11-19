// Words a headline's closing words can start with, so the break falls at a natural pause.
const breakBefore = new Set(["to", "for", "in", "on", "of", "at", "and", "with", "behind", "before", "you’re", "you're", "your"]);

/**
 * Splits a headline into its lead and its closing words, which the home page style draws in
 * the brand blue: "Tell us what" + "you’re building". The closing words are at most about
 * half the headline and start at a natural pause when there is one.
 */
export function splitHeadline(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return { lead: title.trim(), accent: "" };
  const middle = words.length / 2;
  let best = 0;
  for (let index = Math.max(1, Math.ceil(middle) - 1); index < words.length; index++) {
    const natural = breakBefore.has(words[index].toLowerCase()) || /^[—–-]$/.test(words[index - 1]);
    if (natural && (!best || Math.abs(index - middle) < Math.abs(best - middle))) best = index;
  }
  const at = best || Math.ceil(middle);
  return { lead: words.slice(0, at).join(" "), accent: words.slice(at).join(" ") };
}
