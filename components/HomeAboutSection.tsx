"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { motion } from "motion/react";
import LinkButton from "@/components/LinkButton";
import StatStrip from "@/components/StatStrip";
import { brand } from "@/theme/theme";
import founderPhoto from "@/public/brand/founder.png";

const words = "Senior engineering, not a resourcing pool.".split(" ");

const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const wordItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

export default function HomeAboutSection() {
  return (
    <Box sx={{ py: { xs: 10, md: 14 }, position: "relative", overflow: "hidden" }}>
      <Container>
        <Grid container spacing={{ xs: 6, md: 10 }} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack sx={{ alignItems: { xs: "center", md: "flex-start" } }} spacing={2}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const }}
                sx={{ position: "relative", display: "flex" }}
              >
                <Box
                  component={motion.div}
                  aria-hidden
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  sx={{
                    position: "absolute",
                    inset: -18,
                    borderRadius: "50%",
                    border: "1.5px dashed",
                    borderColor: "rgba(39,135,190,0.35)",
                  }}
                />
                <Box
                  component={motion.div}
                  aria-hidden
                  animate={{ opacity: [0.35, 0.7, 0.35] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  sx={{
                    position: "absolute",
                    inset: -30,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${brand.blue}40 0%, transparent 70%)`,
                    filter: "blur(16px)",
                  }}
                />
                <Box
                  sx={{
                    position: "relative",
                    width: 220,
                    height: 220,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "4px solid",
                    borderColor: "background.paper",
                    boxShadow: "0 20px 45px rgba(11,69,99,0.25)",
                  }}
                >
                  <Image
                    src={founderPhoto}
                    alt="Lucas Franco, founder of BlueTrendy Intelligence"
                    width={220}
                    height={220}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                </Box>
              </Box>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography sx={{ fontWeight: 700 }}>Lucas Franco</Typography>
                <Typography variant="body2" color="text.secondary">
                  Founder &amp; Lead Engineer
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <Typography variant="overline" sx={{ color: "secondary.main" }}>
                Who we are
              </Typography>
              <Box
                component={motion.div}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={wordContainer}
              >
                <Typography variant="h3" component="h2" sx={{ display: "flex", flexWrap: "wrap", gap: "0.35em" }}>
                  {words.map((word, i) => (
                    <Box key={i} component={motion.span} variants={wordItem} sx={{ display: "inline-block" }}>
                      {word}
                    </Box>
                  ))}
                </Typography>
              </Box>

              <Box component={motion.div} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={fadeUp}>
                <Stack spacing={2.5}>
                  <Typography variant="body1" color="text.secondary">
                    Every engagement at BlueTrendy Intelligence is led end-to-end by hands-on senior engineers
                    with a track record inside banks, defense agencies, healthcare platforms, and enterprise
                    SaaS companies — the kind of environments where correctness isn&apos;t optional.
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    That background shapes how every engagement runs: TDD/BDD discipline where correctness
                    matters, cloud-native architecture on AWS and Azure, and AI used to move faster on
                    scaffolding, testing, and automation — with engineering judgment that stays human, senior,
                    and accountable.
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ pt: 1 }}>
                <StatStrip compact />
              </Box>

              <Box sx={{ pt: 1 }}>
                <LinkButton href="/about" variant="text" color="primary">
                  More about BlueTrendy Intelligence →
                </LinkButton>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
