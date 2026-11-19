import { createTheme } from "@mui/material/styles";

export const brand = {
  navy: "#0C2B45",
  navyDark: "#081E35",
  navyMid: "#19466F",
  blue: "#165FCC",
  blueLight: "#8BD6FF",
  mist: "#F1F6FC",
  ink: "#0C2942",
  slate: "#455E71",
  border: "#CCD9E5",
};

// One easing curve for every interaction: a quick start that settles softly.
export const easeOut = "cubic-bezier(0.22, 1, 0.36, 1)";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: brand.navy,
      dark: brand.navyDark,
      light: "#346287",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: brand.blue,
      dark: "#104DAB",
      light: brand.blueLight,
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: brand.ink,
      secondary: brand.slate,
    },
    divider: brand.border,
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
          outline: "3px solid #2585dd",
          outlineOffset: 3,
          animation: `focus-ring 0.28s ${easeOut}`,
        },
        "h1, h2, h3": { textWrap: "balance" },
        ":where(a, button)": { touchAction: "manipulation" },
        "::selection": { backgroundColor: brand.blue, color: "#fff" },
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
          backgroundColor: "#2879df",
          color: "#f1fbff",
          boxShadow: "0 10px 26px -14px rgba(40, 121, 223, 0.9)",
          "&:hover": { transform: "translateY(-1px)", backgroundColor: "#3c8bef", boxShadow: "0 14px 30px -14px rgba(60, 139, 239, 0.95)" },
          "&:active": { transform: "scale(0.98)", boxShadow: "none" },
        },
        outlined: {
          border: 0,
          backgroundColor: brand.mist,
          "&:hover": { border: 0, backgroundColor: "#E3EDF5" },
        },
        // Text buttons fill with a soft blue pill on hover, the same tint as the header links.
        text: {
          "&:hover": { backgroundColor: "rgba(63, 168, 255, 0.14)" },
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
          backgroundColor: "#F7FAFE",
          transition: `background-color 0.25s ease, box-shadow 0.4s ${easeOut}`,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: brand.border, transition: "border-color 0.25s ease" },
          "&:hover:not(.Mui-focused, .Mui-disabled, .Mui-error) .MuiOutlinedInput-notchedOutline": { borderColor: "#8FA9C0" },
          "&.Mui-focused": {
            backgroundColor: "#fff",
            boxShadow: "0 0 0 3px rgba(22,95,204,0.1)",
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
    MuiMenu: {
      // Locking scroll hides the sticky header, because html and body clip horizontal overflow.
      defaultProps: { disableScrollLock: true },
      styleOverrides: {
        paper: {
          marginTop: 6,
          borderRadius: 12,
          border: 0,
          boxShadow: "0 24px 48px -22px rgba(12,43,69,0.45)",
        },
        list: { padding: 6 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: `background-color 0.2s ease, color 0.2s ease, padding-left 0.3s ${easeOut}`,
          "&:hover": { backgroundColor: brand.mist, paddingLeft: 22 },
          "&.Mui-selected, &.Mui-selected:hover": { backgroundColor: "rgba(22,95,204,0.09)", color: brand.blue, fontWeight: 600 },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          transition: "background-color 0.2s ease",
          "&.Mui-expanded": { backgroundColor: "#edf3f7", boxShadow: "none" },
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
