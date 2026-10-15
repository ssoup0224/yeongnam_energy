"use client";

import Link from "next/link";
import { pick, useLang, useT } from "@/lib/i18n";
import {
  IconAutoPay,
  IconBill,
  IconCalculator,
  IconCenter,
  IconMeter,
  IconMoveIn,
  IconMoveOut,
  IconStove,
} from "./Icons";

const SERVICES = [
  { label: { ko: "전입신청", en: "Move-in" }, sub: { ko: "이사 들어올 때", en: "When you move in" }, href: "/move/in", Icon: IconMoveIn },
  { label: { ko: "전출신청", en: "Move-out" }, sub: { ko: "이사 나갈 때", en: "When you move out" }, href: "/move/out", Icon: IconMoveOut },
  { label: { ko: "요금 조회·납부", en: "View & Pay" }, sub: { ko: "이번 달 청구요금", en: "This month's bill" }, href: "/bill", Icon: IconBill },
  { label: { ko: "자동이체 신청", en: "Auto-pay" }, sub: { ko: "은행·카드 납부", en: "Bank or card" }, href: "/bill/auto", Icon: IconAutoPay },
  { label: { ko: "자가검침 입력", en: "Meter Reading" }, sub: { ko: "계량기 지침 등록", en: "Submit your reading" }, href: "/safety/meter", Icon: IconMeter },
  { label: { ko: "실시간 요금계산", en: "Rate Calculator" }, sub: { ko: "사용량으로 계산", en: "Estimate by usage" }, href: "/bill/calculator", Icon: IconCalculator },
  { label: { ko: "가스레인지 교체", en: "Stove Change" }, sub: { ko: "철거·변경 신청", en: "Remove or replace" }, href: "/move/stove", Icon: IconStove },
  { label: { ko: "서비스센터 찾기", en: "Find a Center" }, sub: { ko: "우리 동네 센터", en: "Centers near you" }, href: "/centers", Icon: IconCenter },
];

export default function QuickServices() {
  const { lang } = useLang();
  const t = useT();

  return (
    <section aria-labelledby="quick-title" className="shell py-9 lg:py-12">
      <div className="flex items-end justify-between gap-4">
        <h2 id="quick-title" className="text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          {t("자주 찾는 서비스", "Popular services")}
        </h2>
        <Link
          href="/sitemap"
          className="hidden shrink-0 items-center rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-bold text-ink-700 hover:border-ink-300 sm:inline-flex"
        >
          {t("전체 서비스", "All services")}
        </Link>
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {SERVICES.map(({ label, sub, href, Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-ink-200 bg-white p-4 transition
                         hover:-translate-y-0.5 hover:border-sk-red-300 hover:shadow-[0_14px_30px_-20px_rgba(234,0,44,.6)] lg:p-5"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-ink-50 text-ink-700 transition group-hover:bg-sk-red-500 group-hover:text-white">
                <Icon className="size-6" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.9375rem] font-extrabold leading-snug text-ink-900 lg:text-base">
                  {pick(label, lang)}
                </span>
                <span className="mt-0.5 block text-[0.8125rem] text-ink-500">{pick(sub, lang)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
