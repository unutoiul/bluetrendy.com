import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import LivingBackground from "@/components/backgrounds/LivingBackground";
import HeadingMotion from "@/components/motion/HeadingMotion";
import { neural } from "@/components/experience/neuralStyle";
import { palette, withAlpha } from "@/theme/palette";
import PolicyContents from "./PolicyContents";

type PolicySection = {
  id: string;
  title: string;
  /** One or two plain-English sentences shown above the detail, so the page can be skimmed. */
  summary?: ReactNode;
  body: ReactNode;
};
type Highlight = { Icon: ElementType; title: string; detail: string };

type PolicyArticleProps = {
  sections: PolicySection[];
  related: { href: string; title: string };
  /** The key points in a row of cards above the text, for people who only read the top. */
  highlights?: { title: string; accent: string; intro?: string; items: Highlight[] };
  /** Small print at the end of the page, such as the company's registered details. */
  footnote?: ReactNode;
};

/**
 * A legal page: key points at a glance, then numbered sections, each opening with a short
 * plain-English summary, beside a contents list that follows your reading. It ends with a
 * link to the companion policy.
 */
export default function PolicyArticle({ sections, related, highlights, footnote }: PolicyArticleProps) {
  return (
    <>
      {highlights && (
        <Box component="section" aria-labelledby="policy-glance" sx={{ ...neural.sectionTone("header", "header"), py: { xs: 6, md: 9 } }}>
          <LivingBackground effect="constellation" quiet="top" seed={29} />
          <Box sx={{ position: "relative", zIndex: 1, width: "var(--page-width)", mx: "auto" }}>
            <Box component="p" sx={neural.label}>At a glance</Box>
            <HeadingMotion id="policy-glance" text={highlights.title} accent={highlights.accent}
              sx={{ m: 0, maxWidth: "20ch", fontSize: "clamp(2rem, 3.8vw, 3.2rem)", fontWeight: 650, letterSpacing: "-0.05em", lineHeight: 1.06 }} />
            {highlights.intro && <Box component="p" sx={{ m: "16px 0 0", maxWidth: "60ch", color: palette.slate[125], fontSize: "clamp(1rem, 1.2vw, 1.1rem)", lineHeight: 1.6 }}>
              {highlights.intro}
            </Box>}
            <Box component="ul" data-panel-group sx={{ listStyle: "none", m: 0, p: 0, mt: { xs: 4, md: 5 }, display: "grid", gap: 2,
              gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", lg: `repeat(${Math.min(highlights.items.length, 3)}, minmax(0, 1fr))` } }}>
              {highlights.items.map(({ Icon, title, detail }) => (
                <Box component="li" key={title} data-panel sx={{ ...neural.glassCard, display: "flex", gap: 2, alignItems: "flex-start", p: { xs: 2.5, md: 3 } }}>
                  <Box sx={{ ...neural.iconOrb, position: "relative", zIndex: 1, width: 44, height: 44, "& svg": { ...neural.iconOrb["& svg"], fontSize: 22 } }}>
                    <Icon aria-hidden="true" />
                  </Box>
                  <Box sx={{ position: "relative", zIndex: 1, minWidth: 0 }}>
                    <Box component="h3" sx={{ m: 0, fontSize: "1.08rem", fontWeight: 650, letterSpacing: "-0.02em", lineHeight: 1.3 }}>{title}</Box>
                    <Box component="p" sx={{ m: "6px 0 0", color: palette.slate[125], fontSize: ".95rem", lineHeight: 1.55 }}>{detail}</Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      <Box sx={{ bgcolor: palette.grey[25] }}>
        <Box sx={{ width: "var(--page-width)", mx: "auto", display: "grid", alignItems: "start",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(220px, 280px) minmax(0, 1fr)" },
          columnGap: "clamp(40px, 6vw, 96px)", pt: { xs: 0, md: 9 }, pb: { xs: 7, md: 11 } }}>
          <PolicyContents label="Contents" items={sections.map(({ id, title }) => ({ id, title }))} />

          <Box component="article" sx={{ minWidth: 0, maxWidth: 760, pt: { xs: 4, md: 0 } }}>
            {sections.map((section, index) => (
              <Box component="section" key={section.id} id={section.id} aria-labelledby={section.id + "-title"}
                sx={{ scrollMarginTop: { xs: 128, md: 110 }, "& + &": { mt: { xs: 5, md: 7 }, pt: { xs: 5, md: 7 }, borderTop: `1px solid ${withAlpha(palette.blue[325], 0.16)}` } }}>
                <Box component="p" aria-hidden="true" sx={{ m: "0 0 10px", fontFamily: "var(--font-mono), monospace", fontSize: ".78rem", fontWeight: 600,
                  letterSpacing: ".08em", color: palette.blue[450] }}>
                  {String(index + 1).padStart(2, "0")}
                </Box>
                <Box component="h2" id={section.id + "-title"} sx={{ m: 0, color: palette.navy[725], fontSize: "clamp(1.55rem, 2.6vw, 2.1rem)", fontWeight: 650,
                  letterSpacing: "-0.04em", lineHeight: 1.12, textWrap: "balance" }}>
                  {section.title}
                </Box>
                {section.summary && (
                  <Box sx={{ mt: 2.5, p: { xs: "14px 16px", md: "16px 20px" }, borderRadius: "12px", position: "relative", overflow: "hidden",
                    background: `linear-gradient(120deg, ${withAlpha(palette.blue[350], 0.09)}, ${withAlpha(palette.sky[150], 0.06)})`,
                    border: `1px solid ${withAlpha(palette.blue[350], 0.16)}`,
                    "&::before": { content: '""', position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                      background: `linear-gradient(180deg, ${palette.sky[150]}, ${palette.blue[450]})` } }}>
                    <Box component="p" sx={{ m: 0, color: palette.blue[550], fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>
                      In short
                    </Box>
                    <Box component="p" sx={{ m: "6px 0 0", color: palette.navy[725], fontSize: "1.02rem", fontWeight: 520, lineHeight: 1.6 }}>{section.summary}</Box>
                  </Box>
                )}
                <Box sx={{ mt: 2.5, color: palette.slate[525], fontSize: "1.02rem", lineHeight: 1.75,
                  "& p, & .MuiTypography-root": { color: "inherit", fontSize: "inherit", lineHeight: "inherit" },
                  // Doubled, so the spacing outranks Typography's own margin reset.
                  "&& > *": { m: 0 },
                  "&& > * + *": { mt: 2 },
                  "& strong": { color: palette.navy[725], fontWeight: 650 },
                  "& a": { color: palette.blue[550], fontWeight: 600, textUnderlineOffset: ".2em" },
                  "& ul": { listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.25 },
                  "& li": { position: "relative", pl: 3 },
                  "& li::before": { content: '""', position: "absolute", left: 4, top: ".72em", width: 7, height: 7, borderRadius: "50%",
                    background: `radial-gradient(circle, ${palette.sky[150]} 0 35%, ${palette.blue[450]} 70%)`, boxShadow: `0 0 8px ${withAlpha(palette.blue[350], 0.5)}` } }}>
                  {section.body}
                </Box>
              </Box>
            ))}

            {/* The companion policy. */}
            <Box sx={{ mt: { xs: 6, md: 8 }, "& a": { display: "inline-flex", alignItems: "center", gap: 1, color: palette.blue[550], fontWeight: 650, fontSize: "1.05rem",
              textDecoration: "none", "& svg": { transition: "transform .3s ease" }, "&:hover svg": { transform: "translateX(3px)" },
              "&:hover": { textDecoration: "underline", textUnderlineOffset: ".2em" } } }}>
              <Link href={related.href} prefetch={false}>Read our {related.title} <ArrowForwardRounded fontSize="small" /></Link>
            </Box>
            {footnote && <Box component="p" sx={{ m: "28px 0 0", color: palette.slate[475], fontSize: ".82rem", lineHeight: 1.6 }}>{footnote}</Box>}
          </Box>
        </Box>
      </Box>
    </>
  );
}
