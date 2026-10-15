"use client";

import Link from "next/link";
import { pick, useLang, useT } from "@/lib/i18n";
import type { User } from "@/lib/auth";
import { IconArrowRight } from "./Icons";

const MONTHS_EN = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * The signed-in personal block. It sits in the same slot the sign-in panel
 * (MyPanel) occupies when logged out, so the home layout stays consistent —
 * only this block's content personalizes. The greeting lives in the hero and
 * the service shortcuts come from the shared QuickServices section.
 */
export default function AccountSummary({ user }: { user: User }) {
  const { lang } = useLang();
  const t = useT();

  const bill = user.estimatedBill.toLocaleString("en-US");
  const due = new Date(user.dueDate);
  const dueLabel =
    lang === "en"
      ? `${MONTHS_EN[due.getMonth() + 1]} ${due.getDate()}, ${due.getFullYear()}`
      : `${due.getMonth() + 1}월 ${due.getDate()}일`;

  const maxUsage = Math.max(...user.usage.map((u) => u.value));

  return (
    <section aria-labelledby="acct-title" className="shell py-9 lg:py-12">
      <h2 id="acct-title" className="text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
        {t("내 이용 현황", "My account")}
      </h2>

      {/* Account + bill */}
      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_1fr] lg:gap-4">
        {/* Current address (dark) */}
        <div className="relative overflow-hidden rounded-[1.25rem] bg-ink-900 p-6 text-white lg:p-7">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full sk-gradient opacity-25 blur-2xl"
          />
          <div className="relative">
            <p className="text-[0.8125rem] text-white/60">
              {t("현재 이용 중인 주소", "Current service address")}
            </p>
            <p className="mt-2 text-xl font-extrabold leading-snug sm:text-2xl">
              {pick(user.address, lang)}
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-white/70">
              <span>
                {t("고객번호", "Customer no.")}{" "}
                <span className="font-semibold text-white/90">{user.customerNo}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
                {pick(user.status, lang)}
              </span>
            </p>
            <Link
              href="/bill/account"
              className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-white px-5 text-[0.875rem] font-bold text-ink-900 transition hover:bg-ink-100"
            >
              {t("계정 관리", "Manage account")} <IconArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* This month's bill (light) */}
        <div className="flex flex-col rounded-[1.25rem] border border-ink-200 bg-white p-6 lg:p-7">
          <p className="text-[0.8125rem] text-ink-500">
            {t("이번 달 예상 요금", "This month's estimate")}
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-[2.25rem]">
            {lang === "en" ? `₩${bill}` : `${bill}원`}
          </p>
          <p className="mt-2 text-[0.8125rem] text-ink-500">
            {t(`납부 예정일 ${dueLabel}`, `Due ${dueLabel}`)}
          </p>
          <Link
            href="/bill"
            className="mt-auto inline-flex items-center gap-1 pt-5 text-[0.875rem] font-bold text-sk-red-600 hover:underline"
          >
            {t("상세 보기", "View details")} <IconArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Usage + in-progress */}
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1.6fr_1fr] lg:gap-4">
        {/* Usage chart */}
        <div className="rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-6">
          <p className="text-[0.8125rem] font-semibold text-ink-500">
            {t("지난 6개월 사용량 (㎥)", "Last 6 months (㎥)")}
          </p>
          <div className="mt-5 flex items-end justify-between gap-2 sm:gap-4" style={{ height: "9rem" }}>
            {user.usage.map((u, i) => {
              const barPx = Math.max(10, Math.round((u.value / maxUsage) * 128));
              const latest = i === user.usage.length - 1;
              return (
                <div key={u.month} className="flex flex-1 flex-col items-center justify-end gap-1.5">
                  <span className={`text-[0.6875rem] font-bold ${latest ? "text-sk-red-600" : "text-ink-400"}`}>
                    {u.value}
                  </span>
                  <div
                    className={`bar-rise w-full max-w-[2.75rem] rounded-lg ${latest ? "sk-gradient" : "bg-ink-200"}`}
                    style={{ height: `${barPx}px`, animationDelay: `${i * 60}ms` }}
                    aria-hidden
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between gap-2 sm:gap-4">
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
          <p className="sr-only">
            {user.usage
              .map((u) => `${lang === "en" ? MONTHS_EN[u.month] : `${u.month}월`}: ${u.value}㎥`)
              .join(", ")}
          </p>
        </div>

        {/* In-progress services */}
        <div className="flex flex-col rounded-[1.25rem] border border-ink-200 bg-white p-5 lg:p-6">
          <p className="text-[0.8125rem] font-semibold text-ink-500">
            {t("진행 중인 서비스", "In progress")}
          </p>
          <p className="mt-2 text-lg font-extrabold text-ink-900">
            {t("예정된 방문 없음", "No scheduled visits")}
          </p>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-500">
            {t(
              "새 신청을 시작하면 이곳에서 예약 시간과 진행 상태를 확인합니다.",
              "Once you start a request, you'll track its booking time and status here.",
            )}
          </p>
          <Link
            href="/move/reservation"
            className="mt-auto inline-flex items-center gap-1 pt-5 text-[0.875rem] font-bold text-sk-red-600 hover:underline"
          >
            {t("신청 내역 보기", "View my requests")} <IconArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
