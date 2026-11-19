"use client";

import GlobalStyles from "@mui/material/GlobalStyles";
import { siteGlobalStyles } from "./globalStyles";
import { editorialSheet } from "@/components/interior/Editorial.styles";
import { servicesSheet } from "@/components/interior/Services.styles";
import { workSheet } from "@/components/interior/Work.styles";
import { neuralKeyframes } from "@/components/experience/neuralStyle";

// The neural keyframes are site-wide: glass panels and glowing orbs appear on every page.
const sheets = [...siteGlobalStyles, ...editorialSheet, ...servicesSheet, ...workSheet, ...neuralKeyframes];

/** Styles shared by every page, injected through MUI GlobalStyles. */
export default function SiteStyles() {
  return <GlobalStyles styles={sheets} />;
}
