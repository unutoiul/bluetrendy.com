import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CardLinkArea from "./CardLinkArea";
import type { Service } from "@/data/services";

export default function ServiceCard({ service, href }: { service: Service; href?: string }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 3,
        borderColor: "divider",
        transition: "border-color 0.2s ease, transform 0.2s ease",
        "&:hover": { borderColor: "secondary.main", transform: "translateY(-2px)" },
      }}
    >
      <CardLinkArea
        href={href ?? `/services#${service.slug}`}
        sx={{ height: "100%", p: { xs: 3, md: 4 } }}
      >
        <Stack spacing={2} sx={{ height: "100%" }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography variant="h6" component="h3">
              {service.name}
            </Typography>
            <ArrowOutwardIcon sx={{ color: "text.secondary", fontSize: 20, flexShrink: 0, ml: 1 }} />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
            {service.shortDescription}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            {service.stack.slice(0, 3).map((tech) => (
              <Chip key={tech} label={tech} size="small" variant="outlined" />
            ))}
          </Stack>
        </Stack>
      </CardLinkArea>
    </Card>
  );
}
