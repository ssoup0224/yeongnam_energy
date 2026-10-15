"use client";

import Link from "next/link";
import { useState } from "react";
import { pick, useLang, useT, type Bi } from "@/lib/i18n";
import { IconArrowRight } from "./Icons";

type Step = { n: number; label: Bi; desc: Bi; href: string };
type Group = { key: string; tab: Bi; lead: Bi; steps: Step[] };

const GROUPS: Group[] = [
  {
    key: "move",
    tab: { ko: "이사할 때", en: "Moving home" },
    lead: {
      ko: "전출 → 전입 순서로 진행하면 요금 정산이 깔끔합니다.",
      en: "Do move-out first, then move-in, and your billing settles cleanly.",
    },
    steps: [
      { n: 1, label: { ko: "전출신청", en: "Move-out request" }, desc: { ko: "이사 3일 전까지 접수", en: "File 3 days before" }, href: "/move/out" },
      { n: 2, label: { ko: "방문일 확정", en: "Confirm visit" }, desc: { ko: "알림톡으로 일정 확인", en: "Check date by message" }, href: "/move/reservation" },
      { n: 3, label: { ko: "요금 정산", en: "Settle bill" }, desc: { ko: "계량기 지침으로 마감", en: "Closed on the meter reading" }, href: "/bill" },
      { n: 4, label: { ko: "전입신청", en: "Move-in request" }, desc: { ko: "새 주소에서 사용 개시", en: "Start at your new home" }, href: "/move/in" },
    ],
  },
  {
    key: "pay",
    tab: { ko: "요금을 낼 때", en: "Paying a bill" },
    lead: {
      ko: "자동이체와 모바일 청구서를 함께 신청하면 매달 할인됩니다.",
      en: "Combine auto-pay with a mobile bill for a discount every month.",
    },
    steps: [
      { n: 1, label: { ko: "청구요금 확인", en: "Check charges" }, desc: { ko: "고객번호로 조회", en: "Look up by customer no." }, href: "/bill" },
      { n: 2, label: { ko: "납부 방법 선택", en: "Choose method" }, desc: { ko: "카드·계좌·간편결제", en: "Card, bank or easy pay" }, href: "/bill" },
      { n: 3, label: { ko: "자동이체 등록", en: "Set up auto-pay" }, desc: { ko: "매달 자동 납부", en: "Pay automatically each month" }, href: "/bill/auto" },
      { n: 4, label: { ko: "청구서 유형 변경", en: "Change bill type" }, desc: { ko: "종이 → 모바일", en: "Paper → mobile" }, href: "/bill/type" },
    ],
  },
  {
    key: "safety",
    tab: { ko: "가스 냄새가 날 때", en: "If you smell gas" },
    lead: {
      ko: "전기 스위치는 절대 만지지 마세요. 불꽃이 튈 수 있습니다.",
      en: "Never touch electrical switches — a spark could ignite the gas.",
    },
    steps: [
      { n: 1, label: { ko: "밸브 잠그기", en: "Close the valve" }, desc: { ko: "중간밸브·계량기 차단", en: "Mid-valve and meter" }, href: "/safety" },
      { n: 2, label: { ko: "창문 열기", en: "Open windows" }, desc: { ko: "자연 환기로 배출", en: "Ventilate naturally" }, href: "/safety" },
      { n: 3, label: { ko: "전기 만지지 않기", en: "No electrics" }, desc: { ko: "스위치·콘센트 금지", en: "No switches or outlets" }, href: "/safety" },
      { n: 4, label: { ko: "밖에서 신고", en: "Call from outside" }, desc: { ko: "1544-4500 또는 119", en: "1544-4500 or 119" }, href: "/safety/report" },
    ],
  },
  {
    key: "check",
    tab: { ko: "안전점검을 받을 때", en: "Safety inspection" },
    lead: {
      ko: "도시가스사업법상 가구당 연 2회 이상 점검이 의무입니다.",
      en: "By law, each household must be inspected at least twice a year.",
    },
    steps: [
      { n: 1, label: { ko: "SMS 사전안내", en: "SMS notice" }, desc: { ko: "방문 7일 전 발송", en: "Sent 7 days before" }, href: "/safety/sms" },
      { n: 2, label: { ko: "일정 조정", en: "Adjust schedule" }, desc: { ko: "안 맞으면 변경 신청", en: "Reschedule if needed" }, href: "/move/reservation" },
      { n: 3, label: { ko: "점검원 확인", en: "Verify inspector" }, desc: { ko: "신분증 꼭 확인하세요", en: "Always check the ID" }, href: "/safety/inspection" },
      { n: 4, label: { ko: "결과 확인", en: "Check result" }, desc: { ko: "점검 결과지 수령", en: "Receive the report" }, href: "/safety/inspection" },
    ],
  },
];

