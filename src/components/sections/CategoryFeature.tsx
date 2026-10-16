"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import ImageReveal from "@/components/ui/ImageReveal";
import { shortDate } from "@/lib/format";
import type { Post } from "@/types/post";

export interface CategoryFeatureProps {
  index?: string;          // "01"
  deptKey: string;        // "fitness"
  label: string;          // "Fitness"
  headline: string[];     // ["Move", "better.", "Live", "stronger."]
  featured: Post;
  latest: Post[];
  topics: string[];
  reverse?: boolean;      // flips image/text sides
}

export default function CategoryFeature({
  deptKey,
  label,
  headline,
  featured,
  latest,
  topics,
  reverse = false,
}: CategoryFeatureProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = { trigger: root.current, start: "top 70%" };

      gsap.from(".cf__line > span", {
        yPercent: 110,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.09,
        scrollTrigger: trigger,
      });

      gsap.from(".cf__fade", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ".cf__side", start: "top 80%" },
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px)", () => {
        gsap.to(".cf__media", {
          y: -70,
          ease: "none",
          scrollTrigger: { trigger: ".cf__media", start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className={`cf ${reverse ? "cf--reverse" : ""}`} aria-labelledby={`cf-${deptKey}`}>
      <div className="wrap">
        <div className="cf__head label">
          <span>{label}</span>
          <Link href={`/${deptKey}`} className="cf__all">
            All {label.toLowerCase()} stories →
          </Link>
        </div>

        <h2 id={`cf-${deptKey}`} className="display cf__headline">
          {headline.map((l, i) => (
            <span className="line cf__line" key={i}>
              <span>{l}</span>
            </span>
          ))}
        </h2>

        <div className="cf__body">
          <Link href={`/stories/${featured.slug}`} className="cf__feature">
            <div className="cf__media">
              <ImageReveal
                src={featured.image?.src}
                alt={featured.image?.alt ?? featured.title}
                ratio="4 / 5"
                sizes="(max-width: 900px) 100vw, 55vw"
              />
            </div>
          </Link>

          <div className="cf__side">
            <Link href={`/stories/${featured.slug}`} className="cf__lead">
              <span className="label cf__fade cf__meta">
                Featured / {shortDate(featured.date)} / {featured.readingMinutes} min
              </span>
              <span className="cf__title cf__fade">{featured.title}</span>
              <span className="cf__excerpt cf__fade">{featured.excerpt}</span>
              <span className="label cf__fade cf__more">Read the story →</span>
            </Link>

            {latest.length > 0 && (
              <div className="cf__block cf__fade">
                <span className="label cf__sub">Latest</span>
                <ul className="cf__list">
                  {latest.map((p) => (
                    <li key={p.id}>
                      <Link href={`/stories/${p.slug}`} className="cf__row">
                        <span className="label cf__date">{shortDate(p.date)}</span>
                        <span className="cf__rowtitle">{p.title}</span>
                        <span className="label cf__arrow">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="cf__block cf__fade">
              <span className="label cf__sub">Topics</span>
              <ul className="cf__list">
                {topics.map((t) => (
                  <li key={t}>
                    <Link href={`/search?q=${encodeURIComponent(t)}`} className="cf__row cf__row--topic">
                      <span className="cf__rowtitle">{t}</span>
                      <span className="label cf__arrow">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
