"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import ImageReveal from "@/components/ui/ImageReveal";
import { shortDate } from "@/lib/format";
import type { Post } from "@/types/post";

type Variant = "a" | "b" | "c" | "d" | "e";

/** One layout recipe per slot: image ratio, headline size, parallax speed. */
const SLOTS: { v: Variant; ratio: string; speed: number; typeOnly?: boolean }[] = [
  { v: "a", ratio: "4 / 3", speed: 0 },
  { v: "b", ratio: "3 / 4", speed: 60 },
  { v: "c", ratio: "1 / 1", speed: 0, typeOnly: true },
  { v: "d", ratio: "5 / 6", speed: 80 },
  { v: "e", ratio: "1 / 1", speed: 30 },
];

export default function FeaturedGrid({ posts }: { posts: Post[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 901px)", () => {
        gsap.utils.toArray<HTMLElement>(".fg__item[data-speed]").forEach((el) => {
          const speed = Number(el.dataset.speed);
          if (!speed) return;
          gsap.to(el, {
            y: -speed,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });

      gsap.from(".fg__text", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  const items = posts.slice(0, SLOTS.length);

  return (
    <section ref={root} className="fg" aria-label="Featured stories">
      <div className="wrap">
        <div className="fg__head label">
          <span>Featured stories</span>
        </div>

        <div className="fg__grid">
          {items.map((post, i) => {
            const slot = SLOTS[i];
            return (
              <article
                key={post.id}
                className={`fg__item fg__item--${slot.v}`}
                data-speed={slot.speed || undefined}
              >
                <Link href={`/stories/${post.slug}`} className="fg__link">

                  {slot.typeOnly ? (
                    <span className="fg__type">
                      <span className="label fg__text">
                        {post.category} / {shortDate(post.date)}
                      </span>
                      <span className="display fg__bigtitle fg__text">{post.title}</span>
                      <span className="fg__excerpt fg__text">{post.excerpt}</span>
                      <span className="label fg__text fg__more">Read the story →</span>
                    </span>
                  ) : (
                    <>
                      <ImageReveal src={post.image?.src} alt={post.image?.alt ?? post.title} ratio={slot.ratio} />
                      <span className="fg__caption">
                        <span className="label fg__text fg__meta">
                          {post.category} / {shortDate(post.date)} / {post.readingMinutes} min
                        </span>
                        <span className={`fg__title fg__text fg__title--${slot.v}`}>{post.title}</span>
                      </span>
                    </>
                  )}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