export default function SituationGuide({ standalone = false }: { standalone?: boolean }) {
  const { lang } = useLang();
  const t = useT();
  const [active, setActive] = useState(0);
  const g = GROUPS[active];

  return (
    <section
      aria-labelledby={standalone ? undefined : "sit-title"}
      aria-label={standalone ? t("상황별 안내", "Guides by situation") : undefined}
      className={standalone ? "" : "shell py-10 lg:py-14"}
    >
      {standalone ? null : (
        <>
          <h2 id="sit-title" className="text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
            {t("이럴 땐 이렇게 하세요", "Here's what to do")}
          </h2>
          <p className="mt-1.5 text-sm text-ink-500">
            {t(
              "메뉴 이름을 몰라도 괜찮습니다. 상황을 고르면 순서대로 안내해 드립니다.",
              "No need to know the menu names — pick your situation and we'll walk you through it.",
            )}
          </p>
        </>
      )}

      <div className={`overflow-hidden rounded-[1.25rem] border border-ink-200 bg-white ${standalone ? "" : "mt-5"}`}>
        {/* Tabs */}
        <div
          role="tablist"
          aria-label={t("상황별 안내", "Guides by situation")}
          className="no-scrollbar flex gap-1 overflow-x-auto border-b border-ink-200 bg-ink-50 p-2"
        >
          {GROUPS.map((item, i) => (
            <button
              key={item.key}
              role="tab"
              type="button"
              id={`sit-tab-${item.key}`}
              aria-selected={active === i}
              aria-controls={`sit-panel-${item.key}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") setActive((active + 1) % GROUPS.length);
                if (e.key === "ArrowLeft") setActive((active - 1 + GROUPS.length) % GROUPS.length);
              }}
              className={`min-h-11 shrink-0 whitespace-nowrap rounded-xl px-4 text-[0.875rem] font-bold transition
                ${active === i ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-white"}`}
            >
              {pick(item.tab, lang)}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`sit-panel-${g.key}`}
          aria-labelledby={`sit-tab-${g.key}`}
          className="p-5 lg:p-7"
        >
          <p className="text-[0.9375rem] font-semibold text-ink-700">{pick(g.lead, lang)}</p>

          <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {g.steps.map((s, i) => (
              <li key={s.n} className="relative">
                <Link
                  href={s.href}
                  className="group flex h-full items-start gap-3 rounded-xl border border-ink-200 bg-white p-4 transition hover:border-sk-red-300 hover:bg-sk-red-50/40"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full sk-gradient text-sm font-extrabold text-white">
                    {s.n}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.9375rem] font-extrabold text-ink-900">{pick(s.label, lang)}</span>
                    <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-500">{pick(s.desc, lang)}</span>
                  </span>
                </Link>
                {i < g.steps.length - 1 ? (
                  <IconArrowRight
                    className="absolute -right-2.5 top-1/2 hidden size-4 -translate-y-1/2 text-ink-300 lg:block"
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
