export type MegaKey = "journal" | "wellness";

export interface NavItem {
  label: string;
  href: string;
  /** opens that side's hover panel */
  mega?: MegaKey;
}

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/our-story" },
  { label: "Wellness", href: "/wellness", mega: "wellness" },
  { label: "Journal", href: "/journal", mega: "journal" },
  { label: "Contact", href: "/contact" },
];
