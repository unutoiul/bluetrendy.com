"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import GlobalStyles from "@mui/material/GlobalStyles";
import { keyframes } from "@mui/material/styles";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { closeCrisp, crispLauncher, crispTakesScreen, crispWebsiteId, openCrisp } from "@/lib/crisp";
import { trackEvent } from "@/lib/analytics";
import { palette, withAlpha } from "@/theme/palette";
import ChatMark from "./ChatMark";

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
// One timing for every change of state, opening and closing alike.
const morph = `.42s ${ease}`;
const size = 60;
// Centred on Crisp's own button, so the chat window opens from exactly where ours sits.
const right = crispLauncher.right + crispLauncher.size / 2 - size / 2;
const bottom = crispLauncher.bottom + crispLauncher.size / 2 - size / 2;

// A beam of light runs round the rim (the --beam-angle property is registered in globalStyles).
const orbit = keyframes`to { --beam-angle: 360deg; }`;
// The three neurons light one after another, like someone typing.
const typing = keyframes`
  0%, 60%, 100% { opacity: .35; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-1.6px); }
`;
// Current along the thread between them.
const spark = keyframes`from { stroke-dashoffset: .14; } to { stroke-dashoffset: -1; }`;
// The "we're here" light breathes.
const breathe = keyframes`
  0% { box-shadow: 0 0 0 0 ${withAlpha(palette.green[175], 0.55)}; }
  70%, 100% { box-shadow: 0 0 0 7px ${withAlpha(palette.green[175], 0)}; }
`;
// The button rises into place once. ChatLauncher mounts it after the page has loaded, so only
// a short pause is needed here.
const arrive = keyframes`
  from { opacity: 0; transform: translateY(18px) scale(.8); }
  to { opacity: 1; transform: none; }
`;
// A ring of light leaves the button each time the chat opens or closes.
const ping = keyframes`
  from { opacity: .7; transform: scale(1); }
  to { opacity: 0; transform: scale(1.7); }
`;
// While Crisp loads, a soft halo breathes behind the button.
const waiting = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 ${withAlpha(palette.sky[150], 0.45)}; }
  50% { box-shadow: 0 0 0 10px ${withAlpha(palette.sky[150], 0)}; }
