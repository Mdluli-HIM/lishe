"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { SIDES, type SideKey } from "@/lib/brand";

/** A chapter marker on the homepage: tells the reader which side of Lishe they are in. */
export default function SideBand({ side }: { side: SideKey }) {
  const root = useRef<HTMLElement>(null);
  const s = SIDES[side];

  useGSAP(
    () => {
      gsap.from(".sb__word > span", {
        yPercent: 110,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
      gsap.from(".sb__fade", {
        opacity: 0,
        y: 16,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
      gsap.fromTo(
        ".sb__rule",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: "power4.inOut", scrollTrigger: { trigger: root.current, start: "top 90%", once: true } }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="sb" data-side={side} aria-label={s.name}>
      <div className="wrap">
        <span className="sb__rule" aria-hidden />
        <div className="sb__grid">
          <span className="label sb__idx sb__fade">
            {s.role}
          </span>
          <h2 className="display sb__word">
            <span className="line">
              <span>{s.name}</span>
            </span>
          </h2>
          <div className="sb__side">
            <p className="sb__text sb__fade">{s.text}</p>
            <Link href={s.href} className="label sb__cta sb__fade">
              Enter {s.name} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
