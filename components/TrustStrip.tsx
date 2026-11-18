"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { motion, useReducedMotion } from "motion/react";
import { clientLogos, type ClientLogo } from "@/data/clients";

function ClientMark({ client }: { client: ClientLogo }) {
  return (
    <Box component={client.external ? "a" : Link} href={client.href}
      target={client.external ? "_blank" : undefined} rel={client.external ? "noopener noreferrer" : undefined}
      aria-label={client.name + (client.external ? " (opens in a new tab)" : " case study")}
      sx={{ display: "grid", placeItems: "center", minHeight: 65, px: 1.5, borderRadius: 1,
        "& img": { opacity: client.mutedOpacity ?? 0.79, filter: "grayscale(1)", maxWidth: "100%", objectFit: "contain" },
        "&:hover img, &:focus-visible img": { opacity: 1, filter: "none" } }}>
      {client.file ? <Box component="img" src={`/brand/clients/${client.file}`} alt="" width={107} height={35} loading="lazy" /> : client.name}
    </Box>
  );
}

export default function TrustStrip() {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const layout = { display: "grid", alignItems: "center", gridTemplateColumns: { xs: "repeat(3,minmax(0,1fr))", sm: "repeat(5,minmax(0,1fr))" } };
  return (
    <Box component="section" aria-labelledby="clients-heading">
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, borderBottom: "1px solid", borderColor: "divider", pb: 1 }}>
        <Typography id="clients-heading" component="h2" sx={{ fontSize: { xs: 15, sm: 17 }, fontWeight: 650 }}>Teams we’ve built software with</Typography>
        <Button size="small" aria-expanded={expanded} aria-controls="more-clients" onClick={() => setExpanded(!expanded)}
          endIcon={<ExpandMore sx={{ transform: expanded ? "rotate(180deg)" : undefined }} />} sx={{ px: 1, flexShrink: 0 }}>
          {expanded ? "Show fewer" : "View all " + clientLogos.length}
        </Button>
      </Box>
      <Box sx={{ ...layout, pt: 1.5 }}>{clientLogos.slice(0, 5).map(client => <ClientMark key={client.name} client={client} />)}</Box>
      <Box id="more-clients" hidden={!expanded}>
        {expanded && <Box component={motion.div} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }} sx={layout}>{clientLogos.slice(5).map(client => <ClientMark key={client.name} client={client} />)}</Box>}
      </Box>
    </Box>
  );
}
