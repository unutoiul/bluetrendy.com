import type { CSSObject } from "@mui/material/styles";
import { palette, withAlpha } from "./palette";

// One look for every dropdown list on the site: the select menus (through the MUI theme)
// and the plain-HTML service index on mobile. The values mirror `brand` in theme.ts.

const checkMark = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 16.17 5.53 12.7a.996.996 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41a.996.996 0 0 0-1.41 0z'/%3E%3C/svg%3E") center / contain no-repeat`;

export const listSurface: CSSObject = {
  backgroundColor: palette.white,
  border: `1px solid ${withAlpha(palette.navy[725], 0.1)}`,
  borderRadius: 12,
  boxShadow: `0 1px 2px ${withAlpha(palette.navy[725], 0.06)}, 0 18px 40px -16px ${withAlpha(palette.navy[725], 0.34)}`,
  overscrollBehavior: "contain",
};

export const listPadding = 6;

export const listOption: CSSObject = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: 16,
  boxSizing: "border-box",
  minHeight: 40,
  // The right padding keeps a column free for the check mark.
  padding: "8px 36px 8px 12px",
  borderRadius: 8,
  color: palette.navy[750],
  fontSize: "0.92rem",
  fontWeight: 450,
  lineHeight: 1.35,
  textDecoration: "none",
  transition: "background-color 0.15s ease, color 0.15s ease",
};

export const listOptionActive: CSSObject = { backgroundColor: palette.grey[25] };

// The highlight already marks the keyboard position, so the page-wide focus ring is drawn inside the row.
export const listOptionFocus: CSSObject = { outline: `2px solid ${withAlpha(palette.blue[425], 0.55)}`, outlineOffset: -2, animation: "none" };

export const listOptionSelected: CSSObject = {
  backgroundColor: withAlpha(palette.blue[500], 0.08),
  color: palette.blue[500],
  fontWeight: 600,
};

export const listOptionSelectedActive: CSSObject = { backgroundColor: withAlpha(palette.blue[500], 0.13) };

/** The check mark beside the chosen option, drawn as an ::after pseudo-element. */
export const listCheck: CSSObject = {
  content: '""',
  position: "absolute",
  top: "50%",
  right: 10,
  width: 18,
  height: 18,
  marginTop: -9,
  backgroundColor: "currentColor",
  WebkitMask: checkMark,
  mask: checkMark,
};

/** A hairline under an option that stands apart from the rest, such as "All industries". */
export const listSeparator: CSSObject = {
  content: '""',
  position: "absolute",
  left: 8,
  right: 8,
  bottom: -5,
  height: 1,
  backgroundColor: palette.slate[150],
  pointerEvents: "none",
};
