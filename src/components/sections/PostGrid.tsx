import Image from "next/image";
import Link from "next/link";
import { shortDate } from "@/lib/format";
import type { Post } from "@/types/post";

/** A plain editorial grid of story cards. The first card can lead at double width. */
export default function PostGrid({
  posts,
  label,
  lead = false,
  more,
}: {
  posts: Post[];
  label?: string;
  lead?: boolean;
  more?: { href: string; label: string };
}) {
  if (!posts.length) return null;

  return (
    <section className="pg" aria-label={label ?? "Stories"}>
      <div className="wrap">
        {label && (
          <div className="pg__head label">
            <span>{label}</span>
            {more && <Link href={more.href}>{more.label}</Link>}
          </div>
        )}
        <ul className={`pg__grid ${lead ? "pg__grid--lead" : ""}`}>
          {posts.map((p) => (
            <li key={p.id} className="pg__item">
              <Link href={`/stories/${p.slug}`} className="pg__card">
                <span className="pg__img">
                  {p.image ? (
                    <Image src={p.image.src} alt={p.image.alt} fill sizes="(min-width: 900px) 33vw, 100vw" style={{ objectFit: "cover" }} />
                  ) : (
                    <span className="st__ph" />
                  )}
                </span>
                <span className="label pg__meta">
                  {p.category} / {shortDate(p.date)} / {p.readingMinutes} min
                </span>
                <span className="pg__title">{p.title}</span>
                <span className="pg__excerpt">{p.excerpt}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
