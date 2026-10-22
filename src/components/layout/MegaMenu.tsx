"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { shortDate } from "@/lib/format";
import { DEPARTMENTS, JOURNAL_INTRO } from "@/lib/categories";
import { WELLNESS_INTRO } from "@/lib/brand";
import type { Offering } from "@/lib/wellness";
import type { MegaKey } from "@/lib/nav";
import type { Post } from "@/types/post";

export interface JournalSection {
  key: string;
  label: string;
  href: string;
  posts: Post[];
}

export type WellnessCard = Pick<Offering, "key" | "label" | "pillar" | "kicker" | "blurb" | "tone" | "image">;

export default function MegaMenu({
  journal,
  wellness,
  open,
  onNavigate,
}: {
  journal: JournalSection[];
  wellness: WellnessCard[];
  open: MegaKey | null;
  onNavigate: () => void;
}) {
  const [j, setJ] = useState(0);
  const [w, setW] = useState(0);
  const cur = journal[j];
  const jTab = open === "journal" ? 0 : -1;
  const wTab = open === "wellness" ? 0 : -1;

  return (
    <div className={`mega ${open ? "is-open" : ""}`} aria-hidden={!open} data-side={open ?? undefined}>
      <div className="mega__stack">
        {/* ---------- Wellness ---------- */}
        <div className={`mega__panel ${open === "wellness" ? "is-active" : ""}`} data-side="wellness">
          <div className="wrap mega__grid">
            <div className="mega__intro">
              <span className="label mega__idx">Products & movement</span>
              <p className="mega__blurb">{WELLNESS_INTRO.title}</p>
              <p className="mega__lead">{WELLNESS_INTRO.text}</p>
              <Link href="/wellness" onClick={onNavigate} tabIndex={wTab} className="label mega__all">
                Discover Wellness →
              </Link>
            </div>

            <ul className="mega__sections">
              {wellness.map((o, k) => (
                <li key={o.key}>
                  <Link
                    href={`/wellness/${o.key}`}
                    onClick={onNavigate}
                    tabIndex={wTab}
                    className={`mega__sec ${k === w ? "is-on" : ""}`}
                    onMouseEnter={() => setW(k)}
                    onFocus={() => setW(k)}
                  >
                    <span className="display">{o.label}</span>
                    <span className="label">→</span>
                  </Link>
                </li>
              ))}
            </ul>

            {open === "wellness" &&
              wellness.map((o, n) => (
                <Link
                  key={o.key}
                  href={`/wellness/${o.key}`}
                  onClick={onNavigate}
                  tabIndex={wTab}
                  className={`mega__card mega__offer ${n === w ? "is-on" : ""}`}
                  style={{ ["--i" as string]: n, ["--tone" as string]: o.tone }}
                  onMouseEnter={() => setW(n)}
                >
                  <span className="mega__img">
                    {o.image ? (
                      <Image src={o.image.src} alt={o.image.alt} fill sizes="320px" style={{ objectFit: "cover", objectPosition: o.image.position }} />
                    ) : (
                      <span className="mega__swatch display" aria-hidden>
                        {o.label}
                      </span>
                    )}
                  </span>
                  <span className="label mega__meta">
                    {DEPARTMENTS.find((d) => d.key === o.pillar)?.label} / {o.kicker}
                  </span>
                  <span className="mega__title">{o.blurb}</span>
                </Link>
              ))}
          </div>
        </div>

        {/* ---------- Journal ---------- */}
        <div className={`mega__panel ${open === "journal" ? "is-active" : ""}`} data-side="journal">
          <div className="wrap mega__grid">
            <div className="mega__intro">
              <span className="label mega__idx">Lishe Journal</span>
              <p className="mega__blurb">{JOURNAL_INTRO.title}</p>
              <p className="mega__lead">{JOURNAL_INTRO.text}</p>
              <Link href="/journal" onClick={onNavigate} tabIndex={jTab} className="label mega__all">
                Visit the Journal →
              </Link>
            </div>

            <ul className="mega__sections">
              {journal.map((s, k) => (
                <li key={s.key}>
                  <Link
                    href={s.href}
                    onClick={onNavigate}
                    tabIndex={jTab}
                    className={`mega__sec ${k === j ? "is-on" : ""}`}
                    onMouseEnter={() => setJ(k)}
                    onFocus={() => setJ(k)}
                  >
                    <span className="display">{s.label}</span>
                    <span className="label">→</span>
                  </Link>
                </li>
              ))}
            </ul>

            {open === "journal" &&
              cur?.posts.slice(0, 3).map((p, n) => (
                <Link
                  key={`${cur.key}-${p.id}`}
                  href={`/stories/${p.slug}`}
                  onClick={onNavigate}
                  tabIndex={jTab}
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
