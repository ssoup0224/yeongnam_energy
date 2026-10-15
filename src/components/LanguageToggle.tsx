"use client";

import { useLang, type Lang } from "@/lib/i18n";

const OPTIONS: { value: Lang; label: string; a11y: string }[] = [
  { value: "ko", label: "한국어", a11y: "한국어로 보기 / View in Korean" },
  { value: "en", label: "ENG", a11y: "영어로 보기 / View in English" },
];

/** KO / EN segmented switch. `compact` matches the header utility bar height. */
export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();

  return (
    <div
      role="group"
      aria-label="언어 선택 / Language"
      className={`flex items-center gap-0.5 ${
        compact ? "" : "rounded-full border border-ink-200 bg-white p-0.5"
      }`}
    >
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setLang(o.value)}
          aria-pressed={lang === o.value}
          aria-label={o.a11y}
          className={`min-h-8 rounded-full px-2.5 text-xs font-bold transition
            ${
              lang === o.value
                ? "bg-ink-900 text-white"
                : "text-ink-600 hover:bg-ink-100"
            }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
