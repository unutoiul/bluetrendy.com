"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles";
import ArrowOutward from "@mui/icons-material/ArrowOutward";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Logo from "./Logo";
import Magnetic from "./motion/Magnetic";
import RollText from "./motion/RollText";
import { navLinks } from "@/data/nav";
import { trackEvent } from "@/lib/analytics";
import { easeOut } from "@/theme/theme";

const barHeight = { xs: 64, md: 78 };
// The lockup is drawn at 50px; phones get a smaller one so the bar has room to breathe.
const logoScale = { xs: 0.8, md: 1 };
const email = "contact@bluetrendy.com";

export default function Header() {
  const path = usePathname();
  // One menu on every page, home included, ending in "Book a call".
  return <DetailHeader path={path} />;
}

/** Two bars that turn into a cross. The shorter lower bar sets it apart from a stock icon. */
function MenuGlyph({ open }: { open: boolean }) {
  return (
    <Box component="span" aria-hidden="true" sx={{
      position: "relative", display: "block", width: 24, height: 16,
      "& i": {
        position: "absolute", right: 0, height: 2, borderRadius: 2, bgcolor: "currentColor",
        transition: `top 0.32s ${easeOut}, rotate 0.32s ${easeOut}, width 0.32s ${easeOut}`,
      },
      "& i:first-of-type": { top: open ? 7 : 3, width: 24, rotate: open ? "45deg" : "0deg" },
      "& i:last-of-type": { top: open ? 7 : 11, width: open ? 24 : 15, rotate: open ? "-45deg" : "0deg" },
      "@media (prefers-reduced-motion: reduce)": { "& i": { transition: "none" } },
    }}><i /><i /></Box>
  );
}

function DetailHeader({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const desktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"), { noSsr: true });
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", y => setScrolled(y > 12));
  const current = (href: string) => path === href || path.startsWith(href + "/");

  // A new page closes the menu.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [path]);

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
        <Stack direction="row" sx={{ height: barHeight, alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ zoom: logoScale }}><Logo height={50} spinOnArrival inverse /></Box>
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
                    // The sliding pill below is the hover fill.
                    "&:hover": { color: "#9fe8ff", bgcolor: "transparent" },
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
                onClick={() => trackEvent("cta_book_call_click", { location: "header" })}>
                <RollText>Book a call</RollText>
              </Button>
            </Magnetic>
          </Box>
          <IconButton aria-label="Open menu" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? "mobile-nav" : undefined}
            onClick={() => setOpen(true)} sx={{ display: { md: "none" }, width: 48, height: 48, mr: -1, color: "#e3f4ff" }}>
            <MenuGlyph open={false} />
          </IconButton>
        </Stack>
      </Container>
      <MobileMenu open={open && !desktop} onClose={() => setOpen(false)} current={current} />
    </AppBar>
  );
}

function MobileMenu({ open, onClose, current }: { open: boolean; onClose: () => void; current: (href: string) => boolean }) {
  // The glyph starts as bars and turns into a cross once the sheet is up, continuing the tap.
  const [crossed, setCrossed] = useState(false);
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setCrossed(true));
    return () => { cancelAnimationFrame(frame); setCrossed(false); };
  }, [open]);

  const enter = (index: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.06 + index * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <Dialog fullScreen open={open} onClose={onClose}
      slotProps={{
        transition: { timeout: { enter: 220, exit: 160 } },
        paper: {
          id: "mobile-nav", "aria-label": "Site menu",
          sx: {
            color: "#e4f2ff", bgcolor: "#071628",
            backgroundImage: "radial-gradient(120% 60% at 100% 0%, rgba(63, 168, 255, 0.16), transparent 60%), linear-gradient(180deg, #071628, #0a2244)",
          },
        },
      }}>
      {/* The same bar as the header, so opening the menu changes only the page beneath it. */}
      <Box sx={{ flexShrink: 0, borderBottom: "1px solid #1d4472" }}>
        <Container>
          <Stack direction="row" sx={{ height: barHeight, alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ zoom: logoScale }}><Logo height={50} inverse onNavigate={onClose} /></Box>
            <IconButton aria-label="Close menu" onClick={onClose} sx={{ width: 48, height: 48, mr: -1, color: "#e4f2ff" }}>
              <MenuGlyph open={crossed} />
            </IconButton>
          </Stack>
        </Container>
      </Box>

      <Container sx={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", overscrollBehavior: "contain" }}>
        <Box component="nav" aria-label="Mobile navigation" sx={{ pt: 2 }}>
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
            {navLinks.map((link, index) => {
              const active = current(link.href);
              return (
                <Box component={motion.li} key={link.href} {...enter(index)}
                  sx={{ borderBottom: "1px solid rgba(159, 232, 255, 0.12)" }}>
                  <Box component={Link} href={link.href} aria-current={active ? "page" : undefined} onClick={onClose}
                    sx={{
                      display: "flex", alignItems: "center", gap: 1.5, minHeight: 64, py: 1,
                      color: active ? "#9fe8ff" : "#eef6ff", textDecoration: "none",
                      fontSize: "clamp(1.6rem, 7vw, 2rem)", fontWeight: 650, letterSpacing: "-0.045em", lineHeight: 1.1,
                      "& .arrow": { ml: "auto", fontSize: 22, color: active ? "#9fe8ff" : "#6f93b8", transition: `translate 0.3s ${easeOut}` },
                      "&:hover .arrow, &:focus-visible .arrow": { translate: "4px 0", color: "#9fe8ff" },
                      "&:focus-visible": { outline: "2px solid #9fe8ff", outlineOffset: 2, borderRadius: 1 },
                    }}>
                    {link.label}
                    {/* The current page gets a dot where the other rows have an arrow. */}
                    {active
                      ? <Box component="span" aria-hidden="true" sx={{ ml: "auto", mr: "7px", width: 9, height: 9, borderRadius: "50%", bgcolor: "#9fe8ff", boxShadow: "0 0 12px #3fa8ff" }} />
                      : <ArrowForwardRounded className="arrow" aria-hidden="true" />}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* The call to action sits at the bottom, where a thumb reaches it. */}
        <Box component={motion.div} {...enter(navLinks.length)}
          sx={{ mt: "auto", pt: 4, pb: "calc(24px + env(safe-area-inset-bottom))" }}>
          <Box component="p" sx={{ m: "0 0 12px", color: "#a9c3dc", fontSize: 15, lineHeight: 1.5 }}>
            Free 30-minute discovery call. We’ll map your first release with you.
          </Box>
          <Button component={Link} href="/book-a-call" variant="contained" fullWidth endIcon={<ArrowOutward />}
            onClick={() => { onClose(); trackEvent("cta_book_call_click", { location: "mobile_nav" }); }}
            sx={{ minHeight: 54, fontSize: 17 }}>
            Book a call
          </Button>
          <Box component="a" href={`mailto:${email}`}
            sx={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 1, minHeight: 48, mt: 1,
              color: "#cfe3f6", fontSize: 15, fontWeight: 600, textDecoration: "none",
              "&:hover, &:focus-visible": { color: "#fff", textDecoration: "underline", textUnderlineOffset: "0.25em" },
            }}>
            <MailOutlineRounded aria-hidden="true" sx={{ fontSize: 19 }} />{email}
          </Box>
        </Box>
      </Container>
    </Dialog>
  );
}
