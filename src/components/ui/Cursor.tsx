"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const CARDS = ".fg__link, .st__link, .st__t--on, .rl__card, .cf__feature, .cf__lead, .mega__card";
const QUIET = ".cat__link, .menu__links a";

export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const c = el.current;
      if (!c) return;

      gsap.set(c, { xPercent: -50, yPercent: -50 });
      const xTo = gsap.quickTo(c, "x", { duration: 0.45, ease: "power3" });
      const yTo = gsap.quickTo(c, "y", { duration: 0.45, ease: "power3" });
      let seen = false;

      const move = (e: MouseEvent) => {
        if (!seen) {
          seen = true;
          gsap.set(c, { x: e.clientX, y: e.clientY });
          c.dataset.on = "1";
        }
        xTo(e.clientX);
        yTo(e.clientY);
      };

      const over = (e: MouseEvent) => {
        const t = e.target as Element;
        let state = "idle";
        let words = "";
        if (t.closest(QUIET)) state = "quiet";
        else if (t.closest(CARDS)) {
          state = "card";
          words = "Read";
        } else if (t.closest("a, button, [role=radio]")) state = "link";
        c.dataset.state = state;
        if (text.current) text.current.textContent = words;
      };

      const leave = () => {
        seen = false;
        c.dataset.on = "0";
      };

      window.addEventListener("mousemove", move, { passive: true });
      document.addEventListener("mouseover", over, { passive: true });
      document.documentElement.addEventListener("mouseleave", leave);

      return () => {
        window.removeEventListener("mousemove", move);
        document.removeEventListener("mouseover", over);
        document.documentElement.removeEventListener("mouseleave", leave);
        c.dataset.on = "0";
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={el} className="cursor" data-state="idle" aria-hidden>
      <span ref={text} className="cursor__label label" />
    </div>
  );
}
