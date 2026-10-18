export interface NavItem {
  label: string;
  href: string;
  /** opens the Explore hover panel */
  mega?: boolean;
}

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/our-story" },
  { label: "Explore", href: "/explore", mega: true },
  { label: "Features", href: "/features" },
  { label: "Contact", href: "/contact" },
];
