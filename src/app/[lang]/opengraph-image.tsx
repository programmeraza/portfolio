import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/data";

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
          background: "#05050a",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(123,108,255,0.25), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,95,196,0.25), transparent 50%)",
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
              background: "linear-gradient(135deg, #7b6cff 0%, #4f9dff 45%, #ff5fc4 100%)",
            }}
          >
            {"</>"}
          </div>
          <div style={{ fontSize: 28, color: "rgba(242,242,245,0.62)" }}>
            {siteConfig.title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            color: "#f2f2f5",
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
            color: "rgba(242,242,245,0.62)",
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
