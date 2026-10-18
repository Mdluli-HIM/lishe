import { DEPARTMENTS, type Department } from "@/lib/categories";
import { mapPost, getPosts } from "@/lib/wp";
import { firstExisting } from "@/lib/local-images";
import type { Post } from "@/types/post";

const API = "https://lishe.co.za/wp-json/wp/v2";

interface Term {
  id: number;
  slug: string;
  count: number;
}

async function getTerms(): Promise<Term[]> {
  try {
    const res = await fetch(`${API}/categories?per_page=100&_fields=id,slug,count`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return (await res.json()) as Term[];
  } catch {
    return [];
  }
}

const coverFor = (d: Department) =>
  firstExisting(
    [d.key, d.legacy].flatMap((k) =>
      ["webp", "jpg", "jpeg", "png"].map((e) => `images/departments/${k}.${e}`)
    )
  );

export interface DepartmentData {
  dept: Department;
  count: number;
  posts: Post[];
  matched: boolean;
  cover: string | null;
}

export async function getDepartments(): Promise<DepartmentData[]> {
  const [terms, latest] = await Promise.all([getTerms(), getPosts({ perPage: 12 })]);

  return Promise.all(
    DEPARTMENTS.map(async (dept, i): Promise<DepartmentData> => {
      const cover = coverFor(dept);
      const hit = terms.filter((t) => dept.slugs.includes(t.slug));
      const count = hit.reduce((sum, t) => sum + t.count, 0);

      if (hit.length) {
        try {
          const q = new URLSearchParams({
            _embed: "1",
            per_page: "3",
            categories: hit.map((t) => t.id).join(","),
          });
          const res = await fetch(`${API}/posts?${q}`, { next: { revalidate: 600 } });
          if (res.ok) {
            const data = await res.json();
            if (data.length) return { dept, count, posts: data.map(mapPost), matched: true, cover };
          }
        } catch {
          // fall through to the latest-posts fallback
        }
      }
      return { dept, count: 0, posts: latest.slice(i * 3, i * 3 + 3), matched: false, cover };
    })
  );
}

/** All recent stories for one Explore section (Nourish, Move or Live). */
export async function getDepartmentPosts(
  key: string,
  perPage = 24
): Promise<{ dept: Department; posts: Post[] } | null> {
  const dept = DEPARTMENTS.find((d) => d.key === key);
  if (!dept) return null;

  const terms = await getTerms();
  const ids = terms.filter((t) => dept.slugs.includes(t.slug)).map((t) => t.id);
  if (!ids.length) return { dept, posts: [] };

  try {
    const q = new URLSearchParams({
      _embed: "1",
      per_page: String(perPage),
      categories: ids.join(","),
    });
    const res = await fetch(`${API}/posts?${q}`, { next: { revalidate: 600 } });
    if (res.ok) return { dept, posts: (await res.json()).map(mapPost) };
  } catch {
    // fall through
  }
  return { dept, posts: [] };
}
