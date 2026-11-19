import type { CSSObject } from "@mui/material/styles";
import { palette } from "@/theme/palette";

// Class names used in the markup. The list itself is styled through MuiMenu in theme.ts.
const styles = {
  pill: "Dropdown__pill",
  hint: "Dropdown__hint",
} as const;

export default styles;

const pill = ".Dropdown__pill.MuiInputBase-root";

export const dropdownSheet: CSSObject[] = [
  { [pill]: {
      maxWidth: "100%",
      minWidth: 0,
      borderRadius: 22,
      color: palette.navy[700],
      backgroundColor: palette.grey[25],
      fontSize: ".9rem",
      fontWeight: 550,
      transition: "background-color .2s ease",
    } },
  { [`${pill}:hover, ${pill}:has([aria-expanded='true'])`]: { backgroundColor: palette.grey[75] } },
  // The value fills the whole pill, so a click anywhere on it opens the list.
  { [`${pill} .MuiSelect-select.MuiInputBase-input`]: {
      height: "auto",
      minHeight: 0,
      padding: "11px 40px 11px 16px",
      borderRadius: "inherit",
      lineHeight: "22px",
    } },
  // The focus ring traces the pill rather than the value inside it.
  { [`${pill} .MuiSelect-select:focus-visible`]: { outline: "none" } },
  { [`${pill}:has(.MuiSelect-select:focus-visible)`]: {
      outline: `3px solid ${palette.blue[425]}`,
      outlineOffset: 3,
      animation: "focus-ring .28s var(--ease-out)",
    } },
  { [`${pill} .MuiSelect-icon`]: { right: 12, color: palette.slate[525], fontSize: "1.25rem" } },
  // The pill is disabled only until the page hydrates, so it keeps its usual colours.
  { [`${pill}.Mui-disabled, ${pill} .MuiSelect-select.Mui-disabled`]: {
      color: palette.navy[700],
      WebkitTextFillColor: "currentColor",
      cursor: "default",
    } },
  { ".Dropdown__hint": {
      marginLeft: "auto",
      color: palette.slate[375],
      fontSize: ".8rem",
      fontWeight: 500,
      fontVariantNumeric: "tabular-nums",
    } },
  { ".Mui-selected .Dropdown__hint": { color: "inherit", opacity: .7 } },
];
