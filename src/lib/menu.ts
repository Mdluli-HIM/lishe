import type { DepartmentData } from "@/lib/departments";
import { firstExisting } from "@/lib/local-images";

export interface MenuItem {
  href: string;
  label: string;
  image: { src: string; alt: string } | null;
}

const imageOf = (d?: DepartmentData) => {
  if (!d) return null;
  if (d.cover) return { src: d.cover, alt: d.dept.label };
  const img = d.posts[0]?.image;
  return img ? { src: img.src, alt: img.alt } : null;
};

export function getMenuItems(departments: DepartmentData[]): MenuItem[] {
  const by = (k: string) => departments.find((d) => d.dept.key === k);
  const voices = firstExisting(
    ["webp", "jpg", "jpeg", "png"].map((e) => `images/departments/voices.${e}`)
  );

  return [
    { href: "/fitness", label: "Fitness", image: imageOf(by("fitness")) },
    { href: "/nutrition", label: "Nutrition", image: imageOf(by("nutrition")) },
    { href: "/lifestyle", label: "Lifestyle", image: imageOf(by("lifestyle")) },
    {
      href: "/experts",
      label: "Voices",
      image: voices ? { src: voices, alt: "Voices" } : imageOf(by("lifestyle")),
    },
  ];
}
