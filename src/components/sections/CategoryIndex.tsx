"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import type { DepartmentData } from "@/lib/departments";

export default function CategoryIndex({ items }: { items: DepartmentData[] }) {
  const root = useRef<HTMLElement>(null);

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
          {items.map(({ dept, posts, cover }) => {
            const latest = posts[0];
            const img = cover
              ? { src: cover, alt: dept.label }
              : latest?.image
                ? { src: latest.image.src, alt: latest.image.alt }
                : null;

            return (
              <li key={dept.key} className="cat__row">
                <Link href={`/${dept.key}`} className="cat__link">
                  <span className="label cat__count">{dept.topics.slice(0, 3).map((t) => (<span key={t}>{t}</span>))}</span>

                  <span className="cat__name">
                    <span className="display display--mega">{dept.label}</span>
                    <span className="cat__blurb">{dept.blurb}</span>
                  </span>

                  <span className="cat__peek">
                    <span className="cat__thumb">
                      {img && (
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes="320px"
                          style={{ objectFit: "cover" }}
                        />
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
    </section>
  );
}
