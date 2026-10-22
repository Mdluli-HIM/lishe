"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { DEPARTMENTS } from "@/lib/categories";
import type { WellnessCard } from "@/components/layout/MegaMenu";

/** Wellness offerings as tall panels; the hovered one opens wider on desktop. */
export default function Offerings({ items, label = "Lishe Wellness offerings" }: { items: WellnessCard[]; label?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".of__card", {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="of" data-side="wellness" aria-label={label}>
      <div className="wrap">
        <ul className="of__row">
          {items.map((o) => (
            <li key={o.key} className="of__card" style={{ ["--tone" as string]: o.tone }}>
              <Link href={`/wellness/${o.key}`} className="of__link">
                <span className="of__media" aria-hidden>
                  {o.image ? (
                    <Image src={o.image.src} alt="" fill sizes="(min-width: 900px) 45vw, 100vw" style={{ objectFit: "cover" }} />
                  ) : (
                    <span className="of__field" />
                  )}
                </span>
                <span className="of__top label">
                  <span>{DEPARTMENTS.find((d) => d.key === o.pillar)?.label}</span>
                  <span>{o.kicker}</span>
                </span>
                <span className="of__foot">
                  <span className="display of__name">{o.label}</span>
                  <span className="of__blurb">{o.blurb}</span>
                  <span className="label of__cta">Discover {o.label} →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
