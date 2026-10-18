"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MenuOverlay from "./MenuOverlay";
import MegaMenu from "./MegaMenu";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import { NAV } from "@/lib/nav";
import type { DepartmentData } from "@/lib/departments";
import type { MenuItem } from "@/lib/menu";

export default function Header({
  departments,
  menuItems,
}: {
  departments: DepartmentData[];
  menuItems: MenuItem[];
}) {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const show = (v: boolean) => {
    window.clearTimeout(timer.current);
    setMega(v);
  };
  const hideSoon = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMega(false), 160);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMega(false);
      }
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

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
                show(false);
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
                  className={n.mega && mega ? "is-active" : ""}
                  aria-haspopup={n.mega ? "true" : undefined}
                  aria-expanded={n.mega ? mega : undefined}
                  onMouseEnter={() => show(!!n.mega)}
                  onFocus={() => show(!!n.mega)}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="header__right" onMouseEnter={() => show(false)}>
              <div className="header__theme">
                <ThemeSwitch />
              </div>
              <button
                className="header__menu label"
                aria-expanded={open}
                aria-controls="menu-overlay"
                onClick={() => {
                  show(false);
                  setOpen((v) => !v);
                }}
              >
                {open ? "Close" : "Menu"}
              </button>
            </div>
          </div>
        </header>

        {!open && <MegaMenu items={departments} open={mega} onNavigate={() => show(false)} />}
      </div>

      <MenuOverlay open={open} items={menuItems} onNavigate={() => setOpen(false)} />
    </>
  );
}
