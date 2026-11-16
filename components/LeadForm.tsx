"use client";

import { useState } from "react";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { trackEvent } from "@/lib/analytics";
import { leadFieldLimits } from "@/lib/lead";

const projectTypes = [
  "New product build",
  "Legacy modernization",
  "AI automation",
  "Mobile app",
  "Mission-critical / regulated system",
  "Other",
];

const budgets = ["Under $25k", "$25k – $75k", "$75k – $150k", "$150k+", "Not sure yet"];

const timelines = ["ASAP", "1–3 months", "3–6 months", "6+ months", "Flexible"];

type FormState = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
};

export default function LeadForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMessage("");
    trackEvent("lead_form_submit", { projectType: form.projectType || "unspecified" });

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        trackEvent("lead_form_error");
        return;
      }

      setStatus("success");
      setConfirmationSent(data.confirmationSent === true);
      setForm(initialState);
      trackEvent("lead_form_success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or email us directly.");
      trackEvent("lead_form_error");
    }
  }

  if (status === "success") {
    return (
      <Alert severity="success" sx={{ borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Brief received.
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {confirmationSent ? "A confirmation is on its way to your inbox. " : ""}
          We&apos;ll reply within one business day. Want to skip the wait?{" "}
          <Typography component={Link} href="/book-a-call" sx={{ fontWeight: 700, textDecoration: "underline" }}>
            Book a call now →
          </Typography>
        </Typography>
      </Alert>
    );
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2.5} aria-busy={status === "loading"}>
      <Box aria-hidden="true" sx={{ position: "absolute", left: -10000, width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Name"
            name="name"
            autoComplete="name"
            slotProps={{ htmlInput: { maxLength: leadFieldLimits.name } }}
            required
            fullWidth
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Work email"
            name="email"
            autoComplete="email"
            slotProps={{ htmlInput: { maxLength: leadFieldLimits.email } }}
            type="email"
            required
            fullWidth
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </Grid>
      </Grid>

      <TextField
        label="Company (optional)"
        name="company"
        autoComplete="organization"
        slotProps={{ htmlInput: { maxLength: leadFieldLimits.company } }}
        fullWidth
        value={form.company}
        onChange={(e) => update("company", e.target.value)}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            select
            label="Project type"
            fullWidth
            value={form.projectType}
            onChange={(e) => update("projectType", e.target.value)}
          >
            {projectTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            select
            label="Budget"
            fullWidth
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
          >
            {budgets.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            select
            label="Timeline"
            fullWidth
            value={form.timeline}
            onChange={(e) => update("timeline", e.target.value)}
          >
            {timelines.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <TextField
        label="Tell us about the project"
        name="message"
        slotProps={{ htmlInput: { maxLength: leadFieldLimits.message } }}
        helperText={`${form.message.length.toLocaleString()} / 4,000 characters`}
        required
        multiline
        minRows={4}
        fullWidth
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
      />

      {status === "error" ? (
        <Alert severity="warning">
          {errorMessage}{" "}
          <Typography component="a" href="mailto:contact@bluetrendy.com" sx={{ fontWeight: 700, textDecoration: "underline" }}>
            contact@bluetrendy.com
          </Typography>
        </Alert>
      ) : null}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={status === "loading"}
        startIcon={status === "loading" ? <CircularProgress size={16} color="inherit" /> : null}
        sx={{ alignSelf: "flex-start" }}
      >
        {status === "loading" ? "Sending…" : "Send project brief"}
      </Button>
      <Typography variant="caption" color="text.secondary">
        We&apos;ll use your details to respond to your enquiry and send a confirmation email.{" "}
        <Box component={Link} href="/legal/privacy" sx={{ textDecoration: "underline" }}>Privacy policy</Box>
      </Typography>
    </Stack>
  );
}
