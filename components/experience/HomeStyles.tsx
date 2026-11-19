"use client";

import GlobalStyles from "@mui/material/GlobalStyles";
import { heroSheet } from "../Hero.styles";
import { trustStripSheet } from "../TrustStrip.styles";
import { experienceSheet } from "./Experience.styles";

const sheets = [
  ...experienceSheet, ...heroSheet, ...trustStripSheet,
];

/** Styles for the home page experience and its header, injected through MUI GlobalStyles. */
export default function HomeStyles() {
  return <GlobalStyles styles={sheets} />;
}
