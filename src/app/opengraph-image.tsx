import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const alt = `${profile.name}, ${profile.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const bebas = await readFile(
    join(process.cwd(), "src/app/og/bebas-neue.ttf"),
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#050505",
        color: "#f0f0f0",
        fontFamily: "Bebas Neue",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 30,
          letterSpacing: 6,
        }}
      >
        <div style={{ width: 48, height: 2, background: "#e8ff47" }} />
        <span style={{ color: "#e8ff47" }}>{profile.availability}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 150, lineHeight: 0.9 }}>{profile.name}</div>
        <div
          style={{
            fontSize: 64,
            lineHeight: 1,
            color: "#e8ff47",
            marginTop: 16,
            display: "flex",
            gap: 16,
          }}
        >
          {/* Satori mis-measures hyphenated words, so lay out the parts itself */}
          {profile.jobTitle.split(" ").map((word) => (
            <span key={word} style={{ display: "flex" }}>
              {word.split(/(-)/).map((part, i) => (
                <span key={i}>{part}</span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 30,
          letterSpacing: 3,
          color: "#8a8a8a",
        }}
      >
        <span>React · Next.js · Angular · TypeScript · Node.js · .NET</span>
        <span>theadnansaleem.com</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Bebas Neue", data: bebas, style: "normal", weight: 400 },
      ],
    },
  );
}
