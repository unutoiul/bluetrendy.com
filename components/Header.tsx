"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { keyframes, type Theme } from "@mui/material/styles";
import ArrowOutward from "@mui/icons-material/ArrowOutward";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Logo from "./Logo";
import Magnetic from "./motion/Magnetic";
import LinkButton from "./LinkButton";
import { navLinks, type NavLink } from "@/data/nav";
import { services } from "@/data/services";
import { serviceIcons } from "./serviceIcons";
import { trackEvent } from "@/lib/analytics";
import { linkedIn } from "@/lib/seo";
import { easeOut } from "@/theme/theme";
import { palette, withAlpha } from "@/theme/palette";

const barHeight = { xs: 64, md: 78 };
// The lockup is drawn at 50px; phones get a smaller one so the bar has room to breathe.
const logoScale = { xs: 0.8, md: 1 };
const email = "contact@bluetrendy.com";
// The mobile menu's row dividers draw in from the left as the rows arrive.
const drawLine = keyframes`from { transform: scaleX(0); } to { transform: none; }`;

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

const iconFor = (href: string) => {
  const service = services.find(item => "/" + item.slug === href);
  return service ? serviceIcons[service.icon] : null;
};

/**
 * The Services link with its menu of the seven services. The link itself still goes to the
 * services page; the menu opens under the mouse, or with the down arrow from the keyboard,
 * and closes on Escape, on a click elsewhere or when the pointer leaves.
 */
