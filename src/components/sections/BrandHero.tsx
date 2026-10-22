"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { whenEntered } from "@/lib/intro";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { MISSION, SIDES, type SideKey } from "@/lib/brand";

export interface Door {
  side: SideKey;
  image: { src: string; alt: string } | null;
  items: string[];
}

/** Homepage opener: the brand line, then two doors, one per side of Lishe. */
export default function BrandHero({ doors }: { doors: Door[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const play = contextSafe!(() => {
        gsap.from(".bh__door", {
          clipPath: "inset(100% 0 0 0)",
          duration: 1.3,
          ease: "power4.inOut",
          stagger: 0.12,
          delay: 0.35,
        });
        gsap.from(".bh__door-img", { scale: 1.2, duration: 1.8, ease: "power3.out", stagger: 0.12, delay: 0.35 });
        gsap.from(".bh__fade", { opacity: 0, y: 12, duration: 0.8, stagger: 0.08, delay: 0.8 });
      });
      return whenEntered(play);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="hero bh">
      <div className="wrap">
        <div className="hero__meta label bh__fade">
          <span>Lishe</span>
          <span>Journal & Wellness</span>
          <span>South Africa</span>
        </div>

        <SplitHeadline lines={["Nourishment,", "beyond the plate."]} className="display display--xl hero__title bh__title" />

        <div className="bh__intro">
          <p className="bh__mission bh__fade">{MISSION}</p>
          <Link href="/our-story" className="hero__cta label bh__fade">
            Our story →
          </Link>
        </div>
      </div>

      <div className="bh__doors wrap">
        {doors.map((d) => {
          const side = SIDES[d.side];
          return (
            <Link key={d.side} href={side.href} className="bh__door" data-side={d.side}>
              <span className="bh__door-media" aria-hidden>
                {d.image && (
                  <Image
                    className="bh__door-img"
                    src={d.image.src}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 900px) 60vw, 100vw"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </span>
              <span className="bh__door-top label">
                <span>{side.role}</span>
                <span className="bh__door-items">{d.items.join(" · ")}</span>
              </span>
              <span className="bh__door-foot">
                <span className="bh__door-name display">{side.name.replace("Lishe ", "")}</span>
                <span className="bh__door-line">{side.line}</span>
                <span className="label bh__door-cta">Enter {side.name} →</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
