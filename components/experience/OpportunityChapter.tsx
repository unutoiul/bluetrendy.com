import OpportunityScanner from "@/components/lab/OpportunityScanner";
import ChapterIntro from "./ChapterIntro";

export default function OpportunityChapter() {
  return <>
    <ChapterIntro id="opportunities-heading" label="AI opportunity scanner" title="Find your first" accent="AI opportunity"
      subtitle="Answer two questions. The scanner suggests the system we would build first, how it would work and the number to measure." />
    <OpportunityScanner />
  </>;
}
