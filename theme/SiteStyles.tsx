"use client";

import GlobalStyles from "@mui/material/GlobalStyles";
import { siteGlobalStyles } from "./globalStyles";
import { dropdownSheet } from "@/components/Dropdown.styles";
import { editorialSheet } from "@/components/interior/Editorial.styles";
import { servicesSheet } from "@/components/interior/Services.styles";
import { mockupSheet } from "@/components/interior/ServiceMockups.styles";
import { workSheet } from "@/components/interior/Work.styles";
import { neuralKeyframes } from "@/components/experience/neuralStyle";

// The neural keyframes are site-wide: glass panels and glowing orbs appear on every page.
const sheets = [...siteGlobalStyles, ...dropdownSheet, ...editorialSheet, ...servicesSheet, ...mockupSheet, ...workSheet, ...neuralKeyframes];

/** Styles shared by every page, injected through MUI GlobalStyles. */
export default function SiteStyles() {
  return <GlobalStyles styles={sheets} />;
}
