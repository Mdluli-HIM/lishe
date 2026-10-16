"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MenuOverlay from "./MenuOverlay";
import MegaMenu from "./MegaMenu";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import type { DepartmentData } from "@/lib/departments";

export default function Header({ departments }: { departments: DepartmentData[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = (key: string | null) => {
    window.clearTimeout(timer.current);
    setActive(key);
  };
  const hideSoon = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setActive(null), 160);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setActive(null);
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <>
      <div className={`mega-backdrop ${active ? "is-on" : ""}`} aria-hidden />

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
              <Image
                className="header__logo-dark"
                src="/images/brand/logo-lishe.png"
                alt="Lishe"
                width={1774}
                height={887}
                priority
              />
              <Image
                className="header__logo-light"
                src="/images/brand/logo-lishe-white.png"
                alt=""
                aria-hidden
                width={1774}
                height={887}
                priority
              />
            </Link>

            <nav className="header__nav label" aria-label="Primary">
              {departments.map(({ dept }) => (
                <Link
                  key={dept.key}
                  href={`/${dept.key}`}
                  className={active === dept.key ? "is-active" : ""}
                  aria-expanded={active === dept.key}
                  onMouseEnter={() => show(dept.key)}
                  onFocus={() => show(dept.key)}
                >
                  {dept.label}
                </Link>
              ))}
              <Link href="/search" onMouseEnter={() => show(null)} onFocus={() => show(null)}>
                Search
              </Link>
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

        {!open && <MegaMenu items={departments} active={active} onNavigate={() => show(null)} />}
      </div>

      <MenuOverlay open={open} onNavigate={() => setOpen(false)} />
    </>
  );
}
