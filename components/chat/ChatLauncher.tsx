"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { keyframes } from "@mui/material/styles";
import { crispWebsiteId, openCrisp } from "@/lib/crisp";
import { trackEvent } from "@/lib/analytics";
import { palette, withAlpha } from "@/theme/palette";
import ChatMark from "./ChatMark";

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

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
// One ring of light leaves the button when it first arrives.
const arrive = keyframes`
  from { opacity: 0; transform: translateY(18px) scale(.8); }
  to { opacity: 1; transform: none; }
`;

type State = "idle" | "loading" | "open";

/**
 * The live chat button, in the corner of every page. It is ours, not Crisp's: Crisp loads only
 * when someone presses it (see lib/crisp.ts). It hides while the chat is open, counts replies
 * that arrive while the chat is closed, and sends people to the contact form if Crisp isn't
 * set up or can't load.
 */
export default function ChatLauncher() {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [unread, setUnread] = useState(0);
  const isOpen = useRef(false);
  const fallback = useRef(0);

  useEffect(() => () => window.clearTimeout(fallback.current), []);

  function start() {
    trackEvent("chat_open", { configured: Boolean(crispWebsiteId) });
    if (!crispWebsiteId) {
      router.push("/contact#project-brief");
      return;
    }
    setUnread(0);
    if (state === "idle") setState("loading");
    // If the chat hasn't appeared within ten seconds (blocked or offline), use the contact form.
    window.clearTimeout(fallback.current);
    fallback.current = window.setTimeout(() => {
      if (isOpen.current) return;
      setState("idle");
      router.push("/contact#project-brief");
    }, 10000);
    openCrisp({
      onReady: () => window.clearTimeout(fallback.current),
      onOpened: () => { window.clearTimeout(fallback.current); isOpen.current = true; setUnread(0); setState("open"); },
      onClosed: () => { isOpen.current = false; setState("idle"); },
      onMessage: () => { if (!isOpen.current) setUnread(count => count + 1); },
    });
  }

  const loading = state === "loading";
  const label = unread ? `Chat with us, ${unread} new ${unread === 1 ? "reply" : "replies"}` : "Chat with us";

  return (
    <Box sx={{
      position: "fixed", zIndex: 1240,
      right: { xs: "max(16px, env(safe-area-inset-right))", md: 28 },
      bottom: { xs: "calc(16px + env(safe-area-inset-bottom))", md: 28 },
      // While Crisp's window is open it takes this corner.
      opacity: state === "open" ? 0 : 1, visibility: state === "open" ? "hidden" : "visible",
      transition: "opacity .25s ease, visibility .25s",
      animation: `${arrive} .7s ${ease} 1.2s both`,
      "@media print": { display: "none" },
    }}>
      <ButtonBase onClick={start} aria-label={label} aria-busy={loading} title="Chat with the BlueTrendy team"
        sx={{
          position: "relative", display: "flex", alignItems: "center",
          height: { xs: 58, md: 62 }, minWidth: { xs: 58, md: 62 }, p: "2px", borderRadius: 999,
          // The rim: a beam of light circling a dark ring.
          background: `conic-gradient(from var(--beam-angle), ${withAlpha(palette.sky[150], 0.15)} 0deg, ${palette.sky[100]} 40deg, ${palette.blue[350]} 80deg, ${withAlpha(palette.blue[350], 0.12)} 140deg, ${withAlpha(palette.sky[150], 0.15)} 360deg)`,
          animation: `${orbit} ${loading ? "1.1s" : "5s"} linear infinite`,
          boxShadow: `0 18px 40px -16px ${withAlpha(palette.black, 0.85)}, 0 0 26px -4px ${withAlpha(palette.blue[350], 0.55)}`,
          transition: `transform .35s ${ease}, box-shadow .35s ease`,
          // The face: deep navy glass, lit from the top.
          "& .chat-face": {
            display: "flex", alignItems: "center", height: "100%", borderRadius: "inherit",
            // Lit from above the icon, which always sits at the right-hand end.
            background: `radial-gradient(circle at calc(100% - 29px) 22%, ${withAlpha(palette.blue[300], 0.45)}, ${palette.navy[775]} 40px), ${palette.navy[775]}`,
            boxShadow: `inset 0 1px 0 ${withAlpha(palette.sky[175], 0.35)}, inset 0 0 18px ${withAlpha(palette.blue[350], 0.3)}`,
          },
          "& .chat-icon": { display: "grid", placeItems: "center", flex: "none", width: { xs: 54, md: 58 }, height: "100%",
            filter: `drop-shadow(0 0 6px ${withAlpha(palette.blue[250], 0.9)})` },
          // "Chat with us" slides out to the left on hover or keyboard focus.
          "& .chat-label": {
            maxWidth: 0, overflow: "hidden", whiteSpace: "nowrap", opacity: 0, color: palette.slate[50], fontSize: ".95rem", fontWeight: 650,
            letterSpacing: "-.01em", transition: `max-width .45s ${ease}, opacity .3s ease, padding .45s ${ease}`,
          },
          "& .chat-node": { transformBox: "fill-box", transformOrigin: "center", animation: `${typing} 1.5s ease-in-out infinite` },
          "& .chat-node:nth-of-type(2)": { animationDelay: ".18s" },
          "& .chat-node:nth-of-type(3)": { animationDelay: ".36s" },
          "& .chat-spark": { animation: `${spark} 1.6s ${ease} infinite` },
          "@media (hover: hover)": {
            "&:hover": { transform: "translateY(-3px)", boxShadow: `0 22px 44px -16px ${withAlpha(palette.black, 0.9)}, 0 0 36px -2px ${withAlpha(palette.blue[300], 0.75)}` },
            "&:hover .chat-label": { maxWidth: 160, opacity: 1, pl: 2.5 },
          },
          "&.Mui-focusVisible .chat-label": { maxWidth: 160, opacity: 1, pl: 2.5 },
          "&.Mui-focusVisible": { outline: `2px solid ${palette.sky[100]}`, outlineOffset: 4 },
          "&:active": { transform: "scale(.95)" },
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none", transition: "none",
            "& .chat-node, & .chat-spark": { animation: "none" },
            "& .chat-label": { transition: "none" },
          },
        }}>
        <Box component="span" className="chat-face">
          <Box component="span" className="chat-label" aria-hidden="true">Chat with us</Box>
          <Box component="span" className="chat-icon"><ChatMark /></Box>
        </Box>

        {/* Top right: a count of replies waiting, or a green light that says someone is here. */}
        {unread
          ? <Box component="span" aria-hidden="true" sx={{ position: "absolute", top: -3, right: -3, display: "grid", placeItems: "center", minWidth: 22, height: 22, px: 0.5,
              borderRadius: 99, fontSize: 12, fontWeight: 700, color: palette.navy[800], background: `linear-gradient(140deg, ${palette.slate[75]}, ${palette.sky[150]})`,
              boxShadow: `0 0 0 2px ${palette.navy[800]}, 0 0 14px ${palette.sky[150]}` }}>{unread > 9 ? "9+" : unread}</Box>
          : <Box component="span" aria-hidden="true" sx={{ position: "absolute", top: 3, right: 3, width: 12, height: 12, borderRadius: "50%",
              background: palette.green[175], border: `2px solid ${palette.navy[800]}`, animation: `${breathe} 2.4s ease-out infinite`,
              "@media (prefers-reduced-motion: reduce)": { animation: "none" } }} />}
      </ButtonBase>
    </Box>
  );
}
