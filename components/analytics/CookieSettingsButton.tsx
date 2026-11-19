"use client";

import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { openConsentSettings } from "@/lib/consent";

/** Reopens the analytics cookie banner so visitors can change their answer. */
export default function CookieSettingsButton({ className, sx }: { className?: string; sx?: SxProps<Theme> }) {
  return (
    <Box component="button" type="button" className={className} onClick={openConsentSettings}
      sx={[{ p: 0, border: 0, background: "none", font: "inherit", color: "inherit", cursor: "pointer" }, ...(Array.isArray(sx) ? sx : [sx])]}>
      Cookie settings
    </Box>
  );
}
