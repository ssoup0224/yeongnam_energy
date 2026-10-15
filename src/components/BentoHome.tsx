"use client";

import Link from "next/link";
import { useState } from "react";
import { NOTICES, SITE } from "@/lib/site";
import { pick, useLang, useT, type Bi } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import type { User } from "@/lib/auth";
import {
  IconArrowRight,
  IconAutoPay,
  IconCalculator,
  IconCenter,
  IconMeter,
  IconMoveIn,
  IconMoveOut,
  IconPhone,
  IconSearch,
  IconShield,
  IconUser,
} from "./Icons";

const MONTHS_EN = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const TASKS: { label: Bi; href: string; Icon: typeof IconMoveIn }[] = [
  { label: { ko: "전입신청", en: "Move-in" }, href: "/move/in", Icon: IconMoveIn },
  { label: { ko: "전출신청", en: "Move-out" }, href: "/move/out", Icon: IconMoveOut },
  { label: { ko: "자동이체", en: "Auto-pay" }, href: "/bill/auto", Icon: IconAutoPay },
  { label: { ko: "자가검침", en: "Meter" }, href: "/safety/meter", Icon: IconMeter },
  { label: { ko: "요금계산기", en: "Calculator" }, href: "/bill/calculator", Icon: IconCalculator },
  { label: { ko: "서비스센터", en: "Centers" }, href: "/centers", Icon: IconCenter },
];

const SITUATIONS: { label: Bi; href: string }[] = [
  { label: { ko: "이사할 때", en: "I'm moving" }, href: "/guide" },
  { label: { ko: "요금을 낼 때", en: "Paying a bill" }, href: "/bill" },
  { label: { ko: "가스 냄새가 날 때", en: "I smell gas" }, href: "/safety" },
];

const STEPS: Bi[] = [
  { ko: "밸브 잠그기", en: "Close the valve" },
  { ko: "창문 열기", en: "Open windows" },
  { ko: "전기 만지지 않기", en: "No electrics" },
  { ko: "밖에서 신고", en: "Call from outside" },
];

/* A notice flagged important, else the newest, as the "pinned notice" tile. */
const PINNED = NOTICES.find((n) => n.important) ?? NOTICES[0];

