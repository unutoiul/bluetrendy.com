"use client";

import { useState } from "react";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import FieldCheck from "./motion/FieldCheck";
import { trackEvent } from "@/lib/analytics";

export default function DiscoveryCheckoutForm() {
  const [email, setEmail] = useState("");
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    trackEvent("checkout_start", { location: "pricing_page" });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, brief }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        trackEvent("checkout_error", { location: "pricing_page" });
        return;
      }

      window.location.href = data.url;
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or book a call instead.");
      trackEvent("checkout_error", { location: "pricing_page" });
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2}>
      <TextField
        label="Work email"
        type="email"
        required
        size="small"
        slotProps={{ input: { endAdornment: <FieldCheck show={/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())} /> } }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="What are you looking to build? (optional)"
        multiline
        minRows={2}
        size="small"
        value={brief}
        onChange={(e) => setBrief(e.target.value)}
        fullWidth
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
        color="secondary"
        size="large"
        disabled={status === "loading"}
        startIcon={status === "loading" ? <CircularProgress size={16} color="inherit" /> : null}
      >
        {status === "loading" ? "Redirecting to checkout…" : "Book & pay for discovery sprint"}
      </Button>
      <Typography variant="caption" color="text.secondary">
        Secure checkout via Stripe. You&apos;ll receive a calendar link to schedule your kickoff call right after
        payment.
      </Typography>
    </Stack>
  );
}
