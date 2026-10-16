import Image from "next/image";
import Link from "next/link";
import { shortDate } from "@/lib/format";
import type { DepartmentData } from "@/lib/departments";

export default function MegaMenu({
  items,
  active,
  onNavigate,
}: {
  items: DepartmentData[];
  active: string | null;
  onNavigate: () => void;
}) {
  return (
    <div className={`mega ${active ? "is-open" : ""}`} aria-hidden={!active}>
      <div className="mega__stack">
        {items.map(({ dept, posts }) => {
          const on = active === dept.key;
          const tab = on ? 0 : -1;
          return (
            <div key={dept.key} className={`mega__panel ${on ? "is-active" : ""}`}>
              <div className="wrap mega__grid">
                <div className="mega__intro">
                  <span className="label mega__idx">{dept.label}</span>
                  <p className="mega__blurb">{dept.blurb}</p>
                  <Link href={`/${dept.key}`} onClick={onNavigate} tabIndex={tab} className="label mega__all">
                    {"All " + dept.label.toLowerCase() + " stories →"}
                  </Link>
                </div>

                {posts.slice(0, 3).map((p, i) => (
                  <Link
                    key={p.id}
                    href={`/stories/${p.slug}`}
                    onClick={onNavigate}
                    tabIndex={tab}
                    className="mega__card"
                    style={{ ["--i" as string]: i }}
                  >
                    <span className="mega__img">
                      {p.image && (
                        <Image src={p.image.src} alt={p.image.alt} fill sizes="320px" style={{ objectFit: "cover" }} />
                      )}
                    </span>
                    <span className="label mega__meta">
                      {p.category} / {shortDate(p.date)}
                    </span>
                    <span className="mega__title">{p.title}</span>
                  </Link>
                ))}

                <div className="mega__topics">
                  <span className="label mega__sub">Topics</span>
                  <ul>
                    {dept.topics.map((t) => (
                      <li key={t}>
                        <Link
                          href={`/search?q=${encodeURIComponent(t)}`}
                          onClick={onNavigate}
                          tabIndex={tab}
                          className="mega__topic"
                        >
                          <span>{t}</span>
                          <span className="label">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
