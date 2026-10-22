import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/sections/PageIntro";
import Offerings from "@/components/sections/Offerings";
import PostGrid from "@/components/sections/PostGrid";
import { MISSION, SIDES } from "@/lib/brand";
import { DEPARTMENTS, sectionHref } from "@/lib/categories";
import { getDepartmentPosts } from "@/lib/departments";
import { OFFERINGS, WELLNESS_PILLARS } from "@/lib/wellness";

export const metadata: Metadata = {
  title: "Lishe Wellness",
  description: SIDES.wellness.text,
};

export default async function WellnessPage() {
  const live = await getDepartmentPosts("live", 3);

  return (
    <main data-side="wellness">
      <PageIntro
        side="wellness"
        crumbs={[{ label: "Lishe", href: "/" }, { label: "Wellness" }]}
        lines={["Lishe", "Wellness"]}
        lead={SIDES.wellness.text}
        aside={
          <ul className="pi__topics label">
            {DEPARTMENTS.map((d) => (
              <li key={d.key}>
                <a href={`#${d.key}`}>{d.label}</a>
              </li>
            ))}
          </ul>
        }
      />

      {/* the same Nourish, Move, Live ethos as the Journal */}
      {DEPARTMENTS.map((d) => {
        const items = OFFERINGS.filter((o) => o.pillar === d.key);
        return (
          <section key={d.key} id={d.key} className="pl" aria-labelledby={`pl-${d.key}`}>
            <div className="wrap pl__head">
              <span className="label pl__eyebrow">Wellness / {d.label}</span>
              <h2 id={`pl-${d.key}`} className="display pl__title">{d.label}</h2>
              <div className="pl__side">
                <p className="pl__line">{d.blurb}</p>
                <p className="pl__text">{WELLNESS_PILLARS[d.key]}</p>
                <Link href={sectionHref(d.key)} className="label pl__link" data-side="journal">
                  Read {d.label} in the Journal →
                </Link>
              </div>
            </div>

            {items.length > 0 ? (
              <Offerings items={items} label={`${d.label} offerings`} />
            ) : (
              <div data-side="journal">
                <PostGrid posts={live?.posts ?? []} label={`From the Journal / ${d.label}`} more={{ href: sectionHref(d.key), label: `All ${d.label} stories →` }} />
              </div>
            )}
          </section>
        );
      })}

      <section className="quote wrap" data-side="wellness">
        <span className="label quote__label">Our philosophy</span>
        <blockquote className="quote__text">{MISSION}</blockquote>
        <div className="quote__links label">
          <Link href="/our-story">How the journal became Wellness →</Link>
          <Link href="/contact?topic=stockist">Stock Lishe →</Link>
        </div>
      </section>
    </main>
  );
}
