import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LinkButton from "./LinkButton";
import StatStrip from "./StatStrip";
import Reveal from "./motion/Reveal";
import founderPhoto from "@/public/brand/founder.png";

export default function HomeAboutSection() {
  return (
    <Box component="section" sx={{ py: { xs: 7, md: 11 }, bgcolor: "background.paper" }}>
      <Container>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, alignItems: "center", gap: { xs: 4, md: 9 } }}>
          <Reveal>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.75, mb: 3 }}>
              <Image src={founderPhoto} alt="" width={56} height={56} style={{ objectFit: "cover", borderRadius: "50%" }} />
              <Box><Typography sx={{ fontWeight: 700 }}>Lucas Franco</Typography><Typography variant="body2" color="text.secondary">Founder &amp; lead engineer</Typography></Box>
            </Box>
            <Typography variant="h3" component="h2">Work directly with the engineer building your product.</Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>Our team has shipped software inside banks, hospitals, and government agencies. You work with us from the first architecture decision through deployment and handover.</Typography>
            <LinkButton href="/about" variant="text" sx={{ mt: 2, px: 0, "--underline-inset": "0px" }}>Meet BlueTrendy</LinkButton>
          </Reveal>
          <Box sx={{ bgcolor: "background.default", borderLeft: { md: "1px solid" }, borderColor: "divider", pl: { md: 5 } }}><StatStrip compact /></Box>
        </Box>
      </Container>
    </Box>
  );
}
