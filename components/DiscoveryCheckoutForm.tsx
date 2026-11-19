"use client";

import { useState } from "react";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import LockOutlined from "@mui/icons-material/LockOutlined";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import FieldCheck from "./motion/FieldCheck";
import { trackEvent } from "@/lib/analytics";
import { formatPounds, type DiscoveryPackage } from "@/data/pricing";

// Outlined fields on the dark glass panel.
const darkField = {
  "& .MuiInputLabel-root": { color: "#9fb8cf" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#8eeaff" },
  "& .MuiOutlinedInput-root": {
    color: "#eef6ff", backgroundColor: "rgba(4, 16, 36, 0.55)", borderRadius: "12px",
    "& fieldset": { borderColor: "rgba(111, 180, 240, 0.35)" },
    "&:hover fieldset": { borderColor: "rgba(142, 234, 255, 0.6)" },
    "&.Mui-focused fieldset": { borderColor: "#6fdcff", borderWidth: 1, boxShadow: "0 0 0 3px rgba(111, 220, 255, 0.18)" },
  },
  "& textarea::placeholder, & input::placeholder": { color: "#7f98b0", opacity: 1 },
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

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={status === "loading"}
        startIcon={status === "loading" ? <CircularProgress size={16} color="inherit" /> : null}
        endIcon={status === "loading" ? null : <ArrowForwardRounded />}
        sx={{ "&.Mui-disabled": { color: "#d6e8f8", backgroundColor: "#1d5aa6" } }}
      >
        {status === "loading" ? "Opening secure checkout…" : `Book your sprint for ${formatPounds(sprint.price)}`}
      </Button>
      <Typography variant="caption" sx={{ display: "flex", gap: 1, alignItems: "flex-start", color: "#9fb8cf", lineHeight: 1.5 }}>
        <LockOutlined aria-hidden="true" sx={{ fontSize: 16, mt: "1px", color: "#6fdcff" }} />
        Secure checkout via Stripe. Straight after payment you&apos;ll get a link to pick a time for your kickoff call.
      </Typography>
    </Stack>
  );
}
