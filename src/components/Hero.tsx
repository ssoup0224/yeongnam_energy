"use client";

import Link from "next/link";
import { useState } from "react";
import { IconArrowRight, IconSearch } from "./Icons";

/* Entry points phrased as situations, not menu names — people who don't know
   the word "전출신청" still know they are moving house. */
const SITUATIONS = [
  { label: "이사할 때", href: "/guide" },
  { label: "요금을 낼 때", href: "/bill" },
  { label: "가스 냄새가 날 때", href: "/safety" },
  { label: "안전점검을 받을 때", href: "/guide" },
];

export default function Hero() {
  const [q, setQ] = useState("");

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-ink-200 bg-white"
    >
      {/* Soft brand wash — decorative only */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-32 size-[28rem] rounded-full bg-sk-orange-100 opacity-60 blur-3xl" />
        <div className="absolute -left-32 top-10 size-[24rem] rounded-full bg-sk-red-100 opacity-50 blur-3xl" />
      </div>

      <div className="shell relative py-9 lg:py-12">
        <h1
          id="hero-title"
          className="text-[1.75rem] font-extrabold leading-[1.25] tracking-tight text-ink-900 sm:text-4xl lg:text-[2.5rem]"
        >
          도시가스 업무,
          <br className="sm:hidden" />
          <span className="sk-gradient-text"> 한 번에 </span>
          끝내세요
        </h1>

        {/* Search */}
        <form
          role="search"
          action="/search"
          className="mt-5 max-w-2xl"
          onSubmit={(e) => {
            if (!q.trim()) e.preventDefault();
          }}
        >
          <label htmlFor="site-search" className="sr-only">
            무엇을 도와드릴까요? 업무 또는 키워드를 입력하세요
          </label>
          <div className="flex items-center gap-2 rounded-2xl border-2 border-ink-900 bg-white p-1.5 shadow-[0_10px_30px_-18px_rgba(17,21,29,.5)] focus-within:border-sk-red-500">
            <IconSearch className="ml-3 size-5 shrink-0 text-ink-400" />
            <input
              id="site-search"
              name="q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="무엇을 도와드릴까요?"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-3 text-base text-ink-900 outline-none placeholder:text-ink-400"
            />
            <button
              type="submit"
              className="flex h-12 shrink-0 items-center gap-1.5 rounded-xl sk-gradient px-5 text-sm font-bold text-white transition hover:brightness-95"
            >
              검색
              <IconArrowRight className="size-4" />
            </button>
          </div>

        </form>

        <ul className="mt-4 flex flex-wrap items-center gap-2">
          <li className="text-[0.8125rem] font-semibold text-ink-500">이럴 땐</li>
          {SITUATIONS.map((s) => (
            <li key={s.label}>
              <Link
                href={s.href}
                className="inline-flex min-h-10 items-center rounded-full border border-ink-200 bg-white px-4 text-[0.8125rem] font-semibold text-ink-600 transition hover:border-sk-red-300 hover:bg-sk-red-50 hover:text-sk-red-700"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
