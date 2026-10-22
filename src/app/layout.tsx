import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Header from "@/components/layout/Header";
import PageTransition from "@/components/ui/PageTransition";
import Cursor from "@/components/ui/Cursor";
import Magnetic from "@/components/ui/Magnetic";
import ScrollEffects from "@/components/ui/ScrollEffects";
import { getDepartments } from "@/lib/departments";
import { getFeatures } from "@/lib/features";
import Footer from "@/components/layout/Footer";
import { getMenuGroups } from "@/lib/menu";
import { sectionHref } from "@/lib/categories";
import { OFFERINGS } from "@/lib/wellness";
import "./globals.css";
import "../styles/motion.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: { default: "Lishe — Wellness & Journal", template: "%s — Lishe" },
  description:
    "Lishe brings together Lishe Wellness (teas, jams, Pilates and movement) and the Lishe Journal, a South African wellness publication.",
};

const bootScript = `(function(){var d=document.documentElement;try{var s=localStorage.getItem("lishe-theme");var ok=s==="light"||s==="sepia"||s==="dark";var t=ok?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");d.setAttribute("data-theme",t);}catch(e){d.setAttribute("data-theme","light");}d.setAttribute("data-intro","skip");})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [departments, features] = await Promise.all([getDepartments(), getFeatures(6)]);
  const featureImage = features.find((p) => p.image)?.image ?? null;
  const menu = getMenuGroups(departments, featureImage && { src: featureImage.src, alt: featureImage.alt });

  const journal = [
    ...departments.map((d) => ({ key: d.dept.key, label: d.dept.label, href: sectionHref(d.dept.key), posts: d.posts })),
    { key: "features", label: "Features", href: "/journal/features", posts: features },
  ];
  const wellness = OFFERINGS.map(({ key, label, pillar, kicker, blurb, tone, image }) => ({ key, label, pillar, kicker, blurb, tone, image }));

  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <PageTransition />
        <Cursor />
        <Magnetic />
        <ScrollEffects />
        <SmoothScroll>
          <Header journal={journal} wellness={wellness} menu={menu} />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
