"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Each line of `lines` slides up from a mask on mount. */
export default function SplitHeadline({
  lines,
  className = "display display--xl",
  as: Tag = "h1",
  delay = 0.1,
}: {
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      gsap.from(".line > span", {
        yPercent: 110,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
        delay,
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span className="line" key={i}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
