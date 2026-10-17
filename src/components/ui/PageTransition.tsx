"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { scrollTop } from "@/lib/lenis";

const DEPARTMENTS = ["nutrition", "fitness", "lifestyle"];

function labelFor(path: string) {
  const seg = path.split("/").filter(Boolean)[0] ?? "";
  if (!seg) return "Lishe";
  if (DEPARTMENTS.includes(seg)) return seg[0].toUpperCase() + seg.slice(1);
  if (seg === "stories") return "Reading";
  if (seg === "experts") return "Voices";
  if (seg === "search") return "Search";
  return "Lishe";
}

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const covered = useRef(false);
  const failsafe = useRef<number | undefined>(undefined);
  const prefetched = useRef(new Set<string>());

  /** The new page has mounted: lift the panel. */
  const reveal = useCallback(() => {
    const el = panel.current;
    const text = label.current;
    if (!el || !text || !busy.current || !covered.current) return;
    window.clearTimeout(failsafe.current);
    const html = document.documentElement;

    gsap
      .timeline({
        onComplete: () => {
          gsap.set(el, { autoAlpha: 0, clipPath: "inset(100% 0 0 0)" });
          delete html.dataset.transition;
          busy.current = false;
          covered.current = false;
        },
      })
      .add(() => {
        html.dataset.transition = "revealing";
        window.dispatchEvent(new Event("lishe-reveal"));
      }, 0.25)
      .to(text, { yPercent: -110, duration: 0.5, ease: "power3.in" }, 0)
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.95, ease: "power4.inOut" }, 0.15);
  }, []);

  /** Wipe the panel over the old page, then navigate underneath it. */
  const cover = useCallback(
    (url: URL) => {
      const el = panel.current;
      const text = label.current;
      const html = document.documentElement;
      const href = url.pathname + url.search + url.hash;

      if (!el || !text) {
        router.push(href);
        return;
      }

      busy.current = true;
      covered.current = false;
      html.dataset.transition = "covering";
      text.textContent = labelFor(url.pathname);
      gsap.set(text, { yPercent: 110 });
      gsap.set(el, { autoAlpha: 1, clipPath: "inset(100% 0 0 0)" });

      gsap
        .timeline({
          onComplete: () => {
            covered.current = true;
            html.dataset.transition = "covered";
            scrollTop();
            router.push(href);
            failsafe.current = window.setTimeout(reveal, 6000);
          },
        })
        .to(el, { clipPath: "inset(0 0 0 0)", duration: 0.85, ease: "power4.inOut" }, 0)
        .to(text, { yPercent: 0, duration: 0.8, ease: "power4.out" }, 0.4);
    },
    [router, reveal]
  );

  // new route committed -> lift the panel
  useEffect(() => {
    if (busy.current) reveal();
  }, [pathname, reveal]);

  // intercept internal link clicks (capture phase, so it runs before Next's own handler)
  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const internal = (a: HTMLAnchorElement) => {
      if (a.target && a.target !== "_self") return null;
      if (a.hasAttribute("download")) return null;
      const url = new URL(a.href, window.location.href);
      return url.origin === window.location.origin ? url : null;
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const url = internal(a);
      if (!url || url.pathname === window.location.pathname) return;
      if (html.dataset.intro === "on" || reduce.matches) return;
      e.preventDefault();
      if (!busy.current) cover(url);
    };

    // warm the next page while the visitor is still hovering
    const onOver = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const url = internal(a);
      if (!url || url.pathname === window.location.pathname) return;
      const key = url.pathname + url.search;
      if (prefetched.current.has(key)) return;
      prefetched.current.add(key);
      router.prefetch(key);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mouseover", onOver);
    };
  }, [cover, router]);

  return (
    <div ref={panel} className="pt" aria-hidden>
      <span className="pt__mask">
        <span ref={label} className="pt__label" />
      </span>
    </div>
  );
}
