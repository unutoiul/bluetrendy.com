"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { motion } from "motion/react";
import { clientLogos } from "@/data/clients";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

function TileContent({ client }: { client: (typeof clientLogos)[number] }) {
  return (
    <Box
      component={motion.div}
      variants={item}
      whileHover={{ y: -3 }}
      sx={{
        height: { xs: 84, sm: 96 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
        px: 2,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: "secondary.main",
          boxShadow: "0 8px 20px rgba(11,69,99,0.08)",
        },
        "&:hover img": { opacity: 1, filter: "grayscale(0)" },
      }}
    >
      {client.file ? (
        <Box
          component="img"
          src={`/brand/clients/${client.file}`}
          alt={client.name}
          sx={{
            maxHeight: { xs: 32, sm: 40 },
            maxWidth: "80%",
            width: "auto",
            objectFit: "contain",
            filter: "grayscale(1)",
            opacity: 0.65,
            transition: "opacity 0.2s ease, filter 0.2s ease",
          }}
        />
      ) : (
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "text.secondary",
            opacity: 0.75,
            textAlign: "center",
          }}
        >
          {client.name}
        </Typography>
      )}
    </Box>
  );
}

export default function TrustStrip() {
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{ color: "text.secondary", display: "block", textAlign: "center", mb: 4 }}
      >
        Engineering delivered inside
      </Typography>
      <Grid
        container
        component={motion.div}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={container}
        spacing={2}
      >
        {clientLogos.map((client) => (
          <Grid key={client.name} size={{ xs: 6, sm: 4, md: 2.4 }}>
            {client.external ? (
              <Box
                component="a"
                href={client.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${client.name} (opens in a new tab)`}
                sx={{ display: "block" }}
              >
                <TileContent client={client} />
              </Box>
            ) : (
              <Box component={Link} href={client.href} aria-label={client.name} className="tile-link" sx={{ display: "block" }}>
                <TileContent client={client} />
              </Box>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
