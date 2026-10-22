import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import FeatureList from "@/components/sections/FeatureList";
import { FEATURES_INTRO, getFeatures } from "@/lib/features";

export const metadata: Metadata = {
  title: "Features",
  description: FEATURES_INTRO.text,
};

export default async function FeaturesPage() {
  const features = await getFeatures();

  return (
    <main data-side="journal">
      <PageIntro
        side="journal"
        crumbs={[{ label: "Lishe", href: "/" }, { label: "Journal", href: "/journal" }, { label: "Features" }]}
        lines={["Features"]}
        lead={FEATURES_INTRO.text}
      />
      <FeatureList posts={features} />
    </main>
  );
}
