"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import type { DepartmentData } from "@/lib/departments";

export default function CategoryIndex({ items }: { items: DepartmentData[] }) {
  const root = useRef<HTMLElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const images = items.map(({ dept, posts, cover }) => {
    const latest = posts[0];
    return cover
      ? { src: cover, alt: dept.label }
      : latest?.image
        ? { src: latest.image.src, alt: latest.image.alt }
        : null;
  });

  useGSAP(
    () => {
      gsap.from(".cat__row", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });

      // cursor-following image: only where a mouse exists
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (hover: hover)", () => {
        const el = float.current;
        const list = root.current?.querySelector<HTMLElement>(".cat__list");
        if (!el || !list) return;

        const rows = gsap.utils.toArray<HTMLElement>(".cat__row", root.current);

        gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.8 });
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
        const rTo = gsap.quickTo(el, "rotation", { duration: 0.7, ease: "power3" });

        let shown = false;
        let lastX = 0;
        let settle: number | undefined;

        const move = (e: MouseEvent) => {
          if (!shown) {
            shown = true;
            lastX = e.clientX;
            gsap.set(el, { x: e.clientX, y: e.clientY });
            gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out" });
          }
          xTo(e.clientX);
          yTo(e.clientY);
          rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6));
          lastX = e.clientX;
          window.clearTimeout(settle);
          settle = window.setTimeout(() => rTo(0), 90);
        };

        const leave = () => {
          shown = false;
          window.clearTimeout(settle);
          gsap.to(el, { autoAlpha: 0, scale: 0.8, rotation: 0, duration: 0.35, ease: "power3.in" });
        };

        const enters = rows.map((row, i) => {
          const fn = () => setActive(i);
          row.addEventListener("mouseenter", fn);
          return () => row.removeEventListener("mouseenter", fn);
        });

        list.addEventListener("mousemove", move);
        list.addEventListener("mouseleave", leave);

        return () => {
          window.clearTimeout(settle);
          list.removeEventListener("mousemove", move);
          list.removeEventListener("mouseleave", leave);
          enters.forEach((off) => off());
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="cat" aria-label="Departments">
      <div className="wrap">
        <div className="cat__head label">
          <span>Departments</span>
        </div>

        <ul className="cat__list">
          {items.map(({ dept, posts }, i) => {
            const latest = posts[0];
            const img = images[i];

            return (
              <li key={dept.key} className="cat__row">
                <Link href={`/${dept.key}`} className="cat__link">
                  <span className="label cat__count">
                    {dept.topics.slice(0, 3).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </span>

                  <span className="cat__name">
                    <span className="display display--mega">{dept.label}</span>
                    <span className="cat__blurb">{dept.blurb}</span>
                  </span>

                  <span className="cat__peek">
                    {/* small thumbnail for touch screens; hidden on desktop with a mouse */}
                    <span className="cat__thumb">
                      {img && (
                        <Image src={img.src} alt={img.alt} fill sizes="160px" style={{ objectFit: "cover" }} />
                      )}
                    </span>
                    {latest && <span className="label cat__latest">Latest / {latest.title}</span>}
                  </span>

                  <span className="cat__arrow label">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* the floating card that follows the cursor (desktop only) */}
      <div ref={float} className="cat__float" aria-hidden>
        {images.map((img, i) =>
          img ? (
            <div key={i} className={`cat__float-img ${active === i ? "is-active" : ""}`}>
              <Image src={img.src} alt="" fill sizes="440px" style={{ objectFit: "cover" }} />
            </div>
          ) : null
        )}
      </div>
    </section>
  );
}
