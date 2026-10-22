import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import PostGrid from "@/components/sections/PostGrid";
import { searchPosts } from "@/lib/wp";

export const metadata: Metadata = { title: "Search the Journal" };

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export default async function SearchPage({ searchParams }: Props) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 80) ?? "";
  const posts = q ? await searchPosts(q, 18) : [];

  return (
    <main data-side="journal">
      <PageIntro
        side="journal"
        crumbs={[{ label: "Lishe", href: "/" }, { label: "Journal", href: "/journal" }, { label: "Search" }]}
        lines={[q || "Search"]}
        lead={q ? `${posts.length} ${posts.length === 1 ? "story" : "stories"} in the Lishe Journal.` : undefined}
      >
        <form action="/search" className="sr__form" role="search">
          <label htmlFor="q" className="label">Search the Journal</label>
          <input id="q" name="q" defaultValue={q} placeholder="Gut health, Pilates, indigenous foods…" />
          <button type="submit" className="label">Search →</button>
        </form>
      </PageIntro>
      <PostGrid posts={posts} />
    </main>
  );
}
