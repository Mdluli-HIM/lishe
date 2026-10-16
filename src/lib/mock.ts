import type { Post } from "@/types/post";

const base = { image: null, readingMinutes: 5 };

export const mockPosts: Post[] = [
  { id: 1, slug: "the-new-way-we-think-about-wellness", title: "The new way we think about wellness", excerpt: "How South Africans are redefining what it means to be well.", date: "2026-10-12T08:00:00", category: "fitness", ...base },
  { id: 2, slug: "gut-health-basics", title: "Gut health, explained simply", excerpt: "What your microbiome actually does.", date: "2026-10-09T08:00:00", category: "nutrition", ...base },
  { id: 3, slug: "slow-travel-wellness", title: "Wellness destinations worth the drive", excerpt: "Five retreats within reach.", date: "2026-10-04T08:00:00", category: "lifestyle", ...base },
  { id: 4, slug: "pilates-for-runners", title: "Why runners need Pilates", excerpt: "Strength that prevents injury.", date: "2026-10-01T08:00:00", category: "fitness", ...base },
];
