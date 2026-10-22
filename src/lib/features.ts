import { getPostsBySlugs } from "@/lib/wp";
import type { Post } from "@/types/post";

/**
 * Curated Features: hand-picked journal stories, expert interviews included.
 * Reorder, add or remove slugs here (the slug is the end of the article's web address).
 * The first one leads the Features page.
 */
export const FEATURE_PICKS: { slug: string; kind: string }[] = [
  { slug: "how-indigenous-foods-cultivate-holistic-wellness-lishe", kind: "Indigenous foods" },
  { slug: "rediscovering-yourself-an-interview-with-yvette-ratshikhopha-on-her-new-book-coming-home-to-yourself", kind: "Expert interview" },
  { slug: "tends-lab-where-science-skincare-and-african-innovation-meet", kind: "Thought leadership" },
  { slug: "tashas-where-culture-design-and-hospitality-converge", kind: "Restaurant visit" },
  { slug: "unlocking-hair-health-insights-from-bontlhale-tshetlo-trichologists-expertise", kind: "Expert interview" },
  { slug: "the-science-and-sacredness-of-breastfeeding-an-african-connection", kind: "Nutrition" },
  { slug: "chef-lillian-elidah-realizing-the-african-dream-on-a-global-scale", kind: "Expert interview" },
  { slug: "wellness-state-of-mind-with-lisa-raleigh", kind: "Expert interview" },
  { slug: "refining-fitness-the-strength-of-pilates", kind: "Fitness" },
  { slug: "your-second-brain-why-gut-health-shapes-your-life", kind: "Nutrition" },
  { slug: "amy-hopkins-the-mindful-face-of-wellness-in-south-africa", kind: "Expert interview" },
  { slug: "world-food-day-2025-building-food-security-and-nutrition-in-africa", kind: "Thought leadership" },
  { slug: "eat-ting-celebrating-the-beauty-of-indigenous-food", kind: "Indigenous foods" },
  { slug: "filled-with-love-and-talent-tebo-and-lebo-ndala", kind: "Expert interview" },
];

export const FEATURES_INTRO = {
  title: "Features",
  text: "Selected stories from the Lishe Journal: expert interviews, thought leadership, indigenous foods, restaurant visits and practical insight into holistic living.",
};

/** Curated posts in pick order, each labelled with its kind. Missing slugs are skipped. */
export async function getFeatures(limit = FEATURE_PICKS.length): Promise<Post[]> {
  const picks = FEATURE_PICKS.slice(0, limit);
  const posts = await getPostsBySlugs(picks.map((p) => p.slug));
  return picks.flatMap((pick) => {
    const post = posts.find((p) => p.slug === pick.slug);
    return post ? [{ ...post, category: pick.kind }] : [];
  });
}
