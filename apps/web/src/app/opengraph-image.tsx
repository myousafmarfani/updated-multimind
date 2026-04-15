import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          background:
            "radial-gradient(circle at top right, rgba(66, 122, 255, 0.35), transparent 45%), linear-gradient(120deg, #f8f4ee, #dce6f7 45%, #f6fbf4)",
          color: "#192533",
          fontFamily: "Georgia",
        }}
      >
        <div style={{ fontSize: 68, lineHeight: 1.1, fontWeight: 700 }}>MultiMind</div>
        <div style={{ marginTop: 20, fontSize: 34, opacity: 0.9 }}>
          One prompt. Four model perspectives.
        </div>
      </div>
    ),
    { ...size },
  );
}
