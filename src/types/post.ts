export type Category = "nutrition" | "fitness" | "lifestyle";

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: Category | string;
  image: { src: string; alt: string; width: number; height: number } | null;
  readingMinutes: number;
}
