"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { shortDate } from "@/lib/format";
import type { Post } from "@/types/post";

export default function StoryStage({ posts }: { posts: Post[] }) {
  const root = useRef<HTMLElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const last = useRef(0);
  const [active, setActive] = useState(0);

  const items = posts.slice(0, 5);
  const n = items.length;

  useGSAP(
    () => {
      const el = scroll.current;
      const st = stage.current;
      if (!el || !st || n === 0) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          st.style.setProperty("--p", String(self.progress));
          const i = Math.min(n - 1, Math.floor(self.progress * n));
          if (i !== last.current) {
            last.current = i;
            setActive(i);
            if (window.matchMedia("(hover: none)").matches) navigator.vibrate?.(8);
          }
        },
      });
      return () => trigger.kill();
    },
    { scope: root, dependencies: [n] }
  );

  /** Glide to the middle of story i's slice of the pinned scroll. */
  const go = (i: number) => {
    const el = scroll.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const step = (el.offsetHeight - window.innerHeight) / n;
    const y = top + step * i + step * 0.5;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.3 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (n === 0) return null;
  const current = items[active] ?? items[0];
  const next = items[active + 1];
  const href = `/stories/${current.slug}`;

  return (
    <section ref={root} className="st" aria-label="Featured stories">
      <div className="wrap">
        <div className="st__head label">
          <span>Featured stories</span>
          <span>Scroll ↓</span>
        </div>
      </div>

      <div ref={scroll} className="st__scroll" style={{ ["--n" as string]: n }}>
        <div ref={stage} className="st__stage wrap">
          <div className="st__left">
            {/* desktop: headline list with the rust progress line */}
            <div className="st__titles">
              <span className="st__fill" aria-hidden />
              {items.map((p, i) =>
                i === active ? (
                  <Link
                    key={p.id}
                    href={`/stories/${p.slug}`}
                    className="st__t st__t--on"
                    aria-current="true"
                  >
                    <span className="st__tt">{p.title}</span>
                  </Link>
                ) : (
                  <button key={p.id} type="button" className="st__t" onClick={() => go(i)}>
                    <span className="st__tt">{p.title}</span>
                  </button>
                )
              )}
            </div>

            <div key={current.id} className="st__detail">
              <span className="label st__meta">
                {current.category} / {shortDate(current.date)} / {current.readingMinutes} min
              </span>
              <span className="st__dtitle">{current.title}</span>
              <p className="st__excerpt">{current.excerpt}</p>
              <Link href={href} className="label st__more">
                Read the story →
              </Link>

              {/* phones: a peek at what comes next */}
              <div className="st__next label">
                {next ? (
                  <>
                    <span>Next</span>
                    <span className="st__nexttitle">{next.title}</span>
                  </>
                ) : (
                  <span>Keep scrolling ↓</span>
                )}
              </div>
            </div>
          </div>

          <div className="st__right">
            <Link href={href} className="st__link" aria-label={current.title}>
              <div className="st__frame">
                {items.map((p, i) => (
                  <div
                    key={p.id}
                    className="st__img"
                    data-state={i < active ? "before" : i === active ? "on" : "after"}
                    style={{ zIndex: i + 1 }}
                  >
                    {p.image ? (
                      <Image
                        src={p.image.src}
                        alt={p.image.alt}
                        fill
                        sizes="(min-width: 900px) 50vw, 100vw"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <span className="st__ph" />
                    )}
                  </div>
                ))}
                <span className="label st__side">{current.category}</span>
              </div>
            </Link>

            {/* phones: tappable progress segments, like stories */}
            <div className="st__segs">
              {items.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className="st__seg"
                  aria-label={`Show story: ${p.title}`}
                  aria-current={i === active ? "true" : undefined}
                  style={{ ["--i" as string]: i }}
                  onClick={() => go(i)}
                >
                  <span />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
