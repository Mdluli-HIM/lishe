import type { Post } from "@/types/post";
import { mockPosts } from "@/lib/mock";
import { EXCLUDED_CATEGORY_IDS, EXCLUDED_CATEGORY_SLUGS } from "@/lib/categories";
import { localStoryImage } from "@/lib/local-images";

const API = "https://lishe.co.za/wp-json/wp/v2";

const NAMED: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  hellip: "…", ndash: "–", mdash: "—",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
};

const decodeEntity = (m: string) => {
  const body = m.slice(1, -1);
  if (body[0] === "#") {
    const code = body[1].toLowerCase() === "x" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
    return Number.isFinite(code) ? String.fromCodePoint(code) : " ";
  }
  return NAMED[body.toLowerCase()] ?? " ";
};

const strip = (html: string) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, decodeEntity)
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
  const title = strip(p.title.rendered).replace(/\s*[|–-]\s*Lishe$/i, "");

  const local = localStoryImage(p.slug);

  return {
    id: p.id,
    slug: p.slug,
    title,
    excerpt: strip(p.excerpt.rendered).replace(/\s*\[(…|\.\.\.)\]\s*$/, "…"),
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

async function fetchPosts(q: URLSearchParams, revalidate = 600): Promise<Post[]> {
  try {
    const res = await fetch(`${API}/posts?${q}`, { next: { revalidate } });
    if (!res.ok) return [];
    return ((await res.json()) as unknown[]).map(mapPost);
  } catch {
    return [];
  }
}

export function getPostsBySlugs(slugs: string[]): Promise<Post[]> {
  if (!slugs.length) return Promise.resolve([]);
  return fetchPosts(
    new URLSearchParams({ _embed: "1", per_page: String(Math.min(100, slugs.length)), slug: slugs.join(",") }),
    3600
  );
}

export function searchPosts(term: string, perPage = 24): Promise<Post[]> {
  return fetchPosts(
    new URLSearchParams({
      _embed: "1",
      per_page: String(perPage),
      search: term,
      categories_exclude: EXCLUDED_CATEGORY_IDS.join(","),
    })
  );
}

export interface Article extends Post {
  html: string;
}

/** One full story, including its body HTML from WordPress. */
export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const q = new URLSearchParams({ _embed: "1", slug });
    const res = await fetch(`${API}/posts?${q}`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const [raw] = await res.json();
    if (!raw) return null;
    return { ...mapPost(raw), html: cleanBody(raw.content?.rendered ?? "") };
  } catch {
    return null;
  }
}

/** Drops scripts, inline styles and empty paragraphs left by the old theme's editor. */
const cleanBody = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/<p>(\s|&nbsp;)*<\/p>/gi, "");

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
