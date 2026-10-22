import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";
import ContactForm from "@/components/sections/ContactForm";
import { CONTACT, SOCIAL, TOPICS } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Lishe about the Journal, our teas and jams, Pilates, stocking Lishe or collaborating.",
};

type Props = { searchParams: Promise<{ topic?: string | string[] }> };

export default async function ContactPage({ searchParams }: Props) {
  const { topic } = await searchParams;
  const initial = TOPICS.find((t) => t.key === topic)?.key ?? "general";

  return (
    <main>
      <PageIntro
        crumbs={[{ label: "Lishe", href: "/" }, { label: "Contact" }]}
        lines={["Let's talk."]}
        lead="Questions about our teas, jams or Pilates, a story for the Journal, or a collaboration. Tell us what you have in mind."
      />

      <section className="ct wrap">
        <ContactForm initial={initial} />

        <aside className="ct__details">
          <div className="ct__block">
            <span className="label ct__label">Email</span>
            <a href={`mailto:${CONTACT.email}`} className="ct__value">{CONTACT.email}</a>
          </div>
          <div className="ct__block">
            <span className="label ct__label">Phone</span>
            <a href={`tel:${CONTACT.phoneHref}`} className="ct__value">{CONTACT.phone}</a>
          </div>
          <div className="ct__block">
            <span className="label ct__label">Follow</span>
            <ul className="ct__social">
              {SOCIAL.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="ct__value">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
