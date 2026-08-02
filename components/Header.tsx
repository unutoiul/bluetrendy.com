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
import Logo, { LOGO_HEIGHT, logoWidth } from "./Logo";
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

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
        {/* White badge, flush with the top of the bar, arcing past its bottom edge. */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: { xs: 12, md: 24 },
            top: 0,
            width: badgeWidth,
            height: { xs: BAR_H + BADGE_DROP.xs, md: BAR_H + BADGE_DROP.md },
            // Same translucent surface as the bar, and no border, so the badge
            // reads as the bar simply bulging downward rather than a separate shape.
            bgcolor: "rgba(255,255,255)",
            borderRadius: {
              xs: `0 0 ${badgeWidth.xs / 2}px ${badgeWidth.xs / 2}px / 0 0 ${BADGE_DROP.xs + 32}px ${BADGE_DROP.xs + 36}px`,
              md: `0 0 ${badgeWidth.md / 2}px ${badgeWidth.md / 2}px / 0 0 ${BADGE_DROP.md + 16}px ${BADGE_DROP.md + 16}px`,
            },
            pointerEvents: "none",
          }}
        />

        <Toolbar disableGutters sx={{ height: BAR_H, justifyContent: "space-between" }}>
          {/* Reserves the badge's footprint; the logo itself is centred inside it. */}
          <Box
            sx={{
              width: badgeWidth,
              height: BAR_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pb: 1 }}>
            <Logo height={32} href={null} />
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
