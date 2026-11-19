"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CookieOutlined from "@mui/icons-material/CookieOutlined";
import ActionButton from "@/components/ActionButton";
import { analyticsIds, trackingLive } from "@/lib/analyticsConfig";
import {
  clearAnalyticsCookies, onConsentSettings, readConsent, subscribeConsent, writeConsent, type Consent,
} from "@/lib/consent";
import { palette, withAlpha } from "@/theme/palette";

// The server cannot see the visitor's choice, so it renders nothing and the browser decides.
const serverSnapshot = () => "unknown" as const;

/**
 * Asks on the first visit whether Google Analytics and Microsoft Clarity may run, and loads
 * them only after the visitor accepts. UK and EU rules require that consent for analytics cookies.
 */
export default function ConsentAnalytics() {
  const { ga, clarity } = analyticsIds;
  const consent = useSyncExternalStore(subscribeConsent, readConsent, serverSnapshot);
  const [reopened, setReopened] = useState(false);
  const banner = useRef<HTMLElement>(null);

  useEffect(() => onConsentSettings(() => setReopened(true)), []);
  useEffect(() => {
    if (reopened) banner.current?.querySelector("button")?.focus();
  }, [reopened]);

  if (!ga && !clarity) return null;

  function choose(value: Consent) {
    const withdrawn = consent === "granted" && value === "denied";
    writeConsent(value);
    setReopened(false);
    if (withdrawn && trackingLive) {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      window.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
      clearAnalyticsCookies();
      // The scripts are already running, so a fresh page load is the clean way to stop them.
      location.reload();
    }
  }

  const load = consent === "granted" && trackingLive;
  const tools = [ga && "Google Analytics", clarity && "Microsoft Clarity"].filter(Boolean).join(" and ");
  const showBanner = consent === null || (reopened && consent !== "unknown");
  return <>
    {load && ga && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
gtag('js', new Date());
gtag('config', '${ga}');
`}</Script>
    </>}
    {load && clarity && (
      <Script id="clarity-init" strategy="afterInteractive">{`
(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}");
window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
`}</Script>
    )}
    {showBanner && (
      <Box component="section" ref={banner} aria-labelledby="consent-title" sx={{
        position: "fixed", zIndex: 1250, insetInline: 0, bottom: 0,
        pb: "env(safe-area-inset-bottom)",
        color: palette.slate[100],
        bgcolor: withAlpha(palette.navy[800], 0.97),
        backgroundImage: `linear-gradient(100deg, ${withAlpha(palette.blue[500], 0.2)}, transparent 55%)`,
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${palette.navy[650]}`,
        boxShadow: `0 -20px 44px -26px ${withAlpha(palette.navy[850], 0.8)}`,
        "--rise": "28px",
        animation: "rise-in .5s var(--ease-out) both",
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}>
        <Container sx={{
          display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { md: "center" },
          gap: { xs: 2, md: 4 }, py: { xs: 2, md: 2.25 },
        }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.75, flex: 1, minWidth: 0 }}>
            <CookieOutlined sx={{ display: { xs: "none", sm: "block" }, mt: "1px", color: palette.sky[175] }} />
            <Box>
              <Typography component="h2" id="consent-title" sx={{ m: 0, color: palette.white, fontSize: "1rem", fontWeight: 650, lineHeight: 1.35 }}>
                We use cookies to improve the site
              </Typography>
              <Typography sx={{ mt: 0.5, maxWidth: "72ch", color: palette.slate[125], fontSize: ".875rem", lineHeight: 1.55 }}>
                With your permission, {tools} show us which pages help visitors
                {clarity ? " and how people move through them. Anything typed into a form stays hidden" : ""}.
                {" "}Nothing loads unless you accept.{" "}
                <Link href="/legal/privacy#cookies" style={{ color: palette.sky[100], fontWeight: 600 }}>Privacy policy</Link>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
            {/* The site's own buttons: Reject in the dark-surface style, as easy to see as Accept. */}
            <ActionButton tone="dark" variant="outlined" onClick={() => choose("denied")} sx={{ flex: { xs: 1, md: "none" }, minWidth: 124 }}>Reject</ActionButton>
            <ActionButton variant="contained" onClick={() => choose("granted")} sx={{ flex: { xs: 1, md: "none" }, minWidth: 124 }}>Accept</ActionButton>
          </Box>
        </Container>
      </Box>
    )}
  </>;
}
