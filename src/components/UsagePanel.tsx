"use client";

import Link from "next/link";
import { useLang, useT } from "@/lib/i18n";
import type { User } from "@/lib/auth";
import { IconArrowRight } from "./Icons";

const MONTHS_EN = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Signed-in usage block: the last-6-months chart plus in-progress services. */
export default function UsagePanel({ user }: { user: User }) {
  const { lang } = useLang();
  const t = useT();
  const maxUsage = Math.max(...user.usage.map((u) => u.value));

  return (
    <section aria-labelledby="usage-title" className="shell py-9 lg:py-12">
      <h2 id="usage-title" className="text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
        {t("내 사용량", "My usage")}
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[1.6fr_1fr] lg:gap-4">
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
