import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import OpenInNew from "@mui/icons-material/OpenInNew";
import CalEmbed from "@/components/CalEmbed";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import LinkButton from "@/components/LinkButton";
import { getBookingConfig } from "@/lib/booking";

export default function BookingEmbed() {
  const booking = getBookingConfig(
    process.env.NEXT_PUBLIC_CAL_COM_URL,
    process.env.NEXT_PUBLIC_CALENDLY_URL,
  );

  if (!booking) {
    return (
      <Stack spacing={2.5} sx={{ alignItems: "center", textAlign: "center", bgcolor: "background.paper", borderRadius: 3, px: { xs: 3, sm: 6 }, py: 7 }}>
        <CalendarMonthOutlined sx={{ fontSize: 40, color: "secondary.main" }} />
        <Typography variant="h5">Let&apos;s find a time to talk</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
          Tell us a little about your project and a few times that suit you.
          We&apos;ll reply within one business day to arrange your free discovery call.
        </Typography>
        <Button href="mailto:contact@bluetrendy.com?subject=Free%20discovery%20call" variant="contained" color="primary">
          Arrange a discovery call
        </Button>
        <LinkButton href="/contact" variant="text">Or send a project brief</LinkButton>
      </Stack>
    );
  }

  return (
    <Box component="section" aria-label="Choose a date and time" sx={{ borderRadius: "12px", overflow: "hidden", minWidth: 0, bgcolor: "background.paper" }}>
      <Stack direction="row" sx={{ px: { xs: 1.5, sm: 2.5 }, py: 1, gap: 1, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="caption" color="text.secondary">Times in your timezone</Typography>
        <Box component="a" href={booking.url} target="_blank" rel="noopener noreferrer" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, minHeight: 28, color: "primary.main", fontSize: 12, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 }}>
          Open full calendar <OpenInNew sx={{ fontSize: 13 }} />
        </Box>
      </Stack>
      <Box sx={{ minWidth: 0 }}>
        {booking.provider === "cal" ? <CalEmbed calLink={booking.calLink} /> : <CalendlyEmbed url={booking.url} />}
      </Box>
    </Box>
  );
}
