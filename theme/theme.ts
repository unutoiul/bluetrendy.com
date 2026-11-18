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
const streak = `linear-gradient(90deg, ${brand.blue}, ${brand.blueLight})`;

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
        // A streak of light crosses the button, like the one under the ribbon sculpture.
        contained: {
          overflow: "hidden",
          isolation: "isolate",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: -1,
            pointerEvents: "none",
            background: "linear-gradient(110deg, transparent 22%, rgba(255,255,255,0.5) 44%, transparent 62%)",
            transform: "translateX(-115%)",
          },
          "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 30px -14px rgba(22,95,204,0.75)" },
          "&:hover::after": { transform: "translateX(115%)", transition: `transform 0.85s ${easeOut}` },
          "&:active": { transform: "translateY(0) scale(0.96)", boxShadow: "0 6px 16px -10px rgba(22,95,204,0.7)" },
        },
        // Outlined buttons fill from the left with their own colour.
        outlined: {
          overflow: "hidden",
          isolation: "isolate",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: -1,
            pointerEvents: "none",
            backgroundColor: "currentColor",
            opacity: 0.09,
            transform: "scaleX(0)",
            transformOrigin: "right",
            transition: `transform 0.5s ${easeOut}`,
          },
          "&:hover": { backgroundColor: "transparent" },
          "&:hover::after": { transform: "scaleX(1)", transformOrigin: "left" },
        },
        // Text buttons draw an underline instead of filling.
        text: {
          "&::before": {
            content: '""',
            position: "absolute",
            left: "var(--underline-inset, 0.55rem)",
            right: "var(--underline-inset, 0.55rem)",
            bottom: "0.42rem",
            height: "1.5px",
            borderRadius: 2,
            backgroundColor: "currentColor",
            pointerEvents: "none",
            transform: "scaleX(0)",
            transformOrigin: "right",
            transition: `transform 0.45s ${easeOut}`,
          },
          "&:hover": { backgroundColor: "transparent" },
          "&:hover::before, &.Mui-focusVisible::before": { transform: "scaleX(1)", transformOrigin: "left" },
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
            boxShadow: "0 0 0 4px rgba(22,95,204,0.12), 0 16px 32px -22px rgba(22,95,204,0.6)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: brand.blue, borderWidth: 1.5 },
          // A light streak runs along the bottom edge of the field in focus.
          "&::after": {
            content: '""',
            position: "absolute",
            left: 14,
            right: 14,
            bottom: -1,
            height: 2,
            borderRadius: 2,
            background: streak,
            pointerEvents: "none",
            transform: "scaleX(0)",
            transition: `transform 0.55s ${easeOut}`,
          },
          "&.Mui-focused::after": { transform: "scaleX(1)" },
          "&.Mui-error::after": { background: "#d32f2f" },
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
          border: `1px solid ${brand.border}`,
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
          transition: `border-color 0.3s ease, box-shadow 0.45s ${easeOut}`,
          "&.Mui-expanded": { borderColor: brand.blue, boxShadow: "0 18px 40px -28px rgba(22,95,204,0.6)" },
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