function NavMenu({ link, active, lit, onLight }: { link: NavLink; active: boolean; lit: boolean; onLight: (href: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const [byKeyboard, setByKeyboard] = useState(false);
  // Held in state, not a ref, so the menu is positioned once the link exists.
  const [anchor, setAnchor] = useState<HTMLAnchorElement | null>(null);
  const closing = useRef(0);
  const menuId = useId();
  const path = usePathname();

  // A new page closes the menu.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [path]);
  useEffect(() => () => window.clearTimeout(closing.current), []);

  function show(keyboard = false) {
    window.clearTimeout(closing.current);
    setByKeyboard(keyboard);
    setOpen(true);
  }
  // A short grace period, so the pointer can cross the gap between the link and the menu.
  function hideSoon() {
    window.clearTimeout(closing.current);
    closing.current = window.setTimeout(() => setOpen(false), 160);
  }
  function close(refocus = false) {
    window.clearTimeout(closing.current);
    setOpen(false);
    if (refocus) anchor?.focus();
  }

  return (
    <Box sx={{ display: "inline-flex" }} onPointerEnter={event => { if (event.pointerType === "mouse") show(); }} onPointerLeave={hideSoon}>
      <Button ref={setAnchor} component={Link} href={link.href} aria-current={active ? "page" : undefined}
        aria-haspopup="menu" aria-expanded={open} aria-controls={open ? menuId : undefined}
        endIcon={<KeyboardArrowDownRounded sx={{ transition: `rotate 0.3s ${easeOut}`, rotate: open ? "180deg" : "0deg" }} />}
        onPointerEnter={() => onLight(link.href)} onFocus={() => onLight(link.href)} onBlur={() => onLight(null)}
        onKeyDown={event => {
          if (event.key === "ArrowDown") { event.preventDefault(); show(true); }
          if (event.key === "Escape") close();
        }}
        sx={{
          px: { md: 1, lg: 1.35 }, minWidth: 0, position: "relative", zIndex: 0,
          color: active || open ? palette.sky[100] : palette.slate[100],
          "&:hover": { color: palette.sky[100], bgcolor: "transparent" },
          "& .MuiButton-endIcon": { ml: 0.25, mr: -0.5 }, "&:hover .MuiButton-endIcon": { transform: "none" },
        }}>
        {(lit || open) && (
          <Box component={motion.span} layoutId="nav-hover" aria-hidden="true"
            transition={{ type: "spring", stiffness: 480, damping: 36 }}
            sx={{ position: "absolute", inset: "7px 0", zIndex: -1, borderRadius: 999, bgcolor: withAlpha(palette.blue[300], 0.14) }} />
        )}
        {link.label}
        {active && (
          <Box component={motion.span} layoutId="active-nav" aria-hidden="true"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            sx={{ position: "absolute", left: 12, right: 12, bottom: 3, height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${palette.blue[300]}, ${palette.sky[100]})` }} />
        )}
      </Button>
      <Popper open={open} anchorEl={anchor} placement="bottom-start" transition sx={{ zIndex: "modal" }}
        modifiers={[{ name: "offset", options: { offset: [-12, 10] } }]}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: "top left" }}>
            <Paper elevation={0} sx={{
              position: "relative", overflow: "hidden", width: 344, p: 1, borderRadius: "18px", color: palette.slate[50],
              background: `linear-gradient(160deg, ${withAlpha(palette.navy[675], 0.97)}, ${withAlpha(palette.navy[800], 0.98)} 62%)`,
              border: `1px solid ${withAlpha(palette.blue[325], 0.45)}`, backdropFilter: "blur(14px)",
              boxShadow: `inset 0 1px 0 ${withAlpha(palette.sky[175], 0.2)}, 0 0 30px -8px ${withAlpha(palette.blue[350], 0.5)}, 0 28px 56px -24px ${palette.black}`,
              // The lit top edge shared by every glass panel on the site.
              "&::before": { content: '""', position: "absolute", top: 0, left: "12%", right: "12%", height: "1px",
                background: `linear-gradient(90deg, transparent, ${palette.sky[100]}, transparent)`, opacity: 0.7 },
            }}>
              <ClickAwayListener onClickAway={() => close()}>
                <MenuList id={menuId} aria-label="Services" autoFocusItem={byKeyboard} sx={{ p: 0 }}
                  onKeyDown={event => { if (event.key === "Escape" || event.key === "Tab") close(event.key === "Escape"); }}>
                  {link.children?.map(child => {
                    const Icon = iconFor(child.href);
                    const here = path === child.href;
                    return (
                      <MenuItem key={child.href} component={Link} href={child.href} onClick={() => close()} aria-current={here ? "page" : undefined}
                        sx={{
                          gap: 1.5, minHeight: 48, px: 1.25, py: 0.75, pr: 1.25, borderRadius: "12px", fontWeight: 550, fontSize: "0.95rem",
                          color: here ? palette.sky[100] : palette.slate[100], bgcolor: here ? withAlpha(palette.blue[300], 0.14) : "transparent",
                          "&:hover, &.Mui-focusVisible": { bgcolor: withAlpha(palette.blue[300], 0.16), color: palette.white },
                          "&.MuiMenuItem-root.Mui-focusVisible": { outline: `2px solid ${withAlpha(palette.sky[100], 0.7)}`, outlineOffset: -2 },
                          "&:hover .menu-orb, &.Mui-focusVisible .menu-orb": { color: palette.slate[50], borderColor: palette.sky[150],
                            boxShadow: `0 0 16px ${withAlpha(palette.blue[300], 0.6)}` },
                        }}>
                        {Icon && <Box className="menu-orb" aria-hidden="true" sx={{ display: "grid", placeItems: "center", flex: "none", width: 34, height: 34,
                          borderRadius: "10px", color: palette.sky[100], border: `1px solid ${withAlpha(palette.sky[150], 0.35)}`,
                          background: `radial-gradient(circle at 50% 30%, ${withAlpha(palette.blue[300], 0.32)}, ${withAlpha(palette.navy[775], 0.9)} 70%)`,
                          transition: "color 0.25s ease, border-color 0.25s ease, box-shadow 0.3s ease", "& svg": { fontSize: 19 } }}><Icon /></Box>}
                        {child.label}
                        <Box component="span" aria-hidden="true" sx={{ ml: "auto", fontFamily: "var(--font-mono), monospace", fontSize: "0.74rem",
                          color: palette.sky[150], letterSpacing: "0.06em" }}>{child.hint}</Box>
                      </MenuItem>
                    );
                  })}
                  <MenuItem component={Link} href={link.href} onClick={() => close()}
                    sx={{
                      gap: 1, minHeight: 46, mt: 1, px: 1.5, pr: 1.5, borderRadius: "12px", justifyContent: "space-between", fontWeight: 600, fontSize: "0.92rem",
                      color: palette.sky[100], borderTop: `1px solid ${withAlpha(palette.sky[175], 0.18)}`, borderTopLeftRadius: 0, borderTopRightRadius: 0,
                      "&:hover, &.Mui-focusVisible": { bgcolor: withAlpha(palette.blue[300], 0.16), color: palette.white },
                      "&.MuiMenuItem-root.Mui-focusVisible": { outline: `2px solid ${withAlpha(palette.sky[100], 0.7)}`, outlineOffset: -2 },
                      "& svg": { fontSize: 18, transition: `translate 0.3s ${easeOut}` }, "&:hover svg": { translate: "3px 0" },
                    }}>
                    Compare all services <ArrowForwardRounded aria-hidden="true" />
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}

function DetailHeader({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const desktop = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"), { noSsr: true });
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", y => setScrolled(y > 12));
  // A service page lights up "Services", though it lives at the site root.
  const current = (href: string) => path === href || path.startsWith(href + "/")
    || Boolean(navLinks.find(link => link.href === href)?.children?.some(child => child.href === path));

  // A new page closes the menu.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [path]);

  return (
    <AppBar position="sticky" elevation={0} color="transparent"
      sx={{
        // Dark glass, so the header reads as part of the dark banners below it, as on the home page.
        bgcolor: scrolled ? withAlpha(palette.navy[850], 0.84) : palette.navy[800],
        backdropFilter: scrolled ? "saturate(160%) blur(16px)" : "none",
        borderBottom: `1px solid ${palette.navy[650]}`, color: palette.slate[50],
        transition: "background-color 0.35s ease",
      }}>
      <Container>
        <Stack direction="row" sx={{ height: barHeight, alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ zoom: logoScale }}><Logo height={50} spinOnArrival inverse /></Box>
          <Box component="nav" aria-label="Main navigation" onPointerLeave={() => setHovered(null)}
            sx={{ display: { xs: "none", md: "flex" }, gap: { md: 0, lg: 0.5 } }}>
            {navLinks.map(link => {
              const active = current(link.href);
              if (link.children) return <NavMenu key={link.href} link={link} active={active} lit={hovered === link.href} onLight={setHovered} />;
              return (
                <Button key={link.href} component={Link} href={link.href} aria-current={active ? "page" : undefined}
                  onPointerEnter={() => setHovered(link.href)} onFocus={() => setHovered(link.href)} onBlur={() => setHovered(null)}
                  sx={{
                    px: { md: 1, lg: 1.35 }, minWidth: 0, position: "relative", zIndex: 0,
                    color: active ? palette.sky[100] : palette.slate[100],
                    // The sliding pill below is the hover fill.
                    "&:hover": { color: palette.sky[100], bgcolor: "transparent" },
                  }}>
                  {hovered === link.href && (
                    <Box component={motion.span} layoutId="nav-hover" aria-hidden="true"
                      transition={{ type: "spring", stiffness: 480, damping: 36 }}
                      sx={{ position: "absolute", inset: "7px 0", zIndex: -1, borderRadius: 999, bgcolor: withAlpha(palette.blue[300], 0.14) }} />
                  )}
                  {link.label}
                  {active && (
                    <Box component={motion.span} layoutId="active-nav" aria-hidden="true"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      sx={{ position: "absolute", left: 12, right: 12, bottom: 3, height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${palette.blue[300]}, ${palette.sky[100]})` }} />
                  )}
                </Button>
              );
            })}
          </Box>
          <Box sx={{ display: { xs: "none", md: "inline-flex" } }}>
            <Magnetic>
              <LinkButton href="/book-a-call" variant="contained" endIcon={<ArrowOutward />}
                onClick={() => trackEvent("cta_book_call_click", { location: "header" })}>
                Book a call
              </LinkButton>
            </Magnetic>
          </Box>
          <IconButton aria-label="Open menu" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? "mobile-nav" : undefined}
            onClick={() => setOpen(true)} sx={{ display: { md: "none" }, width: 48, height: 48, mr: -1, color: palette.slate[50] }}>
            <MenuGlyph open={false} />
          </IconButton>
        </Stack>
      </Container>
      <MobileMenu open={open && !desktop} onClose={() => setOpen(false)} current={current} />
    </AppBar>
  );
}

