import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 15,
          background: "linear-gradient(135deg, #10b981, #14b8a6)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 800,
          borderRadius: 8,
          letterSpacing: -0.5,
        }}
      >
        RG
      </div>
    ),
    { ...size }
  );
}
