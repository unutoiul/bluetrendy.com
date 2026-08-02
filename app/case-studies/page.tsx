import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import PageHero from "@/components/PageHero";
import CaseStudyCard from "@/components/CaseStudyCard";
import CTASection from "@/components/CTASection";
import { caseStudies } from "@/data/caseStudies";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Six production engagements across financial services, healthcare, defense, industrial, and enterprise SaaS — trading platforms, medical imaging, geospatial intelligence, and identity infrastructure.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title="Production systems, not portfolio pieces"
        subtitle="Six engagements across financial services, healthcare, defense, industrial, and enterprise SaaS — each one shipped to real users under real constraints."
      />

      <Container sx={{ py: { xs: 10, md: 14 } }}>
        <Grid container spacing={3}>
          {caseStudies.map((cs) => (
            <Grid key={cs.slug} size={{ xs: 12, md: 6 }}>
              <CaseStudyCard caseStudy={cs} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <CTASection location="case_studies_page" />
    </>
  );
}