function MobileMenu({ open, onClose, current }: { open: boolean; onClose: () => void; current: (href: string) => boolean }) {
  const path = usePathname();
  // The seven services fold under "Services". They start open on a service page.
  const [unfolded, setUnfolded] = useState(false);
  const onService = services.some(item => "/" + item.slug === path);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (open) setUnfolded(onService); }, [open, onService]);
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
            color: palette.slate[50], bgcolor: palette.navy[800], colorScheme: "dark",
            // Starts as the header's navy and deepens downwards, with a faint glow behind the close button.
            backgroundImage: `radial-gradient(90% 45% at 100% 0%, ${withAlpha(palette.blue[300], 0.1)}, transparent 70%), linear-gradient(180deg, ${palette.navy[800]}, ${palette.navy[850]})`,
          },
        },
      }}>
      {/* The same bar as the header, so opening the menu changes only the page beneath it. */}
      <Box sx={{ flexShrink: 0, borderBottom: `1px solid ${palette.navy[650]}` }}>
        <Container>
          <Stack direction="row" sx={{ height: barHeight, alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ zoom: logoScale }}><Logo height={50} inverse onNavigate={onClose} /></Box>
            <IconButton aria-label="Close menu" onClick={onClose} sx={{ width: 48, height: 48, mr: -1, color: palette.slate[50] }}>
              <MenuGlyph open={crossed} />
            </IconButton>
          </Stack>
        </Container>
      </Box>

      <Container sx={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", overscrollBehavior: "contain" }}>
        {/* Large, plain labels on hairline rows. The current page carries the desktop nav's
            gradient underline, so both menus mark it the same way. */}
        <Box component="nav" aria-label="Mobile navigation" sx={{ pt: 1 }}>
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
            {navLinks.map((link, index) => {
              const active = current(link.href);
              return (
                <Box component={motion.li} key={link.href} {...enter(index)}
                  sx={{
                    position: "relative",
                    "&::after": {
                      content: '""', position: "absolute", insetInline: 0, bottom: 0, height: "1px",
                      bgcolor: withAlpha(palette.slate[275], 0.16), transformOrigin: "0 50%",
                      animation: `${drawLine} 0.7s ${easeOut} both`, animationDelay: `${0.1 + index * 0.05}s`,
                    },
                    "@media (prefers-reduced-motion: reduce)": { "&::after": { animation: "none" } },
                  }}>
                  <Box component={Link} href={link.href} aria-current={active ? "page" : undefined} onClick={onClose}
                    sx={{
                      display: "flex", alignItems: "center", minHeight: 52, py: 1,
                      textDecoration: "none", WebkitTapHighlightColor: "transparent",
                      color: active ? palette.sky[100] : palette.slate[50],
                      // Clearly smaller than the logo's wordmark, so the brand leads the panel.
                      fontSize: "1rem", fontWeight: 500, letterSpacing: "-0.005em", lineHeight: 1.25,
                      transition: "color 0.2s ease",
                      "& .label": { position: "relative", transition: `translate 0.35s ${easeOut}` },
                      "&:hover, &:active": { color: active ? palette.sky[100] : palette.white },
                      "&:hover .label, &:focus-visible .label": { translate: "6px 0" },
                      "&:focus-visible": { outline: `2px solid ${palette.sky[100]}`, outlineOffset: 2, borderRadius: "6px" },
                      ...(active && {
                        "& .label::after": {
                          content: '""', position: "absolute", left: 0, right: 0, bottom: "-5px", height: "2px", borderRadius: "2px",
                          background: `linear-gradient(90deg, ${palette.blue[300]}, ${palette.sky[100]})`,
                          boxShadow: `0 0 12px ${withAlpha(palette.blue[300], 0.5)}`,
                        },
                      }),
                      "@media (prefers-reduced-motion: reduce)": { "& .label": { transition: "none" } },
                    }}>
                    <span className="label">{link.label}</span>
                  </Box>
                  {link.children && <>
                    <IconButton aria-label={unfolded ? "Hide the list of services" : "Show the list of services"} aria-expanded={unfolded}
                      aria-controls="mobile-services" onClick={() => setUnfolded(value => !value)}
                      sx={{ position: "absolute", top: 4, right: 0, width: 44, height: 44, px: "2px", justifyContent: "flex-end", color: palette.sky[100],
                        "& svg": { transition: `rotate 0.3s ${easeOut}`, rotate: unfolded ? "180deg" : "0deg" } }}>
                      <KeyboardArrowDownRounded />
                    </IconButton>
                    <Collapse in={unfolded} id="mobile-services">
                      <Box component="ul" sx={{ listStyle: "none", m: "0 0 10px", p: "0 0 0 14px", display: "grid", gap: "2px",
                        borderLeft: `1px solid ${withAlpha(palette.sky[175], 0.25)}` }}>
                        {link.children.map(child => {
                          const here = path === child.href;
                          return (
                            <li key={child.href}>
                              <Box component={Link} href={child.href} aria-current={here ? "page" : undefined} onClick={onClose}
                                sx={{ display: "flex", alignItems: "center", gap: 1.5, minHeight: 44, textDecoration: "none",
                                  color: here ? palette.sky[100] : palette.slate[125], fontSize: "0.95rem", fontWeight: here ? 600 : 500, lineHeight: 1.25,
                                  transition: "color 0.2s ease", "&:hover, &:active": { color: palette.white },
                                  "&:focus-visible": { outline: `2px solid ${palette.sky[100]}`, outlineOffset: 2, borderRadius: "6px" } }}>
                                <Box component="span" aria-hidden="true" sx={{ fontFamily: "var(--font-mono), monospace", fontSize: "0.74rem", color: palette.sky[150] }}>{child.hint}</Box>
                                {child.label}
                              </Box>
                            </li>
                          );
                        })}
                      </Box>
                    </Collapse>
                  </>}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* The call to action sits at the bottom, where a thumb reaches it. */}
        <Box component={motion.div} {...enter(navLinks.length)}
          sx={{ mt: "auto", pt: 5, pb: "calc(20px + env(safe-area-inset-bottom))" }}>
          <Box component="p" sx={{ m: 0, color: palette.slate[50], fontSize: 17, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.35 }}>
            Free 30-minute AI Opportunity Call
          </Box>
          <Box component="p" sx={{ m: "4px 0 16px", color: palette.slate[275], fontSize: 15, lineHeight: 1.5 }}>
            We’ll find your first AI project with you.
          </Box>
          <LinkButton href="/book-a-call" variant="contained" size="large" fullWidth endIcon={<ArrowOutward />}
            onClick={() => { onClose(); trackEvent("cta_book_call_click", { location: "mobile_nav" }); }}>
            Book a call
          </LinkButton>
          <Stack direction="row" sx={{
            mt: 1.5, justifyContent: "space-between", flexWrap: "wrap", columnGap: 2,
            "& a": {
              display: "inline-flex", alignItems: "center", gap: 1, minHeight: 44,
              color: palette.slate[200], fontSize: 14, fontWeight: 500, textDecoration: "none",
              transition: "color 0.2s ease",
            },
            "& a:hover, & a:focus-visible": { color: palette.white, textDecoration: "underline", textUnderlineOffset: "0.25em" },
            "& svg": { fontSize: 18, color: palette.slate[275] },
          }}>
            <a href={`mailto:${email}`}><MailOutlineRounded aria-hidden="true" />{email}</a>
            <a href={linkedIn} target="_blank" rel="noopener noreferrer" aria-label="BlueTrendy on LinkedIn (opens in a new tab)">
              <LinkedInIcon aria-hidden="true" />LinkedIn
            </a>
          </Stack>
        </Box>
      </Container>
    </Dialog>
  );
}
