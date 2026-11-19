"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuRounded from "@mui/icons-material/MenuRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import Logo from "@/components/Logo";
import { navLinks } from "@/data/nav";
import { industries } from "@/data/clients";
import { trackEvent } from "@/lib/analytics";
import { chapters } from "./chapters";
import RollText from "../motion/RollText";
import styles from "./Experience.styles";

const industryStudies: Record<string, string | undefined> = {
  finance: "blue-bridge-asset-management",
  healthcare: "bcg-bayer-medical-imaging",
  government: "nato-nci-agency-arcgis",
  manufacturing: "spx-flow-predictive-maintenance",
};

const menus = {
  Services: [
    { label: "Explore IT services", href: "#services" },
    { label: "IT implementation & integration", href: "/services#it-implementation-and-integration" },
    { label: "Full service catalogue", href: "/services" },
    { label: "From Prompt to Production", href: "#production" },
    { label: "AI Idea Lab", href: "#ai-lab" },
  ],
  Industries: Object.entries(industries).map(([id, label]) => ({
    label,
    href: industryStudies[id] ? `/case-studies/${industryStudies[id]}` : `/?industry=${id}#clients`,
  })),
} as const;
type MenuName = keyof typeof menus;

export default function ExperienceHeader() {
  const [active, setActive] = useState<string>("discover");
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<{ name: MenuName; anchor: HTMLElement } | null>(null);
  useEffect(() => trackEvent("chapter_view", { chapter: active }), [active]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-83px 0px -69% 0px" });
    for (const { id } of chapters) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  function openMenu(event: MouseEvent<HTMLButtonElement>, name: MenuName) {
    setMenu({ name, anchor: event.currentTarget });
  }

  return (
    <Box component="header" className={styles.header}>
      <Box className={styles.headerInner}>
        <Logo inverse height={40} spinOnArrival href="#discover" />
        <Box component="nav" aria-label="Main navigation" className={styles.headerNav}>
          {(["Services", "Industries"] as const).map(name => (
            <Button key={name} id={`nav-${name}`} className={styles.navTrigger} endIcon={<KeyboardArrowDownRounded />}
              data-current={name === "Services" && ["services", "production"].includes(active) || undefined}
              aria-haspopup="menu" aria-expanded={menu?.name === name} aria-controls={menu?.name === name ? "site-navigation-menu" : undefined}
              onClick={event => openMenu(event, name)}>{name}</Button>
          ))}
          <Link href="/#clients" aria-current={active === "clients" ? "location" : undefined}>Clients</Link>
          <a href="#ai-lab" aria-current={active === "ai-lab" ? "location" : undefined}>AI Idea Lab</a>
          <Link href="/about" prefetch={false}>About</Link>
        </Box>
        <Box className={styles.headerActions}>
          <Button component={Link} href="/contact" onClick={() => trackEvent("cta_start_project_click", { location: "experience_header" })}
            variant="outlined" className={styles.headerCta} endIcon={<ArrowForwardRounded />}><RollText>Get in Touch</RollText></Button>
          <IconButton className={styles.menuTrigger} aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><MenuRounded /></IconButton>
        </Box>
      </Box>
      <Menu anchorEl={menu?.anchor} open={Boolean(menu)} onClose={() => setMenu(null)}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        slotProps={{ paper: { className: styles.navMenu }, list: { id: "site-navigation-menu", "aria-labelledby": menu ? `nav-${menu.name}` : undefined } }}>
        {menu && menus[menu.name].map(item => item.href.startsWith("#")
          ? <MenuItem component="a" href={item.href} key={item.href} onClick={() => setMenu(null)}>{item.label}</MenuItem>
          : <MenuItem component={Link} href={item.href} key={item.href} prefetch={false} onClick={() => setMenu(null)}>{item.label}</MenuItem>)}
      </Menu>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} slotProps={{ paper: { "aria-label": "Site menu" } }}>
        <Box component="nav" aria-label="Mobile navigation" className={styles.drawer}>
          <Box className={styles.drawerHead}><Logo inverse height={31} href="#discover" onNavigate={() => setOpen(false)} /><IconButton aria-label="Close menu" onClick={() => setOpen(false)}><CloseRounded /></IconButton></Box>
          {chapters.map(ch => <Link key={ch.id} href={ch.id === "clients" ? "/#clients" : "#" + ch.id} aria-current={active === ch.id ? "location" : undefined}
            onClick={() => setOpen(false)}>{ch.label}</Link>)}
          <details className={styles.industryList}>
            <summary>Industries</summary>
            {menus.Industries.map(item => <Link key={item.href} href={item.href} prefetch={false}
              onClick={() => setOpen(false)}>{item.label}</Link>)}
          </details>
          <hr />
          {navLinks.filter(l => ["/about", "/pricing", "/contact"].includes(l.href)).map(link => <Link key={link.href} prefetch={false} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
          <Link href="/book-a-call" prefetch={false} onClick={() => setOpen(false)}>Book a call</Link>
        </Box>
      </Drawer>
    </Box>
  );
}
