import { card } from "@/app/og/card";
import { profile } from "@/lib/data";
import { roles } from "@/lib/roles";

const role = roles.frontend;

export const alt = role.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return card(role.name, role.title, profile.name);
}
