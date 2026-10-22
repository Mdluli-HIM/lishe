import Link from "next/link";
import { CONTACT, SIDES, SOCIAL, TAGLINE } from "@/lib/brand";
import { DEPARTMENTS, sectionHref } from "@/lib/categories";
import { OFFERINGS } from "@/lib/wellness";

const COLUMNS = [
  {
    side: SIDES.wellness,
    links: OFFERINGS.map((o) => ({ label: o.label, href: `/wellness/${o.key}` })),
  },
  {
    side: SIDES.journal,
    links: [
      ...DEPARTMENTS.map((d) => ({ label: d.label, href: sectionHref(d.key) })),
      { label: "Features", href: "/journal/features" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="ft">
      <div className="wrap">
        <p className="ft__tag display">{TAGLINE}</p>

        <div className="ft__grid">
          {COLUMNS.map(({ side, links }) => (
            <div key={side.key} className="ft__col" data-side={side.key}>
              <Link href={side.href} className="ft__side">
                <span className="ft__name">{side.name}</span>
                <span className="label ft__role">{side.role}</span>
              </Link>
              <ul>
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="ft__link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="ft__col">
            <Link href="/our-story" className="ft__side">
              <span className="ft__name">Lishe</span>
              <span className="label ft__role">The brand</span>
            </Link>
            <ul>
              <li><Link href="/our-story" className="ft__link">Our Story</Link></li>
              <li><Link href="/contact" className="ft__link">Contact</Link></li>
              <li><a href={`mailto:${CONTACT.email}`} className="ft__link">{CONTACT.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="ft__base label">
          <span>© {new Date().getFullYear()} Lishe</span>
          <ul className="ft__social">
            {SOCIAL.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
