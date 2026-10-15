"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { pick, useLang, useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { IconAlert, IconArrowRight, IconPhone, IconSearch } from "./Icons";

/* Entry points phrased as situations, not menu names — people who don't know
   the word "전출신청" still know they are moving house. */
const SITUATIONS = [
  { label: { ko: "이사할 때", en: "I'm moving" }, href: "/guide" },
  { label: { ko: "요금을 낼 때", en: "Paying a bill" }, href: "/bill" },
  { label: { ko: "가스 냄새가 날 때", en: "I smell gas" }, href: "/safety" },
  { label: { ko: "안전점검을 받을 때", en: "Safety inspection" }, href: "/guide" },
];

/* Four words per step — the full walkthrough lives on /safety. */
const STEPS = [
  { ko: "밸브 잠그기", en: "Close the valve" },
  { ko: "창문 열기", en: "Open windows" },
  { ko: "전기 만지지 않기", en: "No electrics" },
  { ko: "밖에서 신고", en: "Call from outside" },
];

export default function Hero() {
  const { lang } = useLang();
  const t = useT();
  const { user, ready } = useAuth();
  const [q, setQ] = useState("");

  // Only greet once the saved session is read, so the first render matches
  // the signed-out server output and hydration stays clean.
  const signedIn = ready && !!user;
  const name = user ? pick(user.name, lang) : "";

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-ink-200 bg-white"
    >
      {/* Soft brand wash — decorative only. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-40 size-[40rem] rounded-full bg-sk-orange-100 opacity-55 blur-3xl" />
        <div className="absolute -left-32 top-10 size-[26rem] rounded-full bg-sk-red-100 opacity-40 blur-3xl" />
      </div>

      <div className="shell relative grid grid-cols-1 gap-8 py-10 lg:grid-cols-[1.45fr_1fr] lg:items-center lg:gap-12 lg:py-16">
        {/* ── Left: headline + search ─────────────────────────────── */}
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white/70 px-3 py-1 text-[0.75rem] font-bold text-ink-600">
            <span className="size-1.5 rounded-full sk-gradient" aria-hidden />
            {t(`${pick(SITE.region, lang)} 도시가스 통합 서비스`, `${pick(SITE.region, lang)} City Gas · one place`)}
          </p>

          <h1
            id="hero-title"
            className="mt-4 text-[1.875rem] font-extrabold leading-[1.2] tracking-tight text-ink-900 sm:text-4xl lg:text-[2.75rem]"
          >
            {signedIn ? (
              lang === "en" ? (
                <>
                  Hello, <span className="sk-gradient-text">{name}</span>
                </>
              ) : (
                <>
                  안녕하세요, <span className="sk-gradient-text">{name}</span>님
                </>
              )
            ) : lang === "en" ? (
              <>
                City-gas tasks,
                <br />
                <span className="sk-gradient-text">done</span> in one place
              </>
            ) : (
              <>
                도시가스 업무,
                <br />
                <span className="sk-gradient-text">한 번에</span> 끝내세요
              </>
            )}
          </h1>

          <p className="mt-3 max-w-md text-[0.9375rem] text-ink-500 sm:text-base">
            {signedIn
              ? t(
                  "오늘도 안전하고 편리하게 도시가스를 이용하세요.",
                  "Have a safe and easy day with city gas.",
                )
              : t(
                  "이사·요금·안전점검까지, 필요한 업무를 검색 한 번으로 찾아드립니다.",
                  "Moving, billing, safety checks — find what you need with one search.",
                )}
          </p>

          {/* Search */}
          <form
            role="search"
            action="/search"
            className="mt-6 max-w-xl"
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
            <div className="flex items-center gap-2 rounded-2xl border-2 border-ink-900 bg-white p-1.5 shadow-[0_18px_40px_-24px_rgba(17,21,29,.55)] focus-within:border-sk-red-500">
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

          <ul className="mt-4 flex flex-wrap items-center gap-2">
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

        {/* ── Right: emergency SOS (safety first, for a gas utility) ── */}
        <aside className="rounded-[1.5rem] border-2 border-sk-red-200 bg-sk-red-50/80 p-6 backdrop-blur-sm lg:p-7">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink-900">
            <IconAlert className="size-5 text-sk-red-500" />
            {t("가스 냄새가 난다면", "If you smell gas")}
          </h2>

          <ol className="mt-4 grid grid-cols-2 gap-2">
            {STEPS.map((step, i) => (
              <li key={step.ko} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-sk-red-100 text-[0.6875rem] font-extrabold text-sk-red-600">
                  {i + 1}
                </span>
                <span className="text-[0.8125rem] font-bold leading-tight text-ink-800">{pick(step, lang)}</span>
              </li>
            ))}
          </ol>

          <a
            href={`tel:${SITE.safetyLine}`}
            className="mt-4 flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-sk-red-500 px-5 text-lg font-extrabold text-white transition hover:bg-sk-red-600"
          >
            <IconPhone className="size-5" />
            {SITE.safetyLine} {t("신고", "SOS")}
          </a>
          <Link
            href="/safety"
            className="mt-2 flex min-h-10 items-center justify-center gap-1 text-[0.8125rem] font-bold text-ink-600 hover:text-sk-red-700 hover:underline"
          >
            {t("자세한 안전 행동요령 보기", "See the full safety steps")} <IconArrowRight className="size-3.5" />
          </Link>
        </aside>
      </div>
    </section>
  );
}
