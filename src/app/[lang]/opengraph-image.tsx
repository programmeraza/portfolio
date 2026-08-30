import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/data";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
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
          background: "#0b0c16",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,126,179,0.25), transparent 50%), radial-gradient(circle at 80% 80%, rgba(123,44,191,0.25), transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
              color: "#000",
              background: "linear-gradient(135deg, #ff7eb3 0%, #7b2cbf 100%)",
            }}
          >
            {"</>"}
          </div>
          <div style={{ fontSize: 28, color: "rgba(240,240,240,0.6)" }}>
            {siteConfig.title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            color: "#f0f0f0",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "rgba(240,240,240,0.6)",
            marginTop: 24,
            maxWidth: 900,
          }}
        >
          {siteConfig.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
