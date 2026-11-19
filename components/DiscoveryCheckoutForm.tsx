"use client";

import { useState } from "react";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ActionButton from "./ActionButton";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import LockOutlined from "@mui/icons-material/LockOutlined";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import FieldCheck from "./motion/FieldCheck";
import { trackEvent } from "@/lib/analytics";
import { formatPounds, type DiscoveryPackage } from "@/data/pricing";
import { palette, withAlpha } from "@/theme/palette";

// Outlined fields on the dark glass panel.
const darkField = {
  "& .MuiInputLabel-root": { color: palette.slate[200] },
  "& .MuiInputLabel-root.Mui-focused": { color: palette.sky[100] },
  "& .MuiOutlinedInput-root": {
    color: palette.grey[25], backgroundColor: withAlpha(palette.navy[850], 0.55), borderRadius: "12px",
    // The theme turns a focused field white, which hides this panel's light text.
    "&.Mui-focused": { backgroundColor: withAlpha(palette.navy[850], 0.8), boxShadow: "none" },
    "& fieldset": { borderColor: withAlpha(palette.blue[250], 0.35) },
    "&:hover fieldset": { borderColor: withAlpha(palette.sky[100], 0.6) },
    "&.Mui-focused fieldset": { borderColor: palette.sky[150], borderWidth: 1, boxShadow: `0 0 0 3px ${withAlpha(palette.sky[150], 0.18)}` },
  },
  // Browser autofill paints its own pale background; keep the field dark and the text light.
  "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
    WebkitBoxShadow: `0 0 0 100px ${palette.navy[800]} inset`,
    WebkitTextFillColor: palette.grey[25],
    caretColor: palette.grey[25],
    borderRadius: "inherit",
  },
  "& textarea::placeholder, & input::placeholder": { color: palette.slate[375], opacity: 1 },
} as const;

export default function DiscoveryCheckoutForm({ sprint }: { sprint: DiscoveryPackage }) {
  const [email, setEmail] = useState("");
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    trackEvent("checkout_start", { location: "pricing_page", package: sprint.id });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, brief, package: sprint.id }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        trackEvent("checkout_error", { location: "pricing_page", package: sprint.id });
        return;
      }

      window.location.href = data.url;
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or book a call instead.");
      trackEvent("checkout_error", { location: "pricing_page", package: sprint.id });
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2} data-clarity-mask="true">
      <TextField
        label="Work email"
        name="email"
        autoComplete="email"
        spellCheck={false}
        type="email"
        required
        slotProps={{ input: { endAdornment: <FieldCheck show={/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())} /> } }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        sx={darkField}
      />
      <TextField
        label="What do you want to build?"
        name="brief"
        multiline
        minRows={3}
        placeholder="A customer portal, an internal tool, connecting two systems…"
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        fullWidth
        sx={darkField}
      />

      {status === "error" ? (
        <Alert severity="warning">
          {errorMessage}{" "}
          <Typography component={Link} href="/book-a-call" sx={{ fontWeight: 700, textDecoration: "underline" }}>
            Book a call instead →
          </Typography>
        </Alert>
      ) : null}

      <ActionButton
        type="submit"
        variant="contained"
        size="large"
        disabled={status === "loading"}
        startIcon={status === "loading" ? <CircularProgress size={16} color="inherit" /> : null}
        endIcon={status === "loading" ? null : <ArrowForwardRounded />}
        sx={{ "&.Mui-disabled": { color: palette.slate[100], backgroundColor: palette.blue[550] } }}
      >
        {status === "loading" ? "Opening secure checkout…" : `Book your sprint for ${formatPounds(sprint.price)}`}
      </ActionButton>
      <Typography variant="caption" sx={{ display: "flex", gap: 1, alignItems: "flex-start", color: palette.slate[200], lineHeight: 1.5 }}>
        <LockOutlined aria-hidden="true" sx={{ fontSize: 16, mt: "1px", color: palette.sky[150] }} />
        Secure checkout via Stripe. Straight after payment you&apos;ll get a link to pick a time for your kickoff call.
      </Typography>
    </Stack>
  );
}
