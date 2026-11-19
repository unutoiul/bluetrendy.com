"use client";

import GlobalStyles from "@mui/material/GlobalStyles";
import { siteGlobalStyles } from "./globalStyles";
import { editorialSheet } from "@/components/interior/Editorial.styles";
import { servicesSheet } from "@/components/interior/Services.styles";
import { workSheet } from "@/components/interior/Work.styles";

const sheets = [...siteGlobalStyles, ...editorialSheet, ...servicesSheet, ...workSheet];

/** Styles shared by every page, injected through MUI GlobalStyles. */
export default function SiteStyles() {
  return <GlobalStyles styles={sheets} />;
}
