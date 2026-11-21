export const industries = {
  finance: "Finance & wealth management",
  healthcare: "Healthcare & life sciences",
  government: "Government & defence",
  manufacturing: "Industrial & manufacturing",
  software: "Enterprise software",
  travel: "Travel & leisure",
  consulting: "Professional services",
  media: "Media & communications",
  logistics: "Post & logistics",
  energy: "Energy",
} as const;

export type Industry = keyof typeof industries;

export type ClientLogo = {
  industry: Industry;
  name: string;
  file: string | null;
  href: string;
  external: boolean;
};

/** The white-plated tile scripts/client-tiles.ts builds from a logo file, e.g. "nato.svg" -> "nato". */
export const tileName = (file: string) => file.replace(/\.[^.]+$/, "");

export const clientLogos: ClientLogo[] = [
  { name: "NATO", industry: "government", file: "nato.svg", href: "/case-studies/nato-nci-agency-arcgis", external: false },
  { name: "Boston Consulting Group", industry: "consulting", file: "bcg.svg", href: "/case-studies/bcg-bayer-medical-imaging", external: false },
  { name: "Bayer", industry: "healthcare", file: "bayer.svg", href: "/case-studies/bcg-bayer-medical-imaging", external: false },
  { name: "Atlassian", industry: "software", file: "atlassian.svg", href: "/case-studies/atlassian-identity-platform", external: false },
  { name: "BlueBridge Asset Management", industry: "finance", file: "bluebridge.svg", href: "/case-studies/blue-bridge-asset-management", external: false },
  { name: "Alvarez & Marsal", industry: "consulting", file: "alvarez-marsal.png", href: "/case-studies/alvarez-marsal-financial-analysis", external: false },
  { name: "Royal Caribbean", industry: "travel", file: "royal-caribbean.svg", href: "/case-studies/alvarez-marsal-financial-analysis", external: false },
  { name: "Carnival Cruise Line", industry: "travel", file: "carnival.png", href: "/case-studies/alvarez-marsal-financial-analysis", external: false },
  { name: "SPX Flow", industry: "manufacturing", file: "spxflow.webp", href: "/case-studies/spx-flow-predictive-maintenance", external: false },
  { name: "HSBC", industry: "finance", file: "hsbc.svg", href: "https://www.hsbc.com", external: true },
  { name: "Citi", industry: "finance", file: "citi.svg", href: "https://www.citigroup.com", external: true },
  { name: "Credit Suisse", industry: "finance", file: "credit-suisse.svg", href: "https://www.credit-suisse.com", external: true },
  { name: "Lloyds Bank", industry: "finance", file: "lloyds-bank.svg", href: "https://www.lloydsbank.com", external: true },
  { name: "Sky", industry: "media", file: "sky.svg", href: "https://www.sky.com", external: true },
  { name: "Royal Mail", industry: "logistics", file: "royal-mail.svg", href: "https://www.royalmail.com", external: true },
  { name: "HM Revenue & Customs", industry: "government", file: "hmrc.svg", href: "https://www.gov.uk/government/organisations/hm-revenue-customs", external: true },
  { name: "EE", industry: "media", file: "ee.svg", href: "https://ee.co.uk", external: true },
  { name: "Allergan", industry: "healthcare", file: "allergan.svg", href: "https://www.allergan.com", external: true },
  { name: "ExxonMobil", industry: "energy", file: "exxonmobil.png", href: "https://corporate.exxonmobil.com", external: true },
  { name: "BP", industry: "energy", file: "bp.svg", href: "https://www.bp.com", external: true },
  { name: "Shell", industry: "energy", file: "shell.svg", href: "https://www.shell.com", external: true },
  { name: "Afiniti", industry: "software", file: "afiniti.png", href: "https://www.afiniti.com", external: true },
  { name: "Publicis Groupe", industry: "media", file: "publicis.png", href: "https://www.publicisgroupe.com", external: true },
  { name: "IG Group", industry: "finance", file: "ig.png", href: "https://www.ig.com", external: true },
];
