import Box from "@mui/material/Box";

/** Compatibility for an existing Calendly event link; Cal.com is preferred. */
export default function CalendlyEmbed({ url }: { url: string }) {
  const embedUrl = new URL(url);
  embedUrl.searchParams.set("embed_type", "Inline");
  return (
    <Box
      component="iframe"
      title="Book a free discovery call with BlueTrendy"
      src={embedUrl.href}
      loading="lazy"
      sx={{ display: "block", width: "100%", height: 780, border: 0 }}
    />
  );
}
