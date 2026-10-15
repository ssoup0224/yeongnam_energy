"use client";

import Link from "next/link";
import { useState } from "react";
import { pick, useLang, useT } from "@/lib/i18n";
import { IconArrowRight, IconSearch } from "./Icons";

/* Entry points phrased as situations, not menu names — people who don't know
   the word "전출신청" still know they are moving house. */
const SITUATIONS = [
  { label: { ko: "이사할 때", en: "I'm moving" }, href: "/guide" },
  { label: { ko: "요금을 낼 때", en: "Paying a bill" }, href: "/bill" },
  { label: { ko: "가스 냄새가 날 때", en: "I smell gas" }, href: "/safety" },
  { label: { ko: "안전점검을 받을 때", en: "Safety inspection" }, href: "/guide" },
];

export default function Hero() {
  const { lang } = useLang();
  const t = useT();
  const [q, setQ] = useState("");

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-ink-200 bg-white"
    >
      {/* Soft brand wash — decorative only. Centred behind the column so the
         colour sits under the content instead of drifting to the edges. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-18rem] size-[46rem] -translate-x-1/2 rounded-full bg-sk-orange-100 opacity-55 blur-3xl" />
        <div className="absolute left-[15%] top-[-8rem] size-[26rem] rounded-full bg-sk-red-100 opacity-45 blur-3xl" />
        <div className="absolute right-[12%] top-0 size-[24rem] rounded-full bg-sk-red-100 opacity-35 blur-3xl" />
      </div>

      {/* One centred column: title, search and shortcuts share an axis, so the
         eye travels straight down instead of across an empty right half. */}
      <div className="shell relative flex flex-col items-center py-12 text-center lg:py-16">
        <h1
          id="hero-title"
          className="max-w-3xl text-[1.875rem] font-extrabold leading-[1.25] tracking-tight text-ink-900 sm:text-4xl lg:text-[2.75rem]"
        >
          {lang === "en" ? (
            <>
              City-gas tasks,
              <br className="sm:hidden" />
              <span className="sk-gradient-text"> done </span>
              in one place
            </>
          ) : (
            <>
              도시가스 업무,
              <br className="sm:hidden" />
              <span className="sk-gradient-text"> 한 번에 </span>
              끝내세요
            </>
          )}
        </h1>

        <p className="mt-3 max-w-xl text-[0.9375rem] text-ink-500 sm:text-base">
          {t(
            "이사·요금·안전점검까지, 필요한 업무를 검색 한 번으로 찾아드립니다.",
            "Moving, billing, safety checks — find the task you need with a single search.",
          )}
        </p>

        {/* Search */}
        <form
          role="search"
          action="/search"
          className="mt-7 w-full max-w-3xl"
          onSubmit={(e) => {
            if (!q.trim()) e.preventDefault();
          }}
        >
          <label htmlFor="site-search" className="sr-only">
            {t(
              "무엇을 도와드릴까요? 업무 또는 키워드를 입력하세요",
              "How can we help? Type a task or keyword",
            )}
          </label>
          <div className="flex items-center gap-2 rounded-2xl border-2 border-ink-900 bg-white p-1.5 text-left shadow-[0_18px_40px_-24px_rgba(17,21,29,.55)] focus-within:border-sk-red-500">
            <IconSearch className="ml-3 size-5 shrink-0 text-ink-400" />
            <input
              id="site-search"
              name="q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("무엇을 도와드릴까요?", "How can we help?")}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-3 text-base text-ink-900 outline-none placeholder:text-ink-400"
            />
            <button
              type="submit"
              className="flex h-12 shrink-0 items-center gap-1.5 rounded-xl sk-gradient px-5 text-sm font-bold text-white transition hover:brightness-95"
            >
              {t("검색", "Search")}
              <IconArrowRight className="size-4" />
            </button>
          </div>
        </form>

        <ul className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <li className="text-[0.8125rem] font-semibold text-ink-500">{t("이럴 땐", "Try")}</li>
          {SITUATIONS.map((s) => (
            <li key={s.href + pick(s.label, lang)}>
              <Link
                href={s.href}
                className="inline-flex min-h-10 items-center rounded-full border border-ink-200 bg-white px-4 text-[0.8125rem] font-semibold text-ink-600 transition hover:border-sk-red-300 hover:bg-sk-red-50 hover:text-sk-red-700"
              >
                {pick(s.label, lang)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
