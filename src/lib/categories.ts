export interface Department {
  key: "nourish" | "move" | "live";
  label: string;
  blurb: string;
  topics: string[];
  /** WordPress category slugs that belong to this section (exact match) */
  slugs: string[];
  /** old cover filename (still accepted) */
  legacy: string;
}

export const EXPLORE_INTRO = {
  title: "Explore Wellness",
  text: "Discover the stories, knowledge, and practices that nurture balanced living.",
};

export const DEPARTMENTS: Department[] = [
  {
    key: "nourish",
    label: "Nourish",
    blurb: "What we eat shapes how we feel.",
    topics: ["Healthy eating", "Gut health", "Expert interviews", "Nutrition guides", "Recipes"],
    slugs: ["nutrition", "nourishmentonaplate"],
    legacy: "nutrition",
  },
  {
    key: "move",
    label: "Move",
    blurb: "Move better. Live stronger.",
    topics: ["Pilates", "Training", "Running", "Strength", "Recovery"],
    slugs: ["fitness", "health-coach-at-work"],
    legacy: "fitness",
  },
  {
    key: "live",
    label: "Live",
    blurb: "People. Places. Ideas.",
    topics: ["Financial fitness", "Education", "Travel", "Beauty", "Interviews"],
    slugs: ["lifestyle", "travel", "education", "financial-fitness"],
    legacy: "lifestyle",
  },
];

/** Never shown anywhere on the site (spam + empty bucket). */
export const EXCLUDED_CATEGORY_IDS = [29, 30, 28];
export const EXCLUDED_CATEGORY_SLUGS = ["uncategorized", "mostbet-az-90", "mostbet-apk", "mostbet-uz"];
