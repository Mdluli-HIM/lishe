"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuOverlay from "./MenuOverlay";
import MegaMenu, { type JournalSection, type WellnessCard } from "./MegaMenu";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import { NAV, type MegaKey } from "@/lib/nav";
import type { MenuGroups } from "@/lib/menu";

export default function Header({
  journal,
  wellness,
  menu,
}: {
  journal: JournalSection[];
  wellness: WellnessCard[];
  menu: MenuGroups;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<MegaKey | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = (v: MegaKey | null) => {
    window.clearTimeout(timer.current);
    setMega(v);
  };
  const hideSoon = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMega(null), 160);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMega(null);
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const current = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div className={`mega-backdrop ${mega ? "is-on" : ""}`} aria-hidden />

      <div
        className="hw"
        onMouseLeave={hideSoon}
        onMouseEnter={() => window.clearTimeout(timer.current)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) hideSoon();
        }}
      >
        <header className={`header ${open ? "is-open" : ""}`}>
          <div className="header__inner wrap">
            <Link
              href="/"
              className="header__logo"
              aria-label="Lishe home"
              onClick={() => {
                setOpen(false);
                show(null);
              }}
            >
              <Image className="header__logo-dark" src="/images/brand/logo-lishe.png" alt="Lishe" width={1774} height={887} priority />
              <Image className="header__logo-light" src="/images/brand/logo-lishe-white.png" alt="" aria-hidden width={1774} height={887} priority />
            </Link>

            <nav className="header__nav label" aria-label="Primary">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  data-side={n.mega}
                  className={(n.mega && mega === n.mega) || (!mega && current(n.href)) ? "is-active" : ""}
                  aria-current={current(n.href) ? "page" : undefined}
                  aria-haspopup={n.mega ? "true" : undefined}
                  aria-expanded={n.mega ? mega === n.mega : undefined}
                  onMouseEnter={() => show(n.mega ?? null)}
                  onFocus={() => show(n.mega ?? null)}
                  onClick={() => show(null)}
                >
                  {n.label}
                  {n.mega && <span className="header__caret" aria-hidden />}
                </Link>
              ))}
            </nav>

            <div className="header__right" onMouseEnter={() => show(null)}>
              <div className="header__theme">
                <ThemeSwitch />
              </div>
              <button
                className="header__menu label"
                aria-expanded={open}
                aria-controls="menu-overlay"
                onClick={() => {
                  show(null);
                  setOpen((v) => !v);
                }}
              >
                {open ? "Close" : "Menu"}
              </button>
            </div>
          </div>
        </header>

        {!open && <MegaMenu journal={journal} wellness={wellness} open={mega} onNavigate={() => show(null)} />}
      </div>

      <MenuOverlay open={open} groups={menu} onNavigate={() => setOpen(false)} />
    </>
  );
}
