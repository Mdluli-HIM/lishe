"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import { gsap, useGSAP } from "@/lib/gsap";
import type { MenuItem } from "@/lib/menu";

const SECONDARY = ["Instagram", "YouTube", "Facebook", "Advertise", "Collaborate", "Contact"];

export default function MenuOverlay({
  open,
  onNavigate,
  items,
}: {
  open: boolean;
  onNavigate: () => void;
  items: MenuItem[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const shown = useRef(false);
  const [active, setActive] = useState(0);

  // cursor-following photo: desktop with a mouse only
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (hover: hover)", () => {
        const el = float.current;
        const list = root.current?.querySelector<HTMLElement>(".menu__links");
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

  // closing the menu always hides the floating photo
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
        <ul className="menu__links">
          {items.map((l, i) => (
            <li
              key={l.href}
              style={{ transitionDelay: open ? `${0.25 + i * 0.07}s` : "0s" }}
              onMouseEnter={() => setActive(i)}
            >
              <Link href={l.href} onClick={onNavigate} onFocus={() => setActive(i)}>
                <span className="display display--xl">{l.label}</span>
                <span className="menu__thumb" aria-hidden>
                  {l.image && (
                    <Image src={l.image.src} alt="" fill sizes="160px" style={{ objectFit: "cover" }} />
                  )}
                </span>
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

      {/* floating photo that follows the cursor (desktop only) */}
      <div ref={float} className="menu__float" aria-hidden>
        {items.map((l, i) =>
          l.image ? (
            <div key={l.href} className={`menu__float-img ${active === i ? "is-active" : ""}`}>
              <Image src={l.image.src} alt="" fill sizes="440px" style={{ objectFit: "cover" }} />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
