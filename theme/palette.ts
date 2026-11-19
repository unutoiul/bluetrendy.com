/**
 * Every colour on the site, in one place. Components use these tokens instead of hex values:
 * `palette.blue[500]`, or `withAlpha(palette.blue[500], 0.4)` for a see-through version.
 * Shades run from 25 (lightest) to 975 (darkest). The MUI theme in theme/theme.ts is built from them,
 * and the email templates use them too, so the site and its emails always match.
 */
export const palette = {
  white: "#ffffff",
  black: "#000000",
  navy: {
    600: "#0d408c",
    625: "#174c57",
    650: "#19466f",
    675: "#0f3266",
    700: "#1d3552",
    725: "#0c2b45",
    750: "#0c2942",
    775: "#081e35",
    800: "#091b2d",
    850: "#030d1f",
    // The background the entrance film is painted on. Anything shown around the film must match it.
    900: "#000628",
  },
  blue: {
    200: "#8fc2ee",
    250: "#3fb8ff",
    300: "#3fa8ff",
    325: "#569cde",
    350: "#288cff",
    400: "#3f86bd",
    425: "#2879df",
    450: "#1e6eff",
    475: "#226bb5",
    500: "#165fcc",
    550: "#135899",
  },
  sky: {
    100: "#a3ebff",
    150: "#6fdcff",
    175: "#8bd6ff",
  },
  cyan: {
    25: "#e6ffff",
    50: "#d3ffff",
    75: "#c7f9ff",
    100: "#a5faff",
    125: "#89faff",
    150: "#7fffe5",
    225: "#5fd0b8",
    300: "#2bb3a3",
    425: "#1f8a7e",
    725: "#0d2f2c",
  },
  slate: {
    50: "#e2f4ff",
    75: "#bef0ff",
    100: "#d7e9f8",
    125: "#ccd9e5",
    150: "#d9e2ec",
    200: "#b3c0c3",
    275: "#8fa9c0",
    375: "#7a8da1",
    475: "#577085",
    525: "#455e71",
  },
  grey: {
    25: "#f1f6fc",
    75: "#e3ecea",
  },
  green: {
    50: "#e2f5ec",
    100: "#a9f3db",
    175: "#62e0b0",
    275: "#28c840",
    300: "#2fbf8a",
    375: "#1f9d6f",
    500: "#127453",
    575: "#0f5c48",
  },
  amber: {
    25: "#fffbe0",
    50: "#fcf0d9",
    75: "#efe4d2",
    100: "#fff0c9",
    150: "#d6cdbd",
    175: "#f5c46a",
    300: "#d68c14",
    400: "#b06d08",
    475: "#94560a",
    550: "#6b4f22",
    600: "#564327",
    700: "#3d2800",
    775: "#2a1a00",
  },
  red: {
    225: "#f59a8f",
    275: "#ff6b8a",
    300: "#ff5a5f",
    400: "#d6453d",
    550: "#9e2422",
  },
  violet: {
    50: "#efe8fb",
    300: "#9b93f5",
    350: "#8f78ec",
    500: "#6a3fbf",
    625: "#3a3470",
  },
} as const;

/** The brand's named colours, used across the site and by the MUI theme. */
export const brand = {
  navy: palette.navy[725],
  navyDark: palette.navy[775],
  navyMid: palette.navy[650],
  blue: palette.blue[500],
  blueLight: palette.sky[175],
  mist: palette.grey[25],
  ink: palette.navy[750],
  slate: palette.slate[525],
  border: palette.slate[125],
} as const;

/** A colour with transparency: `withAlpha(palette.navy[725], 0.5)` → "rgba(12, 43, 69, 0.5)". */
export function withAlpha(hex: string, opacity: number) {
  const value = parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${opacity})`;
}
