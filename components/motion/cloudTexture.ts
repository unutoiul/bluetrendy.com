/**
 * Procedural cloud textures as SVG data URIs.
 *
 * Clouds are fractal noise, not artwork: feTurbulence gives the billowy
 * self-similar shape, and the colour matrix throws away the noise's colour
 * while keeping a biased copy of one channel as alpha — so dense cores stay
 * opaque and the edges wisp out.
 *
 * Two details matter:
 *
 * - Baking to a data URI. The browser rasterises the filter once; everything
 *   after that is a plain transform on a bitmap rather than a filter re-run on
 *   every frame.
 * - The radial fade. Turbulence fills its rect right to the edge, so an
 *   unmasked tile has four hard sides that become very visible straight lines
 *   once the layer is scaled up. Fading to zero well before the boundary
 *   leaves a puff with no edge to catch, at any zoom.
 */

export const TEXTURE_SIZE = 700;

type CloudOptions = {
  seed: number;
  /** Fill colour, 0–1 per channel. Irrelevant when the texture is used as an alpha mask. */
  rgb?: [number, number, number];
  /** Alpha offset. Less negative = denser, more solid cloud. */
  bias?: number;
  /** Gaussian softening, in texture pixels. */
  softness?: number;
  /** Size of the noise features. Lower = larger, calmer billows. */
  frequency?: number;
  /** Where the radial fade starts biting, 0–1. Higher = fills more of the tile. */
  spread?: number;
};

export function cloudTexture({
  seed,
  rgb = [1, 1, 1],
  bias = -0.4,
  softness = 5,
  frequency = 0.0075,
  spread = 0.7,
}: CloudOptions) {
  const [r, g, b] = rgb;
  const mid = Math.round(spread * 54);
  const outer = Math.round(spread * 100);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TEXTURE_SIZE}" height="${TEXTURE_SIZE}">
<defs>
<radialGradient id="f" cx="50%" cy="50%" r="50%">
<stop offset="0%" stop-color="#fff" stop-opacity="1"/>
<stop offset="${mid}%" stop-color="#fff" stop-opacity="0.92"/>
<stop offset="${outer}%" stop-color="#fff" stop-opacity="0.4"/>
<stop offset="100%" stop-color="#fff" stop-opacity="0"/>
</radialGradient>
<mask id="m"><rect width="100%" height="100%" fill="url(#f)"/></mask>
<filter id="c" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="6" seed="${seed}" stitchTiles="stitch"/>
<feColorMatrix type="matrix" values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 1 0 0 0 ${bias}"/>
<feComponentTransfer><feFuncA type="gamma" exponent="1.9" amplitude="1.5"/></feComponentTransfer>
<feGaussianBlur stdDeviation="${softness}"/>
</filter>
</defs>
<g mask="url(#m)"><rect width="100%" height="100%" filter="url(#c)"/></g>
</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
