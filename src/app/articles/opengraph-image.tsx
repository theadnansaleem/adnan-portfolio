import { card } from "@/app/og/card";
import { profile } from "@/lib/data";

const TITLE = "Articles on React, .NET, Azure AI and legacy migration";

export const alt = TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return card("Articles", TITLE, profile.name);
}
