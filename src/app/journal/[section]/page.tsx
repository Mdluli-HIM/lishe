import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/sections/PageIntro";
import PostGrid from "@/components/sections/PostGrid";
import { DEPARTMENTS, sectionHref } from "@/lib/categories";
import { getDepartmentPosts } from "@/lib/departments";
import { OFFERINGS, WELLNESS_PILLARS } from "@/lib/wellness";

type Props = { params: Promise<{ section: string }> };

export function generateStaticParams() {
  return DEPARTMENTS.map((d) => ({ section: d.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const d = DEPARTMENTS.find((x) => x.key === section);
  return d ? { title: `${d.label} — Journal`, description: d.blurb } : {};
}

export default async function SectionPage({ params }: Props) {
  const { section } = await params;
  const data = await getDepartmentPosts(section);
  if (!data) notFound();
  const { dept, posts } = data;
  const others = DEPARTMENTS.filter((d) => d.key !== dept.key);
  const offerings = OFFERINGS.filter((o) => o.pillar === dept.key);

  return (
    <main data-side="journal">
      <PageIntro
        side="journal"
        crumbs={[{ label: "Lishe", href: "/" }, { label: "Journal", href: "/journal" }, { label: dept.label }]}
        lines={[dept.label]}
        lead={dept.blurb}
        aside={
          <ul className="pi__topics label">
            {dept.topics.map((t) => (
              <li key={t}>
                <Link href={`/search?q=${encodeURIComponent(t)}`}>{t}</Link>
              </li>
            ))}
          </ul>
        }
      />
      <PostGrid posts={posts} lead label={`Latest in ${dept.label}`} />

      {/* the same ethos on the Wellness side */}
      <section className="xw wrap" data-side="wellness" aria-label={`${dept.label} in Lishe Wellness`}>
        <div className="xw__text">
          <span className="label xw__eyebrow">{dept.label} in Lishe Wellness</span>
          <p className="xw__line">{WELLNESS_PILLARS[dept.key]}</p>
        </div>
        <ul className="xw__list">
          {offerings.map((o) => (
            <li key={o.key}>
              <Link href={`/wellness/${o.key}`} className="xw__card" style={{ ["--tone" as string]: o.tone }}>
                <span className="xw__swatch" aria-hidden>
                  {o.image && <Image src={o.image.src} alt="" fill sizes="160px" style={{ objectFit: "cover" }} />}
                </span>
                <span className="xw__name">{o.label}</span>
                <span className="label xw__go">→</span>
              </Link>
            </li>
          ))}
          {offerings.length === 0 && (
            <li>
              <Link href={`/wellness#${dept.key}`} className="xw__card xw__card--plain">
                <span className="xw__name">Wellness / {dept.label}</span>
                <span className="label xw__go">→</span>
              </Link>
            </li>
          )}
        </ul>
      </section>

      <nav className="next-sections wrap" aria-label="Other sections">
        {others.map((d) => (
          <Link key={d.key} href={sectionHref(d.key)} className="next-sections__link">
            <span className="label">Journal</span>
            <span className="display">{d.label}</span>
          </Link>
        ))}
        <Link href="/journal/features" className="next-sections__link">
          <span className="label">Journal</span>
          <span className="display">Features</span>
        </Link>
      </nav>
    </main>
  );
}
