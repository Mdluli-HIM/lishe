"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

const WORDS = ["Nourish", "Move", "Live"];
const ECG =
  "M0 30 H190 l10 -6 l10 6 H255 l9 -26 l13 52 l11 -26 H345 l12 -9 l12 9 H600";

/** Seconds: the line draws, wipes away, rests, then repeats until the visitor enters. */
const DRAW = 2.2;
const ERASE = 1.3;
const REST = 0.4;

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const entered = useRef(false);

  const { context } = useGSAP(
    () => {
      if (document.documentElement.dataset.intro !== "on") return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const p = path.current!;
      const d = dot.current!;
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      let cancelled = false;

      const pageLoaded = new Promise<void>((resolve) => {
        const done = () => (document.fonts?.ready ?? Promise.resolve()).then(() => resolve());
        if (document.readyState === "complete") done();
        else window.addEventListener("load", done, { once: true });
      });
      const loaded = Promise.race([
        pageLoaded,
        new Promise<void>((r) => setTimeout(r, 6000)),
      ]);

      const showEnter = () => {
        if (cancelled) return;
        gsap.to(".loader__word", { opacity: 0, duration: 0.2 });
        gsap.to(btn.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          delay: 0.15,
          ease: "power3.out",
          onStart: () => btn.current?.focus({ preventScroll: true }),
        });
      };

      if (reduce) {
        gsap.set(".loader__art", { clipPath: "circle(75% at 50% 50%)" });
        p.style.strokeDashoffset = "0";
        loaded.then(showEnter);
        return () => {
          cancelled = true;
        };
      }

      gsap.to(".loader__art", {
        clipPath: "circle(75% at 50% 50%)",
        duration: 1.5,
        delay: 0.15,
        ease: "power3.out",
      });
      gsap.from(".loader__logo, .loader__foot", { opacity: 0, duration: 0.9, delay: 0.4 });

      // heartbeat: lub-dub, pause, repeat
      gsap
        .timeline({ repeat: -1, repeatDelay: 0.55, delay: 1.3 })
        .to(".loader__beat", { scale: 1.045, duration: 0.13, ease: "power2.out" })
        .to(".loader__beat", { scale: 1, duration: 0.16, ease: "power2.in" })
        .to(".loader__beat", { scale: 1.03, duration: 0.12, ease: "power2.out" })
        .to(".loader__beat", { scale: 1, duration: 0.3, ease: "power2.inOut" });

      // words cycle while loading
      const words = gsap.timeline({ repeat: -1, delay: 0.6 });
      gsap.utils.toArray<HTMLElement>(".loader__word").forEach((w) => {
        words
          .fromTo(w, { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 0.45, ease: "power3.out" })
          .to(w, { opacity: 0, yPercent: -40, duration: 0.35, ease: "power2.in" }, "+=0.55");
      });

      // the pulse line loops for as long as the loader is on screen
      const easeDraw = gsap.parseEase("power1.inOut");
      const easeErase = gsap.parseEase("power1.in");
      const total = DRAW + ERASE + REST;
      let firstDraw: () => void = () => {};
      const minTime = new Promise<void>((resolve) => (firstDraw = resolve));

      const state = { t: 0 };
      gsap.to(state, {
        t: 1,
        duration: total,
        ease: "none",
        repeat: -1,
        delay: 0.4,
        onUpdate: () => {
          const time = state.t * total;

          if (time < DRAW) {
            const k = easeDraw(time / DRAW);
            p.style.strokeDashoffset = String(len * (1 - k));
            const pt = p.getPointAtLength(k * len);
            d.setAttribute("cx", String(pt.x));
            d.setAttribute("cy", String(pt.y));
            d.style.opacity = "1";
          } else if (time < DRAW + ERASE) {
            firstDraw();
            const k = easeErase((time - DRAW) / ERASE);
            p.style.strokeDashoffset = String(-len * k);
            d.style.opacity = "0";
          } else {
            p.style.strokeDashoffset = String(-len);
            d.style.opacity = "0";
          }
        },
      });

      Promise.all([minTime, loaded]).then(() => {
        words.kill();
        showEnter();
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: root }
  );

  const enter = () => {
    if (entered.current) return;
    entered.current = true;
    const html = document.documentElement;
    html.dataset.intro = "exiting";
    try {
      sessionStorage.setItem("lishe-entered", "1");
    } catch {}
    window.dispatchEvent(new Event("lishe-enter"));

    gsap
      .timeline({
        onComplete: () => {
          html.dataset.intro = "done";
          context.kill(); // stop the pulse line, heartbeat and word loops
        },
      })
      .to(content.current, { scale: 1.05, opacity: 0, duration: 0.7, ease: "power2.in" }, 0)
      .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "power4.inOut" }, 0.2);
  };

  return (
    <div ref={root} className="loader" role="dialog" aria-label="Welcome to Lishe">
      <div ref={content} className="loader__content">
        <div className="loader__logo">
          <Image className="loader__logo-dark" src="/images/brand/logo-lishe.png" alt="Lishe" width={1774} height={887} priority />
          <Image className="loader__logo-light" src="/images/brand/logo-lishe-white.png" alt="" aria-hidden width={1774} height={887} priority />
        </div>

        <div className="loader__beat">
          <div className="loader__art">
            <Image src="/images/brand/loader-heart.png" alt="" aria-hidden width={1200} height={1200} priority />
          </div>
        </div>

        <svg className="loader__ecg" viewBox="0 0 600 60" aria-hidden>
          <path d={ECG} className="loader__ecg-track" />
          <path ref={path} d={ECG} className="loader__ecg-line" />
          <circle ref={dot} className="loader__ecg-dot" r="3.5" cx="0" cy="30" />
        </svg>

        <div className="loader__status">
          {WORDS.map((w) => (
            <span key={w} className="loader__word" aria-hidden>
              {w}
            </span>
          ))}
          <button ref={btn} type="button" className="loader__enter label" onClick={enter}>
            Enter <span aria-hidden>→</span>
          </button>
        </div>

        <p className="loader__foot label">Nutrition · Fitness · Lifestyle</p>
      </div>
    </div>
  );
}
