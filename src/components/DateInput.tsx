"use client";

import { useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { inputCls } from "./form";
import { IconCalendar } from "./Icons";

/** "2026-11-12" → "2026. 11. 12." */
function display(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const [y, m, d] = iso.split("-");
  return `${y}. ${m}. ${d}.`;
}

/** Progressive mask while typing: 20261 → "2026. 1" */
function mask(digits: string) {
  const d = digits.slice(0, 8);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}. ${d.slice(4)}`;
  return `${d.slice(0, 4)}. ${d.slice(4, 6)}. ${d.slice(6)}`;
}

/** Eight digits → ISO date, or "" if it isn't a real calendar date. */
function toIso(digits: string) {
  if (digits.length !== 8) return "";
  const y = Number(digits.slice(0, 4));
  const m = Number(digits.slice(4, 6));
  const d = Number(digits.slice(6, 8));
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return "";
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

/**
 * Date field with a placeholder in the page's language. A native
 * <input type="date"> takes its placeholder ("연도. 월. 일.") from the
 * browser's locale, which English pages can't override — so this is a typed
 * field that auto-formats, plus a button that opens the native calendar.
 */
export default function DateInput({
  id,
  value,
  onChange,
  min,
  max,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (iso: string) => void;
  min?: string;
  max?: string;
  invalid?: boolean;
}) {
  const t = useT();
  const picker = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(display(value));
  // Last value we emitted; if the parent changes `value` on its own (reset,
  // prefill), re-derive the visible text from it.
  const [synced, setSynced] = useState(value);
  if (value !== synced) {
    setSynced(value);
    setText(display(value) || value);
  }

  function emit(iso: string) {
    setSynced(iso);
    onChange(iso);
  }

  function onType(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    const iso = toIso(digits);
    const shown = iso ? display(iso) : mask(digits);
    setText(shown);
    // Half-typed or impossible dates are passed through as-is (not ISO) so
    // the form's validator can flag them instead of silently dropping them.
    emit(iso || shown);
  }

  function openPicker() {
    const el = picker.current;
    if (!el) return;
    try {
      el.showPicker();
    } catch {
      el.focus();
      el.click();
    }
  }

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={text}
        onChange={(e) => onType(e.target.value)}
        placeholder={t("연도. 월. 일.", "YYYY. MM. DD.")}
        aria-describedby={`${id}-fmt`}
        className={`${inputCls(invalid)} pr-14 tabular-nums`}
      />
      <span id={`${id}-fmt`} className="sr-only">{t("8자리 숫자로 입력하세요. 예: 20261112", "Type 8 digits, e.g. 20261112")}</span>
      <button
        type="button"
        onClick={openPicker}
        aria-label={t("달력에서 선택", "Pick from calendar")}
        className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100 hover:text-ink-800"
      >
        <IconCalendar className="size-5" />
      </button>
      <input
        ref={picker}
        type="date"
        tabIndex={-1}
        aria-hidden
        min={min}
        max={max}
        value={/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : ""}
        onChange={(e) => {
          setText(display(e.target.value));
          emit(e.target.value);
        }}
        className="pointer-events-none absolute bottom-0 right-0 size-px opacity-0"
      />
    </div>
  );
}
