/* eslint-disable @next/next/no-img-element -- ImageResponse rasterizes these elements into a static PNG. */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { palette } from "@/theme/palette";
import { promise, tagline } from "@/lib/seo";

export const alt = `BlueTrendy Intelligence. ${tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const brandDir = join(process.cwd(), "public", "brand");
  const [logo, network] = await Promise.all([
    readFile(join(brandDir, "logo-inverse.svg"), "base64"),
    readFile(join(brandDir, "neural-strands.svg"), "base64"),
  ]);

  return new ImageResponse(
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      justifyContent: "space-between", padding: "62px 70px", position: "relative",
      background: `linear-gradient(115deg, ${palette.navy[850]} 2%, ${palette.navy[750]} 100%)`, color: palette.grey[25],
    }}>
      <img alt="" src={`data:image/svg+xml;base64,${network}`} width={800} height={480}
        style={{ position: "absolute", right: -185, bottom: -44, opacity: 0.55, objectFit: "contain" }} />
      <img alt="BlueTrendy Intelligence" src={`data:image/svg+xml;base64,${logo}`} width={320} height={78} />
      <div style={{ display: "flex", flexDirection: "column", fontSize: 66, fontWeight: 700, letterSpacing: -3, lineHeight: 1.12 }}>
        <span>We don’t just build AI.</span>
        <span style={{ color: palette.sky[100] }}>We make AI work for your business.</span>
      </div>
      <div style={{ display: "flex", fontSize: 26, color: palette.slate[125], maxWidth: 780 }}>
        {promise}
      </div>
    </div>,
    size,
  );
}
