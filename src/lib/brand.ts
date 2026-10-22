/** One brand, two sides. Copy shared by the header, homepage, Our Story and footer. */

export const SIDES = {
  journal: {
    key: "journal",
    name: "Lishe Journal",
    role: "The publication",
    href: "/journal",
    line: "Stories, expert voices and practical knowledge for balanced living.",
    text: "Expert interviews, thought leadership, nutrition, indigenous foods, fitness and restaurant visits. Wellness explored from every side, written for real life.",
  },
  wellness: {
    key: "wellness",
    name: "Lishe Wellness",
    role: "Products & movement",
    href: "/wellness",
    line: "Nourishment you can taste, sip and move through.",
    text: "Wellness teas, our jams, and Pilates and movement. The philosophy of the journal, made into things you can hold and practise.",
  },
} as const;

export type SideKey = keyof typeof SIDES;

export const WELLNESS_INTRO = {
  title: "Lishe Wellness",
  text: "Our teas, our jams and our movement practice. Nourishment you can taste, sip and feel.",
};

export const TAGLINE = "Nourishment, beyond the plate.";

export const MISSION =
  "Nourishment extends beyond what we eat. It is how we care for our bodies, our minds and our overall well-being, rooted in African perspectives on holistic living.";

export const STORY_CHAPTERS = [
  {
    side: "journal" as SideKey,
    title: "A publication",
    kicker: "Where it began",
    text: "Lishe means nutrition in Swahili. It began as a publication helping people navigate healthy living through practical information, expert knowledge, interviews and real-world experience. In 2023 LuxLife Magazine named it Best Emerging Wellness & Lifestyle Publication in South Africa.",
  },
  {
    side: "wellness" as SideKey,
    title: "From page to pantry",
    kicker: "Our jams",
    text: "What we wrote about, we started to make. Our jams were the first Lishe products, and the start of Lishe Wellness.",
  },
  {
    side: "wellness" as SideKey,
    title: "Five teas",
    kicker: "Wellness teas",
    text: "The range grew into wellness teas, blended with the same care for what goes into the body. Our fifth tea was developed recently.",
  },
  {
    side: "wellness" as SideKey,
    title: "Into movement",
    kicker: "Pilates",
    text: "Nourishment is also how we move. Our Pilates and movement offering brings the philosophy off the page and into the body.",
  },
  {
    side: "journal" as SideKey,
    title: "The bigger vision",
    kicker: "What's next",
    text: "The journal keeps asking questions and Wellness keeps answering them, both celebrating African perspectives on holistic living.",
  },
];

/** Contact details, from the current lishe.co.za contact page. Update here once confirmed. */
export const CONTACT = {
  person: "Sindisiwe Mbuthuma",
  email: "sindisiwe@lishe.co.za",
  phone: "076 257 0993",
  phoneHref: "+27762570993",
};

export const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/official_lishe" },
  { label: "Facebook", href: "https://www.facebook.com/officiallishe" },
  { label: "X", href: "https://x.com/Official_Lishe" },
];

/** Enquiry topics on the contact page; each one becomes the email subject. */
export const TOPICS = [
  { key: "general", label: "General", side: null },
  { key: "teas", label: "Teas", side: "wellness" },
  { key: "jams", label: "Jams", side: "wellness" },
  { key: "pilates", label: "Pilates", side: "wellness" },
  { key: "stockist", label: "Stock Lishe", side: "wellness" },
  { key: "interview", label: "Story or interview", side: "journal" },
  { key: "advertise", label: "Advertise & collaborate", side: "journal" },
] as const;
