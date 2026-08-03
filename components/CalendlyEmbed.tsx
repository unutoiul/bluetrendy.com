"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function CalendlyEmbed() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;
  const [height, setHeight] = useState(700);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.origin !== "https://calendly.com") return;
      if (e.data?.event === "calendly.page_height") {
        const parsedHeight = parseFloat(e.data.payload?.height);
        if (!Number.isNaN(parsedHeight)) {
          setHeight(parsedHeight);
        }
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!calendlyUrl) {
    return (
      <Stack
        spacing={2}
        sx={{
          alignItems: "center",
          textAlign: "center",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          p: 6,
        }}
      >
        <Typography variant="h6">Calendar booking is being set up.</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
          In the meantime, send us a note and we&apos;ll reply with a time that works for you.
        </Typography>
        <Button href="mailto:contact@bluetrendy.com" variant="contained" color="primary">
          Email contact@bluetrendy.com
        </Button>
      </Stack>
    );
  }

  return (
    <Box>
      <Box
        className="calendly-inline-widget"
        data-url={calendlyUrl}
        sx={{ minWidth: 320, height, transition: "height 0.2s ease" }}
      />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
    </Box>
  );
}
