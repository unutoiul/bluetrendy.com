import Box from "@mui/material/Box";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import DevicesOutlined from "@mui/icons-material/DevicesOutlined";
import RocketLaunchOutlined from "@mui/icons-material/RocketLaunchOutlined";
import ChapterIntro from "./ChapterIntro";
import { neural } from "./neuralStyle";

const steps = [
  { title: "Tell us what you need", Icon: ForumOutlined,
    text: "We talk through the problem, who will use the solution and what to build first." },
  { title: "Try a working version", Icon: DevicesOutlined,
    text: "You see the work as it takes shape and give feedback before launch." },
  { title: "Launch with support", Icon: RocketLaunchOutlined,
    text: "We test the release, help your team get started and hand over the tools to run it." },
];

// Sits in the gap after a step card: to its right on wide screens, below it on narrow ones.
function Connector({ delay }: { delay: number }) {
  return (
    <Box aria-hidden="true" sx={{ position: "absolute", zIndex: 2,
      left: { xs: "50%", md: "100%" }, top: { xs: "100%", md: "50%" },
      width: { xs: 2, md: 64 }, height: { xs: 48, md: 2 }, translate: { xs: "-50% 0", md: "0 -50%" },
      background: { xs: "linear-gradient(180deg, transparent, #3fa8ff, transparent)", md: "linear-gradient(90deg, transparent, #3fa8ff, transparent)" },
      boxShadow: "0 0 10px rgba(30, 150, 255, 0.7)",
      "&::after": { content: '""', position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "#e4fbff",
        boxShadow: "0 0 10px 3px #4fd2ff, 0 0 22px 6px rgba(20, 130, 255, 0.8)",
        top: { xs: 0, md: "50%" }, left: { xs: "50%", md: 0 }, translate: "-50% -50%",
        animation: { xs: `neural-current-down 2.4s ${neural.ease} infinite`, md: `neural-current 2.4s ${neural.ease} infinite` },
        animationDelay: `${delay}s`,
        "@media (prefers-reduced-motion: reduce)": { animation: "none", display: "none" } },
    }}>
      <Box sx={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%", display: "grid", placeItems: "center",
        width: 38, height: 38, borderRadius: "50%", color: "#bff3ff", background: "radial-gradient(circle, #0f3d78, #071a36 75%)",
        border: "1px solid #63d4ff", animation: "neural-breathe 3.2s ease-in-out infinite",
        "& svg": { fontSize: 20, rotate: { xs: "90deg", md: "0deg" } },
        "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}>
        <ArrowForwardRounded />
      </Box>
    </Box>
  );
}

export default function ProcessChapter() {
  return <>
    <ChapterIntro id="production-heading" label="Our process" title="How we" accent="work"
      subtitle="Three steps from the first conversation to software your team uses every day."
      action={{ href: "/process", label: "See our delivery process" }} />
    <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", alignItems: "stretch",
      gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, columnGap: "64px", rowGap: "48px" }}>
      {steps.map(({ title, text, Icon }, index) => (
        <Box component="li" key={title} data-panel sx={{ position: "relative", display: "flex" }}>
          {index < steps.length - 1 && <Connector delay={index * 0.6} />}
          <Box sx={{ ...neural.glassCard, flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center", p: { xs: 3, md: 3.5 }, minHeight: { md: 260 },
            "&:hover": { ...neural.glassCard["&:hover, &:focus-visible, &:focus-within"], transform: "translateY(-6px)" },
            "&:hover .step-orb": { transform: "scale(1.1)", color: "#d6f8ff",
              boxShadow: "0 0 0 1px rgba(150, 235, 255, 0.5), 0 0 30px rgba(30, 170, 255, 0.7), inset 0 0 14px rgba(120, 210, 255, 0.4)" } }}>
            <Box component="span" sx={{ position: "relative", zIndex: 1, alignSelf: "flex-start", fontFamily: "var(--font-mono), monospace",
              fontSize: "0.8rem", fontWeight: 600, color: "#6fdcff", letterSpacing: "0.08em" }}>
              {String(index + 1).padStart(2, "0")}
            </Box>
            <Box className="step-orb" sx={{ ...neural.iconOrb, position: "relative", zIndex: 1, width: 64, height: 64, borderRadius: "50%", mt: -0.5,
              "& svg": { fontSize: 30, filter: "drop-shadow(0 0 7px rgba(34, 181, 255, 0.95))" } }}>
              <Icon aria-hidden="true" />
            </Box>
            <Box component="h3" sx={{ position: "relative", zIndex: 1, m: "20px 0 0", fontSize: { xs: "1.25rem", md: "1.4rem" }, fontWeight: 650,
              letterSpacing: "-0.03em", color: "#f1f8ff" }}>{title}</Box>
            <Box component="p" sx={{ position: "relative", zIndex: 1, m: "10px 0 0", maxWidth: "32ch", color: "#b9cde2", lineHeight: 1.62 }}>{text}</Box>
          </Box>
        </Box>
      ))}
    </Box>
  </>;
}
