"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { STORY_CHAPTERS } from "@/lib/brand";

/** The journey from publication to wellness brand, as a line that draws itself on scroll. */
export default function StoryLine({ full = false }: { full?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // the line runs down on phones and across on desktop
      const mm = gsap.matchMedia();
      mm.add({ wide: "(min-width: 900px)", narrow: "(max-width: 899px)" }, (ctx) => {
        const axis = ctx.conditions?.wide ? "scaleX" : "scaleY";
        gsap.fromTo(
          ".sl__fill",
          { [axis]: 0 },
          {
            [axis]: 1,
            ease: "none",
            scrollTrigger: { trigger: ".sl__track", start: "top 85%", end: "bottom 45%", scrub: true },
          }
        );
      });
      gsap.from(".sl__step", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".sl__track", start: "top 82%", once: true },
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className={`sl ${full ? "sl--full" : ""}`} aria-label="The Lishe story">
      <div className="wrap">
        {!full && (
          <div className="sl__head">
            <span className="label sl__eyebrow">Our story</span>
            <h2 className="sl__title">
              From a publication to a <em>wellness ecosystem.</em>
            </h2>
          </div>
        )}

        <ol className="sl__track">
          <span className="sl__fill" aria-hidden />
          {STORY_CHAPTERS.map((c) => (
            <li key={c.title} className="sl__step" data-side={c.side}>
              <span className="sl__dot" aria-hidden />
              <span className="label sl__n">
                {c.kicker}
              </span>
              <span className="sl__name">{c.title}</span>
              {full && <p className="sl__text">{c.text}</p>}
            </li>
          ))}
        </ol>

        {!full && (
          <Link href="/our-story" className="label sl__cta">
            Read our story →
          </Link>
        )}
      </div>
    </section>
  );
}
