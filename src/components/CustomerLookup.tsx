"use client";

import { useState } from "react";
import { digitsOnly, lookupAccount } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { ErrorText } from "./form";

/**
 * Customer-number lookup used across billing, contract, certificate and
 * meter pages. Validates the 10-digit format, checks the number exists, and
 * hands the digits back.
 */
export default function CustomerLookup({
  onFound,
  buttonLabel,
  title,
  sub,
  initial = "",
  idPrefix = "cust",
}: {
  onFound: (digits: string) => void;
  buttonLabel?: string;
  title?: string;
  sub?: string;
  initial?: string;
  idPrefix?: string;
}) {
  const t = useT();
  const [num, setNum] = useState(initial);
  const [error, setError] = useState("");
  const inputId = `${idPrefix}-no`;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const d = digitsOnly(num);
    if (d.length !== 10) {
      setError(t("고객번호 10자리를 정확히 입력해 주세요.", "Please enter your 10-digit customer number."));
      return;
    }
    if (!lookupAccount(d)) {
      setError(t("등록되지 않은 고객번호입니다. 청구서의 번호를 다시 확인해 주세요.", "That customer number isn't registered — check the number on your bill."));
      return;
    }
    setError("");
    onFound(d);
  }

  return (
    <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-7">
      {title ? <h2 className="text-lg font-extrabold text-ink-900">{title}</h2> : null}
      {sub ? <p className="mt-1.5 text-[0.875rem] text-ink-500">{sub}</p> : null}
      <form onSubmit={submit} noValidate className={title || sub ? "mt-5" : ""}>
        <label htmlFor={inputId} className="block text-[0.875rem] font-bold text-ink-800">
          {t("고객번호", "Customer number")} <span className="text-sk-red-600">{t("(필수)", "(required)")}</span>
        </label>
        <p id={`${inputId}-help`} className="mt-1 text-[0.8125rem] text-ink-500">
          {t("숫자 10자리 · 하이픈(-) 없이 입력해도 됩니다. 체험용: 1234-567-890", "10 digits · hyphens optional. Demo: 1234-567-890")}
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={num}
            onChange={(e) => setNum(e.target.value)}
            aria-describedby={error ? `${inputId}-help ${inputId}-err` : `${inputId}-help`}
            aria-invalid={!!error}
            placeholder="1234-567-890"
            className={`min-h-13 flex-1 rounded-xl border-2 bg-white px-4 py-3 text-base tabular-nums text-ink-900 outline-none transition placeholder:text-ink-300 focus:border-sk-red-500 ${
              error ? "border-sk-red-500 bg-sk-red-50/40" : "border-ink-200"
            }`}
          />
          <button type="submit" className="min-h-13 shrink-0 rounded-xl sk-gradient px-7 text-base font-extrabold text-white transition hover:brightness-95">
            {buttonLabel ?? t("조회하기", "Look up")}
          </button>
        </div>
        {error ? <ErrorText id={`${inputId}-err`}>{error}</ErrorText> : null}
      </form>
    </div>
  );
}
