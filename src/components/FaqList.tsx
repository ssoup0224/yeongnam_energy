"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FAQS } from "@/lib/site";
import { pick, useLang, useT } from "@/lib/i18n";
import { IconArrowRight, IconChat, IconSearch } from "./Icons";

/** `key` matches FAQ.cat.ko (canonical); labels are display-only. */
const CATS = [
  { key: "all", label: { ko: "전체", en: "All" } },
  { key: "이사", label: { ko: "이사", en: "Moving" } },
  { key: "요금", label: { ko: "요금", en: "Billing" } },
  { key: "안전", label: { ko: "안전", en: "Safety" } },
  { key: "검침", label: { ko: "검침", en: "Metering" } },
];

export default function FaqList() {
  const { lang } = useLang();
  const t = useT();
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return FAQS.filter((f) => {
      const byCat = cat === "all" || f.cat.ko === cat;
      const hay = `${pick(f.q, lang)} ${pick(f.a, lang)}`.toLowerCase();
      return byCat && (!needle || hay.includes(needle));
    });
  }, [cat, q, lang]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_18rem] lg:items-start">
      <div>
        <div className="flex items-center gap-2 rounded-xl border-2 border-ink-200 bg-white px-3 focus-within:border-sk-red-500">
          <IconSearch className="size-5 shrink-0 text-ink-400" />
          <label htmlFor="faq-q" className="sr-only">
            {t("질문 검색", "Search questions")}
          </label>
          <input
            id="faq-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("궁금한 내용을 검색하세요", "Search for an answer")}
            className="min-h-13 min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-ink-300"
          />
        </div>

        <ul className="mt-4 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <li key={c.key}>
              <button
                type="button"
                onClick={() => setCat(c.key)}
                aria-pressed={cat === c.key}
                className={`min-h-11 rounded-full border px-4 text-[0.875rem] font-bold transition
                  ${cat === c.key
                    ? "border-transparent bg-ink-900 text-white"
                    : "border-ink-200 bg-white text-ink-600 hover:border-ink-300"}`}
              >
                {pick(c.label, lang)}
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-[0.875rem] font-bold text-ink-700" aria-live="polite">
          {t(`${list.length}개의 질문`, `${list.length} question${list.length === 1 ? "" : "s"}`)}
        </p>

        <ul className="mt-2 overflow-hidden rounded-[1.25rem] border border-ink-200 bg-white">
          {list.map((f, i) => {
            const qText = pick(f.q, lang);
            return (
              <li key={f.q.ko} className={i > 0 ? "border-t border-ink-100" : ""}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open === f.q.ko}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(open === f.q.ko ? null : f.q.ko)}
                    className="flex w-full items-start gap-3 p-5 text-left transition hover:bg-ink-50"
                  >
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-sk-red-50 text-[0.8125rem] font-extrabold text-sk-red-600">
                      Q
                    </span>
                    <span className="min-w-0 flex-1 text-[0.9375rem] font-extrabold leading-snug text-ink-900">
                      {qText}
                    </span>
                    <IconArrowRight
                      className={`mt-1 size-4 shrink-0 text-ink-400 transition ${open === f.q.ko ? "rotate-90" : ""}`}
                    />
                  </button>
                </h3>
                {open === f.q.ko ? (
                  <div id={`faq-${i}`} className="flex gap-3 px-5 pb-5">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-[0.8125rem] font-extrabold text-ink-600">
                      A
                    </span>
                    <p className="flex-1 rounded-xl bg-ink-50 p-4 text-[0.875rem] leading-relaxed text-ink-700">
                      {pick(f.a, lang)}
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
          {list.length === 0 ? (
            <li className="p-10 text-center">
              <p className="text-base font-extrabold text-ink-900">{t("검색 결과가 없습니다", "No results")}</p>
              <p className="mt-1.5 text-[0.875rem] text-ink-500">
                {t(
                  "다른 단어로 검색하시거나 온라인 상담을 이용해 주세요.",
                  "Try a different word, or use online Q&A.",
                )}
              </p>
            </li>
          ) : null}
        </ul>
      </div>

      <aside className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:sticky lg:top-24">
        <span className="flex size-11 items-center justify-center rounded-xl bg-sk-red-50 text-sk-red-600">
          <IconChat className="size-5" />
        </span>
        <h2 className="mt-3.5 text-base font-extrabold text-ink-900">
          {t("찾는 답변이 없나요?", "Can't find your answer?")}
        </h2>
        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-500">
          {t(
            "온라인 상담은 24시간 접수되며, 1영업일 안에 답변드립니다.",
            "Online Q&A is open 24/7 and we reply within one business day.",
          )}
        </p>
        <Link
          href="/support/qna"
          className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ink-900 text-[0.9375rem] font-bold text-white hover:bg-ink-800"
        >
          {t("온라인 상담 접수", "Submit a question")} <IconArrowRight className="size-4" />
        </Link>
      </aside>
    </div>
  );
}
