export type ClientLogo = {
  name: string;
  file: string | null;
  href: string;
  external: boolean;
  /**
   * Idle-state opacity, before the hover reveal. Most marks are bold enough to
   * survive grayscale + the default dim; fine-lined marks (thin engraved
   * artwork, delicate strokes) wash out to almost nothing at that level and
   * need a lighter touch to stay legible at rest.
   */
  mutedOpacity?: number;
};

export const clientLogos: ClientLogo[] = [
  { name: "NATO", file: "nato.svg", href: "/case-studies/nato-nci-agency-arcgis", external: false },
  { name: "Boston Consulting Group", file: "bcg.svg", href: "/case-studies/bcg-bayer-medical-imaging", external: false },
  { name: "Bayer", file: "bayer.svg", href: "/case-studies/bcg-bayer-medical-imaging", external: false },
  { name: "Atlassian", file: "atlassian.svg", href: "/case-studies/atlassian-identity-platform", external: false },
  { name: "Alvarez & Marsal", file: "alvarez-marsal.png", href: "/case-studies/alvarez-marsal-financial-analysis", external: false },
  { name: "Royal Caribbean", file: "royal-caribbean.svg", href: "/case-studies/alvarez-marsal-financial-analysis", external: false },
  { name: "Carnival Cruise Line", file: "carnival.png", href: "/case-studies/alvarez-marsal-financial-analysis", external: false },
  { name: "SPX Flow", file: "spxflow.webp", href: "https://www.spxflow.com", external: true },
  { name: "HSBC", file: "hsbc.svg", href: "https://www.hsbc.com", external: true },
  { name: "Credit Suisse", file: "credit-suisse.svg", href: "https://www.credit-suisse.com", external: true },
  { name: "Lloyds Bank", file: "lloyds-bank.svg", href: "https://www.lloydsbank.com", external: true },
  { name: "Sky", file: "sky.svg", href: "https://www.sky.com", external: true },
  { name: "Royal Mail", file: "royal-mail.svg", href: "https://www.royalmail.com", external: true },
  { name: "EE", file: "ee.svg", href: "https://ee.co.uk", external: true },
  { name: "Allergan", file: "allergan.svg", href: "https://www.allergan.com", external: true },
  { name: "ExxonMobil", file: "exxonmobil.png", href: "https://corporate.exxonmobil.com", external: true },
  { name: "Afiniti", file: "afiniti.png", href: "https://www.afiniti.com", external: true },
  { name: "Publicis Groupe", file: "publicis.png", href: "https://www.publicisgroupe.com", external: true, mutedOpacity: 0.9 },
  { name: "IG Group", file: "ig.png", href: "https://www.ig.com", external: true },
];
