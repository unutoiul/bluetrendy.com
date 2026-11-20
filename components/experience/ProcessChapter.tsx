import Box from "@mui/material/Box";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import TravelExploreOutlined from "@mui/icons-material/TravelExploreOutlined";
import DesignServicesOutlined from "@mui/icons-material/DesignServicesOutlined";
import CodeRounded from "@mui/icons-material/CodeRounded";
import RocketLaunchOutlined from "@mui/icons-material/RocketLaunchOutlined";
import ChapterIntro from "./ChapterIntro";
import { neural } from "./neuralStyle";
import { palette, withAlpha } from "@/theme/palette";

const steps = [
  { title: "Discover", Icon: TravelExploreOutlined,
    text: "We learn your business, your systems and where AI could pay off." },
  { title: "Design", Icon: DesignServicesOutlined,
    text: "We scope a first release you can measure, with the benefits we expect from it." },
  { title: "Build", Icon: CodeRounded,
    text: "We implement and test, and show you the work in progress every week." },
  { title: "Launch & improve", Icon: RocketLaunchOutlined,
    text: "We deploy, monitor performance, train your team and keep refining." },
];

// Sits in the gap after a step card: to its right on wide screens, below it on phones. In
// between, the steps sit two to a row and need no connector.
function Connector({ delay }: { delay: number }) {
  return (
    <Box aria-hidden="true" sx={{ position: "absolute", zIndex: 2, display: { xs: "block", sm: "none", lg: "block" },
      left: { xs: "50%", lg: "100%" }, top: { xs: "100%", lg: "50%" },
      width: { xs: 2, lg: 48 }, height: { xs: 48, lg: 2 }, translate: { xs: "-50% 0", lg: "0 -50%" },
      background: { xs: `linear-gradient(180deg, transparent, ${palette.blue[300]}, transparent)`, lg: `linear-gradient(90deg, transparent, ${palette.blue[300]}, transparent)` },
      boxShadow: `0 0 10px ${withAlpha(palette.blue[350], 0.7)}`,
      "&::after": { content: '""', position: "absolute", width: 8, height: 8, borderRadius: "50%", background: palette.cyan[25],
        boxShadow: `0 0 10px 3px ${palette.sky[150]}, 0 0 22px 6px ${withAlpha(palette.blue[350], 0.8)}`,
        top: { xs: 0, lg: "50%" }, left: { xs: "50%", lg: 0 }, translate: "-50% -50%",
        animation: { xs: `neural-current-down 2.4s ${neural.ease} infinite`, lg: `neural-current 2.4s ${neural.ease} infinite` },
        animationDelay: `${delay}s`,
        "@media (prefers-reduced-motion: reduce)": { animation: "none", display: "none" } },
    }}>
      <Box sx={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%", display: "grid", placeItems: "center",
        width: 34, height: 34, borderRadius: "50%", color: palette.slate[75], background: `radial-gradient(circle, ${palette.navy[600]}, ${palette.navy[775]} 75%)`,
        border: `1px solid ${palette.sky[150]}`, animation: "neural-breathe 3.2s ease-in-out infinite",
        "& svg": { fontSize: 18, rotate: { xs: "90deg", lg: "0deg" } },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}>
        <ArrowForwardRounded />
      </Box>
    </Box>
  );
}

export default function ProcessChapter() {
  return <>
    <ChapterIntro id="production-heading" label="Our process" title="How we" accent="work"
      subtitle="Four steps from the first conversation to AI your team uses every day, each with something you can check."
      action={{ href: "/process", label: "See our delivery process" }} />
    <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", alignItems: "stretch",
      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
      columnGap: { sm: "24px", lg: "48px" }, rowGap: { xs: "48px", sm: "24px" } }}>
      {steps.map(({ title, text, Icon }, index) => (
        <Box component="li" key={title} data-panel sx={{ position: "relative", display: "flex" }}>
          {index < steps.length - 1 && <Connector delay={index * 0.6} />}
          <Box sx={{ ...neural.glassCard, flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center", p: { xs: 3, md: 3 }, minHeight: { md: 250 },
            "&:hover": { ...neural.glassCard["&:hover, &:focus-visible, &:focus-within"], transform: "translateY(-6px)" },
            "&:hover .step-orb": { transform: "scale(1.1)", color: palette.slate[50],
              boxShadow: `0 0 0 1px ${withAlpha(palette.sky[100], 0.5)}, 0 0 30px ${withAlpha(palette.blue[300], 0.7)}, inset 0 0 14px ${withAlpha(palette.sky[175], 0.4)}` } }}>
            <Box component="span" sx={{ position: "relative", zIndex: 1, alignSelf: "flex-start", fontFamily: "var(--font-mono), monospace",
              fontSize: "0.8rem", fontWeight: 600, color: palette.sky[150], letterSpacing: "0.08em" }}>
              {String(index + 1).padStart(2, "0")}
            </Box>
            <Box className="step-orb" sx={{ ...neural.iconOrb, position: "relative", zIndex: 1, width: 64, height: 64, borderRadius: "50%", mt: -0.5,
              "& svg": { fontSize: 30, filter: `drop-shadow(0 0 7px ${withAlpha(palette.blue[250], 0.95)})` } }}>
              <Icon aria-hidden="true" />
            </Box>
            <Box component="h3" sx={{ position: "relative", zIndex: 1, m: "20px 0 0", fontSize: { xs: "1.25rem", md: "1.4rem" }, fontWeight: 650,
              letterSpacing: "-0.03em", color: palette.grey[25] }}>{title}</Box>
            <Box component="p" sx={{ position: "relative", zIndex: 1, m: "10px 0 0", maxWidth: "32ch", color: palette.slate[125], lineHeight: 1.62 }}>{text}</Box>
          </Box>
        </Box>
      ))}
    </Box>
  </>;
}
