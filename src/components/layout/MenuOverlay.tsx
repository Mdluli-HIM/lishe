import Link from "next/link";
import ThemeSwitch from "@/components/ui/ThemeSwitch";

const LINKS = [
  { href: "/fitness", label: "Fitness" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/lifestyle", label: "Lifestyle" },
  { href: "/experts", label: "Voices" },
];

const SECONDARY = ["Instagram", "YouTube", "Facebook", "Advertise", "Collaborate", "Contact"];

export default function MenuOverlay({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  return (
    <div
      id="menu-overlay"
      className={`menu ${open ? "is-open" : ""}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div className="menu__inner wrap">
        <ul className="menu__links">
          {LINKS.map((l, i) => (
            <li key={l.href} style={{ transitionDelay: open ? `${0.25 + i * 0.07}s` : "0s" }}>
              <Link href={l.href} onClick={onNavigate}>
                <span className="display display--xl">{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="menu__theme">
          <span className="label">Read mode</span>
          <ThemeSwitch variant="inline" />
        </div>

        <ul className="menu__meta label">
          {SECONDARY.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
