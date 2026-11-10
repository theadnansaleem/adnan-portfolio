import { card } from "@/app/og/card";
import { profile } from "@/lib/data";

const TITLE = "Hire a senior full-stack developer";

export const alt = TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return card("Hire", TITLE, profile.name);
}
