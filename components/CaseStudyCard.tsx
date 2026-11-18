import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CardLinkArea from "./CardLinkArea";
import PointerGlow from "./motion/PointerGlow";
import type { CaseStudy } from "@/data/caseStudies";
import { brand, easeOut } from "@/theme/theme";

export default function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Card
      variant="outlined"
      sx={{
        position: "relative",
        height: "100%",
        borderRadius: 3,
        borderColor: "divider",
        transition: `border-color 0.3s ease, transform 0.5s ${easeOut}, box-shadow 0.5s ${easeOut}`,
        "& .case-arrow": { transition: `transform 0.45s ${easeOut}, color 0.25s ease` },
        "& .case-sector": { transition: "background-color 0.3s ease, color 0.3s ease" },
        "&:hover, &:focus-within": {
          borderColor: "secondary.main",
          transform: "translateY(-6px)",
          boxShadow: "0 28px 50px -30px rgba(12,43,69,0.5)",
        },
        "&:hover .case-arrow, &:focus-within .case-arrow": { transform: "translate(3px, -3px) scale(1.15)", color: brand.blue },
        "&:hover .case-sector, &:focus-within .case-sector": { bgcolor: brand.blue, color: "#fff" },
        "&:active": { transform: "translateY(-2px) scale(0.99)" },
      }}
    >
      <PointerGlow color="rgba(22,95,204,0.11)" size={380} />
      <CardLinkArea
        href={`/case-studies/${caseStudy.slug}`}
        sx={{ position: "relative", zIndex: 1, height: "100%", p: { xs: 3, md: 4 }, display: "flex", alignItems: "stretch",
          "& .MuiCardActionArea-focusHighlight": { display: "none" } }}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Chip label={caseStudy.sector} size="small" className="case-sector" sx={{ bgcolor: "rgba(39,135,190,0.1)", color: "secondary.dark" }} />
            <ArrowOutwardIcon className="case-arrow" sx={{ color: "text.secondary", fontSize: 20 }} />
          </Stack>
          <Box>
            <Typography variant="overline" sx={{ color: "text.secondary" }}>
              {caseStudy.client}
            </Typography>
            <Typography variant="h6" component="h3" sx={{ mt: 0.5 }}>
              {caseStudy.title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
            {caseStudy.summary}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            {caseStudy.stack.slice(0, 3).map((tech) => (
              <Chip key={tech} label={tech} size="small" variant="outlined" />
            ))}
          </Stack>
        </Stack>
      </CardLinkArea>
    </Card>
  );
}
