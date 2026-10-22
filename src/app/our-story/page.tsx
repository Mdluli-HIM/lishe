import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/sections/PageIntro";
import StoryLine from "@/components/sections/StoryLine";
import { MISSION, SIDES } from "@/lib/brand";
import { HERO_IMAGE } from "@/lib/site";
import { firstExisting } from "@/lib/local-images";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How Lishe grew from a wellness publication into Lishe Wellness: teas, jams, Pilates and a broader vision of nourishment.",
};

const journalImage = firstExisting(["images/departments/lifestyle.jpg"]);

export default function OurStoryPage() {
  return (
    <main>
      <PageIntro
        crumbs={[{ label: "Lishe", href: "/" }, { label: "Our Story" }]}
        lines={["From the page", "to the plate,", "to the body."]}
        lead="Lishe began as a publication. It grew into a wellness brand. This is how one became the other, and where both are going."
      />

      <section className="os wrap">
        <div className="os__col">
          <span className="label os__label">Lishe means nutrition</span>
          <p className="os__big">
            In Swahili, <em>lishe</em> means nutrition. We started with a simple question: what does a healthy,
            balanced life look like in practice, for people like us?
          </p>
        </div>
        <div className="os__col os__copy">
          <p>
            The Lishe Journal set out to answer it through practical information, expert knowledge, interviews and
            real-world experience: nutrition and indigenous foods, fitness, restaurant visits and thought leadership on
            holistic living.
          </p>
          <p>
            Over time, the conversations on the page became things we wanted to make. Our jams came first. Wellness teas
            followed, and our fifth tea was developed recently. Then came Pilates and movement, because nourishment is
            also how we move.
          </p>
          <p>That became Lishe Wellness. Today the journal and the wellness brand grow side by side, and each keeps feeding the other.</p>
        </div>
      </section>

      <StoryLine full />

      <section className="os-sides wrap" aria-label="Lishe Wellness and Lishe Journal">
        {([
          ["wellness", HERO_IMAGE.src],
          ["journal", journalImage],
        ] as const).map(([key, img]) => {
          const s = SIDES[key];
          return (
            <Link key={key} href={s.href} className="os-sides__card" data-side={key}>
              <span className="os-sides__img">
                {img && <Image src={img} alt="" fill sizes="(min-width: 900px) 50vw, 100vw" style={{ objectFit: "cover" }} />}
              </span>
              <span className="label os-sides__role">{s.role}</span>
              <span className="display os-sides__name">{s.name}</span>
              <span className="os-sides__text">{s.text}</span>
              <span className="label os-sides__cta">Enter {s.name} →</span>
            </Link>
          );
        })}
      </section>

      <section className="quote wrap">
        <span className="label quote__label">The bigger vision</span>
        <p className="quote__lead">{MISSION}</p>
        <p className="quote__text">One journal. One wellness brand. One Lishe.</p>
        <div className="quote__links label">
          <Link href="/contact">Work with us →</Link>
        </div>
      </section>
    </main>
  );
}
