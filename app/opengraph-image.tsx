import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "bluetrendy — AI-first custom software consultancy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(160deg, #071E2C 0%, #0B4563 55%, #123A52 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#2787BE",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>bluetrendy</div>
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 900 }}>
          Enterprise software, built at AI speed by senior engineers.
        </div>
        <div style={{ fontSize: 26, color: "rgba(255,255,255,0.75)", marginTop: 28, maxWidth: 820 }}>
          AI-first custom software consultancy — web, mobile, and mission-critical systems.
        </div>
      </div>
    ),
    { ...size },
  );
}
