"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { shortDate } from "@/lib/format";
import type { Post } from "@/types/post";

/** Curated features with a filter by kind (Expert interview, Indigenous foods, …). */
export default function FeatureList({ posts }: { posts: Post[] }) {
  const kinds = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const [kind, setKind] = useState("All");
  const shown = kind === "All" ? posts : posts.filter((p) => p.category === kind);
  const [lead, ...rest] = shown;

  if (!lead) return null;

  return (
    <section className="fl" aria-label="Features">
      <div className="wrap">
        <div className="fl__filters" role="radiogroup" aria-label="Filter features">
          {kinds.map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={k === kind}
              className="fl__chip label"
              onClick={() => setKind(k)}
            >
              {k}
            </button>
          ))}
        </div>

        <Link key={`lead-${lead.id}`} href={`/stories/${lead.slug}`} className="fl__lead">
          <span className="fl__lead-img">
            {lead.image && (
              <Image src={lead.image.src} alt={lead.image.alt} fill sizes="(min-width: 900px) 60vw, 100vw" style={{ objectFit: "cover" }} priority />
            )}
          </span>
          <span className="fl__lead-text">
            <span className="label fl__kind">{lead.category}</span>
            <span className="fl__lead-title">{lead.title}</span>
            <span className="fl__excerpt">{lead.excerpt}</span>
            <span className="label fl__more">Read the feature →</span>
          </span>
        </Link>

        <ul className="fl__list">
          {rest.map((p, i) => (
            <li key={`${kind}-${p.id}`} className="fl__item" style={{ ["--i" as string]: i }}>
              <Link href={`/stories/${p.slug}`} className="fl__row">
                <span className="fl__thumb">
                  {p.image && <Image src={p.image.src} alt={p.image.alt} fill sizes="240px" style={{ objectFit: "cover" }} />}
                </span>
                <span className="label fl__kind">{p.category}</span>
                <span className="fl__title">{p.title}</span>
                <span className="label fl__date">{shortDate(p.date)}</span>
                <span className="label fl__arrow">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
