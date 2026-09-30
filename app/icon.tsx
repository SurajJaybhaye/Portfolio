import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#5a6a8c",
          color: "#fbf9f5",
          fontSize: 38,
          fontWeight: 700,
          borderRadius: 14,
        }}
      >
        SJ
      </div>
    ),
    size,
  );
}
