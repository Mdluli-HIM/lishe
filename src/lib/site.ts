import { firstExisting } from "@/lib/local-images";

const REMOTE_FALLBACK =
  "https://lishe.co.za/wp-content/uploads/2023/04/Whether-You-Have-15-Minutes-or-30-This-Full-Body-Pilates-Workout-Will-Wake-You-Up1.jpg";

/** Put your photo at public/images/hero/hero-home.(jpg|webp|png) */
export const HERO_IMAGE = {
  src:
    firstExisting([
      "images/hero/hero-home.webp",
      "images/hero/hero-home.jpg",
      "images/hero/hero-home.jpeg",
      "images/hero/hero-home.png",
    ]) ?? REMOTE_FALLBACK,
  alt: "Lishe — wellness, fitness and lifestyle",
};
