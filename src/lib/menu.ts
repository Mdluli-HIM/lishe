import type { DepartmentData } from "@/lib/departments";
import { sectionHref } from "@/lib/categories";
import { OFFERINGS } from "@/lib/wellness";

export interface MenuItem {
  href: string;
  label: string;
  image: { src: string; alt: string } | null;
  /** colour shown when there is no photo */
  tone?: string;
}

export interface MenuGroups {
  journal: MenuItem[];
  wellness: MenuItem[];
}

const imageOf = (d: DepartmentData) => {
  if (d.cover) return { src: d.cover, alt: d.dept.label };
  const img = d.posts[0]?.image;
  return img ? { src: img.src, alt: img.alt } : null;
};

export const getMenuGroups = (departments: DepartmentData[], featureImage: MenuItem["image"]): MenuGroups => ({
  journal: [
    ...departments.map((d) => ({ href: sectionHref(d.dept.key), label: d.dept.label, image: imageOf(d) })),
    { href: "/journal/features", label: "Features", image: featureImage },
  ],
  wellness: OFFERINGS.map((o) => ({ href: `/wellness/${o.key}`, label: o.label, image: o.image, tone: o.tone })),
});
