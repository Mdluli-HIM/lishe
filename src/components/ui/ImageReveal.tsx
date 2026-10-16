"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

export default function ImageReveal({
  src,
  alt,
  ratio = "4 / 5",
  sizes = "(max-width: 900px) 100vw, 50vw",
  priority = false,
}: {
  src?: string | null;
  alt: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scrollTrigger = { trigger: root.current, start: "top 88%" };
      gsap.from(".reveal__mask", {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.2,
        ease: "power4.inOut",
        scrollTrigger,
      });
      gsap.from(".reveal__img", {
        yPercent: 8,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger,
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="reveal" style={{ aspectRatio: ratio }}>
      <div className="reveal__mask">
        {src ? (
          <Image
            className="reveal__img"
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="reveal__img reveal__empty" />
        )}
      </div>
    </div>
  );
}
