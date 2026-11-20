import Box from "@mui/material/Box";
import type { BookingPrefill } from "@/components/CalEmbed";

/** Compatibility for an existing Calendly event link; Cal.com is preferred. */
export default function CalendlyEmbed({ url, prefill }: { url: string; prefill?: BookingPrefill }) {
  const embedUrl = new URL(url);
  embedUrl.searchParams.set("embed_type", "Inline");
  if (prefill) {
    embedUrl.searchParams.set("name", prefill.name);
    embedUrl.searchParams.set("email", prefill.email);
    embedUrl.searchParams.set("a1", prefill.notes);
  }
  return (
    <Box
      component="iframe"
      title="Book a free AI Opportunity Call with BlueTrendy"
      src={embedUrl.href}
      loading="lazy"
      sx={{ display: "block", width: "100%", height: 780, border: 0 }}
    />
  );
}
