import type { Post } from "@/types/post";
import { mockPosts } from "@/lib/mock";
import { EXCLUDED_CATEGORY_IDS, EXCLUDED_CATEGORY_SLUGS } from "@/lib/categories";
import { localStoryImage } from "@/lib/local-images";

const API = "https://lishe.co.za/wp-json/wp/v2";

const strip = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#?\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

interface Term {
  slug: string;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapPost(p: any): Post {
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  const terms: Term[] = p._embedded?.["wp:term"]?.[0] ?? [];
  const term = terms.find((t) => !EXCLUDED_CATEGORY_SLUGS.includes(t.slug));
  const words = strip(p.content?.rendered ?? "").split(/\s+/).length;
  const title = strip(p.title.rendered);

  const local = localStoryImage(p.slug);

  return {
    id: p.id,
    slug: p.slug,
    title,
    excerpt: strip(p.excerpt.rendered),
    date: p.date,
    category: term ? strip(term.name) : "Lifestyle",
    image: local
      ? { src: local, alt: media?.alt_text || title, width: 1600, height: 1000 }
      : media?.source_url
        ? {
            src: media.source_url,
            alt: media.alt_text || title,
            width: media.media_details?.width ?? 1600,
            height: media.media_details?.height ?? 1000,
          }
        : null,
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
}

export async function getPosts(params: { perPage?: number; category?: number } = {}): Promise<Post[]> {
  try {
    const q = new URLSearchParams({
      _embed: "1",
      per_page: String(params.perPage ?? 12),
      categories_exclude: EXCLUDED_CATEGORY_IDS.join(","),
      ...(params.category ? { categories: String(params.category) } : {}),
    });
    const res = await fetch(`${API}/posts?${q}`, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`WP API ${res.status}`);
    const data = await res.json();
    return data.map(mapPost) as Post[];
  } catch (err) {
    console.warn("[wp] falling back to mock data:", (err as Error).message);
    return mockPosts.slice(0, params.perPage ?? 12);
  }
}
