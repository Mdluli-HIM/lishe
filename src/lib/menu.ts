import type { DepartmentData } from "@/lib/departments";

export interface MenuItem {
  href: string;
  label: string;
  image: { src: string; alt: string } | null;
}

const imageOf = (d: DepartmentData) => {
  if (d.cover) return { src: d.cover, alt: d.dept.label };
  const img = d.posts[0]?.image;
  return img ? { src: img.src, alt: img.alt } : null;
};

export const getMenuItems = (departments: DepartmentData[]): MenuItem[] =>
  departments.map((d) => ({
    href: `/explore/${d.dept.key}`,
    label: d.dept.label,
    image: imageOf(d),
  }));
