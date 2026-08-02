import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CardLinkArea from "./CardLinkArea";
import type { CaseStudy } from "@/data/caseStudies";

export default function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
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
        href={`/case-studies/${caseStudy.slug}`}
        sx={{ height: "100%", p: { xs: 3, md: 4 }, display: "flex", alignItems: "stretch" }}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Chip label={caseStudy.sector} size="small" sx={{ bgcolor: "rgba(39,135,190,0.1)", color: "secondary.dark" }} />
            <ArrowOutwardIcon sx={{ color: "text.secondary", fontSize: 20 }} />
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
