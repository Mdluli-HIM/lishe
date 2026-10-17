"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Theme = "light" | "sepia" | "dark";

const OPTIONS: { key: Theme; label: string }[] = [
  { key: "light", label: "Light" },
  { key: "sepia", label: "Sepia" },
  { key: "dark", label: "Night" },
];

const BAR: Record<Theme, string> = { light: "#f4f1ea", sepia: "#f1e7d0", dark: "#131312" };

const subscribe = (cb: () => void) => {
  window.addEventListener("lishe-theme", cb);
  return () => window.removeEventListener("lishe-theme", cb);
};
const getSnapshot = (): Theme => (document.documentElement.dataset.theme as Theme) || "light";
const getServerSnapshot = (): Theme => "light";

export default function ThemeSwitch({ variant = "popover" }: { variant?: "popover" | "inline" }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const apply = (t: Theme) => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("lishe-theme", t);
    } catch {}
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = BAR[t];
    window.dispatchEvent(new Event("lishe-theme"));
  };

  const group = (
    <div
      className={`theme__panel ${open || variant === "inline" ? "is-open" : ""}`}
      role="radiogroup"
      aria-label="Read mode"
    >
      {OPTIONS.map((o) => (
        <button
          key={o.key}
          type="button"
          role="radio"
          aria-checked={theme === o.key}
          className="theme__opt label"
          onClick={() => apply(o.key)}
        >
          <span className="theme__sw" data-t={o.key} aria-hidden />
          {o.label}
        </button>
      ))}
    </div>
  );

  if (variant === "inline") {
    return <div className="theme theme--inline">{group}</div>;
  }

  return (
    <div ref={root} className="theme theme--popover">
      <button
        type="button"
        className="theme__btn label"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Read mode"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="theme__icon" aria-hidden />
        <span className="theme__text">Read mode</span>
      </button>
      {group}
    </div>
  );
}
