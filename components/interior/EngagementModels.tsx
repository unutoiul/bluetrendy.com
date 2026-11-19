import Link from "next/link";
import Box from "@mui/material/Box";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import TravelExploreOutlined from "@mui/icons-material/TravelExploreOutlined";
import FlagOutlined from "@mui/icons-material/FlagOutlined";
import GroupAddOutlined from "@mui/icons-material/GroupAddOutlined";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import { neural } from "@/components/experience/neuralStyle";
import HeadingMotion from "@/components/motion/HeadingMotion";
import { engagementModels } from "@/data/process";
import { palette, withAlpha } from "@/theme/palette";

const icons = { discovery: TravelExploreOutlined, fixed: FlagOutlined, embedded: GroupAddOutlined };

/** The three ways to work together, as glass cards on the brand's blue. Discovery leads. */
export default function EngagementModels({ id }: { id: string }) {
  return (
    <Box component="section" id={id} aria-labelledby={`${id}-heading`} sx={{ ...neural.sectionTone("header", "services"), scrollMarginTop: 80 }}>
      <LivingBackground effect="streaks" quiet="top" seed={73} />
      <Box sx={{ position: "relative", zIndex: 1, width: "var(--page-width)", mx: "auto", py: { xs: 7, md: 11 } }}>
        <Box component="p" sx={neural.label}>Engagement models</Box>
        <HeadingMotion id={`${id}-heading`} text="Three ways to" accent="work together"
          sx={{ m: 0, fontSize: "clamp(2.1rem, 4.4vw, 3.9rem)", fontWeight: 630, letterSpacing: "-0.047em", lineHeight: 1.06 }} />
        <Box component="p" sx={{ m: "18px 0 0", maxWidth: "56ch", color: palette.slate[125], fontSize: "clamp(1rem, 1.25vw, 1.12rem)", lineHeight: 1.6 }}>
          Every engagement starts with discovery. From there, the model depends on how well defined your scope is and how long you need us.
        </Box>

        <Box component="ul" data-panel-group sx={{ listStyle: "none", m: 0, p: 0, mt: { xs: 5, md: 7 }, display: "grid", gap: { xs: 2.5, md: 3 },
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" } }}>
          {engagementModels.map(model => {
            const Icon = icons[model.id];
            const lead = model.id === "discovery";
            return (
              <Box component="li" key={model.id} data-panel sx={{
                ...neural.glassCard, display: "flex", flexDirection: "column", p: { xs: 3, md: 3.5 }, borderRadius: "20px",
                "& > *": { position: "relative", zIndex: 1 },
                "&:hover .model-orb": { transform: "scale(1.08) rotate(-4deg)", color: palette.slate[50],
                  boxShadow: `0 0 0 1px ${withAlpha(palette.sky[100], 0.5)}, 0 0 28px ${withAlpha(palette.blue[300], 0.65)}, inset 0 0 14px ${withAlpha(palette.sky[175], 0.4)}` },
                "&:hover .model-action svg": { transform: "translateX(4px)" },
                // Discovery is where everyone starts, so its card is lit from the outset.
                ...(lead && {
                  borderColor: withAlpha(palette.sky[150], 0.7),
                  boxShadow: `inset 0 1px 0 ${withAlpha(palette.slate[75], 0.4)}, inset 0 0 30px ${withAlpha(palette.blue[350], 0.2)}, 0 0 30px -6px ${withAlpha(palette.blue[350], 0.45)}, 0 26px 52px -30px ${withAlpha(palette.black, 0.9)}`,
                  "&::before": { ...neural.glassCard["&::before"], left: 0, right: 0, opacity: 1 },
                }),
              }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
                  <Box className="model-orb" aria-hidden="true" sx={neural.iconOrb}><Icon /></Box>
                  <Box component="span" sx={{ px: 1.25, py: 0.5, borderRadius: 99, fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase", whiteSpace: "nowrap",
                    ...(lead
                      ? { color: palette.navy[800], background: `linear-gradient(125deg, ${palette.slate[75]}, ${palette.sky[175]} 68%, ${palette.blue[250]})` }
                      : { color: palette.slate[75], border: `1px solid ${withAlpha(palette.sky[150], 0.4)}`, background: withAlpha(palette.blue[350], 0.1) }) }}>
                    {model.tag}
                  </Box>
                </Box>

                <Box component="h3" sx={{ m: "22px 0 0", fontSize: { xs: "1.3rem", md: "1.4rem" }, fontWeight: 650, letterSpacing: "-0.03em", color: palette.grey[25] }}>
                  {model.name}
                </Box>
                <Box component="p" sx={{ m: "10px 0 0", color: palette.slate[125], lineHeight: 1.6, fontSize: "0.97rem" }}>{model.description}</Box>

                <Box component="dl" sx={{ m: "22px 0 0", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.5 }}>
                  {model.facts.map(({ term, value }) => (
                    <Box key={term} sx={{ p: 1.5, borderRadius: "12px", border: `1px solid ${withAlpha(palette.sky[175], 0.2)}`, background: withAlpha(palette.navy[850], 0.45) }}>
                      <Box component="dt" sx={{ color: palette.sky[150], fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>{term}</Box>
                      <Box component="dd" sx={{ m: "6px 0 0", color: palette.grey[25], fontSize: "0.93rem", fontWeight: 600, lineHeight: 1.4 }}>{value}</Box>
                    </Box>
                  ))}
                </Box>

                <Box aria-hidden="true" sx={{ height: "1px", my: 2.5, background: `linear-gradient(90deg, ${withAlpha(palette.sky[150], 0.5)}, transparent)` }} />
                <Box component="p" sx={{ m: 0, color: palette.sky[150], fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Best for</Box>
                <Box component="p" sx={{ m: "8px 0 0", color: palette.slate[150], lineHeight: 1.55, fontSize: "0.95rem" }}>{model.bestFor}</Box>

                {/* A server component can't hand Link to MUI's Box, so the wrapper styles a plain Link. */}
                <Box className="model-action" sx={{ mt: "auto", pt: 3, "& a": neural.trailLink }}>
                  <Link href={model.action.href} prefetch={false}>
                    {model.action.label} <ArrowForwardRounded aria-hidden="true" />
                  </Link>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
