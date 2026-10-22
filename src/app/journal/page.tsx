import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import StoryStage from "@/components/sections/StoryStage";
import CategoryIndex from "@/components/sections/CategoryIndex";
import PostGrid from "@/components/sections/PostGrid";
import { getDepartments } from "@/lib/departments";
import { getFeatures } from "@/lib/features";
import { getPosts } from "@/lib/wp";
import { JOURNAL_INTRO } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Lishe Journal",
  description: `${JOURNAL_INTRO.title}. ${JOURNAL_INTRO.text}`,
};

export default async function JournalPage() {
  const [features, departments, latest] = await Promise.all([getFeatures(5), getDepartments(), getPosts({ perPage: 12 })]);
  const featured = new Set(features.map((f) => f.id));

  return (
    <main data-side="journal">
      <PageIntro
        side="journal"
        crumbs={[{ label: "Lishe", href: "/" }, { label: "Journal" }]}
        lines={["Lishe", "Journal"]}
        lead={`${JOURNAL_INTRO.title}. ${JOURNAL_INTRO.text}`}
      />
      <CategoryIndex items={departments} label="Sections" />
      <StoryStage posts={features} label="Features" more={{ href: "/journal/features", label: "All features →" }} />
      <PostGrid posts={latest.filter((p) => !featured.has(p.id)).slice(0, 6)} label="Latest from the Journal" />
    </main>
  );
}
