import type { SxProps, Theme } from "@mui/material/styles";
import { palette, withAlpha } from "./palette";

/**
 * The secondary button on a dark surface, beside a blue contained one: see-through with light
 * text, lit with the same navy as the home page's dark actions on hover. A hairline keeps it as
 * easy to spot as its partner (a cookie banner's Reject must be as visible as Accept). It is
 * drawn with an inset shadow, so the button stays exactly the size of the contained one.
 */
export const outlinedOnDark: SxProps<Theme> = {
  color: palette.slate[50],
  backgroundColor: "transparent",
  boxShadow: `inset 0 0 0 1px ${withAlpha(palette.blue[200], 0.42)}`,
  "&:hover": { backgroundColor: palette.navy[700], boxShadow: `inset 0 0 0 1px ${withAlpha(palette.blue[200], 0.62)}` },
  "&.Mui-disabled": { color: withAlpha(palette.slate[50], 0.4), boxShadow: `inset 0 0 0 1px ${withAlpha(palette.blue[200], 0.2)}` },
};

/**
 * The secondary button on a light surface: the theme's pale pill, plus a blue hairline so it
 * still reads as a button on pale-blue panels the same colour as its fill.
 */
export const outlinedOnLight: SxProps<Theme> = {
  boxShadow: `inset 0 0 0 1px ${withAlpha(palette.blue[500], 0.2)}`,
  "&:hover": { backgroundColor: withAlpha(palette.blue[300], 0.12), boxShadow: `inset 0 0 0 1px ${withAlpha(palette.blue[500], 0.36)}` },
};

/** Puts the surface's outlined style in front of a caller's own `sx`. */
export function withTone(tone: "light" | "dark", variant: string | undefined, sx?: SxProps<Theme>): SxProps<Theme> {
  const own = Array.isArray(sx) ? sx : sx ? [sx] : [];
  if (variant !== "outlined") return own;
  return [tone === "dark" ? outlinedOnDark : outlinedOnLight, ...own];
}
