import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/lib/content";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public", "profile.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "#fbf9f5",
          color: "#30332e",
        }}
      >
        <img
          src={src}
          alt=""
          width={260}
          height={260}
          style={{ borderRadius: 32, objectFit: "cover" }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#5a6a8c", letterSpacing: 4 }}>
            {profile.city.toUpperCase()}
          </div>
          <div style={{ fontSize: 84, fontWeight: 700, marginTop: 12 }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 42, color: "#506454", marginTop: 8 }}>
            {profile.title}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
