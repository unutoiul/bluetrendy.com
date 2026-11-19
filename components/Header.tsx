"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import ArrowOutward from "@mui/icons-material/ArrowOutward";
import Menu from "@mui/icons-material/Menu";
import Close from "@mui/icons-material/Close";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Logo from "./Logo";
import Magnetic from "./motion/Magnetic";
import RollText from "./motion/RollText";
import { navLinks } from "@/data/nav";
import { trackEvent } from "@/lib/analytics";
import { easeOut } from "@/theme/theme";

export default function Header() {
  const path = usePathname();
  // One menu on every page, home included, ending in "Book a call".
  return <DetailHeader path={path} />;
}

function DetailHeader({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", y => setScrolled(y > 12));
  const current = (href: string) => path === href || path.startsWith(href + "/");

  return (
    <AppBar position="sticky" elevation={0} color="transparent"
      sx={{
        // Dark glass, so the header reads as part of the dark banners below it, as on the home page.
        bgcolor: scrolled ? "rgba(5, 15, 34, 0.84)" : "#071628",
        backdropFilter: scrolled ? "saturate(160%) blur(16px)" : "none",
        borderBottom: "1px solid #1d4472", color: "#e4f2ff",
        transition: "background-color 0.35s ease",
      }}>
      <Container>
        <Stack direction="row" sx={{ height: { xs: 65, md: 78 }, alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Logo height={42} spinOnArrival inverse />
              <Box component="nav" aria-label="Main navigation" onPointerLeave={() => setHovered(null)}
                sx={{ display: { xs: "none", md: "flex" }, gap: { md: 0, lg: 0.5 } }}>
                {navLinks.map(link => {
                  const active = current(link.href);
                  return (
                    <Button key={link.href} component={Link} href={link.href} aria-current={active ? "page" : undefined}
                      onPointerEnter={() => setHovered(link.href)} onFocus={() => setHovered(link.href)} onBlur={() => setHovered(null)}
                      sx={{
                        px: { md: 1, lg: 1.35 }, minWidth: 0, position: "relative", zIndex: 0,
                        color: active ? "#9fe8ff" : "#dcecff",
                        "&::before": { display: "none" },
                        "&:hover": { color: "#9fe8ff" },
                      }}>
                      {hovered === link.href && (
                        <Box component={motion.span} layoutId="nav-hover" aria-hidden="true"
                          transition={{ type: "spring", stiffness: 480, damping: 36 }}
                          sx={{ position: "absolute", inset: "7px 0", zIndex: -1, borderRadius: 999, bgcolor: "rgba(63, 168, 255, 0.14)" }} />
                      )}
                      {link.label}
                      {active && (
                        <Box component={motion.span} layoutId="active-nav" aria-hidden="true"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          sx={{ position: "absolute", left: 12, right: 12, bottom: 3, height: 2, borderRadius: 2, background: "linear-gradient(90deg, #3fa8ff, #9fe8ff)" }} />
                      )}
                    </Button>
                  );
                })}
              </Box>
              <Box sx={{ display: { xs: "none", md: "inline-flex" } }}>
                <Magnetic>
                  <Button component={Link} href="/book-a-call" variant="contained" endIcon={<ArrowOutward />}
                    onClick={() => trackEvent("cta_book_call_click", { location: "header" })}
                    sx={{ bgcolor: "#e1f2ff", color: "#071a2a", "&:hover": { bgcolor: "#fff" } }}>
                    <RollText>Book a call</RollText>
                  </Button>
                </Magnetic>
              </Box>
              <IconButton aria-label="Open menu" aria-expanded={open} aria-controls={open ? "mobile-nav" : undefined}
                onClick={() => setOpen(true)} sx={{ display: { md: "none" }, width: 44, height: 44, color: "#e3f4ff" }}><Menu /></IconButton>
        </Stack>
      </Container>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}
        slotProps={{ paper: { "aria-label": "Site menu", sx: { bgcolor: "#071628", backgroundImage: "linear-gradient(160deg, #0b2a4f, #061427 70%)", color: "#e4f2ff", borderLeft: "1px solid #1d4472" } } }}>
        <Stack id="mobile-nav" component="nav" aria-label="Mobile navigation" spacing={1}
          sx={{ width: "min(86vw, 340px)", p: 3, height: "100%", overscrollBehavior: "contain" }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box onClick={() => setOpen(false)}><Logo height={33} inverse /></Box>
            <IconButton aria-label="Close menu" onClick={() => setOpen(false)}
              sx={{ color: "#e4f2ff", "&:hover svg": { transform: "rotate(90deg)" }, "& svg": { transition: `transform 0.4s ${easeOut}` } }}><Close /></IconButton>
          </Stack>
          {navLinks.map((link, index) => {
            const active = current(link.href);
            return (
              <Box key={link.href} component={motion.div} initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <Button component={Link} href={link.href} fullWidth aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}
                  sx={{ justifyContent: "flex-start", py: 1.4, px: 2, fontSize: 17, borderRadius: 3,
                    bgcolor: active ? "rgba(63, 168, 255, 0.16)" : undefined, color: active ? "#9fe8ff" : "#dcecff",
                    "&::before": { display: "none" },
                    "&:hover": { bgcolor: "rgba(63, 168, 255, 0.12)", color: "#9fe8ff", pl: 2.75 },
                    transition: `transform 0.22s ${easeOut}, padding 0.35s ${easeOut}, background-color 0.25s ease, color 0.25s ease` }}>
                  {link.label}
                </Button>
              </Box>
            );
          })}
          <Box component={motion.div} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + navLinks.length * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} sx={{ pt: 1.5 }}>
            <Button component={Link} href="/book-a-call" variant="contained" fullWidth endIcon={<ArrowOutward />}
              onClick={() => { setOpen(false); trackEvent("cta_book_call_click", { location: "mobile_nav" }); }}
              sx={{ bgcolor: "#e1f2ff", color: "#071a2a", "&:hover": { bgcolor: "#fff" } }}>Book a call</Button>
          </Box>
        </Stack>
      </Drawer>
    </AppBar>
  );
}
