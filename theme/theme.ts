import { createTheme } from "@mui/material/styles";
import {
  listCheck, listOption, listOptionActive, listOptionFocus, listOptionSelected,
  listOptionSelectedActive, listPadding, listSeparator, listSurface,
} from "./menuStyle";
import { brand, palette, withAlpha } from "./palette";

// Every colour comes from theme/palette.ts; `brand` stays exported here for existing imports.
export { brand };

// One easing curve for every interaction: a quick start that settles softly.
export const easeOut = "cubic-bezier(0.22, 1, 0.36, 1)";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: brand.navy,
      dark: brand.navyDark,
      light: palette.slate[525],
      contrastText: palette.white,
    },
    secondary: {
      main: brand.blue,
      dark: palette.blue[550],
      light: brand.blueLight,
      contrastText: palette.white,
    },
    background: {
      default: palette.white,
      paper: palette.white,
    },
    text: {
      primary: brand.ink,
      secondary: brand.slate,
    },
    divider: brand.border,
    // MUI's own status colours, swapped for the palette's so alerts and form errors match the site.
    error: { main: palette.red[400], contrastText: palette.white },
    warning: { main: palette.amber[300], contrastText: palette.navy[800] },
    success: { main: palette.green[375], contrastText: palette.white },
    info: { main: palette.blue[425], contrastText: palette.white },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily:
      "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    h1: { fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.08 },
    h2: { fontWeight: 690, letterSpacing: "-0.048em", lineHeight: 1.09 },
    h3: { fontWeight: 670, fontSize: "clamp(1.9rem, 3.4vw, 2.9rem)", letterSpacing: "-0.045em", lineHeight: 1.12 },
    h4: { fontWeight: 600, lineHeight: 1.25 },
    h5: { fontWeight: 600, lineHeight: 1.3 },
    h6: { fontWeight: 600, lineHeight: 1.35 },
    subtitle1: { fontWeight: 500 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.65 },
    button: { fontWeight: 600, textTransform: "none" },
    overline: {
      fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
      letterSpacing: "0.14em",
      fontWeight: 600,
      fontSize: "0.72rem",
    },
    caption: { lineHeight: 1.5 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":where(a, button, input, select, textarea, [tabindex]):focus-visible, .MuiButtonBase-root.Mui-focusVisible": {
          outline: `3px solid ${palette.blue[425]}`,
          outlineOffset: 3,
          animation: `focus-ring 0.28s ${easeOut}`,
        },
        "h1, h2, h3": { textWrap: "balance" },
        ":where(a, button)": { touchAction: "manipulation" },
        "::selection": { backgroundColor: brand.blue, color: palette.white },
      },
    },
    MuiButtonBase: {
      // The press, sheen, and click-spark feedback below replace Material's ripple.
      defaultProps: { disableRipple: true },
    },
    MuiContainer: {
      defaultProps: { maxWidth: "lg" },
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: "1.3rem",
          minHeight: 44,
          paddingBlock: "0.7rem",
          transition: `transform 0.22s ${easeOut}, box-shadow 0.4s ${easeOut}, background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease`,
          "&:active": { transform: "scale(0.96)" },
          "& .MuiButton-startIcon, & .MuiButton-endIcon": { transition: `transform 0.35s ${easeOut}` },
          "&:hover .MuiButton-endIcon": { transform: "translateX(3px)" },
          "&:hover .MuiButton-endIcon:has([data-testid='ArrowOutwardIcon'])": { transform: "translate(2px, -2px)" },
          "&:hover .MuiButton-startIcon:has([data-testid='ArrowBackIcon'])": { transform: "translateX(-3px)" },
        },
        sizeLarge: {
          paddingInline: "2rem",
          paddingBlock: "0.9rem",
          fontSize: "1rem",
        },
        // One primary action style across the site: the bright blue pill from the home page.
        contained: {
          backgroundColor: palette.blue[425],
          color: palette.grey[25],
          boxShadow: `0 10px 26px -14px ${withAlpha(palette.blue[425], 0.9)}`,
          "&:hover": { transform: "translateY(-1px)", backgroundColor: palette.blue[350], boxShadow: `0 14px 30px -14px ${withAlpha(palette.blue[350], 0.95)}` },
          "&:active": { transform: "scale(0.98)", boxShadow: "none" },
        },
        outlined: {
          border: 0,
          backgroundColor: brand.mist,
          "&:hover": { border: 0, backgroundColor: palette.grey[75] },
        },
        // Text buttons fill with a soft blue pill on hover, the same tint as the header links.
        text: {
          "&:hover": { backgroundColor: withAlpha(palette.blue[300], 0.14) },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: `transform 0.22s ${easeOut}, background-color 0.25s ease, color 0.25s ease`,
          "&:active": { transform: "scale(0.88)" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: palette.grey[25],
          transition: `background-color 0.25s ease, box-shadow 0.4s ${easeOut}`,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: brand.border, transition: "border-color 0.25s ease" },
          "&:hover:not(.Mui-focused, .Mui-disabled, .Mui-error) .MuiOutlinedInput-notchedOutline": { borderColor: palette.slate[275] },
          "&.Mui-focused": {
            backgroundColor: palette.white,
            boxShadow: `0 0 0 3px ${withAlpha(palette.blue[500], 0.1)}`,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: brand.blue, borderWidth: 1.5 },

        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { "&.Mui-focused": { color: brand.blue } },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: brand.slate, transition: `transform 0.3s ${easeOut}` },
      },
    },
    MuiMenu: {
      // Locking scroll hides the sticky header, because html and body clip horizontal overflow.
      defaultProps: { disableScrollLock: true },
      styleOverrides: {
        paper: { ...listSurface, marginTop: 6 },
        list: { padding: listPadding },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ...listOption,
          "& + &": { marginTop: 2 },
          "@media (min-width:600px)": { minHeight: listOption.minHeight },
          "&:hover, &.Mui-focusVisible": listOptionActive,
          "&.MuiMenuItem-root.Mui-focusVisible": listOptionFocus,
          "&.Mui-selected, &.Mui-selected.Mui-focusVisible": listOptionSelected,
          "&.Mui-selected:hover": listOptionSelectedActive,
          "&.Mui-selected::after": listCheck,
        },
        divider: {
          borderBottom: 0,
          marginBottom: 9,
          "&::before": listSeparator,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          transition: "background-color 0.2s ease",
          "&.Mui-expanded": { backgroundColor: palette.grey[25], boxShadow: "none" },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          "& .MuiAccordionSummary-content .MuiTypography-root": { transition: "color 0.2s ease" },
          "&:hover .MuiAccordionSummary-content .MuiTypography-root": { color: brand.blue },
        },
        expandIconWrapper: { transition: `transform 0.45s ${easeOut}` },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-mono), monospace",
          fontWeight: 500,
          fontSize: "0.75rem",
          transition: "background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
    },
  },
});

export default theme;
