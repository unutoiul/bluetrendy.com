"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ArrowOutward from "@mui/icons-material/ArrowOutward";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import heroStill from "@/public/brand/blue-ribbon-studio.webp";
import Magnetic from "@/components/motion/Magnetic";
import { trackEvent } from "@/lib/analytics";

const tablet = "@media (min-width: 720px) and (max-width: 899.95px)";
const smallPhone = "@media (max-width: 359px)";

const services = [
  { label: "Web platforms", slug: "ai-native-web-apps" },
  { label: "Mobile apps", slug: "mobile-cross-platform" },
  { label: "AI workflows", slug: "ai-automation-applied-ml" },
];

type Tilt = { tiltX: MotionValue<number>; tiltY: MotionValue<number> };

function RibbonSculpture({ tiltX, tiltY }: Tilt) {
  // The sculpture leans toward the pointer, as if lit and turned on its plinth.
  const spring = { stiffness: 80, damping: 18, mass: 0.9 };
  const leanX = useSpring(tiltX, spring);
  const leanY = useSpring(tiltY, spring);
  const rotateY = useTransform(leanX, value => value * 7);
  const rotateX = useTransform(leanY, value => value * -5);
  const x = useTransform(leanX, value => value * 14);
  const y = useTransform(leanY, value => value * 9);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPlayback = useRef<boolean | null>(null);
  const refreshPlayback = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const entrance = document.querySelector<HTMLDialogElement>("dialog[data-website-entrance]");
    let inView = false;
    function refresh() {
      if (!video) return;
      if (!(userPlayback.current ?? !reduced.matches) || !inView || document.hidden || entrance?.open) {
        video.pause();
        return;
      }
      if (!video.hasAttribute("src")) video.src = "/brand/blue-ribbon-turntable.mp4";
      if (video.paused) void video.play().catch(() => { /* The play button is available if autoplay is blocked. */ });
    }
    function onPreferenceChange() {
      userPlayback.current = null;
      refresh();
      if (reduced.matches && video && video.readyState >= 1) video.currentTime = 0;
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      refresh();
    }, { threshold: [0, 0.2] });
    observer.observe(video);
    const gateObserver = new MutationObserver(refresh);
    if (entrance) gateObserver.observe(entrance, { attributes: true, attributeFilter: ["open"] });
    refreshPlayback.current = refresh;
    document.addEventListener("visibilitychange", refresh);
    reduced.addEventListener("change", onPreferenceChange);
    return () => {
      observer.disconnect();
      gateObserver.disconnect();
      document.removeEventListener("visibilitychange", refresh);
      reduced.removeEventListener("change", onPreferenceChange);
      video.pause();
    };
  }, [failed]);

  return (
    <Box component="figure"
      sx={{
        m: 0, pointerEvents: "none", position: { xs: "relative", md: "absolute" },
        width: { xs: "min(130%, 730px)", md: "78%" }, aspectRatio: "3 / 2",
        left: { xs: "50%", md: "34%" }, top: { md: "50%" },
        transform: { xs: "translateX(-50%)", md: "translateY(-50%)" },
        [tablet]: { position: "absolute", width: "83%", left: "31%", top: "50%", transform: "translateY(-50%)" },
      }}>
      <Box className="sculpt-in" sx={{ width: "100%", height: "100%", "--d": "0.2s" }}>
        <Box component={motion.div} style={{ x, y, rotateX, rotateY, transformPerspective: 1100 }}
          sx={{ width: "100%", height: "100%", position: "relative",
            maskImage: "linear-gradient(to right, transparent, black 19%, black 94%, transparent), linear-gradient(to bottom, transparent, black 12%, black 83%, transparent)",
            maskComposite: "intersect" }}>
          <Image src={heroStill} alt="The BlueTrendy ribbon in cobalt glass and brushed titanium on a circular plinth."
            preload sizes="(max-width: 599px) 130vw, (max-width: 719px) 730px, (max-width: 1199px) 83vw, 958px"
            style={{ width: "100%", height: "100%", display: "block" }} />
          <Box component="video" ref={videoRef} aria-hidden="true" width={1080} height={720}
            muted playsInline loop preload="none" disablePictureInPicture
            onLoadedData={() => setReady(true)} onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)} onError={() => setFailed(true)}
            sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: ready && !failed ? 1 : 0 }} />
        </Box>
      </Box>
      {!failed && <IconButton aria-label={playing ? "Pause sculpture rotation" : "Play sculpture rotation"}
        title={playing ? "Pause sculpture rotation" : "Play sculpture rotation"}
        onClick={() => {
          userPlayback.current = videoRef.current?.paused ?? true;
          refreshPlayback.current();
        }}
        sx={{ position: "absolute", right: "15%", top: "9%", width: 44, height: 44,
          pointerEvents: "auto", color: "#e2f5ff", bgcolor: "#081829dc", border: "1px solid #54728b",
          "&:hover": { bgcolor: "#163a55" }, "&.Mui-focusVisible": { outline: "3px solid #a5e5ff", outlineOffset: 3 } }}>
        {playing ? <PauseRounded fontSize="small" /> : <PlayArrowRounded fontSize="small" />}
      </IconButton>}
    </Box>
  );
}

const lines = [
  { text: "Your website ", delay: "0.12s" },
  { text: "or app, ", delay: "0.22s" },
  { text: "live in days.", delay: "0.32s", sx: { color: "#9edbff", fontWeight: 490 } },
];

