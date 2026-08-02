"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { AnimatePresence, motion } from "motion/react";
import AnimatedSky from "@/components/motion/AnimatedSky";
import { brand } from "@/theme/theme";
import { trackEvent } from "@/lib/analytics";

// The hero cycles through these. Each one makes the same promise in plain
// words — we deliver any custom build 10x faster — from a different angle.
const messages = [
  {
    headline: "Custom software, delivered 10x faster.",
    highlight: ["10x", "faster"],
    subtitle:
      "Websites, apps, and business systems — built with the newest AI coding models and reviewed line by line by senior engineers.",
  },
  {
    headline: "Your website or app, live in weeks.",
    highlight: ["live", "in", "weeks"],
    subtitle:
      "What used to take a full team months, we ship in days. Same quality, a fraction of the time and cost.",
  },
  {
    headline: "Any idea. Any platform. One senior team.",
    highlight: ["One", "senior", "team"],
    subtitle:
      "Web, mobile, cloud, and AI — from a simple site to trading platforms, medical imaging, and government-grade systems.",
  },
  {
    headline: "Built at AI speed. Built to last.",
    highlight: ["AI", "speed"],
    subtitle:
      "AI gets us there 10x faster. 15+ years of engineering makes sure what you get is secure, scalable, and yours to keep.",
  },
];

/** How long each message stays on screen. */
const ROTATE_MS = 11000;

const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.2 } },
};

const wordItem = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

const stripPunctuation = (word: string) => word.replace(/[.,—]/g, "");

type Message = (typeof messages)[number];

const headlineSx = {
  fontSize: { xs: "2.5rem", sm: "3.25rem", md: "4rem" },
  display: "flex",
  flexWrap: "wrap",
} as const;

const subtitleSx = {
  mt: 3,
  color: "rgba(255,255,255,0.8)",
  fontSize: "1.15rem",
  maxWidth: 620,
} as const;

const highlightSx = {
  backgroundImage: `linear-gradient(90deg, ${brand.blueLight}, #ffffff, ${brand.blueLight})`,
  backgroundSize: "200% auto",
  color: "transparent",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  animation: "heroGradient 6s ease-in-out infinite",
};

/**
 * One message. `sizer` renders the same markup without motion so a hidden copy
 * of every message can reserve the block's height — the tallest one wins and
 * the CTAs below never shift when the text rotates.
 */
function MessageBody({ message, sizer = false }: { message: Message; sizer?: boolean }) {
  return (
    <>
      <Typography variant="h1" sx={headlineSx}>
        {message.headline.split(" ").map((word, i) => (
          <Box
            key={i}
            component={sizer ? "span" : motion.span}
            {...(sizer ? {} : { variants: wordItem })}
            sx={{
              display: "inline-block",
              mr: "0.28em",
              ...(message.highlight.includes(stripPunctuation(word)) ? highlightSx : {}),
            }}
          >
            {word}
          </Box>
        ))}
      </Typography>

      <Typography
        variant="body1"
        sx={subtitleSx}
        {...(sizer
          ? { component: "p" }
          : {
              component: motion.p,
              initial: { opacity: 0, y: 12, filter: "blur(4px)" },
              animate: { opacity: 1, y: 0, filter: "blur(0px)" },
              transition: { duration: 0.5, delay: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as const },
            })}
      >
        {message.subtitle}
      </Typography>
    </>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const message = messages[index];

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(160deg, ${brand.navyDark} 0%, ${brand.navy} 55%, ${brand.navyMid} 100%)`,
        color: "#fff",
        pt: { xs: 16, md: 20 },
        pb: { xs: 12, md: 16 },
      }}
    >
      <AnimatedSky />

      <Container sx={{ position: "relative" }}>
        <Stack spacing={4} sx={{ maxWidth: 780 }}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const }}
            sx={{ alignSelf: "flex-start" }}
          >
            <Chip
              label="AI-first custom software consultancy"
              sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                color: "secondary.light",
                border: "1px solid rgba(255,255,255,0.16)",
                fontWeight: 600,
              }}
            />
          </Box>

          {/* Rotating pitch. Every message is also rendered invisibly in the same
              grid cell, so the block is always as tall as the longest one and the
              CTAs below never jump when the text changes. */}
          <Box sx={{ display: "grid" }}>
            <Box
              aria-hidden
              sx={{ gridArea: "1 / 1", display: "grid", visibility: "hidden", pointerEvents: "none" }}
            >
              {messages.map((m, i) => (
                <Box key={i} sx={{ gridArea: "1 / 1" }}>
                  <MessageBody message={m} sizer />
                </Box>
              ))}
            </Box>

            <Box sx={{ gridArea: "1 / 1" }}>
              <AnimatePresence mode="wait">
                <Box
                  key={index}
                  component={motion.div}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -14, filter: "blur(6px)", transition: { duration: 0.4 } }}
                  variants={wordContainer}
                >
                  <MessageBody message={message} />
                </Box>
              </AnimatePresence>
            </Box>
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2, ease: [0.21, 0.47, 0.32, 0.98] as const }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                component={Link}
                href="/book-a-call"
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => trackEvent("cta_book_call_click", { location: "hero" })}
              >
                Book a Call
              </Button>
              <Button
                component={Link}
                href="/case-studies"
                variant="outlined"
                size="large"
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.4)",
                  "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                }}
              >
                Explore case studies
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>

      <style>{`
        @keyframes heroGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </Box>
  );
}
