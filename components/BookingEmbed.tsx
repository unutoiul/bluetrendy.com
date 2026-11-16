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
      <Stack spacing={2.5} sx={{ alignItems: "center", textAlign: "center", bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 3, px: { xs: 3, sm: 6 }, py: 7 }}>
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
    <Stack spacing={2}>
      <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden", minWidth: 0 }}>
        {booking.provider === "cal" ? <CalEmbed calLink={booking.calLink} /> : <CalendlyEmbed url={booking.url} />}
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
        Times are shown in your timezone. Can&apos;t see the calendar?{" "}
        <Box component="a" href={booking.url} target="_blank" rel="noopener noreferrer" sx={{ color: "primary.main", textDecoration: "underline", fontWeight: 600 }}>
          Open the booking page <OpenInNew sx={{ fontSize: 13, verticalAlign: "middle" }} />
        </Box>
      </Typography>
    </Stack>
  );
}
