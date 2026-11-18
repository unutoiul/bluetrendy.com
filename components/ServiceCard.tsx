import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowOutward from "@mui/icons-material/ArrowOutward";
import CardLinkArea from "./CardLinkArea";
import type { Service } from "@/data/services";
import { brand, easeOut } from "@/theme/theme";

export default function ServiceCard({ service, href }: { service: Service; href?: string }) {
  return (
    <CardLinkArea href={href ?? `/services#${service.slug}`}
      sx={{ display: "grid", gridTemplateColumns: { xs: "1fr auto", md: "0.87fr 1.3fr auto" }, alignItems: "center",
        columnGap: { xs: 1.5, md: 4 }, rowGap: 0.7, px: { xs: 1.5, md: 3 }, py: { xs: 2.5, md: 3 },
        textAlign: "left", borderBottom: "1px solid", borderColor: "divider", color: "text.primary", isolation: "isolate",
        "& .MuiCardActionArea-focusHighlight": { display: "none" },
        // A wash of light sweeps in from the left behind the row.
        "&::before": { content: '""', position: "absolute", inset: 0, zIndex: -1, pointerEvents: "none",
          background: `linear-gradient(90deg, #fff 0%, #fff 55%, rgba(139,214,255,0.22) 100%)`,
          transform: "scaleX(0)", transformOrigin: "left", transition: `transform 0.6s ${easeOut}` },
        "& .service-name": { transition: `transform 0.45s ${easeOut}, color 0.25s ease` },
        "& .service-arrow": { transition: `background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.45s ${easeOut}` },
        "&:hover::before, &:focus-visible::before": { transform: "scaleX(1)" },
        "&:hover .service-name, &:focus-visible .service-name": { transform: "translateX(8px)", color: "secondary.dark" },
        "&:hover .service-arrow, &:focus-visible .service-arrow": { bgcolor: brand.blue, borderColor: brand.blue, color: "#fff", transform: "rotate(45deg)" } }}>
      <Typography variant="h6" component="h3" className="service-name" sx={{ letterSpacing: "-.025em" }}>{service.name}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ gridRow: { xs: 2, md: 1 }, gridColumn: { xs: 1, md: 2 } }}>{service.shortDescription}</Typography>
      <Box className="service-arrow" sx={{ gridRow: 1, gridColumn: { xs: 2, md: 3 }, width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: "50%", border: "1px solid", borderColor: "divider" }}>
        <ArrowOutward sx={{ fontSize: 17 }} />
      </Box>
    </CardLinkArea>
  );
}
