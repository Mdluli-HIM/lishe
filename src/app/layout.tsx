import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Header from "@/components/layout/Header";
import Loader from "@/components/ui/Loader";
import PageTransition from "@/components/ui/PageTransition";
import Cursor from "@/components/ui/Cursor";
import Magnetic from "@/components/ui/Magnetic";
import ScrollEffects from "@/components/ui/ScrollEffects";
import { getDepartments } from "@/lib/departments";
import { getMenuItems } from "@/lib/menu";
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
  title: "Lishe — Nourish, Move, Live",
  description: "A South African wellness and lifestyle publication.",
};

const bootScript = `(function(){var d=document.documentElement;try{var s=localStorage.getItem("lishe-theme");var ok=s==="light"||s==="sepia"||s==="dark";var t=ok?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");d.setAttribute("data-theme",t);}catch(e){d.setAttribute("data-theme","light");}try{d.setAttribute("data-intro",sessionStorage.getItem("lishe-entered")?"skip":"on");}catch(e){d.setAttribute("data-intro","skip");}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const departments = await getDepartments();
  const menuItems = getMenuItems(departments);

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
        <Loader />
        <PageTransition />
        <Cursor />
        <Magnetic />
        <ScrollEffects />
        <SmoothScroll>
          <Header departments={departments} menuItems={menuItems} />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
