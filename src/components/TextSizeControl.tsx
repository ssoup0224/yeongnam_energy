"use client";

import { useEffect, useState } from "react";
import { IconTextSize } from "./Icons";

const STEPS = [
  { key: "s", label: "작게", scale: 1, a11y: "글자 크기 작게 (기본)" },
  { key: "m", label: "보통", scale: 1.125, a11y: "글자 크기 보통 (112%)" },
  { key: "l", label: "크게", scale: 1.25, a11y: "글자 크기 크게 (125%)" },
] as const;

export default function TextSizeControl({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("yes-ui-scale-step"));
      if (saved >= 0 && saved < STEPS.length) apply(saved);
    } catch {}
  }, []);

  function apply(i: number) {
    setActive(i);
    document.documentElement.style.setProperty("--ui-scale", String(STEPS[i].scale));
    try {
      localStorage.setItem("yes-ui-scale-step", String(i));
    } catch {}
  }

  return (
    <div
      className={`flex items-center gap-1 ${compact ? "" : "rounded-full border border-ink-200 bg-white px-1 py-0.5"}`}
      role="group"
      aria-label="글자 크기 조절"
    >
      {!compact && (
        <IconTextSize className="ml-1.5 size-4 text-ink-500" />
      )}
      {STEPS.map((s, i) => (
        <button
          key={s.key}
          type="button"
          onClick={() => apply(i)}
          aria-pressed={active === i}
          aria-label={s.a11y}
          className={`min-h-8 rounded-full px-2.5 text-xs font-semibold transition
            ${active === i
              ? "bg-ink-900 text-white"
              : "text-ink-600 hover:bg-ink-100"}`}
        >
          <span aria-hidden style={{ fontSize: `${0.72 + i * 0.12}rem` }}>가</span>
        </button>
      ))}
    </div>
  );
}
