"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

const SELECTOR = ".hero__cta, .cf__more, .fg__more, .cf__all, .header__menu, .theme__btn, [data-magnetic]";

export default function Magnetic() {
  const pathname = usePathname();

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const undo: (() => void)[] = [];

      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          gsap.to(el, {
            x: (e.clientX - (r.left + r.width / 2)) * 0.3,
            y: (e.clientY - (r.top + r.height / 2)) * 0.45,
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto",
          });
        };
        const leave = () =>
          gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)", overwrite: "auto" });

        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        undo.push(() => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
          gsap.set(el, { clearProps: "x,y" });
        });
      });

      return () => undo.forEach((fn) => fn());
    });

    return () => mm.revert();
  }, [pathname]);

  return null;
}
