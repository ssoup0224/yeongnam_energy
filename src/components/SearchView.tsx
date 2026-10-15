"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FAQS, NAV, NOTICES } from "@/lib/site";
import { pick, useLang, useT, type Lang } from "@/lib/i18n";
import { IconArrowRight, IconSearch } from "./Icons";

type Hit = { label: string; href: string; kind: string; snippet?: string };

function runSearch(q: string, lang: Lang, t: (ko: string, en: string) => string): Hit[] {
  const n = q.trim().toLowerCase();
  if (!n) return [];
  const match = (s: string) => s.toLowerCase().includes(n);
  const hits: Hit[] = [];

  for (const g of NAV) {
    for (const c of g.children) {
      const label = pick(c.label, lang);
      const desc = c.desc ? pick(c.desc, lang) : "";
      if (match(label) || match(desc) || match(pick(g.label, lang)) || match(c.label.ko)) {
        hits.push({ label, href: c.href, kind: pick(g.label, lang), snippet: desc || undefined });
      }
    }
  }
  for (const x of NOTICES) {
    const title = pick(x.title, lang);
    const summary = pick(x.summary, lang);
    if (match(title) || match(summary) || match(pick(x.tag, lang))) {
      hits.push({ label: title, href: "/support", kind: t("공지사항", "Notice"), snippet: summary });
    }
  }
  for (const f of FAQS) {
    const question = pick(f.q, lang);
    const answer = pick(f.a, lang);
    if (match(question) || match(answer)) {
      hits.push({ label: question, href: "/support/faq", kind: t("자주 묻는 질문", "FAQ"), snippet: answer });
    }
  }
  return hits;
}

const SUGGESTIONS = [
  { ko: "이사", en: "moving" },
  { ko: "요금", en: "billing" },
  { ko: "자동이체", en: "auto-pay" },
  { ko: "검침", en: "metering" },
  { ko: "안전", en: "safety" },
];

export default function SearchView() {
  const { lang } = useLang();
  const t = useT();
  const q = useSearchParams().get("q") ?? "";
  const hits = useMemo(() => runSearch(q, lang, t), [q, lang, t]);

  return (
    <div className="shell py-10 lg:py-14">
      <form role="search" action="/search" className="max-w-2xl">
        <label htmlFor="q" className="sr-only">
          {t("검색어", "Search term")}
        </label>
        <div className="flex items-center gap-2 rounded-2xl border-2 border-ink-900 bg-white p-1.5">
          <IconSearch className="ml-3 size-5 shrink-0 text-ink-400" />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder={t("무엇을 도와드릴까요?", "How can we help?")}
            className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-ink-400"
          />
          <button
            type="submit"
            className="h-12 shrink-0 rounded-xl sk-gradient px-6 text-sm font-bold text-white hover:brightness-95"
          >
            {t("검색", "Search")}
          </button>
        </div>
      </form>

      {q ? (
        <p className="mt-7 text-[0.9375rem] text-ink-600">
          {lang === "en" ? (
            <>
              <strong className="font-extrabold text-sk-red-600">{hits.length}</strong> result
              {hits.length === 1 ? "" : "s"} for{" "}
              <strong className="font-extrabold text-ink-900">&lsquo;{q}&rsquo;</strong>
            </>
          ) : (
            <>
              <strong className="font-extrabold text-ink-900">&lsquo;{q}&rsquo;</strong> 검색 결과{" "}
              <strong className="font-extrabold text-sk-red-600">{hits.length}</strong>건
            </>
          )}
        </p>
      ) : null}

      {q && hits.length === 0 ? (
        <div className="mt-4 rounded-[1.25rem] border border-dashed border-ink-300 bg-white p-10 text-center">
          <p className="text-base font-extrabold text-ink-900">{t("검색 결과가 없습니다", "No results")}</p>
          <p className="mt-1.5 text-[0.875rem] text-ink-500">
            {t(
              "띄어쓰기를 줄이거나 더 짧은 단어로 검색해 보세요. (예: 이사, 요금, 검침)",
              "Try a shorter word. (e.g. moving, billing, metering)",
            )}
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => {
              const term = pick(s, lang);
              return (
                <li key={s.ko}>
                  <Link
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-ink-200 px-4 text-[0.875rem] font-bold text-ink-600 hover:border-sk-red-300 hover:bg-sk-red-50 hover:text-sk-red-700"
                  >
                    {term}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {hits.length > 0 ? (
        <ul className="mt-4 overflow-hidden rounded-[1.25rem] border border-ink-200 bg-white">
          {hits.map((h, i) => (
            <li key={`${h.href}-${i}`} className={i > 0 ? "border-t border-ink-100" : ""}>
              <Link href={h.href} className="group flex items-start gap-3 p-5 transition hover:bg-ink-50">
                <span className="mt-0.5 shrink-0 rounded-md bg-ink-100 px-2 py-1 text-[0.6875rem] font-extrabold text-ink-600">
                  {h.kind}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.9375rem] font-extrabold leading-snug text-ink-900">
                    {h.label}
                  </span>
                  {h.snippet ? (
                    <span className="mt-1 block line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-500">
                      {h.snippet}
                    </span>
                  ) : null}
                </span>
                <IconArrowRight className="mt-1 size-4 shrink-0 text-ink-300 transition group-hover:translate-x-1 group-hover:text-sk-red-500" />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
