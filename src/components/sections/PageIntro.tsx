"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { whenEntered } from "@/lib/intro";
import SplitHeadline from "@/components/ui/SplitHeadline";
import type { SideKey } from "@/lib/brand";

export interface Crumb {
  label: string;
  href?: string;
}

/** Top of every inner page: breadcrumb, a large split headline and a short lead. */
export default function PageIntro({
  crumbs,
  lines,
  lead,
  side,
  aside,
  children,
}: {
  crumbs: Crumb[];
  lines: string[];
  lead?: string;
  side?: SideKey;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const play = contextSafe!(() => {
        gsap.from(".pi__fade", { opacity: 0, y: 14, duration: 0.8, stagger: 0.08, delay: 0.5 });
      });
      return whenEntered(play);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="pi" data-side={side}>
      <div className="wrap">
        <nav className="pi__crumbs label pi__fade" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={i}>
              {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </span>
          ))}
        </nav>

        <SplitHeadline lines={lines} className="display pi__title" />

        {(lead || aside) && (
          <div className="pi__foot">
            {lead && <p className="pi__lead pi__fade">{lead}</p>}
            {aside && <div className="pi__aside pi__fade">{aside}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
