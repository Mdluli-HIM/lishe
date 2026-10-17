"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function ScrollEffects() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);

  // reading progress, plus a header that tucks away while scrolling down
  useEffect(() => {
    const html = document.documentElement;
    let last = window.scrollY;
    html.dataset.header = "shown";

    const onScroll = () => {
      const y = window.scrollY;
      const max = html.scrollHeight - window.innerHeight;
      if (bar.current) {
        bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, y / max)) : 0})`;
      }
      const dy = y - last;
      if (Math.abs(dy) < 8) return;
      html.dataset.header = dy > 0 && y > 240 ? "hidden" : "shown";
      last = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // re-measure every scroll trigger once fonts and images have settled
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 600);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
    };
  }, [pathname]);

  // scroll-linked choreography (moves wrappers, never the words the reveal animates)
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const title = document.querySelector(".hero__title");
        if (title) {
          gsap.to(title, {
            yPercent: -8,
            opacity: 0.15,
            ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
          });
        }

        gsap.utils.toArray<HTMLElement>(".cf__headline .cf__line").forEach((line, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          gsap.fromTo(
            line,
            { x: `${-2 * dir}vw` },
            {
              x: `${2 * dir}vw`,
              ease: "none",
              scrollTrigger: { trigger: line, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      });
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [pathname]);

  return <div ref={bar} className="progress" aria-hidden />;
}
