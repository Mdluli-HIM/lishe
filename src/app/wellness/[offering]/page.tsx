import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/sections/PageIntro";
import PostGrid from "@/components/sections/PostGrid";
import { sectionHref } from "@/lib/categories";
import { OFFERINGS, getOffering, pillarOf } from "@/lib/wellness";
import { searchPosts } from "@/lib/wp";

type Props = { params: Promise<{ offering: string }> };

export function generateStaticParams() {
  return OFFERINGS.map((o) => ({ offering: o.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const o = getOffering((await params).offering);
  return o ? { title: `${o.label} — Wellness`, description: o.body[0] } : {};
}

export default async function OfferingPage({ params }: Props) {
  const o = getOffering((await params).offering);
  if (!o) notFound();
  const reads = await searchPosts(o.read, 3);
  const others = OFFERINGS.filter((x) => x.key !== o.key);
  const pillar = pillarOf(o.pillar);

  return (
    <main data-side="wellness">
      <PageIntro
        side="wellness"
        crumbs={[
          { label: "Lishe", href: "/" },
          { label: "Wellness", href: "/wellness" },
          { label: pillar.label, href: `/wellness#${pillar.key}` },
          { label: o.label },
        ]}
        lines={[o.label]}
        lead={o.blurb}
        aside={<span className="label">{pillar.label} / {o.kicker}</span>}
      />

      <section className="ofp wrap" style={{ ["--tone" as string]: o.tone }}>
        <div className="ofp__media">
          {o.image ? (
            <Image src={o.image.src} alt={o.image.alt} fill priority sizes="(min-width: 900px) 55vw, 100vw" style={{ objectFit: "cover", objectPosition: o.image.position }} />
          ) : (
            <span className="ofp__field display" aria-hidden>
              {o.label}
            </span>
          )}
        </div>

        <div className="ofp__text">
          {o.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ul className="ofp__points">
            {o.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <Link href={`/contact?topic=${o.cta.topic}`} className="btn" data-magnetic>
            {o.cta.label} →
          </Link>
        </div>
      </section>

      <div data-side="journal">
        <PostGrid posts={reads} label={`From the Journal / ${o.read}`} more={{ href: sectionHref(pillar.key), label: `More in ${pillar.label} →` }} />
      </div>

      <nav className="next-sections wrap" aria-label="More from Lishe Wellness">
        {others.map((x) => (
          <Link key={x.key} href={`/wellness/${x.key}`} className="next-sections__link">
            <span className="label">Wellness / {pillarOf(x.pillar).label}</span>
            <span className="display">{x.label}</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
