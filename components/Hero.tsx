"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "motion/react";
import AnimatedSky from "@/components/motion/AnimatedSky";
import { brand } from "@/theme/theme";
import { trackEvent } from "@/lib/analytics";

const headlineWords = "Enterprise software, built at AI speed by senior engineers.".split(" ");

const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.35 } },
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

function isHighlighted(word: string) {
  return ["built", "at", "AI", "speed"].includes(word.replace(/[.,]/g, ""));
}

const subtitleChunks = [
  "BlueTrendy Intelligence designs and ships production-grade web, mobile, and mission-critical systems",
  "trading platforms, geospatial intelligence, medical imaging, identity infrastructure",
  "combining 15+ years of hands-on engineering with frontier AI models chosen for the job, not the brand.",
];

const subtitleContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.22, delayChildren: 0.9 } },
};

const subtitleItem = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export default function Hero() {
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

          <Box component={motion.div} initial="hidden" animate="show" variants={wordContainer}>
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: "2.5rem", sm: "3.25rem", md: "4rem" }, display: "flex", flexWrap: "wrap" }}
            >
              {headlineWords.map((word, i) => (
                <Box
                  key={i}
                  component={motion.span}
                  variants={wordItem}
                  sx={{
                    display: "inline-block",
                    mr: "0.28em",
                    ...(isHighlighted(word)
                      ? {
                          backgroundImage: `linear-gradient(90deg, ${brand.blueLight}, #ffffff, ${brand.blueLight})`,
                          backgroundSize: "200% auto",
                          color: "transparent",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          animation: "heroGradient 6s ease-in-out infinite",
                        }
                      : {}),
                  }}
                >
                  {word}
                </Box>
              ))}
            </Typography>
          </Box>

          <Box component={motion.div} initial="hidden" animate="show" variants={subtitleContainer}>
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)", fontSize: "1.15rem", maxWidth: 620 }}>
              {subtitleChunks.map((chunk, i) => (
                <Box key={i} component={motion.span} variants={subtitleItem} sx={{ display: "inline" }}>
                  {chunk}
                  {i < subtitleChunks.length - 1 ? " — " : ""}
                </Box>
              ))}
            </Typography>
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