export default function BentoHome() {
  const { lang } = useLang();
  const t = useT();
  const { user, ready } = useAuth();
  const [q, setQ] = useState("");

  const signedIn = ready && !!user;

  return (
    <div className="shell py-6 lg:py-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-12 lg:gap-4">
        {/* ── Anchor: search / greeting ──────────────────────────── */}
        {signedIn && user ? (
          <AccountTile user={user} />
        ) : (
          <section className="col-span-2 flex flex-col justify-center overflow-hidden rounded-[1.5rem] border border-ink-200 bg-white p-7 lg:col-span-7 lg:p-9">
            <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-ink-200 px-3 py-1 text-[0.75rem] font-bold text-ink-600">
              <span className="size-1.5 rounded-full sk-gradient" aria-hidden />
              {t(`${pick(SITE.region, lang)} 도시가스 통합 서비스`, `${pick(SITE.region, lang)} City Gas · one place`)}
            </p>
            <h1 className="mt-4 text-[1.875rem] font-extrabold leading-[1.15] tracking-tight text-ink-900 sm:text-4xl lg:text-[2.6rem]">
              {lang === "en" ? (
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
            <form
              role="search"
              action="/search"
              className="mt-6"
              onSubmit={(e) => {
                if (!q.trim()) e.preventDefault();
              }}
            >
              <label htmlFor="bento-search" className="sr-only">
                {t("무엇을 도와드릴까요?", "How can we help?")}
              </label>
              <div className="flex items-center gap-2 rounded-2xl border-2 border-ink-900 bg-white p-1.5 focus-within:border-sk-red-500">
                <IconSearch className="ml-3 size-5 shrink-0 text-ink-400" />
                <input
                  id="bento-search"
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
                <li key={s.href + s.label.ko}>
                  <Link
                    href={s.href}
                    className="inline-flex min-h-9 items-center rounded-full border border-ink-200 px-3.5 text-[0.8125rem] font-semibold text-ink-600 transition hover:border-sk-red-300 hover:bg-sk-red-50 hover:text-sk-red-700"
                  >
                    {pick(s.label, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Secondary anchor: usage (signed in) / emergency (out) ── */}
        {signedIn && user ? (
          <UsageTile user={user} />
        ) : (
          <section className="col-span-2 flex flex-col rounded-[1.5rem] border-2 border-sk-red-200 bg-sk-red-50 p-6 lg:col-span-5">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink-900">
              <span className="flex size-7 items-center justify-center rounded-full bg-sk-red-500 text-white">!</span>
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
              className="mt-auto flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-sk-red-500 px-5 pt-4 text-lg font-extrabold text-white transition hover:bg-sk-red-600"
            >
              <IconPhone className="size-5" />
              {SITE.safetyLine} {t("신고", "SOS")}
            </a>
          </section>
        )}

        {/* ── Task tiles ─────────────────────────────────────────── */}
        {TASKS.map(({ label, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group col-span-1 flex flex-col items-start gap-2.5 rounded-[1.25rem] border border-ink-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-sk-red-300 hover:shadow-[0_14px_30px_-20px_rgba(234,0,44,.6)] lg:col-span-2 lg:p-5"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-ink-50 text-ink-700 transition group-hover:bg-sk-red-500 group-hover:text-white">
              <Icon className="size-5" />
            </span>
            <span className="text-[0.9375rem] font-extrabold leading-snug text-ink-900">{pick(label, lang)}</span>
          </Link>
        ))}

        {/* ── Notices ────────────────────────────────────────────── */}
        <section className="col-span-2 flex flex-col rounded-[1.5rem] border border-ink-200 bg-white p-6 lg:col-span-8 lg:p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-ink-900">{t("공지사항", "Notices")}</h2>
            <Link
              href="/support"
              className="inline-flex items-center gap-1 text-[0.8125rem] font-bold text-ink-500 hover:text-sk-red-600"
            >
              {t("더보기", "More")} <IconArrowRight className="size-3.5" />
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-ink-100">
            {NOTICES.slice(0, 4).map((n) => (
              <li key={n.id}>
                <Link href="/support" className="flex items-center gap-3 py-3 transition hover:opacity-70">
                  <span
                    className={`shrink-0 rounded-md px-2 py-1 text-[0.6875rem] font-extrabold ${
                      n.important ? "bg-sk-red-50 text-sk-red-700" : "bg-ink-100 text-ink-600"
                    }`}
                  >
                    {pick(n.tag, lang)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-bold text-ink-900">
                    {pick(n.title, lang)}
                  </span>
                  <time dateTime={n.date} className="hidden shrink-0 text-[0.75rem] tabular-nums text-ink-400 sm:block">
                    {n.date.replaceAll("-", ".")}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Side tile: sign-in (out) / safety (in) ─────────────── */}
        {signedIn ? (
          <section className="col-span-2 flex flex-col rounded-[1.5rem] border-2 border-sk-red-200 bg-sk-red-50 p-6 lg:col-span-4">
            <h2 className="flex items-center gap-2 text-base font-extrabold text-ink-900">
              <span className="flex size-6 items-center justify-center rounded-full bg-sk-red-500 text-[0.75rem] text-white">!</span>
              {t("가스 냄새가 나나요?", "Smell gas?")}
            </h2>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-600">
              {t(
                "밸브를 잠그고 창문을 연 뒤, 밖으로 나와 신고하세요.",
                "Close the valve, open windows, go outside, then call.",
              )}
            </p>
            <a
              href={`tel:${SITE.safetyLine}`}
              className="mt-auto flex min-h-13 items-center justify-center gap-2 rounded-xl bg-sk-red-500 px-5 pt-3 text-base font-extrabold text-white transition hover:bg-sk-red-600"
            >
              <IconPhone className="size-5" /> {SITE.safetyLine}
            </a>
          </section>
        ) : (
          <section className="relative col-span-2 flex flex-col overflow-hidden rounded-[1.5rem] bg-ink-900 p-6 text-white lg:col-span-4">
            <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full sk-gradient opacity-25 blur-2xl" />
            <div className="relative flex flex-1 flex-col">
              <h2 className="text-lg font-extrabold">{t("로그인하면 더 편리합니다", "Sign in for more")}</h2>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-white/70">
                {t(
                  "이번 달 요금과 사용량을 한 화면에서 확인하세요.",
                  "See this month's bill and usage in one place.",
                )}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 text-[0.9375rem] font-extrabold text-ink-900 transition hover:bg-ink-100"
                >
                  <IconUser className="size-4" /> {t("로그인", "Log in")}
                </Link>
                <Link
                  href="/bill"
                  className="inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-white/30 px-4 text-[0.9375rem] font-bold text-white transition hover:bg-white/10"
                >
                  {t("비회원 조회", "Guest lookup")} <IconArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Pinned notice banner (signed out only) ─────────────── */}
        {signedIn ? null : (
          <Link
            href="/support"
            className="group col-span-2 flex items-center gap-3 rounded-[1.25rem] border border-ink-200 bg-white px-5 py-4 transition hover:border-sk-orange-300 lg:col-span-12"
          >
            <span className="shrink-0 rounded-full bg-sk-orange-100 px-3 py-1 text-[0.6875rem] font-extrabold text-sk-orange-700">
              {t("중요", "Important")}
            </span>
            <span className="min-w-0 flex-1 truncate text-[0.875rem] font-bold text-ink-800">
              {pick(PINNED.title, lang)}
            </span>
            <IconArrowRight className="size-4 shrink-0 text-ink-300 transition group-hover:translate-x-1 group-hover:text-sk-orange-500" />
          </Link>
        )}
      </div>
    </div>
  );
}

/* ── Signed-in anchor: greeting + address + this month's bill ──────── */
function AccountTile({ user }: { user: User }) {
  const { lang } = useLang();
  const t = useT();
  const name = pick(user.name, lang);
  const bill = user.estimatedBill.toLocaleString("en-US");
  const due = new Date(user.dueDate);
  const dueLabel =
    lang === "en"
      ? `${MONTHS_EN[due.getMonth() + 1]} ${due.getDate()}, ${due.getFullYear()}`
      : `${due.getMonth() + 1}월 ${due.getDate()}일`;

  return (
    <section className="relative col-span-2 flex flex-col overflow-hidden rounded-[1.5rem] bg-ink-900 p-7 text-white lg:col-span-7 lg:p-9">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full sk-gradient opacity-30 blur-2xl" />
      <div className="relative">
        <p className="text-[0.9375rem] text-white/70">
          {t(`안녕하세요, ${name}님`, `Hello, ${name}`)}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-white/50">
          <span>{pick(user.address, lang)}</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
            {pick(user.status, lang)}
          </span>
        </p>

        <div className="mt-6 border-t border-white/15 pt-6">
          <p className="text-[0.8125rem] text-white/60">{t("이번 달 예상 요금", "This month's estimate")}</p>
          <p className="mt-1 text-[2.75rem] font-extrabold tabular-nums leading-none tracking-tight sm:text-[3.5rem]">
            {lang === "en" ? `₩${bill}` : `${bill}원`}
          </p>
          <p className="mt-2 text-[0.8125rem] text-white/60">{t(`납부 예정일 ${dueLabel}`, `Due ${dueLabel}`)}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/bill"
            className="inline-flex min-h-12 items-center gap-1.5 rounded-xl bg-white px-6 text-[0.9375rem] font-extrabold text-ink-900 transition hover:bg-ink-100"
          >
            {t("요금 상세·납부", "View & pay")} <IconArrowRight className="size-4" />
          </Link>
          <Link
            href="/bill/account"
            className="inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-white/30 px-5 text-[0.9375rem] font-bold text-white transition hover:bg-white/10"
          >
            {t("계정 관리", "Manage account")}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Signed-in secondary anchor: 6-month usage chart ───────────────── */
function UsageTile({ user }: { user: User }) {
  const { lang } = useLang();
  const t = useT();
  const maxUsage = Math.max(...user.usage.map((u) => u.value));

  return (
    <section className="col-span-2 flex flex-col rounded-[1.5rem] border border-ink-200 bg-white p-6 lg:col-span-5 lg:p-7">
      <div className="flex items-center gap-2">
        <IconShield className="size-4 text-sk-red-500" />
        <h2 className="text-[0.9375rem] font-extrabold text-ink-900">{t("지난 6개월 사용량", "Last 6 months")}</h2>
        <span className="text-[0.8125rem] font-semibold text-ink-400">(㎥)</span>
      </div>
      <div className="mt-auto flex items-end justify-between gap-2 pt-6 sm:gap-3" style={{ height: "10rem" }}>
        {user.usage.map((u, i) => {
          const barPx = Math.max(10, Math.round((u.value / maxUsage) * 128));
          const latest = i === user.usage.length - 1;
          return (
            <div key={u.month} className="flex flex-1 flex-col items-center justify-end gap-1.5">
              <span className={`text-[0.6875rem] font-bold ${latest ? "text-sk-red-600" : "text-ink-400"}`}>
                {u.value}
              </span>
              <div
                className={`bar-rise w-full max-w-[2.5rem] rounded-lg ${latest ? "sk-gradient" : "bg-ink-200"}`}
                style={{ height: `${barPx}px`, animationDelay: `${i * 60}ms` }}
                aria-hidden
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between gap-2 sm:gap-3">
        {user.usage.map((u, i) => (
          <span
            key={u.month}
            className={`flex-1 text-center text-[0.75rem] ${
              i === user.usage.length - 1 ? "font-bold text-ink-900" : "text-ink-500"
            }`}
          >
            {lang === "en" ? MONTHS_EN[u.month] : `${u.month}월`}
          </span>
        ))}
      </div>
    </section>
  );
}
