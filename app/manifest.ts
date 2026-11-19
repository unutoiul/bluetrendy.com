import type { MetadataRoute } from "next";
import { siteDescription, siteName } from "@/lib/seo";
import { palette } from "@/theme/palette";

// The name, colours and icon browsers and phones use when someone saves the site.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: "BlueTrendy",
    description: siteDescription,
    start_url: "/",
    display: "browser",
    background_color: palette.navy[850],
    theme_color: palette.navy[850],
    icons: [
      { src: "/icon.png", sizes: "128x128", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