export default function Hero() {
  const reduced = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const [lit, setLit] = useState(false);
  const glow = useMotionTemplate`radial-gradient(560px circle at ${glowX}px ${glowY}px, rgba(46,128,255,0.17), transparent 62%)`;

  function track(event: React.PointerEvent<HTMLElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    glowX.set(event.clientX - box.left);
    glowY.set(event.clientY - box.top);
    tiltX.set(((event.clientX - box.left) / box.width) * 2 - 1);
    tiltY.set(((event.clientY - box.top) / box.height) * 2 - 1);
    if (!lit) setLit(true);
  }

  function rest() {
    tiltX.set(0);
    tiltY.set(0);
    setLit(false);
  }

  return (
    <Box component="section" id="home-content" tabIndex={-1} aria-labelledby="hero-heading"
      onPointerMove={track} onPointerLeave={rest}
      sx={{
        position: "relative", overflow: "clip", isolation: "isolate", scrollMarginTop: 78, color: "#f4f8ff", bgcolor: "#020a14",
        backgroundImage: "radial-gradient(ellipse at 62% 48%, #071b34 0%, #030e1c 50%, #020912 82%)",
        "& a:focus-visible": { outline: "3px solid #a5e5ff", outlineOffset: 3 },
      }}>
      <Box component={motion.div} aria-hidden="true" style={{ background: glow }}
        sx={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: lit ? 1 : 0, transition: "opacity 0.6s ease" }} />
      <Container sx={{ position: "relative" }}>
        <Box sx={{ position: "relative", display: { md: "flex" }, alignItems: "center",
          minHeight: { md: "clamp(495px, 43vw, 604px)" }, pt: { xs: 4, sm: 5, md: 0 },
          [tablet]: { display: "flex", minHeight: 420, pt: 0 } }}>
          <Box sx={{ position: "relative", zIndex: 1, width: { md: "49%" }, py: { md: 6.5 },
            [tablet]: { width: "49%", py: 4.5 } }}>
            <Typography className="arrive" sx={{ fontSize: { xs: 14, md: 15 }, color: "#a4c7e6", fontWeight: 540, mb: { xs: 2.5, md: 3 }, "--d": "0.05s" }}>
              Custom software studio
            </Typography>
            <Typography variant="h1" id="hero-heading"
              sx={{ m: 0, fontSize: { xs: "clamp(3rem, 12vw, 4.8rem)", sm: "4.75rem", md: "clamp(4rem, 5.95vw, 5.75rem)" },
                fontWeight: 635, letterSpacing: "-0.05em", lineHeight: 1.015,
                [tablet]: { fontSize: "clamp(3.15rem, 6.7vw, 3.65rem)" } }}>
              {lines.map(line => (
                <Box key={line.text} component="span" className="line-mask">
                  <Box component="span" sx={{ ...line.sx, "--d": line.delay }}>{line.text}</Box>
                </Box>
              ))}
            </Typography>
            <Typography className="arrive" sx={{ maxWidth: "37ch", mt: { xs: 2, md: 3 }, color: "#c1d1e0", lineHeight: 1.55, fontSize: { xs: 16, md: 17 }, "--d": "0.5s" }}>
              Work directly with a senior engineer to design, build, and launch your first release with AI.
            </Typography>
            <Stack direction="row" className="arrive" sx={{ flexWrap: "wrap", alignItems: "center", gap: { xs: 1, sm: 2.2 }, mt: { xs: 2.5, md: 3.5 }, "--d": "0.62s" }}>
              <Magnetic>
                <Button component={Link} href="/book-a-call" variant="contained" endIcon={<ArrowOutward />}
                  onClick={() => trackEvent("cta_book_call_click", { location: "hero" })}
                  sx={{ bgcolor: "#e1f2ff", color: "#071a2a", px: 2.5, [smallPhone]: { px: 2 },
                    "&:hover": { bgcolor: "#fff", boxShadow: "0 0 0 6px rgba(158,219,255,0.14), 0 18px 40px -16px rgba(120,200,255,0.75)" } }}>Book a call</Button>
              </Magnetic>
              <Button component={Link} href="/case-studies" endIcon={<ArrowForward sx={{ width: 17 }} />}
                sx={{ color: "#f3f8ff", px: 1, "--underline-inset": "8px",
                  [smallPhone]: { px: 0.5, fontSize: 13, "& .MuiButton-endIcon": { display: "none" } } }}>Explore case studies</Button>
            </Stack>
          </Box>
          <RibbonSculpture tiltX={tiltX} tiltY={tiltY} />
        </Box>
        <Box component="nav" aria-label="Explore engineering services" className="arrive"
          sx={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: { xs: "space-between", sm: "flex-start" },
            columnGap: { sm: 4.5 }, borderTop: "1px solid #354455", py: { xs: 0.5, md: 1 }, color: "#c9dcec", "--d": "0.78s" }}>
          {services.map(({ label, slug }) => (
            <Button key={slug} component={Link} href={`/services#${slug}`} endIcon={<ArrowOutward />}
              sx={{ px: { xs: 0.4, sm: 0.8 }, minWidth: 0, gap: 0.25, fontSize: { xs: 12, sm: 14 }, color: "inherit",
                "--underline-inset": { xs: "3px", sm: "6px" },
                "& .MuiButton-endIcon": { ml: { xs: 0.25, sm: 0.8 } },
                [smallPhone]: { "& .MuiButton-endIcon": { display: "none" } },
                "& .MuiButton-endIcon > *": { fontSize: 14, color: "#89c5f2" },
                "&:hover": { color: "#fff" } }}>{label}</Button>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
