import { HERO_IMAGE } from "@/lib/site";
import { firstExisting } from "@/lib/local-images";
import { DEPARTMENTS, type Department } from "@/lib/categories";

export interface Offering {
  key: "teas" | "jams" | "pilates";
  label: string;
  /** the shared Lishe ethos this offering belongs to: Nourish, Move or Live */
  pillar: Department["key"];
  kicker: string;
  blurb: string;
  body: string[];
  points: string[];
  cta: { label: string; topic: string };
  /** a related journal topic, searched on the offering page */
  read: string;
  /** colour of the panel when no photo has been added yet */
  tone: string;
  image: { src: string; alt: string } | null;
}


/** Put photos at public/images/wellness/<key>.(jpg|webp|png) and they replace the colour panel. */
const photo = (key: string, alt: string, fallback?: string) => {
  const src =
    firstExisting(["webp", "jpg", "jpeg", "png"].map((e) => `images/wellness/${key}.${e}`)) ?? fallback;
  return src ? { src, alt } : null;
};

export const OFFERINGS: Offering[] = [
  {
    key: "teas",
    label: "Teas",
    pillar: "nourish",
    kicker: "Five blends",
    blurb: "Wellness in a cup.",
    body: [
      "Our wellness teas are blended with the same care the journal brings to every plate: what goes in matters as much as how it tastes.",
      "The range now holds five blends, and the fifth was developed recently. Each one is made for a slow moment in the day.",
    ],
    points: ["Five wellness blends", "The fifth, newly developed", "Made for everyday rituals"],
    cta: { label: "Enquire about our teas", topic: "teas" },
    read: "Gut health",
    tone: "#6b7a4f",
    image: photo("teas", "Lishe wellness teas"),
  },
  {
    key: "jams",
    label: "Jams",
    pillar: "nourish",
    kicker: "Where it began",
    blurb: "The first jar.",
    body: [
      "Our jams were the first thing Lishe made. They were the moment the publication moved from writing about nourishment to making it.",
      "Every jar carries the idea that started it all: nourishment should be simple, honest and shared.",
    ],
    points: ["Our first products", "Where Lishe Wellness began", "Made to be shared"],
    cta: { label: "Enquire about our jams", topic: "jams" },
    read: "Healthy eating",
    tone: "#b0532e",
    image: photo("jams", "Lishe jams"),
  },
  {
    key: "pilates",
    label: "Pilates",
    pillar: "move",
    kicker: "Movement",
    blurb: "Nourish how you move.",
    body: [
      "Nourishment is also how we care for the body. Our Pilates and movement offering brings strength, posture and breath into everyday life.",
      "It is the same philosophy as the journal, practised on the mat instead of the page.",
    ],
    points: ["Strength, posture and breath", "Part of our movement offering", "Ask us about sessions"],
    cta: { label: "Enquire about Pilates", topic: "pilates" },
    read: "Pilates",
    tone: "#8a7a62",
    image: photo("pilates", "Pilates movement", HERO_IMAGE.src),
  },
];

export const getOffering = (key: string) => OFFERINGS.find((o) => o.key === key) ?? null;

export const pillarOf = (key: Department["key"]) => DEPARTMENTS.find((d) => d.key === key)!;

/** How each part of the Lishe ethos shows up on the Wellness side. */
export const WELLNESS_PILLARS: Record<Department["key"], string> = {
  nourish: "Our teas and jams, made with the same care the Journal brings to every plate.",
  move: "Pilates and movement for strength, posture and breath.",
  live: "Nourishment beyond the plate: the people, places and ideas that shape a balanced life, explored in the Journal.",
};
