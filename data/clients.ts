export type ClientLogo = {
  name: string;
  file: string | null;
  href: string;
  external: boolean;
};

export const clientLogos: ClientLogo[] = [
  { name: "NATO", file: "nato.svg", href: "/case-studies/nato-nci-agency-arcgis", external: false },
  { name: "Boston Consulting Group", file: "bcg.svg", href: "/case-studies/bcg-bayer-medical-imaging", external: false },
  { name: "Bayer", file: "bayer.svg", href: "/case-studies/bcg-bayer-medical-imaging", external: false },
  { name: "Atlassian", file: "atlassian.svg", href: "/case-studies/atlassian-identity-platform", external: false },
  { name: "Alvarez & Marsal", file: "alvarez-marsal.png", href: "/case-studies/alvarez-marsal-financial-analysis", external: false },
  { name: "Royal Caribbean", file: "royal-caribbean.svg", href: "/case-studies/alvarez-marsal-financial-analysis", external: false },
  { name: "Carnival Cruise Line", file: null, href: "/case-studies/alvarez-marsal-financial-analysis", external: false },
  { name: "SPX Flow", file: null, href: "https://www.spxflow.com", external: true },
  { name: "HSBC", file: "hsbc.svg", href: "https://www.hsbc.com", external: true },
  { name: "Credit Suisse", file: "credit-suisse.svg", href: "https://www.credit-suisse.com", external: true },
  { name: "Lloyds Bank", file: "lloyds-bank.svg", href: "https://www.lloydsbank.com", external: true },
  { name: "Sky", file: "sky.svg", href: "https://www.sky.com", external: true },
  { name: "Royal Mail", file: "royal-mail.svg", href: "https://www.royalmail.com", external: true },
  { name: "EE", file: "ee.svg", href: "https://ee.co.uk", external: true },
  { name: "Allergan", file: "allergan.svg", href: "https://www.allergan.com", external: true },
];
