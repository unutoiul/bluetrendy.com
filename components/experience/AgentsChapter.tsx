import Box from "@mui/material/Box";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import SmartToyOutlined from "@mui/icons-material/SmartToyOutlined";
import QuestionAnswerOutlined from "@mui/icons-material/QuestionAnswerOutlined";
import PlaylistAddCheckRounded from "@mui/icons-material/PlaylistAddCheckRounded";
import HowToRegOutlined from "@mui/icons-material/HowToRegOutlined";
import ManageSearchOutlined from "@mui/icons-material/ManageSearchOutlined";
import SplitSection from "@/components/SplitSection";
import AgentDemo from "./AgentDemo";
import { neural } from "./neuralStyle";
import { palette, withAlpha } from "@/theme/palette";

// The quickest way to explain an agent: put it next to the chatbot everyone already knows.
const comparison = [
  { who: "A chatbot", Icon: ForumOutlined, says: "“Your order is due on Wednesday.”", note: "It answers, then you do the rest." },
  { who: "An AI agent", Icon: SmartToyOutlined, says: "“Done. I moved your delivery to Friday and emailed you a confirmation.”", note: "It answers and does the work." },
];

const capabilities = [
  { title: "Answer questions", Icon: QuestionAnswerOutlined,
    text: "It reads your documents and answers customers or staff, with a link to where the answer came from." },
  { title: "Do the busywork", Icon: PlaylistAddCheckRounded,
    text: "It fills in forms, updates records and sends follow-ups in the tools you already use." },
  { title: "Ask before big decisions", Icon: HowToRegOutlined,
    text: "Refunds, payments and anything unusual go to a person, who approves or changes them." },
  { title: "Show its work", Icon: ManageSearchOutlined,
    text: "Every step is written down, so you can always see what it did and why." },
];

export default function AgentsChapter() {
  return (
    <SplitSection id="agents-heading" tone="dark" pinned title="Watch AI run a business"
      text="An AI agent is a digital worker that can use your software. You give it a job and some rules; it does the routine steps and asks a person when it isn’t sure."
      link={{ href: "/ai-agents", label: "Build an agent like this" }}
      effect="packetMesh" seed={57} background={neural.blueFlow("services", "agents")}>

      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" }, mb: { xs: 2.5, md: 3 } }}>
        {comparison.map(({ who, Icon, says, note }, index) => {
          const agent = index === 1;
          return (
            <Box key={who} sx={{ display: "flex", gap: 1.75, alignItems: "flex-start", p: 2.25, borderRadius: "16px",
              border: `1px solid ${agent ? withAlpha(palette.sky[150], 0.5) : withAlpha(palette.sky[175], 0.2)}`,
              background: agent ? `linear-gradient(140deg, ${withAlpha(palette.blue[350], 0.22)}, ${withAlpha(palette.navy[775], 0.6)})` : withAlpha(palette.navy[850], 0.45),
              boxShadow: agent ? `0 0 26px -6px ${withAlpha(palette.blue[300], 0.45)}` : "none" }}>
              <Box aria-hidden="true" sx={{ ...neural.iconOrb, width: 42, height: 42, borderRadius: "12px", "& svg": { fontSize: 22 },
                ...(agent ? {} : { color: palette.slate[275], boxShadow: "none", border: `1px solid ${withAlpha(palette.sky[175], 0.25)}`, background: withAlpha(palette.navy[775], 0.8) }) }}>
                <Icon />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Box component="h3" sx={{ m: 0, fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: agent ? palette.sky[100] : palette.slate[275] }}>{who}</Box>
                <Box component="p" sx={{ m: "6px 0 0", color: agent ? palette.grey[25] : palette.slate[125], fontSize: "1rem", lineHeight: 1.45, fontWeight: agent ? 600 : 500 }}>{says}</Box>
                <Box component="p" sx={{ m: "6px 0 0", color: palette.slate[275], fontSize: "0.88rem" }}>{note}</Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      <AgentDemo />

      <Box component="h3" sx={{ m: { xs: "36px 0 16px", md: "44px 0 18px" }, fontSize: "1.25rem", fontWeight: 650, letterSpacing: "-0.02em", color: palette.grey[25] }}>
        What every agent we build can do
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
        {capabilities.map(({ title, text, Icon }) => (
          <Box key={title} data-panel sx={{ ...neural.glassCard, display: "flex", gap: 2, alignItems: "flex-start", p: 2.5 }}>
            <Box sx={{ ...neural.iconOrb, position: "relative", zIndex: 1, width: 44, height: 44, "& svg": { fontSize: 22 } }}><Icon aria-hidden="true" /></Box>
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box component="h4" sx={{ m: 0, fontSize: "1.08rem", fontWeight: 650, letterSpacing: "-0.02em", color: palette.grey[25] }}>{title}</Box>
              <Box component="p" sx={{ m: "6px 0 0", color: palette.slate[125], lineHeight: 1.55, fontSize: ".95rem" }}>{text}</Box>
            </Box>
          </Box>
        ))}
      </Box>
    </SplitSection>
  );
}
