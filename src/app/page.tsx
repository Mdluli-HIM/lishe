import BrandHero from "@/components/sections/BrandHero";
import SideBand from "@/components/sections/SideBand";
import StoryStage from "@/components/sections/StoryStage";
import CategoryIndex from "@/components/sections/CategoryIndex";
import Offerings from "@/components/sections/Offerings";
import StoryLine from "@/components/sections/StoryLine";
import { getDepartments } from "@/lib/departments";
import { getFeatures } from "@/lib/features";
import { OFFERINGS } from "@/lib/wellness";
import { HERO_IMAGE } from "@/lib/site";

export default async function Home() {
  const [features, departments] = await Promise.all([getFeatures(5), getDepartments()]);
  const live = departments.find((d) => d.dept.key === "live")?.cover;
  const journalImage = live ? { src: live, alt: "" } : (features[0]?.image ?? null);

  return (
    <main>
      <BrandHero
        doors={[
          { side: "wellness", image: HERO_IMAGE, items: OFFERINGS.map((o) => o.label) },
          { side: "journal", image: journalImage, items: ["Nourish", "Move", "Live", "Features"] },
        ]}
      />

      <SideBand side="wellness" />
      <Offerings items={OFFERINGS} />

      <SideBand side="journal" />
      <StoryStage posts={features} label="Journal / Features" more={{ href: "/journal/features", label: "All features →" }} />
      <CategoryIndex items={departments} />

      <StoryLine />
    </main>
  );
}