`;

// Crisp's own button stays out of sight: ours replaces it. On a phone, where Crisp can fill the
// screen with its own close button in the header, it is left alone while the chat is open.
// These hooks are Crisp's markup rather than a documented API; if they ever change, Crisp's
// button is still covered, because ours sits on top of it at the same spot.
const hideCrispLauncher = {
  "#crisp-chatbox [role='button'][data-maximized='false'], #crisp-chatbox:not([data-mobile-view='true']):not([data-full-view='true']) [role='button'][data-maximized]": {
    visibility: "hidden !important", pointerEvents: "none !important",
  },
} as const;

type State = "idle" | "loading" | "open";

/**
 * The live chat button, in the corner of every page. It is ours, not Crisp's: Crisp loads only
 * when someone presses it (see lib/crisp.ts). ChatLauncher brings this in after the page has loaded. It turns into a close button while the chat is
 * open, with the same motion in both directions, counts replies that arrive while the chat is
 * closed, and sends people to the contact form if Crisp isn't set up or can't load.
 */
export default function ChatButton() {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [fullScreen, setFullScreen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [toggles, setToggles] = useState(0);
  const isOpen = useRef(false);
  const fallback = useRef(0);

  useEffect(() => () => window.clearTimeout(fallback.current), []);

  function opened() {
    window.clearTimeout(fallback.current);
    // Crisp's event and our own check can both report the same opening.
    if (isOpen.current) return;
    isOpen.current = true;
    setUnread(0);
    setFullScreen(crispTakesScreen());
    setState("open");
    setToggles(count => count + 1);
  }

  function closed() {
    if (!isOpen.current) return;
    isOpen.current = false;
    setFullScreen(false);
    setState("idle");
    setToggles(count => count + 1);
  }

  function press() {
    if (state === "loading") return;
    if (state === "open") {
      closeCrisp();
      return;
    }
    trackEvent("chat_open", { configured: Boolean(crispWebsiteId) });
    if (!crispWebsiteId) {
      router.push("/contact#project-brief");
      return;
    }
    setUnread(0);
    if (!window.$crisp) setState("loading");
    // If the chat hasn't appeared within ten seconds (blocked or offline), use the contact form.
    window.clearTimeout(fallback.current);
    fallback.current = window.setTimeout(() => {
      if (isOpen.current) return;
      setState("idle");
      router.push("/contact#project-brief");
    }, 10000);
    openCrisp({
      onReady: () => window.clearTimeout(fallback.current),
      onOpened: opened,
      onClosed: closed,
      onMessage: () => { if (!isOpen.current) setUnread(count => count + 1); },
    });
  }

  const open = state === "open";
  const loading = state === "loading";
  const label = open ? "Close chat"
    : unread ? `Chat with us, ${unread} new ${unread === 1 ? "reply" : "replies"}` : "Chat with us";

  return (
    <Box sx={{
      position: "fixed", zIndex: 1240, right, bottom: `max(${bottom}px, env(safe-area-inset-bottom))`,
      // When Crisp fills a phone screen it brings its own close button, so ours steps aside.
      opacity: fullScreen ? 0 : 1, transform: fullScreen ? "scale(.6)" : "none",
      visibility: fullScreen ? "hidden" : "visible", pointerEvents: fullScreen ? "none" : "auto",
      transition: `opacity .3s ease, transform ${morph}, visibility .3s`,
      // "backwards", not "both": once it has played, the transitions above take over again.
      animation: `${arrive} .7s ${ease} .3s backwards`,
      "@media print": { display: "none" },
      "@media (prefers-reduced-motion: reduce)": { animation: "none", transition: "none" },
    }}>
      <GlobalStyles styles={hideCrispLauncher} />
      <ButtonBase onClick={press} aria-label={label} aria-expanded={open} aria-busy={loading} data-state={state}
        title={open ? "Close chat" : "Chat with the BlueTrendy team"}
        sx={{
          position: "relative", display: "flex", alignItems: "center",
          height: size, minWidth: size, p: "2px", borderRadius: 999,
          // The rim: a beam of light circling a dark ring. It runs faster while the chat loads.
          background: `conic-gradient(from var(--beam-angle), ${withAlpha(palette.sky[150], 0.15)} 0deg, ${palette.sky[100]} 40deg, ${palette.blue[350]} 80deg, ${withAlpha(palette.blue[350], 0.12)} 140deg, ${withAlpha(palette.sky[150], 0.15)} 360deg)`,
          animation: `${orbit} ${loading ? "1.1s" : "5s"} linear infinite${loading ? `, ${waiting} 1.4s ease-in-out infinite` : ""}`,
          boxShadow: `0 18px 40px -16px ${withAlpha(palette.black, 0.85)}, 0 0 26px -4px ${withAlpha(palette.blue[350], 0.55)}`,
          transition: `transform .35s ${ease}, box-shadow .35s ease`,
          // The face: deep navy glass, lit from above the icon at the right-hand end.
          "& .chat-face": {
            display: "flex", alignItems: "center", height: "100%", borderRadius: "inherit",
            background: `radial-gradient(circle at calc(100% - 28px) 22%, ${withAlpha(palette.blue[300], 0.45)}, ${palette.navy[775]} 40px), ${palette.navy[775]}`,
            boxShadow: `inset 0 1px 0 ${withAlpha(palette.sky[175], 0.35)}, inset 0 0 18px ${withAlpha(palette.blue[350], 0.3)}`,
          },
          "& .chat-icon": { position: "relative", display: "grid", placeItems: "center", flex: "none", width: size - 4, height: "100%",
            filter: `drop-shadow(0 0 6px ${withAlpha(palette.blue[250], 0.9)})` },
          // The bubble and the close cross share one spot and turn into each other.
          "& .chat-glyph": { gridArea: "1 / 1", display: "grid", placeItems: "center",
            transition: `opacity .3s ease, transform ${morph}` },
          "& .chat-glyph-close": { opacity: 0, transform: "rotate(90deg) scale(.4)", color: palette.slate[50], "& svg": { fontSize: 28 } },
          "&[data-state='open'] .chat-glyph-mark": { opacity: 0, transform: "rotate(-90deg) scale(.4)" },
          "&[data-state='open'] .chat-glyph-close": { opacity: 1, transform: "none" },
          // "Chat with us" slides out to the left on hover or keyboard focus, but not while the chat is open.
          "& .chat-label": {
            maxWidth: 0, overflow: "hidden", whiteSpace: "nowrap", opacity: 0, color: palette.slate[50], fontSize: ".95rem", fontWeight: 650,
            letterSpacing: "-.01em", transition: `max-width ${morph}, opacity .3s ease, padding ${morph}`,
          },
          "& .chat-node": { transformBox: "fill-box", transformOrigin: "center", animation: `${typing} 1.5s ease-in-out infinite` },
          "& .chat-node:nth-of-type(2)": { animationDelay: ".18s" },
          "& .chat-node:nth-of-type(3)": { animationDelay: ".36s" },
          "& .chat-spark": { animation: `${spark} 1.6s ${ease} infinite` },
          // The status light (or the count of new replies) folds away while the chat is open.
          "& .chat-status": { transition: `opacity .3s ease, transform ${morph}` },
          "&[data-state='open'] .chat-status": { opacity: 0, transform: "scale(.3)" },
          "@media (hover: hover)": {
            "&:hover": { transform: "translateY(-3px)", boxShadow: `0 22px 44px -16px ${withAlpha(palette.black, 0.9)}, 0 0 36px -2px ${withAlpha(palette.blue[300], 0.75)}` },
            "&:not([data-state='open']):hover .chat-label": { maxWidth: 160, opacity: 1, pl: 2.5 },
          },
          "&.Mui-focusVisible:not([data-state='open']) .chat-label": { maxWidth: 160, opacity: 1, pl: 2.5 },
          "&.Mui-focusVisible": { outline: `2px solid ${palette.sky[100]}`, outlineOffset: 4 },
          "&:active": { transform: "scale(.95)" },
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none", transition: "none",
            "& .chat-node, & .chat-spark, & .chat-ping": { animation: "none" },
            "& .chat-label, & .chat-glyph, & .chat-status": { transition: "none" },
          },
        }}>
        {/* The same ring of light leaves the button whenever the chat opens or closes. */}
        {toggles > 0 && <Box key={toggles} component="span" aria-hidden="true" className="chat-ping"
          sx={{ position: "absolute", inset: 0, borderRadius: "inherit", border: `2px solid ${palette.sky[150]}`, pointerEvents: "none",
            animation: `${ping} .6s ${ease} both` }} />}

        <Box component="span" className="chat-face">
          <Box component="span" className="chat-label" aria-hidden="true">Chat with us</Box>
          <Box component="span" className="chat-icon">
            <Box component="span" className="chat-glyph chat-glyph-mark"><ChatMark /></Box>
            <Box component="span" className="chat-glyph chat-glyph-close"><CloseRounded /></Box>
          </Box>
        </Box>

        {/* Top right: a count of replies waiting, or a green light that says someone is here. */}
        {unread
          ? <Box component="span" aria-hidden="true" className="chat-status" sx={{ position: "absolute", top: -3, right: -3, display: "grid", placeItems: "center",
              minWidth: 22, height: 22, px: 0.5, borderRadius: 99, fontSize: 12, fontWeight: 700, color: palette.navy[800],
              background: `linear-gradient(140deg, ${palette.slate[75]}, ${palette.sky[150]})`,
              boxShadow: `0 0 0 2px ${palette.navy[800]}, 0 0 14px ${palette.sky[150]}` }}>{unread > 9 ? "9+" : unread}</Box>
          : <Box component="span" aria-hidden="true" className="chat-status" sx={{ position: "absolute", top: 3, right: 3, width: 12, height: 12, borderRadius: "50%",
              background: palette.green[175], border: `2px solid ${palette.navy[800]}`, animation: `${breathe} 2.4s ease-in-out infinite`,
              "@media (prefers-reduced-motion: reduce)": { animation: "none" } }} />}
      </ButtonBase>
    </Box>
  );
}
