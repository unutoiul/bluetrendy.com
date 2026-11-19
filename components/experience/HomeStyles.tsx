"use client";

import GlobalStyles from "@mui/material/GlobalStyles";
import { powerMeSheet } from "../entrancePowerMe.styles";
import { entranceLayoutSheet } from "../entranceLayout.styles";
import { websiteEntranceSheet } from "../WebsiteEntrance.styles";
import { heroSheet } from "../Hero.styles";
import { trustStripSheet } from "../TrustStrip.styles";
import { experienceSheet } from "./Experience.styles";
import { showcaseSheet } from "./Showcase.styles";
import { productionChapterSheet } from "./ProductionChapter.styles";
import { ideaLabSheet } from "./IdeaLab.styles";

const sheets = [
  ...powerMeSheet, ...entranceLayoutSheet, ...websiteEntranceSheet, ...experienceSheet, ...heroSheet,
  ...showcaseSheet, ...productionChapterSheet, ...trustStripSheet, ...ideaLabSheet,
];

/** Styles for the home page experience and its header, injected through MUI GlobalStyles. */
export default function HomeStyles() {
  return <GlobalStyles styles={sheets} />;
}
