import { services } from "./services";

export type NavLink = { href: string; label: string; children?: { href: string; label: string; hint: string }[] };

export const navLinks: NavLink[] = [
  // The seven services open from this link, on desktop as a menu and on phones as a list.
  { href: "/services", label: "Services",
    children: services.map(service => ({ href: "/" + service.slug, label: service.shortName, hint: service.number })) },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Engagement" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const footerLinks = {
  services: services.map(service => ({ href: "/" + service.slug, label: service.shortName })),
  company: [
    { href: "/about", label: "About" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/process", label: "Process" },
    { href: "/pricing", label: "Engagement" },
    { href: "/contact", label: "Contact" },
    { href: "/book-a-call", label: "Book a Call" },
  ],
  legal: [
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/terms", label: "Terms of Engagement" },
  ],
};
