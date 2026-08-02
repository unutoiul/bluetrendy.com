import { createTheme } from "@mui/material/styles";

export const brand = {
  navy: "#0B4563",
  navyDark: "#071E2C",
  navyMid: "#123A52",
  blue: "#2787BE",
  blueLight: "#5BA9D6",
  mist: "#F5F8FA",
  ink: "#0B1F2B",
  slate: "#4B6577",
  border: "rgba(11,31,43,0.08)",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: brand.navy,
      dark: brand.navyDark,
      light: "#2C6488",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: brand.blue,
      dark: "#1D6A96",
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
      "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    h1: { fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.08 },
    h2: { fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.15 },
    h3: { fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.2 },
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
          paddingInline: "1.5rem",
          paddingBlock: "0.7rem",
        },
        sizeLarge: {
          paddingInline: "2rem",
          paddingBlock: "0.9rem",
          fontSize: "1rem",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "var(--font-mono), monospace",
          fontWeight: 500,
          fontSize: "0.75rem",
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
