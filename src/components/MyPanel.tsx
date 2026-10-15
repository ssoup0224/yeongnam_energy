"use client";

import Link from "next/link";
import { SITE } from "@/lib/site";
import { pick, useLang, useT } from "@/lib/i18n";
import { IconAlert, IconArrowRight, IconPhone, IconUser } from "./Icons";

/** Four words per step — the full walkthrough lives on /safety. */
const STEPS = [
  { ko: "밸브 잠그기", en: "Close the valve" },
  { ko: "창문 열기", en: "Open windows" },
  { ko: "전기 만지지 않기", en: "No electrics" },
  { ko: "밖에서 신고", en: "Call from outside" },
];

export default function MyPanel() {
  const { lang } = useLang();
  const t = useT();

  return (
    <section
      aria-labelledby="my-title"
      className="shell grid grid-cols-1 gap-3 py-9 lg:grid-cols-2 lg:py-12"
    >
      {/* Sign-in */}
      <div className="relative overflow-hidden rounded-[1.25rem] border border-ink-200 bg-ink-900 p-6 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-14 -top-14 size-52 rounded-full sk-gradient opacity-25 blur-2xl"
        />
        <div className="relative">
          <h2 id="my-title" className="text-lg font-extrabold">
            {t("로그인하면 이번 달 요금이 바로 보입니다", "Sign in to see this month's bill at a glance")}
          </h2>
          <p className="mt-2 max-w-sm text-[0.875rem] leading-relaxed text-white/70">
            {t(
              "고객번호를 매번 입력하지 않아도 청구서와 납부 내역을 한 화면에서 확인하세요.",
              "No need to type your customer number each time — see your bills and payments in one place.",
            )}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
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
              {t("비회원 조회", "Guest lookup")} <IconArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency */}
      <div className="rounded-[1.25rem] border-2 border-sk-red-200 bg-sk-red-50 p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink-900">
          <IconAlert className="size-5 text-sk-red-500" />
          {t("가스 냄새가 난다면", "If you smell gas")}
        </h2>

        <ol className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {STEPS.map((step, i) => (
            <li key={step.ko} className="flex items-center gap-1.5">
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5">
                <span className="text-[0.6875rem] font-extrabold text-sk-red-600">{i + 1}</span>
                <span className="text-[0.8125rem] font-bold text-ink-800">{pick(step, lang)}</span>
              </span>
              {i < STEPS.length - 1 ? (
                <IconArrowRight className="size-3 shrink-0 text-sk-red-300" />
              ) : null}
            </li>
          ))}
        </ol>

        <a
          href={`tel:${SITE.safetyLine}`}
          className="mt-5 flex min-h-14 items-center justify-center gap-2.5 rounded-xl bg-sk-red-500 px-5 text-lg font-extrabold text-white transition hover:bg-sk-red-600"
        >
          <IconPhone className="size-5" />
          {SITE.safetyLine} {t("신고", "report")}
        </a>
        <Link
          href="/safety"
          className="mt-2 flex min-h-10 items-center justify-center gap-1 text-[0.8125rem] font-bold text-ink-600 hover:text-sk-red-700 hover:underline"
        >
          {t("자세한 안전 행동요령 보기", "See the full safety steps")} <IconArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
