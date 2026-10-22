"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import { gsap, useGSAP } from "@/lib/gsap";
import { NAV } from "@/lib/nav";
import { SIDES, SOCIAL } from "@/lib/brand";
import type { MenuGroups } from "@/lib/menu";

const PAGES = NAV.filter((n) => !n.mega);
const GROUPS = ["wellness", "journal"] as const;

export default function MenuOverlay({
  open,
  onNavigate,
  groups,
}: {
  open: boolean;
  onNavigate: () => void;
  groups: MenuGroups;
}) {
  const items = GROUPS.flatMap((g) => groups[g]);
  const root = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const shown = useRef(false);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (hover: hover)", () => {
        const el = float.current;
        const list = root.current?.querySelector<HTMLElement>(".menu__sides");
        if (!el || !list) return;

        gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.8 });
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
        const rTo = gsap.quickTo(el, "rotation", { duration: 0.7, ease: "power3" });

        let lastX = 0;
        let settle: number | undefined;

        const move = (e: MouseEvent) => {
          if (!shown.current) {
            shown.current = true;
            lastX = e.clientX;
            gsap.set(el, { x: e.clientX, y: e.clientY });
            gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out" });
          }
          xTo(e.clientX);
          yTo(e.clientY);
          rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6));
          lastX = e.clientX;
          window.clearTimeout(settle);
          settle = window.setTimeout(() => rTo(0), 90);
        };

        const leave = () => {
          shown.current = false;
          window.clearTimeout(settle);
          gsap.to(el, { autoAlpha: 0, scale: 0.8, rotation: 0, duration: 0.35, ease: "power3.in" });
        };

        list.addEventListener("mousemove", move);
        list.addEventListener("mouseleave", leave);

        return () => {
          window.clearTimeout(settle);
          list.removeEventListener("mousemove", move);
          list.removeEventListener("mouseleave", leave);
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  useEffect(() => {
    if (open) return;
    shown.current = false;
    if (float.current) gsap.set(float.current, { autoAlpha: 0, scale: 0.8, rotation: 0 });
  }, [open]);

  return (
    <div
      ref={root}
      id="menu-overlay"
      className={`menu ${open ? "is-open" : ""}`}
      aria-hidden={!open}
      inert={!open}
      data-lenis-prevent
    >
      <div className="menu__inner wrap">
        <div className="menu__sides">
          {GROUPS.map((g, gi) => {
            const offset = gi === 0 ? 0 : groups[GROUPS[0]].length;
            return (
              <div key={g} className="menu__group" data-side={g}>
                <Link href={SIDES[g].href} onClick={onNavigate} className="label menu__eyebrow">
                  {SIDES[g].name} <span>/ {SIDES[g].role}</span>
                </Link>
                <ul className="menu__links">
                  {groups[g].map((l, i) => {
                    const k = offset + i;
                    return (
                      <li
                        key={l.href}
                        style={{ transitionDelay: open ? `${0.25 + k * 0.06}s` : "0s" }}
                        onMouseEnter={() => setActive(k)}
                      >
                        <Link href={l.href} onClick={onNavigate} onFocus={() => setActive(k)}>
                          <span className="display display--xl">{l.label}</span>
                          <span className="menu__thumb" aria-hidden style={l.tone ? { background: l.tone } : undefined}>
                            {l.image && (
                              <Image src={l.image.src} alt="" fill sizes="160px" style={{ objectFit: "cover", objectPosition: l.image.position }} />
                            )}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <ul className="menu__pages">
          {PAGES.map((p) => (
            <li key={p.href}>
              <Link href={p.href} onClick={onNavigate} className="menu__page">
                {p.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="menu__theme">
          <span className="label">Read mode</span>
          <ThemeSwitch variant="inline" />
        </div>

        <ul className="menu__meta label">
          {SOCIAL.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div ref={float} className="menu__float" aria-hidden>
        {items.map((l, i) =>
          l.image ? (
            <div key={l.href} className={`menu__float-img ${active === i ? "is-active" : ""}`}>
              <Image src={l.image.src} alt="" fill sizes="440px" style={{ objectFit: "cover", objectPosition: l.image.position }} />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
