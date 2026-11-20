// Builds the logo tiles for the client wall: npm run client-tiles
//
// Each source logo in public/brand/clients is trimmed to its artwork, scaled so every logo covers
// about the same area, and centred on a white plate saved as public/brand/clients/tiles/<name>.png.
//
// The plate is part of the image on purpose. Browsers with a forced dark mode (Samsung Internet
// does this whenever the phone is in dark theme, and ignores the color-scheme opt-out) darken
// page backgrounds but leave images alone, so a CSS background behind a logo turns dark while
// HSBC's or Lloyds' black lettering stays black. A plate baked into the image keeps every logo
// on white whatever the browser does to the page.
//
// sharp ships with Next.js, so this needs no extra install.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { clientLogos, tileName } from "../data/clients";

const sourceDir = path.join(process.cwd(), "public/brand/clients");
const tileDir = path.join(sourceDir, "tiles");

// Tile canvas (5:3, drawn at about 3.5x its largest on-screen size) and the box the artwork must stay inside.
const width = 600;
const height = 360;
const maxArtWidth = 450;
const maxArtHeight = 185;
// Square logos come out about 170px tall; wide wordmarks get longer and shorter so both look equally heavy.
const artArea = 170 * 170;
const white = { r: 255, g: 255, b: 255, alpha: 1 };

async function trimmedArtwork(file: string) {
  // Flatten onto white so transparent and white-backed files trim the same way.
  const vector = file.endsWith(".svg");
  const flat = await sharp(path.join(sourceDir, file), { density: vector ? 300 : 72, limitInputPixels: false })
    .flatten({ background: white })
    .toBuffer();
  return sharp(flat).trim({ background: "#ffffff", threshold: 12 }).toBuffer({ resolveWithObject: true });
}

function artSize(ratio: number) {
  let h = Math.sqrt(artArea / ratio);
  let w = h * ratio;
  const fit = Math.min(1, maxArtWidth / w, maxArtHeight / h);
  w *= fit; h *= fit;
  return { w: Math.round(w), h: Math.round(h) };
}

async function main() {
  await mkdir(tileDir, { recursive: true });
  for (const { file, name } of clientLogos) {
    if (!file) continue;
    const { data, info } = await trimmedArtwork(file);
    const { w, h } = artSize(info.width / info.height);
    const art = await sharp(data).resize(w, h, { fit: "inside", kernel: "lanczos3" }).toBuffer();
    await sharp({ create: { width, height, channels: 3, background: white } })
      .composite([{ input: art, gravity: "centre" }])
      .png({ compressionLevel: 9 })
      .toFile(path.join(tileDir, `${tileName(file)}.png`));
    console.log(`${name.padEnd(26)} -> ${w}x${h}`);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
