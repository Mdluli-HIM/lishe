"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { shortDate } from "@/lib/format";
import { EXPLORE_INTRO } from "@/lib/categories";
import type { DepartmentData } from "@/lib/departments";

export default function MegaMenu({
  items,
  open,
  onNavigate,
}: {
  items: DepartmentData[];
  open: boolean;
  onNavigate: () => void;
}) {
  const [i, setI] = useState(0);
  const cur = items[i];
  const tab = open ? 0 : -1;

  return (
    <div className={`mega ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="mega__stack">
        <div className="mega__panel is-active">
          <div className="wrap mega__grid">
            <div className="mega__intro">
              <span className="label mega__idx">Explore</span>
              <p className="mega__blurb">{EXPLORE_INTRO.title}</p>
              <p className="mega__lead">{EXPLORE_INTRO.text}</p>
              <Link href="/explore" onClick={onNavigate} tabIndex={tab} className="label mega__all">
                Explore all →
              </Link>
            </div>

            <ul className="mega__sections">
              {items.map(({ dept }, k) => (
                <li key={dept.key}>
                  <Link
                    href={`/explore/${dept.key}`}
                    onClick={onNavigate}
                    tabIndex={tab}
                    className={`mega__sec ${k === i ? "is-on" : ""}`}
                    onMouseEnter={() => setI(k)}
                    onFocus={() => setI(k)}
                  >
                    <span className="display">{dept.label}</span>
                    <span className="label">→</span>
                  </Link>
                </li>
              ))}
            </ul>

            {cur?.posts.slice(0, 3).map((p, n) => (
              <Link
                key={`${cur.dept.key}-${p.id}`}
                href={`/stories/${p.slug}`}
                onClick={onNavigate}
                tabIndex={tab}
                className="mega__card"
                style={{ ["--i" as string]: n }}
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
          </div>
        </div>
      </div>
    </div>
  );
}
