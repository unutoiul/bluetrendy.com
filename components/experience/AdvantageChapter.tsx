import Link from "next/link";
import Box from "@mui/material/Box";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import StraightenOutlined from "@mui/icons-material/StraightenOutlined";
import SplitSection from "@/components/SplitSection";
import SavingsCalculator from "@/components/lab/SavingsCalculator";
import { challenges } from "@/data/opportunities";
import { palette, withAlpha } from "@/theme/palette";

const columns = { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) minmax(0, 1.15fr) minmax(0, 1fr)" };
const columnLabel = { color: palette.slate[475], fontSize: "0.74rem", fontWeight: 650, letterSpacing: "0.12em", textTransform: "uppercase" } as const;

/**
 * The financial case, ahead of the technology: a calculator for the visitor's own numbers,
 * then the ledger of common problems, each with the system we would build and the figure we
 * would track. Every row leads to the service that delivers it.
 */
export default function AdvantageChapter() {
  return (
    <SplitSection id="advantage-heading" title="The financial advantage" effect="dotField" seed={29} background={palette.white} pinned
      text="Technology is only worth buying if it moves a number. Every system we build is tied to one you can measure."
      link={{ href: "/ai-implementation", label: "How we assess value" }}>
      <SavingsCalculator />

      <Box component="h3" sx={{ m: { xs: "40px 0 0", md: "56px 0 0" }, color: palette.navy[725], fontSize: "clamp(1.4rem, 2.3vw, 1.95rem)", fontWeight: 650,
        letterSpacing: "-0.045em", lineHeight: 1.15 }}>
        Nine common problems, <Box component="span" sx={{ color: palette.blue[500] }}>and the number each should move</Box>
      </Box>
      <Box aria-hidden="true" sx={{ display: { xs: "none", sm: "grid" }, gridTemplateColumns: columns, columnGap: 3, mt: 3, px: 2, pb: 1.25,
        borderBottom: `1px solid ${palette.slate[150]}` }}>
        <Box component="span" sx={columnLabel}>The problem</Box>
        <Box component="span" sx={columnLabel}>What we build</Box>
        <Box component="span" sx={columnLabel}>What we measure</Box>
      </Box>
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0,
        "& li": { borderBottom: `1px solid ${palette.slate[150]}` },
        "& a": { display: "grid", gridTemplateColumns: columns, columnGap: 3, rowGap: 0.5, alignItems: "center", px: 2, py: 1.75, borderRadius: "10px",
          color: palette.navy[725], textDecoration: "none", transition: "background-color 0.25s ease" },
        "& a:hover": { backgroundColor: palette.slate[50] },
        "& a:focus-visible": { outline: `2px solid ${palette.blue[475]}`, outlineOffset: -2 },
        "& a:hover .ledger-arrow": { transform: "translateX(4px)" } }}>
        {challenges.map(item => (
          <li key={item.id}>
            <Link href={"/" + item.service} prefetch={false}>
              <Box component="span" sx={{ fontWeight: 650, fontSize: "1.02rem", letterSpacing: "-0.02em" }}>{item.problem}</Box>
              <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1, color: palette.blue[550], fontWeight: 600, fontSize: "0.96rem", lineHeight: 1.35 }}>
                <ArrowForwardRounded className="ledger-arrow" aria-hidden="true"
                  sx={{ flex: "none", fontSize: 18, color: palette.blue[425], transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }} />
                {item.solution}
              </Box>
              <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1, color: palette.slate[525], fontSize: "0.94rem", lineHeight: 1.35 }}>
                <StraightenOutlined aria-hidden="true" sx={{ flex: "none", fontSize: 17, color: withAlpha(palette.blue[500], 0.7) }} />
                <Box component="span" className="sr-only">Measure: </Box>{item.measure}
              </Box>
            </Link>
          </li>
        ))}
      </Box>
    </SplitSection>
  );
}
