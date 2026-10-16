export interface Department {
  key: "nutrition" | "fitness" | "lifestyle";
  label: string;
  blurb: string;
  topics: string[];
  /** WordPress category slugs that belong to this department (exact match) */
  slugs: string[];
}

export const DEPARTMENTS: Department[] = [
  {
    key: "nutrition",
    label: "Nutrition",
    blurb: "What we eat shapes how we feel.",
    topics: ["Healthy eating", "Gut health", "Expert interviews", "Nutrition guides", "Recipes"],
    slugs: ["nutrition", "nourishmentonaplate"],
  },
  {
    key: "fitness",
    label: "Fitness",
    blurb: "Move better. Live stronger.",
    topics: ["Pilates", "Training", "Running", "Strength", "Recovery"],
    slugs: ["fitness", "health-coach-at-work"],
  },
  {
    key: "lifestyle",
    label: "Lifestyle",
    blurb: "People. Places. Ideas.",
    topics: ["Financial fitness", "Education", "Travel", "Beauty", "Interviews"],
    slugs: ["lifestyle", "travel", "education", "financial-fitness"],
  },
];

/** Never shown anywhere on the site (spam + empty bucket). */
export const EXCLUDED_CATEGORY_IDS = [29, 30, 28]; // mostbet-* spam
export const EXCLUDED_CATEGORY_SLUGS = ["uncategorized", "mostbet-az-90", "mostbet-apk", "mostbet-uz"];
