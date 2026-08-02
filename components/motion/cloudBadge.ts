/**
 * A puffy, cloud-like silhouette for the header's logo badge — flat where it
 * meets the header bar, bumpy where it hangs down into the hero sky.
 *
 * The bottom edge is built from overlapping circles pushed through the
 * classic "goo" filter (blur, then a steep alpha threshold) so they read as
 * one merged, rounded blob instead of a row of visible dots — the same trick
 * behind most CSS "liquid" / metaball effects.
 *
 * Two things that aren't obvious until you render it:
 *
 * - The flat top piece must stop exactly at `barHeight` — pad it even a
 *   little further down "for safety" and you get a plain rectangle exposed
 *   below the header's real bottom edge, which reads as a hard straight line
 *   flanking the puffy fringe instead of blending into it.
 * - A circle centred exactly on the canvas's left or right edge gets clipped
 *   through its own diameter, and a diameter is a straight line — so the
 *   outermost bumps are inset from the edges on purpose, letting the canvas
 *   boundary cut a curved chord instead of a straight tangent.
 */

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const round = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

type CloudBadgeOptions = {
  /** Badge width in px — the mask is baked to this exact size, not tiled. */
  width: number;
  /** Height of the flat portion that sits behind the header bar. */
  barHeight: number;
  /** How far the puffy portion hangs below the bar. */
  dropHeight: number;
  seed?: number;
};

export function cloudBadgeMask({ width, barHeight, dropHeight, seed = 1 }: CloudBadgeOptions) {
  const totalHeight = barHeight + dropHeight;
  const bumps = Math.max(6, Math.round(width / 46));
  const blur = Math.max(6, dropHeight * 0.16);

  // How far the flat strip's own bottom corners round off before handing
  // over to the bump silhouette, and how far the outermost bumps sit in from
  // the canvas edges — see the file comment for why both matter.
  const cornerR = clamp(dropHeight * 0.42, 14, 30);
  const margin = cornerR * 0.85;

  const circles = Array.from({ length: bumps }).map((_, i) => {
    const t = i / (bumps - 1);
    const cx = margin + t * (width - 2 * margin);

    const jitterA = seededRandom(seed * 12.7 + i * 3.3);
    const jitterB = seededRandom(seed * 5.1 + i * 7.9);

    // Deepest at the centre, shallow at the edges — an irregular echo of the
    // smooth arc the old border-radius badge used.
    const depth = clamp(0.3 + 0.6 * Math.sin(Math.PI * t) + (jitterA - 0.5) * 0.16, 0.16, 1);
    const bottomY = barHeight + dropHeight * depth;

    // Radius is derived from depth rather than randomised on its own — that's
    // what guarantees every bump's top half reaches back up past barHeight
    // regardless of how deep or shallow it hangs, so there is always overlap
    // into the flat strip and never a gap the blur has to bridge alone.
    const rFactor = 1.25 + jitterB * 0.35;
    const r = dropHeight * depth * 0.5 * rFactor;
    const cy = bottomY - r;

    return `<circle cx="${round(cx)}" cy="${round(cy)}" r="${round(r)}"/>`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}">
<defs>
<filter id="g" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
<feGaussianBlur in="SourceGraphic" stdDeviation="${round(blur)}" result="b"/>
<feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11"/>
</filter>
</defs>
<path d="M 0 0 H ${round(width)} V ${round(barHeight - cornerR)} Q ${round(width)} ${round(barHeight)} ${round(width - cornerR)} ${round(barHeight)} H ${round(cornerR)} Q 0 ${round(barHeight)} 0 ${round(barHeight - cornerR)} Z" fill="#fff"/>
<g fill="#fff" filter="url(#g)">
${circles.join("\n")}
</g>
</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
