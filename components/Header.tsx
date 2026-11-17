"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Logo, { LOGO_HEIGHT, logoWidth } from "./Logo";
import { cloudBadgeMask } from "./motion/cloudBadge";
import { navLinks } from "@/data/nav";
import { trackEvent } from "@/lib/analytics";

const BAR_H = 88;

// The logo sits on a solid white badge that hangs below the bar and onto the
// hero. Sized per breakpoint so the lockup always clears the curved edge.
const LOGO_H = { xs: 64, md: LOGO_HEIGHT };
const BADGE_PAD_X = { xs: 10, md: 24 };
const BADGE_DROP = { xs: 52, md: 80 };

const badgeWidth = {
  xs: Math.round(logoWidth(LOGO_H.xs) + BADGE_PAD_X.xs * 2),
  md: Math.round(logoWidth(LOGO_H.md) + BADGE_PAD_X.md * 2),
};

// Baked once at module load — the mask is pure geometry (width, bar height,
// drop), so it never needs to change at runtime.
const badgeMask = {
  xs: cloudBadgeMask({ width: badgeWidth.xs, barHeight: BAR_H, dropHeight: BADGE_DROP.xs, seed: 4 }),
  md: cloudBadgeMask({ width: badgeWidth.md, barHeight: BAR_H, dropHeight: BADGE_DROP.md, seed: 9 }),
};

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/book-a-call") {
    return (
      <AppBar component="header" position="sticky" elevation={0} color="transparent" sx={{ bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}>
        <Container>
          <Box component="nav" aria-label="Booking navigation" sx={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Logo height={44} />
            <Button component={Link} href="/" startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />} sx={{ color: "text.secondary", fontSize: 13, px: 1.25, minHeight: 40 }}>
              Back to site
            </Button>
          </Box>
        </Container>
      </AppBar>
    );
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        bgcolor: "rgba(255,255,255,0.86)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        overflow: "visible",
      }}
    >
      <Container sx={{ position: "relative" }}>
        {/* White badge, flush with the top of the bar, hanging past its bottom
            edge as a soft cloud puff rather than a geometric curve. Centred
            on mobile (no nav links to balance against), pinned left on
            desktop where it sits beside the nav. */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: { xs: "50%", md: 24 },
            top: 0,
            width: badgeWidth,
            height: { xs: BAR_H + BADGE_DROP.xs, md: BAR_H + BADGE_DROP.md },
            transform: { xs: "translateX(-50%)", md: "none" },
            // Same translucent surface as the bar, and no border, so the badge
            // reads as the bar simply bulging downward rather than a separate shape.
            bgcolor: "rgba(255,255,255)",
            maskImage: badgeMask,
            WebkitMaskImage: badgeMask,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            pointerEvents: "none",
          }}
        />

        <Toolbar disableGutters sx={{ height: BAR_H, justifyContent: { xs: "flex-end", md: "space-between" } }}>
          {/* Reserves the badge's footprint; the logo itself is centred inside it.
              Taken out of flex flow on mobile so it can sit at the true centre of
              the bar instead of being pushed off-centre by the hamburger icon. */}
          <Box
            sx={{
              width: badgeWidth,
              height: BAR_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: { xs: "absolute", md: "relative" },
              left: { xs: "50%", md: "auto" },
              top: { xs: 0, md: "auto" },
              transform: { xs: "translateX(-50%)", md: "none" },
              zIndex: 1,
              pt: { xs: `${BADGE_DROP.xs * 0.6}px`, md: `${BADGE_DROP.md * 0.6}px` },
            }}
          >
            <Box sx={{ display: { xs: "none", md: "inline-flex" } }}>
              <Logo height={LOGO_H.md} />
            </Box>
            <Box sx={{ display: { xs: "inline-flex", md: "none" } }}>
              <Logo height={LOGO_H.xs} />
            </Box>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  sx={{
                    color: active ? "primary.main" : "text.secondary",
                    fontWeight: active ? 700 : 500,
                    px: 1.5,
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.5 }}>
            <Button
              component={Link}
              href="/book-a-call"
              variant="contained"
              color="primary"
              onClick={() => trackEvent("cta_book_call_click", { location: "header" })}
            >
              Book a Call
            </Button>
          </Box>

          <IconButton
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280, pt: 2 }} role="presentation">
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", px: 2, pb: 1 }}>
            <IconButton aria-label="Close menu" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {navLinks.map((link) => (
              <ListItemButton
                key={link.href}
                component={Link}
                href={link.href}
                selected={pathname === link.href}
                onClick={() => setOpen(false)}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Button
              component={Link}
              href="/book-a-call"
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                setOpen(false);
                trackEvent("cta_book_call_click", { location: "mobile_nav" });
              }}
            >
              Book a Call
            </Button>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
