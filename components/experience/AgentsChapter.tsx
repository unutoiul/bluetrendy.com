import Box from "@mui/material/Box";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import HubOutlined from "@mui/icons-material/HubOutlined";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import HowToRegOutlined from "@mui/icons-material/HowToRegOutlined";
import InsightsOutlined from "@mui/icons-material/InsightsOutlined";
import BuildCircleOutlined from "@mui/icons-material/BuildCircleOutlined";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";
import SplitSection from "@/components/SplitSection";
import { neural } from "./neuralStyle";

// The agent sits at the centre and reaches the places it works through.
const reach = [
  { label: "Documents", x: 112, y: 64, Icon: ArticleOutlined },
  { label: "Your systems", x: 488, y: 64, Icon: HubOutlined },
  { label: "Email & chat", x: 548, y: 214, Icon: ForumOutlined },
  { label: "Your approval", x: 300, y: 292, Icon: HowToRegOutlined },
  { label: "Reports", x: 52, y: 214, Icon: InsightsOutlined },
];
const core = { x: 300, y: 166 };

const capabilities = [
  { title: "Answers from your documents", Icon: ArticleOutlined,
    text: "Reads your policies, contracts and help centre, then answers with a link to the source." },
  { title: "Works in your tools", Icon: BuildCircleOutlined,
    text: "Creates tickets, updates records and sends messages in the systems you already use, with the permissions you choose." },
  { title: "Asks before it acts", Icon: VerifiedUserOutlined,
    text: "Sends unusual or risky cases to the right person and waits for their approval." },
  { title: "Tested and monitored", Icon: InsightsOutlined,
    text: "We test it on real cases before launch and log every step it takes once it is live." },
];

const percent = (value: number, total: number) => `${(value / total) * 100}%`;

function AgentMap() {
  return (
    <Box role="img" aria-label="An AI agent at the centre, connected to documents, your systems, email and chat, reports, and your approval."
      sx={{ position: "relative", width: "100%", aspectRatio: "600 / 330", mb: { xs: 3, md: 4 },
        "@media (prefers-reduced-motion: reduce)": { "& .packet": { display: "none" } } }}>
      <Box component="svg" viewBox="0 0 600 330" aria-hidden="true" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
        <defs>
          <radialGradient id="agent-core"><stop offset="0" stopColor="#7fe6ff" stopOpacity=".55" /><stop offset="1" stopColor="#1e6bff" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx={core.x} cy={core.y} rx="250" ry="118" fill="none" stroke="#2f7dff" strokeOpacity=".35" strokeDasharray="3 7" />
        <ellipse cx={core.x} cy={core.y} rx="150" ry="70" fill="none" stroke="#3fa8ff" strokeOpacity=".25" />
        <circle cx={core.x} cy={core.y} r="96" fill="url(#agent-core)" />
        {reach.map(({ label, x, y }, index) => {
          const out = `M${core.x},${core.y} L${x},${y}`;
          const back = `M${x},${y} L${core.x},${core.y}`;
          return <g key={label}>
            <line x1={core.x} y1={core.y} x2={x} y2={y} stroke="#4fb8ff" strokeOpacity=".45" strokeWidth="1.2" />
            {/* Packets of work travel out to each place and results come back. */}
            <circle className="packet" r="3.2" fill="#e4fbff" style={{ filter: "drop-shadow(0 0 4px #4fd2ff)" }}>
              <animateMotion dur="2.6s" begin={`${index * 0.45}s`} repeatCount="indefinite" path={out} />
            </circle>
            <circle className="packet" r="2.4" fill="#8eeaff">
              <animateMotion dur="2.6s" begin={`${index * 0.45 + 1.3}s`} repeatCount="indefinite" path={back} />
            </circle>
          </g>;
        })}
      </Box>
      <Box sx={{ position: "absolute", left: percent(core.x, 600), top: percent(core.y, 330), translate: "-50% -50%", display: "grid",
        justifyItems: "center", gap: 1, textAlign: "center" }}>
        <Box sx={{ ...neural.iconOrb, width: { xs: 54, sm: 76 }, height: { xs: 54, sm: 76 }, borderRadius: "50%",
          animation: "neural-breathe 3.2s ease-in-out infinite", "& svg": { fontSize: { xs: 26, sm: 36 }, filter: "drop-shadow(0 0 8px #22b5ff)" },
          "@media (prefers-reduced-motion: reduce)": { animation: "none" } }}>
          <AutoAwesomeOutlined />
        </Box>
        <Box component="span" sx={{ fontWeight: 650, fontSize: { xs: ".78rem", sm: ".95rem" }, color: "#e9f8ff" }}>AI agent</Box>
      </Box>
      {reach.map(({ label, x, y, Icon }) => (
        <Box key={label} sx={{ position: "absolute", left: percent(x, 600), top: percent(y, 330), translate: "-50% -50%", display: "grid",
          justifyItems: "center", gap: 0.75 }}>
          <Box sx={{ ...neural.iconOrb, width: { xs: 36, sm: 46 }, height: { xs: 36, sm: 46 }, "& svg": { fontSize: { xs: 18, sm: 22 } } }}><Icon /></Box>
          <Box component="span" sx={{ fontSize: { xs: ".75rem", sm: ".8rem" }, fontWeight: 600, color: "#b9d4ea", whiteSpace: "nowrap" }}>{label}</Box>
        </Box>
      ))}
    </Box>
  );
}

export default function AgentsChapter() {
  return (
    <SplitSection id="agents-heading" tone="dark" title="AI agents that take on real work"
      text="We design, build and run AI agents that handle repeat tasks across your documents and systems, while a person stays in charge of the decisions that matter."
      link={{ href: "/contact", label: "Plan your first agent" }}
      effect="packetMesh" seed={57}>
      <AgentMap />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
        {capabilities.map(({ title, text, Icon }) => (
          <Box key={title} data-panel sx={{ ...neural.glassCard, display: "flex", gap: 2, alignItems: "flex-start", p: 2.5 }}>
            <Box sx={{ ...neural.iconOrb, position: "relative", zIndex: 1, width: 44, height: 44, "& svg": { fontSize: 22 } }}><Icon aria-hidden="true" /></Box>
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box component="h3" sx={{ m: 0, fontSize: "1.08rem", fontWeight: 650, letterSpacing: "-0.02em", color: "#f1f8ff" }}>{title}</Box>
              <Box component="p" sx={{ m: "6px 0 0", color: "#b9cde2", lineHeight: 1.55, fontSize: ".95rem" }}>{text}</Box>
            </Box>
          </Box>
        ))}
      </Box>
    </SplitSection>
  );
}
