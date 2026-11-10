import { card } from "@/app/og/card";
import { profile } from "@/lib/data";

const TITLE = "Case studies: government, fintech, cybersecurity";

export const alt = TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return card("Case studies", TITLE, profile.name);
}
