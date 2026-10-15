"use client";

import Link from "next/link";
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
  IconShield,
  IconUser,
} from "./Icons";

const MONTHS_EN = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* Sample shape for the signed-out usage tile, so it reads as the same chart. */
const PLACEHOLDER_USAGE = [40, 55, 72, 48, 66, 90];
const PLACEHOLDER_MONTHS = [5, 6, 7, 8, 9, 10];

const TASKS: { label: Bi; href: string; Icon: typeof IconMoveIn }[] = [
  { label: { ko: "전입신청", en: "Move-in" }, href: "/move/in", Icon: IconMoveIn },
  { label: { ko: "전출신청", en: "Move-out" }, href: "/move/out", Icon: IconMoveOut },
  { label: { ko: "자동이체", en: "Auto-pay" }, href: "/bill/auto", Icon: IconAutoPay },
  { label: { ko: "자가검침", en: "Meter" }, href: "/safety/meter", Icon: IconMeter },
  { label: { ko: "요금계산기", en: "Calculator" }, href: "/bill/calculator", Icon: IconCalculator },
  { label: { ko: "서비스센터", en: "Centers" }, href: "/centers", Icon: IconCenter },
];

export default function BentoHome() {
  const { lang } = useLang();
  const t = useT();
  const { user, ready } = useAuth();

  const signedIn = ready && !!user;

  return (
    <div className="shell py-6 lg:py-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-12 lg:gap-4">
        {/* 1 ── Anchor: account + bill (signed in) / sign-in (signed out) */}
        {signedIn && user ? <AccountTile user={user} /> : <SignInTile />}

        {/* 2 ── Usage chart — real when signed in, locked preview when not */}
        <UsageTile user={signedIn && user ? user : undefined} />

        {/* 3–8 ── Task tiles (identical in both states) */}
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

        {/* 9 ── Notices (identical in both states) */}
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

        {/* 10 ── Safety card (identical in both states) */}
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
      </div>
    </div>
  );
}

/* ── Anchor, signed in: greeting + address + this month's bill ─────── */
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
        <p className="text-[0.9375rem] text-white/70">{t(`안녕하세요, ${name}님`, `Hello, ${name}`)}</p>
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

/* ── Anchor, signed out: same slot & style, prompting sign-in ──────── */
function SignInTile() {
  const { lang } = useLang();
  const t = useT();
  return (
    <section className="relative col-span-2 flex flex-col overflow-hidden rounded-[1.5rem] bg-ink-900 p-7 text-white lg:col-span-7 lg:p-9">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full sk-gradient opacity-30 blur-2xl" />
      <div className="relative flex flex-1 flex-col">
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-[0.75rem] font-bold text-white/70">
          <IconUser className="size-3.5" /> {t("내 정보", "My account")}
        </p>
        <h1 className="mt-4 text-[1.75rem] font-extrabold leading-[1.2] tracking-tight sm:text-[2.25rem]">
          {lang === "en" ? (
            <>
              See this month&apos;s bill
              <br />
              <span className="sk-gradient-text">at a glance</span>
            </>
          ) : (
            <>
              로그인하면 이번 달 요금이
              <br />
              <span className="sk-gradient-text">바로</span> 보입니다
            </>
          )}
        </h1>
        <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-white/70">
          {t(
            "예상 요금과 지난 6개월 사용량, 신청 내역까지 한 화면에서 확인하세요.",
            "See your estimated bill, 6-month usage and requests, all in one place.",
          )}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <Link
            href="/login"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 text-[0.9375rem] font-extrabold text-ink-900 transition hover:bg-ink-100"
          >
            <IconUser className="size-4" /> {t("로그인", "Log in")}
          </Link>
          <Link
            href="/bill"
            className="inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-white/30 px-5 text-[0.9375rem] font-bold text-white transition hover:bg-white/10"
          >
            {t("비회원 요금조회", "Guest bill lookup")} <IconArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Usage chart: real data when signed in, locked preview otherwise ── */
function UsageTile({ user }: { user?: User }) {
  const { lang } = useLang();
  const t = useT();

  const values = user ? user.usage.map((u) => u.value) : PLACEHOLDER_USAGE;
  const months = user ? user.usage.map((u) => u.month) : PLACEHOLDER_MONTHS;
  const max = Math.max(...values);
  const locked = !user;

  return (
    <section className="relative col-span-2 flex flex-col rounded-[1.5rem] border border-ink-200 bg-white p-6 lg:col-span-5 lg:p-7">
      <div className="flex items-center gap-2">
        <IconShield className="size-4 text-sk-red-500" />
        <h2 className="text-[0.9375rem] font-extrabold text-ink-900">{t("지난 6개월 사용량", "Last 6 months")}</h2>
        <span className="text-[0.8125rem] font-semibold text-ink-400">(㎥)</span>
      </div>

      <div className={`relative mt-auto pt-6 ${locked ? "opacity-50" : ""}`}>
        <div className="flex items-end justify-between gap-2 sm:gap-3" style={{ height: "10rem" }}>
          {values.map((v, i) => {
            const barPx = Math.max(10, Math.round((v / max) * 128));
            const latest = !locked && i === values.length - 1;
            return (
              <div key={months[i]} className="flex flex-1 flex-col items-center justify-end gap-1.5">
                {locked ? null : (
                  <span className={`text-[0.6875rem] font-bold ${latest ? "text-sk-red-600" : "text-ink-400"}`}>{v}</span>
                )}
                <div
                  className={`${locked ? "" : "bar-rise"} w-full max-w-[2.5rem] rounded-lg ${latest ? "sk-gradient" : "bg-ink-200"}`}
                  style={{ height: `${barPx}px`, animationDelay: `${i * 60}ms` }}
                  aria-hidden
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between gap-2 sm:gap-3">
          {months.map((m, i) => (
            <span
              key={m}
              className={`flex-1 text-center text-[0.75rem] ${
                !locked && i === months.length - 1 ? "font-bold text-ink-900" : "text-ink-500"
              }`}
            >
              {lang === "en" ? MONTHS_EN[m] : `${m}월`}
            </span>
          ))}
        </div>
      </div>

      {locked ? (
        <div className="absolute inset-0 flex flex-col items-center justify-end rounded-[1.5rem] bg-gradient-to-t from-white via-white/85 to-transparent p-6 text-center">
          <p className="text-[0.875rem] font-bold text-ink-700">
            {t("로그인하면 실제 사용량이 표시됩니다", "Sign in to see your real usage")}
          </p>
          <Link
            href="/login"
            className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-ink-900 px-5 text-[0.875rem] font-bold text-white transition hover:bg-ink-800"
          >
            {t("로그인", "Log in")} <IconArrowRight className="size-4" />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
