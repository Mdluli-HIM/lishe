"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { longDate } from "@/lib/format";
import type { Post } from "@/types/post";

function toLines(title: string, maxLines = 4): string[] {
  const words = title.split(" ");
  const per = Math.max(1, Math.ceil(words.length / Math.min(maxLines, Math.ceil(words.length / 2))));
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += per) lines.push(words.slice(i, i + per).join(" "));
  return lines;
}

export default function Hero({
  post,
  image,
}: {
  post: Post;
  image: { src: string; alt: string };
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero__media-inner", {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.4,
        ease: "power4.inOut",
        delay: 0.3,
      });
      gsap.from(".hero__img", { scale: 1.15, duration: 1.8, ease: "power3.out", delay: 0.3 });
      gsap.from(".hero__fade", { opacity: 0, y: 12, duration: 0.8, stagger: 0.08, delay: 0.9 });

      // parallax stays inside the 10% overscan, so no gap can appear
      gsap.to(".hero__parallax", {
        yPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="hero">
      <div className="wrap">
        <div className="hero__meta label hero__fade">
          <span>Featured / {post.category.toUpperCase()}</span>
          <span>{longDate(post.date)}</span>
          <span>{post.readingMinutes} min read</span>
        </div>

        <SplitHeadline lines={toLines(post.title)} className="display display--xl hero__title" />

        <div className="hero__foot">
          <p className="hero__excerpt hero__fade">{post.excerpt}</p>
          <Link href={`/stories/${post.slug}`} className="hero__cta label hero__fade">
            Read the story →
          </Link>
        </div>
      </div>

      <div className="hero__media wrap">
        <div className="hero__media-inner">
          <div className="hero__parallax">
            <Image
              className="hero__img"
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
