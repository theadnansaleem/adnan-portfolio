import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Satori mis-measures hyphenated words, so each word is laid out as its own box.
function Words({ text, gap }: { text: string; gap: number }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap }}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} style={{ display: "flex" }}>
          {word.split(/(-)/).map((part, j) => (
            <span key={j}>{part}</span>
          ))}
        </span>
      ))}
    </div>
  );
}

/** The share card for a case study or an article: a label, the title, and a line under it. */
export async function card(label: string, title: string, foot: string) {
  const bebas = await readFile(join(process.cwd(), "src/app/og/bebas-neue.ttf"));

  return new ImageResponse(
    (
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
          <span style={{ color: "#e8ff47" }}>{label}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.05 }}>
          <Words text={title} gap={18} />
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
          <span>{foot}</span>
          <span style={{ color: "#e8ff47" }}>theadnansaleem.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Bebas Neue", data: bebas, style: "normal", weight: 400 }],
    },
  );
}
