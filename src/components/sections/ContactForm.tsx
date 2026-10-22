"use client";

import { useState } from "react";
import { CONTACT, TOPICS } from "@/lib/brand";

/**
 * Enquiry form. There is no mail backend yet, so sending opens the visitor's email app
 * with the topic as the subject. Swap `send` for a server action once one exists.
 */
export default function ContactForm({ initial }: { initial: string }) {
  const [topic, setTopic] = useState(initial);
  const current = TOPICS.find((t) => t.key === topic) ?? TOPICS[0];

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();
    const subject = `Lishe enquiry: ${current.label}${name ? ` (${name})` : ""}`;
    const body = `${message}\n\n${name}`.trim();
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="ct__form" onSubmit={send} data-side={current.side ?? undefined}>
      <fieldset className="ct__topics">
        <legend className="label ct__label">What is it about?</legend>
        <div className="fl__filters">
          {TOPICS.map((t) => (
            <label key={t.key} className="fl__chip label" data-side={t.side ?? undefined}>
              <input
                type="radio"
                name="topic"
                value={t.key}
                checked={t.key === topic}
                onChange={() => setTopic(t.key)}
                className="sr-only"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="ct__field">
        <span className="label ct__label">Your name</span>
        <input name="name" autoComplete="name" required />
      </label>

      <label className="ct__field">
        <span className="label ct__label">Message</span>
        <textarea name="message" rows={6} required />
      </label>

      <div className="ct__send">
        <button type="submit" className="btn" data-magnetic>
          Send enquiry →
        </button>
        <span className="label ct__hint">Opens your email app, addressed to {CONTACT.email}</span>
      </div>
    </form>
  );
}
