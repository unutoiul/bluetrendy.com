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
import Logo from "./Logo";
import { navLinks } from "@/data/nav";
import { trackEvent } from "@/lib/analytics";

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
      }}
    >
      <Container>
        <Toolbar disableGutters sx={{ height: 76, justifyContent: "space-between" }}>
          <Logo height={32} />

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
            <Logo height={26} href={null} />
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
